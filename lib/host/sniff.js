import fs from 'node:fs/promises'
import path from 'node:path'

const MIME = Object.freeze({
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.bmp': 'image/bmp',
  '.gif': 'image/gif',
  '.mp4': 'video/mp4',
  '.m4v': 'video/mp4',
  '.mov': 'video/quicktime',
  '.webm': 'video/webm',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.ogg': 'audio/ogg',
  '.flac': 'audio/flac',
  '.m4a': 'audio/mp4',
  '.aac': 'audio/aac',
})

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.bmp', '.gif'])
const VIDEO_EXT = new Set(['.mp4', '.m4v', '.mov', '.webm'])
const AUDIO_EXT = new Set(['.mp3', '.wav', '.ogg', '.flac', '.m4a', '.aac'])

/** MIME type for a stored file; unknown extensions stay octet-stream. */
export function contentTypeFor(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] ?? 'application/octet-stream'
}

/** True when this extension is accepted as a background asset. */
export function isBackgroundExtension(ext) {
  return IMAGE_EXT.has(ext) || VIDEO_EXT.has(ext)
}

/** True when this extension is accepted as a bound audio track. */
export function isAudioExtension(ext) {
  return AUDIO_EXT.has(ext)
}

/**
 * Detect the real kind from magic bytes instead of trusting the extension.
 * Returns `{ kind, mime, ext, animated }` or null when unsupported.
 */
export async function detectFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  let head = Buffer.alloc(0)
  try {
    const handle = await fs.open(filePath, 'r')
    try {
      head = Buffer.alloc(64)
      const { bytesRead } = await handle.read(head, 0, head.length, 0)
      head = head.subarray(0, bytesRead)
    } finally {
      await handle.close()
    }
  } catch {
    return null
  }

  const ascii = (start, end) => head.subarray(start, end).toString('latin1')
  const signature = (bytes) => bytes.every((value, index) => head[index] === value)

  // ISO BMFF: MP4 / M4V / MOV / AVIF. The brand lives at bytes 8..12.
  if (head.length >= 12 && ascii(4, 8) === 'ftyp') {
    const brand = ascii(8, 12)
    if (brand === 'avif' || brand === 'avis') return { kind: 'image', mime: 'image/avif', ext: '.avif', animated: false }
    if (ext === '.mov' || brand === 'qt  ') return { kind: 'video', mime: 'video/quicktime', ext: '.mov', animated: false }
    return { kind: 'video', mime: 'video/mp4', ext: ext === '.m4v' ? '.m4v' : '.mp4', animated: false }
  }
  if (signature([0x1a, 0x45, 0xdf, 0xa3])) {
    if (ext === '.webm') return { kind: 'video', mime: 'video/webm', ext: '.webm', animated: false }
    return { kind: 'video', mime: 'video/webm', ext: '.webm', animated: false }
  }
  if (signature([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return { kind: 'image', mime: 'image/png', ext: '.png', animated: false }
  }
  if (signature([0xff, 0xd8, 0xff])) return { kind: 'image', mime: 'image/jpeg', ext: '.jpg', animated: false }
  if (ascii(0, 4) === 'GIF8') return { kind: 'gif', mime: 'image/gif', ext: '.gif', animated: true }
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') {
    return { kind: 'image', mime: 'image/webp', ext: '.webp', animated: true }
  }
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WAVE') {
    return { kind: 'audio', mime: 'audio/wav', ext: '.wav', animated: false }
  }
  if (ascii(0, 4) === 'OggS') return { kind: 'audio', mime: 'audio/ogg', ext: '.ogg', animated: false }
  if (ascii(0, 4) === 'fLaC') return { kind: 'audio', mime: 'audio/flac', ext: '.flac', animated: false }
  if (ascii(0, 3) === 'ID3' || signature([0xff, 0xfb]) || signature([0xff, 0xf3]) || signature([0xff, 0xf2])) {
    return { kind: 'audio', mime: 'audio/mpeg', ext: '.mp3', animated: false }
  }
  if (signature([0xff, 0xf1]) || signature([0xff, 0xf9])) {
    return { kind: 'audio', mime: 'audio/aac', ext: '.aac', animated: false }
  }

  // Fall back to the extension only when the bytes are inconclusive.
  if (IMAGE_EXT.has(ext)) {
    return { kind: ext === '.gif' ? 'gif' : 'image', mime: MIME[ext], ext, animated: ext === '.gif' }
  }
  if (VIDEO_EXT.has(ext)) return { kind: 'video', mime: MIME[ext], ext, animated: false }
  if (AUDIO_EXT.has(ext)) return { kind: 'audio', mime: MIME[ext], ext, animated: false }
  return null
}

/** Human-readable label used in errors. */
export function kindLabel(kind) {
  if (kind === 'audio') return '音频'
  if (kind === 'video') return '视频'
  if (kind === 'gif') return 'GIF 动图'
  if (kind === 'image') return '图片'
  return '未知'
}
