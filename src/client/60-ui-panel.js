/* =========================================================================
 * 60-ui — panel shell, library, asset cards and inspector.
 * ========================================================================= */

function Button({ children, icon, variant = '', size = '', className = '', ...rest }) {
  return h('button', {
    type: 'button',
    ...rest,
    className: cx('dbs-btn', variant && `dbs-btn-${variant}`, size && `dbs-btn-${size}`, className),
  }, icon ? h(icon, { key: 'icon' }) : null, children ? h('span', { key: 'label' }, children) : null)
}

function IconButton({ icon, label, className = '', ...rest }) {
  return h('button', {
    type: 'button',
    title: label,
    'aria-label': label,
    ...rest,
    className: cx('dbs-icon-btn', className),
  }, h(icon))
}

function Chip({ children, tone = '' }) {
  return h('span', { className: cx('dbs-chip', tone && `dbs-chip-${tone}`) }, children)
}

function Field({ label, hint, children, wide = false }) {
  return h('label', { className: cx('dbs-field', wide && 'dbs-field-wide') },
    h('span', { className: 'dbs-field-label' }, label),
    children,
    hint ? h('span', { className: 'dbs-field-hint' }, hint) : null,
  )
}

function Range({ value, min = 0, max = 1, step = 0.01, onChange, format, disabled = false }) {
  return h('div', { className: 'dbs-range' },
    h('input', {
      type: 'range',
      min,
      max,
      step,
      value,
      disabled,
      onChange: (event) => onChange(Number(event.target.value)),
    }),
    h('span', { className: 'dbs-range-value' }, format ? format(value) : String(value)),
  )
}

function Toggle({ checked, onChange, label, disabled = false }) {
  return h('button', {
    type: 'button',
    role: 'switch',
    'aria-checked': checked ? 'true' : 'false',
    disabled,
    className: cx('dbs-toggle', checked && 'is-on'),
    onClick: () => onChange(!checked),
  }, h('span', { className: 'dbs-toggle-knob' }), label ? h('span', { className: 'dbs-toggle-text' }, label) : null)
}

function Select({ value, onChange, options, disabled = false, className = '' }) {
  return h('select', {
    className: cx('dbs-select', className),
    value,
    disabled,
    onChange: (event) => onChange(event.target.value),
  }, options.map((option) => h('option', { key: String(option.value), value: option.value }, option.label)))
}

function Segmented({ value, onChange, options }) {
  return h('div', { className: 'dbs-segmented' }, options.map((option) => h('button', {
    key: option.value,
    type: 'button',
    className: cx('dbs-segmented-item', value === option.value && 'is-on'),
    onClick: () => onChange(option.value),
  }, option.label)))
}

function LoadingBlock({ text = '正在加载…' }) {
  return h('div', { className: 'dbs-loading' }, h('span', { className: 'dbs-spinner' }), h('span', null, text))
}

function EmptyState({ icon: Icon = IconBackground, title, text, action }) {
  return h('div', { className: 'dbs-empty' },
    h('div', { className: 'dbs-empty-icon' }, h(Icon)),
    h('div', { className: 'dbs-empty-title' }, title),
    text ? h('div', { className: 'dbs-empty-text' }, text) : null,
    action ? h('div', { className: 'dbs-empty-action' }, action) : null,
  )
}

function AssetThumb({ asset, className = '' }) {
  const [failed, setFailed] = React.useState(false)
  React.useEffect(() => setFailed(false), [asset?.id, asset?.thumbVersion])
  const source = !failed ? thumbUrl(asset) : null
  return h('div', { className: cx('dbs-thumb', className) },
    source ? h('img', { src: source, alt: '', loading: 'lazy', onError: () => setFailed(true) }) : null,
    !source ? h('div', { className: 'dbs-thumb-fallback' }, h(asset?.kind === 'video' ? IconFilm : IconImage)) : null,
    asset?.missing ? h('div', { className: 'dbs-thumb-missing' }, '文件丢失') : null,
  )
}

function currentAssetIdOf(studio) {
  return studio?.state?.runtime?.assetId ?? null
}

function pathForFile(file) {
  try {
    const value = window.__DSH_HOST_PATHS__?.pathFor?.(file)
    return typeof value === 'string' ? value : ''
  } catch {
    return ''
  }
}

function pickFiles({ accept, multiple = true, onPaths }) {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = accept
  input.multiple = multiple
  input.style.display = 'none'
  input.addEventListener('change', () => {
    const files = Array.from(input.files ?? [])
    const paths = files.map(pathForFile).filter(Boolean)
    if (paths.length === 0) {
      window.alert('无法读取文件路径。请确认正在使用 Windows 桌面版 DSH。')
    } else {
      onPaths(paths)
    }
    input.remove()
  }, { once: true })
  document.body.appendChild(input)
  input.click()
  window.setTimeout(() => input.remove(), 120000)
}

