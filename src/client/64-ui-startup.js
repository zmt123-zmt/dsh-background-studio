/* =========================================================================
 * 64-ui-startup — startup animation settings and list management.
 * ========================================================================= */

const STARTUP_ACCEPT = '.mp4,.gif,video/mp4,image/gif'

function StartupRow({ studio, item, index, total }) {
  const asset = studio.assetById(item.assetId)
  const config = studio.state.startupAnimation
  return h('div', { className: cx('dbs-startup-row', !asset && 'is-missing', !item.enabled && 'is-disabled') },
    h('span', { className: 'dbs-startup-index' }, String(index + 1).padStart(2, '0')),
    asset ? h(AssetThumb, { asset, className: 'dbs-startup-thumb' }) : h('div', { className: 'dbs-thumb dbs-startup-thumb' }),
    h('div', { className: 'dbs-startup-main' },
      h('div', { className: 'dbs-startup-name' },
        asset ? asset.name : '素材已移除',
        asset?.missing ? h(Chip, { tone: 'danger' }, '文件丢失') : null,
        item.enabled ? null : h(Chip, { tone: 'muted' }, '已禁用'),
      ),
      h('div', { className: 'dbs-startup-meta' },
        h('span', null, asset ? kindText(asset.kind) : '—'),
        h('span', null, asset?.duration > 0 ? formatDuration(asset.duration) : '时长未知'),
        h('span', null, config.durationMode === 'custom' ? `播放 ${config.customSeconds}s` : '按素材时长'),
      ),
    ),
    h('div', { className: 'dbs-startup-row-actions' },
      h('div', { className: 'dbs-rowline dbs-rowline-compact' },
        h('span', null, '启用'),
        h(Toggle, { checked: item.enabled, onChange: (value) => studio.updateStartupItem(item.id, { enabled: value }) }),
      ),
      h(IconButton, {
        icon: IconPlay,
        label: '预览',
        disabled: !asset || asset.missing,
        onClick: () => studio.previewStartup(item.id),
      }),
      h(IconButton, { icon: IconUp, label: '上移', disabled: index === 0, onClick: () => studio.moveStartupItem(item.id, index - 1) }),
      h(IconButton, { icon: IconDown, label: '下移', disabled: index === total - 1, onClick: () => studio.moveStartupItem(item.id, index + 1) }),
      h(IconButton, {
        icon: IconTrash,
        label: '从启动动画移除',
        onClick: () => {
          if (window.confirm(`从启动动画列表移除「${asset?.name ?? '这段素材'}」？不会删除背景库记录或磁盘文件。`)) {
            studio.removeStartupItem(item.id)
          }
        },
      }),
    ),
  )
}

