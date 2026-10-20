/* =========================================================================
 * 61-ui-playlists — playlist editor, audio library, settings and toasts.
 * ========================================================================= */

function AddAssetsModal({ studio, onClose, onAdd }) {
  const [checked, setChecked] = React.useState(() => new Set())
  const [query, setQuery] = React.useState('')
  const assets = studio.state.assets.filter((asset) => {
    if (asset.missing) return true
    if (query.trim().length === 0) return true
    return asset.name.toLowerCase().includes(query.trim().toLowerCase())
  })
  const toggle = (id) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
  }
  return h('div', { className: 'dbs-modal-backdrop', onMouseDown: (event) => {
    if (event.target === event.currentTarget) onClose()
  } },
    h('div', { className: 'dbs-modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': '添加素材到轮播' },
      h('div', { className: 'dbs-modal-head' },
        h('div', { className: 'dbs-modal-title' }, '把背景加入轮播'),
        h(IconButton, { icon: IconClose, label: '关闭', onClick: onClose }),
      ),
      h('div', { className: 'dbs-modal-toolbar' },
        h('div', { className: 'dbs-search' },
          h(IconSearch),
          h('input', { value: query, placeholder: '搜索素材…', onChange: (event) => setQuery(event.target.value) }),
        ),
        h('span', { className: 'dbs-muted' }, `已选 ${checked.size} 个`),
      ),
      h('div', { className: 'dbs-modal-list' },
        assets.length === 0 ? h('div', { className: 'dbs-muted dbs-pad' }, '背景库为空') : assets.map((asset) => h('label', {
          key: asset.id,
          className: cx('dbs-pick-row', checked.has(asset.id) && 'is-checked'),
        },
          h('input', { type: 'checkbox', checked: checked.has(asset.id), onChange: () => toggle(asset.id) }),
          h(AssetThumb, { asset, className: 'dbs-thumb-pick' }),
          h('span', { className: 'dbs-pick-name' }, asset.name, asset.missing ? h(Chip, { tone: 'danger' }, '丢失') : null),
          h('span', { className: 'dbs-pick-meta' }, kindText(asset.kind)),
        )),
      ),
      h('div', { className: 'dbs-modal-foot' },
        h(Button, { variant: 'ghost', onClick: onClose }, '取消'),
        h(Button, {
          variant: 'primary',
          disabled: checked.size === 0,
          onClick: () => {
            onAdd(Array.from(checked))
            onClose()
          },
        }, `添加 ${checked.size} 个`),
      ),
    ),
  )
}