const MEDIA_ACCEPT = '.png,.jpg,.jpeg,.webp,.avif,.gif,.mp4,.webm,.mov,image/*,video/*'
const AUDIO_ACCEPT = '.mp3,.wav,.ogg,.flac,.m4a,.aac,audio/*'

function useDropPaths(onPaths) {
  const [dragging, setDragging] = React.useState(false)
  const handlers = {
    onDragEnter: (event) => {
      event.preventDefault()
      setDragging(true)
    },
    onDragOver: (event) => {
      event.preventDefault()
      if (event.dataTransfer) event.dataTransfer.dropEffect = 'copy'
    },
    onDragLeave: (event) => {
      if (event.currentTarget === event.target) setDragging(false)
    },
    onDrop: (event) => {
      event.preventDefault()
      setDragging(false)
      const files = Array.from(event.dataTransfer?.files ?? [])
      const paths = files.map(pathForFile).filter(Boolean)
      if (paths.length === 0) {
        window.alert('拖拽的文件没有可读取的本地路径。请使用「添加背景」按钮，或确认正在桌面版 DSH 中操作。')
        return
      }
      onPaths(paths)
    },
  }
  return { dragging, handlers }
}

function AssetCard({ studio, asset, selected, onSelect, checked, onToggleCheck }) {
  const settings = studio.settingsFor(asset.id)
  const current = currentAssetIdOf(studio) === asset.id
  return h('div', {
    className: cx('dbs-card', selected && 'is-selected', current && 'is-current', asset.missing && 'is-missing'),
    role: 'button',
    tabIndex: 0,
    onClick: () => onSelect(asset.id),
    onDoubleClick: () => studio.applyAsset(asset.id),
    onKeyDown: (event) => {
      if (event.key === 'Enter') studio.applyAsset(asset.id)
      if (event.key === ' ') {
        event.preventDefault()
        onSelect(asset.id)
      }
    },
  },
    h('div', { className: 'dbs-card-media' },
      h(AssetThumb, { asset }),
      h('div', { className: 'dbs-card-top' },
        h('label', { className: 'dbs-check', onClick: (event) => event.stopPropagation() },
          h('input', {
            type: 'checkbox',
            checked,
            onChange: () => onToggleCheck(asset.id),
          }),
        ),
        h('button', {
          type: 'button',
          className: cx('dbs-card-star', asset.favorite && 'is-on'),
          title: asset.favorite ? '取消收藏' : '收藏',
          onClick: (event) => {
            event.stopPropagation()
            studio.toggleFavorite(asset.id)
          },
        }, h(IconStar, { filled: asset.favorite })),
      ),
      h('div', { className: 'dbs-card-badges' },
        current ? h(Chip, { tone: 'accent' }, '使用中') : null,
        asset.missing ? h(Chip, { tone: 'danger' }, '丢失') : null,
        settings.audioId ? h(Chip, { tone: 'muted' }, '音频') : null,
      ),
      asset.kind === 'video' && asset.duration > 0
        ? h('span', { className: 'dbs-card-duration' }, formatDuration(asset.duration))
        : null,
    ),
    h('div', { className: 'dbs-card-body' },
      h('div', { className: 'dbs-card-name', title: asset.name }, asset.name),
      h('div', { className: 'dbs-card-meta' },
        h('span', null, kindText(asset.kind)),
        asset.width > 0 ? h('span', null, `${asset.width}×${asset.height}`) : null,
        h('span', null, formatBytes(asset.size)),
      ),
    ),
    h('div', { className: 'dbs-card-actions' },
      h(Button, {
        size: 'sm',
        variant: current ? 'ghost' : 'primary',
        onClick: (event) => {
          event.stopPropagation()
          studio.applyAsset(asset.id)
        },
        disabled: asset.missing,
      }, current ? '已应用' : '应用'),
      h(IconButton, {
        icon: IconSettings,
        label: '编辑',
        onClick: (event) => {
          event.stopPropagation()
          onSelect(asset.id)
        },
      }),
    ),
  )
}

