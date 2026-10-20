/* =========================================================================
 * 70-apply — register the panel, the sidebar icon and the frame-wide quick bar.
 * ========================================================================= */

function SidebarIcon(props) {
  const size = typeof props?.size === 'number' ? props.size : 18
  return h('span', { className: 'dbs-sidebar-icon', style: { fontSize: `${size}px` } }, h(IconBackground))
}

function apply(ctx) {
  const studio = new Studio(ctx)
  activeStudio = studio
  // Debug/inspection hook used by verification scripts; it is not required by the UI.
  window.__DBS_STUDIO__ = studio

  ctx.effect(() => {
    const disposers = []
    const style = document.createElement('style')
    style.dataset.dbs = 'style'
    style.textContent = DBS_CSS
    document.head.appendChild(style)

    try {
      disposers.push(ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: PANEL_KEY,
      }, Panel)))
    } catch (error) {
      console.error('[dsh-background-studio] main slot registration failed', error)
    }

    try {
      disposers.push(ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: PANEL_KEY,
        order: 30,
        label: () => PANEL_TITLE,
      }, SidebarIcon)))
    } catch (error) {
      console.error('[dsh-background-studio] sidebar slot registration failed', error)
    }

    try {
      disposers.push(ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay',
        id: 'dbs-quickbar',
        order: 900,
      }, QuickBar)))
    } catch (error) {
      console.error('[dsh-background-studio] overlay slot registration failed', error)
    }

    studio.boot().catch((error) => {
      console.error('[dsh-background-studio] boot failed', error)
      studio.toast('error', `背景工作室启动失败：${error instanceof Error ? error.message : String(error)}`)
    })

    return () => {
      for (const dispose of disposers) {
        try {
          dispose()
        } catch {
          /* already disposed */
        }
      }
      if (style.parentNode) style.parentNode.removeChild(style)
      studio.dispose()
      if (activeStudio === studio) activeStudio = null
      if (window.__DBS_STUDIO__ === studio) delete window.__DBS_STUDIO__
    }
  }, 'dsh-background-studio: mount')
}
