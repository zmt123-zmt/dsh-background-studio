/* =========================================================================
 * 30-renderer — the only place that owns the body-level background layer.
 * Two layers (A/B) allow fades without rebuilding the whole stage.
 * ========================================================================= */

class Renderer {
  constructor(studio) {
    this.studio = studio
    this.root = null
    this.layers = []
    this.activeIndex = 0
    this.currentAsset = null
    this.currentVideo = null
    this.currentSettings = null
    this.opacity = 1
    this.surface = { dark: 0.34, light: 0.62 }
    this.token = 0
    this.hiddenByOpacity = false
    this.startupBackground = false
    this.deferredPosterLayer = null
  }

  mount() {
    if (this.root !== null) return
    const previous = document.getElementById('dbs-root')
    if (previous?.parentNode) previous.parentNode.removeChild(previous)
    const root = document.createElement('div')
    root.id = 'dbs-root'
    root.dataset.visible = '0'
    root.setAttribute('aria-hidden', 'true')
    for (let index = 0; index < 2; index += 1) {
      const layer = document.createElement('div')
      layer.className = 'dbs-layer'
      layer.dataset.slot = index === 0 ? 'a' : 'b'
      root.appendChild(layer)
      this.layers.push(layer)
    }
    document.body.insertBefore(root, document.body.firstChild)
    this.root = root
    this.setSurface(this.surface)
    this.injectTokens()
  }

  injectTokens() {
    for (const stale of Array.from(document.querySelectorAll('style[data-dbs="tokens"]'))) stale.remove()
    const style = document.createElement('style')
    style.dataset.dbs = 'tokens'
    style.textContent = `
      html[data-dbs="on"] body {
        background-color: transparent !important;
        --dsw-alias-bg-base: rgba(18, 20, 26, var(--dbs-surface-dark, .34)) !important;
        --dsw-alias-bg-layer-1: rgba(24, 27, 35, var(--dbs-layer1-dark, .46)) !important;
        --dsw-alias-bg-layer-2: rgba(31, 35, 45, var(--dbs-layer2-dark, .54)) !important;
        --dsw-alias-bg-layer-3: rgba(38, 42, 53, var(--dbs-layer3-dark, .60)) !important;
        --dsw-specific-sidebar-fill: rgba(17, 19, 25, var(--dbs-sidebar-dark, .30)) !important;
      }
      html[data-dbs="on"] body:not([data-ds-dark-theme]) {
        --dsw-alias-bg-base: rgba(255, 255, 255, var(--dbs-surface-light, .62)) !important;
        --dsw-alias-bg-layer-1: rgba(255, 255, 255, var(--dbs-layer1-light, .72)) !important;
        --dsw-alias-bg-layer-2: rgba(255, 255, 255, var(--dbs-layer2-light, .80)) !important;
        --dsw-alias-bg-layer-3: rgba(255, 255, 255, var(--dbs-layer3-light, .86)) !important;
        --dsw-specific-sidebar-fill: rgba(249, 250, 251, var(--dbs-sidebar-light, .64)) !important;
      }
      #dbs-root {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        background: #05070b;
        opacity: 0;
        transition: opacity var(--dbs-root-fade, 420ms) ease;
      }
      #dbs-root[data-visible="1"] { opacity: 1; }
      #dbs-root .dbs-layer {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity var(--dbs-fade, 420ms) ease;
        will-change: opacity;
      }
      #dbs-root .dbs-layer > img,
      #dbs-root .dbs-layer > video {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        outline: 0;
        max-width: none;
        max-height: none;
        background: #05070b;
        user-select: none;
        -webkit-user-drag: none;
      }
      @media (prefers-reduced-motion: reduce) {
        #dbs-root .dbs-layer { transition-duration: 1ms; }
      }
    `
    document.head.appendChild(style)
    this.tokenStyle = style
  }

