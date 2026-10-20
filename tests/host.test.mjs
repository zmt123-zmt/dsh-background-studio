import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import http from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { after, before, test } from 'node:test'

import { apply, PREFIX } from '../lib/host/apply.js'

const PNG_1X1 = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nQAAAABJRU5ErkJggg==',
  'base64',
)
const GIF_1X1 = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')
const MP3 = Buffer.concat([Buffer.from('ID3'), Buffer.alloc(256)])
const WAV = Buffer.concat([
  Buffer.from('RIFF'),
  Buffer.alloc(4),
  Buffer.from('WAVEfmt '),
  Buffer.alloc(64),
])

let home
let sourceDir
let server
let base
const registered = []
const injectionListeners = []

function makeContext() {
  return {
    logger: { info() {}, warn() {} },
    on(event, callback) {
      if (event === 'webserver/index-inject') injectionListeners.push(callback)
    },
    inject(names, callback) {
      assert.deepEqual(names, ['webServer'])
      callback({
        effect(fn) {
          fn()
        },
        webServer: {
          register(route) {
            registered.push(route)
            return () => {}
          },
        },
      })
    },
  }
}

async function json(url, options) {
  const response = await fetch(`${base}${url}`, options)
  const text = await response.text()
  return { status: response.status, body: text.length > 0 ? JSON.parse(text) : null, headers: response.headers }
}

async function importFiles(paths, kind = 'media', mode = 'reference') {
  const response = await fetch(`${base}${PREFIX}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths, kind, mode }),
  })
  assert.equal(response.status, 200)
  const text = await response.text()
  return text
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
}

before(async () => {
  home = await fs.mkdtemp(path.join(os.tmpdir(), 'dbs-home-'))
  sourceDir = await fs.mkdtemp(path.join(os.tmpdir(), 'dbs-src-'))
  process.env.DSH_HOME = home
  await fs.writeFile(path.join(sourceDir, 'picture.png'), PNG_1X1)
  await fs.writeFile(path.join(sourceDir, 'animation.gif'), GIF_1X1)
  await fs.writeFile(path.join(sourceDir, 'sound.mp3'), MP3)
  await fs.writeFile(path.join(sourceDir, 'sound.wav'), WAV)

  apply(makeContext())
  const route = registered.find((entry) => entry.path === PREFIX)
  assert.ok(route, 'prefix route registered')
  server = http.createServer((req, res) => route.handler(req, res))
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  await new Promise((resolve) => server.close(resolve))
  await fs.rm(home, { recursive: true, force: true })
  await fs.rm(sourceDir, { recursive: true, force: true })
  delete process.env.DSH_HOME
})

test('health and empty state', async () => {
  const health = await json(`${PREFIX}/api/health`)
  assert.equal(health.status, 200)
  assert.equal(health.body.ok, true)
  assert.ok(typeof health.body.bootId === 'string' && health.body.bootId.length > 0)

  const state = await json(`${PREFIX}/api/state`)
  assert.equal(state.status, 200)
  assert.equal(state.body.bootId, health.body.bootId)
  assert.deepEqual(state.body.state.assets, [])
  assert.equal(state.body.state.global.defaultDwellSeconds, 30)
  assert.equal(state.body.state.startupAnimation.enabled, false)
  assert.equal(state.body.state.startupAnimation.mode, 'fullscreen')
  assert.equal(state.body.state.startupAnimation.trigger, 'everyLaunch')
  assert.equal(state.body.state.startupDisplayMode, 'fast')

  const invalidMode = { ...state.body.state, startupDisplayMode: 'not-a-mode' }
  const saved = await json(`${PREFIX}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(invalidMode),
  })
  assert.equal(saved.status, 200)
  const normalized = await json(`${PREFIX}/api/state`)
  assert.equal(normalized.body.state.startupDisplayMode, 'fast')
})