function LibraryToolbar({ studio, search, setSearch, type, setType, sort, setSort, view, setView, onImport, onImportAudio, tab }) {
  return h('div', { className: 'dbs-toolbar' },
    h('div', { className: 'dbs-search' },
      h(IconSearch),
      h('input', {
        value: search,
        placeholder: '搜索名称或路径…',
        onChange: (event) => setSearch(event.target.value),
      }),
      search ? h(IconButton, { icon: IconClose, label: '清空搜索', onClick: () => setSearch('') }) : null,
    ),
    h('div', { className: 'dbs-toolbar-group' },
      h(Select, {
        value: type,
        onChange: setType,
        options: [
          { value: 'all', label: '全部类型' },
          { value: 'image', label: '图片' },
          { value: 'gif', label: 'GIF 动图' },
          { value: 'video', label: '视频' },
        ],
      }),
      h(Select, {
        value: sort,
        onChange: setSort,
        options: [
          { value: 'recent', label: '最近使用' },
          { value: 'imported', label: '最近导入' },
          { value: 'name', label: '名称' },
          { value: 'size', label: '文件大小' },
        ],
      }),
      h('div', { className: 'dbs-view-toggle' },
        h(IconButton, { icon: IconGrid, label: '网格视图', className: view === 'grid' ? 'is-on' : '', onClick: () => setView('grid') }),
        h(IconButton, { icon: IconList, label: '列表视图', className: view === 'list' ? 'is-on' : '', onClick: () => setView('list') }),
      ),
      h(Button, { variant: 'primary', icon: IconPlus, onClick: onImport }, tab === 'audio' ? '添加音频' : '添加背景'),
      tab === 'audio' ? null : h(Button, { icon: IconMusic, onClick: onImportAudio, title: '导入独立音频' }, '音频'),
    ),
  )
}

function LibraryView({ studio, tab, selectedId, onSelect }) {
  const [search, setSearch] = React.useState('')
  const [type, setType] = React.useState('all')
  const [sort, setSort] = React.useState('recent')
  const [checked, setChecked] = React.useState(() => new Set())
  const [importMode, setImportMode] = React.useState(studio.state.global.importMode)
  const view = studio.state.global.libraryView
  const drop = useDropPaths((paths) => studio.importFiles(paths, 'media'))

  const importMedia = () => pickFiles({ accept: MEDIA_ACCEPT, multiple: true, onPaths: (paths) => studio.importFiles(paths, 'media') })
  const importAudio = () => pickFiles({ accept: AUDIO_ACCEPT, multiple: true, onPaths: (paths) => studio.importFiles(paths, 'audio') })

  React.useEffect(() => {
    const next = new Set(Array.from(checked).filter((id) => studio.assetById(id)))
    if (next.size !== checked.size) setChecked(next)
  }, [studio.state.assets.length])

  const assets = studio.state.assets
    .filter((asset) => {
      if (tab === 'favorites' && !asset.favorite) return false
      if (tab === 'recent' && !asset.lastUsedAt) return false
      if (type !== 'all' && asset.kind !== type) return false
      if (search.trim().length > 0) {
        const query = search.trim().toLowerCase()
        if (!asset.name.toLowerCase().includes(query) && !String(asset.path).toLowerCase().includes(query)) return false
      }
      return true
    })
    .sort((left, right) => {
      if (sort === 'name') return left.name.localeCompare(right.name, 'zh-CN')
      if (sort === 'size') return right.size - left.size
      if (sort === 'imported') return String(right.importedAt).localeCompare(String(left.importedAt))
      return String(right.lastUsedAt || '').localeCompare(String(left.lastUsedAt || '')) || String(right.importedAt).localeCompare(String(left.importedAt))
    })

  const toggleCheck = (id) => {
    const next = new Set(checked)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setChecked(next)
  }

  const removeChecked = () => {
    if (checked.size === 0) return
    if (!window.confirm(`从背景库移除 ${checked.size} 个记录？不会删除磁盘上的原始文件。`)) return
    for (const id of checked) studio.removeAsset(id)
    setChecked(new Set())
  }

  const setView = (next) => studio.updateGlobal({ libraryView: next })
  const setMode = (next) => {
    setImportMode(next)
    studio.updateGlobal({ importMode: next })
  }

  return h('div', { className: cx('dbs-library', drop.dragging && 'is-dragging'), ...drop.handlers },
    h('div', { className: 'dbs-import-row' },
      h('div', { className: 'dbs-import-label' }, '导入方式'),
      h(Segmented, {
        value: importMode,
        onChange: setMode,
        options: [
          { value: 'reference', label: '引用原文件' },
          { value: 'copy', label: '复制到插件目录' },
        ],
      }),
      h('span', { className: 'dbs-import-hint' }, importMode === 'copy' ? '原文件移动后不影响副本' : '不复制文件，原文件移动后会提示丢失'),
      studio.importing ? h('span', { className: 'dbs-import-status' }, studio.importProgress
        ? `${studio.importText} ${studio.importProgress.total > 0 ? `${Math.round((studio.importProgress.copied / studio.importProgress.total) * 100)}%` : ''}`
        : studio.importText) : null,
    ),
    h(LibraryToolbar, {
      studio, search, setSearch, type, setType, sort, setSort, view, onImport: importMedia, onImportAudio: importAudio, tab,
    }),
    checked.size > 0 ? h('div', { className: 'dbs-batch' },
      h('span', null, `已选择 ${checked.size} 个`),
      h(Button, { size: 'sm', variant: 'danger', icon: IconTrash, onClick: removeChecked }, '批量移除记录'),
      h(Button, { size: 'sm', variant: 'ghost', onClick: () => setChecked(new Set()) }, '取消选择'),
    ) : null,
    assets.length === 0
      ? h(EmptyState, {
          icon: tab === 'favorites' ? IconStar : tab === 'recent' ? IconRefresh : IconBackground,
          title: tab === 'favorites' ? '还没有收藏' : tab === 'recent' ? '还没有使用记录' : '背景库是空的',
          text: tab === 'library'
            ? '添加本机的图片、GIF 或视频。也可以直接把文件拖到这里。'
            : '先去背景库应用或收藏一些素材。',
          action: tab === 'library' ? h(Button, { variant: 'primary', icon: IconPlus, onClick: importMedia }, '添加第一张背景') : null,
        })
      : view === 'grid'
        ? h('div', { className: 'dbs-grid' }, assets.map((asset) => h(AssetCard, {
            key: asset.id,
            studio,
            asset,
            selected: selectedId === asset.id,
            onSelect,
            checked: checked.has(asset.id),
            onToggleCheck: toggleCheck,
          })))
        : h('div', { className: 'dbs-list' }, assets.map((asset) => h(AssetRow, {
            key: asset.id,
            studio,
            asset,
            selected: selectedId === asset.id,
            onSelect,
            checked: checked.has(asset.id),
            onToggleCheck: toggleCheck,
          }))),
  )
}