  setSurface(surface) {
    this.surface = {
      dark: clamp(num(surface?.dark, 0.34), 0.05, 0.92),
      light: clamp(num(surface?.light, 0.62), 0.05, 0.95),
    }
    const root = document.documentElement
    const dark = this.surface.dark
    const light = this.surface.light
    root.style.setProperty('--dbs-surface-dark', String(dark))
    root.style.setProperty('--dbs-layer1-dark', String(clamp(dark + 0.10, 0, 0.96)))
    root.style.setProperty('--dbs-layer2-dark', String(clamp(dark + 0.18, 0, 0.97)))
    root.style.setProperty('--dbs-layer3-dark', String(clamp(dark + 0.24, 0, 0.98)))
    root.style.setProperty('--dbs-sidebar-dark', String(clamp(dark - 0.04, 0.04, 0.92)))
    root.style.setProperty('--dbs-surface-light', String(light))
    root.style.setProperty('--dbs-layer1-light', String(clamp(light + 0.10, 0, 0.97)))
    root.style.setProperty('--dbs-layer2-light', String(clamp(light + 0.18, 0, 0.98)))
    root.style.setProperty('--dbs-layer3-light', String(clamp(light + 0.24, 0, 0.99)))
    root.style.setProperty('--dbs-sidebar-light', String(clamp(light + 0.02, 0.05, 0.96)))
    this.updateTokens()
  }

  updateTokens() {
    const enabled = this.root !== null && (this.startupBackground || (this.currentAsset !== null && this.opacity > 0.001))
    document.documentElement.dataset.dbs = enabled ? 'on' : 'off'
    if (enabled) {
      this.root.dataset.visible = '1'
      this.root.style.opacity = '1'
    } else {
      this.root.dataset.visible = '0'
    }
  }

  /** Keep the background stage visible while a Mode B startup layer is over it. */
  beginStartupBackground() {
    this.startupBackground = true
    this.updateTokens()
  }

  endStartupBackground() {
    this.startupBackground = false
    this.updateTokens()
    if (this.currentVideo && this.studio.isPlaying()) {
      this.hiddenByOpacity = false
      this.currentVideo.play().catch(() => {})
    }
  }

  setMediaFit(element, asset, settings) {
    const display = settings.display
    const scale = clamp(num(settings.scale, 1), 0.1, 4)
    element.style.objectPosition = 'center center'
    element.style.transform = 'none'
    element.style.transformOrigin = 'center center'
    if (display === 'contain') element.style.objectFit = 'contain'
    else if (display === 'center' || display === 'original') element.style.objectFit = 'none'
    else if (display === 'custom') {
      element.style.objectFit = 'none'
      element.style.transform = `scale(${scale})`
    } else element.style.objectFit = 'cover'
  }

  applyDisplay(asset, settings) {
    const layer = this.layers[this.activeIndex]
    const media = layer?.firstElementChild
    if (media) this.setMediaFit(media, asset, settings)
    if (this.currentSettings) this.currentSettings = settings
  }

  setDisplay(settings) {
    if (!this.currentAsset) return
    this.currentSettings = settings
    this.applyDisplay(this.currentAsset, settings)
  }

  setOpacity(value) {
    const opacity = clamp(num(value, 1), 0, 1)
    this.opacity = opacity
    if (this.root === null) return
    if (opacity <= 0.001) {
      if (!this.startupBackground) {
        this.root.dataset.visible = '0'
        document.documentElement.dataset.dbs = 'off'
      }
      if (this.currentVideo && !this.currentVideo.paused) {
        this.hiddenByOpacity = true
        this.currentVideo.pause()
      }
      return
    }
    document.documentElement.dataset.dbs = 'on'
    this.root.dataset.visible = '1'
    for (let index = 0; index < this.layers.length; index += 1) {
      const layer = this.layers[index]
      if (index === this.activeIndex) layer.style.opacity = String(opacity)
      else layer.style.opacity = '0'
    }
    if (this.hiddenByOpacity && this.currentVideo) {
      this.hiddenByOpacity = false
      this.currentVideo.play().catch(() => {})
    }
  }

