import fs from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { fileURLToPath } from 'node:url'

import { resolveDshHome } from './paths.js'
import { StateStore, defaultAssetSettings } from './store.js'
import { serveFile } from './media.js'
import { copyForRelocate, importPaths } from './importer.js'
import { detectFile, kindLabel } from './sniff.js'
import {
  buildStartupInjectionRows,
  buildStartupSnapshot,
  makeRuntimeReader,
} from './startup-inject.js'

export const name = 'background-studio'

export const PREFIX = '/dsh-background-studio'

const MAX_JSON = 8 * 1024 * 1024
const MAX_THUMB = 8 * 1024 * 1024
const ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
/**
 * Renderer-to-Host readiness mailbox for the native main-window gate. Electron
 * can queue renderer IPC while a native splash view covers the main document;
 * same-origin HTTP is not queued and gives the Electron main process a pollable
 * state without exposing window control to the renderer.
 */
const startupWindowStates = new Map()
const STARTUP_WINDOW_PHASES = new Set(['startup-surface-ready', 'startup-first-frame-ready', 'startup-fallback'])

function sendJson(res, status, body) {
  const text = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    'Cache-Control': 'no-store',
  })
  res.end(text)
}

function sendText(res, status, text) {
  res.writeHead(status, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Content-Length': Buffer.byteLength(text),
    'Cache-Control': 'no-store',
  })
  res.end(text)
}

async function readBody(req, limit) {
  const chunks = []
  let size = 0
  for await (const chunk of req) {
    size += chunk.length
    if (size > limit) {
      const error = new Error('body too large')
      error.status = 413
      throw error
    }
    chunks.push(chunk)
  }
  return Buffer.concat(chunks)
}

async function readJson(req) {
  const body = await readBody(req, MAX_JSON)
  if (body.length === 0) return {}
  try {
    return JSON.parse(body.toString('utf8'))
  } catch (error) {
    const failure = new Error(`invalid JSON: ${error instanceof Error ? error.message : String(error)}`)
    failure.status = 400
    throw failure
  }
}

function writeLine(res, value) {
  if (res.writableEnded || res.destroyed) return false
  try {
    res.write(`${JSON.stringify(value)}\n`)
    return true
  } catch {
    return false
  }
}

function createAbortOnClose(res) {
  const controller = new AbortController()
  res.on('close', () => {
    if (!res.writableEnded) controller.abort()
  })
  return controller
}

/**
 * HTTP surface. Media is addressed by library id only — never by an arbitrary
 * path — so the route cannot become a local file-read oracle.
 */
