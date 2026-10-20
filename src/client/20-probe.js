/* =========================================================================
 * 20-probe — real metadata, an ISO-BMFF (MP4/MOV) track reader, thumbnails.
 * No value here is invented: anything unavailable is reported as unknown.
 * ========================================================================= */

function waitForEvent(target, event, timeoutMs, errorEvents = ['error']) {
  return new Promise((resolve, reject) => {
    let settled = false
    const cleanup = () => {
      target.removeEventListener(event, onOk)
      for (const name of errorEvents) target.removeEventListener(name, onError)
      target.removeEventListener('abort', onError)
      window.clearTimeout(timer)
    }
    const onOk = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('媒体加载失败'))
    }
    const timer = window.setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('媒体加载超时'))
    }, timeoutMs)
    target.addEventListener(event, onOk, { once: true })
    for (const name of errorEvents) target.addEventListener(name, onError, { once: true })
  })
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function readRange(url, offset, length) {
  const response = await fetch(url, { headers: { Range: `bytes=${offset}-${offset + length - 1}` } })
  if (!response.ok) throw new Error(`range ${response.status}`)
  if (response.status === 200 && length < 1024 * 1024) {
    const buffer = await response.arrayBuffer()
    return new Uint8Array(buffer.slice(offset, offset + length))
  }
  if (response.status !== 206) throw new Error(`range ${response.status}`)
  return new Uint8Array(await response.arrayBuffer())
}

function boxHeader(bytes) {
  if (bytes.byteLength < 8) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let size = view.getUint32(0)
  const type = String.fromCharCode(view.getUint8(4), view.getUint8(5), view.getUint8(6), view.getUint8(7))
  let header = 8
  if (size === 1) {
    if (bytes.byteLength < 16) return null
    const high = view.getUint32(8)
    const low = view.getUint32(12)
    size = high * 4294967296 + low
    header = 16
  } else if (size === 0) {
    size = Number.MAX_SAFE_INTEGER
  }
  return { size, type, header }
}

/** Walk immediate child boxes inside a moov buffer. */
function eachBox(buffer, start, end, visit) {
  let offset = start
  while (offset + 8 <= end) {
    const header = boxHeader(buffer.slice(offset, Math.min(end, offset + 16)))
    if (!header || header.size < header.header) break
    const boxEnd = Math.min(end, offset + header.size)
    visit(header.type, offset, offset + header.header, boxEnd)
    if (header.size === Number.MAX_SAFE_INTEGER) break
    offset = boxEnd
    if (offset <= start) break
  }
}

function findBox(buffer, start, end, type) {
  let found = null
  eachBox(buffer, start, end, (boxType, boxStart, payloadStart, boxEnd) => {
    if (boxType === type && found === null) found = { start: boxStart, payload: payloadStart, end: boxEnd }
  })
  return found
}

function findPath(buffer, start, end, types) {
  let current = { start, end }
  for (const type of types) {
    const box = findBox(buffer, current.start, current.end, type)
    if (!box) return null
    current = { start: box.payload, end: box.end }
  }
  return current
}

function readHandler(buffer, payload, end) {
  if (payload + 12 > end) return ''
  return String.fromCharCode(
    buffer[payload + 8],
    buffer[payload + 9],
    buffer[payload + 10],
    buffer[payload + 11],
  )
}

function readMdhd(buffer, payload, end) {
  if (payload + 4 > end) return null
  const version = buffer[payload]
  if (version === 1) {
    if (payload + 32 > end) return null
    const timescale = new DataView(buffer.buffer, buffer.byteOffset + payload + 20, 4).getUint32(0)
    const durationHigh = new DataView(buffer.buffer, buffer.byteOffset + payload + 24, 4).getUint32(0)
    const durationLow = new DataView(buffer.buffer, buffer.byteOffset + payload + 28, 4).getUint32(0)
    return { timescale, duration: durationHigh * 4294967296 + durationLow }
  }
  if (payload + 20 > end) return null
  const timescale = new DataView(buffer.buffer, buffer.byteOffset + payload + 12, 4).getUint32(0)
  const duration = new DataView(buffer.buffer, buffer.byteOffset + payload + 16, 4).getUint32(0)
  return { timescale, duration }
}

