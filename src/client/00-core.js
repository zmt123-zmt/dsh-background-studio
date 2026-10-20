/* =========================================================================
 * 00-core — constants, tiny UI helpers, API client, shared defaults.
 * This file is concatenated into the browser factory by build.mjs.
 * ========================================================================= */

const API_BASE = '/dsh-background-studio'
const PANEL_KEY = 'dbs'
const PANEL_TITLE = '背景工作室'
const SETTINGS_VERSION = 1

const h = React.createElement
const cx = (...values) => values.filter(Boolean).join(' ')
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const num = (value, fallback) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback)
const str = (value, fallback = '') => (typeof value === 'string' ? value : fallback)

function formatBytes(bytes) {
  const value = num(bytes, 0)
  if (value < 1024) return `${value} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let size = value / 1024
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index += 1
  }
  return `${size >= 100 ? size.toFixed(0) : size.toFixed(1)} ${units[index]}`
}

function formatDuration(seconds) {
  const value = num(seconds, 0)
  if (!Number.isFinite(value) || value <= 0) return '—'
  const total = Math.round(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function formatClock(seconds) {
  const value = Math.max(0, num(seconds, 0))
  const minutes = Math.floor(value / 60)
  const rest = Math.floor(value % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function basename(filePath) {
  const text = str(filePath)
  const index = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'))
  return index >= 0 ? text.slice(index + 1) : text
}

function kindText(kind) {
  if (kind === 'video') return '视频'
  if (kind === 'gif') return 'GIF'
  if (kind === 'image') return '图片'
  if (kind === 'audio') return '音频'
  return '未知'
}

function isVideoAsset(asset) {
  return asset?.kind === 'video'
}

function isAnimatedAsset(asset) {
  return asset?.kind === 'video' || asset?.kind === 'gif'
}

function defaultAssetSettings(kind) {
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

function defaultStartupAnimation() {
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

function normalizeStartupAnimation(raw) {
  const base = defaultStartupAnimation()
  if (!raw || typeof raw !== 'object') return base
  const items = []
  const seen = new Set()
  const source = Array.isArray(raw.items) ? raw.items : []
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index]
    if (!item || typeof item !== 'object' || typeof item.assetId !== 'string') continue
    const id = str(item.id) || `${item.assetId}-${index}`
    if (seen.has(id)) continue
    seen.add(id)
    items.push({
      id,
      assetId: item.assetId,
      enabled: item.enabled !== false,
    })
  }
  const audio = raw.audio && typeof raw.audio === 'object' ? raw.audio : {}
  const modes = new Set(['video', 'mute', 'external'])
  const audioMode = modes.has(audio.mode) ? audio.mode : base.audio.mode
  return {
    enabled: raw.enabled === true,
    mode: raw.mode === 'background' ? 'background' : 'fullscreen',
    trigger: ['everyLaunch', 'firstLaunch', 'random'].includes(raw.trigger) ? raw.trigger : 'everyLaunch',
    items,
    durationMode: raw.durationMode === 'custom' ? 'custom' : 'media',
    customSeconds: clamp(num(raw.customSeconds, base.customSeconds), 1, 300),
    display: ['cover', 'contain', 'center'].includes(raw.display) ? raw.display : 'cover',
    fadeInMs: clamp(num(raw.fadeInMs, base.fadeInMs), 0, 5000),
    fadeOutMs: clamp(num(raw.fadeOutMs, base.fadeOutMs), 0, 5000),
    holdMs: clamp(num(raw.holdMs, base.holdMs), 0, 10000),
    skip: raw.skip !== false,
    audio: {
      mode: audioMode,
      audioId: str(audio.audioId) || null,
      volume: clamp(num(audio.volume, 1), 0, 1),
    },
    firstRunDone: raw.firstRunDone === true,
  }
}

function defaultClientState() {
  return {
    schemaVersion: SETTINGS_VERSION,
    assets: [],
    audio: [],
    assetSettings: {},
    playlists: [],
    startupAnimation: defaultStartupAnimation(),
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

function normalizeSettings(raw, kind) {
  const base = defaultAssetSettings(kind)
  if (!raw || typeof raw !== 'object') return base
  const displays = new Set(['cover', 'contain', 'center', 'original', 'custom'])
  const modes = new Set(['video', 'external', 'mix', 'mute'])
  const dwellModes = new Set(['default', 'fixed', 'mediaEnd'])
  const audioIds = Array.isArray(raw.audioIds)
    ? Array.from(new Set(raw.audioIds.filter((entry) => typeof entry === 'string' && entry.length > 0)))
    : []
  const legacyAudioId = str(raw.audioId) || null
  if (legacyAudioId && !audioIds.includes(legacyAudioId)) audioIds.unshift(legacyAudioId)
  const audioIndex = Math.min(Math.max(0, Math.trunc(num(raw.audioIndex, 0))), Math.max(0, audioIds.length - 1))
  return {
    opacity: clamp(num(raw.opacity, base.opacity), 0, 1),
    display: displays.has(raw.display) ? raw.display : base.display,
    scale: clamp(num(raw.scale, 1), 0.1, 4),
    loop: raw.loop !== false,
    audioMode: modes.has(raw.audioMode) ? raw.audioMode : base.audioMode,
    audioId: audioIds[audioIndex] ?? legacyAudioId,
    audioIds,
    audioIndex,
    audioVolume: clamp(num(raw.audioVolume, 1), 0, 1),
    videoVolume: clamp(num(raw.videoVolume, 1), 0, 1),
    audioLoop: raw.audioLoop !== false,
    audioStartMs: clamp(num(raw.audioStartMs, 0), 0, 24 * 60 * 60 * 1000),
    audioEndAction: raw.audioEndAction === 'next' ? 'next' : raw.audioEndAction === 'nextTrack' && audioIds.length > 1 ? 'nextTrack' : 'none',
    fadeMs: clamp(num(raw.fadeMs, 420), 0, 5000),
    dwellMode: dwellModes.has(raw.dwellMode) ? raw.dwellMode : 'default',
    dwellSeconds: clamp(num(raw.dwellSeconds, 30), 1, 24 * 60 * 60),
  }
}

function normalizeClientState(raw) {
  const base = defaultClientState()
  if (!raw || typeof raw !== 'object') return base
  const assets = Array.isArray(raw.assets) ? raw.assets.filter((asset) => asset && typeof asset.id === 'string') : []
  const audio = Array.isArray(raw.audio) ? raw.audio.filter((track) => track && typeof track.id === 'string') : []
  const settings = {}
  for (const asset of assets) {
    settings[asset.id] = normalizeSettings(raw.assetSettings?.[asset.id], asset.kind)
  }
  return {
    schemaVersion: SETTINGS_VERSION,
    assets: assets.map((asset) => ({
      ...asset,
      missing: asset.missing === true,
      favorite: asset.favorite === true,
      thumb: asset.thumb === true,
      hasAudio: asset.hasAudio === true ? true : asset.hasAudio === false ? false : null,
      width: num(asset.width, 0),
      height: num(asset.height, 0),
      duration: num(asset.duration, 0),
      fps: num(asset.fps, 0),
      size: num(asset.size, 0),
      thumbVersion: num(asset.thumbVersion, 0),
    })),
    audio: audio.map((track) => ({
      ...track,
      missing: track.missing === true,
      duration: num(track.duration, 0),
      size: num(track.size, 0),
    })),
    assetSettings: settings,
    playlists: Array.isArray(raw.playlists)
      ? raw.playlists
          .filter((playlist) => playlist && typeof playlist.id === 'string')
          .map((playlist) => ({
            ...playlist,
            items: Array.isArray(playlist.items) ? playlist.items.filter((item) => item && typeof item.assetId === 'string') : [],
            shuffle: ['off', 'random', 'noRepeat'].includes(playlist.shuffle) ? playlist.shuffle : 'off',
            loop: playlist.loop !== false,
            favorite: playlist.favorite === true,
          }))
      : [],
    startupAnimation: normalizeStartupAnimation(raw.startupAnimation),
    global: {
      ...base.global,
      ...(raw.global ?? {}),
      surface: { ...base.global.surface, ...(raw.global?.surface ?? {}) },
      startup: { ...base.global.startup, ...(raw.global?.startup ?? {}) },
      audio: { ...base.global.audio, ...(raw.global?.audio ?? {}) },
    },
    runtime: { ...base.runtime, ...(raw.runtime ?? {}) },
  }
}

async function apiRequest(endpoint, options) {
  const response = await fetch(`${API_BASE}${endpoint}`, options)
  const text = await response.text()
  let body = text
  try {
    body = text.length > 0 ? JSON.parse(text) : null
  } catch {
    /* keep text */
  }
  if (!response.ok) {
    const message = body && typeof body === 'object' ? body.error : String(body || response.statusText)
    throw new Error(message || `HTTP ${response.status}`)
  }
  return body
}

async function apiLoadState() {
  const body = await apiRequest('/api/state')
  return {
    state: normalizeClientState(body?.state),
    warnings: Array.isArray(body?.warnings) ? body.warnings : [],
    root: body?.root,
    bootId: typeof body?.bootId === 'string' ? body.bootId : '',
  }
}

async function apiSaveState(state) {
  return apiRequest('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
}

async function apiImport(paths, mode, kind, onEvent) {
  const response = await fetch(`${API_BASE}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths, mode, kind }),
  })
  if (!response.ok) {
    const text = await response.text()
    let message = text
    try {
      message = JSON.parse(text)?.error ?? text
    } catch {
      /* keep text */
    }
    throw new Error(message || `HTTP ${response.status}`)
  }
  if (!response.body) throw new Error('当前环境不支持流式导入')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const events = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let index = buffer.indexOf('\n')
    while (index >= 0) {
      const line = buffer.slice(0, index).trim()
      buffer = buffer.slice(index + 1)
      if (line.length > 0) {
        try {
          const event = JSON.parse(line)
          events.push(event)
          onEvent?.(event)
        } catch {
          /* tolerate a partial line */
        }
      }
      index = buffer.indexOf('\n')
    }
  }
  const tail = buffer.trim()
  if (tail.length > 0) {
    try {
      const event = JSON.parse(tail)
      events.push(event)
      onEvent?.(event)
    } catch {
      /* ignore */
    }
  }
  return events
}

