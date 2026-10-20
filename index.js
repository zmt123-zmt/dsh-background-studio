/**
 * Host half of DSH Background Studio.
 *
 * The browser half owns rendering, audio and playlists; this half owns the
 * filesystem: state persistence, import/copy, thumbnails and Range streaming.
 * Only node: builtins are imported so a broken optional service can never take
 * the whole DSH boot down with it.
 */
export { apply, name } from './lib/host/apply.js'
