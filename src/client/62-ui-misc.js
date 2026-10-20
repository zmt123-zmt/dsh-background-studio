/* =========================================================================
 * 62-ui-misc — audio library, global settings and toast stack.
 * ========================================================================= */

function AudioView({ studio }) {
  const importAudio = () => pickFiles({ accept: AUDIO_ACCEPT, multiple: true, onPaths: (paths) => studio.importFiles(paths, 'audio') })
  const tracks = studio.state.audio.slice().sort((left, right) => String(right.importedAt).localeCompare(String(left.importedAt)))
  return h('div', { className: 'dbs-audio' },
    h('div', { className: 'dbs-toolbar' },
      h('div', { className: 'dbs-toolbar-title' }, `已导入 ${tracks.length} 个音频`),
      h('div', { className: 'dbs-toolbar-group' },
        h(Button, { variant: 'primary', icon: IconPlus, onClick: importAudio }, '添加音频'),
      ),
    ),
    h('div', { className: 'dbs-note' }, '每个背景可以关联多个音频，但同一时刻只播放其中一个。音频文件只被读取，不会被修改或上传。'),
    tracks.length === 0
      ? h(EmptyState, {
          icon: IconMusic,
          title: '音频库是空的',
          text: '导入 MP3、WAV、OGG 或 FLAC 等音频，然后在背景设置里绑定。',
          action: h(Button, { variant: 'primary', icon: IconPlus, onClick: importAudio }, '添加第一段音频'),
        })
      : h('div', { className: 'dbs-audio-list' }, tracks.map((track) => {
          const usage = studio.audioUsage(track.id)
          const previewing = studio.audioPreviewId === track.id
          return h('div', { key: track.id, className: cx('dbs-audio-row', track.missing && 'is-missing') },
            h('div', { className: 'dbs-audio-icon' }, h(IconMusic)),
            h('div', { className: 'dbs-audio-main' },
              h('div', { className: 'dbs-audio-name' }, track.name, track.missing ? h(Chip, { tone: 'danger' }, '丢失') : null),
              h('div', { className: 'dbs-audio-meta' },
                h('span', null, track.ext.replace('.', '').toUpperCase()),
                h('span', null, track.duration > 0 ? formatDuration(track.duration) : '时长未知'),
                h('span', null, formatBytes(track.size)),
                h('span', null, usage > 0 ? `被 ${usage} 个背景使用` : '未绑定'),
                h('span', null, track.storage === 'copy' ? '插件副本' : '引用原文件'),
              ),
              h('div', { className: 'dbs-audio-path', title: track.path }, track.path),
            ),
            h('div', { className: 'dbs-audio-actions' },
              h(Button, {
                size: 'sm',
                icon: previewing ? IconPause : IconPlay,
                onClick: () => studio.togglePreviewAudio(track.id),
                disabled: track.missing,
              }, previewing ? '停止试听' : '试听'),
              h(IconButton, {
                icon: IconFolder,
                label: '重新定位',
                onClick: () => pickFiles({
                  accept: AUDIO_ACCEPT,
                  multiple: false,
                  onPaths: (paths) => studio.relocate(track.id, paths[0]),
                }),
              }),
              h(IconButton, {
                icon: IconTrash,
                label: '移除音频记录',
                onClick: () => {
                  if (window.confirm(`移除音频「${track.name}」？已绑定它的背景会解除关联，磁盘文件不会被删除。`)) studio.removeAudio(track.id)
                },
              }),
            ),
          )
        })),
  )
}