function PlaylistView({ studio }) {
  const [selectedId, setSelectedId] = React.useState(() => studio.state.runtime.playlistId ?? studio.state.playlists[0]?.id ?? null)
  const [picker, setPicker] = React.useState(false)
  const playlist = selectedId ? studio.playlistById(selectedId) : null
  const playingId = studio.state.runtime.playlistId
  const isThisPlaying = playingId === playlist?.id && studio.state.runtime.mode === 'playlist'
  const progress = isThisPlaying ? studio.playlist?.progress() : null
  const currentAsset = studio.playlist?.currentAsset()
  const currentItem = studio.playlist?.currentItem()?.item

  React.useEffect(() => {
    if (selectedId && !studio.playlistById(selectedId)) {
      setSelectedId(studio.state.playlists[0]?.id ?? null)
    }
    if (!selectedId && studio.state.playlists.length > 0) {
      setSelectedId(studio.state.playlists[0].id)
    }
  }, [studio.state.playlists.length, selectedId])

  if (studio.state.playlists.length === 0) {
    return h('div', { className: 'dbs-playlists' },
      h(EmptyState, {
        icon: IconPlay,
        title: '还没有轮播方案',
        text: '创建一套方案，把多个背景排成播放列表；每个条目都可以单独设置停留时间。',
        action: h(Button, { variant: 'primary', icon: IconPlus, onClick: () => {
          const created = studio.createPlaylist('日常桌面')
          setSelectedId(created.id)
        } }, '创建轮播方案'),
      }),
    )
  }

  return h('div', { className: 'dbs-playlists' },
    h('div', { className: 'dbs-scheme-list' },
      h('div', { className: 'dbs-scheme-head' },
        h('span', null, '方案'),
        h(IconButton, { icon: IconPlus, label: '新建方案', onClick: () => {
          const created = studio.createPlaylist(`轮播 ${studio.state.playlists.length + 1}`)
          setSelectedId(created.id)
        } }),
      ),
      studio.state.playlists.map((entry) => h('button', {
        key: entry.id,
        type: 'button',
        className: cx('dbs-scheme', entry.id === selectedId && 'is-on'),
        onClick: () => setSelectedId(entry.id),
      },
        h('span', { className: 'dbs-scheme-name' }, entry.name),
        h('span', { className: 'dbs-scheme-meta' }, `${entry.items.length} 项`, entry.id === playingId ? '播放中' : ''),
        entry.id === playingId ? h('span', { className: 'dbs-scheme-dot' }) : null,
      )),
    ),
    playlist
      ? h('div', { className: 'dbs-playlist-editor' },
          h('div', { className: 'dbs-playlist-head' },
            h('input', {
              className: 'dbs-playlist-name',
              key: `${playlist.id}-${playlist.name}`,
              defaultValue: playlist.name,
              onBlur: (event) => studio.renamePlaylist(playlist.id, event.target.value),
              onKeyDown: (event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
              },
              'aria-label': '方案名称',
            }),
            h('div', { className: 'dbs-playlist-actions' },
              h(Button, { size: 'sm', icon: IconPlus, onClick: () => setPicker(true) }, '添加素材'),
              h(Button, { size: 'sm', icon: IconFolder, onClick: () => {
                const copy = studio.duplicatePlaylist(playlist.id)
                if (copy) setSelectedId(copy.id)
              } }, '复制'),
              h(Button, { size: 'sm', variant: 'danger', icon: IconTrash, onClick: () => {
                if (window.confirm(`删除轮播方案「${playlist.name}」？背景素材本身不会被删除。`)) {
                  studio.deletePlaylist(playlist.id)
                  setSelectedId(null)
                }
              } }, '删除'),
            ),
          ),
          h('div', { className: 'dbs-playlist-options' },
            h(Field, { label: '播放顺序' },
              h(Select, {
                value: playlist.shuffle,
                onChange: (value) => studio.updatePlaylist(playlist.id, { shuffle: value }),
                options: [
                  { value: 'off', label: '顺序播放' },
                  { value: 'random', label: '随机播放' },
                  { value: 'noRepeat', label: '随机不重复' },
                ],
              }),
            ),
            h('div', { className: 'dbs-rowline' }, h('span', null, '列表循环'), h(Toggle, {
              checked: playlist.loop,
              onChange: (value) => studio.updatePlaylist(playlist.id, { loop: value }),
            })),
            h('div', { className: 'dbs-rowline' }, h('span', null, '方案收藏'), h(Toggle, {
              checked: playlist.favorite,
              onChange: (value) => studio.updatePlaylist(playlist.id, { favorite: value }),
            })),
          ),
          h('div', { className: 'dbs-playback' },
            h('div', { className: 'dbs-playback-left' },
              h(Button, {
                variant: 'primary',
                icon: isThisPlaying && studio.playlist?.playing ? IconPause : IconPlay,
                onClick: () => {
                  if (!isThisPlaying) studio.startPlaylist(playlist.id)
                  else if (studio.playlist?.playing) studio.playlist.pause()
                  else studio.playlist.resume()
                },
              }, isThisPlaying && studio.playlist?.playing ? '暂停' : isThisPlaying ? '继续' : '开始轮播'),
              isThisPlaying ? h(Button, { icon: IconPrev, onClick: () => studio.prevPlaylist() }, '上一个') : null,
              isThisPlaying ? h(Button, { icon: IconNext, onClick: () => studio.nextPlaylist() }, '下一个') : null,
              isThisPlaying ? h(Button, { icon: IconMute, onClick: () => studio.stopPlaylist() }, '停止') : null,
            ),
            h('div', { className: 'dbs-playback-now' },
              isThisPlaying && currentAsset
                ? h(React.Fragment, null,
                    h('span', { className: 'dbs-muted' }, `正在播放 ${studio.playlist?.index + 1}/${studio.playlist?.queue.length}`),
                    h('strong', null, currentAsset.name),
                    currentItem ? h('span', { className: 'dbs-muted' }, currentItem.dwellMode === 'mediaEnd' ? '完整播放后切换' : `停留 ${currentItem.dwellMode === 'fixed' ? currentItem.dwellSeconds : '默认'} 秒`) : null,
                  )
                : h('span', { className: 'dbs-muted' }, '尚未开始这套方案'),
              progress ? h('div', { className: 'dbs-progress' }, h('span', { style: { width: `${Math.round(progress.ratio * 100)}%` } })) : null,
            ),
          ),
          h('div', { className: 'dbs-items' },
            playlist.items.length === 0
              ? h('div', { className: 'dbs-items-empty' }, '还没有条目。点击「添加素材」从背景库挑选。')
              : playlist.items.map((item, index) => {
                  const asset = studio.assetById(item.assetId)
                  const active = isThisPlaying && currentItem?.id === item.id
                  return h('div', {
                    key: item.id,
                    className: cx('dbs-item', active && 'is-current', !asset && 'is-missing'),
                    draggable: true,
                    onDragStart: (event) => {
                      event.dataTransfer?.setData('text/dbs-item', item.id)
                      event.dataTransfer.effectAllowed = 'move'
                    },
                    onDragOver: (event) => {
                      event.preventDefault()
                      if (event.dataTransfer) event.dataTransfer.dropEffect = 'move'
                    },
                    onDrop: (event) => {
                      event.preventDefault()
                      const dragged = event.dataTransfer?.getData('text/dbs-item')
                      if (dragged) studio.movePlaylistItem(playlist.id, dragged, index)
                    },
                  },
                    h('span', { className: 'dbs-item-index' }, String(index + 1).padStart(2, '0')),
                    asset ? h(AssetThumb, { asset, className: 'dbs-thumb-item' }) : h('div', { className: 'dbs-thumb dbs-thumb-item' }),
                    h('div', { className: 'dbs-item-main' },
                      h('div', { className: 'dbs-item-name' }, asset ? asset.name : '素材已移除', active ? h(Chip, { tone: 'accent' }, '当前') : null),
                      h('div', { className: 'dbs-item-meta' }, asset ? kindText(asset.kind) : '缺失', asset?.duration > 0 ? formatDuration(asset.duration) : ''),
                    ),
                    h('div', { className: 'dbs-item-dwell' },
                      h(Select, {
                        value: item.dwellMode,
                        onChange: (value) => studio.updatePlaylistItem(playlist.id, item.id, { dwellMode: value }),
                        options: [
                          { value: 'default', label: '默认' },
                          { value: 'fixed', label: '固定秒数' },
                          { value: 'mediaEnd', label: '视频播完' },
                        ],
                      }),
                      item.dwellMode === 'fixed'
                        ? h('input', {
                            className: 'dbs-input dbs-input-sm',
                            type: 'number',
                            min: 1,
                            value: item.dwellSeconds,
                            onChange: (event) => studio.updatePlaylistItem(playlist.id, item.id, { dwellSeconds: clamp(Number(event.target.value) || 1, 1, 86400) }),
                          })
                        : null,
                    ),
                    h('div', { className: 'dbs-item-actions' },
                      h(IconButton, { icon: IconUp, label: '上移', onClick: () => studio.movePlaylistItem(playlist.id, item.id, Math.max(0, index - 1)) }),
                      h(IconButton, { icon: IconDown, label: '下移', onClick: () => studio.movePlaylistItem(playlist.id, item.id, index + 1) }),
                      h(IconButton, { icon: IconTrash, label: '从列表移除', onClick: () => studio.removePlaylistItem(playlist.id, item.id) }),
                    ),
                  )
                }),
          ),
        )
      : h('div', { className: 'dbs-playlist-empty' }, '选择或新建一个轮播方案。'),
    picker && playlist ? h(AddAssetsModal, {
      studio,
      onClose: () => setPicker(false),
      onAdd: (ids) => studio.addPlaylistItems(playlist.id, ids),
    }) : null,
  )
}
