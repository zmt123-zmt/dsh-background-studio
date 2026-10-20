import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

import { detectFile, isAudioExtension, isBackgroundExtension, kindLabel } from './sniff.js'
import { defaultAssetSettings } from './store.js'

const CHUNK = 1024 * 1024

function sanitizeName(name) {
  const cleaned = name
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '_')
    .replace(/^[.\s]+|[.\s]+$/g, '')
    .slice(0, 60)
  return cleaned.length > 0 ? cleaned : 'media'
}

async function uniquePath(directory, base, ext) {
  let candidate = path.join(directory, `${base}${ext}`)
  for (let index = 1; index < 1000; index += 1) {
    try {
      await fsp.access(candidate)
      candidate = path.join(directory, `${base}-${index}${ext}`)
    } catch {
      return candidate
    }
  }
  return path.join(directory, `${base}-${Date.now()}${ext}`)
}

async function copyWithProgress(source, destination, total, onProgress, signal) {
  const input = await fsp.open(source, 'r')
  const output = await fsp.open(destination, 'w')
  const buffer = Buffer.allocUnsafe(CHUNK)
  let copied = 0
  try {
    while (copied < total) {
      if (signal?.aborted) throw new Error('已取消')
      const { bytesRead } = await input.read(buffer, 0, Math.min(CHUNK, total - copied), copied)
      if (bytesRead === 0) break
      await output.write(buffer, 0, bytesRead)
      copied += bytesRead
      onProgress(copied, total)
    }
  } catch (error) {
    try {
      await output.close()
    } catch {
      /* ignore */
    }
    try {
      await fsp.unlink(destination)
    } catch {
      /* ignore */
    }
    throw error
  } finally {
    try {
      await input.close()
    } catch {
      /* ignore */
    }
    try {
      await output.close()
    } catch {
      /* ignore */
    }
  }
  return copied
}

function normalizedPath(value) {
  const resolved = path.resolve(value)
  return process.platform === 'win32' ? resolved.toLowerCase() : resolved
}

function findExisting(state, absolutePath, expected) {
  const key = normalizedPath(absolutePath)
  const list = expected === 'audio' ? state.audio : state.assets
  return list.find((entry) => {
    const original = entry.storage === 'copy' ? entry.sourcePath : entry.path
    return typeof original === 'string' && normalizedPath(original) === key
  })
}

/**
 * Import one or more user-picked files into the library.
 *
 * `mode: 'reference'` keeps the original path; `mode: 'copy'` copies into the
 * managed media directory. The original file is only ever read, never written.
 */
export async function importPaths({
  state,
  paths,
  mode,
  expected,
  mediaDir,
  onProgress,
  signal,
}) {
  const created = []
  const errors = []
  const copyMode = mode === 'copy'

  for (const rawPath of paths) {
    if (signal?.aborted) break
    const absolutePath = typeof rawPath === 'string' ? path.resolve(rawPath) : ''
    const displayName = absolutePath.length > 0 ? path.basename(absolutePath) : String(rawPath)
    try {
      if (absolutePath.length === 0) throw new Error('路径为空')
      const stat = await fsp.stat(absolutePath)
      if (!stat.isFile()) throw new Error('不是普通文件')

      const detected = await detectFile(absolutePath)
      if (detected === null) throw new Error('无法识别的文件格式')
      if (expected === 'audio' && detected.kind !== 'audio') {
        throw new Error(`这是${kindLabel(detected.kind)}，不能作为音频导入`)
      }
      if (expected === 'media' && detected.kind === 'audio') {
        throw new Error('这是音频，请到「音频管理」中导入')
      }
      if (expected === 'media' && !isBackgroundExtension(detected.ext)) {
        throw new Error(`不支持的背景格式：${detected.ext}`)
      }
      if (expected === 'audio' && !isAudioExtension(detected.ext)) {
        throw new Error(`不支持的音频格式：${detected.ext}`)
      }

      const existing = findExisting(state, absolutePath, expected)
      if (existing !== undefined) {
        onProgress({ type: 'file', phase: 'duplicate', path: absolutePath, name: existing.name, id: existing.id })
        continue
      }

      const id = randomUUID()
      const baseName = sanitizeName(path.basename(absolutePath, detected.ext))
      let storedPath = absolutePath
      let copied = 0

      if (copyMode) {
        const destination = await uniquePath(mediaDir, `${id.slice(0, 8)}-${baseName}`, detected.ext)
        onProgress({ type: 'file', phase: 'start', path: absolutePath, name: displayName, id, total: stat.size })
        copied = await copyWithProgress(
          absolutePath,
          destination,
          stat.size,
          (done, total) => onProgress({
            type: 'file',
            phase: 'progress',
            path: absolutePath,
            name: displayName,
            id,
            copied: done,
            total,
          }),
          signal,
        )
        storedPath = destination
      }

      const stamp = new Date().toISOString()
      if (expected === 'audio') {
        const record = {
          id,
          name: path.basename(absolutePath, detected.ext),
          path: storedPath,
          sourcePath: copyMode ? absolutePath : null,
          storage: copyMode ? 'copy' : 'reference',
          ext: detected.ext,
          mime: detected.mime,
          size: stat.size,
          mtimeMs: stat.mtimeMs,
          duration: 0,
          missing: false,
          importedAt: stamp,
          lastUsedAt: '',
        }
        state.audio.push(record)
        created.push(record)
      } else {
        const record = {
          id,
          name: path.basename(absolutePath, detected.ext),
          kind: detected.kind,
          path: storedPath,
          sourcePath: copyMode ? absolutePath : null,
          storage: copyMode ? 'copy' : 'reference',
          ext: detected.ext,
          mime: detected.mime,
          size: stat.size,
          mtimeMs: stat.mtimeMs,
          width: 0,
          height: 0,
          duration: 0,
          fps: 0,
          hasAudio: null,
          animated: detected.animated,
          missing: false,
          favorite: false,
          thumb: false,
          thumbVersion: 0,
          importedAt: stamp,
          lastUsedAt: '',
          probeError: null,
        }
        state.assets.push(record)
        state.assetSettings[id] = defaultAssetSettings(detected.kind)
        created.push(record)
      }

      onProgress({
        type: 'file',
        phase: 'done',
        path: absolutePath,
        name: path.basename(absolutePath),
        id,
        copied: copyMode ? copied : stat.size,
        total: stat.size,
        record: created[created.length - 1],
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      errors.push({ path: rawPath, name: displayName, error: message })
      onProgress({ type: 'file', phase: 'error', path: rawPath, name: displayName, error: message })
    }
  }

  return { created, errors }
}

/** Copy a relocated source into the managed directory when the record is in copy mode. */
export async function copyForRelocate({ state, mediaDir, absolutePath, ext, id, onProgress, signal }) {
  const stat = await fsp.stat(absolutePath)
  const baseName = sanitizeName(path.basename(absolutePath, ext))
  const destination = await uniquePath(mediaDir, `${id.slice(0, 8)}-${baseName}`, ext)
  await copyWithProgress(absolutePath, destination, stat.size, (done, total) => onProgress?.({ copied: done, total }), signal)
  return { destination, stat }
}

/** Existence helper that never throws. */
export function existsSync(filePath) {
  try {
    return fs.existsSync(filePath)
  } catch {
    return false
  }
}