async function apiRelocate(id, filePath) {
  return apiRequest('/api/relocate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, path: filePath }),
  })
}

async function apiUploadThumb(id, blob) {
  return apiRequest(`/api/thumb?id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/webp' },
    body: blob,
  })
}

function mediaUrl(id) {
  return `${API_BASE}/media/${id}`
}

function audioUrl(id) {
  return `${API_BASE}/audio/${id}`
}

function thumbUrl(asset) {
  if (!asset?.thumb) return null
  return `${API_BASE}/thumb/${asset.id}?v=${asset.thumbVersion || 0}`
}

/* -------------------------------------------------------------------------
 * Icons — original line icons, sized by CSS.
 * ---------------------------------------------------------------------- */

function svgIcon(viewBox, children, extra) {
  return h('svg', {
    viewBox,
    width: '1em',
    height: '1em',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
    ...(extra || {}),
  }, ...children)
}

function IconBackground() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 3 }),
    h('circle', { key: 'c', cx: 9, cy: 9, r: 1.6 }),
    h('path', { key: 'p', d: 'M4 17l5-5 4 4 3-3 4 4' }),
  ])
}

function IconImage() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 2.5 }),
    h('circle', { key: 'c', cx: 8.5, cy: 9, r: 1.5 }),
    h('path', { key: 'p', d: 'M4 17l5-5 4 4 3-3 4 4' }),
  ])
}

function IconFilm() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 2.5 }),
    h('path', { key: 'a', d: 'M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4' }),
  ])
}

function IconMusic() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M9 18V6l10-2v12' }),
    h('circle', { key: 'b', cx: 6, cy: 18, r: 3 }),
    h('circle', { key: 'c', cx: 16, cy: 16, r: 3 }),
  ])
}

function IconStar({ filled }) {
  return h('svg', {
    viewBox: '0 0 24 24',
    width: '1em',
    height: '1em',
    fill: filled ? 'currentColor' : 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }, h('path', { d: 'M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8z' }))
}

function IconPlus() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M12 5v14M5 12h14' })])
}

function IconTrash() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v6M14 11v6' }),
  ])
}

function IconPlay() {
  return h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d: 'M8 5.5v13l11-6.5z' }))
}

function IconPause() {
  return h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d: 'M7 5h4v14H7zM13 5h4v14h-4z' }))
}

function IconPrev() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M18 6l-8 6 8 6zM6 5v14' })])
}

function IconNext() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 6l8 6-8 6zM18 5v14' })])
}

function IconVolume() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 9h4l5-4v14l-5-4H4z' }),
    h('path', { key: 'b', d: 'M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12' }),
  ])
}

function IconMute() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 9h4l5-4v14l-5-4H4z' }),
    h('path', { key: 'b', d: 'M16 9l5 6M21 9l-5 6' }),
  ])
}

function IconGrid() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'a', x: 4, y: 4, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'b', x: 13, y: 4, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'c', x: 4, y: 13, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'd', x: 13, y: 13, width: 7, height: 7, rx: 1.5 }),
  ])
}

function IconList() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M5 7h14M5 12h14M5 17h14' }),
  ])
}

function IconSearch() {
  return svgIcon('0 0 24 24', [
    h('circle', { key: 'a', cx: 11, cy: 11, r: 6 }),
    h('path', { key: 'b', d: 'M16 16l4 4' }),
  ])
}

function IconSettings() {
  return svgIcon('0 0 24 24', [
    h('circle', { key: 'a', cx: 12, cy: 12, r: 3 }),
    h('path', { key: 'b', d: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1' }),
  ])
}

function IconRefresh() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M20 11a8 8 0 10-2.3 5.7' }),
    h('path', { key: 'b', d: 'M20 5v6h-6' }),
  ])
}

function IconFolder() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
  ])
}

function IconClose() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 6l12 12M18 6L6 18' })])
}

function IconWarning() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M12 4l9 16H3z' }),
    h('path', { key: 'b', d: 'M12 9v5M12 17h.01' }),
  ])
}

function IconCheck() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M4 12l5 5L20 6' })])
}

function IconChevron({ down }) {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: down ? 'M6 9l6 6 6-6' : 'M9 6l6 6-6 6' })])
}

function IconUp() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 14l6-6 6 6' })])
}

function IconDown() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 10l6 6 6-6' })])
}