function AssetRow({ studio, asset, selected, onSelect, checked, onToggleCheck }) {
  const current = currentAssetIdOf(studio) === asset.id
  return h('div', {
    className: cx('dbs-row', selected && 'is-selected', current && 'is-current'),
    role: 'button',
    tabIndex: 0,
    onClick: () => onSelect(asset.id),
    onDoubleClick: () => studio.applyAsset(asset.id),
    onKeyDown: (event) => {
      if (event.key === 'Enter') studio.applyAsset(asset.id)
    },
  },
    h('label', { className: 'dbs-check', onClick: (event) => event.stopPropagation() },
      h('input', { type: 'checkbox', checked, onChange: () => onToggleCheck(asset.id) })),
    h(AssetThumb, { asset, className: 'dbs-thumb-row' }),
    h('div', { className: 'dbs-row-main' },
      h('div', { className: 'dbs-row-name' }, asset.name, current ? h(Chip, { tone: 'accent' }, '使用中') : null, asset.missing ? h(Chip, { tone: 'danger' }, '丢失') : null),
      h('div', { className: 'dbs-row-meta' }, kindText(asset.kind), asset.width > 0 ? `${asset.width}×${asset.height}` : '—', formatBytes(asset.size), asset.fps > 0 ? `${asset.fps} FPS` : ''),
    ),
    h('div', { className: 'dbs-row-actions' },
      h(IconButton, { icon: IconStar, label: '收藏', className: asset.favorite ? 'is-on' : '', onClick: (event) => {
        event.stopPropagation()
        studio.toggleFavorite(asset.id)
      } }),
      h(Button, { size: 'sm', variant: current ? 'ghost' : 'primary', onClick: (event) => {
        event.stopPropagation()
        studio.applyAsset(asset.id)
      }, disabled: asset.missing }, current ? '已应用' : '应用'),
    ),
  )
}