function StartupView({ studio }) {
  const config = studio.state.startupAnimation
  const [existingId, setExistingId] = React.useState('')
  const candidates = studio.state.assets.filter((asset) =>
    (asset.kind === 'video' || asset.kind === 'gif') &&
    !asset.missing &&
    !config.items.some((item) => item.assetId === asset.id),
  )
  const importFiles = () => pickFiles({
    accept: STARTUP_ACCEPT,
    multiple: true,
    onPaths: (paths) => studio.importStartupFiles(paths),
  })
  const addExisting = (assetId) => {
    if (assetId && studio.addStartupItem(assetId)) setExistingId('')
  }

  return h('div', { className: 'dbs-startup-page' },
    h('section', { className: 'dbs-settings-card' },
      h('div', { className: 'dbs-startup-title-row' },
        h('div', null,
          h('h3', null, '启动动画'),
          h('p', { className: 'dbs-settings-text' }, 'DSH 打开时先播放一段动画，然后进入正常界面。关闭后保持原有的直接启动行为。'),
        ),
        h(Toggle, { checked: config.enabled, onChange: (value) => studio.updateStartup({ enabled: value }), label: config.enabled ? '已启用' : '已关闭' }),
      ),
      h('div', { className: 'dbs-startup-grid' },
        h(Field, { label: '展示模式', hint: config.mode === 'fullscreen' ? '独立启动画面，结束时淡出进入主界面。' : '主界面正常显示，动画作为背景层播放，结束后淡出露出原背景。' },
          h(Segmented, {
            value: config.mode,
            onChange: (value) => studio.updateStartup({ mode: value }),
            options: [
              { value: 'fullscreen', label: '全屏式启动画面' },
              { value: 'background', label: '背景渐显' },
            ],
          }),
        ),
        h(Field, { label: '启动触发方式' },
          h(Select, {
            value: config.trigger,
            onChange: (value) => studio.updateStartup({ trigger: value }),
            options: [
              { value: 'everyLaunch', label: '每次打开 DSH 都播放' },
              { value: 'firstLaunch', label: '仅首次启动时播放' },
              { value: 'random', label: '每次启动随机选择一段' },
            ],
          }),
        ),
        h(Field, { label: '跳过按钮' },
          h('div', { className: 'dbs-rowline dbs-rowline-compact' },
            h('span', null, '显示「跳过启动动画」'),
            h(Toggle, { checked: config.skip, onChange: (value) => studio.updateStartup({ skip: value }) }),
          ),
        ),
      ),
      h('div', { className: 'dbs-note' }, '页面重新加载不会重复播放启动动画；真正退出并重新打开 DSH 才会按触发方式重新判断。'),
    ),

    h('section', { className: 'dbs-settings-card' },
      h('div', { className: 'dbs-startup-list-head' },
        h('div', null,
          h('h3', null, `启动动画列表 · ${config.items.length} 段`),
          h('p', { className: 'dbs-settings-text' }, '只支持 MP4 和 GIF；复用背景库的导入、路径、缩略图与丢失检测。'),
        ),
        h('div', { className: 'dbs-row-actions' },
          h(Button, { variant: 'primary', icon: IconPlus, onClick: importFiles }, '添加启动动画'),
        ),
      ),
      h('div', { className: 'dbs-startup-add-row' },
        h(Select, {
          value: existingId,
          onChange: (value) => addExisting(value),
          options: [{ value: '', label: candidates.length > 0 ? '从背景库添加已有视频 / GIF…' : '背景库中没有可用的视频 / GIF' }].concat(
            candidates.map((asset) => ({ value: asset.id, label: `${asset.name} · ${kindText(asset.kind)}` })),
          ),
          disabled: candidates.length === 0,
        }),
        h('span', { className: 'dbs-muted' }, '随机模式只会从启用且文件有效的素材中选择。'),
      ),
      config.items.length === 0
        ? h(EmptyState, {
            icon: IconFilm,
            title: '还没有启动动画',
            text: '添加一段 MP4 或 GIF。没有素材时启动动画会自动跳过，不会卡住主界面。',
            action: h(Button, { variant: 'primary', icon: IconPlus, onClick: importFiles }, '添加第一段启动动画'),
          })
        : h('div', { className: 'dbs-startup-list' }, config.items.map((item, index) => h(StartupRow, {
            key: item.id,
            studio,
            item,
            index,
            total: config.items.length,
          }))),
    ),

    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '播放与过渡'),
      h('div', { className: 'dbs-startup-grid' },
        h(Field, { label: '播放时长', hint: '自定义时长会按时结束；GIF 即使循环也会在指定时间结束。' },
          h(Segmented, {
            value: config.durationMode,
            onChange: (value) => studio.updateStartup({ durationMode: value }),
            options: [
              { value: 'media', label: '按素材原始时长' },
              { value: 'custom', label: '自定义时长' },
            ],
          }),
        ),
        config.durationMode === 'custom' ? h(Field, { label: '自定义秒数（1–300）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 1,
            max: 300,
            step: 0.5,
            value: config.customSeconds,
            onChange: (event) => studio.updateStartup({ customSeconds: clamp(Number(event.target.value) || 1, 1, 300) }),
          }),
        ) : null,
        h(Field, { label: '画面适配' },
          h(Select, {
            value: config.display,
            onChange: (value) => studio.updateStartup({ display: value }),
            options: [
              { value: 'cover', label: '铺满（裁切）' },
              { value: 'contain', label: '等比例完整显示' },
              { value: 'center', label: '居中原始尺寸' },
            ],
          }),
        ),
      ),
      h('div', { className: 'dbs-startup-grid' },
        h(Field, { label: '淡入时长（毫秒）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 0,
            max: 5000,
            step: 50,
            value: config.fadeInMs,
            onChange: (event) => studio.updateStartup({ fadeInMs: clamp(Number(event.target.value) || 0, 0, 5000) }),
          }),
        ),
        h(Field, { label: '淡出时长（毫秒）' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 0,
            max: 5000,
            step: 50,
            value: config.fadeOutMs,
            onChange: (event) => studio.updateStartup({ fadeOutMs: clamp(Number(event.target.value) || 0, 0, 5000) }),
          }),
        ),
        config.mode === 'background' ? h(Field, { label: '淡出前停留（毫秒）', hint: '只在背景渐显模式生效。' },
          h('input', {
            className: 'dbs-input',
            type: 'number',
            min: 0,
            max: 10000,
            step: 100,
            value: config.holdMs,
            onChange: (event) => studio.updateStartup({ holdMs: clamp(Number(event.target.value) || 0, 0, 10000) }),
          }),
        ) : null,
      ),
      h('div', { className: 'dbs-note' }, '淡入/淡出为 0 时会直接切换。跳过按钮会使用较短的淡出时间；动画失败会立即移除启动层。'),
    ),

    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '启动动画音频'),
      h('p', { className: 'dbs-settings-text' }, '启动期间会暂时压低背景音频的主增益，但不会修改背景音量、静音状态或音频队列。动画结束/跳过后恢复。'),
      h('div', { className: 'dbs-startup-grid' },
        h(Field, { label: '音频模式' },
          h(Select, {
            value: config.audio.mode,
            onChange: (value) => studio.updateStartup({ audio: { mode: value } }),
            options: [
              { value: 'video', label: '播放启动视频自带音轨' },
              { value: 'mute', label: '静音播放' },
              { value: 'external', label: '播放关联的独立音频' },
            ],
          }),
        ),
        config.audio.mode === 'external' ? h(Field, { label: '关联音频' },
          h(Select, {
            value: config.audio.audioId ?? '',
            onChange: (value) => studio.updateStartup({ audio: { audioId: value || null } }),
            options: [{ value: '', label: '选择音频…' }].concat(
              studio.state.audio.map((track) => ({ value: track.id, label: track.missing ? `${track.name}（丢失）` : track.name })),
            ),
          }),
        ) : null,
        h(Field, { label: `启动音量 ${Math.round(config.audio.volume * 100)}%` },
          h(Range, {
            value: config.audio.volume,
            min: 0,
            max: 1,
            step: 0.01,
            onChange: (value) => studio.updateStartup({ audio: { volume: value } }),
            format: (value) => `${Math.round(value * 100)}%`,
          }),
        ),
      ),
    ),

    h('section', { className: 'dbs-settings-card' },
      h('h3', null, '触发状态'),
      h('dl', { className: 'dbs-meta' },
        h('dt', null, '本次会话'), h('dd', null, studio.startup?.sessionConsumed() ? '已消费（刷新不会重播）' : '尚未消费'),
        h('dt', null, '首次启动记录'), h('dd', null, config.firstRunDone ? '已播放过' : '尚未播放'),
        h('dt', null, '有效素材'), h('dd', null, `${config.items.filter((item) => {
          const asset = studio.assetById(item.assetId)
          return item.enabled && asset && !asset.missing && (asset.kind === 'video' || asset.kind === 'gif')
        }).length} 段`),
      ),
      h('div', { className: 'dbs-settings-actions' },
        h(Button, { icon: IconPlay, disabled: config.items.length === 0, onClick: () => {
          const first = config.items.find((item) => {
            const asset = studio.assetById(item.assetId)
            return asset && !asset.missing
          })
          if (first) studio.previewStartup(first.id)
        } }, '预览第一段'),
        h(Button, { icon: IconRefresh, onClick: () => studio.resetStartupFirstRun() }, '重置首次启动记录'),
      ),
      h('p', { className: 'dbs-settings-text' }, '「仅首次启动」使用持久化的播放记录；「每次打开」使用窗口会话记录，页面刷新不会重复。'),
    ),
  )
}
