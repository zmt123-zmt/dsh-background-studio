import fs from 'node:fs/promises'
import path from 'node:path'

import { studioPaths } from './paths.js'

export const SCHEMA_VERSION = 1

/** Default per-background settings. Kept in sync with the browser half. */
export function defaultAssetSettings(kind) {
  return {
    opacity: 1,
    display: 'cover',
    scale: 1,
    loop: true,
    audioMode: kind === 'video' ? 'video' : 'mute',
    audioId: null,
    audioIds: [],
    audioIndex: 0,
    audioVolume: 1,
    videoVolume: 1,
    audioLoop: true,
    audioStartMs: 0,
    audioEndAction: 'none',
    fadeMs: 420,
    dwellMode: 'default',
    dwellSeconds: 30,
  }
}

/** Default startup-animation configuration; old states receive this shape. */
export function defaultStartupAnimation() {
  return {
    enabled: false,
    mode: 'fullscreen',
    trigger: 'everyLaunch',
    items: [],
    durationMode: 'media',
    customSeconds: 8,
    display: 'cover',
    fadeInMs: 500,
    fadeOutMs: 700,
    holdMs: 0,
    skip: true,
    audio: { mode: 'video', audioId: null, volume: 1 },
    firstRunDone: false,
  }
}

/** A fresh library; the first run starts empty rather than guessing media. */
export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    assets: [],
    audio: [],
    assetSettings: {},
    playlists: [],
    startupAnimation: defaultStartupAnimation(),
    startupDisplayMode: 'fast',
    global: {
      defaultDwellSeconds: 30,
      importMode: 'reference',
      surface: { dark: 0.34, light: 0.62 },
      startup: { restore: true, autoPlay: true },
      audio: { muted: false, masterVolume: 1 },
      fadeMs: 420,
      libraryView: 'grid',
    },
    runtime: {
      mode: 'single',
      assetId: null,
      playlistId: null,
      itemIndex: 0,
      playing: false,
      updatedAt: 0,
    },
  }
}

const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const number = (value, fallback) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback)
const text = (value, fallback = '') => (typeof value === 'string' ? value : fallback)
const record = (value) => (typeof value === 'object' && value !== null && !Array.isArray(value) ? value : null)

function normalizeStartupAnimation(raw) {
  const base = defaultStartupAnimation()
  const value = record(raw)
  if (value === null) return base
  const items = []
  const seen = new Set()
  const source = Array.isArray(value.items) ? value.items : []
  for (let index = 0; index < source.length; index += 1) {
    const item = record(source[index])
    if (item === null) continue
    const assetId = text(item.assetId)
    if (assetId.length === 0) continue
    const id = text(item.id) || `${assetId}-${index}`
    if (seen.has(id)) continue
    seen.add(id)
    items.push({ id, assetId, enabled: item.enabled !== false })
  }
  const audio = record(value.audio) ?? {}
  const modes = new Set(['video', 'mute', 'external'])
  return {
    enabled: value.enabled === true,
    mode: value.mode === 'background' ? 'background' : 'fullscreen',
    trigger: ['everyLaunch', 'firstLaunch', 'random'].includes(value.trigger) ? value.trigger : 'everyLaunch',
    items,
    durationMode: value.durationMode === 'custom' ? 'custom' : 'media',
    customSeconds: clamp(number(value.customSeconds, base.customSeconds), 1, 300),
    display: ['cover', 'contain', 'center'].includes(value.display) ? value.display : 'cover',
    fadeInMs: clamp(number(value.fadeInMs, base.fadeInMs), 0, 5000),
    fadeOutMs: clamp(number(value.fadeOutMs, base.fadeOutMs), 0, 5000),
    holdMs: clamp(number(value.holdMs, base.holdMs), 0, 10000),
    skip: value.skip !== false,
    audio: {
      mode: modes.has(audio.mode) ? audio.mode : base.audio.mode,
      audioId: text(audio.audioId) || null,
      volume: clamp(number(audio.volume, 1), 0, 1),
    },
    firstRunDone: value.firstRunDone === true,
  }
}