function readVideoSize(buffer, stsdPayload, stsdEnd) {
  if (stsdPayload + 16 > stsdEnd) return null
  // version/flags + entry_count -> first sample entry
  const entry = stsdPayload + 8
  if (entry + 28 > stsdEnd) return null
  const view = new DataView(buffer.buffer, buffer.byteOffset + entry, 28)
  return { width: view.getUint16(24), height: view.getUint16(26) }
}

function readSttsSamples(buffer, payload, end) {
  if (payload + 8 > end) return 0
  const count = new DataView(buffer.buffer, buffer.byteOffset + payload + 4, 4).getUint32(0)
  let samples = 0
  let offset = payload + 8
  for (let index = 0; index < count && offset + 8 <= end; index += 1) {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8)
    samples += view.getUint32(0)
    offset += 8
  }
  return samples
}

/** Parse the moov atom for real track presence and source FPS. */
function parseMoov(buffer) {
  const result = { hasAudio: null, width: 0, height: 0, fps: 0, duration: 0 }
  const moov = boxHeader(buffer)
  if (!moov || moov.type !== 'moov') return result
  const moovEnd = buffer.byteLength
  const mvhd = findBox(buffer, moov.header, moovEnd, 'mvhd')
  if (mvhd) {
    const data = readMdhd(buffer, mvhd.payload, mvhd.end)
    if (data && data.timescale > 0) result.duration = data.duration / data.timescale
  }
  eachBox(buffer, moov.header, moovEnd, (type, trakStart, trakPayload, trakEnd) => {
    if (type !== 'trak') return
    const mdia = findBox(buffer, trakPayload, trakEnd, 'mdia')
    const hdlr = mdia ? findBox(buffer, mdia.payload, mdia.end, 'hdlr') : null
    const handler = hdlr ? readHandler(buffer, hdlr.payload, hdlr.end) : ''
    const mdhd = mdia ? findBox(buffer, mdia.payload, mdia.end, 'mdhd') : null
    const timing = mdhd ? readMdhd(buffer, mdhd.payload, mdhd.end) : null
    const stbl = findPath(buffer, trakPayload, trakEnd, ['mdia', 'minf', 'stbl'])
    if (handler === 'soun') result.hasAudio = true
    if (handler === 'vide') {
      result.video = true
      if (stbl) {
        const stsd = findBox(buffer, stbl.start, stbl.end, 'stsd')
        if (stsd) {
          const size = readVideoSize(buffer, stsd.payload, stsd.end)
          if (size && size.width > 0) {
            result.width = size.width
            result.height = size.height
          }
        }
        const stts = findBox(buffer, stbl.start, stbl.end, 'stts')
        if (stts && timing && timing.timescale > 0 && timing.duration > 0) {
          const samples = readSttsSamples(buffer, stts.payload, stts.end)
          const seconds = timing.duration / timing.timescale
          if (seconds > 0 && samples > 0) result.fps = samples / seconds
        }
      }
    }
  })
  if (result.video && result.hasAudio === null) result.hasAudio = false
  return result
}

async function parseMp4Info(asset) {
  const ext = str(asset.ext).toLowerCase()
  if (!['.mp4', '.m4v', '.mov'].includes(ext)) return null
  const size = num(asset.size, 0)
  if (size <= 0) return null
  try {
    let offset = 0
    for (let index = 0; index < 64 && offset + 16 <= size; index += 1) {
      const headerBytes = await readRange(mediaUrl(asset.id), offset, 16)
      const header = boxHeader(headerBytes)
      if (!header) break
      if (header.type === 'moov') {
        if (header.size > 48 * 1024 * 1024) return null
        const moov = await readRange(mediaUrl(asset.id), offset, header.size)
        return parseMoov(moov)
      }
      if (header.size === Number.MAX_SAFE_INTEGER) break
      offset += header.size
    }
  } catch (error) {
    console.warn('[dsh-background-studio] MP4 信息读取失败', error)
    return null
  }
  return null
}

async function measureVideoFps(video, duration) {
  if (typeof video.requestVideoFrameCallback !== 'function') return 0
  try {
    video.muted = true
    video.currentTime = 0
    await video.play()
  } catch {
    return 0
  }
  let frames = 0
  let first = 0
  let last = 0
  let stopped = false
  const onFrame = (now) => {
    if (stopped) return
    if (first === 0) first = now
    last = now
    frames += 1
    if (frames >= 30 || now - first >= 1200) {
      stopped = true
      return
    }
    video.requestVideoFrameCallback(onFrame)
  }
  video.requestVideoFrameCallback(onFrame)
  await sleep(Math.min(1600, Math.max(700, num(duration, 2) * 250)))
  stopped = true
  try {
    video.pause()
  } catch {
    /* ignore */
  }
  if (frames < 2 || last <= first) return 0
  return (frames - 1) / ((last - first) / 1000)
}

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 270
  return canvas
}

