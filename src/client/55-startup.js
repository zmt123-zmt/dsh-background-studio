/* =========================================================================
 * 55-startup — startup animation controller.
 *
 * Mode A: a frame-wide, window-internal overlay above the app.
 * Mode B: a temporary layer inside the existing background stage, behind the
 *          DSH UI; it fades away to reveal the already-running background.
 *
 * The controller never re-creates the background/playlist/audio graph. It only
 * suppresses the master background gain while the startup owns the screen.
 * ========================================================================= */

class StartupController {
  constructor(studio, options = {}) {
    this.studio = studio
    this.kind = options.kind === 'preview' ? 'preview' : 'startup'
    this.active = null
    this.layer = null
    this.controls = null
    this.media = null
    this.audioEl = null
    this.endTimer = 0
    this.holdTimer = 0
    this.fadeTimer = 0
    this.backgroundPromise = Promise.resolve()
    this.sessionKey = 'dbs.startup.bootId'
    this.legacySessionKey = 'dbs.startup.consumed'
    this.memoryConsumed = false
    this.started = false
    this.phase = 'idle'
    this.onKey = (event) => {
      if (!this.active) return
      if (this.kind === 'startup' && this.studio.startupPreview?.active) return
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault()
        this.complete('skip')
        return
      }
      if ((event.key === ' ' || event.key === 'Enter') && this.studio.state.startupAnimation.skip) {
        event.preventDefault()
        this.complete('skip')
      }
    }
  }

  config() {
    return this.studio.state.startupAnimation
  }

  sessionConsumed() {
    if (this.memoryConsumed) return true
    const bootId = this.studio.bootId
    try {
      if (bootId) return window.sessionStorage.getItem(this.sessionKey) === bootId
      // Compatibility with an older Host that does not expose bootId.
      return window.sessionStorage.getItem(this.legacySessionKey) === '1'
    } catch {
      return false
    }
  }

  markSessionConsumed() {
    this.memoryConsumed = true
    const bootId = this.studio.bootId
    try {
      if (bootId) window.sessionStorage.setItem(this.sessionKey, bootId)
      else window.sessionStorage.setItem(this.legacySessionKey, '1')
    } catch {
      /* the in-memory marker still prevents a second run in this page */
    }
  }

  resetSession() {
    this.memoryConsumed = false
    try {
      window.sessionStorage.removeItem(this.sessionKey)
      window.sessionStorage.removeItem(this.legacySessionKey)
    } catch {
      /* ignore */
    }
  }

  setBackgroundPromise(promise) {
    this.backgroundPromise = promise ?? Promise.resolve()
  }

  candidates() {
    const config = this.config()
    return config.items
      .filter((item) => item.enabled !== false)
      .map((item) => ({ item, asset: this.studio.assetById(item.assetId) }))
      .filter(({ asset }) => asset && !asset.missing && (asset.kind === 'video' || asset.kind === 'gif'))
  }

  /** Decide once per boot; returns a plan or null. */
  prepare() {
    if (this.kind !== 'startup') return null
    // The injected boot script owns the formal startup so its overlay can be
    // on screen before the app bundle. This controller is only the fallback
    // for a Host that does not deliver index injections.
    if (window.__DBS_BOOT__?.decided === true) return null
    const config = this.config()
    // Do not consume the boot marker here. A page may be created and reloaded
    // before the overlay is actually shown; marking at decision time causes a
    // real cold start to be skipped. The marker is written when a formal
    // startup actually begins (and again once playback starts).
    if (!config.enabled) return null
    if (this.sessionConsumed()) return null
    if (config.trigger === 'firstLaunch' && config.firstRunDone) return null
    const list = this.candidates()
    if (list.length === 0) {
      if (config.enabled) this.studio.toast('warning', '启动动画已启用，但没有可用的 MP4/GIF 素材，已直接进入主界面。')
      return null
    }
    const chosen = config.trigger === 'random'
      ? list[Math.floor(Math.random() * list.length)]
      : list[0]
    return { item: chosen.item, asset: chosen.asset }
  }

  begin(plan, options = {}) {
    if (this.active || !plan) return false
    const preview = options.preview === true
    const config = this.config()
    this.active = {
      plan,
      preview,
      mode: preview ? 'fullscreen' : config.mode,
      config,
      reason: '',
    }
    this.started = false
    this.phase = 'loading'
    this.studio.audio.beginStartupSuppression()
    this.buildLayer()
    this.attachKeys()
    if (!preview && this.kind === 'startup') this.markSessionConsumed()
    this.playMedia().catch((error) => this.fail(error))
    return true
  }

  preview(item, asset) {
    if (this.active) return false
    return this.begin({ item, asset }, { preview: true })
  }

  buildLayer() {
    const { plan, mode, preview } = this.active
    const asset = plan.asset
    const config = this.active.config
    const layer = document.createElement('div')
    layer.className = mode === 'fullscreen' ? 'dbs-startup-overlay' : 'dbs-startup-layer'
    layer.id = mode === 'fullscreen' ? 'dbs-startup-overlay' : 'dbs-startup-layer'
    layer.dataset.mode = mode
    layer.dataset.preview = preview ? '1' : '0'
    layer.style.opacity = '0'
    layer.style.transitionProperty = 'opacity'
    layer.style.transitionTimingFunction = 'ease'
    layer.style.transitionDuration = `${clamp(num(config.fadeInMs, 500), 0, 5000)}ms`
    layer.style.backgroundSize = 'cover'
    layer.style.backgroundPosition = 'center center'
    layer.style.backgroundRepeat = 'no-repeat'
    if (asset.thumb && asset.kind !== 'video') layer.style.backgroundImage = `url("${thumbUrl(asset)}")`

    const mediaWrap = document.createElement('div')
    mediaWrap.className = 'dbs-startup-media'
    const media = asset.kind === 'video' ? document.createElement('video') : document.createElement('img')
    media.className = 'dbs-startup-asset'
    media.setAttribute('aria-hidden', 'true')
    if (asset.kind === 'video') {
      media.src = mediaUrl(asset.id)
      media.preload = 'auto'
      media.playsInline = true
      media.loop = false
      media.muted = config.audio.mode !== 'video'
      media.volume = clamp(num(config.audio.volume, 1), 0, 1)
    } else {
      media.src = mediaUrl(asset.id)
      media.alt = ''
      media.draggable = false
    }
    media.style.objectFit = config.display === 'contain' ? 'contain' : config.display === 'center' ? 'none' : 'cover'
    media.style.objectPosition = 'center center'
    mediaWrap.appendChild(media)
    layer.appendChild(mediaWrap)

    if (mode === 'fullscreen') {
      const hint = document.createElement('div')
      hint.className = 'dbs-startup-hint'
      hint.textContent = preview ? '启动动画预览' : '正在启动'
      layer.appendChild(hint)
      if (config.skip || preview) layer.appendChild(this.makeSkipButton(preview))
      document.body.appendChild(layer)
    } else {
      this.studio.renderer.beginStartupBackground()
      this.studio.renderer.root.appendChild(layer)
      const controls = document.createElement('div')
      controls.className = 'dbs-startup-controls'
      if (config.skip) controls.appendChild(this.makeSkipButton(false))
      document.body.appendChild(controls)
      this.controls = controls
    }

    this.layer = layer
    this.media = media
  }

  makeSkipButton(preview) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'dbs-startup-skip'
    button.textContent = preview ? '关闭预览' : '跳过启动动画'
    const stop = (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.complete('skip')
    }
    // pointerdown is more reliable than click if a transparent always-on-top
    // helper window (for example the desktop pet) overlaps part of the screen.
    // pointerdown also avoids waiting for a full click gesture.
    button.addEventListener('pointerdown', stop)
    button.addEventListener('click', stop)
    this.skipButton = button
    return button
  }

  attachKeys() {
    document.addEventListener('keydown', this.onKey, true)
  }

  detachKeys() {
    document.removeEventListener('keydown', this.onKey, true)
  }

  async playMedia() {
    const { plan, preview } = this.active
    const asset = plan.asset
    const config = this.active.config
    const isVideo = asset.kind === 'video'

    if (isVideo) {
      try {
        if (this.media.readyState < 2) await waitForEvent(this.media, 'loadeddata', 12000)
        try {
          await this.media.play()
        } catch {
          this.media.muted = true
          await this.media.play()
          this.studio.toast('warning', '系统拦截了启动动画自动播放，已静音播放。')
        }
      } catch (error) {
        throw new Error(`视频加载失败：${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      if (!(this.media.complete && this.media.naturalWidth > 0)) {
        await waitForEvent(this.media, 'load', 12000)
      }
    }

    if (!this.active) return
    this.started = true
    this.studio.markTimeline?.('startup-media-ready', asset.kind)
    if (this.layer && this.layer.style.backgroundImage) {
      const posterLayer = this.layer
      window.setTimeout(() => {
        if (this.layer === posterLayer && this.active) posterLayer.style.backgroundImage = 'none'
      }, 600)
    }
    await this.startAudio()

    if (!this.active) return
    const layer = this.layer
    if (layer) {
      const fadeIn = clamp(num(config.fadeInMs, 500), 0, 5000)
      if (fadeIn <= 0) layer.style.opacity = '1'
      else requestAnimationFrame(() => {
        if (this.layer === layer) layer.style.opacity = '1'
      })
    }
    if (!preview && this.kind === 'startup') {
      if (!config.firstRunDone) {
        config.firstRunDone = true
        this.studio.scheduleSave(300)
      }
      this.markSessionConsumed()
    }
    const target = this.targetDuration(asset)
    this.phase = 'playing'
    this.endTimer = window.setTimeout(() => this.complete('timer'), target)
  }

  targetDuration(asset) {
    const config = this.active.config
    if (config.durationMode === 'custom') return clamp(num(config.customSeconds, 8) * 1000, 500, 300000)
    const mediaDuration = asset.kind === 'video' && this.media && Number.isFinite(this.media.duration) ? this.media.duration : 0
    if (mediaDuration > 0) return clamp(mediaDuration * 1000, 500, 300000)
    if (asset.duration > 0) return clamp(asset.duration * 1000, 500, 300000)
    return 8000
  }

  async startAudio() {
    const { plan } = this.active
    const asset = plan.asset
    const config = this.active.config
    const mode = config.audio.mode
    const volume = clamp(num(config.audio.volume, 1), 0, 1)
    if (mode === 'mute') {
      if (asset.kind === 'video') this.media.muted = true
      return
    }
    if (mode === 'video') {
      if (asset.kind === 'video') {
        this.media.muted = false
        this.media.volume = volume
      }
      return
    }
    if (mode === 'external') {
      if (asset.kind === 'video') this.media.muted = true
      const track = this.studio.audioById(config.audio.audioId)
      if (!track || track.missing) {
        this.studio.toast('warning', '启动动画关联的音频不可用，已静音播放。')
        return
      }
      const audio = document.createElement('audio')
      audio.preload = 'auto'
      audio.src = audioUrl(track.id)
      audio.volume = volume
      audio.loop = false
      this.audioEl = audio
      try {
        await audio.play()
      } catch {
        this.studio.toast('warning', '启动动画音频被自动播放策略拦截。')
      }
    }
  }

  stopStartupAudio() {
    if (this.audioEl) {
      try {
        this.audioEl.pause()
        this.audioEl.removeAttribute('src')
        this.audioEl.load()
      } catch {
        /* ignore */
      }
      this.audioEl = null
    }
    if (this.media && this.media.tagName === 'VIDEO') {
      try {
        this.media.muted = true
      } catch {
        /* ignore */
      }
    }
  }

  complete(reason) {
    if (!this.active || this.phase === 'leaving' || this.phase === 'finished') return
    this.phase = 'holding'
    this.clearTimers()
    const config = this.active.config
    if (this.active.preview || reason === 'skip') {
      this.leave(reason)
      return
    }
    if (this.active.mode === 'background' && config.holdMs > 0) {
      this.holdTimer = window.setTimeout(() => this.leave(reason), clamp(num(config.holdMs, 0), 0, 10000))
      return
    }
    this.leave(reason)
  }

  async leave(reason) {
    if (!this.active) return
    this.phase = 'leaving'
    this.clearTimers()
    const active = this.active
    const config = active.config
    const fade = reason === 'skip' ? Math.min(300, clamp(num(config.fadeOutMs, 700), 0, 5000)) : clamp(num(config.fadeOutMs, 700), 0, 5000)
    if (!active.preview) {
      // Do not reveal a blank/default stage while the restored background is
      // still loading. A skip gets a much shorter grace period.
      const waitMs = reason === 'skip' ? 1500 : 8000
      this.studio.markTimeline?.('startup-wait-background', `max ${waitMs}ms`)
      await Promise.race([this.backgroundPromise, sleep(waitMs)]).catch(() => {})
      this.studio.markTimeline?.('startup-background-wait-done')
    }
    if (!this.active || this.active !== active) return
    if (this.layer) {
      this.layer.style.transitionDuration = `${fade}ms`
      this.layer.style.opacity = '0'
    }
    if (this.skipButton) this.skipButton.disabled = true
    this.fadeTimer = window.setTimeout(() => this.finish(reason), fade + 80)
  }

  finish(reason) {
    if (!this.active) return
    const active = this.active
    this.active = null
    this.phase = 'finished'
    this.clearTimers()
    this.detachKeys()
    this.stopStartupAudio()
    if (this.media) {
      try {
        this.media.pause?.()
        this.media.removeAttribute('src')
        this.media.load?.()
      } catch {
        /* ignore */
      }
      this.media = null
    }
    if (this.layer?.parentNode) this.layer.parentNode.removeChild(this.layer)
    this.layer = null
    if (this.controls?.parentNode) this.controls.parentNode.removeChild(this.controls)
    this.controls = null
    this.skipButton = null
    if (active.mode === 'background') this.studio.renderer?.endStartupBackground()
    this.studio.audio.endStartupSuppression()
    if (active.preview) {
      this.studio.emit()
      return
    }
    this.studio.markTimeline?.('startup-finished', reason)
    if (reason === 'error') this.studio.toast('error', '启动动画播放失败，已跳过。')
    this.studio.scheduleSave(300)
    this.studio.emit()
  }

  fail(error) {
    if (!this.active) return
    console.warn('[dsh-background-studio] startup animation failed', error)
    this.active.reason = 'error'
    this.finish('error')
  }

  stopIfItem(itemId) {
    if (this.active?.plan?.item?.id !== itemId) return
    this.finish('removed')
  }

  stopIfAsset(assetId) {
    if (this.active?.plan?.asset?.id !== assetId) return
    this.finish('removed')
  }

  clearTimers() {
    if (this.endTimer) window.clearTimeout(this.endTimer)
    if (this.holdTimer) window.clearTimeout(this.holdTimer)
    if (this.fadeTimer) window.clearTimeout(this.fadeTimer)
    this.endTimer = 0
    this.holdTimer = 0
    this.fadeTimer = 0
  }

  dispose() {
    this.clearTimers()
    this.detachKeys()
    if (this.active) this.finish('dispose')
    if (this.layer?.parentNode) this.layer.parentNode.removeChild(this.layer)
    if (this.controls?.parentNode) this.controls.parentNode.removeChild(this.controls)
    this.layer = null
    this.controls = null
    this.media = null
    this.audioEl = null
    this.active = null
  }
}