/** Coerce one asset record without trusting the on-disk shape. */
function normalizeAsset(raw) {
  const value = record(raw)
  if (value === null) return null
  const id = text(value.id)
  const filePath = text(value.path)
  if (id.length === 0 || filePath.length === 0) return null
  const kind = ['image', 'gif', 'video'].includes(value.kind) ? value.kind : 'image'
  return {
    id,
    name: text(value.name, path.basename(filePath)),
    kind,
    path: filePath,
    sourcePath: text(value.sourcePath) || null,
    storage: value.storage === 'copy' ? 'copy' : 'reference',
    ext: text(value.ext, path.extname(filePath).toLowerCase()),
    mime: text(value.mime),
    size: number(value.size, 0),
    mtimeMs: number(value.mtimeMs, 0),
    width: number(value.width, 0),
    height: number(value.height, 0),
    duration: number(value.duration, 0),
    fps: number(value.fps, 0),
    hasAudio: value.hasAudio === true ? true : value.hasAudio === false ? false : null,
    animated: value.animated === true,
    missing: value.missing === true,
    favorite: value.favorite === true,
    thumb: value.thumb === true,
    thumbVersion: number(value.thumbVersion, 0),
    importedAt: text(value.importedAt, new Date(0).toISOString()),
    lastUsedAt: text(value.lastUsedAt, ''),
    probeError: text(value.probeError) || null,
  }
}

/** Coerce one audio record. */
function normalizeAudio(raw) {
  const value = record(raw)
  if (value === null) return null
  const id = text(value.id)
  const filePath = text(value.path)
  if (id.length === 0 || filePath.length === 0) return null
  return {
    id,
    name: text(value.name, path.basename(filePath)),
    path: filePath,
    sourcePath: text(value.sourcePath) || null,
    storage: value.storage === 'copy' ? 'copy' : 'reference',
    ext: text(value.ext, path.extname(filePath).toLowerCase()),
    mime: text(value.mime),
    size: number(value.size, 0),
    mtimeMs: number(value.mtimeMs, 0),
    duration: number(value.duration, 0),
    missing: value.missing === true,
    importedAt: text(value.importedAt, new Date(0).toISOString()),
    lastUsedAt: text(value.lastUsedAt, ''),
    probeError: text(value.probeError) || null,
  }
}

/** Merge persisted user settings over the defaults field by field. */
function normalizeSettings(raw, kind) {
  const base = defaultAssetSettings(kind)
  const value = record(raw)
  if (value === null) return base
  const modes = new Set(['video', 'external', 'mix', 'mute'])
  const displays = new Set(['cover', 'contain', 'center', 'original', 'custom'])
  const dwellModes = new Set(['default', 'fixed', 'mediaEnd'])
  const audioIds = Array.isArray(value.audioIds)
    ? Array.from(new Set(value.audioIds.filter((entry) => typeof entry === 'string' && entry.length > 0)))
    : []
  const legacyAudioId = text(value.audioId) || null
  if (legacyAudioId && !audioIds.includes(legacyAudioId)) audioIds.unshift(legacyAudioId)
  const audioIndex = Math.min(Math.max(0, Math.trunc(number(value.audioIndex, 0))), Math.max(0, audioIds.length - 1))
  return {
    opacity: clamp(number(value.opacity, base.opacity), 0, 1),
    display: displays.has(value.display) ? value.display : base.display,
    scale: clamp(number(value.scale, 1), 0.1, 4),
    loop: value.loop !== false,
    audioMode: modes.has(value.audioMode) ? value.audioMode : base.audioMode,
    audioId: audioIds[audioIndex] ?? legacyAudioId,
    audioIds,
    audioIndex,
    audioVolume: clamp(number(value.audioVolume, 1), 0, 1),
    videoVolume: clamp(number(value.videoVolume, 1), 0, 1),
    audioLoop: value.audioLoop !== false,
    audioStartMs: clamp(number(value.audioStartMs, 0), 0, 24 * 60 * 60 * 1000),
    audioEndAction: value.audioEndAction === 'next' ? 'next' : value.audioEndAction === 'nextTrack' && audioIds.length > 1 ? 'nextTrack' : 'none',
    fadeMs: clamp(number(value.fadeMs, 420), 0, 5000),
    dwellMode: dwellModes.has(value.dwellMode) ? value.dwellMode : 'default',
    dwellSeconds: clamp(number(value.dwellSeconds, 30), 1, 24 * 60 * 60),
  }
}