  setLoop(loop) {
    if (this.currentVideo) this.currentVideo.loop = loop !== false
  }

  /** Cancel an in-flight show without changing the currently visible layer. */
  invalidate() {
    this.token += 1
  }

  clearLayer(layer) {
    if (!layer) return
    const media = layer.firstElementChild
    if (media) {
      if (media.tagName === 'VIDEO') this.studio.audio?.releaseVideo(media)
      try {
        media.pause?.()
      } catch {
        /* ignore */
      }
      try {
        media.removeAttribute('src')
        media.load?.()
      } catch {
        /* ignore */
      }
      layer.removeChild(media)
    }
    layer.style.opacity = '0'
    layer.style.backgroundImage = 'none'
  }

  createVideo(asset, settings) {
    const video = document.createElement('video')
    video.className = 'dbs-media dbs-video'
    video.src = mediaUrl(asset.id)
    video.preload = 'auto'
    video.playsInline = true
    video.loop = settings.loop !== false
    video.muted = this.studio.audio?.startupSuppressed === true
    video.volume = 1
    video.disablePictureInPicture = true
    video.addEventListener('error', () => {
      const message = video.error ? `视频播放失败（code ${video.error.code}）` : '视频播放失败'
      this.studio.toast('error', `${asset.name}：${message}`)
      this.studio.playlist?.handleMediaError(asset.id)
    }, { once: true })
    video.addEventListener('ended', () => {
      this.studio.playlist?.handleMediaEnded(video)
    })
    return video
  }

  createImage(asset) {
    const image = document.createElement('img')
    image.className = 'dbs-media dbs-image'
    image.alt = ''
    image.decoding = 'async'
    image.draggable = false
    image.src = mediaUrl(asset.id)
    return image
  }

  async waitReady(media, isVideo) {
    if (isVideo) {
      if (media.readyState >= 2) return
      await waitForEvent(media, 'loadeddata', 15000)
      return
    }
    if (media.complete && media.naturalWidth > 0) return
    await waitForEvent(media, 'load', 15000)
  }

