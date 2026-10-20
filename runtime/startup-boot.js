/*
 * DSH Background Studio — startup overlay injected into the page before the
 * application module. This is intentionally a plain inline script: it runs
 * before React / the normal client bundle, so it can occupy the window without
 * waiting for the plugin panel or the background player to mount.
 *
 * It is deliberately defensive: every failure path has a timeout and removes
 * the overlay. It never writes into #root (React hydration must stay intact)
 * and never touches the normal background player.
 */
;(function (global) {
  'use strict'

  var cfg = global.__DBS_BOOT__
  if (!cfg || cfg.injected !== true) return
  if (global.__DBS_BOOT_STARTED__ === true) {
    cfg.handled = cfg.handled !== false
    return
  }
  global.__DBS_BOOT_STARTED__ = true

  var doc = global.document
  if (!doc) return

  var t0 = now()
  var lifecycle = global.__DBS_LIFECYCLE__ || (global.__DBS_LIFECYCLE__ = [])
  try {
    cfg.lifecycle = lifecycle
  } catch (error) {
    /* config object is ours, but never let logging fail startup */
  }
  var timers = []
  var root = null
  var media = null
  var audioEl = null
  var skipButton = null
  var observer = null
  var pollTimer = null
  var done = false
  var started = false
  var startedAt = 0
  var frameSeen = false
  var clipDone = false
  var naturalAt = 0
  var appReady = false
  var backgroundReady = false
  var leaving = false
  var skipped = false
  var mode = cfg.mode === 'background' ? 'background' : 'fullscreen'
  var hasOpened = false
  var firstRunMarked = false
  var frameTimes = []
  var frameLoopActive = false
  var frameLoopToken = 0
  var frameStatsTimer = null
  var animationAt = 0
  var longTasks = []
  var longTaskObserver = null
  // A hidden Electron BrowserWindow still reports document.visibilityState
  // "visible" and requestVideoFrameCallback can fire. What it does not do is
  // deliver normal-rate animation frames: rAF is throttled/suspended. Requiring
  // a run of fast consecutive rAF callbacks is the only renderer-side proof
  // that the window is actually being composited for the user.
  var paintSeen = false
  var paintRaf = 0
  var lastRafAt = 0
  var fastRafCount = 0
  // 0.2.2 rollback: start the duration as soon as the real media frame is
  // ready. The 0.2.4 compositor-proof wait could leave the overlay open
  // forever if the desktop window never produced six fast rAF callbacks.
  paintSeen = true
  var pendingEnter = null
  var animationVisible = false
  var pausedAfterFrame = false
  var playbackReady = false
  var audioPending = false
  var reportedWindow = Object.create(null)
  var nativeShown = false
  var nativeWindowApi = null

  function now() {
    try {
      return typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now()
    } catch (error) {
      return Date.now()
    }
  }

  function round(value) {
    return Math.round(value * 10) / 10
  }

  function log(name, detail) {
    var entry = { name: name, t: round(now() - t0), at: Date.now() }
    if (detail !== undefined) entry.detail = String(detail)
    lifecycle.push(entry)
    if (cfg.lifecycle && cfg.lifecycle !== lifecycle && typeof cfg.lifecycle.push === 'function') {
      cfg.lifecycle.push(entry)
    }
    try {
      if (global.console && global.console.info) {
        global.console.info('[dbs-boot +' + entry.t + 'ms] ' + name + (entry.detail ? ' — ' + entry.detail : ''))
      }
    } catch (error) {
      /* logging must never be fatal */
    }
  }

  /** Required Startup marker: real event, relative milliseconds. */
  function perf(name, detail) {
    var t = round(now() - t0)
    var suffix = ' t=' + t + 'ms' + (detail ? ' ' + detail : '')
    var text = '[StartupPerf] ' + name + suffix
    try {
      if (global.console && global.console.info) {
        global.console.info(text)
        // The desktop startup review also looks for the shorter prefix.
        global.console.info('[Startup] ' + name + suffix)
      }
    } catch (error) {
      /* ignore */
    }
    log('StartupPerf:' + name, detail || '')
  }

  try {
    var PerfCtor = global.PerformanceObserver
    if (typeof PerfCtor === 'function') {
      longTaskObserver = new PerfCtor(function (list) {
        var entries = list.getEntries()
        for (var i = 0; i < entries.length; i += 1) {
          longTasks.push({ start: entries[i].startTime, duration: entries[i].duration })
        }
      })
      longTaskObserver.observe({ entryTypes: ['longtask'] })
    }
  } catch (error) {
    longTaskObserver = null
  }

  function timer(fn, ms) {
    var id = global.setTimeout(fn, ms)
    timers.push(id)
    return id
  }

  function clearTimers() {
    for (var index = 0; index < timers.length; index += 1) {
      try {
        global.clearTimeout(timers[index])
      } catch (error) {
        /* ignore */
      }
    }
    timers.length = 0
    if (pollTimer !== null) {
      try {
        global.clearInterval(pollTimer)
      } catch (error) {
        /* ignore */
      }
      pollTimer = null
    }
    if (observer !== null && typeof observer.disconnect === 'function') {
      try {
        observer.disconnect()
      } catch (error) {
        /* ignore */
      }
      observer = null
    }
  }

  function el(tag, className, text) {
    var node = doc.createElement(tag)
    if (className) node.className = className
    if (text !== undefined) node.textContent = text
    return node
  }

  function setText(text) {
    var hint = root && root.querySelector('.dbs-boot-hint')
    if (hint) hint.textContent = text
  }

  function safeSessionGet(key) {
    try {
      return global.sessionStorage.getItem(key)
    } catch (error) {
      return null
    }
  }

  function safeSessionSet(key, value) {
    try {
      global.sessionStorage.setItem(key, value)
      return true
    } catch (error) {
      return false
    }
  }

  function markFirstRun() {
    if (firstRunMarked) return
    firstRunMarked = true
    try {
      cfg.firstRunDone = true
      if (typeof global.fetch !== 'function' || !cfg.markUrl) return
      global.fetch(cfg.markUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({ bootId: cfg.bootId }),
        keepalive: true,
      }).catch(function () {})
    } catch (error) {
      /* persistence failure must not stop the animation */
    }
  }

  /**
   * Optional desktop-native gate bridge. `dsh web` does not expose it, so these
   * calls are no-ops there. The Host validates the session id and ignores late
   * or duplicate reports for a different startup session.
   */
  function reportWindow(phase, detail) {
    var api = global.dshStartupWindow
    if (!api || typeof api.report !== 'function' || !api.sessionId) return false
    if (reportedWindow[phase] === true) return false
    reportedWindow[phase] = true
    try {
      api.report({
        phase: phase,
        sessionId: api.sessionId,
        bootId: cfg.bootId,
        mode: cfg.displayMode === 'animation-first' ? 'animation-first' : 'fast',
        at: Date.now(),
        detail: detail ? String(detail) : undefined,
      })
    } catch (error) {
      /* the HTTP mailbox below is the reliable path while occluded */
    }
    try {
      if (typeof global.fetch === 'function' && cfg.windowStateUrl) {
        global.fetch(cfg.windowStateUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json; charset=utf-8' },
          body: JSON.stringify({
            session: api.sessionId,
            phase: phase,
            mode: cfg.displayMode === 'animation-first' ? 'animation-first' : 'fast',
            bootId: cfg.bootId,
            detail: detail ? String(detail) : '',
          }),
          keepalive: true,
          credentials: 'same-origin',
        }).catch(function () {})
      }
    } catch (error) {
      /* timeout/failure of the HTTP mailbox still falls back to the Host timer */
    }
    return true
  }

  perf('application-start')
  perf('config-loaded', cfg.reason || (cfg.shouldPlay ? 'play' : 'no-play'))
  perf('startup-config-ready', cfg.item && cfg.item.kind ? cfg.item.kind : 'none')
  perf('startup-injection-ready')
  startNativeShownWatch()

  if (cfg.shouldPlay !== true) {
    cfg.decided = true
    cfg.handled = true
    cfg.active = false
    return
  }

  if (cfg.bootKey && safeSessionGet(cfg.bootKey) === cfg.bootId) {
    cfg.decided = true
    cfg.handled = true
    cfg.active = false
    log('startup-already-consumed')
    return
  }

  if (!doc.body) {
    doc.addEventListener('DOMContentLoaded', safeStart, { once: true })
    return
  }
  safeStart()

  function safeStart() {
    try {
      start()
    } catch (error) {
      log('startup-start-failed', error && error.message)
      perf('startup-fallback', 'start-failed')
      reportWindow('startup-fallback', 'start-failed')
      cfg.decided = false
      cleanup('start-failed')
    }
  }

  startNativeShownWatch()

  function startNativeShownWatch() {
    nativeWindowApi = global.dshStartupWindow
    if (!nativeWindowApi || typeof nativeWindowApi.onMainWindowShown !== 'function') {
      startPaintWatch()
      return
    }
    try {
      nativeWindowApi.onMainWindowShown(function () { onNativeShown() })
    } catch (error) {
      /* fall through to the query below */
    }
    try {
      var queried = nativeWindowApi.isMainWindowShown()
      if (queried && typeof queried.then === 'function') {
        queried.then(function (state) {
          if (state && state.shown === true && state.sessionId === nativeWindowApi.sessionId) onNativeShown()
        }, function () {})
      }
    } catch (error) {
      /* the show event is authoritative */
    }
  }

  function onNativeShown() {
    if (nativeShown || done) return
    nativeShown = true
    var raf = global.requestAnimationFrame || function (fn) { return global.setTimeout(fn, 16) }
    raf(function () {
      raf(function () {
        if (done) return
        onFirstPaint('main-window-shown')
      })
    })
  }

  function startPaintWatch() {
    if (typeof global.requestAnimationFrame !== 'function') {
      // No rAF (headless/old engine): do not block startup forever. There is
      // no hidden-window signal available in that case.
      onFirstPaint('no-raf')
      return
    }
    var step = function (ts) {
      if (done || paintSeen) return
      var delta = lastRafAt > 0 ? ts - lastRafAt : 0
      lastRafAt = ts
      // Hidden Electron windows still report visibility "visible"; their rAF
      // cadence collapses to roughly 1 Hz. Six normal consecutive frames
      // (~100 ms at 60 Hz) mean a real compositor is making progress.
      if (delta > 0 && delta < 100) fastRafCount += 1
      else fastRafCount = 0
      if (fastRafCount >= 6) {
        onFirstPaint('fast-frames')
        return
      }
      paintRaf = global.requestAnimationFrame(step)
    }
    paintRaf = global.requestAnimationFrame(step)
  }

  function onFirstPaint(source) {
    if (paintSeen || done) return
    paintSeen = true
    perf('window-visible', source + ' painted')
    if (frameSeen) {
      resumeAfterFrame()
      markAnimationVisible()
    }
    if (pendingEnter) {
      var reason = pendingEnter
      pendingEnter = null
      enter(reason)
    }
  }

  function pauseAfterFrame() {
    if (pausedAfterFrame) return
    pausedAfterFrame = true
    try {
      if (media && media.tagName === 'VIDEO') {
        media.pause()
        if (frameSeen) {
          try { media.currentTime = 0 } catch (error) { /* ignore */ }
        }
      }
      if (audioEl) audioEl.pause()
    } catch (error) {
      /* ignore */
    }
  }

  function resumeAfterFrame() {
    if (!paintSeen || done) return
    if (!pausedAfterFrame) return
    pausedAfterFrame = false
    if (media && media.tagName === 'VIDEO') {
      try { media.currentTime = 0 } catch (error) { /* ignore */ }
      playVideo()
    }
    if (audioEl && audioPending) {
      audioPending = false
      var audioPlay = audioEl.play()
      if (audioPlay && typeof audioPlay.catch === 'function') audioPlay.catch(function () {})
    }
  }

  function markAnimationVisible() {
    if (animationVisible || done || !frameSeen || !paintSeen) return
    animationVisible = true
    var raf = global.requestAnimationFrame || function (fn) { return global.setTimeout(fn, 16) }
    raf(function () {
      raf(function () {
        if (done || !paintSeen) return
        perf('first-frame-visible', cfg.item.kind)
        perf('startup-animation-visible', cfg.item.kind)
        animationAt = now()
        frameTimes = []
        startDuration()
        startFrameLoop(true)
        if (audioEl && audioPending) {
          audioPending = false
          var audioPlay = audioEl.play()
          if (audioPlay && typeof audioPlay.catch === 'function') audioPlay.catch(function () {})
        }
      })
    })
  }

  function start() {
    if (done || hasOpened) return
    hasOpened = true
    cfg.handled = true
    cfg.active = true
    cfg.played = true
    safeSessionSet(cfg.bootKey || 'dbs.startup.bootId', cfg.bootId)

    // Notify an already-mounted Studio (and let a later-mounted Studio query
    // cfg.active). This is what suppresses background audio while the
    // injected overlay owns the screen.
    try {
      global.dispatchEvent(new global.CustomEvent('dbs:startup-started', { detail: { bootId: cfg.bootId } }))
    } catch (error) {
      /* CustomEvent may be unavailable in exotic workers */
    }

    buildSurface()
    if (done) return
    try {
      if (root) root.getBoundingClientRect()
    } catch (error) {
      /* layout check only */
    }
    perf('startup-surface-ready', mode)
    reportWindow('startup-surface-ready', mode)
    cfg.decided = true
    buildMedia()
    watchAppReady()
    watchBackground()

    // Hard upper bound. This is deliberately later than normal startup; a
    // slow disk should not truncate a playing animation, but a broken one
    // must never keep the user out forever.
    timer(function () {
      if (done || leaving) return
      if (!appReady) {
        appReady = true
        log('main-ui-timeout')
      }
      if (!backgroundReady) {
        backgroundReady = true
        log('background-timeout')
      }
      if (clipDone) enter('hold-timeout')
    }, 18000)
    timer(function () {
      if (done || leaving) return
      log('startup-hard-timeout')
      appReady = true
      backgroundReady = true
      enter('hard-timeout')
    }, 24000)

    markFirstRun()
  }

  function buildSurface() {
    root = el('div', 'dbs-boot')
    root.id = 'dbs-boot'
    root.dataset.mode = mode
    root.setAttribute('role', 'dialog')
    root.setAttribute('aria-label', '启动动画')
    root.setAttribute('aria-live', 'polite')

    var mediaWrap = el('div', 'dbs-boot-media')
    mediaWrap.id = 'dbs-boot-media'
    root.appendChild(mediaWrap)

    if (mode === 'fullscreen') {
      var hint = el('div', 'dbs-boot-hint', '正在启动')
      root.appendChild(hint)
      if (cfg.skip !== false) {
        skipButton = makeSkipButton()
        root.appendChild(skipButton)
      }
      doc.documentElement.setAttribute('data-dbs-boot-fg', 'on')
      root.addEventListener('pointerdown', function (event) {
        if (leaving || done) return
        var target = event && event.target
        if (target && typeof target.closest === 'function' && target.closest('.dbs-boot-skip')) return
        requestSkip('surface-click')
      })
    } else {
      doc.documentElement.setAttribute('data-dbs-boot-bg', 'on')
      if (cfg.skip !== false) {
        skipButton = makeSkipButton()
        skipButton.classList.add('dbs-boot-skip-fixed')
        doc.body.appendChild(skipButton)
      }
    }

    try {
      doc.body.appendChild(root)
    } catch (error) {
      log('startup-overlay-append-failed', error && error.message)
      cleanup('append-failed')
      return
    }

    var raf = global.requestAnimationFrame || function (fn) { return global.setTimeout(fn, 16) }
    raf(function () {
      if (done) return
      perf('overlay-visible', mode)
    })
  }

  function makeSkipButton() {
    var button = el('button', 'dbs-boot-skip', '跳过启动动画')
    button.type = 'button'
    var stop = function (event) {
      if (event && typeof event.preventDefault === 'function') event.preventDefault()
      if (event && typeof event.stopPropagation === 'function') event.stopPropagation()
      requestSkip('button')
    }
    button.addEventListener('pointerdown', stop)
    button.addEventListener('click', stop)
    return button
  }

  function buildMedia() {
    var item = cfg.item
    if (!item) {
      complete('no-item')
      return
    }
    var wrap = doc.getElementById('dbs-boot-media')
    if (!wrap) return

    if (item.kind === 'video') {
      media = doc.createElement('video')
      media.className = 'dbs-boot-video'
      media.preload = 'auto'
      media.playsInline = true
      media.setAttribute('playsinline', '')
      media.loop = false
      media.muted = cfg.audio.mode !== 'video'
      media.volume = clamp(cfg.audio.volume, 0, 1)
      media.setAttribute('aria-hidden', 'true')
      applyFit(media)
      wrap.appendChild(media)
      perf('media-load-start', item.kind)
      perf('startup-media-load-start', item.kind)
      media.src = item.mediaUrl
      attachVideoEvents()
      playVideo()
    } else {
      media = doc.createElement('img')
      media.className = 'dbs-boot-image'
      media.alt = ''
      media.draggable = false
      media.setAttribute('aria-hidden', 'true')
      applyFit(media)
      wrap.appendChild(media)
      perf('media-load-start', item.kind)
      perf('startup-media-load-start', item.kind)
      media.addEventListener('load', function () {
        shown()
      }, { once: true })
      media.addEventListener('error', function () {
        log('startup-media-error', 'image')
        complete('error')
      }, { once: true })
      media.src = item.mediaUrl
      if (media.complete && media.naturalWidth > 0) shown()
    }

    if (cfg.audio.mode === 'external' && cfg.audio.audioUrl) {
      audioEl = doc.createElement('audio')
      audioEl.preload = 'auto'
      audioEl.volume = clamp(cfg.audio.volume, 0, 1)
      audioEl.src = cfg.audio.audioUrl
      log('startup-audio-load-start', 'external')
      // Start audio only once the first frame is actually visible; otherwise a
      // hidden/throttled window would play it before the user sees anything.
      audioPending = true
    } else if (media && media.tagName === 'VIDEO') {
      // Muted preload: a hidden or not-yet-painted window must never be blocked
      // by autoplay policy or produce audio before it is visible.
      media.muted = true
    }
  }

  function applyFit(node) {
    if (cfg.display === 'contain') node.style.objectFit = 'contain'
    else if (cfg.display === 'center') node.style.objectFit = 'none'
    else node.style.objectFit = 'cover'
    node.style.objectPosition = 'center center'
  }

  function attachVideoEvents() {
    var retries = 0
    var noFrame = timer(function () {
      if (!frameSeen) {
        log('startup-media-no-frame')
        complete('no-frame')
      }
    }, 12000)

    media.addEventListener('loadedmetadata', function () {
      perf('media-metadata-ready', 'video ' + media.videoWidth + 'x' + media.videoHeight)
    })
    media.addEventListener('timeupdate', function () {
      // Fallback only. requestVideoFrameCallback is the real presented-frame
      // signal; timeupdate can fire before the first frame is composited.
      if (frameSeen) return
      if (typeof media.requestVideoFrameCallback === 'function') return
      if (media.currentTime > 0) shown()
    })
    if (typeof media.requestVideoFrameCallback !== 'function') {
      media.addEventListener('playing', function () {
        if (frameSeen) return
        var raf = global.requestAnimationFrame || function (fn) { return global.setTimeout(fn, 16) }
        raf(function () {
          raf(function () {
            if (!frameSeen && media.readyState >= 2 && media.currentTime >= 0) shown()
          })
        })
      })
    }
    media.addEventListener('playing', function () {
      perf('animation-play', 'video')
      startFrameLoop()
    })
    media.addEventListener('ended', function () {
      clearTimer(noFrame)
      // Custom duration longer than the clip: keep the last frame until the
      // configured timer, matching the Studio fallback controller.
      if (cfg.durationMode === 'custom' && startedAt > 0 && now() < startedAt + clamp(cfg.durationMs, 500, 300000) - 120) {
        log('startup-video-ended-hold')
        return
      }
      complete('ended')
    })
    media.addEventListener('error', function () {
      clearTimer(noFrame)
      var code = media.error ? media.error.code : 0
      log('startup-media-error', 'video:' + code)
      if (retries >= 1) {
        complete('error')
        return
      }
      retries += 1
      log('startup-media-retry', 'video')
      try {
        media.src = cfg.item.mediaUrl
        var again = media.play()
        if (again && typeof again.catch === 'function') again.catch(function () {})
      } catch (error) {
        complete('error-retry')
      }
      noFrame = timer(function () {
        if (!frameSeen) complete('no-frame-after-retry')
      }, 12000)
    })
    media._dbsNoFrame = noFrame
  }

  function clearTimer(id) {
    if (!id) return
    try {
      global.clearTimeout(id)
    } catch (error) {
      /* ignore */
    }
    var index = timers.indexOf(id)
    if (index >= 0) timers.splice(index, 1)
  }

  function markPlaybackReady() {
    if (playbackReady) return
    playbackReady = true
    perf('startup-playback-ready', 'video')
  }

  function playVideo() {
    if (!media || media.tagName !== 'VIDEO') return
    if (paintSeen && cfg.audio.mode === 'video') {
      try { media.muted = false } catch (error) { /* ignore */ }
    }
    var play
    try {
      play = media.play()
    } catch (error) {
      play = null
    }
    if (play && typeof play.then === 'function') {
      play.then(function () {
        markPlaybackReady()
      }, function () {
        try {
          media.muted = true
          media.setAttribute('muted', '')
        } catch (error) {
          /* ignore */
        }
        setText('系统拦截了声音 · 静音播放')
        var retry = media.play()
        if (retry && typeof retry.catch === 'function') {
          retry.then(function () {
            markPlaybackReady()
          }, function () {
            log('startup-media-play-blocked')
            complete('play-blocked')
          })
        } else {
          markPlaybackReady()
        }
      })
    } else {
      perf('animation-play', 'video')
      markPlaybackReady()
    }
  }

  function startFrameLoop(force) {
    if ((frameLoopActive && force !== true) || !media || typeof media.requestVideoFrameCallback !== 'function' || done) return
    frameLoopActive = true
    frameLoopToken += 1
    var token = frameLoopToken
    var loop = function (ts) {
      if (done || !media || token !== frameLoopToken) return
      if (animationVisible) frameTimes.push(typeof ts === 'number' ? ts : now())
      if (!frameSeen) shown()
      var since = animationVisible && animationAt > 0 ? animationAt : t0
      // 5s is enough to span the startup animation; stop the callback loop so
      // it cannot leak into normal running. While the first frame is pending,
      // the no-frame timer is the bounded failure path.
      if ((!frameSeen || frameTimes.length < 600) && now() - since < 5000) {
        try {
          media.requestVideoFrameCallback(loop)
        } catch (error) {
          reportFrameStats()
        }
      } else {
        reportFrameStats()
      }
    }
    try {
      media.requestVideoFrameCallback(loop)
    } catch (error) {
      reportFrameStats()
    }
    if (animationVisible) scheduleFrameStats()
  }

  function scheduleFrameStats() {
    if (frameStatsTimer !== null) return
    frameStatsTimer = timer(function () { reportFrameStats() }, 3000)
  }

  function reportFrameStats() {
    if (!animationVisible) return
    if (frameStatsTimer !== null) {
      clearTimer(frameStatsTimer)
      frameStatsTimer = null
    }
    if (!frameTimes.length) return
    var intervals = []
    for (var i = 1; i < frameTimes.length; i += 1) intervals.push(frameTimes[i] - frameTimes[i - 1])
    intervals.sort(function (a, b) { return a - b })
    var sum = 0
    var over20 = 0
    for (var j = 0; j < intervals.length; j += 1) {
      sum += intervals[j]
      if (intervals[j] > 20) over20 += 1
    }
    var p95 = intervals.length ? intervals[Math.floor(intervals.length * 0.95)] : 0
    var max = intervals.length ? intervals[intervals.length - 1] : 0
    var quality = null
    try {
      quality = typeof media.getVideoPlaybackQuality === 'function' ? media.getVideoPlaybackQuality() : null
    } catch (error) {
      quality = null
    }
    perf(
      'frames',
      'presented=' + frameTimes.length +
        ' avg=' + round(intervals.length ? sum / intervals.length : 0) + 'ms' +
        ' p95=' + round(p95) + 'ms' +
        ' max=' + round(max) + 'ms' +
        ' >20ms=' + over20 +
        (quality ? ' dropped=' + quality.droppedVideoFrames + '/' + quality.totalVideoFrames : ' dropped=n/a'),
    )
    if (longTasks.length) {
      var longest = 0
      var details = []
      for (var k = 0; k < longTasks.length; k += 1) {
        longest = Math.max(longest, longTasks[k].duration)
        if (details.length < 8) details.push(round(longTasks[k].start - t0) + '+' + round(longTasks[k].duration))
      }
      perf('longtasks', 'count=' + longTasks.length + ' max=' + round(longest) + 'ms list=' + details.join(','))
    }
  }

  function shown() {
    if (frameSeen || done) return
    frameSeen = true
    if (media) media.setAttribute('data-shown', '1')
    if (media && media._dbsNoFrame) clearTimer(media._dbsNoFrame)
    perf('first-frame-ready', cfg.item.kind)
    perf('startup-first-frame-ready', cfg.item.kind)
    reportWindow('startup-first-frame-ready', cfg.item.kind)
    // Pause on the real first frame even when the window is hidden or not yet
    // composited. The animation restarts at t=0 once paint is proven, so a
    // hidden preload can never consume the opening seconds.
    pauseAfterFrame()
    if (paintSeen) {
      resumeAfterFrame()
      markAnimationVisible()
    }
  }

  function startDuration() {
    if (started || done) return
    started = true
    startedAt = now()
    var ms = clamp(cfg.durationMs, 500, 300000)
    cfg.startedAt = startedAt
    cfg.endsAt = startedAt + ms
    if (ms > 0) {
      timer(function () {
        if (!done) complete('timer')
      }, ms)
    }
  }

  function watchAppReady() {
    var stop = function () {
      if (observer) {
        try { observer.disconnect() } catch (error) { /* ignore */ }
        observer = null
      }
      if (pollTimer !== null) {
        try { global.clearInterval(pollTimer) } catch (error) { /* ignore */ }
        pollTimer = null
      }
    }
    var check = function () {
      if (done || appReady) return
      if (detectAppReady()) {
        appReady = true
        perf('main-ui-ready')
        stop()
        tryEnter()
      }
    }
    var attach = function () {
      if (observer || appReady || done) return
      var container = doc.getElementById('root')
      if (!container) return
      try {
        observer = new global.MutationObserver(check)
        // Only #root: observing documentElement.subtree fires for every node
        // the app mounts and adds avoidable main-thread work in the exact
        // first-second window we are optimizing.
        observer.observe(container, { childList: true })
      } catch (error) {
        observer = null
      }
    }
    check()
    if (appReady || done) return
    attach()
    pollTimer = global.setInterval(function () {
      check()
      attach()
    }, 180)
    timers.push(pollTimer)
  }

  function detectAppReady() {
    var container = doc.getElementById('root')
    if (!container) return false
    var children = container.children
    if (!children || children.length === 0) return false
    for (var index = 0; index < children.length; index += 1) {
      var child = children[index]
      if (child && typeof child.hasAttribute === 'function' && !child.hasAttribute('data-dsh-boot')) return true
    }
    return false
  }

  function watchBackground() {
    if (!cfg.background) {
      backgroundReady = true
      return
    }
    var onReady = function (event) {
      if (done || backgroundReady) return
      backgroundReady = true
      var ok = event && event.detail && event.detail.ok
      log('background-ready', ok === false ? 'failed' : 'ok')
      tryEnter()
    }
    global.addEventListener(cfg.readyEvent || 'dbs:background-ready', onReady, { once: true })
    // A Studio that mounted before this listener attaches exposes a flag.
    try {
      var studio = global.__DBS_STUDIO__
      if (studio && (studio.backgroundReady === true || (studio.timeline && studio.timeline['background-restored']))) {
        backgroundReady = true
        log('background-ready', 'already')
      }
    } catch (error) {
      /* ignore */
    }
  }

  function emit(name) {
    try {
      global.dispatchEvent(new global.CustomEvent(name, { detail: { bootId: cfg.bootId } }))
    } catch (error) {
      /* CustomEvent may be unavailable */
    }
  }

  function complete(reason) {
    if (done || clipDone) return
    clipDone = true
    naturalAt = now()
    cfg.ended = true
    if (reason !== 'timer' && reason !== 'ended') {
      perf('startup-fallback', reason)
      reportWindow('startup-fallback', reason)
    }
    perf('startup-animation-ended', reason)
    emit('dbs:startup-ending')
    tryEnter()
  }

  function requestSkip(who) {
    if (done || skipped) return
    skipped = true
    clipDone = true
    naturalAt = now()
    cfg.skipped = true
    perf('startup-animation-skipped', who)
    reportWindow('startup-fallback', 'skipped')
    // Stop the startup decoder immediately; the background may be starting now.
    try {
      if (media && media.tagName === 'VIDEO') media.pause()
      if (audioEl) audioEl.pause()
    } catch (error) {
      /* ignore */
    }
    emit('dbs:startup-skip')
    timer(function () {
      if (!done && !leaving) {
        appReady = true
        backgroundReady = true
        enter('skip-timeout')
      }
    }, 3000)
    tryEnter()
  }

  function tryEnter() {
    if (done || leaving) return
    if (!clipDone) return
    if (skipped) {
      if (!appReady || !backgroundReady) return
      enter('skip')
      return
    }
    if (mode === 'background' && Number(cfg.holdMs) > 0) {
      var remaining = Number(cfg.holdMs) - (now() - naturalAt)
      if (remaining > 0) {
        if (root) root.dataset.holding = '1'
        timer(function () {
          if (!done && !leaving) tryEnter()
        }, remaining + 20)
        return
      }
    }
    if (!appReady || !backgroundReady) return
    enter('end')
  }

  function enter(reason) {
    if (done || leaving) return
    // Never remove the startup surface before the compositor has produced
    // frames for the window: doing so would reveal the unfinished application
    // the moment the user finally sees it.
    if (!paintSeen) {
      pendingEnter = reason
      log('startup-enter-deferred', 'no painted frame: ' + reason)
      return
    }
    leaving = true
    cfg.active = false
    emit('dbs:startup-ending')
    var fade = reason.indexOf('skip') === 0 ? Math.min(320, clamp(cfg.fadeOutMs, 0, 5000)) : clamp(cfg.fadeOutMs, 0, 5000)
    clearTimers()
    if (root) {
      root.style.setProperty('--dbs-boot-fade', fade + 'ms')
      root.setAttribute('data-state', 'leaving')
    }
    if (skipButton) {
      skipButton.disabled = true
      skipButton.setAttribute('data-state', 'leaving')
    }
    log('startup-overlay-leaving', reason)
    timer(function () { cleanup(reason) }, fade + 120)
  }

  function cleanup(reason) {
    if (done) return
    done = true
    cfg.active = false
    cfg.handled = true
    if (paintRaf) {
      try { global.cancelAnimationFrame(paintRaf) } catch (error) { /* ignore */ }
      paintRaf = 0
    }
    clearTimers()
    try {
      if (media) {
        media.pause()
        media.removeAttribute('src')
        media.load?.()
      }
    } catch (error) {
      /* ignore */
    }
    try {
      if (audioEl) {
        audioEl.pause()
        audioEl.removeAttribute('src')
        audioEl.load?.()
      }
    } catch (error) {
      /* ignore */
    }
    try {
      if (root && root.parentNode) root.parentNode.removeChild(root)
    } catch (error) {
      /* ignore */
    }
    try {
      if (skipButton && skipButton.parentNode) skipButton.parentNode.removeChild(skipButton)
    } catch (error) {
      /* ignore */
    }
    try {
      doc.documentElement.removeAttribute('data-dbs-boot-bg')
      doc.documentElement.removeAttribute('data-dbs-boot-fg')
    } catch (error) {
      /* ignore */
    }
    log('startup-overlay-removed', reason)
    try {
      global.dispatchEvent(new global.CustomEvent('dbs:startup-ended', { detail: { reason: reason } }))
    } catch (error) {
      /* ignore */
    }
    perf('normal-running')
  }

  function clamp(value, min, max) {
    var n = typeof value === 'number' ? value : Number(value)
    if (n !== n) return min
    return Math.min(max, Math.max(min, n))
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : typeof self !== 'undefined'
        ? self
        : this,
)
