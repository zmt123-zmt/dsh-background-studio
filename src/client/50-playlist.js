/* =========================================================================
 * 50-playlist — one timer, one advance() path. Dwell, media end, audio end
 * and manual next all converge here so they can never double-switch.
 * ========================================================================= */

class PlaylistEngine {
  constructor(studio) {
    this.studio = studio
    this.playlistId = null
    this.queue = []
    this.index = 0
    this.playing = false
    this.token = 0
    this.timer = 0
    this.deadline = 0
    this.startedAt = 0
    this.waitMode = 'fixed'
    this.pausedRemaining = 0
    this.bag = []
    this.currentAssetId = null
    this.attempts = 0
  }

  get playlist() {
    return this.studio.playlistById(this.playlistId)
  }

  currentItem() {
    return this.queue[this.index] ?? null
  }

  currentAsset() {
    return this.queue[this.index]?.asset ?? null
  }

  buildQueue() {
    const playlist = this.playlist
    if (!playlist) return []
    const queue = []
    let missing = 0
    for (const item of playlist.items) {
      const asset = this.studio.assetById(item.assetId)
      if (!asset) continue
      if (asset.missing) {
        missing += 1
        continue
      }
      queue.push({ item, asset })
    }
    if (missing > 0) {
      this.studio.toast('warning', `已跳过 ${missing} 个缺失文件。`)
    }
    return queue
  }

  resolveDwell(asset, item, settings) {
    const globalSeconds = this.studio.state.global.defaultDwellSeconds
    const useFixed = (seconds) => ({ mode: 'fixed', seconds: clamp(num(seconds, globalSeconds), 1, 86400) })
    const useMediaEnd = () => (asset.kind === 'video' ? { mode: 'mediaEnd' } : useFixed(item.dwellSeconds || globalSeconds))

    if (item.dwellMode === 'fixed') return useFixed(item.dwellSeconds)
    if (item.dwellMode === 'mediaEnd') return useMediaEnd()
    if (settings.dwellMode === 'fixed') return useFixed(settings.dwellSeconds)
    if (settings.dwellMode === 'mediaEnd') return useMediaEnd()
    return useMediaEnd()
  }

  async start(playlistId, startIndex = 0, options = {}) {
    this.playlistId = playlistId
    this.queue = this.buildQueue()
    if (this.queue.length === 0) {
      this.studio.toast('error', '这个轮播方案里没有可用素材。')
      return false
    }
    this.bag = []
    this.attempts = 0
    const desired = clamp(Math.trunc(num(startIndex, 0)), 0, this.queue.length - 1)
    this.index = desired
    await this.load(desired, { paused: options.paused === true })
    return true
  }

  async load(index, options = {}) {
    const token = ++this.token
    this.clearTimer()
    if (this.queue.length === 0) {
      this.queue = this.buildQueue()
      if (this.queue.length === 0) {
        this.stop({ keepBackground: true, silent: true })
        return false
      }
    }
    this.index = clamp(index, 0, this.queue.length - 1)
    const entry = this.queue[this.index]
    if (!entry) return false
    const { asset, item } = entry
    const settings = this.studio.settingsFor(asset.id)
    const dwell = this.resolveDwell(asset, item, settings)
    this.currentAssetId = asset.id
    this.startedAt = performance.now()
    this.deadline = 0
    this.waitMode = dwell.mode
    if (token !== this.token) return false

    let handle = null
    try {
      handle = await this.studio.renderer.show(asset, settings, { paused: options.paused === true })
    } catch (error) {
      if (token !== this.token) return false
      this.studio.toast('error', `跳过无法播放的素材：${asset.name}`)
      return this.skipBroken(token)
    }
    if (!handle || token !== this.token) return false

    this.attempts = 0
    this.playing = options.paused !== true
    this.studio.audio.applyForAsset(asset, settings, handle.video)
    asset.lastUsedAt = new Date().toISOString()

    if (this.playing) {
      this.arm(asset, settings, handle.video, dwell)
    } else {
      this.studio.renderer.pause()
      this.studio.audio.pauseExternal()
    }

    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
    return true
  }

  arm(asset, settings, video, dwell) {
    this.clearTimer()
    if (!this.playing) return
    if (dwell.mode === 'mediaEnd') {
      if (video && asset.kind === 'video') {
        video.loop = false
        this.waitMode = 'mediaEnd'
        this.deadline = 0
        return
      }
      const seconds = clamp(num(settings.dwellSeconds, this.studio.state.global.defaultDwellSeconds), 1, 86400)
      this.armFixed(seconds * 1000)
      return
    }
    const ms = Math.max(500, dwell.seconds * 1000)
    if (video && asset.kind === 'video') {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : num(asset.duration, 0)
      if (duration > 0 && ms > duration * 1000 + 200) {
        video.loop = settings.loop !== false
      } else {
        video.loop = false
      }
    }
    this.armFixed(ms)
  }

  armFixed(ms) {
    this.clearTimer()
    const duration = Math.max(300, ms)
    this.startedAt = performance.now()
    this.deadline = this.startedAt + duration
    const token = this.token
    this.timer = window.setTimeout(() => {
      if (token !== this.token) return
      if (this.playing) this.advance('timer')
    }, duration)
  }

  clearTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
    this.deadline = 0
  }

  rescheduleDwell() {
    if (!this.playing) return
    const entry = this.currentItem()
    if (!entry) return
    const settings = this.studio.settingsFor(entry.asset.id)
    this.arm(entry.asset, settings, this.studio.renderer.currentVideo, this.resolveDwell(entry.asset, entry.item, settings))
  }

  pause() {
    if (!this.playing) return
    if (this.deadline > 0) {
      this.pausedRemaining = Math.max(0, this.deadline - performance.now())
    } else {
      this.pausedRemaining = 0
    }
    this.playing = false
    this.token += 1
    this.studio.renderer?.invalidate()
    this.clearTimer()
    this.studio.renderer.pause()
    this.studio.audio.pauseExternal()
    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
  }

  resume() {
    if (this.playing) return
    if (!this.currentItem()) return
    this.playing = true
    const entry = this.currentItem()
    const settings = this.studio.settingsFor(entry.asset.id)
    this.studio.renderer.resume()
    this.studio.audio.resumeExternal()
    if (this.pausedRemaining > 300) {
      this.armFixed(this.pausedRemaining)
    } else {
      this.arm(entry.asset, settings, this.studio.renderer.currentVideo, this.resolveDwell(entry.asset, entry.item, settings))
    }
    this.pausedRemaining = 0
    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
  }

  stop(options = {}) {
    this.playing = false
    this.token += 1
    this.studio.renderer?.invalidate()
    this.clearTimer()
    this.pausedRemaining = 0
    this.studio.audio?.stopExternal(260)
    if (options.keepBackground !== true) {
      this.studio.renderer?.hide()
      this.currentAssetId = null
      this.queue = []
      this.index = 0
    } else {
      this.studio.renderer?.pause()
    }
    this.updateRuntime()
    if (!options.silent) {
      this.studio.scheduleSave()
      this.studio.emit()
    }
  }

  updateRuntime() {
    const playlist = this.playlist
    this.studio.state.runtime = {
      mode: 'playlist',
      assetId: this.currentAssetId,
      playlistId: this.playlistId,
      itemIndex: this.index,
      playing: this.playing,
      updatedAt: Date.now(),
    }
    if (playlist) playlist.updatedAt = new Date().toISOString()
  }

  async advance(reason) {
    if (this.queue.length === 0) return
    const next = this.nextIndex()
    if (next === -1) {
      this.stop({ keepBackground: true })
      return
    }
    await this.load(next)
  }

  nextIndex() {
    const playlist = this.playlist
    if (!playlist) return -1
    const length = this.queue.length
    if (length <= 0) return -1
    if (playlist.shuffle === 'random') {
      if (length === 1) return 0
      let candidate = this.index
      for (let guard = 0; guard < 20 && candidate === this.index; guard += 1) {
        candidate = Math.floor(Math.random() * length)
      }
      return candidate
    }
    if (playlist.shuffle === 'noRepeat') {
      if (this.bag.length === 0) {
        this.bag = Array.from({ length }, (_, index) => index)
        for (let index = this.bag.length - 1; index > 0; index -= 1) {
          const swap = Math.floor(Math.random() * (index + 1))
          const value = this.bag[index]
          this.bag[index] = this.bag[swap]
          this.bag[swap] = value
        }
        if (length > 1 && this.bag[0] === this.index) {
          const first = this.bag[0]
          this.bag[0] = this.bag[this.bag.length - 1]
          this.bag[this.bag.length - 1] = first
        }
      }
      return this.bag.shift() ?? 0
    }
    if (this.index + 1 < length) return this.index + 1
    return playlist.loop === false ? -1 : 0
  }

  next(reason = 'manual') {
    if (this.queue.length === 0) return
    const next = this.nextIndex()
    if (next === -1) {
      this.stop({ keepBackground: true })
      return
    }
    this.load(next)
  }

  previous() {
    if (this.queue.length === 0) return
    const length = this.queue.length
    const previous = this.index > 0 ? this.index - 1 : this.playlist?.loop === false ? 0 : length - 1
    this.load(previous)
  }

  handleMediaEnded(video) {
    if (!this.playing) return
    if (video !== this.studio.renderer.currentVideo) return
    if (this.waitMode === 'mediaEnd') this.advance('mediaEnd')
    // A fixed dwell longer than the video intentionally freezes the last frame;
    // the timer remains the only switch trigger.
  }

  handleAudioEnded() {
    const entry = this.currentItem()
    if (!entry || !this.playing) return
    const settings = this.studio.settingsFor(entry.asset.id)
    if (settings.audioEndAction === 'next') this.advance('audioEnd')
  }

  async skipBroken(token) {
    this.attempts += 1
    if (token !== this.token) return false
    if (this.attempts > this.queue.length + 1) {
      this.studio.toast('error', '轮播中的所有素材都无法播放，已停止。')
      this.stop({ keepBackground: true })
      return false
    }
    const next = (this.index + 1) % this.queue.length
    return this.load(next)
  }

  handleMediaError(assetId) {
    if (!this.playing) return
    if (assetId !== this.currentAssetId) return
    window.setTimeout(() => {
      if (this.playing && assetId === this.currentAssetId) {
        const next = (this.index + 1) % Math.max(1, this.queue.length)
        this.load(next)
      }
    }, 700)
  }

  refreshQueue() {
    const currentId = this.currentAssetId
    this.queue = this.buildQueue()
    if (this.queue.length === 0) {
      this.stop({ keepBackground: true })
      return
    }
    const found = this.queue.findIndex((entry) => entry.asset.id === currentId)
    this.index = found >= 0 ? found : clamp(this.index, 0, this.queue.length - 1)
    this.bag = []
  }

  progress() {
    if (!this.playing || this.deadline <= 0) return null
    const now = performance.now()
    const total = Math.max(1, this.deadline - this.startedAt)
    const elapsed = clamp(now - this.startedAt, 0, total)
    return {
      elapsed,
      total,
      remaining: Math.max(0, this.deadline - now),
      ratio: elapsed / total,
    }
  }

  dispose() {
    this.clearTimer()
    this.playing = false
  }
}