function normalizePlaylist(raw) {
  const value = record(raw)
  if (value === null) return null
  const id = text(value.id)
  if (id.length === 0) return null
  const items = Array.isArray(value.items) ? value.items : []
  return {
    id,
    name: text(value.name, '未命名轮播'),
    items: items
      .map((item) => {
        const entry = record(item)
        if (entry === null) return null
        const assetId = text(entry.assetId)
        if (assetId.length === 0) return null
        const mode = ['default', 'fixed', 'mediaEnd'].includes(entry.dwellMode) ? entry.dwellMode : 'default'
        return {
          id: text(entry.id) || assetId,
          assetId,
          dwellMode: mode,
          dwellSeconds: clamp(number(entry.dwellSeconds, 30), 1, 24 * 60 * 60),
        }
      })
      .filter(Boolean),
    shuffle: ['off', 'random', 'noRepeat'].includes(value.shuffle) ? value.shuffle : 'off',
    loop: value.loop !== false,
    createdAt: text(value.createdAt, new Date().toISOString()),
    updatedAt: text(value.updatedAt, new Date().toISOString()),
    favorite: value.favorite === true,
  }
}

/** Full state normalization for disk reads and client writes. */
export function normalizeState(raw) {
  const base = defaultState()
  const value = record(raw)
  if (value === null) return base

  const globalRaw = record(value.global) ?? {}
  const surfaceRaw = record(globalRaw.surface) ?? {}
  const startupRaw = record(globalRaw.startup) ?? {}
  const audioRaw = record(globalRaw.audio) ?? {}

  const assets = (Array.isArray(value.assets) ? value.assets : []).map(normalizeAsset).filter(Boolean)
  const dedupAssets = []
  const seenAssets = new Set()
  for (const asset of assets) {
    if (seenAssets.has(asset.id)) continue
    seenAssets.add(asset.id)
    dedupAssets.push(asset)
  }

  const audio = (Array.isArray(value.audio) ? value.audio : []).map(normalizeAudio).filter(Boolean)

  const assetSettings = {}
  const settingsRaw = record(value.assetSettings) ?? {}
  for (const asset of dedupAssets) {
    assetSettings[asset.id] = normalizeSettings(settingsRaw[asset.id], asset.kind)
  }

  const playlists = (Array.isArray(value.playlists) ? value.playlists : []).map(normalizePlaylist).filter(Boolean)
  const runtimeRaw = record(value.runtime) ?? {}

  return {
    schemaVersion: SCHEMA_VERSION,
    assets: dedupAssets,
    audio,
    assetSettings,
    playlists,
    startupAnimation: normalizeStartupAnimation(value.startupAnimation),
    startupDisplayMode: value.startupDisplayMode === 'animation-first' ? 'animation-first' : 'fast',
    global: {
      defaultDwellSeconds: clamp(number(globalRaw.defaultDwellSeconds, 30), 1, 24 * 60 * 60),
      importMode: globalRaw.importMode === 'copy' ? 'copy' : 'reference',
      surface: {
        dark: clamp(number(surfaceRaw.dark, 0.34), 0.05, 0.92),
        light: clamp(number(surfaceRaw.light, 0.62), 0.05, 0.95),
      },
      startup: {
        restore: startupRaw.restore !== false,
        autoPlay: startupRaw.autoPlay !== false,
      },
      audio: {
        muted: audioRaw.muted === true,
        masterVolume: clamp(number(audioRaw.masterVolume, 1), 0, 1),
      },
      fadeMs: clamp(number(globalRaw.fadeMs, 420), 0, 5000),
      libraryView: globalRaw.libraryView === 'list' ? 'list' : 'grid',
    },
    runtime: {
      mode: runtimeRaw.mode === 'playlist' ? 'playlist' : 'single',
      assetId: text(runtimeRaw.assetId) || null,
      playlistId: text(runtimeRaw.playlistId) || null,
      itemIndex: Math.max(0, Math.trunc(number(runtimeRaw.itemIndex, 0))),
      playing: runtimeRaw.playing === true,
      updatedAt: number(runtimeRaw.updatedAt, 0),
    },
  }
}