  async show(asset, settings, options = {}) {
    this.mount()
    const token = ++this.token
    const targetIndex = this.activeIndex === 0 ? 1 : 0
    const oldIndex = this.activeIndex
    const target = this.layers[targetIndex]
    const old = this.layers[oldIndex]
    const previous = {
      asset: this.currentAsset,
      settings: this.currentSettings,
      opacity: this.opacity,
      video: this.currentVideo,
    }
    this.clearLayer(target)

    const isVideo = asset.kind === 'video'
    const desired = clamp(num(settings.opacity, 1), 0, 1)
    const media = isVideo ? this.createVideo(asset, settings) : this.createImage(asset)
    this.setMediaFit(media, asset, settings)
    media.style.opacity = '1'
    target.appendChild(media)
    target.style.transitionDuration = `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`
    target.style.backgroundSize = 'cover'
    target.style.backgroundPosition = 'center center'
    target.style.backgroundRepeat = 'no-repeat'
    if (asset.thumb && desired > 0.001) target.style.backgroundImage = `url("${thumbUrl(asset)}")`
    else target.style.backgroundImage = 'none'
    target.style.opacity = '0'
    this.root.style.setProperty('--dbs-fade', `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`)
    this.root.style.setProperty('--dbs-root-fade', `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`)

    // Claim the stage immediately so the poster/thumbnail (or the image itself)
    // is visible while a large video reaches loadeddata. Previously the current
    // asset stayed null until `loadeddata`, so the whole background remained
    // hidden for seconds on a 4K video.
    this.currentAsset = asset
    this.currentSettings = settings
    this.currentVideo = isVideo ? media : null
    this.opacity = desired
    this.updateTokens()
    this.studio.markTimeline?.('background-visible', asset.kind)
    if (desired > 0.001) {
      old.style.opacity = '0'
      target.style.opacity = String(desired)
    }

    try {
      await this.waitReady(media, isVideo)
    } catch (error) {
      this.clearLayer(target)
      if (token === this.token) {
        this.currentAsset = previous.asset
        this.currentSettings = previous.settings
        this.opacity = previous.opacity
        this.currentVideo = previous.video
        if (previous.asset && old) old.style.opacity = String(previous.opacity)
        this.updateTokens()
        this.studio.toast('error', `${asset.name}：${error instanceof Error ? error.message : String(error)}`)
      }
      throw error
    }
    if (token !== this.token) {
      this.clearLayer(target)
      return null
    }
    this.studio.markTimeline?.('background-media-ready', asset.kind)

    if (isVideo) {
      if (options.paused === true) {
        try {
          media.pause()
        } catch {
          /* already paused */
        }
        this.studio.markTimeline?.('background-video-deferred', 'paused during startup')
      } else {
        try {
          await media.play()
        } catch {
          try {
            media.muted = true
            await media.play()
            this.studio.toast('warning', '系统拦截了自动播放，背景已静音；点击页面任意位置可恢复声音。')
            this.studio.audio?.markBlocked()
          } catch {
            this.studio.toast('error', `${asset.name}：无法开始播放`)
          }
        }
        window.setTimeout(() => {
          const decoded = media.webkitAudioDecodedByteCount
          if (typeof decoded === 'number' && decoded > 0 && asset.hasAudio !== true) {
            asset.hasAudio = true
            this.studio.scheduleSave(600)
            this.studio.emit()
          }
        }, 1400)
      }
    }

    this.activeIndex = targetIndex
    this.currentAsset = asset
    this.currentSettings = settings
    this.currentVideo = isVideo ? media : null
    this.opacity = clamp(num(settings.opacity, 1), 0, 1)

    target.style.opacity = String(this.opacity)
    old.style.opacity = '0'
    this.updateTokens()
    if (this.opacity <= 0.001) {
      if (isVideo) media.pause()
      document.documentElement.dataset.dbs = 'off'
    }

    // The poster is only a bridge until the first real frame is ready.
    if (target.style.backgroundImage !== 'none') {
      if (options.paused === true) {
        this.deferredPosterLayer = target
      } else {
        window.setTimeout(() => {
          if (token === this.token) target.style.backgroundImage = 'none'
        }, 600)
      }
    }

    window.setTimeout(() => {
      if (token === this.token) this.clearLayer(old)
    }, clamp(num(settings.fadeMs, 420), 0, 5000) + 80)

    return { video: this.currentVideo, media }
  }

  pause() {
    if (this.currentVideo) {
      try {
        this.currentVideo.pause()
      } catch {
        /* ignore */
      }
    }
  }

  resume() {
    if (this.currentVideo) {
      this.currentVideo.play().catch(() => {})
    }
    if (this.deferredPosterLayer) {
      const layer = this.deferredPosterLayer
      this.deferredPosterLayer = null
      window.setTimeout(() => {
        if (this.activeIndex >= 0) layer.style.backgroundImage = 'none'
      }, 300)
    }
  }

  hide() {
    this.token += 1
    if (this.root !== null) {
      this.root.dataset.visible = '0'
      this.root.style.opacity = '0'
    }
    document.documentElement.dataset.dbs = 'off'
    for (const layer of this.layers) this.clearLayer(layer)
    this.currentAsset = null
    this.currentVideo = null
    this.currentSettings = null
  }

  dispose() {
    this.hide()
    if (this.tokenStyle?.parentNode) this.tokenStyle.parentNode.removeChild(this.tokenStyle)
    if (this.root?.parentNode) this.root.parentNode.removeChild(this.root)
    this.root = null
    this.layers = []
  }
}
