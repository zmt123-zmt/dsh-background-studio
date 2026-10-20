import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('.', import.meta.url))
const clientDir = path.join(root, 'src', 'client')
const order = [
  '00-core.js',
  '10-studio.js',
  '20-probe.js',
  '30-renderer.js',
  '40-audio.js',
  '50-playlist.js',
  '55-startup.js',
  '60-ui-panel.js',
  '61-ui-playlist.js',
  '62-ui-misc.js',
  '63-ui-quickbar.js',
  '64-ui-startup.js',
  '70-apply.js',
]
const css = fs.readFileSync(path.join(clientDir, 'styles.css'), 'utf8')
const body = order
  .map((file) => `/* ---- ${file} ---- */\n${fs.readFileSync(path.join(clientDir, file), 'utf8')}`)
  .join('\n')

const output = `window.__ModuleLoader__.load({
  id: 'dsh-background-studio',
  factory(require) {
    const React = require('react')
    const DBS_CSS = ${JSON.stringify(css)}
${body}
    return { name: 'dsh-background-studio', inject: ['slots'], apply }
  },
});
`

fs.writeFileSync(path.join(root, 'client.js'), output, 'utf8')
console.log(`client.js written (${output.length} bytes, ${order.length} fragments)`)
