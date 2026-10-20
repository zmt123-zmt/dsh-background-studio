import fs from 'node:fs'
import path from 'node:path'

import { normalizeState } from './store.js'

/**
 * Read the small startup slice synchronously. The index injection table is
 * emitted synchronously by the Host; waiting for StateStore.load() here would
 * either miss the table or make the page wait on disk I/O.
 */
function readStateSync(statePath) {
  const text = fs.readFileSync(statePath, 'utf8')
  return normalizeState(JSON.parse(text))
}

function runtimeFile(packageRoot, file) {
  return path.join(packageRoot, 'runtime', file)
}

/** Cache runtime text by mtime+size; the table is emitted on each index render. */
export function makeRuntimeReader(packageRoot) {
  const cache = new Map()
  return (file) => {
    const target = runtimeFile(packageRoot, file)
    const stat = fs.statSync(target)
    const hit = cache.get(file)
    if (hit !== undefined && hit.mtimeMs === stat.mtimeMs && hit.size === stat.size) return hit.text
    const text = fs.readFileSync(target, 'utf8')
    cache.set(file, { mtimeMs: stat.mtimeMs, size: stat.size, text })
    return text
  }
}

function mediaUrl(prefix, id) {
  return `${prefix}/media/${id}`
}

function audioUrl(prefix, id) {
  return `${prefix}/audio/${id}`
}

function thumbUrl(prefix, asset) {
  return asset?.thumb === true ? `${prefix}/thumb/${asset.id}?v=${asset.thumbVersion || 0}` : null
}

function validItems(state, prefix) {
  const items = []
  for (const item of state.startupAnimation.items) {
    if (item.enabled === false) continue
    const asset = state.assets.find((entry) => entry.id === item.assetId)
    if (!asset || asset.missing || (asset.kind !== 'video' && asset.kind !== 'gif')) continue
    items.push({
      id: item.id,
      assetId: asset.id,
      name: asset.name,
      kind: asset.kind,
      duration: asset.duration > 0 ? asset.duration : 0,
      mediaUrl: mediaUrl(prefix, asset.id),
      thumbUrl: thumbUrl(prefix, asset),
    })
  }
  return items
}

/**
 * Build the page-side startup snapshot that is prepended to the injected
 * runtime. It contains only library ids and local routes; never raw file
 * paths, and never Base64 media.
 */
export function buildStartupSnapshot({ statePath, bootId, prefix, version }) {
  let state
  try {
    state = readStateSync(statePath)
  } catch (error) {
    return {
      handled: true,
      injected: true,
      decided: false,
      enabled: false,
      shouldPlay: false,
      displayMode: 'fast',
      reason: 'state-unreadable',
      error: error instanceof Error ? error.message : String(error),
      bootId,
      version,
    }
  }

  const config = state.startupAnimation
  const items = validItems(state, prefix)
  let chosen = null
  let reason = ''
  if (config.enabled !== true) {
    reason = 'disabled'
  } else if (items.length === 0) {
    reason = 'no-valid-item'
  } else if (config.trigger === 'firstLaunch' && config.firstRunDone === true) {
    reason = 'first-launch-done'
  } else if (config.trigger === 'random') {
    chosen = items[Math.floor(Math.random() * items.length)]
  } else {
    chosen = items[0]
  }

  const durationMs = chosen
    ? config.durationMode === 'custom'
      ? Math.min(300000, Math.max(500, Number(config.customSeconds) * 1000))
      : chosen.duration > 0
        ? Math.min(300000, Math.max(500, chosen.duration * 1000))
        : 8000
    : 0

  const audioTrack = config.audio.mode === 'external'
    ? state.audio.find((entry) => entry.id === config.audio.audioId && !entry.missing)
    : null
  const runtimeAsset = state.assets.find((entry) => entry.id === state.runtime.assetId) ?? null
  const backgroundSettings = runtimeAsset ? state.assetSettings[runtimeAsset.id] ?? null : null

  return {
    handled: true,
    injected: true,
    decided: false,
    enabled: config.enabled === true,
    shouldPlay: chosen !== null,
    displayMode: state.startupDisplayMode === 'animation-first' ? 'animation-first' : 'fast',
    reason,
    version,
    bootId,
    bootKey: 'dbs.startup.bootId',
    trigger: config.trigger,
    mode: config.mode,
    skip: config.skip !== false,
    display: config.display,
    fadeInMs: config.fadeInMs,
    fadeOutMs: config.fadeOutMs,
    holdMs: config.holdMs,
    durationMode: config.durationMode,
    durationMs,
    item: chosen,
    audio: {
      mode: config.audio.mode,
      volume: config.audio.volume,
      audioId: audioTrack?.id ?? null,
      audioUrl: audioTrack ? audioUrl(prefix, audioTrack.id) : null,
    },
    background: runtimeAsset
      ? {
          assetId: runtimeAsset.id,
          kind: runtimeAsset.kind,
          mediaUrl: mediaUrl(prefix, runtimeAsset.id),
          thumbUrl: thumbUrl(prefix, runtimeAsset),
          opacity: backgroundSettings?.opacity ?? 1,
          display: backgroundSettings?.display ?? 'cover',
        }
      : null,
    markUrl: `${prefix}/api/startup/mark`,
    windowStateUrl: `${prefix}/api/startup/window-state`,
    readyEvent: 'dbs:background-ready',
    endedEvent: 'dbs:startup-ended',
  }
}

/**
 * Build the two structured rows in application order. The reference project
 * and the current Host contract both apply rows in array order; style must
 * precede the script so the overlay has its size/stacking before it is made.
 */
export function buildStartupInjectionRows(snapshot, cssText, jsText) {
  const config = `globalThis.__DBS_BOOT__=${JSON.stringify(snapshot)};`
  const text = `${config}\n${jsText}`.replace(/<\/script/gi, '<\\/script')
  return [
    {
      kind: 'global',
      name: '__DBS_STARTUP_WINDOW__',
      value: {
        enabled: snapshot.shouldPlay === true,
        mode: snapshot.displayMode === 'animation-first' ? 'animation-first' : 'fast',
        fastTimeoutMs: 5500,
        animationTimeoutMs: 8000,
        windowStatePath: '/dsh-background-studio/api/startup/window-state',
        bootId: snapshot.bootId,
      },
    },
    { kind: 'style', text: cssText },
    { kind: 'script', placement: 'body', text },
  ]
}