test('startup animation settings survive the state round-trip', async () => {
  const current = await json(`${PREFIX}/api/state`)
  const state = current.body.state
  state.startupAnimation = {
    enabled: true,
    mode: 'background',
    trigger: 'random',
    items: [{ id: 'boot-1', assetId: '00000000-0000-4000-8000-000000000000', enabled: true }],
    durationMode: 'custom',
    customSeconds: 3.5,
    display: 'contain',
    fadeInMs: 120,
    fadeOutMs: 340,
    holdMs: 500,
    skip: false,
    audio: { mode: 'mute', audioId: null, volume: 0.42 },
    firstRunDone: true,
  }
  state.startupDisplayMode = 'animation-first'
  const saved = await json(`${PREFIX}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  assert.equal(saved.status, 200)
  const again = await json(`${PREFIX}/api/state`)
  assert.equal(again.body.state.startupAnimation.enabled, true)
  assert.equal(again.body.state.startupAnimation.mode, 'background')
  assert.equal(again.body.state.startupAnimation.trigger, 'random')
  assert.equal(again.body.state.startupAnimation.items[0].id, 'boot-1')
  assert.equal(again.body.state.startupAnimation.customSeconds, 3.5)
  assert.equal(again.body.state.startupAnimation.audio.mode, 'mute')
  assert.equal(again.body.state.startupAnimation.firstRunDone, true)
  assert.equal(again.body.state.startupDisplayMode, 'animation-first')
})

test('reference import, media range and state persistence', async () => {
  const lines = await importFiles([path.join(sourceDir, 'picture.png')])
  const done = lines.at(-1)
  assert.equal(done.type, 'done')
  assert.equal(done.created.length, 1)
  assert.equal(done.created[0].storage, 'reference')
  const assetId = done.created[0].id

  const full = await fetch(`${base}${PREFIX}/media/${assetId}`)
  assert.equal(full.status, 200)
  assert.equal(full.headers.get('content-type'), 'image/png')
  assert.equal((await full.arrayBuffer()).byteLength, PNG_1X1.length)

  const range = await fetch(`${base}${PREFIX}/media/${assetId}`, { headers: { Range: 'bytes=0-7' } })
  assert.equal(range.status, 206)
  assert.equal(range.headers.get('content-range'), `bytes 0-7/${PNG_1X1.length}`)
  assert.equal((await range.arrayBuffer()).byteLength, 8)

  const badRange = await fetch(`${base}${PREFIX}/media/${assetId}`, { headers: { Range: 'bytes=9999-10000' } })
  assert.equal(badRange.status, 416)

  const state = await json(`${PREFIX}/api/state`)
  assert.equal(state.body.state.assets.length, 1)
  assert.equal(state.body.state.assets[0].id, assetId)
  assert.ok(state.body.state.assetSettings[assetId])

  const changed = state.body.state
  changed.global.defaultDwellSeconds = 42
  const saved = await json(`${PREFIX}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(changed),
  })
  assert.equal(saved.status, 200)
  const again = await json(`${PREFIX}/api/state`)
  assert.equal(again.body.state.global.defaultDwellSeconds, 42)
})