/**
 * One atomic JSON store. Every write goes through a serialized queue so two
 * rapid UI actions can never interleave a half-written file.
 */
export class StateStore {
  constructor(dshHome) {
    this.paths = studioPaths(dshHome)
    this.writeChain = Promise.resolve()
    this.ready = this.#ensure()
  }

  async #ensure() {
    await fs.mkdir(this.paths.root, { recursive: true })
    await fs.mkdir(this.paths.media, { recursive: true })
    await fs.mkdir(this.paths.thumbs, { recursive: true })
    await fs.mkdir(this.paths.logs, { recursive: true })
  }

  async #readFile(file) {
    const raw = await fs.readFile(file, 'utf8')
    return normalizeState(JSON.parse(raw))
  }

  /** Load state; recover from a backup and quarantine a corrupt primary. */
  async load() {
    await this.ready
    const warnings = []
    try {
      return { state: await this.#readFile(this.paths.state), warnings }
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        warnings.push(`状态文件无法解析：${error instanceof Error ? error.message : String(error)}`)
        try {
          const stamp = new Date().toISOString().replace(/[:.]/g, '-')
          await fs.rename(this.paths.state, `${this.paths.state}.corrupt-${stamp}`)
        } catch {
          /* the original may be locked; still try the backup */
        }
        try {
          const recovered = await this.#readFile(this.paths.stateBak)
          warnings.push('已从 state.json.bak 恢复上次可用的配置。')
          return { state: recovered, warnings }
        } catch {
          /* fall through to defaults */
        }
      }
      return { state: defaultState(), warnings }
    }
  }

  /** Persist state atomically, keeping the previous good file as .bak. */
  async save(state) {
    const normalized = normalizeState(state)
    const text = JSON.stringify(normalized, null, 2)
    this.writeChain = this.writeChain.then(async () => {
      await this.ready
      await fs.writeFile(this.paths.stateTmp, text, 'utf8')
      try {
        await fs.copyFile(this.paths.state, this.paths.stateBak)
      } catch {
        /* first save has no previous file */
      }
      await fs.rename(this.paths.stateTmp, this.paths.state)
    })
    try {
      await this.writeChain
      return normalized
    } catch (error) {
      this.writeChain = Promise.resolve()
      throw error
    }
  }

  /** Refresh size/mtime/missing flags without modifying user files. */
  async revalidate(state) {
    const normalized = normalizeState(state)
    const warnings = []
    let changed = false
    const check = async (entry) => {
      try {
        const stat = await fs.stat(entry.path)
        if (!stat.isFile()) throw new Error('not a regular file')
        if (entry.missing) {
          entry.missing = false
          changed = true
        }
        if (entry.size !== stat.size) {
          entry.size = stat.size
          changed = true
        }
        if (entry.mtimeMs !== stat.mtimeMs) {
          entry.mtimeMs = stat.mtimeMs
          changed = true
        }
      } catch {
        if (!entry.missing) {
          entry.missing = true
          changed = true
        }
        warnings.push(`文件不可用：${entry.path}`)
      }
    }
    for (const asset of normalized.assets) await check(asset)
    for (const track of normalized.audio) await check(track)
    return { state: normalized, warnings, changed }
  }
}
