/* =========================================================================
 * 63-ui-quickbar — frame-wide click-through overlay (bottom-left, away from
 * the DSH pet at bottom-right).
 * ========================================================================= */

function QuickBar() {
  const studio = useStudio()
  useTick(250)
  if (!studio || !studio.ready) return null
  const asset = studio.currentAsset()
  if (!asset) return null
  const runtime = studio.state.runtime
  const playlist = runtime.mode === 'playlist' ? studio.playlistById(runtime.playlistId) : null
  const progress = studio.playlist?.progress()
  const playing = runtime.playing === true
  const muted = studio.state.global.audio.muted === true
  const blocked = studio.audio?.blocked === true

  return h('div', { className: 'dbs-quickbar', role: 'region', 'aria-label': '背景快捷控制' },
    h('div', { className: 'dbs-quickbar-main', onClick: () => studio.openPanel(), role: 'button', tabIndex: 0, onKeyDown: (event) => {
      if (event.key === 'Enter') studio.openPanel()
    } },
      h('div', { className: 'dbs-quickbar-art' }, h(AssetThumb, { asset, className: 'dbs-thumb-quick' })),
      h('div', { className: 'dbs-quickbar-text' },
        h('div', { className: 'dbs-quickbar-name' }, asset.name),
        h('div', { className: 'dbs-quickbar-sub' },
          playlist ? `${playlist.name} · ${studio.playlist?.index + 1}/${studio.playlist?.queue.length}` : '单张背景',
          blocked ? ' · 点击页面开启声音' : '',
        ),
      ),
    ),
    h('div', { className: 'dbs-quickbar-controls' },
      playlist ? h(IconButton, { icon: IconPrev, label: '上一个背景', onClick: () => studio.prevPlaylist() }) : null,
      h(IconButton, {
        icon: playing ? IconPause : IconPlay,
        label: playing ? '暂停' : '播放',
        onClick: () => studio.togglePlay(),
        disabled: asset.kind !== 'video' && !playlist,
      }),
      playlist ? h(IconButton, { icon: IconNext, label: '下一个背景', onClick: () => studio.nextPlaylist() }) : null,
      h(IconButton, {
        icon: muted ? IconMute : IconVolume,
        label: muted ? '取消静音' : '静音',
        onClick: () => studio.updateGlobal({ audio: { muted: !muted } }),
      }),
    ),
    progress ? h('div', { className: 'dbs-quickbar-progress' }, h('span', { style: { width: `${Math.round(progress.ratio * 100)}%` } })) : null,
  )
}