async function handleRequest({ req, res, store, paths, logger, bootId }) {
  const url = new URL(req.url ?? '/', 'http://127.0.0.1')
  const suffix = url.pathname.startsWith(PREFIX) ? url.pathname.slice(PREFIX.length) : url.pathname
  const parts = suffix.split('/').filter((part) => part.length > 0)
  const method = String(req.method ?? 'GET').toUpperCase()

  if (parts.length === 0 || (parts[0] === 'api' && parts[1] === 'health')) {
    sendJson(res, 200, {
      ok: true,
      plugin: 'dsh-background-studio',
      root: paths.root,
      bootId,
      current: new Date().toISOString(),
    })
    return
  }

  if (parts[0] === 'api' && parts[1] === 'startup' && parts[2] === 'window-state') {
    if (method === 'POST') {
      try {
        const body = await readJson(req)
        const session = typeof body?.session === 'string' ? body.session.slice(0, 128) : ''
        const phase = typeof body?.phase === 'string' ? body.phase : ''
        if (!session || !STARTUP_WINDOW_PHASES.has(phase)) {
          sendJson(res, 400, { ok: false, error: 'invalid startup window report' })
          return
        }
        const now = Date.now()
        const current = startupWindowStates.get(session) ?? {
          session,
          mode: body.mode === 'animation-first' ? 'animation-first' : 'fast',
          surfaceAt: 0,
          firstFrameAt: 0,
          fallbackAt: 0,
          updatedAt: 0,
        }
        current.mode = body.mode === 'animation-first' ? 'animation-first' : 'fast'
        if (phase === 'startup-surface-ready' && current.surfaceAt === 0) current.surfaceAt = now
        if (phase === 'startup-first-frame-ready' && current.firstFrameAt === 0) current.firstFrameAt = now
        if (phase === 'startup-fallback' && current.fallbackAt === 0) current.fallbackAt = now
        current.updatedAt = now
        startupWindowStates.set(session, current)
        while (startupWindowStates.size > 8) {
          const oldest = startupWindowStates.keys().next().value
          if (oldest === undefined) break
          startupWindowStates.delete(oldest)
        }
        sendJson(res, 200, { ok: true })
      } catch (error) {
        sendJson(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
      }
      return
    }
    if (method === 'GET') {
      const session = url.searchParams.get('session') ?? ''
      const current = startupWindowStates.get(session)
      sendJson(res, 200, {
        ok: true,
        session,
        mode: current?.mode ?? 'fast',
        surfaceReady: (current?.surfaceAt ?? 0) > 0,
        firstFrameReady: (current?.firstFrameAt ?? 0) > 0,
        fallback: (current?.fallbackAt ?? 0) > 0,
        updatedAt: current?.updatedAt ?? 0,
      })
      return
    }
    sendJson(res, 405, { ok: false, error: 'use GET or POST' })
    return
  }

  if (parts[0] === 'api' && parts[1] === 'startup' && parts[2] === 'mark') {
    if (method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'use POST' })
      return
    }
    try {
      const loaded = await store.load()
      loaded.state.startupAnimation.firstRunDone = true
      const saved = await store.save(loaded.state)
      sendJson(res, 200, { ok: true, firstRunDone: saved.startupAnimation.firstRunDone === true })
    } catch (error) {
      sendJson(res, 500, {
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      })
    }
    return
  }

  if (parts[0] === 'api' && parts[1] === 'state') {
    if (method === 'GET') {
      const loaded = await store.load()
      const checked = await store.revalidate(loaded.state)
      if (checked.changed) {
        try {
          await store.save(checked.state)
        } catch (error) {
          logger?.warn?.(`[background-studio] 保存校验结果失败：${error instanceof Error ? error.message : String(error)}`)
        }
      }
      sendJson(res, 200, {
        ok: true,
        state: checked.state,
        warnings: [...loaded.warnings, ...checked.warnings],
        root: paths.root,
        bootId,
      })
      return
    }
    if (method === 'PUT' || method === 'POST') {
      const body = await readJson(req)
      const candidate = body?.state ?? body
      const saved = await store.save(candidate)
      sendJson(res, 200, { ok: true, state: saved })
      return
    }
    sendJson(res, 405, { ok: false, error: 'use GET, PUT or POST' })
    return
  }

  if (parts[0] === 'api' && parts[1] === 'import') {
    if (method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'use POST' })
      return
    }
    const body = await readJson(req)
    const requested = Array.isArray(body.paths) ? body.paths.filter((entry) => typeof entry === 'string') : []
    if (requested.length === 0) {
      sendJson(res, 400, { ok: false, error: 'paths 不能为空' })
      return
    }
    const mode = body.mode === 'copy' ? 'copy' : 'reference'
    const expected = body.kind === 'audio' ? 'audio' : 'media'
    const loaded = await store.load()
    const state = loaded.state

    res.writeHead(200, {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    })
    res.flushHeaders?.()
    const controller = createAbortOnClose(res)

    try {
      const result = await importPaths({
        state,
        paths: requested,
        mode,
        expected,
        mediaDir: paths.media,
        signal: controller.signal,
        onProgress: (event) => writeLine(res, event),
      })
      try {
        await store.save(state)
      } catch (error) {
        writeLine(res, {
          type: 'warning',
          message: `导入已写入会话，但保存状态失败：${error instanceof Error ? error.message : String(error)}`,
        })
      }
      writeLine(res, { type: 'done', created: result.created, errors: result.errors })
      res.end()
    } catch (error) {
      logger?.warn?.(`[background-studio] 导入失败：${error instanceof Error ? error.message : String(error)}`)
      writeLine(res, { type: 'fatal', error: error instanceof Error ? error.message : String(error) })
      res.end()
    }
    return
  }

  if (parts[0] === 'api' && parts[1] === 'relocate') {
    if (method !== 'POST') {
      sendJson(res, 405, { ok: false, error: 'use POST' })
      return
    }
    const body = await readJson(req)
    const id = typeof body.id === 'string' ? body.id : ''
    const nextPath = typeof body.path === 'string' ? path.resolve(body.path) : ''
    if (!ID_PATTERN.test(id) || nextPath.length === 0) {
      sendJson(res, 400, { ok: false, error: 'id/path 无效' })
      return
    }
    const loaded = await store.load()
    const state = loaded.state
    const asset = state.assets.find((entry) => entry.id === id)
    const track = state.audio.find((entry) => entry.id === id)
    const record = asset ?? track
    if (record === undefined) {
      sendJson(res, 404, { ok: false, error: '素材不存在' })
      return
    }
    const detected = await detectFile(nextPath)
    if (detected === null) {
      sendJson(res, 400, { ok: false, error: '无法识别新文件' })
      return
    }
    const wantsAudio = track !== undefined
    if (wantsAudio && detected.kind !== 'audio') {
      sendJson(res, 400, { ok: false, error: '重新定位的文件不是音频' })
      return
    }
    if (!wantsAudio && detected.kind === 'audio') {
      sendJson(res, 400, { ok: false, error: '重新定位的文件是音频，不是背景' })
      return
    }

    let storedPath = nextPath
    let stat = await fs.stat(nextPath)
    if (record.storage === 'copy') {
      const copied = await copyForRelocate({
        state,
        mediaDir: paths.media,
        absolutePath: nextPath,
        ext: detected.ext,
        id: record.id,
      })
      storedPath = copied.destination
      stat = copied.stat
    }

    record.path = storedPath
    record.sourcePath = record.storage === 'copy' ? nextPath : null
    record.ext = detected.ext
    record.mime = detected.mime
    record.size = stat.size
    record.mtimeMs = stat.mtimeMs
    record.missing = false
    if (asset !== undefined) {
      asset.kind = detected.kind
      asset.animated = detected.animated
      asset.width = 0
      asset.height = 0
      asset.duration = 0
      asset.fps = 0
      asset.hasAudio = null
      asset.thumb = false
      asset.thumbVersion = 0
      asset.probeError = null
    }
    await store.save(state)
    sendJson(res, 200, { ok: true, record })
    return
  }

  if (parts[0] === 'api' && parts[1] === 'thumb') {
    if (method !== 'POST' && method !== 'PUT') {
      sendJson(res, 405, { ok: false, error: 'use POST' })
      return
    }
    const body = await readBody(req, MAX_THUMB)
    const id = url.searchParams.get('id') ?? ''
    if (!ID_PATTERN.test(id)) {
      sendJson(res, 400, { ok: false, error: 'id 无效' })
      return
    }
    const loaded = await store.load()
    if (!loaded.state.assets.some((entry) => entry.id === id)) {
      sendJson(res, 404, { ok: false, error: '素材不存在' })
      return
    }
    if (body.length === 0) {
      sendJson(res, 400, { ok: false, error: '空缩略图' })
      return
    }
    const target = path.join(paths.thumbs, `${id}.webp`)
    await fs.writeFile(target, body)
    sendJson(res, 200, { ok: true, version: Date.now() })
    return
  }

  if (parts[0] === 'thumb' && parts.length === 2) {
    const id = parts[1]
    if (!ID_PATTERN.test(id)) {
      sendText(res, 404, 'not found')
      return
    }
    const target = path.join(paths.thumbs, `${id}.webp`)
    serveFile(req, res, target)
    return
  }

  if ((parts[0] === 'media' || parts[0] === 'audio') && parts.length === 2) {
    const id = parts[1]
    if (!ID_PATTERN.test(id)) {
      sendText(res, 404, 'not found')
      return
    }
    const loaded = await store.load()
    const list = parts[0] === 'audio' ? loaded.state.audio : loaded.state.assets
    const record = list.find((entry) => entry.id === id)
    if (record === undefined) {
      sendText(res, 404, 'not found')
      return
    }
    serveFile(req, res, record.path)
    return
  }

  sendJson(res, 404, { ok: false, error: 'not found' })
}