function drawCover(canvas, source, width, height) {
  const context = canvas.getContext('2d')
  if (!context) return false
  try {
    const scale = Math.max(canvas.width / width, canvas.height / height)
    const drawWidth = width * scale
    const drawHeight = height * scale
    context.drawImage(source, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight)
    return true
  } catch {
    return false
  }
}

async function uploadThumb(asset, canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
  if (!blob) return false
  await apiUploadThumb(asset.id, blob)
  return true
}

async function probeVideo(asset) {
  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'
  video.src = mediaUrl(asset.id)
  const result = {
    width: 0,
    height: 0,
    duration: 0,
    fps: 0,
    hasAudio: null,
    animated: true,
    thumb: false,
    probeError: null,
  }
  try {
    await waitForEvent(video, 'loadedmetadata', 12000)
    result.width = video.videoWidth || 0
    result.height = video.videoHeight || 0
    result.duration = Number.isFinite(video.duration) ? video.duration : 0
    if (typeof video.audioTracks !== 'undefined' && video.audioTracks) {
      if (video.audioTracks.length > 0) result.hasAudio = true
    }
    const mp4 = await parseMp4Info(asset)
    if (mp4) {
      if (mp4.hasAudio === true) result.hasAudio = true
      if (mp4.width > 0 && result.width === 0) result.width = mp4.width
      if (mp4.height > 0 && result.height === 0) result.height = mp4.height
      if (mp4.fps > 0) result.fps = Math.round(mp4.fps * 100) / 100
    }
    if (result.fps === 0 && result.duration > 0) {
      const measured = await measureVideoFps(video, result.duration)
      if (measured > 0) result.fps = Math.round(measured * 100) / 100
    }
    const seekTo = result.duration > 0 ? Math.min(Math.max(0.5, result.duration * 0.1), result.duration - 0.1) : 0
    if (seekTo > 0) {
      video.currentTime = seekTo
      await waitForEvent(video, 'seeked', 6000).catch(() => {})
    }
    if (video.videoWidth > 0) {
      const canvas = makeCanvas()
      if (drawCover(canvas, video, video.videoWidth, video.videoHeight)) {
        await uploadThumb(asset, canvas).catch(() => false)
        result.thumb = true
      }
    }
  } catch (error) {
    result.probeError = error instanceof Error ? error.message : String(error)
  } finally {
    try {
      video.pause()
    } catch {
      /* ignore */
    }
    video.removeAttribute('src')
    try {
      video.load()
    } catch {
      /* ignore */
    }
  }
  return result
}

async function probeImage(asset) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = mediaUrl(asset.id)
  const result = {
    width: 0,
    height: 0,
    duration: 0,
    fps: 0,
    hasAudio: false,
    animated: asset.kind === 'gif',
    thumb: false,
    probeError: null,
  }
  try {
    await waitForEvent(image, 'load', 12000)
    result.width = image.naturalWidth || 0
    result.height = image.naturalHeight || 0
    if (result.width > 0 && result.height > 0) {
      const canvas = makeCanvas()
      if (drawCover(canvas, image, result.width, result.height)) {
        await uploadThumb(asset, canvas).catch(() => false)
        result.thumb = true
      }
    }
  } catch (error) {
    result.probeError = error instanceof Error ? error.message : String(error)
  }
  return result
}

async function probeAsset(asset) {
  if (asset.kind === 'video') return probeVideo(asset)
  return probeImage(asset)
}

function probeAudioDuration(track) {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.src = audioUrl(track.id)
    const cleanup = () => {
      audio.removeAttribute('src')
      try {
        audio.load()
      } catch {
        /* ignore */
      }
    }
    const timer = window.setTimeout(() => {
      cleanup()
      reject(new Error('音频元数据超时'))
    }, 8000)
    audio.addEventListener('loadedmetadata', () => {
      window.clearTimeout(timer)
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0
      cleanup()
      resolve(duration)
    }, { once: true })
    audio.addEventListener('error', () => {
      window.clearTimeout(timer)
      cleanup()
      reject(new Error('音频加载失败'))
    }, { once: true })
  })
}