test('index injection carries startup config and media URLs', async () => {
  const gifImport = await importFiles([path.join(sourceDir, 'animation.gif')])
  const gif = gifImport.at(-1).created[0]
  assert.equal(gif.kind, 'gif')
  const current = await json(`${PREFIX}/api/state`)
  const state = current.body.state
  const asset = state.assets.find((entry) => entry.id === gif.id)
  assert.ok(asset, 'gif asset is available')
  state.startupDisplayMode = 'fast'
  state.startupAnimation = {
    enabled: true,
    mode: 'background',
    trigger: 'everyLaunch',
    items: [{ id: 'inject-item', assetId: asset.id, enabled: true }],
    durationMode: 'custom',
    customSeconds: 2,
    display: 'cover',
    fadeInMs: 100,
    fadeOutMs: 200,
    holdMs: 0,
    skip: true,
    audio: { mode: 'mute', audioId: null, volume: 1 },
    firstRunDone: false,
  }
  const saved = await json(`${PREFIX}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
  assert.equal(saved.status, 200)
  assert.ok(injectionListeners.length > 0, 'index injection listener registered synchronously')
  const table = []
  for (const listener of injectionListeners) listener(table)
  assert.equal(table.length, 3)
  assert.equal(table[0].kind, 'global')
  assert.equal(table[0].name, '__DBS_STARTUP_WINDOW__')
  assert.equal(table[0].value.enabled, true)
  assert.equal(table[0].value.mode, 'fast')
  assert.equal(table[1].kind, 'style')
  assert.equal(table[2].kind, 'script')
  assert.equal(table[2].placement, 'body')
  assert.ok(table[2].text.includes('__DBS_BOOT__'))
  assert.ok(table[2].text.includes(`/dsh-background-studio/media/${asset.id}`))
  assert.ok(table[2].text.includes('"shouldPlay":true'))
  assert.ok(table[2].text.includes('"displayMode":"fast"'))
  assert.ok(!table[2].text.includes('script-src'))
  assert.ok(!table[2].text.includes('</script'))

  const marked = await json(`${PREFIX}/api/startup/mark`, { method: 'POST' })
  assert.equal(marked.status, 200)
  assert.equal(marked.body.firstRunDone, true)
})

test('copy mode survives deleting the original and reports progress', async () => {
  const second = path.join(sourceDir, 'copy-me.gif')
  await fs.writeFile(second, GIF_1X1)
  const lines = await importFiles([second], 'media', 'copy')
  const progress = lines.filter((line) => line.type === 'file' && line.phase === 'progress')
  assert.ok(progress.length >= 1)
  const done = lines.at(-1)
  const record = done.created[0]
  assert.equal(record.storage, 'copy')
  assert.ok(record.path.startsWith(path.join(home, 'background-studio', 'media')))

  await fs.rm(second)
  const served = await fetch(`${base}${PREFIX}/media/${record.id}`)
  assert.equal(served.status, 200)

  const state = await json(`${PREFIX}/api/state`)
  const stored = state.body.state.assets.find((entry) => entry.id === record.id)
  assert.equal(stored.missing, false)
})

test('audio import and thumbnails', async () => {
  const lines = await importFiles([path.join(sourceDir, 'sound.mp3')], 'audio', 'reference')
  const done = lines.at(-1)
  assert.equal(done.created[0].id.length, 36)

  const state = await json(`${PREFIX}/api/state`)
  const assetId = state.body.state.assets[0].id
  const upload = await fetch(`${base}${PREFIX}/api/thumb?id=${assetId}`, { method: 'POST', body: Buffer.from('webp') })
  assert.equal(upload.status, 200)
  const thumb = await fetch(`${base}${PREFIX}/thumb/${assetId}`)
  assert.equal(thumb.status, 200)
  assert.equal(await thumb.text(), 'webp')
})

test('missing files are flagged and can be relocated', async () => {
  const missingSource = path.join(sourceDir, 'missing.png')
  await fs.writeFile(missingSource, PNG_1X1)
  const lines = await importFiles([missingSource])
  const record = lines.at(-1).created[0]
  await fs.rm(missingSource)
  const missingState = await json(`${PREFIX}/api/state`)
  assert.equal(missingState.body.state.assets.find((entry) => entry.id === record.id).missing, true)

  const replacement = path.join(sourceDir, 'replacement.png')
  await fs.writeFile(replacement, PNG_1X1)
  const relocated = await json(`${PREFIX}/api/relocate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: record.id, path: replacement }),
  })
  assert.equal(relocated.status, 200)
  assert.equal(relocated.body.record.missing, false)
  assert.equal(relocated.body.record.path, replacement)
})

test('routes are id-only and reject traversal', async () => {
  const traversal = await fetch(`${base}${PREFIX}/media/..%2F..%2Fstate.json`)
  assert.equal(traversal.status, 404)
  const random = await fetch(`${base}${PREFIX}/media/00000000-0000-4000-8000-000000000000`)
  assert.equal(random.status, 404)
  const unknownThumb = await fetch(`${base}${PREFIX}/thumb/..%2Fstate.json`)
  assert.equal(unknownThumb.status, 404)
})

test('invalid JSON and empty imports are rejected cleanly', async () => {
  const bad = await fetch(`${base}${PREFIX}/api/state`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: '{not json',
  })
  assert.equal(bad.status, 400)

  const empty = await json(`${PREFIX}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths: [], mode: 'reference', kind: 'media' }),
  })
  assert.equal(empty.status, 400)
})
