/* =========================================================================
 * 10-studio — the single long-lived controller. It owns the authoritative
 * client state, persistence, imports and the bridge to renderer/audio/playlist.
 * ========================================================================= */

let activeStudio = null

function useStudio() {
  const [, force] = React.useState(0)
  React.useEffect(() => {
    const studio = activeStudio
    if (!studio) return undefined
    return studio.subscribe(() => force((value) => value + 1))
  }, [])
  return activeStudio
}

function useTick(ms = 250) {
  const [, force] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => force((value) => value + 1), ms)
    return () => clearInterval(timer)
  }, [ms])
}

function newId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `dbs-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

class Studio {
  constructor(ctx) {
    this.ctx = ctx
    this.state = defaultClientState()
    this.ready = false
    this.error = null
    this.warnings = []
    this.root = null
    this.bootId = ''
    this.timeline = { boot: Math.round(performance.now()) }
    this.listeners = new Set()
    this.toasts = []
    this.toastSeq = 0
    this.importing = false
    this.importText = ''
    this.importProgress = null
    this.lastImportedId = null
    this.selectedAssetId = null
    this.audioPreviewId = null
    this.detailsPending = new Set()
    this.saving = false
    this.dirty = false
    this.saveTimer = 0
    this.saveChain = Promise.resolve()
    this.renderer = null
    this.audio = null
    this.playlist = null
    this.startup = null
    this.startupPreview = null
    this.backgroundReady = false
    this.injectedSuppressed = false
    this.deferBackgroundVideo = false
    this.deferredTimer = 0
    this.deferredStartTimer = 0
    this.deferredStarted = false
    this.deferredResumeRequested = false
    this.deferredResumed = false
    this.onInjectedStart = () => this.applyInjectedSuppression()
    this.onInjectedSkip = () => this.startDeferredBackground()
    this.onInjectedEnding = () => this.startDeferredBackground()
    this.onInjectedEnd = () => {
      this.startDeferredBackground()
      this.releaseInjectedSuppression()
      this.resumeDeferredBackground()
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  emit() {
    for (const listener of this.listeners) {
      try {
        listener()
      } catch {
        /* a broken listener must not break the controller */
      }
    }
  }

  toast(kind, message, ttl = 4600) {
    const id = ++this.toastSeq
    this.toasts.push({ id, kind, message })
    this.emit()
    window.setTimeout(() => {
      this.toasts = this.toasts.filter((entry) => entry.id !== id)
      this.emit()
    }, ttl)
  }

  dismissToast(id) {
    this.toasts = this.toasts.filter((entry) => entry.id !== id)
    this.emit()
  }

  assetById(id) {
    return this.state.assets.find((asset) => asset.id === id) ?? null
  }

  audioById(id) {
    return this.state.audio.find((track) => track.id === id) ?? null
  }

  playlistById(id) {
    return this.state.playlists.find((playlist) => playlist.id === id) ?? null
  }

  settingsFor(id) {
    const asset = this.assetById(id)
    if (!asset) return defaultAssetSettings('image')
    if (!this.state.assetSettings[id]) {
      this.state.assetSettings[id] = defaultAssetSettings(asset.kind)
    }
    return this.state.assetSettings[id]
  }

  currentAsset() {
    if (!this.ready) return null
    if (this.state.runtime.mode === 'playlist') {
      return this.playlist?.currentAsset() ?? null
    }
    return this.assetById(this.state.runtime.assetId)
  }

  currentSettings() {
    const asset = this.currentAsset()
    return asset ? this.settingsFor(asset.id) : null
  }

  isPlaying() {
    return this.state.runtime.playing === true
  }

  markTimeline(name, detail = '') {
    this.timeline[name] = Math.round(performance.now())
    if (detail) this.timeline[`${name}:detail`] = detail
    try {
      const lifecycle = window.__DBS_LIFECYCLE__ || (window.__DBS_LIFECYCLE__ = [])
      lifecycle.push({ name, t: this.timeline[name], detail: detail || undefined })
    } catch {
      /* logging only */
    }
    console.info(`[dbs ${this.timeline[name]}ms] ${name}${detail ? ` — ${detail}` : ''}`)
  }

  startupPerf(name, detail = '') {
    const t = Math.round(performance.now())
    const suffix = ` t=${t}ms${detail ? ` ${detail}` : ''}`
    console.info(`[StartupPerf] ${name}${suffix}`)
    console.info(`[Startup] ${name}${suffix}`)
    this.timeline[`StartupPerf:${name}`] = t
    try {
      const lifecycle = window.__DBS_LIFECYCLE__ || (window.__DBS_LIFECYCLE__ = [])
      lifecycle.push({ name: `StartupPerf:${name}`, t, detail: detail || undefined })
    } catch {
      /* logging only */
    }
  }

  /** The injected startup overlay can outlive this bundle's initial mount. */
  applyInjectedSuppression() {
    if (this.injectedSuppressed || window.__DBS_BOOT__?.active !== true) return
    this.injectedSuppressed = true
    this.audio?.beginStartupSuppression()
    this.markTimeline('startup-suppression-on')
  }

  releaseInjectedSuppression() {
    if (!this.injectedSuppressed) return
    this.injectedSuppressed = false
    this.audio?.endStartupSuppression()
    this.markTimeline('startup-suppression-off')
  }

  notifyBackgroundReady(ok, detail = '') {
    this.backgroundReady = true
    this.markTimeline('background-ready', ok === false ? 'failed' : detail)
    this.startupPerf('background-ready', ok === false ? 'failed' : detail)
    if (this.deferBackgroundVideo) this.armDeferredBackgroundTimer()
    if (this.deferredResumeRequested) this.resumeDeferredBackground()
    try {
      window.dispatchEvent(new CustomEvent('dbs:background-ready', {
        detail: { ok: ok !== false, at: Date.now() },
      }))
    } catch {
      /* CustomEvent is always available in the client renderer */
    }
  }

  currentBackgroundKind() {
    const runtime = this.state.runtime
    if (runtime.mode === 'playlist') {
      const playlist = this.playlistById(runtime.playlistId)
      const item = playlist?.items?.[runtime.itemIndex]
      return item ? this.assetById(item.assetId)?.kind ?? null : null
    }
    return runtime.assetId ? this.assetById(runtime.assetId)?.kind ?? null : null
  }

  /**
   * When a 4K/HD startup video is playing, decoding the normal video background
   * at the same time steals GPU/decoder time from the first seconds. The
   * background is still loaded and its poster shown, but playback is held until
   * the last part of the startup (or an early skip), so the first frames belong
   * to the startup only.
   */
  prepareDeferredBackground() {
    const boot = window.__DBS_BOOT__
    this.deferBackgroundVideo = boot?.active === true &&
      boot?.item?.kind === 'video' &&
      this.currentBackgroundKind() === 'video'
    if (this.deferBackgroundVideo) this.startupPerf('background-video-deferred')
  }

  armDeferredBackgroundStart() {
    if (!this.deferBackgroundVideo || this.deferredStarted || this.deferredStartTimer) return
    const boot = window.__DBS_BOOT__
    const now = performance.now()
    const endsAt = Number(boot?.endsAt)
    if (!Number.isFinite(endsAt) || endsAt <= 0) {
      // Studio.boot runs before the startup's first frame, so endsAt may not be
      // known yet. Poll briefly instead of guessing an early time (which would
      // start the background decoder during the first seconds).
      this.deferredStartTimer = window.setTimeout(() => {
        this.deferredStartTimer = 0
        this.armDeferredBackgroundStart()
      }, 250)
      return
    }
    const leadMs = 900
    const delay = Math.max(0, endsAt - now - leadMs)
    this.deferredStartTimer = window.setTimeout(() => {
      this.deferredStartTimer = 0
      this.startDeferredBackground()
    }, delay)
  }

  startDeferredBackground() {
    if (!this.deferBackgroundVideo || this.deferredStarted) return
    this.deferredStarted = true
    if (this.deferredStartTimer) {
      window.clearTimeout(this.deferredStartTimer)
      this.deferredStartTimer = 0
    }
    this.startBackgroundRestore().catch(() => {})
  }

  startBackgroundRestore() {
    this.markTimeline('background-init-start')
    this.startupPerf('background-load-start', this.deferBackgroundVideo ? 'video deferred' : '')
    return this.restoreRuntime()
      .then(() => {
        this.markTimeline('background-restored')
        this.notifyBackgroundReady(true, 'restored')
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error)
        this.toast('error', `恢复上次背景失败：${message}`)
        this.notifyBackgroundReady(false, message)
      })
  }

  armDeferredBackgroundTimer() {
    if (!this.deferBackgroundVideo || this.deferredResumed || this.deferredTimer) return
    const boot = window.__DBS_BOOT__
    const now = performance.now()
    const endsAt = Number(boot?.endsAt)
    const leadMs = 900
    const delay = Number.isFinite(endsAt) && endsAt > now
      ? Math.max(0, endsAt - now - leadMs)
      : 2500
    this.deferredTimer = window.setTimeout(() => {
      this.deferredTimer = 0
      this.resumeDeferredBackground()
    }, delay)
  }

  resumeDeferredBackground() {
    if (!this.deferBackgroundVideo || this.deferredResumed) return
    if (!this.backgroundReady) {
      this.deferredResumeRequested = true
      return
    }
    this.deferredResumed = true
    this.deferBackgroundVideo = false
    this.deferredResumeRequested = false
    if (this.deferredTimer) {
      window.clearTimeout(this.deferredTimer)
      this.deferredTimer = 0
    }
    const runtime = this.state.runtime
    if (runtime.mode === 'playlist' && this.playlist?.currentItem()) {
      this.playlist.resume()
      return
    }
    if (this.currentAsset()) {
      this.renderer?.resume()
      this.audio?.resumeExternal()
      if (!this.state.runtime.playing) {
        this.state.runtime.playing = true
        this.state.runtime.updatedAt = Date.now()
        this.scheduleSave()
        this.emit()
      }
    }
  }

  async boot() {
    try {
      const loaded = await apiLoadState()
      this.state = loaded.state
      this.warnings = loaded.warnings ?? []
      this.root = loaded.root ?? ''
      this.bootId = loaded.bootId ?? ''
      if (window.__DBS_BOOT__?.played === true) this.state.startupAnimation.firstRunDone = true
      this.markTimeline('state-loaded')
      this.markTimeline('config-loaded')
    } catch (error) {
      this.error = `无法读取背景配置：${error instanceof Error ? error.message : String(error)}`
      this.state = defaultClientState()
      this.markTimeline('state-failed', String(error))
    }

    this.renderer = new Renderer(this)
    this.renderer.mount()
    this.markTimeline('renderer-mounted')
    this.audio = new AudioGraph(this)
    this.playlist = new PlaylistEngine(this)
    this.startup = new StartupController(this)
    this.startupPreview = new StartupController(this, { kind: 'preview' })
    window.addEventListener('dbs:startup-started', this.onInjectedStart)
    window.addEventListener('dbs:startup-ended', this.onInjectedEnd)
    window.addEventListener('dbs:startup-skip', this.onInjectedSkip)
    window.addEventListener('dbs:startup-ending', this.onInjectedEnding)
    this.applyInjectedSuppression()
    this.ready = true
    this.prepareDeferredBackground()
    this.applyGlobalSettings()
    this.emit()

    if (this.error) this.toast('error', this.error)
    for (const warning of this.warnings.slice(0, 3)) this.toast('warning', warning)

    window.addEventListener('pagehide', this.onPageHide)
    const plan = this.startup.prepare()
    this.markTimeline('startup-plan', plan ? `${plan.asset.kind}:${plan.item.id}` : 'none')
    if (this.deferBackgroundVideo) {
      // Do not even create the background <video> yet. Its decoder would
      // otherwise contend with the startup video during the first seconds.
      // The poster/overlay is already covering the screen; background restore
      // starts near the end (or on skip) and is awaited before the reveal.
      this.markTimeline('background-deferred')
      const boot = window.__DBS_BOOT__
      if (boot?.skipped === true || boot?.ended === true) this.startDeferredBackground()
      else this.armDeferredBackgroundStart()
    } else if (plan) {
      const restorePromise = this.startBackgroundRestore()
      try {
        this.startup.begin(plan)
        this.markTimeline('startup-begun')
      } catch (error) {
        this.toast('error', `启动动画初始化失败：${error instanceof Error ? error.message : String(error)}`)
        this.audio.endStartupSuppression()
      }
      this.startup.setBackgroundPromise(restorePromise)
    } else {
      await this.startBackgroundRestore()
    }
    for (const track of this.state.audio.filter((entry) => entry.duration <= 0 && !entry.missing)) {
      this.enrichAudio(track).catch(() => {})
    }
    this.emit()
  }

  onPageHide = () => {
    if (!this.dirty) return
    try {
      const body = JSON.stringify(this.serialize())
      fetch(`${API_BASE}/api/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* best effort */
    }
  }

  serialize() {
    return {
      schemaVersion: SETTINGS_VERSION,
      assets: this.state.assets,
      audio: this.state.audio,
      assetSettings: this.state.assetSettings,
      playlists: this.state.playlists,
      startupAnimation: this.state.startupAnimation,
      global: this.state.global,
      runtime: this.state.runtime,
    }
  }

  scheduleSave(delay = 420) {
    this.dirty = true
    if (this.saveTimer) window.clearTimeout(this.saveTimer)
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0
      this.saveNow()
    }, delay)
  }

  async saveNow() {
    if (!this.ready) return
    this.dirty = false
    this.saving = true
    this.saveChain = (this.saveChain ?? Promise.resolve()).then(async () => {
      try {
        await apiSaveState(this.serialize())
        this.error = null
      } catch (error) {
        this.error = `保存失败：${error instanceof Error ? error.message : String(error)}`
        this.toast('error', this.error)
        this.dirty = true
      }
    })
    try {
      await this.saveChain
    } finally {
      this.saving = false
      if (this.dirty && this.ready) this.scheduleSave(1200)
    }
  }

  applyGlobalSettings() {
    if (!this.renderer) return
    this.renderer.setSurface(this.state.global.surface)
    if (this.audio) {
      this.audio.setMasterVolume(this.state.global.audio.masterVolume)
      this.audio.setMuted(this.state.global.audio.muted, { fadeMs: 120 })
    }
  }

  updateGlobal(patch) {
    const global = this.state.global
    this.state.global = {
      ...global,
      ...patch,
      surface: { ...global.surface, ...(patch.surface ?? {}) },
      startup: { ...global.startup, ...(patch.startup ?? {}) },
      audio: { ...global.audio, ...(patch.audio ?? {}) },
    }
    this.applyGlobalSettings()
    if (this.currentAsset()) this.renderer.setOpacity(this.settingsFor(this.currentAsset().id).opacity)
    this.scheduleSave()
    this.emit()
  }

  updateAssetSettings(id, patch) {
    const asset = this.assetById(id)
    if (!asset) return
    const settings = this.settingsFor(id)
    Object.assign(settings, patch)
    if (this.currentAsset()?.id === id) {
      if ('opacity' in patch) this.renderer.setOpacity(settings.opacity)
      if ('display' in patch || 'scale' in patch) this.renderer.setDisplay(settings)
      if ('loop' in patch) this.renderer.setLoop(settings.loop)
      if ('audioMode' in patch || 'audioId' in patch || 'audioVolume' in patch || 'videoVolume' in patch ||
          'audioLoop' in patch || 'audioStartMs' in patch || 'fadeMs' in patch || 'audioEndAction' in patch) {
        this.audio.applyForAsset(asset, settings, this.renderer.currentVideo)
      }
    }
    if (patch.dwellMode !== undefined || patch.dwellSeconds !== undefined) {
      if (this.state.runtime.mode === 'playlist' && this.currentAsset()?.id === id) {
        this.playlist.rescheduleDwell()
      }
    }
    this.scheduleSave()
    this.emit()
  }

  resetAssetSettings(id) {
    const asset = this.assetById(id)
    if (!asset) return
    this.state.assetSettings[id] = defaultAssetSettings(asset.kind)
    if (this.currentAsset()?.id === id) {
      this.renderer.setDisplay(this.settingsFor(id))
      this.renderer.setOpacity(1)
    }
    this.scheduleSave()
    this.emit()
  }

  bindAudio(assetId, audioId) {
    const settings = this.settingsFor(assetId)
    const ids = Array.isArray(settings.audioIds) ? settings.audioIds.slice() : []
    if (!ids.includes(audioId)) ids.push(audioId)
    settings.audioIds = ids
    settings.audioIndex = Math.max(0, ids.indexOf(audioId))
    settings.audioId = audioId
    const asset = this.assetById(assetId)
    if (asset && asset.kind !== 'video') settings.audioMode = 'external'
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  unbindAudio(assetId, audioId) {
    const settings = this.settingsFor(assetId)
    const ids = (settings.audioIds ?? []).filter((entry) => entry !== audioId)
    settings.audioIds = ids
    if (ids.length === 0) {
      settings.audioIndex = 0
      settings.audioId = null
      if (settings.audioMode === 'external' || settings.audioMode === 'mix') {
        settings.audioMode = this.assetById(assetId)?.kind === 'video' ? 'video' : 'mute'
      }
    } else {
      settings.audioIndex = Math.min(settings.audioIndex, ids.length - 1)
      settings.audioId = ids[settings.audioIndex]
    }
    if (ids.length < 2 && settings.audioEndAction === 'nextTrack') settings.audioEndAction = 'none'
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  setBoundAudio(assetId, index) {
    const settings = this.settingsFor(assetId)
    const ids = settings.audioIds ?? []
    if (ids.length === 0) return
    settings.audioIndex = clamp(index, 0, ids.length - 1)
    settings.audioId = ids[settings.audioIndex]
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  handleExternalAudioEnded() {
    const asset = this.currentAsset()
    if (!asset) return
    const settings = this.settingsFor(asset.id)
    if (settings.audioEndAction === 'nextTrack' && (settings.audioIds?.length ?? 0) > 1) {
      const next = ((settings.audioIndex ?? 0) + 1) % settings.audioIds.length
      this.setBoundAudio(asset.id, next)
      return
    }
    this.playlist?.handleAudioEnded()
  }

  updateStartup(patch) {
    const current = this.state.startupAnimation
    this.state.startupAnimation = {
      ...current,
      ...patch,
      audio: { ...current.audio, ...(patch.audio ?? {}) },
    }
    this.scheduleSave()
    this.emit()
  }

  updateStartupItem(id, patch) {
    const item = this.state.startupAnimation.items.find((entry) => entry.id === id)
    if (!item) return
    Object.assign(item, patch)
    this.scheduleSave()
    this.emit()
  }

  addStartupItem(assetId) {
    const asset = this.assetById(assetId)
    if (!asset) return false
    if (asset.kind !== 'video' && asset.kind !== 'gif') {
      this.toast('warning', '启动动画目前只支持 MP4 视频和 GIF 动图。')
      return false
    }
    if (asset.missing) {
      this.toast('warning', '这个素材文件已丢失，无法加入启动动画。')
      return false
    }
    const items = this.state.startupAnimation.items
    if (items.some((item) => item.assetId === assetId)) {
      this.toast('warning', '这个素材已经在启动动画列表中。')
      return false
    }
    items.push({ id: newId(), assetId, enabled: true })
    this.scheduleSave()
    this.emit()
    return true
  }

  removeStartupItem(id) {
    const items = this.state.startupAnimation.items
    const index = items.findIndex((item) => item.id === id)
    if (index < 0) return
    items.splice(index, 1)
    this.startup?.stopIfItem(id)
    this.startupPreview?.stopIfItem(id)
    this.scheduleSave()
    this.emit()
  }

  moveStartupItem(id, targetIndex) {
    const items = this.state.startupAnimation.items
    const index = items.findIndex((item) => item.id === id)
    if (index < 0) return
    const [item] = items.splice(index, 1)
    items.splice(clamp(targetIndex, 0, items.length), 0, item)
    this.scheduleSave()
    this.emit()
  }

  async importStartupFiles(paths) {
    const records = await this.importFiles(paths, 'media', { autoApply: false })
    const usable = records.filter((record) => record && (record.kind === 'video' || record.kind === 'gif'))
    for (const record of usable) this.addStartupItem(record.id)
    if (usable.length === 0 && records.length > 0) {
      this.toast('warning', '这些素材不是 MP4/GIF，已放入背景库，但不能作为启动动画。')
    }
    return usable
  }

  previewStartup(itemId) {
    const item = this.state.startupAnimation.items.find((entry) => entry.id === itemId)
    if (!item) return false
    const asset = this.assetById(item.assetId)
    if (!asset || asset.missing) {
      this.toast('warning', '启动动画文件不可用。')
      return false
    }
    return this.startupPreview?.preview(item, asset) === true
  }

  resetStartupFirstRun() {
    this.state.startupAnimation.firstRunDone = false
    this.scheduleSave()
    this.emit()
    this.toast('success', '首次启动记录已重置，下次启动会再次播放。')
  }

  toggleFavorite(id) {
    const asset = this.assetById(id)
    if (!asset) return
    asset.favorite = !asset.favorite
    this.scheduleSave()
    this.emit()
  }

  renameAsset(id, name) {
    const asset = this.assetById(id)
    if (!asset) return
    const trimmed = str(name).trim()
    if (trimmed.length === 0) return
    asset.name = trimmed.slice(0, 120)
    this.scheduleSave()
    this.emit()
  }

  async importFiles(paths, kind = 'media', options = {}) {
    if (this.importing) return []
    const list = paths.filter((entry) => typeof entry === 'string' && entry.length > 0)
    if (list.length === 0) {
      this.toast('warning', '没有拿到文件路径。请从本机文件选择器或拖拽导入。')
      return []
    }
    this.importing = true
    this.importProgress = null
    this.importText = '准备导入…'
    this.emit()
    try {
      const mode = this.state.global.importMode
      const created = []
      const events = await apiImport(list, mode, kind, (event) => {
        if (event.type === 'file') {
          if (event.phase === 'start') {
            this.importText = `正在复制 ${event.name}…`
            this.importProgress = { name: event.name, copied: 0, total: event.total || 0 }
          } else if (event.phase === 'progress') {
            this.importText = `正在复制 ${event.name}…`
            this.importProgress = { name: event.name, copied: event.copied || 0, total: event.total || 0 }
          } else if (event.phase === 'done') {
            created.push(event.record)
            this.importText = `已导入 ${event.name}`
            this.importProgress = null
          } else if (event.phase === 'duplicate') {
            this.importText = `${event.name} 已在素材库中`
          } else if (event.phase === 'error') {
            this.toast('error', `${event.name}：${event.error}`)
          }
          this.emit()
        }
      })
      const done = events.find((event) => event.type === 'done')
      const errors = done?.errors ?? []
      const records = (done?.created?.length ? done.created : created).filter(Boolean)
      for (const record of records) {
        if (kind === 'audio') {
          if (!this.state.audio.some((track) => track.id === record.id)) this.state.audio.push(record)
        } else {
          if (!this.state.assets.some((asset) => asset.id === record.id)) {
            this.state.assets.push(record)
            this.state.assetSettings[record.id] = normalizeSettings(this.state.assetSettings[record.id], record.kind)
          }
        }
      }
      for (const failure of errors) this.toast('error', `${failure.name || basename(failure.path)}：${failure.error}`)
      if (options.autoApply !== false) this.lastImportedId = records[0]?.id ?? null
      this.importing = false
      this.importText = ''
      this.importProgress = null
      this.scheduleSave()
      this.emit()

      for (const record of records) {
        try {
          if (kind === 'audio') await this.enrichAudio(record)
          else await this.enrichAsset(record)
        } catch (error) {
          this.toast('warning', `${record.name} 的预览信息读取失败：${error instanceof Error ? error.message : String(error)}`)
        }
      }

      if (kind === 'media' && records.length > 0 && !this.currentAsset() && options.autoApply !== false) {
        await this.applyAsset(records[0].id)
      }
      if (records.length > 0) {
        this.toast('success', `已导入 ${records.length} 个${kind === 'audio' ? '音频' : '背景'}。`)
      }
      return records
    } catch (error) {
      this.importing = false
      this.importText = ''
      this.importProgress = null
      this.toast('error', `导入失败：${error instanceof Error ? error.message : String(error)}`)
      this.emit()
      return []
    }
  }

  async enrichAsset(asset) {
    if (!asset) return
    const probed = await probeAsset(asset)
    Object.assign(asset, probed)
    asset.thumb = probed.thumb === true
    asset.thumbVersion = probed.thumb ? Date.now() : 0
    this.scheduleSave(200)
    this.emit()
  }

  /** Lazily read metadata and produce a thumbnail for libraries created elsewhere. */
  ensureAssetDetails(id) {
    const asset = this.assetById(id)
    if (!asset || asset.missing) return
    if (asset.width > 0 && asset.thumb) return
    if (this.detailsPending.has(id)) return
    this.detailsPending.add(id)
    this.enrichAsset(asset)
      .catch(() => {})
      .finally(() => this.detailsPending.delete(id))
  }

  async enrichAudio(track) {
    if (!track) return
    try {
      const duration = await probeAudioDuration(track)
      if (duration > 0) track.duration = duration
      track.lastUsedAt = new Date().toISOString()
    } catch (error) {
      track.probeError = error instanceof Error ? error.message : String(error)
    }
    this.scheduleSave(200)
    this.emit()
  }

  async applyAsset(id, options = {}) {
    const asset = this.assetById(id)
    if (!asset) {
      this.toast('error', '素材不存在。')
      return false
    }
    if (asset.missing) {
      this.toast('error', `文件已丢失：${asset.name}。请重新定位后再应用。`)
      return false
    }
    this.ensureAssetDetails(id)
    this.playlist?.stop({ keepBackground: true, silent: true })
    const settings = this.settingsFor(id)
    try {
      const handle = await this.renderer.show(asset, settings, { paused: options.paused === true })
      if (!handle) return false
      this.audio.applyForAsset(asset, settings, handle.video)
      if (options.paused) {
        this.renderer.pause()
        this.audio.pauseExternal()
      }
      asset.lastUsedAt = new Date().toISOString()
      this.state.runtime = {
        mode: 'single',
        assetId: id,
        playlistId: null,
        itemIndex: 0,
        playing: options.paused ? false : true,
        updatedAt: Date.now(),
      }
      this.scheduleSave()
      this.emit()
      return true
    } catch (error) {
      this.toast('error', `无法应用背景：${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  async restoreRuntime() {
    if (!this.state.global.startup.restore) return
    const runtime = this.state.runtime
    const autoPlay = this.state.global.startup.autoPlay !== false
    if (runtime.mode === 'playlist' && runtime.playlistId && this.playlistById(runtime.playlistId)) {
      const playlist = this.playlistById(runtime.playlistId)
      if (playlist.items.length > 0) {
        await this.playlist.start(runtime.playlistId, runtime.itemIndex, {
          paused: !runtime.playing || !autoPlay || this.deferBackgroundVideo,
        })
        return
      }
    }
    if (runtime.assetId && this.assetById(runtime.assetId)) {
      await this.applyAsset(runtime.assetId, {
        paused: !runtime.playing || !autoPlay || this.deferBackgroundVideo,
      })
    }
  }

  togglePlay() {
    if (this.state.runtime.mode === 'playlist') {
      if (!this.playlist) return
      if (this.playlist.playing) this.playlist.pause()
      else this.playlist.resume()
      return
    }
    const asset = this.currentAsset()
    if (!asset) return
    if (this.state.runtime.playing) {
      this.renderer.pause()
      this.audio.pauseExternal()
      this.state.runtime.playing = false
    } else {
      this.renderer.resume()
      this.audio.resumeExternal()
      this.state.runtime.playing = true
    }
    this.scheduleSave()
    this.emit()
  }

  stopPlayback() {
    this.playlist?.stop({ keepBackground: true })
    this.renderer?.pause()
    this.audio?.stopExternal(240)
    this.state.runtime.playing = false
    this.scheduleSave()
    this.emit()
  }

  async relocate(id, filePath) {
    try {
      const result = await apiRelocate(id, filePath)
      const record = result.record
      const target = this.assetById(id)
      if (target) Object.assign(target, record)
      else {
        const track = this.audioById(id)
        if (track) Object.assign(track, record)
      }
      if (target) await this.enrichAsset(target)
      this.scheduleSave()
      this.emit()
      if (target && this.state.runtime.assetId === id) await this.applyAsset(id)
      this.toast('success', '文件已重新定位。')
    } catch (error) {
      this.toast('error', `重新定位失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  removeAsset(id) {
    const asset = this.assetById(id)
    if (!asset) return
    this.startup?.stopIfAsset(id)
    this.startupPreview?.stopIfAsset(id)
    this.state.assets = this.state.assets.filter((entry) => entry.id !== id)
    delete this.state.assetSettings[id]
    for (const playlist of this.state.playlists) {
      playlist.items = playlist.items.filter((item) => item.assetId !== id)
    }
    this.state.startupAnimation.items = this.state.startupAnimation.items.filter((item) => item.assetId !== id)
    if (this.state.runtime.assetId === id || this.playlist?.currentAssetId === id) {
      this.playlist?.stop({ keepBackground: false, silent: true })
      this.renderer?.hide()
      this.state.runtime = { ...defaultClientState().runtime }
    }
    this.scheduleSave()
    this.emit()
  }

  removeAudio(id) {
    const usedBy = this.state.assets.filter((asset) => (this.settingsFor(asset.id).audioIds ?? []).includes(id) || this.settingsFor(asset.id).audioId === id)
    this.state.audio = this.state.audio.filter((track) => track.id !== id)
    for (const asset of usedBy) {
      const settings = this.settingsFor(asset.id)
      const ids = (settings.audioIds ?? []).filter((entry) => entry !== id)
      settings.audioIds = ids
      if (settings.audioId === id) {
        settings.audioIndex = Math.min(settings.audioIndex ?? 0, Math.max(0, ids.length - 1))
        settings.audioId = ids[settings.audioIndex] ?? null
      }
      if (ids.length === 0 && (settings.audioMode === 'external' || settings.audioMode === 'mix')) {
        settings.audioMode = asset.kind === 'video' ? 'video' : 'mute'
      }
      if (ids.length < 2 && settings.audioEndAction === 'nextTrack') settings.audioEndAction = 'none'
    }
    if (this.audioPreviewId === id) this.stopPreview()
    const startupAudio = this.state.startupAnimation.audio
    if (startupAudio.audioId === id) {
      startupAudio.audioId = null
      if (startupAudio.mode === 'external') startupAudio.mode = 'mute'
    }
    if (this.currentAsset() && usedBy.some((asset) => asset.id === this.currentAsset().id)) {
      this.audio.applyForAsset(this.currentAsset(), this.currentSettings(), this.renderer.currentVideo)
    }
    this.scheduleSave()
    this.emit()
  }

  togglePreviewAudio(id) {
    if (this.audioPreviewId === id) {
      this.stopPreview()
      return
    }
    const track = this.audioById(id)
    if (!track || track.missing) {
      this.toast('warning', '音频文件不可用。')
      return
    }
    this.audioPreviewId = id
    this.audio.startPreview(track, () => {
      this.audioPreviewId = null
      this.emit()
    })
    this.emit()
  }

  stopPreview() {
    this.audio.stopPreview()
    this.audioPreviewId = null
    this.emit()
  }

  audioUsage(id) {
    return this.state.assets.filter((asset) => this.settingsFor(asset.id).audioId === id).length
  }

  createPlaylist(name) {
    const playlist = {
      id: newId(),
      name: str(name, '新的轮播').trim() || '新的轮播',
      items: [],
      shuffle: 'off',
      loop: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    }
    this.state.playlists.push(playlist)
    this.scheduleSave()
    this.emit()
    return playlist
  }

  duplicatePlaylist(id) {
    const source = this.playlistById(id)
    if (!source) return null
    const copy = {
      ...source,
      id: newId(),
      name: `${source.name} 副本`,
      items: source.items.map((item) => ({ ...item, id: newId() })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.state.playlists.push(copy)
    this.scheduleSave()
    this.emit()
    return copy
  }

  renamePlaylist(id, name) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    const trimmed = str(name).trim()
    if (trimmed.length === 0) return
    playlist.name = trimmed.slice(0, 80)
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  updatePlaylist(id, patch) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    Object.assign(playlist, patch)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === id) this.playlist?.rescheduleDwell()
    this.scheduleSave()
    this.emit()
  }

  deletePlaylist(id) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    this.state.playlists = this.state.playlists.filter((entry) => entry.id !== id)
    if (this.state.runtime.playlistId === id) {
      this.playlist?.stop({ keepBackground: true, silent: true })
      this.state.runtime = { ...defaultClientState().runtime, assetId: this.renderer?.currentAsset?.id ?? null }
    }
    this.scheduleSave()
    this.emit()
  }

  addPlaylistItems(id, assetIds) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    const existing = new Set(playlist.items.map((item) => item.assetId))
    for (const assetId of assetIds) {
      if (existing.has(assetId)) continue
      const asset = this.assetById(assetId)
      if (!asset) continue
      playlist.items.push({
        id: newId(),
        assetId,
        dwellMode: 'default',
        dwellSeconds: this.state.global.defaultDwellSeconds,
      })
      existing.add(assetId)
    }
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  removePlaylistItem(playlistId, itemId) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    playlist.items = playlist.items.filter((item) => item.id !== itemId)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === playlistId) this.playlist?.refreshQueue()
    this.scheduleSave()
    this.emit()
  }

  movePlaylistItem(playlistId, itemId, targetIndex) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    const index = playlist.items.findIndex((item) => item.id === itemId)
    if (index < 0) return
    const [item] = playlist.items.splice(index, 1)
    const next = clamp(targetIndex, 0, playlist.items.length)
    playlist.items.splice(next, 0, item)
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  updatePlaylistItem(playlistId, itemId, patch) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    const item = playlist.items.find((entry) => entry.id === itemId)
    if (!item) return
    Object.assign(item, patch)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === playlistId) this.playlist?.rescheduleDwell()
    this.scheduleSave()
    this.emit()
  }

  async startPlaylist(id, options = {}) {
    const playlist = this.playlistById(id)
    if (!playlist) {
      this.toast('error', '轮播方案不存在。')
      return false
    }
    if (playlist.items.length === 0) {
      this.toast('warning', '这个轮播方案还没有素材。')
      return false
    }
    try {
      const ok = await this.playlist.start(id, options.index ?? 0, options)
      if (ok) this.toast('success', `开始轮播：${playlist.name}`)
      return ok
    } catch (error) {
      this.toast('error', `轮播启动失败：${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  stopPlaylist() {
    this.playlist?.stop({ keepBackground: true })
    this.state.runtime.playing = false
    this.scheduleSave()
    this.emit()
  }

  togglePausePlaylist() {
    if (!this.playlist) return
    if (this.playlist.playing) this.playlist.pause()
    else this.playlist.resume()
  }

  nextPlaylist() {
    this.playlist?.next('manual')
  }

  prevPlaylist() {
    this.playlist?.previous('manual')
  }

  openPanel() {
    try {
      this.ctx?.get?.('layout')?.selectPanel?.(PANEL_KEY)
    } catch {
      /* layout service may be absent */
    }
  }

  dispose() {
    window.removeEventListener('pagehide', this.onPageHide)
    window.removeEventListener('dbs:startup-started', this.onInjectedStart)
    window.removeEventListener('dbs:startup-ended', this.onInjectedEnd)
    window.removeEventListener('dbs:startup-skip', this.onInjectedSkip)
    window.removeEventListener('dbs:startup-ending', this.onInjectedEnding)
    if (this.deferredStartTimer) {
      window.clearTimeout(this.deferredStartTimer)
      this.deferredStartTimer = 0
    }
    if (this.deferredTimer) {
      window.clearTimeout(this.deferredTimer)
      this.deferredTimer = 0
    }
    this.releaseInjectedSuppression()
    this.startup?.dispose()
    this.startupPreview?.dispose()
    this.playlist?.dispose()
    this.audio?.dispose()
    this.renderer?.dispose()
    if (this.saveTimer) window.clearTimeout(this.saveTimer)
    this.listeners.clear()
  }
}