export function apply(ctx) {
  let store
  try {
    store = new StateStore(resolveDshHome())
  } catch (error) {
    ctx.logger?.warn?.(`[background-studio] 初始化失败：${error instanceof Error ? error.message : String(error)}`)
    return
  }
  const paths = store.paths
  const logger = ctx.logger
  const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
  const readRuntime = makeRuntimeReader(packageRoot)
  // One random id per Host process. The Client uses it to distinguish a real
  // DSH relaunch from a page reload; sessionStorage alone survives reloads but
  // cannot tell whether the Host process itself was restarted.
  const bootId = randomUUID()

  // MUST be registered synchronously, before any ctx.inject / service wait.
  // The desktop boot payload collects the index injection table early; a late
  // listener contributes nothing and the overlay would only appear after the
  // normal client bundle mounts (the exact bug this path fixes).
  ctx.on?.('webserver/index-inject', (table) => {
    if (!Array.isArray(table)) return
    try {
      const snapshot = buildStartupSnapshot({
        statePath: paths.state,
        bootId,
        prefix: PREFIX,
        version: '0.2.2',
      })
      table.push(...buildStartupInjectionRows(
        snapshot,
        readRuntime('startup-boot.css'),
        readRuntime('startup-boot.js'),
      ))
    } catch (error) {
      // A broken injection must never make the index fail. The normal client
      // still has its own (late) startup fallback.
      logger?.warn?.(`[background-studio] 启动注入生成失败：${error instanceof Error ? error.message : String(error)}`)
    }
  })

  ctx.inject(['webServer'], (child) => {
    child.effect(() => {
      const dispose = child.webServer.register({
        kind: 'prefix',
        path: PREFIX,
        handler: (req, res) => {
          handleRequest({ req, res, store, paths, logger, bootId }).catch((error) => {
            const status = typeof error?.status === 'number' ? error.status : 500
            logger?.warn?.(`[background-studio] 请求失败：${error instanceof Error ? error.message : String(error)}`)
            if (!res.headersSent) sendJson(res, status, { ok: false, error: error instanceof Error ? error.message : String(error) })
            else if (!res.writableEnded) res.end()
          })
        },
      })
      logger?.info?.(`[background-studio] 已挂载 ${PREFIX}（数据目录：${paths.root}）`)
      return () => {
        try {
          dispose()
        } catch {
          /* already disposed */
        }
      }
    })
  })
}

/** Utility used by tests; not part of the plugin contract. */
export function makeState() {
  return {
    assets: [],
    audio: [],
    assetSettings: {},
    playlists: [],
    global: {},
    runtime: {},
  }
}

export { defaultAssetSettings, kindLabel, randomUUID }
