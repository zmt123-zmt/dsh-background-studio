/* =========================================================================
 * 40-audio — one AudioContext, two kinds of sources (video element and
 * external audio), one master/limiter. No second audio path is allowed.
 * ========================================================================= */

class AudioGraph {
  constructor(studio) {
    this.studio = studio
    this.ctx = null
    this.master = null
    this.limiter = null
    this.deck = null
    this.preview = null
    this.videoEntries = new Set()
    this.muted = studio.state.global.audio.muted === true
    this.volume = num(studio.state.global.audio.masterVolume, 1)
    this.blocked = false
    this.failed = false
    this.pendingExternal = null
    this.currentVideo = null
    this.currentMode = 'mute'
    this.startupSuppressed = false
    this.startupSuppressionDepth = 0
    this.onUnlock = () => this.unlock()
  }

  ensure() {
    if (this.ctx || this.failed) return this.ctx
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) {
        this.failed = true
        return null
      }
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : this.volume
      this.limiter = this.ctx.createDynamicsCompressor()
      this.limiter.threshold.value = -2
      this.limiter.knee.value = 6
      this.limiter.ratio.value = 12
      this.limiter.attack.value = 0.003
      this.limiter.release.value = 0.25
      this.master.connect(this.limiter)
      this.limiter.connect(this.ctx.destination)
      document.addEventListener('pointerdown', this.onUnlock, true)
      document.addEventListener('keydown', this.onUnlock, true)
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
    } catch {
      this.failed = true
      this.ctx = null
    }
    return this.ctx
  }

  async unlock() {
    if (!this.ctx) return
    try {
      if (this.ctx.state === 'suspended') await this.ctx.resume()
    } catch {
      return
    }
    if (this.blocked) {
      this.blocked = false
      if (this.currentVideo && this.currentVideo.muted && this.currentMode !== 'mute') {
        this.currentVideo.muted = false
        this.currentVideo.play().catch(() => {})
      }
      if (this.pendingExternal) {
        const pending = this.pendingExternal
        this.pendingExternal = null
        this.playExternal(pending.track, pending.settings)
      }
    }
  }

  markBlocked() {
    this.blocked = true
  }

  ramp(param, target, ms) {
    if (!this.ctx || !param) return
    const now = this.ctx.currentTime
    const duration = Math.max(0.01, num(ms, 0) / 1000)
    try {
      param.cancelScheduledValues(now)
      param.setValueAtTime(param.value, now)
      param.linearRampToValueAtTime(target, now + duration)
    } catch {
      try {
        param.value = target
      } catch {
        /* ignore */
      }
    }
  }

  attachVideo(video) {
    if (!video) return null
    const ctx = this.ensure()
    if (!ctx) return null
    for (const entry of this.videoEntries) {
      if (entry.video === video) return entry.gain
    }
    try {
      const source = ctx.createMediaElementSource(video)
      const gain = ctx.createGain()
      gain.gain.value = 0
      source.connect(gain)
      gain.connect(this.master)
      const entry = { video, source, gain }
      this.videoEntries.add(entry)
      return gain
    } catch {
      return null
    }
  }

  videoGainFor(video) {
    for (const entry of this.videoEntries) {
      if (entry.video === video) return entry.gain
    }
    return this.attachVideo(video)
  }

  setVideoGain(video, target, ms = 420) {
    if (!video) return
    const ctx = this.ensure()
    if (!ctx) {
      video.volume = clamp(target, 0, 1)
      return
    }
    const gain = this.videoGainFor(video)
    if (gain) this.ramp(gain.gain, clamp(target, 0, 1), ms)
  }

  releaseVideo(video) {
    if (!video) return
    for (const entry of this.videoEntries) {
      if (entry.video !== video) continue
      this.ramp(entry.gain.gain, 0, 180)
      this.videoEntries.delete(entry)
      window.setTimeout(() => {
        try {
          entry.source.disconnect()
        } catch {
          /* ignore */
        }
        try {
          entry.gain.disconnect()
        } catch {
          /* ignore */
        }
      }, 260)
    }
  }

  applyForAsset(asset, settings, video) {
    if (!asset || !settings) return
    this.currentMode = settings.audioMode
    this.currentVideo = video ?? null
    if (this.startupSuppressed && video) video.muted = true
    const mode = settings.audioMode
    const wantsVideo = mode === 'video' || mode === 'mix'
    const wantsExternal = mode === 'external' || mode === 'mix'
    const ctx = this.ensure()

    if (video && ctx) {
      const canPlayVideo = asset.hasAudio !== false
      const target = wantsVideo && canPlayVideo ? settings.videoVolume : 0
      this.setVideoGain(video, target, settings.fadeMs)
    } else if (video) {
      video.muted = !wantsVideo
      video.volume = clamp(settings.videoVolume, 0, 1)
    }

    if (wantsExternal && settings.audioId) {
      const track = this.studio.audioById(settings.audioId)
      if (track && !track.missing) {
        this.playExternal(track, settings)
        return
      }
      if (mode === 'external') {
        this.studio.toast('warning', '这个背景绑定的音频已丢失，当前保持静音。')
      }
    }
    this.stopExternal(settings.fadeMs)
  }

  playExternal(track, settings) {
    const ctx = this.ensure()
    if (!ctx) return
    if (this.deck && this.deck.trackId === track.id && !this.deck.el.ended) {
      this.deck.el.loop = settings.audioLoop !== false
      this.ramp(this.deck.gain.gain, settings.audioVolume, settings.fadeMs)
      if (this.deck.el.paused) this.deck.el.play().catch(() => {})
      return
    }
    this.stopExternal(settings.fadeMs)
    const el = document.createElement('audio')
    el.preload = 'auto'
    el.src = audioUrl(track.id)
    el.loop = settings.audioLoop !== false
    el.volume = 1
    let source
    let gain
    try {
      source = ctx.createMediaElementSource(el)
      gain = ctx.createGain()
      gain.gain.value = 0
      source.connect(gain)
      gain.connect(this.master)
    } catch {
      el.volume = clamp(settings.audioVolume, 0, 1)
      el.loop = settings.audioLoop !== false
      source = null
      gain = null
    }
    const deck = { el, source, gain, trackId: track.id, token: Date.now() }
    this.deck = deck
    const start = clamp(num(settings.audioStartMs, 0), 0, 24 * 60 * 60 * 1000) / 1000
    const begin = () => {
      if (this.deck !== deck) return
      if (start > 0 && Number.isFinite(el.duration) && el.duration > 0) {
        el.currentTime = Math.min(start, Math.max(0, el.duration - 0.15))
      }
      el.play().then(() => {
        if (gain) this.ramp(deck.gain.gain, clamp(settings.audioVolume, 0, 1), settings.fadeMs)
      }).catch(() => {
        this.blocked = true
        this.pendingExternal = { track, settings }
        this.studio.toast('warning', '浏览器拦截了音频播放；点击页面任意位置可恢复。')
      })
    }
    el.addEventListener('loadedmetadata', begin, { once: true })
    el.addEventListener('ended', () => {
      if (this.deck === deck) {
        this.deck = null
        this.studio.handleExternalAudioEnded()
        try {
          source?.disconnect()
          gain?.disconnect()
        } catch {
          /* ignore */
        }
      }
    }, { once: true })
    if (gain) this.ramp(gain.gain, 0, 1)
    el.load()
  }

  stopExternal(ms = 320) {
    const deck = this.deck
    if (!deck) return
    this.deck = null
    this.pendingExternal = null
    if (deck.gain) this.ramp(deck.gain.gain, 0, ms)
    else this.rampElement(deck.el, ms)
    window.setTimeout(() => {
      try {
        deck.el.pause()
        deck.el.removeAttribute('src')
        deck.el.load()
      } catch {
        /* ignore */
      }
      try {
        deck.source?.disconnect()
        deck.gain?.disconnect()
      } catch {
        /* ignore */
      }
    }, Math.max(80, ms + 60))
  }

  rampElement(el, ms) {
    if (!el) return
    const from = el.volume
    const start = performance.now()
    const duration = Math.max(30, ms)
    const tick = () => {
      const ratio = Math.min(1, (performance.now() - start) / duration)
      try {
        el.volume = Math.max(0, from * (1 - ratio))
      } catch {
        /* ignore */
      }
      if (ratio < 1 && !el.paused) window.setTimeout(tick, 30)
    }
    tick()
  }

  pauseExternal() {
    if (this.deck) this.deck.el.pause()
  }

  resumeExternal() {
    if (this.deck) this.deck.el.play().catch(() => {})
  }

  startPreview(track, onEnd) {
    this.ensure()
    this.stopPreview()
    const el = document.createElement('audio')
    el.preload = 'auto'
    el.src = audioUrl(track.id)
    el.volume = 0.9
    const previous = this.master ? this.master.gain.value : this.volume
    if (this.master) this.ramp(this.master.gain, previous * 0.22, 180)
    this.preview = { el, previous, onEnd }
    el.addEventListener('ended', () => this.stopPreview(), { once: true })
    el.play().catch(() => {
      this.studio.toast('warning', '无法试听这个音频文件。')
      this.stopPreview()
    })
  }

  stopPreview() {
    const preview = this.preview
    if (!preview) return
    this.preview = null
    try {
      preview.el.pause()
      preview.el.removeAttribute('src')
      preview.el.load()
    } catch {
      /* ignore */
    }
    if (this.master) this.ramp(this.master.gain, this.muted ? 0 : this.volume, 220)
    preview.onEnd?.()
  }

  setMuted(muted, options = {}) {
    this.muted = muted === true
    if (this.master && !this.startupSuppressed) this.ramp(this.master.gain, this.muted ? 0 : this.volume, options.fadeMs ?? 160)
    if (this.currentVideo) {
      // Keep the element's own muted flag consistent with the user's intent.
      this.currentVideo.muted = this.startupSuppressed ? true : this.muted
    }
  }

  setMasterVolume(volume) {
    this.volume = clamp(num(volume, 1), 0, 1)
    if (this.master && !this.muted && !this.startupSuppressed) this.ramp(this.master.gain, this.volume, 120)
  }

  /** Silence the restored background while a startup/preview owns the screen. */
  beginStartupSuppression() {
    this.startupSuppressionDepth += 1
    this.startupSuppressed = true
    this.ensure()
    if (this.master) this.ramp(this.master.gain, 0, 120)
    if (this.currentVideo) this.currentVideo.muted = true
  }

  /** Restore the persisted background audio state without resetting any setting. */
  endStartupSuppression() {
    this.startupSuppressionDepth = Math.max(0, this.startupSuppressionDepth - 1)
    this.startupSuppressed = this.startupSuppressionDepth > 0
    if (this.startupSuppressed) return
    if (this.master) this.ramp(this.master.gain, this.muted ? 0 : this.volume, 220)
    if (this.currentVideo) this.currentVideo.muted = this.muted
  }

  dispose() {
    this.stopExternal(0)
    this.stopPreview()
    document.removeEventListener('pointerdown', this.onUnlock, true)
    document.removeEventListener('keydown', this.onUnlock, true)
    for (const entry of this.videoEntries) {
      try {
        entry.source.disconnect()
        entry.gain.disconnect()
      } catch {
        /* ignore */
      }
    }
    this.videoEntries.clear()
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}