function Inspector({ studio, asset, onClose }) {
  useTick(300)
  if (!asset) {
    return h('aside', { className: 'dbs-inspector' },
      h('div', { className: 'dbs-inspector-head' },
        h('div', { className: 'dbs-inspector-title' }, '素材设置'),
        onClose ? h(IconButton, { icon: IconClose, label: '关闭', className: 'dbs-inspector-close', onClick: onClose }) : null,
      ),
      h('div', { className: 'dbs-inspector-empty' }, '选择一个素材后，这里会显示它的透明度、音频、画质和停留时间。'),
    )
  }
  const settings = studio.settingsFor(asset.id)
  const update = (patch) => studio.updateAssetSettings(asset.id, patch)
  const current = currentAssetIdOf(studio) === asset.id
  const audioModeOptions = asset.kind === 'video'
    ? [
        { value: 'video', label: '视频原声' },
        { value: 'external', label: '外部音频' },
        { value: 'mix', label: '混合（原声 + 外部）' },
        { value: 'mute', label: '全部静音' },
      ]
    : [
        { value: 'external', label: '外部音频' },
        { value: 'mute', label: '静音' },
      ]
  if (!audioModeOptions.some((option) => option.value === settings.audioMode)) {
    settings.audioMode = asset.kind === 'video' ? 'video' : 'mute'
  }
  const wantsExternal = settings.audioMode === 'external' || settings.audioMode === 'mix'
  const wantsVideo = settings.audioMode === 'video' || settings.audioMode === 'mix'

  return h('aside', { className: 'dbs-inspector' },
    h('div', { className: 'dbs-inspector-head' },
      h('div', { className: 'dbs-inspector-title' }, '素材设置'),
      onClose ? h(IconButton, { icon: IconClose, label: '关闭', className: 'dbs-inspector-close', onClick: onClose }) : null,
    ),
    h('div', { className: 'dbs-inspector-scroll' },
      h('div', { className: 'dbs-inspector-hero' },
        h(AssetThumb, { asset }),
        h('div', { className: 'dbs-inspector-hero-body' },
          h('input', {
            className: 'dbs-rename',
            defaultValue: asset.name,
            key: `${asset.id}-${asset.name}`,
            onBlur: (event) => studio.renameAsset(asset.id, event.target.value),
            onKeyDown: (event) => {
              if (event.key === 'Enter') event.currentTarget.blur()
            },
            'aria-label': '素材名称',
          }),
          h('div', { className: 'dbs-inspector-sub' }, kindText(asset.kind), asset.width > 0 ? `${asset.width}×${asset.height}` : '', asset.duration > 0 ? formatDuration(asset.duration) : ''),
          h('div', { className: 'dbs-inspector-actions' },
            h(Button, { variant: current ? 'ghost' : 'primary', size: 'sm', onClick: () => studio.applyAsset(asset.id), disabled: asset.missing }, current ? '正在使用' : '应用背景'),
            h(IconButton, { icon: IconStar, label: '收藏', className: asset.favorite ? 'is-on' : '', onClick: () => studio.toggleFavorite(asset.id) }),
          ),
        ),
      ),
      asset.missing ? h('div', { className: 'dbs-alert is-danger' },
        h(IconWarning),
        h('span', null, '文件已丢失或不可读。'),
        h(Button, { size: 'sm', variant: 'ghost', onClick: () => pickFiles({
          accept: asset.kind === 'video' ? '.mp4,.webm,.mov,video/*' : '.png,.jpg,.jpeg,.webp,.avif,.gif,image/*',
          multiple: false,
          onPaths: (paths) => studio.relocate(asset.id, paths[0]),
        }) }, '重新定位'),
      ) : null,
      asset.probeError ? h('div', { className: 'dbs-alert is-warning' }, h(IconWarning), h('span', null, `读取信息失败：${asset.probeError}`)) : null,

      h('div', { className: 'dbs-section' },
        h('div', { className: 'dbs-section-title' }, '显示'),
        h(Field, { label: '背景透明度', hint: '0% 显示 DSH 默认背景；100% 显示完整素材。' },
          h(Range, {
            value: Math.round(settings.opacity * 100),
            min: 0,
            max: 100,
            step: 1,
            onChange: (value) => update({ opacity: value / 100 }),
            format: (value) => `${Math.round(value)}%`,
          }),
        ),
        h(Field, { label: '显示方式' },
          h(Select, {
            value: settings.display,
            onChange: (value) => update({ display: value }),
            options: [
              { value: 'cover', label: '铺满屏幕（裁切）' },
              { value: 'contain', label: '等比例适应' },
              { value: 'center', label: '居中（原始尺寸）' },
              { value: 'original', label: '原始尺寸' },
              { value: 'custom', label: '自定义缩放' },
            ],
          }),
        ),
        settings.display === 'custom' ? h(Field, { label: `缩放 ${Math.round(settings.scale * 100)}%` },
          h(Range, { value: settings.scale, min: 0.1, max: 4, step: 0.05, onChange: (value) => update({ scale: value }), format: (value) => `${Math.round(value * 100)}%` }),
        ) : null,
        isAnimatedAsset(asset) ? h('div', { className: 'dbs-rowline' },
          h('span', null, '循环播放'),
          h(Toggle, { checked: settings.loop, onChange: (value) => update({ loop: value }) }),
        ) : null,
        h('div', { className: 'dbs-note' }, 'P0 使用浏览器原生渲染；渲染分辨率与帧率上限属于后续 Canvas 模式，不会用假滑块代替。'),
      ),

      h('div', { className: 'dbs-section' },
        h('div', { className: 'dbs-section-title' }, '音频'),
        h(Field, { label: '音频来源', hint: asset.kind === 'video' ? '默认播放视频原声。绑定外部音频后必须手动选择播放模式。' : '图片 / GIF 没有原生音轨，绑定后使用外部音频。' },
          h(Select, { value: settings.audioMode, onChange: (value) => update({ audioMode: value }), options: audioModeOptions }),
        ),
        wantsExternal ? h(Field, { label: '关联音频', hint: '同一时刻只播放一个；可以添加多段并切换。视频绑定外部音频后需手动选择播放模式。' },
          h(Select, {
            value: '',
            onChange: (value) => {
              if (value) studio.bindAudio(asset.id, value)
            },
            options: [{ value: '', label: '添加音频…' }].concat(
              studio.state.audio.map((track) => ({ value: track.id, label: track.missing ? `${track.name}（丢失）` : track.name })),
            ),
          }),
          h('div', { className: 'dbs-audio-queue' },
            (settings.audioIds ?? []).length === 0
              ? h('div', { className: 'dbs-muted' }, '还没有关联音频')
              : (settings.audioIds ?? []).map((audioId, index) => {
                  const track = studio.audioById(audioId)
                  return h('div', { key: audioId, className: cx('dbs-audio-chip', index === settings.audioIndex && 'is-active') },
                    h('button', {
                      type: 'button',
                      className: 'dbs-audio-chip-main',
                      onClick: () => studio.setBoundAudio(asset.id, index),
                      title: '设为当前音频',
                    },
                      h('span', { className: 'dbs-audio-dot' }),
                      h('span', { className: 'dbs-audio-chip-name' }, track ? track.name : '音频记录已删除'),
                      track?.missing ? h(Chip, { tone: 'danger' }, '丢失') : null,
                    ),
                    h(IconButton, {
                      icon: studio.audioPreviewId === audioId ? IconPause : IconPlay,
                      label: '试听',
                      onClick: () => studio.togglePreviewAudio(audioId),
                      disabled: !track || track.missing,
                    }),
                    h(IconButton, {
                      icon: IconClose,
                      label: '解除关联',
                      onClick: () => studio.unbindAudio(asset.id, audioId),
                    }),
                  )
                }),
          ),
        ) : asset.kind !== 'video' ? h(Field, { label: '关联音频', hint: '选择音频会自动切换到「外部音频」模式。' },
          h(Select, {
            value: '',
            onChange: (value) => {
              if (value) studio.bindAudio(asset.id, value)
            },
            options: [{ value: '', label: '添加音频…' }].concat(
              studio.state.audio.map((track) => ({ value: track.id, label: track.missing ? `${track.name}（丢失）` : track.name })),
            ),
          }),
          h('div', { className: 'dbs-audio-queue' },
            (settings.audioIds ?? []).length === 0
              ? h('div', { className: 'dbs-muted' }, '还没有关联音频')
              : (settings.audioIds ?? []).map((audioId, index) => {
                  const track = studio.audioById(audioId)
                  return h('div', { key: audioId, className: cx('dbs-audio-chip', index === settings.audioIndex && 'is-active') },
                    h('button', {
                      type: 'button',
                      className: 'dbs-audio-chip-main',
                      onClick: () => studio.setBoundAudio(asset.id, index),
                      title: '设为当前音频',
                    },
                      h('span', { className: 'dbs-audio-dot' }),
                      h('span', { className: 'dbs-audio-chip-name' }, track ? track.name : '音频记录已删除'),
                      track?.missing ? h(Chip, { tone: 'danger' }, '丢失') : null,
                    ),
                    h(IconButton, {
                      icon: studio.audioPreviewId === audioId ? IconPause : IconPlay,
                      label: '试听',
                      onClick: () => studio.togglePreviewAudio(audioId),
                      disabled: !track || track.missing,
                    }),
                    h(IconButton, {
                      icon: IconClose,
                      label: '解除关联',
                      onClick: () => studio.unbindAudio(asset.id, audioId),
                    }),
                  )
                }),
          ),
        ) : null,
        (studio.audioPreviewId && (settings.audioIds ?? []).includes(studio.audioPreviewId) && studio.audio?.preview?.el)
          ? h('div', { className: 'dbs-preview-bar' },
              h('span', null, '试听'),
              h('span', { className: 'dbs-muted' },
                `${formatClock(studio.audio.preview.el.currentTime)} / ${formatDuration(studio.audio.preview.el.duration)}`),
              h('div', { className: 'dbs-progress' },
                h('span', {
                  style: {
                    width: `${Math.min(100, Math.round((studio.audio.preview.el.currentTime / Math.max(0.1, studio.audio.preview.el.duration)) * 100))}%`,
                  },
                }),
              ),
            )
          : null,
        wantsExternal ? h(Field, { label: `外部音频音量 ${Math.round(settings.audioVolume * 100)}%` },
          h(Range, { value: settings.audioVolume, min: 0, max: 1, step: 0.01, onChange: (value) => update({ audioVolume: value }), format: (value) => `${Math.round(value * 100)}%` }),
        ) : null,
        wantsVideo ? h(Field, { label: `视频原声音量 ${Math.round(settings.videoVolume * 100)}%`, hint: asset.hasAudio === false ? '这个视频没有检测到音轨。' : undefined },
          h(Range, { value: settings.videoVolume, min: 0, max: 1, step: 0.01, onChange: (value) => update({ videoVolume: value }), format: (value) => `${Math.round(value * 100)}%` }),
        ) : null,
        wantsExternal ? h('div', { className: 'dbs-rowline' },
          h('span', null, '外部音频循环'),
          h(Toggle, { checked: settings.audioLoop, onChange: (value) => update({ audioLoop: value }) }),
        ) : null,
        wantsExternal ? h(Field, { label: '起始位置（秒）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 0,
            step: 0.1,
            value: Math.round(settings.audioStartMs / 100) / 10,
            onChange: (event) => update({ audioStartMs: Math.max(0, Number(event.target.value) || 0) * 1000 }),
          }),
        ) : null,
        h(Field, { label: '淡入淡出（毫秒）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 0,
            max: 5000,
            step: 50,
            value: settings.fadeMs,
            onChange: (event) => update({ fadeMs: clamp(Number(event.target.value) || 0, 0, 5000) }),
          }),
        ),
        wantsExternal ? h(Field, { label: '音频结束后', hint: '「下一段关联音频」需要先关闭外部音频循环。' },
          h(Select, {
            value: settings.audioEndAction,
            onChange: (value) => update({ audioEndAction: value }),
            options: [
              { value: 'none', label: '保持当前背景' },
              { value: 'next', label: '切换下一背景' },
              ...((settings.audioIds ?? []).length > 1 ? [{ value: 'nextTrack', label: '播放下一段关联音频' }] : []),
            ],
          }),
        ) : null,
        h('div', { className: 'dbs-rowline' },
          h('span', null, '全局静音'),
          h(Toggle, { checked: studio.state.global.audio.muted, onChange: (value) => studio.updateGlobal({ audio: { muted: value } }) }),
        ),
      ),

      h('div', { className: 'dbs-section' },
        h('div', { className: 'dbs-section-title' }, '轮播'),
        h(Field, { label: '默认停留方式', hint: '视频默认「完整播放后切换」；图片 / GIF 默认使用全局停留时间。' },
          h(Select, {
            value: settings.dwellMode,
            onChange: (value) => update({ dwellMode: value }),
            options: [
              { value: 'default', label: '跟随默认规则' },
              { value: 'fixed', label: '固定停留时间' },
              { value: 'mediaEnd', label: '视频完整播放后切换' },
            ],
          }),
        ),
        settings.dwellMode === 'fixed' ? h(Field, { label: '停留时间（秒）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 1,
            step: 1,
            value: settings.dwellSeconds,
            onChange: (event) => update({ dwellSeconds: clamp(Number(event.target.value) || 1, 1, 86400) }),
          }),
        ) : null,
      ),

      h('div', { className: 'dbs-section' },
        h('div', { className: 'dbs-section-title' }, '文件信息'),
        h('dl', { className: 'dbs-meta' },
          h('dt', null, '路径'), h('dd', { title: asset.path }, asset.path),
          h('dt', null, '存储'), h('dd', null, asset.storage === 'copy' ? '插件目录副本' : '引用原文件'),
          h('dt', null, '大小'), h('dd', null, formatBytes(asset.size)),
          h('dt', null, '分辨率'), h('dd', null, asset.width > 0 ? `${asset.width}×${asset.height}` : '未知'),
          h('dt', null, '时长'), h('dd', null, asset.duration > 0 ? formatDuration(asset.duration) : '—'),
          h('dt', null, '源帧率'), h('dd', null, asset.fps > 0 ? `≈ ${asset.fps} FPS` : '未知'),
          h('dt', null, '原生音轨'), h('dd', null, asset.hasAudio === true ? '有' : asset.hasAudio === false ? '无' : '未确认'),
          h('dt', null, '导入时间'), h('dd', null, asset.importedAt ? new Date(asset.importedAt).toLocaleString() : '—'),
        ),
      ),

      h('div', { className: 'dbs-inspector-footer' },
        h(Button, { size: 'sm', icon: IconRefresh, onClick: () => studio.resetAssetSettings(asset.id) }, '恢复默认'),
        h(Button, { size: 'sm', icon: IconFolder, onClick: () => pickFiles({
          accept: asset.kind === 'video' ? '.mp4,.webm,.mov,video/*' : '.png,.jpg,.jpeg,.webp,.avif,.gif,image/*',
          multiple: false,
          onPaths: (paths) => studio.relocate(asset.id, paths[0]),
        }) }, '重新定位'),
        h(Button, { size: 'sm', variant: 'danger', icon: IconTrash, onClick: () => {
          if (window.confirm(`移除「${asset.name}」的记录？不会删除磁盘上的原始文件。`)) studio.removeAsset(asset.id)
        } }, '移除记录'),
      ),
    ),
  )
}

