import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

/** Resolve the single DSH home used by both the desktop app and the CLI. */
export function resolveDshHome(env = process.env) {
  const configured = typeof env.DSH_HOME === 'string' ? env.DSH_HOME.trim() : ''
  return path.resolve(configured.length > 0 ? configured : path.join(os.homedir(), '.dsh'))
}

/** All files owned by this plugin live under one directory. */
export function studioPaths(dshHome) {
  const root = path.join(dshHome, 'background-studio')
  return {
    root,
    state: path.join(root, 'state.json'),
    stateTmp: path.join(root, 'state.json.tmp'),
    stateBak: path.join(root, 'state.json.bak'),
    media: path.join(root, 'media'),
    thumbs: path.join(root, 'thumbs'),
    logs: path.join(root, 'logs'),
  }
}

export async function ensureDir(directory) {
  await fs.mkdir(directory, { recursive: true })
}