function SettingsView({ studio }) {
  const global = studio.state.global
  const setGlobal = (patch) => studio.updateGlobal(patch)
  return h('div', { className: 'dbs-settings' },
    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '导入与素材'),
      h(Field, { label: '默认导入方式', hint: '复制模式会把文件复制到插件数据目录；引用模式只记录路径。' },
        h(Segmented, {
          value: global.importMode,
          onChange: (value) => setGlobal({ importMode: value }),
          options: [
            { value: 'reference', label: '引用原文件' },
            { value: 'copy', label: '复制到插件目录' },
          ],
        }),
      ),
      h(Field, { label: '默认停留时间（秒）', hint: '图片 / GIF 的默认轮播停留；视频默认完整播放后切换。' },
        h('input', {
          className: 'dbs-input',
          type: 'number',
          min: 1,
          step: 1,
          value: global.defaultDwellSeconds,
          onChange: (event) => setGlobal({ defaultDwellSeconds: clamp(Number(event.target.value) || 1, 1, 86400) }),
        }),
      ),
      h(Field, { label: '默认视图' },
        h(Segmented, {
          value: global.libraryView,
          onChange: (value) => setGlobal({ libraryView: value }),
          options: [{ value: 'grid', label: '网格' }, { value: 'list', label: '列表' }],
        }),
      ),
    ),
    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '界面与可读性'),
      h('p', { className: 'dbs-settings-text' }, '透明度只作用于背景层；界面表面的半透明由下面两个值控制。亮色主题需要更高的表面不透明度，否则深色文字会难读。'),
      h(Field, { label: `暗色主题表面不透明度 ${Math.round(global.surface.dark * 100)}%` },
        h(Range, {
          value: Math.round(global.surface.dark * 100),
          min: 5,
          max: 92,
          step: 1,
          onChange: (value) => setGlobal({ surface: { dark: value / 100 } }),
          format: (value) => `${Math.round(value)}%`,
        }),
      ),
      h(Field, { label: `亮色主题表面不透明度 ${Math.round(global.surface.light * 100)}%` },
        h(Range, {
          value: Math.round(global.surface.light * 100),
          min: 5,
          max: 95,
          step: 1,
          onChange: (value) => setGlobal({ surface: { light: value / 100 } }),
          format: (value) => `${Math.round(value)}%`,
        }),
      ),
      h(Field, { label: '背景切换 / 音频淡入淡出（毫秒）' },
        h('input', {
          className: 'dbs-input',
          type: 'number',
          min: 0,
          max: 5000,
          step: 50,
          value: global.fadeMs,
          onChange: (event) => setGlobal({ fadeMs: clamp(Number(event.target.value) || 0, 0, 5000) }),
        }),
      ),
    ),
    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '声音'),
      h('div', { className: 'dbs-rowline' },
        h('span', null, '全局静音'),
        h(Toggle, { checked: global.audio.muted, onChange: (value) => setGlobal({ audio: { muted: value } }) }),
      ),
      h(Field, { label: `主音量 ${Math.round(global.audio.masterVolume * 100)}%` },
        h(Range, {
          value: global.audio.masterVolume,
          min: 0,
          max: 1,
          step: 0.01,
          onChange: (value) => setGlobal({ audio: { masterVolume: value } }),
          format: (value) => `${Math.round(value * 100)}%`,
        }),
      ),
      h('p', { className: 'dbs-settings-text' }, '第一次使用某个背景时，视频原声默认开启。之后以你在背景设置里保存的音量为准，不会每次启动都重置。'),
    ),
    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '启动与恢复'),
      h('div', { className: 'dbs-rowline' },
        h('span', null, '启动后恢复上次背景 / 轮播'),
        h(Toggle, { checked: global.startup.restore, onChange: (value) => setGlobal({ startup: { restore: value } }) }),
      ),
      h('div', { className: 'dbs-rowline' },
        h('span', null, '恢复后自动播放'),
        h(Toggle, { checked: global.startup.autoPlay, onChange: (value) => setGlobal({ startup: { autoPlay: value } }) }),
      ),
      h('p', { className: 'dbs-settings-text' }, '轮播进度只恢复「方案 + 当前项」，不会恢复某项剩余几秒；这样重启后不会从一个奇怪的时间点继续。'),
    ),
    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '数据与诊断'),
      h('dl', { className: 'dbs-meta' },
        h('dt', null, '数据目录'), h('dd', { title: studio.root }, studio.root || '由 Host 提供'),
        h('dt', null, '背景层'), h('dd', null, studio.renderer?.currentAsset ? '已挂载' : '未启用'),
        h('dt', null, '音频上下文'), h('dd', null, studio.audio?.ctx?.state ?? (studio.audio?.failed ? '不可用' : '未创建')),
        h('dt', null, '素材数量'), h('dd', null, `${studio.state.assets.length} 个背景 / ${studio.state.audio.length} 个音频`),
      ),
      h('div', { className: 'dbs-settings-actions' },
        h(Button, { icon: IconRefresh, onClick: () => {
          if (window.confirm('恢复默认界面设置？不会删除背景库、轮播方案或音频。')) {
            studio.updateGlobal(defaultClientState().global)
          }
        } }, '恢复默认界面设置'),
        h(Button, { icon: IconTrash, variant: 'danger', onClick: () => {
          if (window.confirm('清除当前背景显示并停止轮播？素材和方案会保留。')) studio.stopPlayback()
        } }, '停止当前播放'),
      ),
    ),
    h('section', { className: 'dbs-settings-card is-muted' },
      h('h3', null, '当前阶段明确不支持'),
      h('ul', { className: 'dbs-limits' },
        h('li', null, '不能把背景铺到 Windows 桌面、其他窗口或桌面图标上；只作用于 DSH 窗口内部。'),
        h('li', null, '0% 透明度显示 DSH 默认背景，不能透过窗口看到桌面。'),
        h('li', null, 'P0 使用浏览器原生渲染；不会伪装「渲染分辨率 / 帧率」滑块。Canvas 限帧属于后续阶段。'),
        h('li', null, 'MOV / APNG / 动态 WebP / FLAC / OGG 不作为首期验收格式；能识别时会尝试播放，失败会明确提示。'),
        h('li', null, '不修改、不移动、不删除用户的原始媒体文件。'),
      ),
    ),
  )
}

function ToastStack({ studio }) {
  if (!studio || studio.toasts.length === 0) return null
  return h('div', { className: 'dbs-toasts', role: 'status', 'aria-live': 'polite' },
    studio.toasts.map((toast) => h('div', { key: toast.id, className: cx('dbs-toast', `is-${toast.kind}`) },
      h('span', { className: 'dbs-toast-mark' }, toast.kind === 'success' ? h(IconCheck) : toast.kind === 'error' || toast.kind === 'warning' ? h(IconWarning) : h(IconBackground)),
      h('span', { className: 'dbs-toast-text' }, toast.message),
      h('button', { type: 'button', className: 'dbs-toast-close', onClick: () => studio.dismissToast(toast.id), 'aria-label': '关闭提示' }, h(IconClose)),
    )),
  )
}