function Panel() {
  const studio = useStudio()
  const [tab, setTab] = React.useState('library')
  const [selectedId, setSelectedId] = React.useState(null)
  const [inspectorOpen, setInspectorOpen] = React.useState(false)

  React.useEffect(() => {
    if (selectedId && !studio?.assetById(selectedId)) setSelectedId(null)
  }, [studio?.state.assets.length, selectedId])

  React.useEffect(() => {
    if (!selectedId && studio?.ready) {
      const current = studio.currentAsset()
      if (current) setSelectedId(current.id)
    }
  }, [studio?.state.runtime.assetId, studio?.state.runtime.playlistId, studio?.state.assets.length, selectedId])

  React.useEffect(() => {
    if (!studio) return
    if (studio.lastImportedId) {
      setSelectedId(studio.lastImportedId)
      setInspectorOpen(true)
    }
  }, [studio?.lastImportedId])

  if (!studio) return h('div', { className: 'dbs-panel' }, h(LoadingBlock, { text: '正在启动背景工作室…' }))
  if (!studio.ready) return h('div', { className: 'dbs-panel' }, h(LoadingBlock, { text: '正在加载背景库…' }))

  const selected = selectedId ? studio.assetById(selectedId) : null
  const current = studio.currentAsset()
  const showInspector = tab === 'library' || tab === 'recent' || tab === 'favorites'
  const pick = (id) => {
    setSelectedId(id)
    setInspectorOpen(true)
    studio.ensureAssetDetails(id)
  }

  const tabs = [
    { id: 'library', label: '背景库', icon: IconBackground },
    { id: 'recent', label: '最近使用', icon: IconRefresh },
    { id: 'favorites', label: '收藏夹', icon: IconStar },
    { id: 'playlists', label: '轮播方案', icon: IconPlay },
    { id: 'startup', label: '启动动画', icon: IconFilm },
    { id: 'audio', label: '音频管理', icon: IconMusic },
    { id: 'settings', label: '设置', icon: IconSettings },
  ]

  return h('div', {
    className: cx('dbs-panel', inspectorOpen && showInspector && 'is-inspector-open'),
    'data-tab': tab,
  },
    h('header', { className: 'dbs-header' },
      h('div', { className: 'dbs-brand' },
        h('div', { className: 'dbs-brand-icon' }, h(IconBackground)),
        h('div', null,
          h('div', { className: 'dbs-brand-title' }, PANEL_TITLE),
          h('div', { className: 'dbs-brand-sub' }, '图片 · 视频 · GIF · 独立音频 · 自动轮播'),
        ),
      ),
      h('div', { className: 'dbs-header-status' },
        current
          ? h('span', { className: 'dbs-now' }, h('span', { className: 'dbs-now-dot' }), current.name)
          : h('span', { className: 'dbs-now is-idle' }, '未启用背景'),
        h('span', { className: 'dbs-mode-chip' }, studio.state.runtime.mode === 'playlist' ? '轮播模式' : '单张模式'),
      ),
    ),
    h('div', { className: 'dbs-body' },
      h('nav', { className: 'dbs-nav', 'aria-label': '背景工作室导航' },
        tabs.map((entry) => h('button', {
          key: entry.id,
          type: 'button',
          className: cx('dbs-nav-item', tab === entry.id && 'is-on'),
          onClick: () => {
            setTab(entry.id)
            setInspectorOpen(false)
          },
        }, h(entry.icon), h('span', null, entry.label))),
        h('div', { className: 'dbs-nav-foot' },
          studio.importing ? h('div', { className: 'dbs-nav-status' }, h('span', { className: 'dbs-spinner' }), studio.importText || '正在处理…') : null,
          h('div', { className: 'dbs-nav-status' },
            h('span', { className: cx('dbs-dot', studio.error ? 'is-danger' : 'is-ok') }),
            studio.error ? '保存异常' : '配置已就绪',
          ),
        ),
      ),
      h('main', { className: 'dbs-main' },
        tab === 'library' || tab === 'recent' || tab === 'favorites'
          ? h(LibraryView, { studio, tab, selectedId, onSelect: pick })
          : null,
        tab === 'playlists' ? h(PlaylistView, { studio }) : null,
        tab === 'startup' ? h(StartupView, { studio }) : null,
        tab === 'audio' ? h(AudioView, { studio }) : null,
        tab === 'settings' ? h(SettingsView, { studio }) : null,
      ),
      showInspector ? h('div', { className: 'dbs-inspector-wrap' }, h(Inspector, {
        studio,
        asset: selected,
        onClose: () => setInspectorOpen(false),
      })) : null,
    ),
    h(ToastStack, { studio }),
  )
}
