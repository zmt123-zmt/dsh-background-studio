window.__ModuleLoader__.load({
  id: 'dsh-background-studio',
  factory(require) {
    const React = require('react')
    const DBS_CSS = "﻿/* =========================================================================\n * DSH Background Studio 鈥?panel UI.\n * Colors come from DSH theme tokens only; the few literal colors are media\n * fallbacks / status hues that must stay recognizable in both themes.\n * ========================================================================= */\n\n.dbs-panel {\n  position: relative;\n  box-sizing: border-box;\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n  color: var(--dsw-alias-label-primary);\n  font-size: 13px;\n  line-height: 1.45;\n  overflow: hidden;\n  background: transparent;\n}\n\n.dbs-panel *,\n.dbs-quickbar *,\n.dbs-modal *,\n.dbs-toasts * {\n  box-sizing: border-box;\n}\n\n.dbs-panel button,\n.dbs-quickbar button,\n.dbs-modal button {\n  font: inherit;\n}\n\n.dbs-header {\n  flex: none;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 16px;\n  padding: 14px 18px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 76%, transparent);\n  backdrop-filter: blur(18px);\n}\n\n.dbs-brand {\n  display: flex;\n  align-items: center;\n  gap: 11px;\n  min-width: 0;\n}\n\n.dbs-brand-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 10px;\n  display: grid;\n  place-items: center;\n  color: #fff;\n  background: linear-gradient(135deg, #2b6cb0, #7c3aed);\n  box-shadow: 0 4px 14px color-mix(in srgb, #2b6cb0 30%, transparent);\n  font-size: 19px;\n  flex: none;\n}\n\n.dbs-brand-title {\n  font-size: 15px;\n  font-weight: 650;\n  letter-spacing: 0.01em;\n}\n\n.dbs-brand-sub {\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n  margin-top: 1px;\n}\n\n.dbs-header-status {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  min-width: 0;\n}\n\n.dbs-now {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  max-width: 320px;\n  padding: 5px 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-layer-1);\n  font-size: 11.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-now.is-idle {\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-now-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--dsw-alias-state-success-primary);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-state-success-primary) 16%, transparent);\n  flex: none;\n}\n\n.dbs-mode-chip {\n  font-size: 11px;\n  color: var(--dsw-alias-label-secondary);\n  white-space: nowrap;\n}\n\n.dbs-body {\n  flex: 1;\n  min-height: 0;\n  display: flex;\n}\n\n.dbs-nav {\n  width: 190px;\n  flex: none;\n  display: flex;\n  flex-direction: column;\n  gap: 2px;\n  padding: 12px 9px;\n  border-right: 1px solid var(--dsw-alias-border-l1);\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 58%, transparent);\n  backdrop-filter: blur(16px);\n}\n\n.dbs-nav-item {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  height: 34px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12.5px;\n  cursor: pointer;\n  text-align: left;\n  white-space: nowrap;\n}\n\n.dbs-nav-item svg {\n  font-size: 16px;\n  flex: none;\n}\n\n.dbs-nav-item:hover {\n  background: var(--dsw-alias-interactive-bg-hover, color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent));\n  color: var(--dsw-alias-label-primary);\n}\n\n.dbs-nav-item.is-on {\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 16%, transparent);\n  color: var(--dsw-alias-brand-primary);\n  font-weight: 600;\n}\n\n.dbs-nav-foot {\n  margin-top: auto;\n  padding: 10px 6px 2px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n}\n\n.dbs-nav-status {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10.5px;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dbs-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  flex: none;\n  background: var(--dsw-alias-state-success-primary);\n}\n\n.dbs-dot.is-danger {\n  background: var(--dsw-alias-state-error-primary);\n}\n\n.dbs-main {\n  flex: 1;\n  min-width: 0;\n  min-height: 0;\n  overflow: auto;\n  padding: 14px 16px 28px;\n  scrollbar-width: thin;\n}\n\n.dbs-inspector-wrap {\n  width: 340px;\n  flex: none;\n  min-height: 0;\n  border-left: 1px solid var(--dsw-alias-border-l1);\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, transparent);\n  backdrop-filter: blur(18px);\n}\n\n.dbs-inspector {\n  height: 100%;\n  min-height: 0;\n  display: flex;\n  flex-direction: column;\n}\n\n.dbs-inspector-head {\n  flex: none;\n  height: 44px;\n  padding: 0 14px;\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-inspector-title {\n  font-size: 12.5px;\n  font-weight: 650;\n}\n\n.dbs-inspector-scroll {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  padding: 13px 14px 20px;\n  scrollbar-width: thin;\n}\n\n.dbs-inspector-empty {\n  padding: 26px 20px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 1.7;\n  text-align: center;\n}\n\n.dbs-inspector-hero {\n  display: flex;\n  gap: 11px;\n  align-items: flex-start;\n}\n\n.dbs-inspector-hero .dbs-thumb {\n  width: 92px;\n  height: 58px;\n  flex: none;\n  border-radius: 9px;\n}\n\n.dbs-inspector-hero-body {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-rename {\n  width: 100%;\n  height: 27px;\n  border: 1px solid transparent;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-weight: 640;\n  padding: 0 5px;\n}\n\n.dbs-rename:hover,\n.dbs-rename:focus {\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-2);\n  outline: none;\n}\n\n.dbs-inspector-sub {\n  display: flex;\n  gap: 8px;\n  flex-wrap: wrap;\n  padding: 1px 5px 0;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10.5px;\n}\n\n.dbs-inspector-actions {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  margin-top: 7px;\n  padding-left: 2px;\n}\n\n.dbs-section {\n  margin-top: 15px;\n  padding-top: 12px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-section-title {\n  font-size: 11px;\n  font-weight: 650;\n  letter-spacing: 0.04em;\n  color: var(--dsw-alias-label-secondary);\n  text-transform: uppercase;\n  margin-bottom: 9px;\n}\n\n.dbs-field {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  margin-bottom: 10px;\n}\n\n.dbs-field-label {\n  font-size: 11.5px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-field-hint {\n  font-size: 10.5px;\n  color: var(--dsw-alias-label-secondary);\n  opacity: 0.82;\n  line-height: 1.5;\n}\n\n.dbs-rowline {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 10px;\n  margin-bottom: 9px;\n  font-size: 12px;\n}\n\n.dbs-audio-queue {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  margin-top: 6px;\n}\n\n.dbs-audio-chip {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  min-width: 0;\n  padding: 3px 3px 3px 7px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 7px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dbs-audio-chip.is-active {\n  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 48%, transparent);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 9%, var(--dsw-alias-bg-layer-2));\n}\n\n.dbs-audio-chip-main {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font-size: 10.5px;\n  text-align: left;\n  cursor: pointer;\n}\n\n.dbs-audio-dot {\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  flex: none;\n  border: 1px solid var(--dsw-alias-label-secondary);\n}\n\n.dbs-audio-chip.is-active .dbs-audio-dot {\n  border-color: var(--dsw-alias-brand-primary);\n  background: var(--dsw-alias-brand-primary);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--dsw-alias-brand-primary) 14%, transparent);\n}\n\n.dbs-audio-chip-name {\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dbs-audio-chip .dbs-icon-btn {\n  width: 22px;\n  height: 22px;\n}\n\n.dbs-preview-bar {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  margin: 4px 0 10px;\n  padding: 5px 7px;\n  border: 1px dashed var(--dsw-alias-border-l1);\n  border-radius: 7px;\n  font-size: 10px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-preview-bar .dbs-progress {\n  flex: 1;\n  min-width: 40px;\n}\n\n.dbs-note {\n  margin: 8px 0 2px;\n  padding: 8px 10px;\n  border: 1px dashed var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10.5px;\n  line-height: 1.6;\n}\n\n.dbs-input,\n.dbs-select {\n  width: 100%;\n  height: 30px;\n  padding: 0 9px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 7px;\n  background: var(--dsw-alias-bg-layer-2);\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n  outline: none;\n}\n\n.dbs-input:focus,\n.dbs-select:focus {\n  border-color: var(--dsw-alias-brand-primary);\n}\n\n.dbs-input-sm {\n  width: 64px;\n  height: 26px;\n  padding: 0 6px;\n  font-size: 11px;\n}\n\n.dbs-range {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n}\n\n.dbs-range input[type='range'] {\n  width: 100%;\n  min-width: 0;\n  accent-color: var(--dsw-alias-brand-primary);\n  cursor: pointer;\n}\n\n.dbs-range-value {\n  flex: none;\n  min-width: 40px;\n  text-align: right;\n  font-size: 10.5px;\n  color: var(--dsw-alias-label-secondary);\n  font-variant-numeric: tabular-nums;\n}\n\n.dbs-toggle {\n  display: inline-flex;\n  align-items: center;\n  gap: 7px;\n  padding: 0;\n  border: 0;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  flex: none;\n}\n\n.dbs-toggle-knob {\n  position: relative;\n  width: 30px;\n  height: 17px;\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent);\n  transition: background 160ms ease;\n}\n\n.dbs-toggle-knob::after {\n  content: '';\n  position: absolute;\n  top: 2px;\n  left: 2px;\n  width: 13px;\n  height: 13px;\n  border-radius: 50%;\n  background: #fff;\n  transition: transform 160ms ease;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);\n}\n\n.dbs-toggle.is-on .dbs-toggle-knob {\n  background: var(--dsw-alias-brand-primary);\n}\n\n.dbs-toggle.is-on .dbs-toggle-knob::after {\n  transform: translateX(13px);\n}\n\n.dbs-toggle-text {\n  font-size: 11.5px;\n}\n\n.dbs-segmented {\n  display: inline-flex;\n  padding: 2px;\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l1);\n  gap: 2px;\n}\n\n.dbs-segmented-item {\n  height: 24px;\n  padding: 0 10px;\n  border: 0;\n  border-radius: 6px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  cursor: pointer;\n  white-space: nowrap;\n}\n\n.dbs-segmented-item.is-on {\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);\n  font-weight: 600;\n}\n\n.dbs-btn {\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 11px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 7px;\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n  font-size: 11.5px;\n  cursor: pointer;\n  white-space: nowrap;\n  transition: background 140ms ease, border-color 140ms ease, transform 140ms ease;\n}\n\n.dbs-btn svg {\n  font-size: 14px;\n}\n\n.dbs-btn:hover:not(:disabled) {\n  border-color: var(--dsw-alias-label-secondary);\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dbs-btn:active:not(:disabled) {\n  transform: translateY(1px);\n}\n\n.dbs-btn:disabled {\n  opacity: 0.45;\n  cursor: not-allowed;\n}\n\n.dbs-btn-primary {\n  border-color: transparent;\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary));\n  color: var(--dsw-alias-label-primary-foreground, #fff);\n  font-weight: 600;\n}\n\n.dbs-btn-primary:hover:not(:disabled) {\n  background: var(--dsw-alias-button-primary-fill, var(--dsw-alias-brand-primary));\n  filter: brightness(0.94);\n  border-color: transparent;\n}\n\n.dbs-btn-ghost {\n  background: transparent;\n  border-color: transparent;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-btn-ghost:hover:not(:disabled) {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: transparent;\n  color: var(--dsw-alias-label-primary);\n}\n\n.dbs-btn-danger {\n  color: var(--dsw-alias-state-error-primary);\n  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 38%, transparent);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent);\n}\n\n.dbs-btn-danger:hover:not(:disabled) {\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 14%, transparent);\n  border-color: var(--dsw-alias-state-error-primary);\n}\n\n.dbs-btn-sm {\n  height: 26px;\n  padding: 0 8px;\n  font-size: 10.5px;\n}\n\n.dbs-icon-btn {\n  display: inline-grid;\n  place-items: center;\n  width: 28px;\n  height: 28px;\n  padding: 0;\n  border: 1px solid transparent;\n  border-radius: 7px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  flex: none;\n}\n\n.dbs-icon-btn svg {\n  font-size: 15px;\n}\n\n.dbs-icon-btn:hover:not(:disabled) {\n  background: var(--dsw-alias-bg-layer-2);\n  border-color: var(--dsw-alias-border-l1);\n  color: var(--dsw-alias-label-primary);\n}\n\n.dbs-icon-btn:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n}\n\n.dbs-icon-btn.is-on {\n  color: var(--dsw-alias-brand-primary);\n}\n\n.dbs-chip {\n  display: inline-flex;\n  align-items: center;\n  height: 18px;\n  padding: 0 6px;\n  border-radius: 999px;\n  background: var(--dsw-alias-bg-layer-2);\n  border: 1px solid var(--dsw-alias-border-l1);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 9.5px;\n  font-weight: 600;\n  white-space: nowrap;\n}\n\n.dbs-chip-accent {\n  color: var(--dsw-alias-brand-primary);\n  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 12%, transparent);\n}\n\n.dbs-chip-danger {\n  color: var(--dsw-alias-state-error-primary);\n  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 40%, transparent);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 10%, transparent);\n}\n\n.dbs-chip-muted {\n  color: var(--dsw-alias-label-secondary);\n}\n\n/* ---------- library ---------- */\n\n.dbs-import-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  flex-wrap: wrap;\n  padding: 8px 10px;\n  margin-bottom: 10px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 72%, transparent);\n  font-size: 11px;\n}\n\n.dbs-import-label {\n  color: var(--dsw-alias-label-secondary);\n  font-weight: 600;\n}\n\n.dbs-import-hint {\n  color: var(--dsw-alias-label-secondary);\n  opacity: 0.8;\n}\n\n.dbs-import-status {\n  margin-left: auto;\n  color: var(--dsw-alias-brand-primary);\n  font-variant-numeric: tabular-nums;\n}\n\n.dbs-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  flex-wrap: wrap;\n  margin-bottom: 12px;\n}\n\n.dbs-toolbar-title {\n  font-size: 12px;\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-toolbar-group {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  margin-left: auto;\n  flex-wrap: wrap;\n}\n\n.dbs-toolbar .dbs-select {\n  width: auto;\n  min-width: 96px;\n  height: 28px;\n  font-size: 11px;\n}\n\n.dbs-search {\n  flex: 1;\n  min-width: 160px;\n  max-width: 340px;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  height: 30px;\n  padding: 0 8px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-search svg {\n  font-size: 14px;\n  flex: none;\n}\n\n.dbs-search input {\n  flex: 1;\n  min-width: 0;\n  height: 100%;\n  border: 0;\n  outline: 0;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 12px;\n}\n\n.dbs-search .dbs-icon-btn {\n  width: 22px;\n  height: 22px;\n}\n\n.dbs-view-toggle {\n  display: inline-flex;\n  padding: 1px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 8px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dbs-view-toggle .dbs-icon-btn {\n  width: 26px;\n  height: 24px;\n}\n\n.dbs-view-toggle .dbs-icon-btn.is-on {\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-primary);\n}\n\n.dbs-batch {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  padding: 7px 10px;\n  margin-bottom: 10px;\n  border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 30%, transparent);\n  border-radius: 8px;\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, transparent);\n  font-size: 11.5px;\n}\n\n.dbs-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(198px, 1fr));\n  gap: 12px;\n}\n\n.dbs-card {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 12px;\n  overflow: hidden;\n  background: var(--dsw-alias-bg-layer-1);\n  cursor: pointer;\n  outline: none;\n  transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;\n}\n\n.dbs-card:hover,\n.dbs-card:focus-visible {\n  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, var(--dsw-alias-border-l2));\n  transform: translateY(-1px);\n  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.14);\n}\n\n.dbs-card.is-selected {\n  border-color: var(--dsw-alias-brand-primary);\n  box-shadow: 0 0 0 1px var(--dsw-alias-brand-primary);\n}\n\n.dbs-card.is-current::before {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  bottom: 0;\n  width: 3px;\n  background: var(--dsw-alias-brand-primary);\n  z-index: 2;\n}\n\n.dbs-card-media {\n  position: relative;\n  aspect-ratio: 16 / 9;\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 70%, #000);\n  overflow: hidden;\n}\n\n.dbs-thumb {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  overflow: hidden;\n  display: grid;\n  place-items: center;\n  background: color-mix(in srgb, var(--dsw-alias-bg-base) 60%, #111);\n}\n\n.dbs-thumb img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  display: block;\n}\n\n.dbs-thumb-fallback {\n  display: grid;\n  place-items: center;\n  width: 100%;\n  height: 100%;\n  font-size: 26px;\n  color: var(--dsw-alias-label-secondary);\n  opacity: 0.65;\n}\n\n.dbs-thumb-missing {\n  position: absolute;\n  left: 6px;\n  bottom: 6px;\n  padding: 1px 6px;\n  border-radius: 4px;\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 80%, #000);\n  color: #fff;\n  font-size: 9px;\n  font-weight: 600;\n}\n\n.dbs-card-top {\n  position: absolute;\n  inset: 6px 6px auto 6px;\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 4px;\n  z-index: 2;\n}\n\n.dbs-check {\n  display: inline-grid;\n  place-items: center;\n  width: 18px;\n  height: 18px;\n  border-radius: 5px;\n  background: rgba(8, 10, 14, 0.48);\n  backdrop-filter: blur(4px);\n  cursor: pointer;\n}\n\n.dbs-check input {\n  width: 12px;\n  height: 12px;\n  accent-color: var(--dsw-alias-brand-primary);\n  cursor: pointer;\n}\n\n.dbs-card-star {\n  display: grid;\n  place-items: center;\n  width: 24px;\n  height: 24px;\n  border: 0;\n  border-radius: 7px;\n  background: rgba(8, 10, 14, 0.46);\n  color: rgba(255, 255, 255, 0.82);\n  cursor: pointer;\n  backdrop-filter: blur(4px);\n  font-size: 14px;\n}\n\n.dbs-card-star.is-on {\n  color: #ffd166;\n}\n\n.dbs-card-badges {\n  position: absolute;\n  left: 7px;\n  bottom: 7px;\n  display: flex;\n  gap: 4px;\n  flex-wrap: wrap;\n  z-index: 2;\n}\n\n.dbs-card-badges .dbs-chip {\n  background: rgba(8, 10, 14, 0.58);\n  border-color: rgba(255, 255, 255, 0.16);\n  color: #fff;\n}\n\n.dbs-card-badges .dbs-chip-accent {\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 82%, #000);\n  color: #fff;\n}\n\n.dbs-card-duration {\n  position: absolute;\n  right: 7px;\n  bottom: 7px;\n  padding: 1px 5px;\n  border-radius: 4px;\n  background: rgba(8, 10, 14, 0.62);\n  color: #fff;\n  font-size: 9.5px;\n  font-variant-numeric: tabular-nums;\n  z-index: 2;\n}\n\n.dbs-card-body {\n  padding: 8px 10px 4px;\n  min-width: 0;\n}\n\n.dbs-card-name {\n  font-size: 12px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-card-meta {\n  display: flex;\n  gap: 8px;\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-card-actions {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 4px;\n  padding: 5px 7px 7px 10px;\n  opacity: 0;\n  transition: opacity 160ms ease;\n}\n\n.dbs-card:hover .dbs-card-actions,\n.dbs-card:focus-within .dbs-card-actions,\n.dbs-card.is-selected .dbs-card-actions,\n.dbs-card.is-current .dbs-card-actions {\n  opacity: 1;\n}\n\n.dbs-list {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n\n.dbs-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 7px 9px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-1);\n  cursor: pointer;\n}\n\n.dbs-row:hover,\n.dbs-row.is-selected {\n  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 45%, var(--dsw-alias-border-l2));\n}\n\n.dbs-row.is-current {\n  border-color: var(--dsw-alias-brand-primary);\n}\n\n.dbs-thumb-row {\n  width: 74px;\n  height: 46px;\n  border-radius: 6px;\n  flex: none;\n}\n\n.dbs-row-main {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-row-name {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-row-meta {\n  display: flex;\n  gap: 9px;\n  margin-top: 1px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dbs-row-actions {\n  display: flex;\n  align-items: center;\n  gap: 3px;\n  flex: none;\n}\n\n.dbs-row-actions .dbs-icon-btn.is-on {\n  color: #ffd166;\n}\n\n.dbs-empty {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  min-height: 48vh;\n  text-align: center;\n  padding: 24px;\n}\n\n.dbs-empty-icon {\n  display: grid;\n  place-items: center;\n  width: 58px;\n  height: 58px;\n  border-radius: 18px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  background: var(--dsw-alias-bg-layer-1);\n  color: var(--dsw-alias-label-secondary);\n  font-size: 27px;\n  margin-bottom: 13px;\n}\n\n.dbs-empty-title {\n  font-size: 15px;\n  font-weight: 650;\n}\n\n.dbs-empty-text {\n  max-width: 420px;\n  margin-top: 5px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n  line-height: 1.6;\n}\n\n.dbs-empty-action {\n  margin-top: 16px;\n}\n\n.dbs-loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 9px;\n  height: 100%;\n  min-height: 240px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n}\n\n.dbs-spinner {\n  width: 15px;\n  height: 15px;\n  border-radius: 50%;\n  border: 2px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent);\n  border-top-color: var(--dsw-alias-brand-primary);\n  animation: dbs-spin 800ms linear infinite;\n  flex: none;\n}\n\n@keyframes dbs-spin {\n  to { transform: rotate(360deg); }\n}\n\n/* ---------- inspector extras ---------- */\n\n.dbs-alert {\n  display: flex;\n  align-items: center;\n  gap: 7px;\n  margin-top: 10px;\n  padding: 7px 9px;\n  border-radius: 8px;\n  font-size: 10.5px;\n  line-height: 1.5;\n}\n\n.dbs-alert svg {\n  font-size: 14px;\n  flex: none;\n}\n\n.dbs-alert.is-danger {\n  color: var(--dsw-alias-state-error-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 9%, transparent);\n  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, transparent);\n}\n\n.dbs-alert.is-warning {\n  color: var(--dsw-alias-state-warn-primary);\n  background: color-mix(in srgb, var(--dsw-alias-state-warn-primary) 9%, transparent);\n  border: 1px solid color-mix(in srgb, var(--dsw-alias-state-warn-primary) 30%, transparent);\n}\n\n.dbs-alert .dbs-btn {\n  margin-left: auto;\n}\n\n.dbs-meta {\n  display: grid;\n  grid-template-columns: 64px minmax(0, 1fr);\n  gap: 4px 8px;\n  margin: 0;\n  font-size: 10.5px;\n}\n\n.dbs-meta dt {\n  color: var(--dsw-alias-label-secondary);\n}\n\n.dbs-meta dd {\n  margin: 0;\n  min-width: 0;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n.dbs-inspector-footer {\n  display: flex;\n  gap: 6px;\n  flex-wrap: wrap;\n  margin-top: 15px;\n  padding-top: 12px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n/* ---------- playlists ---------- */\n\n.dbs-playlists {\n  display: flex;\n  gap: 14px;\n  min-height: 100%;\n}\n\n.dbs-scheme-list {\n  width: 205px;\n  flex: none;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding-right: 12px;\n  border-right: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-scheme-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 0 2px 4px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10.5px;\n  font-weight: 650;\n  letter-spacing: 0.04em;\n  text-transform: uppercase;\n}\n\n.dbs-scheme {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: flex-start;\n  gap: 1px;\n  padding: 8px 10px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  background: transparent;\n  text-align: left;\n  cursor: pointer;\n  color: var(--dsw-alias-label-primary);\n}\n\n.dbs-scheme:hover {\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.dbs-scheme.is-on {\n  background: var(--dsw-alias-bg-layer-1);\n  border-color: color-mix(in srgb, var(--dsw-alias-brand-primary) 40%, transparent);\n}\n\n.dbs-scheme-name {\n  width: 100%;\n  font-size: 12px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-scheme-meta {\n  display: flex;\n  gap: 7px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dbs-scheme-dot {\n  position: absolute;\n  right: 9px;\n  top: 11px;\n  width: 6px;\n  height: 6px;\n  border-radius: 50%;\n  background: var(--dsw-alias-state-success-primary);\n}\n\n.dbs-playlist-editor {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-playlist-empty {\n  flex: 1;\n  display: grid;\n  place-items: center;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 12px;\n}\n\n.dbs-playlist-head {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 10px;\n}\n\n.dbs-playlist-name {\n  flex: 1;\n  min-width: 0;\n  height: 34px;\n  border: 1px solid transparent;\n  border-radius: 8px;\n  background: transparent;\n  color: var(--dsw-alias-label-primary);\n  font: inherit;\n  font-size: 16px;\n  font-weight: 650;\n  padding: 0 7px;\n}\n\n.dbs-playlist-name:hover,\n.dbs-playlist-name:focus {\n  border-color: var(--dsw-alias-border-l2);\n  background: var(--dsw-alias-bg-layer-1);\n  outline: none;\n}\n\n.dbs-playlist-actions {\n  display: flex;\n  gap: 5px;\n  flex-wrap: wrap;\n}\n\n.dbs-playlist-options {\n  display: grid;\n  grid-template-columns: minmax(150px, 220px) auto auto;\n  gap: 8px 18px;\n  align-items: end;\n  padding: 10px 12px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-layer-1);\n  margin-bottom: 10px;\n}\n\n.dbs-playlist-options .dbs-field {\n  margin-bottom: 0;\n}\n\n.dbs-playback {\n  display: flex;\n  align-items: center;\n  gap: 16px;\n  padding: 10px 12px;\n  margin-bottom: 10px;\n  border: 1px solid color-mix(in srgb, var(--dsw-alias-brand-primary) 26%, var(--dsw-alias-border-l1));\n  border-radius: 10px;\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 6%, var(--dsw-alias-bg-layer-1));\n}\n\n.dbs-playback-left {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  flex-wrap: wrap;\n}\n\n.dbs-playback-now {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  font-size: 11.5px;\n}\n\n.dbs-playback-now strong {\n  font-size: 12.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-progress {\n  width: 100%;\n  height: 3px;\n  border-radius: 2px;\n  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 18%, transparent);\n  overflow: hidden;\n}\n\n.dbs-progress span {\n  display: block;\n  height: 100%;\n  background: var(--dsw-alias-brand-primary);\n  transition: width 220ms linear;\n}\n\n.dbs-items {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n}\n\n.dbs-items-empty {\n  padding: 26px;\n  border: 1px dashed var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  color: var(--dsw-alias-label-secondary);\n  text-align: center;\n  font-size: 11.5px;\n}\n\n.dbs-item {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  padding: 6px 7px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-1);\n  cursor: grab;\n}\n\n.dbs-item:hover {\n  border-color: var(--dsw-alias-border-l2);\n}\n\n.dbs-item.is-current {\n  border-color: var(--dsw-alias-brand-primary);\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 8%, var(--dsw-alias-bg-layer-1));\n}\n\n.dbs-item.is-missing {\n  opacity: 0.68;\n}\n\n.dbs-item-index {\n  width: 22px;\n  flex: none;\n  text-align: center;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dbs-thumb-item {\n  width: 64px;\n  height: 40px;\n  border-radius: 6px;\n  flex: none;\n}\n\n.dbs-item-main {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-item-name {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 11.5px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-item-meta {\n  display: flex;\n  gap: 8px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dbs-item-dwell {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  flex: none;\n}\n\n.dbs-item-dwell .dbs-select {\n  width: 92px;\n  height: 26px;\n  font-size: 10.5px;\n  padding: 0 6px;\n}\n\n.dbs-item-actions {\n  display: flex;\n  gap: 1px;\n  flex: none;\n}\n\n.dbs-item-actions .dbs-icon-btn {\n  width: 24px;\n  height: 24px;\n}\n\n/* ---------- audio ---------- */\n\n.dbs-audio {\n  max-width: 900px;\n}\n\n.dbs-audio-list {\n  display: flex;\n  flex-direction: column;\n  gap: 6px;\n  margin-top: 10px;\n}\n\n.dbs-audio-row {\n  display: flex;\n  align-items: center;\n  gap: 11px;\n  padding: 9px 11px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.dbs-audio-row.is-missing {\n  opacity: 0.72;\n}\n\n.dbs-audio-icon {\n  width: 34px;\n  height: 34px;\n  border-radius: 9px;\n  display: grid;\n  place-items: center;\n  background: color-mix(in srgb, var(--dsw-alias-brand-primary) 13%, transparent);\n  color: var(--dsw-alias-brand-primary);\n  font-size: 17px;\n  flex: none;\n}\n\n.dbs-audio-main {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-audio-name {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-audio-meta {\n  display: flex;\n  gap: 9px;\n  flex-wrap: wrap;\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dbs-audio-path {\n  margin-top: 2px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 9.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  opacity: 0.75;\n}\n\n.dbs-audio-actions {\n  display: flex;\n  align-items: center;\n  gap: 3px;\n  flex: none;\n}\n\n/* ---------- settings ---------- */\n\n.dbs-settings {\n  max-width: 780px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.dbs-settings-card {\n  padding: 14px 16px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 11px;\n  background: var(--dsw-alias-bg-layer-1);\n}\n\n.dbs-settings-card.is-muted {\n  background: color-mix(in srgb, var(--dsw-alias-bg-layer-1) 55%, transparent);\n}\n\n.dbs-settings-card h3 {\n  margin: 0 0 10px;\n  font-size: 12.5px;\n  font-weight: 650;\n}\n\n.dbs-settings-text {\n  margin: 0 0 10px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  line-height: 1.6;\n}\n\n.dbs-settings-actions {\n  display: flex;\n  gap: 7px;\n  flex-wrap: wrap;\n  margin-top: 10px;\n}\n\n.dbs-limits {\n  margin: 0;\n  padding-left: 17px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 11px;\n  line-height: 1.75;\n}\n\n/* ---------- modal, toast ---------- */\n\n.dbs-modal-backdrop {\n  position: fixed;\n  inset: 0;\n  z-index: 80;\n  display: grid;\n  place-items: center;\n  padding: 20px;\n  background: rgba(4, 6, 10, 0.52);\n  backdrop-filter: blur(4px);\n}\n\n.dbs-modal {\n  width: min(680px, 100%);\n  max-height: min(74vh, 720px);\n  display: flex;\n  flex-direction: column;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 13px;\n  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1));\n  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.38);\n  overflow: hidden;\n}\n\n.dbs-modal-head {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 12px 14px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-modal-title {\n  font-size: 13px;\n  font-weight: 650;\n}\n\n.dbs-modal-toolbar {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  padding: 10px 14px;\n  border-bottom: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-modal-list {\n  flex: 1;\n  min-height: 0;\n  overflow: auto;\n  padding: 6px;\n}\n\n.dbs-modal-foot {\n  display: flex;\n  justify-content: flex-end;\n  gap: 7px;\n  padding: 10px 14px;\n  border-top: 1px solid var(--dsw-alias-border-l1);\n}\n\n.dbs-pick-row {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  padding: 5px 7px;\n  border-radius: 8px;\n  cursor: pointer;\n}\n\n.dbs-pick-row:hover,\n.dbs-pick-row.is-checked {\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dbs-thumb-pick {\n  width: 58px;\n  height: 36px;\n  border-radius: 5px;\n  flex: none;\n}\n\n.dbs-pick-name {\n  flex: 1;\n  min-width: 0;\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 11.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-pick-meta {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  flex: none;\n}\n\n.dbs-pad {\n  padding: 18px;\n  text-align: center;\n}\n\n.dbs-muted {\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10.5px;\n}\n\n.dbs-toasts {\n  position: fixed;\n  left: 50%;\n  bottom: 20px;\n  transform: translateX(-50%);\n  z-index: 90;\n  display: flex;\n  flex-direction: column;\n  gap: 7px;\n  width: min(520px, calc(100vw - 32px));\n  pointer-events: none;\n}\n\n.dbs-toast {\n  display: flex;\n  align-items: flex-start;\n  gap: 8px;\n  padding: 9px 11px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 10px;\n  background: var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1));\n  color: var(--dsw-alias-label-primary);\n  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.26);\n  font-size: 11.5px;\n  line-height: 1.5;\n  pointer-events: auto;\n}\n\n.dbs-toast-mark {\n  flex: none;\n  display: grid;\n  place-items: center;\n  width: 18px;\n  height: 18px;\n  border-radius: 50%;\n  font-size: 11px;\n  color: #fff;\n  background: var(--dsw-alias-brand-primary);\n}\n\n.dbs-toast.is-success .dbs-toast-mark { background: var(--dsw-alias-state-success-primary); }\n.dbs-toast.is-warning .dbs-toast-mark { background: var(--dsw-alias-state-warn-primary); }\n.dbs-toast.is-error .dbs-toast-mark { background: var(--dsw-alias-state-error-primary); }\n\n.dbs-toast-text {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-toast-close {\n  flex: none;\n  width: 20px;\n  height: 20px;\n  border: 0;\n  border-radius: 5px;\n  background: transparent;\n  color: var(--dsw-alias-label-secondary);\n  cursor: pointer;\n  font-size: 13px;\n  line-height: 1;\n}\n\n.dbs-toast-close:hover {\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n/* ---------- quick bar ---------- */\n\n.dbs-quickbar {\n  position: fixed;\n  left: 250px;\n  bottom: 16px;\n  z-index: 60;\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  max-width: min(430px, calc(100vw - 32px));\n  padding: 5px 6px 5px 5px;\n  border: 1px solid var(--dsw-alias-border-l2);\n  border-radius: 999px;\n  background: color-mix(in srgb, var(--dsw-alias-bg-overlay, var(--dsw-alias-bg-layer-1)) 82%, transparent);\n  backdrop-filter: blur(18px);\n  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.24);\n  color: var(--dsw-alias-label-primary);\n  overflow: hidden;\n  pointer-events: auto;\n}\n\n.dbs-quickbar-main {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 0;\n  cursor: pointer;\n  padding: 2px 4px;\n  border-radius: 999px;\n}\n\n.dbs-quickbar-main:hover {\n  background: color-mix(in srgb, var(--dsw-alias-label-primary) 7%, transparent);\n}\n\n.dbs-thumb-quick {\n  width: 30px;\n  height: 30px;\n  border-radius: 50%;\n  flex: none;\n}\n\n.dbs-quickbar-text {\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 0;\n  padding-right: 4px;\n}\n\n.dbs-quickbar-name {\n  max-width: 190px;\n  font-size: 11.5px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-quickbar-sub {\n  max-width: 190px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 9.5px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-quickbar-controls {\n  display: flex;\n  align-items: center;\n  gap: 0;\n  flex: none;\n}\n\n.dbs-quickbar-controls .dbs-icon-btn {\n  width: 26px;\n  height: 26px;\n  border-radius: 50%;\n}\n\n.dbs-quickbar-progress {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  height: 2px;\n  background: color-mix(in srgb, var(--dsw-alias-label-secondary) 16%, transparent);\n}\n\n.dbs-quickbar-progress span {\n  display: block;\n  height: 100%;\n  background: var(--dsw-alias-brand-primary);\n  transition: width 240ms linear;\n}\n\n.dbs-sidebar-icon {\n  display: inline-grid;\n  place-items: center;\n  line-height: 1;\n}\n\n/* ---------- startup overlay (Mode A) ---------- */\n\n.dbs-startup-overlay {\n  position: fixed;\n  inset: 0;\n  z-index: 2147483647;\n  display: grid;\n  place-items: center;\n  overflow: hidden;\n  background: #05070b;\n  color: #fff;\n  opacity: 0;\n  transition-property: opacity;\n  transition-timing-function: ease;\n}\n\n.dbs-startup-overlay .dbs-startup-media,\n.dbs-startup-layer .dbs-startup-media {\n  position: absolute;\n  inset: 0;\n  overflow: hidden;\n  display: grid;\n  place-items: center;\n}\n\n.dbs-startup-overlay .dbs-startup-asset,\n.dbs-startup-layer .dbs-startup-asset {\n  display: block;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  user-select: none;\n  -webkit-user-drag: none;\n}\n\n.dbs-startup-overlay .dbs-startup-hint {\n  position: absolute;\n  left: 50%;\n  bottom: 24px;\n  transform: translateX(-50%);\n  z-index: 2;\n  padding: 5px 12px;\n  border-radius: 999px;\n  background: rgba(8, 10, 14, 0.42);\n  color: rgba(255, 255, 255, 0.78);\n  font-size: 11px;\n  letter-spacing: 0.06em;\n  backdrop-filter: blur(8px);\n  pointer-events: none;\n}\n\n.dbs-startup-skip {\n  position: absolute;\n  top: 18px;\n  left: 50%;\n  right: auto;\n  bottom: auto;\n  transform: translateX(-50%);\n  z-index: 5;\n  height: 30px;\n  padding: 0 13px;\n  border: 1px solid rgba(255, 255, 255, 0.28);\n  border-radius: 999px;\n  background: rgba(8, 10, 14, 0.48);\n  color: rgba(255, 255, 255, 0.9);\n  font: inherit;\n  font-size: 11.5px;\n  cursor: pointer;\n  backdrop-filter: blur(8px);\n  transition: background 160ms ease, border-color 160ms ease;\n  -webkit-app-region: no-drag;\n}\n\n.dbs-startup-skip:hover {\n  background: rgba(20, 24, 32, 0.7);\n  border-color: rgba(255, 255, 255, 0.5);\n}\n\n.dbs-startup-skip:disabled {\n  opacity: 0.5;\n  cursor: default;\n}\n\n/* ---------- Mode B background layer + controls ---------- */\n\n.dbs-startup-layer {\n  position: absolute;\n  inset: 0;\n  z-index: 3;\n  overflow: hidden;\n  background: #05070b;\n  pointer-events: none;\n  opacity: 0;\n  transition-property: opacity;\n  transition-timing-function: ease;\n}\n\n.dbs-startup-controls {\n  position: fixed;\n  top: 18px;\n  left: 50%;\n  right: auto;\n  transform: translateX(-50%);\n  z-index: 2147483647;\n  pointer-events: none;\n  -webkit-app-region: no-drag;\n}\n\n.dbs-startup-controls .dbs-startup-skip {\n  position: static;\n  transform: none;\n  pointer-events: auto;\n}\n\n/* ---------- startup settings page ---------- */\n\n.dbs-startup-page {\n  max-width: 900px;\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n\n.dbs-startup-title-row {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 14px;\n  margin-bottom: 8px;\n}\n\n.dbs-startup-title-row h3 {\n  margin-bottom: 3px;\n}\n\n.dbs-startup-grid {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 8px 16px;\n  align-items: end;\n}\n\n.dbs-startup-grid .dbs-field {\n  margin-bottom: 4px;\n}\n\n.dbs-startup-list-head {\n  display: flex;\n  align-items: flex-start;\n  justify-content: space-between;\n  gap: 12px;\n  margin-bottom: 8px;\n}\n\n.dbs-startup-list-head h3 {\n  margin-bottom: 3px;\n}\n\n.dbs-startup-add-row {\n  display: flex;\n  align-items: center;\n  gap: 10px;\n  margin-bottom: 8px;\n}\n\n.dbs-startup-add-row .dbs-select {\n  max-width: 340px;\n}\n\n.dbs-startup-list {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n}\n\n.dbs-startup-row {\n  display: flex;\n  align-items: center;\n  gap: 9px;\n  padding: 6px 7px;\n  border: 1px solid var(--dsw-alias-border-l1);\n  border-radius: 9px;\n  background: var(--dsw-alias-bg-layer-2);\n}\n\n.dbs-startup-row.is-disabled {\n  opacity: 0.62;\n}\n\n.dbs-startup-row.is-missing {\n  border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 36%, transparent);\n}\n\n.dbs-startup-index {\n  width: 22px;\n  flex: none;\n  text-align: center;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n  font-variant-numeric: tabular-nums;\n}\n\n.dbs-startup-thumb {\n  width: 72px;\n  height: 42px;\n  border-radius: 6px;\n  flex: none;\n}\n\n.dbs-startup-main {\n  flex: 1;\n  min-width: 0;\n}\n\n.dbs-startup-name {\n  display: flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 11.5px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n\n.dbs-startup-meta {\n  display: flex;\n  gap: 9px;\n  color: var(--dsw-alias-label-secondary);\n  font-size: 10px;\n}\n\n.dbs-startup-row-actions {\n  display: flex;\n  align-items: center;\n  gap: 2px;\n  flex: none;\n}\n\n.dbs-rowline-compact {\n  margin: 0 7px 0 0;\n  font-size: 10.5px;\n  gap: 6px;\n}\n\n.dbs-rowline-compact .dbs-toggle-knob {\n  width: 26px;\n  height: 15px;\n}\n\n.dbs-rowline-compact .dbs-toggle-knob::after {\n  width: 11px;\n  height: 11px;\n}\n\n.dbs-rowline-compact .dbs-toggle.is-on .dbs-toggle-knob::after {\n  transform: translateX(11px);\n}\n\n/* ---------- responsive ---------- */\n\n@media (max-width: 1180px) {\n  .dbs-inspector-wrap {\n    display: none;\n  }\n\n  .dbs-panel.is-inspector-open .dbs-inspector-wrap {\n    display: block;\n    position: absolute;\n    right: 0;\n    top: 0;\n    bottom: 0;\n    width: min(360px, 92%);\n    z-index: 20;\n    box-shadow: -18px 0 40px rgba(0, 0, 0, 0.3);\n  }\n}\n\n@media (min-width: 1181px) {\n  .dbs-inspector-close {\n    display: none;\n  }\n}\n\n@media (max-width: 900px) {\n  .dbs-nav {\n    width: 54px;\n    padding: 10px 6px;\n  }\n\n  .dbs-startup-grid {\n    grid-template-columns: minmax(0, 1fr);\n  }\n\n  .dbs-startup-row {\n    flex-wrap: wrap;\n  }\n\n  .dbs-startup-row-actions {\n    width: 100%;\n    justify-content: flex-end;\n  }\n\n  .dbs-startup-add-row {\n    align-items: stretch;\n    flex-direction: column;\n  }\n\n  .dbs-startup-add-row .dbs-select {\n    max-width: none;\n  }\n\n  .dbs-nav-item {\n    justify-content: center;\n    padding: 0;\n  }\n\n  .dbs-nav-item span,\n  .dbs-nav-foot {\n    display: none;\n  }\n\n  .dbs-header {\n    padding: 10px 12px;\n  }\n\n  .dbs-brand-sub,\n  .dbs-mode-chip {\n    display: none;\n  }\n\n  .dbs-main {\n    padding: 12px 12px 24px;\n  }\n\n  .dbs-grid {\n    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));\n  }\n\n  .dbs-playlists {\n    flex-direction: column;\n  }\n\n  .dbs-scheme-list {\n    width: 100%;\n    max-height: 150px;\n    overflow: auto;\n    border-right: 0;\n    border-bottom: 1px solid var(--dsw-alias-border-l1);\n    padding-right: 0;\n    padding-bottom: 8px;\n  }\n\n  .dbs-scheme {\n    flex-direction: row;\n    align-items: center;\n    gap: 8px;\n  }\n\n  .dbs-scheme-name {\n    width: auto;\n  }\n\n  .dbs-scheme-dot {\n    position: static;\n    margin-left: auto;\n  }\n\n  .dbs-playlist-options {\n    grid-template-columns: minmax(0, 1fr) auto;\n  }\n\n  .dbs-playback {\n    flex-direction: column;\n    align-items: stretch;\n    gap: 8px;\n  }\n\n  .dbs-item {\n    flex-wrap: wrap;\n  }\n\n  .dbs-item-dwell {\n    margin-left: 31px;\n  }\n\n  .dbs-quickbar {\n    bottom: 14px;\n    left: 50%;\n    transform: translateX(-50%);\n  }\n}\n\r\n"
/* ---- 00-core.js ---- */
/* =========================================================================
 * 00-core — constants, tiny UI helpers, API client, shared defaults.
 * This file is concatenated into the browser factory by build.mjs.
 * ========================================================================= */

const API_BASE = '/dsh-background-studio'
const PANEL_KEY = 'dbs'
const PANEL_TITLE = '背景工作室'
const SETTINGS_VERSION = 1

const h = React.createElement
const cx = (...values) => values.filter(Boolean).join(' ')
const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
const num = (value, fallback) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback)
const str = (value, fallback = '') => (typeof value === 'string' ? value : fallback)

function formatBytes(bytes) {
  const value = num(bytes, 0)
  if (value < 1024) return `${value} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let size = value / 1024
  let index = 0
  while (size >= 1024 && index < units.length - 1) {
    size /= 1024
    index += 1
  }
  return `${size >= 100 ? size.toFixed(0) : size.toFixed(1)} ${units[index]}`
}

function formatDuration(seconds) {
  const value = num(seconds, 0)
  if (!Number.isFinite(value) || value <= 0) return '—'
  const total = Math.round(value)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const rest = total % 60
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
  return `${minutes}:${String(rest).padStart(2, '0')}`
}

function formatClock(seconds) {
  const value = Math.max(0, num(seconds, 0))
  const minutes = Math.floor(value / 60)
  const rest = Math.floor(value % 60)
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`
}

function basename(filePath) {
  const text = str(filePath)
  const index = Math.max(text.lastIndexOf('/'), text.lastIndexOf('\\'))
  return index >= 0 ? text.slice(index + 1) : text
}

function kindText(kind) {
  if (kind === 'video') return '视频'
  if (kind === 'gif') return 'GIF'
  if (kind === 'image') return '图片'
  if (kind === 'audio') return '音频'
  return '未知'
}

function isVideoAsset(asset) {
  return asset?.kind === 'video'
}

function isAnimatedAsset(asset) {
  return asset?.kind === 'video' || asset?.kind === 'gif'
}

function defaultAssetSettings(kind) {
  return {
    opacity: 1,
    display: 'cover',
    scale: 1,
    loop: true,
    audioMode: kind === 'video' ? 'video' : 'mute',
    audioId: null,
    audioIds: [],
    audioIndex: 0,
    audioVolume: 1,
    videoVolume: 1,
    audioLoop: true,
    audioStartMs: 0,
    audioEndAction: 'none',
    fadeMs: 420,
    dwellMode: 'default',
    dwellSeconds: 30,
  }
}

function defaultStartupAnimation() {
  return {
    enabled: false,
    mode: 'fullscreen',
    trigger: 'everyLaunch',
    items: [],
    durationMode: 'media',
    customSeconds: 8,
    display: 'cover',
    fadeInMs: 500,
    fadeOutMs: 700,
    holdMs: 0,
    skip: true,
    audio: { mode: 'video', audioId: null, volume: 1 },
    firstRunDone: false,
  }
}

function normalizeStartupAnimation(raw) {
  const base = defaultStartupAnimation()
  if (!raw || typeof raw !== 'object') return base
  const items = []
  const seen = new Set()
  const source = Array.isArray(raw.items) ? raw.items : []
  for (let index = 0; index < source.length; index += 1) {
    const item = source[index]
    if (!item || typeof item !== 'object' || typeof item.assetId !== 'string') continue
    const id = str(item.id) || `${item.assetId}-${index}`
    if (seen.has(id)) continue
    seen.add(id)
    items.push({
      id,
      assetId: item.assetId,
      enabled: item.enabled !== false,
    })
  }
  const audio = raw.audio && typeof raw.audio === 'object' ? raw.audio : {}
  const modes = new Set(['video', 'mute', 'external'])
  const audioMode = modes.has(audio.mode) ? audio.mode : base.audio.mode
  return {
    enabled: raw.enabled === true,
    mode: raw.mode === 'background' ? 'background' : 'fullscreen',
    trigger: ['everyLaunch', 'firstLaunch', 'random'].includes(raw.trigger) ? raw.trigger : 'everyLaunch',
    items,
    durationMode: raw.durationMode === 'custom' ? 'custom' : 'media',
    customSeconds: clamp(num(raw.customSeconds, base.customSeconds), 1, 300),
    display: ['cover', 'contain', 'center'].includes(raw.display) ? raw.display : 'cover',
    fadeInMs: clamp(num(raw.fadeInMs, base.fadeInMs), 0, 5000),
    fadeOutMs: clamp(num(raw.fadeOutMs, base.fadeOutMs), 0, 5000),
    holdMs: clamp(num(raw.holdMs, base.holdMs), 0, 10000),
    skip: raw.skip !== false,
    audio: {
      mode: audioMode,
      audioId: str(audio.audioId) || null,
      volume: clamp(num(audio.volume, 1), 0, 1),
    },
    firstRunDone: raw.firstRunDone === true,
  }
}

function defaultClientState() {
  return {
    schemaVersion: SETTINGS_VERSION,
    assets: [],
    audio: [],
    assetSettings: {},
    playlists: [],
    startupAnimation: defaultStartupAnimation(),
    global: {
      defaultDwellSeconds: 30,
      importMode: 'reference',
      surface: { dark: 0.34, light: 0.62 },
      startup: { restore: true, autoPlay: true },
      audio: { muted: false, masterVolume: 1 },
      fadeMs: 420,
      libraryView: 'grid',
    },
    runtime: {
      mode: 'single',
      assetId: null,
      playlistId: null,
      itemIndex: 0,
      playing: false,
      updatedAt: 0,
    },
  }
}

function normalizeSettings(raw, kind) {
  const base = defaultAssetSettings(kind)
  if (!raw || typeof raw !== 'object') return base
  const displays = new Set(['cover', 'contain', 'center', 'original', 'custom'])
  const modes = new Set(['video', 'external', 'mix', 'mute'])
  const dwellModes = new Set(['default', 'fixed', 'mediaEnd'])
  const audioIds = Array.isArray(raw.audioIds)
    ? Array.from(new Set(raw.audioIds.filter((entry) => typeof entry === 'string' && entry.length > 0)))
    : []
  const legacyAudioId = str(raw.audioId) || null
  if (legacyAudioId && !audioIds.includes(legacyAudioId)) audioIds.unshift(legacyAudioId)
  const audioIndex = Math.min(Math.max(0, Math.trunc(num(raw.audioIndex, 0))), Math.max(0, audioIds.length - 1))
  return {
    opacity: clamp(num(raw.opacity, base.opacity), 0, 1),
    display: displays.has(raw.display) ? raw.display : base.display,
    scale: clamp(num(raw.scale, 1), 0.1, 4),
    loop: raw.loop !== false,
    audioMode: modes.has(raw.audioMode) ? raw.audioMode : base.audioMode,
    audioId: audioIds[audioIndex] ?? legacyAudioId,
    audioIds,
    audioIndex,
    audioVolume: clamp(num(raw.audioVolume, 1), 0, 1),
    videoVolume: clamp(num(raw.videoVolume, 1), 0, 1),
    audioLoop: raw.audioLoop !== false,
    audioStartMs: clamp(num(raw.audioStartMs, 0), 0, 24 * 60 * 60 * 1000),
    audioEndAction: raw.audioEndAction === 'next' ? 'next' : raw.audioEndAction === 'nextTrack' && audioIds.length > 1 ? 'nextTrack' : 'none',
    fadeMs: clamp(num(raw.fadeMs, 420), 0, 5000),
    dwellMode: dwellModes.has(raw.dwellMode) ? raw.dwellMode : 'default',
    dwellSeconds: clamp(num(raw.dwellSeconds, 30), 1, 24 * 60 * 60),
  }
}

function normalizeClientState(raw) {
  const base = defaultClientState()
  if (!raw || typeof raw !== 'object') return base
  const assets = Array.isArray(raw.assets) ? raw.assets.filter((asset) => asset && typeof asset.id === 'string') : []
  const audio = Array.isArray(raw.audio) ? raw.audio.filter((track) => track && typeof track.id === 'string') : []
  const settings = {}
  for (const asset of assets) {
    settings[asset.id] = normalizeSettings(raw.assetSettings?.[asset.id], asset.kind)
  }
  return {
    schemaVersion: SETTINGS_VERSION,
    assets: assets.map((asset) => ({
      ...asset,
      missing: asset.missing === true,
      favorite: asset.favorite === true,
      thumb: asset.thumb === true,
      hasAudio: asset.hasAudio === true ? true : asset.hasAudio === false ? false : null,
      width: num(asset.width, 0),
      height: num(asset.height, 0),
      duration: num(asset.duration, 0),
      fps: num(asset.fps, 0),
      size: num(asset.size, 0),
      thumbVersion: num(asset.thumbVersion, 0),
    })),
    audio: audio.map((track) => ({
      ...track,
      missing: track.missing === true,
      duration: num(track.duration, 0),
      size: num(track.size, 0),
    })),
    assetSettings: settings,
    playlists: Array.isArray(raw.playlists)
      ? raw.playlists
          .filter((playlist) => playlist && typeof playlist.id === 'string')
          .map((playlist) => ({
            ...playlist,
            items: Array.isArray(playlist.items) ? playlist.items.filter((item) => item && typeof item.assetId === 'string') : [],
            shuffle: ['off', 'random', 'noRepeat'].includes(playlist.shuffle) ? playlist.shuffle : 'off',
            loop: playlist.loop !== false,
            favorite: playlist.favorite === true,
          }))
      : [],
    startupAnimation: normalizeStartupAnimation(raw.startupAnimation),
    global: {
      ...base.global,
      ...(raw.global ?? {}),
      surface: { ...base.global.surface, ...(raw.global?.surface ?? {}) },
      startup: { ...base.global.startup, ...(raw.global?.startup ?? {}) },
      audio: { ...base.global.audio, ...(raw.global?.audio ?? {}) },
    },
    runtime: { ...base.runtime, ...(raw.runtime ?? {}) },
  }
}

async function apiRequest(endpoint, options) {
  const response = await fetch(`${API_BASE}${endpoint}`, options)
  const text = await response.text()
  let body = text
  try {
    body = text.length > 0 ? JSON.parse(text) : null
  } catch {
    /* keep text */
  }
  if (!response.ok) {
    const message = body && typeof body === 'object' ? body.error : String(body || response.statusText)
    throw new Error(message || `HTTP ${response.status}`)
  }
  return body
}

async function apiLoadState() {
  const body = await apiRequest('/api/state')
  return {
    state: normalizeClientState(body?.state),
    warnings: Array.isArray(body?.warnings) ? body.warnings : [],
    root: body?.root,
    bootId: typeof body?.bootId === 'string' ? body.bootId : '',
  }
}

async function apiSaveState(state) {
  return apiRequest('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(state),
  })
}

async function apiImport(paths, mode, kind, onEvent) {
  const response = await fetch(`${API_BASE}/api/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paths, mode, kind }),
  })
  if (!response.ok) {
    const text = await response.text()
    let message = text
    try {
      message = JSON.parse(text)?.error ?? text
    } catch {
      /* keep text */
    }
    throw new Error(message || `HTTP ${response.status}`)
  }
  if (!response.body) throw new Error('当前环境不支持流式导入')
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  const events = []
  for (;;) {
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    let index = buffer.indexOf('\n')
    while (index >= 0) {
      const line = buffer.slice(0, index).trim()
      buffer = buffer.slice(index + 1)
      if (line.length > 0) {
        try {
          const event = JSON.parse(line)
          events.push(event)
          onEvent?.(event)
        } catch {
          /* tolerate a partial line */
        }
      }
      index = buffer.indexOf('\n')
    }
  }
  const tail = buffer.trim()
  if (tail.length > 0) {
    try {
      const event = JSON.parse(tail)
      events.push(event)
      onEvent?.(event)
    } catch {
      /* ignore */
    }
  }
  return events
}

async function apiRelocate(id, filePath) {
  return apiRequest('/api/relocate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, path: filePath }),
  })
}

async function apiUploadThumb(id, blob) {
  return apiRequest(`/api/thumb?id=${encodeURIComponent(id)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'image/webp' },
    body: blob,
  })
}

function mediaUrl(id) {
  return `${API_BASE}/media/${id}`
}

function audioUrl(id) {
  return `${API_BASE}/audio/${id}`
}

function thumbUrl(asset) {
  if (!asset?.thumb) return null
  return `${API_BASE}/thumb/${asset.id}?v=${asset.thumbVersion || 0}`
}

/* -------------------------------------------------------------------------
 * Icons — original line icons, sized by CSS.
 * ---------------------------------------------------------------------- */

function svgIcon(viewBox, children, extra) {
  return h('svg', {
    viewBox,
    width: '1em',
    height: '1em',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
    focusable: false,
    ...(extra || {}),
  }, ...children)
}

function IconBackground() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 3 }),
    h('circle', { key: 'c', cx: 9, cy: 9, r: 1.6 }),
    h('path', { key: 'p', d: 'M4 17l5-5 4 4 3-3 4 4' }),
  ])
}

function IconImage() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 2.5 }),
    h('circle', { key: 'c', cx: 8.5, cy: 9, r: 1.5 }),
    h('path', { key: 'p', d: 'M4 17l5-5 4 4 3-3 4 4' }),
  ])
}

function IconFilm() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'r', x: 3, y: 4, width: 18, height: 16, rx: 2.5 }),
    h('path', { key: 'a', d: 'M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4' }),
  ])
}

function IconMusic() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M9 18V6l10-2v12' }),
    h('circle', { key: 'b', cx: 6, cy: 18, r: 3 }),
    h('circle', { key: 'c', cx: 16, cy: 16, r: 3 }),
  ])
}

function IconStar({ filled }) {
  return h('svg', {
    viewBox: '0 0 24 24',
    width: '1em',
    height: '1em',
    fill: filled ? 'currentColor' : 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }, h('path', { d: 'M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.2-4.1 5.8-.8z' }))
}

function IconPlus() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M12 5v14M5 12h14' })])
}

function IconTrash() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13M10 11v6M14 11v6' }),
  ])
}

function IconPlay() {
  return h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d: 'M8 5.5v13l11-6.5z' }))
}

function IconPause() {
  return h('svg', { viewBox: '0 0 24 24', width: '1em', height: '1em', fill: 'currentColor', 'aria-hidden': true },
    h('path', { d: 'M7 5h4v14H7zM13 5h4v14h-4z' }))
}

function IconPrev() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M18 6l-8 6 8 6zM6 5v14' })])
}

function IconNext() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 6l8 6-8 6zM18 5v14' })])
}

function IconVolume() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 9h4l5-4v14l-5-4H4z' }),
    h('path', { key: 'b', d: 'M16 8.5a5 5 0 010 7M18.5 6a8.5 8.5 0 010 12' }),
  ])
}

function IconMute() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M4 9h4l5-4v14l-5-4H4z' }),
    h('path', { key: 'b', d: 'M16 9l5 6M21 9l-5 6' }),
  ])
}

function IconGrid() {
  return svgIcon('0 0 24 24', [
    h('rect', { key: 'a', x: 4, y: 4, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'b', x: 13, y: 4, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'c', x: 4, y: 13, width: 7, height: 7, rx: 1.5 }),
    h('rect', { key: 'd', x: 13, y: 13, width: 7, height: 7, rx: 1.5 }),
  ])
}

function IconList() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M5 7h14M5 12h14M5 17h14' }),
  ])
}

function IconSearch() {
  return svgIcon('0 0 24 24', [
    h('circle', { key: 'a', cx: 11, cy: 11, r: 6 }),
    h('path', { key: 'b', d: 'M16 16l4 4' }),
  ])
}

function IconSettings() {
  return svgIcon('0 0 24 24', [
    h('circle', { key: 'a', cx: 12, cy: 12, r: 3 }),
    h('path', { key: 'b', d: 'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1' }),
  ])
}

function IconRefresh() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M20 11a8 8 0 10-2.3 5.7' }),
    h('path', { key: 'b', d: 'M20 5v6h-6' }),
  ])
}

function IconFolder() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z' }),
  ])
}

function IconClose() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 6l12 12M18 6L6 18' })])
}

function IconWarning() {
  return svgIcon('0 0 24 24', [
    h('path', { key: 'a', d: 'M12 4l9 16H3z' }),
    h('path', { key: 'b', d: 'M12 9v5M12 17h.01' }),
  ])
}

function IconCheck() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M4 12l5 5L20 6' })])
}

function IconChevron({ down }) {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: down ? 'M6 9l6 6 6-6' : 'M9 6l6 6-6 6' })])
}

function IconUp() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 14l6-6 6 6' })])
}

function IconDown() {
  return svgIcon('0 0 24 24', [h('path', { key: 'a', d: 'M6 10l6 6 6-6' })])
}

/* ---- 10-studio.js ---- */
/* =========================================================================
 * 10-studio — the single long-lived controller. It owns the authoritative
 * client state, persistence, imports and the bridge to renderer/audio/playlist.
 * ========================================================================= */

let activeStudio = null

function useStudio() {
  const [, force] = React.useState(0)
  React.useEffect(() => {
    const studio = activeStudio
    if (!studio) return undefined
    return studio.subscribe(() => force((value) => value + 1))
  }, [])
  return activeStudio
}

function useTick(ms = 250) {
  const [, force] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => force((value) => value + 1), ms)
    return () => clearInterval(timer)
  }, [ms])
}

function newId() {
  try {
    return crypto.randomUUID()
  } catch {
    return `dbs-${Date.now()}-${Math.random().toString(16).slice(2)}`
  }
}

class Studio {
  constructor(ctx) {
    this.ctx = ctx
    this.state = defaultClientState()
    this.ready = false
    this.error = null
    this.warnings = []
    this.root = null
    this.bootId = ''
    this.timeline = { boot: Math.round(performance.now()) }
    this.listeners = new Set()
    this.toasts = []
    this.toastSeq = 0
    this.importing = false
    this.importText = ''
    this.importProgress = null
    this.lastImportedId = null
    this.selectedAssetId = null
    this.audioPreviewId = null
    this.detailsPending = new Set()
    this.saving = false
    this.dirty = false
    this.saveTimer = 0
    this.saveChain = Promise.resolve()
    this.renderer = null
    this.audio = null
    this.playlist = null
    this.startup = null
    this.startupPreview = null
    this.backgroundReady = false
    this.injectedSuppressed = false
    this.deferBackgroundVideo = false
    this.deferredTimer = 0
    this.deferredStartTimer = 0
    this.deferredStarted = false
    this.deferredResumeRequested = false
    this.deferredResumed = false
    this.onInjectedStart = () => this.applyInjectedSuppression()
    this.onInjectedSkip = () => this.startDeferredBackground()
    this.onInjectedEnding = () => this.startDeferredBackground()
    this.onInjectedEnd = () => {
      this.startDeferredBackground()
      this.releaseInjectedSuppression()
      this.resumeDeferredBackground()
    }
  }

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  emit() {
    for (const listener of this.listeners) {
      try {
        listener()
      } catch {
        /* a broken listener must not break the controller */
      }
    }
  }

  toast(kind, message, ttl = 4600) {
    const id = ++this.toastSeq
    this.toasts.push({ id, kind, message })
    this.emit()
    window.setTimeout(() => {
      this.toasts = this.toasts.filter((entry) => entry.id !== id)
      this.emit()
    }, ttl)
  }

  dismissToast(id) {
    this.toasts = this.toasts.filter((entry) => entry.id !== id)
    this.emit()
  }

  assetById(id) {
    return this.state.assets.find((asset) => asset.id === id) ?? null
  }

  audioById(id) {
    return this.state.audio.find((track) => track.id === id) ?? null
  }

  playlistById(id) {
    return this.state.playlists.find((playlist) => playlist.id === id) ?? null
  }

  settingsFor(id) {
    const asset = this.assetById(id)
    if (!asset) return defaultAssetSettings('image')
    if (!this.state.assetSettings[id]) {
      this.state.assetSettings[id] = defaultAssetSettings(asset.kind)
    }
    return this.state.assetSettings[id]
  }

  currentAsset() {
    if (!this.ready) return null
    if (this.state.runtime.mode === 'playlist') {
      return this.playlist?.currentAsset() ?? null
    }
    return this.assetById(this.state.runtime.assetId)
  }

  currentSettings() {
    const asset = this.currentAsset()
    return asset ? this.settingsFor(asset.id) : null
  }

  isPlaying() {
    return this.state.runtime.playing === true
  }

  markTimeline(name, detail = '') {
    this.timeline[name] = Math.round(performance.now())
    if (detail) this.timeline[`${name}:detail`] = detail
    try {
      const lifecycle = window.__DBS_LIFECYCLE__ || (window.__DBS_LIFECYCLE__ = [])
      lifecycle.push({ name, t: this.timeline[name], detail: detail || undefined })
    } catch {
      /* logging only */
    }
    console.info(`[dbs ${this.timeline[name]}ms] ${name}${detail ? ` — ${detail}` : ''}`)
  }

  startupPerf(name, detail = '') {
    const t = Math.round(performance.now())
    const suffix = ` t=${t}ms${detail ? ` ${detail}` : ''}`
    console.info(`[StartupPerf] ${name}${suffix}`)
    console.info(`[Startup] ${name}${suffix}`)
    this.timeline[`StartupPerf:${name}`] = t
    try {
      const lifecycle = window.__DBS_LIFECYCLE__ || (window.__DBS_LIFECYCLE__ = [])
      lifecycle.push({ name: `StartupPerf:${name}`, t, detail: detail || undefined })
    } catch {
      /* logging only */
    }
  }

  /** The injected startup overlay can outlive this bundle's initial mount. */
  applyInjectedSuppression() {
    if (this.injectedSuppressed || window.__DBS_BOOT__?.active !== true) return
    this.injectedSuppressed = true
    this.audio?.beginStartupSuppression()
    this.markTimeline('startup-suppression-on')
  }

  releaseInjectedSuppression() {
    if (!this.injectedSuppressed) return
    this.injectedSuppressed = false
    this.audio?.endStartupSuppression()
    this.markTimeline('startup-suppression-off')
  }

  notifyBackgroundReady(ok, detail = '') {
    this.backgroundReady = true
    this.markTimeline('background-ready', ok === false ? 'failed' : detail)
    this.startupPerf('background-ready', ok === false ? 'failed' : detail)
    if (this.deferBackgroundVideo) this.armDeferredBackgroundTimer()
    if (this.deferredResumeRequested) this.resumeDeferredBackground()
    try {
      window.dispatchEvent(new CustomEvent('dbs:background-ready', {
        detail: { ok: ok !== false, at: Date.now() },
      }))
    } catch {
      /* CustomEvent is always available in the client renderer */
    }
  }

  currentBackgroundKind() {
    const runtime = this.state.runtime
    if (runtime.mode === 'playlist') {
      const playlist = this.playlistById(runtime.playlistId)
      const item = playlist?.items?.[runtime.itemIndex]
      return item ? this.assetById(item.assetId)?.kind ?? null : null
    }
    return runtime.assetId ? this.assetById(runtime.assetId)?.kind ?? null : null
  }

  /**
   * When a 4K/HD startup video is playing, decoding the normal video background
   * at the same time steals GPU/decoder time from the first seconds. The
   * background is still loaded and its poster shown, but playback is held until
   * the last part of the startup (or an early skip), so the first frames belong
   * to the startup only.
   */
  prepareDeferredBackground() {
    const boot = window.__DBS_BOOT__
    this.deferBackgroundVideo = boot?.active === true &&
      boot?.item?.kind === 'video' &&
      this.currentBackgroundKind() === 'video'
    if (this.deferBackgroundVideo) this.startupPerf('background-video-deferred')
  }

  armDeferredBackgroundStart() {
    if (!this.deferBackgroundVideo || this.deferredStarted || this.deferredStartTimer) return
    const boot = window.__DBS_BOOT__
    const now = performance.now()
    const endsAt = Number(boot?.endsAt)
    if (!Number.isFinite(endsAt) || endsAt <= 0) {
      // Studio.boot runs before the startup's first frame, so endsAt may not be
      // known yet. Poll briefly instead of guessing an early time (which would
      // start the background decoder during the first seconds).
      this.deferredStartTimer = window.setTimeout(() => {
        this.deferredStartTimer = 0
        this.armDeferredBackgroundStart()
      }, 250)
      return
    }
    const leadMs = 900
    const delay = Math.max(0, endsAt - now - leadMs)
    this.deferredStartTimer = window.setTimeout(() => {
      this.deferredStartTimer = 0
      this.startDeferredBackground()
    }, delay)
  }

  startDeferredBackground() {
    if (!this.deferBackgroundVideo || this.deferredStarted) return
    this.deferredStarted = true
    if (this.deferredStartTimer) {
      window.clearTimeout(this.deferredStartTimer)
      this.deferredStartTimer = 0
    }
    this.startBackgroundRestore().catch(() => {})
  }

  startBackgroundRestore() {
    this.markTimeline('background-init-start')
    this.startupPerf('background-load-start', this.deferBackgroundVideo ? 'video deferred' : '')
    return this.restoreRuntime()
      .then(() => {
        this.markTimeline('background-restored')
        this.notifyBackgroundReady(true, 'restored')
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : String(error)
        this.toast('error', `恢复上次背景失败：${message}`)
        this.notifyBackgroundReady(false, message)
      })
  }

  armDeferredBackgroundTimer() {
    if (!this.deferBackgroundVideo || this.deferredResumed || this.deferredTimer) return
    const boot = window.__DBS_BOOT__
    const now = performance.now()
    const endsAt = Number(boot?.endsAt)
    const leadMs = 900
    const delay = Number.isFinite(endsAt) && endsAt > now
      ? Math.max(0, endsAt - now - leadMs)
      : 2500
    this.deferredTimer = window.setTimeout(() => {
      this.deferredTimer = 0
      this.resumeDeferredBackground()
    }, delay)
  }

  resumeDeferredBackground() {
    if (!this.deferBackgroundVideo || this.deferredResumed) return
    if (!this.backgroundReady) {
      this.deferredResumeRequested = true
      return
    }
    this.deferredResumed = true
    this.deferBackgroundVideo = false
    this.deferredResumeRequested = false
    if (this.deferredTimer) {
      window.clearTimeout(this.deferredTimer)
      this.deferredTimer = 0
    }
    const runtime = this.state.runtime
    if (runtime.mode === 'playlist' && this.playlist?.currentItem()) {
      this.playlist.resume()
      return
    }
    if (this.currentAsset()) {
      this.renderer?.resume()
      this.audio?.resumeExternal()
      if (!this.state.runtime.playing) {
        this.state.runtime.playing = true
        this.state.runtime.updatedAt = Date.now()
        this.scheduleSave()
        this.emit()
      }
    }
  }

  async boot() {
    try {
      const loaded = await apiLoadState()
      this.state = loaded.state
      this.warnings = loaded.warnings ?? []
      this.root = loaded.root ?? ''
      this.bootId = loaded.bootId ?? ''
      if (window.__DBS_BOOT__?.played === true) this.state.startupAnimation.firstRunDone = true
      this.markTimeline('state-loaded')
      this.markTimeline('config-loaded')
    } catch (error) {
      this.error = `无法读取背景配置：${error instanceof Error ? error.message : String(error)}`
      this.state = defaultClientState()
      this.markTimeline('state-failed', String(error))
    }

    this.renderer = new Renderer(this)
    this.renderer.mount()
    this.markTimeline('renderer-mounted')
    this.audio = new AudioGraph(this)
    this.playlist = new PlaylistEngine(this)
    this.startup = new StartupController(this)
    this.startupPreview = new StartupController(this, { kind: 'preview' })
    window.addEventListener('dbs:startup-started', this.onInjectedStart)
    window.addEventListener('dbs:startup-ended', this.onInjectedEnd)
    window.addEventListener('dbs:startup-skip', this.onInjectedSkip)
    window.addEventListener('dbs:startup-ending', this.onInjectedEnding)
    this.applyInjectedSuppression()
    this.ready = true
    this.prepareDeferredBackground()
    this.applyGlobalSettings()
    this.emit()

    if (this.error) this.toast('error', this.error)
    for (const warning of this.warnings.slice(0, 3)) this.toast('warning', warning)

    window.addEventListener('pagehide', this.onPageHide)
    const plan = this.startup.prepare()
    this.markTimeline('startup-plan', plan ? `${plan.asset.kind}:${plan.item.id}` : 'none')
    if (this.deferBackgroundVideo) {
      // Do not even create the background <video> yet. Its decoder would
      // otherwise contend with the startup video during the first seconds.
      // The poster/overlay is already covering the screen; background restore
      // starts near the end (or on skip) and is awaited before the reveal.
      this.markTimeline('background-deferred')
      const boot = window.__DBS_BOOT__
      if (boot?.skipped === true || boot?.ended === true) this.startDeferredBackground()
      else this.armDeferredBackgroundStart()
    } else if (plan) {
      const restorePromise = this.startBackgroundRestore()
      try {
        this.startup.begin(plan)
        this.markTimeline('startup-begun')
      } catch (error) {
        this.toast('error', `启动动画初始化失败：${error instanceof Error ? error.message : String(error)}`)
        this.audio.endStartupSuppression()
      }
      this.startup.setBackgroundPromise(restorePromise)
    } else {
      await this.startBackgroundRestore()
    }
    for (const track of this.state.audio.filter((entry) => entry.duration <= 0 && !entry.missing)) {
      this.enrichAudio(track).catch(() => {})
    }
    this.emit()
  }

  onPageHide = () => {
    if (!this.dirty) return
    try {
      const body = JSON.stringify(this.serialize())
      fetch(`${API_BASE}/api/state`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
      }).catch(() => {})
    } catch {
      /* best effort */
    }
  }

  serialize() {
    return {
      schemaVersion: SETTINGS_VERSION,
      assets: this.state.assets,
      audio: this.state.audio,
      assetSettings: this.state.assetSettings,
      playlists: this.state.playlists,
      startupAnimation: this.state.startupAnimation,
      global: this.state.global,
      runtime: this.state.runtime,
    }
  }

  scheduleSave(delay = 420) {
    this.dirty = true
    if (this.saveTimer) window.clearTimeout(this.saveTimer)
    this.saveTimer = window.setTimeout(() => {
      this.saveTimer = 0
      this.saveNow()
    }, delay)
  }

  async saveNow() {
    if (!this.ready) return
    this.dirty = false
    this.saving = true
    this.saveChain = (this.saveChain ?? Promise.resolve()).then(async () => {
      try {
        await apiSaveState(this.serialize())
        this.error = null
      } catch (error) {
        this.error = `保存失败：${error instanceof Error ? error.message : String(error)}`
        this.toast('error', this.error)
        this.dirty = true
      }
    })
    try {
      await this.saveChain
    } finally {
      this.saving = false
      if (this.dirty && this.ready) this.scheduleSave(1200)
    }
  }

  applyGlobalSettings() {
    if (!this.renderer) return
    this.renderer.setSurface(this.state.global.surface)
    if (this.audio) {
      this.audio.setMasterVolume(this.state.global.audio.masterVolume)
      this.audio.setMuted(this.state.global.audio.muted, { fadeMs: 120 })
    }
  }

  updateGlobal(patch) {
    const global = this.state.global
    this.state.global = {
      ...global,
      ...patch,
      surface: { ...global.surface, ...(patch.surface ?? {}) },
      startup: { ...global.startup, ...(patch.startup ?? {}) },
      audio: { ...global.audio, ...(patch.audio ?? {}) },
    }
    this.applyGlobalSettings()
    if (this.currentAsset()) this.renderer.setOpacity(this.settingsFor(this.currentAsset().id).opacity)
    this.scheduleSave()
    this.emit()
  }

  updateAssetSettings(id, patch) {
    const asset = this.assetById(id)
    if (!asset) return
    const settings = this.settingsFor(id)
    Object.assign(settings, patch)
    if (this.currentAsset()?.id === id) {
      if ('opacity' in patch) this.renderer.setOpacity(settings.opacity)
      if ('display' in patch || 'scale' in patch) this.renderer.setDisplay(settings)
      if ('loop' in patch) this.renderer.setLoop(settings.loop)
      if ('audioMode' in patch || 'audioId' in patch || 'audioVolume' in patch || 'videoVolume' in patch ||
          'audioLoop' in patch || 'audioStartMs' in patch || 'fadeMs' in patch || 'audioEndAction' in patch) {
        this.audio.applyForAsset(asset, settings, this.renderer.currentVideo)
      }
    }
    if (patch.dwellMode !== undefined || patch.dwellSeconds !== undefined) {
      if (this.state.runtime.mode === 'playlist' && this.currentAsset()?.id === id) {
        this.playlist.rescheduleDwell()
      }
    }
    this.scheduleSave()
    this.emit()
  }

  resetAssetSettings(id) {
    const asset = this.assetById(id)
    if (!asset) return
    this.state.assetSettings[id] = defaultAssetSettings(asset.kind)
    if (this.currentAsset()?.id === id) {
      this.renderer.setDisplay(this.settingsFor(id))
      this.renderer.setOpacity(1)
    }
    this.scheduleSave()
    this.emit()
  }

  bindAudio(assetId, audioId) {
    const settings = this.settingsFor(assetId)
    const ids = Array.isArray(settings.audioIds) ? settings.audioIds.slice() : []
    if (!ids.includes(audioId)) ids.push(audioId)
    settings.audioIds = ids
    settings.audioIndex = Math.max(0, ids.indexOf(audioId))
    settings.audioId = audioId
    const asset = this.assetById(assetId)
    if (asset && asset.kind !== 'video') settings.audioMode = 'external'
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  unbindAudio(assetId, audioId) {
    const settings = this.settingsFor(assetId)
    const ids = (settings.audioIds ?? []).filter((entry) => entry !== audioId)
    settings.audioIds = ids
    if (ids.length === 0) {
      settings.audioIndex = 0
      settings.audioId = null
      if (settings.audioMode === 'external' || settings.audioMode === 'mix') {
        settings.audioMode = this.assetById(assetId)?.kind === 'video' ? 'video' : 'mute'
      }
    } else {
      settings.audioIndex = Math.min(settings.audioIndex, ids.length - 1)
      settings.audioId = ids[settings.audioIndex]
    }
    if (ids.length < 2 && settings.audioEndAction === 'nextTrack') settings.audioEndAction = 'none'
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  setBoundAudio(assetId, index) {
    const settings = this.settingsFor(assetId)
    const ids = settings.audioIds ?? []
    if (ids.length === 0) return
    settings.audioIndex = clamp(index, 0, ids.length - 1)
    settings.audioId = ids[settings.audioIndex]
    this.updateAssetSettings(assetId, { audioId: settings.audioId })
    this.emit()
  }

  handleExternalAudioEnded() {
    const asset = this.currentAsset()
    if (!asset) return
    const settings = this.settingsFor(asset.id)
    if (settings.audioEndAction === 'nextTrack' && (settings.audioIds?.length ?? 0) > 1) {
      const next = ((settings.audioIndex ?? 0) + 1) % settings.audioIds.length
      this.setBoundAudio(asset.id, next)
      return
    }
    this.playlist?.handleAudioEnded()
  }

  updateStartup(patch) {
    const current = this.state.startupAnimation
    this.state.startupAnimation = {
      ...current,
      ...patch,
      audio: { ...current.audio, ...(patch.audio ?? {}) },
    }
    this.scheduleSave()
    this.emit()
  }

  updateStartupItem(id, patch) {
    const item = this.state.startupAnimation.items.find((entry) => entry.id === id)
    if (!item) return
    Object.assign(item, patch)
    this.scheduleSave()
    this.emit()
  }

  addStartupItem(assetId) {
    const asset = this.assetById(assetId)
    if (!asset) return false
    if (asset.kind !== 'video' && asset.kind !== 'gif') {
      this.toast('warning', '启动动画目前只支持 MP4 视频和 GIF 动图。')
      return false
    }
    if (asset.missing) {
      this.toast('warning', '这个素材文件已丢失，无法加入启动动画。')
      return false
    }
    const items = this.state.startupAnimation.items
    if (items.some((item) => item.assetId === assetId)) {
      this.toast('warning', '这个素材已经在启动动画列表中。')
      return false
    }
    items.push({ id: newId(), assetId, enabled: true })
    this.scheduleSave()
    this.emit()
    return true
  }

  removeStartupItem(id) {
    const items = this.state.startupAnimation.items
    const index = items.findIndex((item) => item.id === id)
    if (index < 0) return
    items.splice(index, 1)
    this.startup?.stopIfItem(id)
    this.startupPreview?.stopIfItem(id)
    this.scheduleSave()
    this.emit()
  }

  moveStartupItem(id, targetIndex) {
    const items = this.state.startupAnimation.items
    const index = items.findIndex((item) => item.id === id)
    if (index < 0) return
    const [item] = items.splice(index, 1)
    items.splice(clamp(targetIndex, 0, items.length), 0, item)
    this.scheduleSave()
    this.emit()
  }

  async importStartupFiles(paths) {
    const records = await this.importFiles(paths, 'media', { autoApply: false })
    const usable = records.filter((record) => record && (record.kind === 'video' || record.kind === 'gif'))
    for (const record of usable) this.addStartupItem(record.id)
    if (usable.length === 0 && records.length > 0) {
      this.toast('warning', '这些素材不是 MP4/GIF，已放入背景库，但不能作为启动动画。')
    }
    return usable
  }

  previewStartup(itemId) {
    const item = this.state.startupAnimation.items.find((entry) => entry.id === itemId)
    if (!item) return false
    const asset = this.assetById(item.assetId)
    if (!asset || asset.missing) {
      this.toast('warning', '启动动画文件不可用。')
      return false
    }
    return this.startupPreview?.preview(item, asset) === true
  }

  resetStartupFirstRun() {
    this.state.startupAnimation.firstRunDone = false
    this.scheduleSave()
    this.emit()
    this.toast('success', '首次启动记录已重置，下次启动会再次播放。')
  }

  toggleFavorite(id) {
    const asset = this.assetById(id)
    if (!asset) return
    asset.favorite = !asset.favorite
    this.scheduleSave()
    this.emit()
  }

  renameAsset(id, name) {
    const asset = this.assetById(id)
    if (!asset) return
    const trimmed = str(name).trim()
    if (trimmed.length === 0) return
    asset.name = trimmed.slice(0, 120)
    this.scheduleSave()
    this.emit()
  }

  async importFiles(paths, kind = 'media', options = {}) {
    if (this.importing) return []
    const list = paths.filter((entry) => typeof entry === 'string' && entry.length > 0)
    if (list.length === 0) {
      this.toast('warning', '没有拿到文件路径。请从本机文件选择器或拖拽导入。')
      return []
    }
    this.importing = true
    this.importProgress = null
    this.importText = '准备导入…'
    this.emit()
    try {
      const mode = this.state.global.importMode
      const created = []
      const events = await apiImport(list, mode, kind, (event) => {
        if (event.type === 'file') {
          if (event.phase === 'start') {
            this.importText = `正在复制 ${event.name}…`
            this.importProgress = { name: event.name, copied: 0, total: event.total || 0 }
          } else if (event.phase === 'progress') {
            this.importText = `正在复制 ${event.name}…`
            this.importProgress = { name: event.name, copied: event.copied || 0, total: event.total || 0 }
          } else if (event.phase === 'done') {
            created.push(event.record)
            this.importText = `已导入 ${event.name}`
            this.importProgress = null
          } else if (event.phase === 'duplicate') {
            this.importText = `${event.name} 已在素材库中`
          } else if (event.phase === 'error') {
            this.toast('error', `${event.name}：${event.error}`)
          }
          this.emit()
        }
      })
      const done = events.find((event) => event.type === 'done')
      const errors = done?.errors ?? []
      const records = (done?.created?.length ? done.created : created).filter(Boolean)
      for (const record of records) {
        if (kind === 'audio') {
          if (!this.state.audio.some((track) => track.id === record.id)) this.state.audio.push(record)
        } else {
          if (!this.state.assets.some((asset) => asset.id === record.id)) {
            this.state.assets.push(record)
            this.state.assetSettings[record.id] = normalizeSettings(this.state.assetSettings[record.id], record.kind)
          }
        }
      }
      for (const failure of errors) this.toast('error', `${failure.name || basename(failure.path)}：${failure.error}`)
      if (options.autoApply !== false) this.lastImportedId = records[0]?.id ?? null
      this.importing = false
      this.importText = ''
      this.importProgress = null
      this.scheduleSave()
      this.emit()

      for (const record of records) {
        try {
          if (kind === 'audio') await this.enrichAudio(record)
          else await this.enrichAsset(record)
        } catch (error) {
          this.toast('warning', `${record.name} 的预览信息读取失败：${error instanceof Error ? error.message : String(error)}`)
        }
      }

      if (kind === 'media' && records.length > 0 && !this.currentAsset() && options.autoApply !== false) {
        await this.applyAsset(records[0].id)
      }
      if (records.length > 0) {
        this.toast('success', `已导入 ${records.length} 个${kind === 'audio' ? '音频' : '背景'}。`)
      }
      return records
    } catch (error) {
      this.importing = false
      this.importText = ''
      this.importProgress = null
      this.toast('error', `导入失败：${error instanceof Error ? error.message : String(error)}`)
      this.emit()
      return []
    }
  }

  async enrichAsset(asset) {
    if (!asset) return
    const probed = await probeAsset(asset)
    Object.assign(asset, probed)
    asset.thumb = probed.thumb === true
    asset.thumbVersion = probed.thumb ? Date.now() : 0
    this.scheduleSave(200)
    this.emit()
  }

  /** Lazily read metadata and produce a thumbnail for libraries created elsewhere. */
  ensureAssetDetails(id) {
    const asset = this.assetById(id)
    if (!asset || asset.missing) return
    if (asset.width > 0 && asset.thumb) return
    if (this.detailsPending.has(id)) return
    this.detailsPending.add(id)
    this.enrichAsset(asset)
      .catch(() => {})
      .finally(() => this.detailsPending.delete(id))
  }

  async enrichAudio(track) {
    if (!track) return
    try {
      const duration = await probeAudioDuration(track)
      if (duration > 0) track.duration = duration
      track.lastUsedAt = new Date().toISOString()
    } catch (error) {
      track.probeError = error instanceof Error ? error.message : String(error)
    }
    this.scheduleSave(200)
    this.emit()
  }

  async applyAsset(id, options = {}) {
    const asset = this.assetById(id)
    if (!asset) {
      this.toast('error', '素材不存在。')
      return false
    }
    if (asset.missing) {
      this.toast('error', `文件已丢失：${asset.name}。请重新定位后再应用。`)
      return false
    }
    this.ensureAssetDetails(id)
    this.playlist?.stop({ keepBackground: true, silent: true })
    const settings = this.settingsFor(id)
    try {
      const handle = await this.renderer.show(asset, settings, { paused: options.paused === true })
      if (!handle) return false
      this.audio.applyForAsset(asset, settings, handle.video)
      if (options.paused) {
        this.renderer.pause()
        this.audio.pauseExternal()
      }
      asset.lastUsedAt = new Date().toISOString()
      this.state.runtime = {
        mode: 'single',
        assetId: id,
        playlistId: null,
        itemIndex: 0,
        playing: options.paused ? false : true,
        updatedAt: Date.now(),
      }
      this.scheduleSave()
      this.emit()
      return true
    } catch (error) {
      this.toast('error', `无法应用背景：${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  async restoreRuntime() {
    if (!this.state.global.startup.restore) return
    const runtime = this.state.runtime
    const autoPlay = this.state.global.startup.autoPlay !== false
    if (runtime.mode === 'playlist' && runtime.playlistId && this.playlistById(runtime.playlistId)) {
      const playlist = this.playlistById(runtime.playlistId)
      if (playlist.items.length > 0) {
        await this.playlist.start(runtime.playlistId, runtime.itemIndex, {
          paused: !runtime.playing || !autoPlay || this.deferBackgroundVideo,
        })
        return
      }
    }
    if (runtime.assetId && this.assetById(runtime.assetId)) {
      await this.applyAsset(runtime.assetId, {
        paused: !runtime.playing || !autoPlay || this.deferBackgroundVideo,
      })
    }
  }

  togglePlay() {
    if (this.state.runtime.mode === 'playlist') {
      if (!this.playlist) return
      if (this.playlist.playing) this.playlist.pause()
      else this.playlist.resume()
      return
    }
    const asset = this.currentAsset()
    if (!asset) return
    if (this.state.runtime.playing) {
      this.renderer.pause()
      this.audio.pauseExternal()
      this.state.runtime.playing = false
    } else {
      this.renderer.resume()
      this.audio.resumeExternal()
      this.state.runtime.playing = true
    }
    this.scheduleSave()
    this.emit()
  }

  stopPlayback() {
    this.playlist?.stop({ keepBackground: true })
    this.renderer?.pause()
    this.audio?.stopExternal(240)
    this.state.runtime.playing = false
    this.scheduleSave()
    this.emit()
  }

  async relocate(id, filePath) {
    try {
      const result = await apiRelocate(id, filePath)
      const record = result.record
      const target = this.assetById(id)
      if (target) Object.assign(target, record)
      else {
        const track = this.audioById(id)
        if (track) Object.assign(track, record)
      }
      if (target) await this.enrichAsset(target)
      this.scheduleSave()
      this.emit()
      if (target && this.state.runtime.assetId === id) await this.applyAsset(id)
      this.toast('success', '文件已重新定位。')
    } catch (error) {
      this.toast('error', `重新定位失败：${error instanceof Error ? error.message : String(error)}`)
    }
  }

  removeAsset(id) {
    const asset = this.assetById(id)
    if (!asset) return
    this.startup?.stopIfAsset(id)
    this.startupPreview?.stopIfAsset(id)
    this.state.assets = this.state.assets.filter((entry) => entry.id !== id)
    delete this.state.assetSettings[id]
    for (const playlist of this.state.playlists) {
      playlist.items = playlist.items.filter((item) => item.assetId !== id)
    }
    this.state.startupAnimation.items = this.state.startupAnimation.items.filter((item) => item.assetId !== id)
    if (this.state.runtime.assetId === id || this.playlist?.currentAssetId === id) {
      this.playlist?.stop({ keepBackground: false, silent: true })
      this.renderer?.hide()
      this.state.runtime = { ...defaultClientState().runtime }
    }
    this.scheduleSave()
    this.emit()
  }

  removeAudio(id) {
    const usedBy = this.state.assets.filter((asset) => (this.settingsFor(asset.id).audioIds ?? []).includes(id) || this.settingsFor(asset.id).audioId === id)
    this.state.audio = this.state.audio.filter((track) => track.id !== id)
    for (const asset of usedBy) {
      const settings = this.settingsFor(asset.id)
      const ids = (settings.audioIds ?? []).filter((entry) => entry !== id)
      settings.audioIds = ids
      if (settings.audioId === id) {
        settings.audioIndex = Math.min(settings.audioIndex ?? 0, Math.max(0, ids.length - 1))
        settings.audioId = ids[settings.audioIndex] ?? null
      }
      if (ids.length === 0 && (settings.audioMode === 'external' || settings.audioMode === 'mix')) {
        settings.audioMode = asset.kind === 'video' ? 'video' : 'mute'
      }
      if (ids.length < 2 && settings.audioEndAction === 'nextTrack') settings.audioEndAction = 'none'
    }
    if (this.audioPreviewId === id) this.stopPreview()
    const startupAudio = this.state.startupAnimation.audio
    if (startupAudio.audioId === id) {
      startupAudio.audioId = null
      if (startupAudio.mode === 'external') startupAudio.mode = 'mute'
    }
    if (this.currentAsset() && usedBy.some((asset) => asset.id === this.currentAsset().id)) {
      this.audio.applyForAsset(this.currentAsset(), this.currentSettings(), this.renderer.currentVideo)
    }
    this.scheduleSave()
    this.emit()
  }

  togglePreviewAudio(id) {
    if (this.audioPreviewId === id) {
      this.stopPreview()
      return
    }
    const track = this.audioById(id)
    if (!track || track.missing) {
      this.toast('warning', '音频文件不可用。')
      return
    }
    this.audioPreviewId = id
    this.audio.startPreview(track, () => {
      this.audioPreviewId = null
      this.emit()
    })
    this.emit()
  }

  stopPreview() {
    this.audio.stopPreview()
    this.audioPreviewId = null
    this.emit()
  }

  audioUsage(id) {
    return this.state.assets.filter((asset) => this.settingsFor(asset.id).audioId === id).length
  }

  createPlaylist(name) {
    const playlist = {
      id: newId(),
      name: str(name, '新的轮播').trim() || '新的轮播',
      items: [],
      shuffle: 'off',
      loop: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      favorite: false,
    }
    this.state.playlists.push(playlist)
    this.scheduleSave()
    this.emit()
    return playlist
  }

  duplicatePlaylist(id) {
    const source = this.playlistById(id)
    if (!source) return null
    const copy = {
      ...source,
      id: newId(),
      name: `${source.name} 副本`,
      items: source.items.map((item) => ({ ...item, id: newId() })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.state.playlists.push(copy)
    this.scheduleSave()
    this.emit()
    return copy
  }

  renamePlaylist(id, name) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    const trimmed = str(name).trim()
    if (trimmed.length === 0) return
    playlist.name = trimmed.slice(0, 80)
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  updatePlaylist(id, patch) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    Object.assign(playlist, patch)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === id) this.playlist?.rescheduleDwell()
    this.scheduleSave()
    this.emit()
  }

  deletePlaylist(id) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    this.state.playlists = this.state.playlists.filter((entry) => entry.id !== id)
    if (this.state.runtime.playlistId === id) {
      this.playlist?.stop({ keepBackground: true, silent: true })
      this.state.runtime = { ...defaultClientState().runtime, assetId: this.renderer?.currentAsset?.id ?? null }
    }
    this.scheduleSave()
    this.emit()
  }

  addPlaylistItems(id, assetIds) {
    const playlist = this.playlistById(id)
    if (!playlist) return
    const existing = new Set(playlist.items.map((item) => item.assetId))
    for (const assetId of assetIds) {
      if (existing.has(assetId)) continue
      const asset = this.assetById(assetId)
      if (!asset) continue
      playlist.items.push({
        id: newId(),
        assetId,
        dwellMode: 'default',
        dwellSeconds: this.state.global.defaultDwellSeconds,
      })
      existing.add(assetId)
    }
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  removePlaylistItem(playlistId, itemId) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    playlist.items = playlist.items.filter((item) => item.id !== itemId)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === playlistId) this.playlist?.refreshQueue()
    this.scheduleSave()
    this.emit()
  }

  movePlaylistItem(playlistId, itemId, targetIndex) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    const index = playlist.items.findIndex((item) => item.id === itemId)
    if (index < 0) return
    const [item] = playlist.items.splice(index, 1)
    const next = clamp(targetIndex, 0, playlist.items.length)
    playlist.items.splice(next, 0, item)
    playlist.updatedAt = new Date().toISOString()
    this.scheduleSave()
    this.emit()
  }

  updatePlaylistItem(playlistId, itemId, patch) {
    const playlist = this.playlistById(playlistId)
    if (!playlist) return
    const item = playlist.items.find((entry) => entry.id === itemId)
    if (!item) return
    Object.assign(item, patch)
    playlist.updatedAt = new Date().toISOString()
    if (this.state.runtime.playlistId === playlistId) this.playlist?.rescheduleDwell()
    this.scheduleSave()
    this.emit()
  }

  async startPlaylist(id, options = {}) {
    const playlist = this.playlistById(id)
    if (!playlist) {
      this.toast('error', '轮播方案不存在。')
      return false
    }
    if (playlist.items.length === 0) {
      this.toast('warning', '这个轮播方案还没有素材。')
      return false
    }
    try {
      const ok = await this.playlist.start(id, options.index ?? 0, options)
      if (ok) this.toast('success', `开始轮播：${playlist.name}`)
      return ok
    } catch (error) {
      this.toast('error', `轮播启动失败：${error instanceof Error ? error.message : String(error)}`)
      return false
    }
  }

  stopPlaylist() {
    this.playlist?.stop({ keepBackground: true })
    this.state.runtime.playing = false
    this.scheduleSave()
    this.emit()
  }

  togglePausePlaylist() {
    if (!this.playlist) return
    if (this.playlist.playing) this.playlist.pause()
    else this.playlist.resume()
  }

  nextPlaylist() {
    this.playlist?.next('manual')
  }

  prevPlaylist() {
    this.playlist?.previous('manual')
  }

  openPanel() {
    try {
      this.ctx?.get?.('layout')?.selectPanel?.(PANEL_KEY)
    } catch {
      /* layout service may be absent */
    }
  }

  dispose() {
    window.removeEventListener('pagehide', this.onPageHide)
    window.removeEventListener('dbs:startup-started', this.onInjectedStart)
    window.removeEventListener('dbs:startup-ended', this.onInjectedEnd)
    window.removeEventListener('dbs:startup-skip', this.onInjectedSkip)
    window.removeEventListener('dbs:startup-ending', this.onInjectedEnding)
    if (this.deferredStartTimer) {
      window.clearTimeout(this.deferredStartTimer)
      this.deferredStartTimer = 0
    }
    if (this.deferredTimer) {
      window.clearTimeout(this.deferredTimer)
      this.deferredTimer = 0
    }
    this.releaseInjectedSuppression()
    this.startup?.dispose()
    this.startupPreview?.dispose()
    this.playlist?.dispose()
    this.audio?.dispose()
    this.renderer?.dispose()
    if (this.saveTimer) window.clearTimeout(this.saveTimer)
    this.listeners.clear()
  }
}


/* ---- 20-probe.js ---- */
/* =========================================================================
 * 20-probe — real metadata, an ISO-BMFF (MP4/MOV) track reader, thumbnails.
 * No value here is invented: anything unavailable is reported as unknown.
 * ========================================================================= */

function waitForEvent(target, event, timeoutMs, errorEvents = ['error']) {
  return new Promise((resolve, reject) => {
    let settled = false
    const cleanup = () => {
      target.removeEventListener(event, onOk)
      for (const name of errorEvents) target.removeEventListener(name, onError)
      target.removeEventListener('abort', onError)
      window.clearTimeout(timer)
    }
    const onOk = () => {
      if (settled) return
      settled = true
      cleanup()
      resolve()
    }
    const onError = () => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('媒体加载失败'))
    }
    const timer = window.setTimeout(() => {
      if (settled) return
      settled = true
      cleanup()
      reject(new Error('媒体加载超时'))
    }, timeoutMs)
    target.addEventListener(event, onOk, { once: true })
    for (const name of errorEvents) target.addEventListener(name, onError, { once: true })
  })
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms))
}

async function readRange(url, offset, length) {
  const response = await fetch(url, { headers: { Range: `bytes=${offset}-${offset + length - 1}` } })
  if (!response.ok) throw new Error(`range ${response.status}`)
  if (response.status === 200 && length < 1024 * 1024) {
    const buffer = await response.arrayBuffer()
    return new Uint8Array(buffer.slice(offset, offset + length))
  }
  if (response.status !== 206) throw new Error(`range ${response.status}`)
  return new Uint8Array(await response.arrayBuffer())
}

function boxHeader(bytes) {
  if (bytes.byteLength < 8) return null
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let size = view.getUint32(0)
  const type = String.fromCharCode(view.getUint8(4), view.getUint8(5), view.getUint8(6), view.getUint8(7))
  let header = 8
  if (size === 1) {
    if (bytes.byteLength < 16) return null
    const high = view.getUint32(8)
    const low = view.getUint32(12)
    size = high * 4294967296 + low
    header = 16
  } else if (size === 0) {
    size = Number.MAX_SAFE_INTEGER
  }
  return { size, type, header }
}

/** Walk immediate child boxes inside a moov buffer. */
function eachBox(buffer, start, end, visit) {
  let offset = start
  while (offset + 8 <= end) {
    const header = boxHeader(buffer.slice(offset, Math.min(end, offset + 16)))
    if (!header || header.size < header.header) break
    const boxEnd = Math.min(end, offset + header.size)
    visit(header.type, offset, offset + header.header, boxEnd)
    if (header.size === Number.MAX_SAFE_INTEGER) break
    offset = boxEnd
    if (offset <= start) break
  }
}

function findBox(buffer, start, end, type) {
  let found = null
  eachBox(buffer, start, end, (boxType, boxStart, payloadStart, boxEnd) => {
    if (boxType === type && found === null) found = { start: boxStart, payload: payloadStart, end: boxEnd }
  })
  return found
}

function findPath(buffer, start, end, types) {
  let current = { start, end }
  for (const type of types) {
    const box = findBox(buffer, current.start, current.end, type)
    if (!box) return null
    current = { start: box.payload, end: box.end }
  }
  return current
}

function readHandler(buffer, payload, end) {
  if (payload + 12 > end) return ''
  return String.fromCharCode(
    buffer[payload + 8],
    buffer[payload + 9],
    buffer[payload + 10],
    buffer[payload + 11],
  )
}

function readMdhd(buffer, payload, end) {
  if (payload + 4 > end) return null
  const version = buffer[payload]
  if (version === 1) {
    if (payload + 32 > end) return null
    const timescale = new DataView(buffer.buffer, buffer.byteOffset + payload + 20, 4).getUint32(0)
    const durationHigh = new DataView(buffer.buffer, buffer.byteOffset + payload + 24, 4).getUint32(0)
    const durationLow = new DataView(buffer.buffer, buffer.byteOffset + payload + 28, 4).getUint32(0)
    return { timescale, duration: durationHigh * 4294967296 + durationLow }
  }
  if (payload + 20 > end) return null
  const timescale = new DataView(buffer.buffer, buffer.byteOffset + payload + 12, 4).getUint32(0)
  const duration = new DataView(buffer.buffer, buffer.byteOffset + payload + 16, 4).getUint32(0)
  return { timescale, duration }
}

function readVideoSize(buffer, stsdPayload, stsdEnd) {
  if (stsdPayload + 16 > stsdEnd) return null
  // version/flags + entry_count -> first sample entry
  const entry = stsdPayload + 8
  if (entry + 28 > stsdEnd) return null
  const view = new DataView(buffer.buffer, buffer.byteOffset + entry, 28)
  return { width: view.getUint16(24), height: view.getUint16(26) }
}

function readSttsSamples(buffer, payload, end) {
  if (payload + 8 > end) return 0
  const count = new DataView(buffer.buffer, buffer.byteOffset + payload + 4, 4).getUint32(0)
  let samples = 0
  let offset = payload + 8
  for (let index = 0; index < count && offset + 8 <= end; index += 1) {
    const view = new DataView(buffer.buffer, buffer.byteOffset + offset, 8)
    samples += view.getUint32(0)
    offset += 8
  }
  return samples
}

/** Parse the moov atom for real track presence and source FPS. */
function parseMoov(buffer) {
  const result = { hasAudio: null, width: 0, height: 0, fps: 0, duration: 0 }
  const moov = boxHeader(buffer)
  if (!moov || moov.type !== 'moov') return result
  const moovEnd = buffer.byteLength
  const mvhd = findBox(buffer, moov.header, moovEnd, 'mvhd')
  if (mvhd) {
    const data = readMdhd(buffer, mvhd.payload, mvhd.end)
    if (data && data.timescale > 0) result.duration = data.duration / data.timescale
  }
  eachBox(buffer, moov.header, moovEnd, (type, trakStart, trakPayload, trakEnd) => {
    if (type !== 'trak') return
    const mdia = findBox(buffer, trakPayload, trakEnd, 'mdia')
    const hdlr = mdia ? findBox(buffer, mdia.payload, mdia.end, 'hdlr') : null
    const handler = hdlr ? readHandler(buffer, hdlr.payload, hdlr.end) : ''
    const mdhd = mdia ? findBox(buffer, mdia.payload, mdia.end, 'mdhd') : null
    const timing = mdhd ? readMdhd(buffer, mdhd.payload, mdhd.end) : null
    const stbl = findPath(buffer, trakPayload, trakEnd, ['mdia', 'minf', 'stbl'])
    if (handler === 'soun') result.hasAudio = true
    if (handler === 'vide') {
      result.video = true
      if (stbl) {
        const stsd = findBox(buffer, stbl.start, stbl.end, 'stsd')
        if (stsd) {
          const size = readVideoSize(buffer, stsd.payload, stsd.end)
          if (size && size.width > 0) {
            result.width = size.width
            result.height = size.height
          }
        }
        const stts = findBox(buffer, stbl.start, stbl.end, 'stts')
        if (stts && timing && timing.timescale > 0 && timing.duration > 0) {
          const samples = readSttsSamples(buffer, stts.payload, stts.end)
          const seconds = timing.duration / timing.timescale
          if (seconds > 0 && samples > 0) result.fps = samples / seconds
        }
      }
    }
  })
  if (result.video && result.hasAudio === null) result.hasAudio = false
  return result
}

async function parseMp4Info(asset) {
  const ext = str(asset.ext).toLowerCase()
  if (!['.mp4', '.m4v', '.mov'].includes(ext)) return null
  const size = num(asset.size, 0)
  if (size <= 0) return null
  try {
    let offset = 0
    for (let index = 0; index < 64 && offset + 16 <= size; index += 1) {
      const headerBytes = await readRange(mediaUrl(asset.id), offset, 16)
      const header = boxHeader(headerBytes)
      if (!header) break
      if (header.type === 'moov') {
        if (header.size > 48 * 1024 * 1024) return null
        const moov = await readRange(mediaUrl(asset.id), offset, header.size)
        return parseMoov(moov)
      }
      if (header.size === Number.MAX_SAFE_INTEGER) break
      offset += header.size
    }
  } catch (error) {
    console.warn('[dsh-background-studio] MP4 信息读取失败', error)
    return null
  }
  return null
}

async function measureVideoFps(video, duration) {
  if (typeof video.requestVideoFrameCallback !== 'function') return 0
  try {
    video.muted = true
    video.currentTime = 0
    await video.play()
  } catch {
    return 0
  }
  let frames = 0
  let first = 0
  let last = 0
  let stopped = false
  const onFrame = (now) => {
    if (stopped) return
    if (first === 0) first = now
    last = now
    frames += 1
    if (frames >= 30 || now - first >= 1200) {
      stopped = true
      return
    }
    video.requestVideoFrameCallback(onFrame)
  }
  video.requestVideoFrameCallback(onFrame)
  await sleep(Math.min(1600, Math.max(700, num(duration, 2) * 250)))
  stopped = true
  try {
    video.pause()
  } catch {
    /* ignore */
  }
  if (frames < 2 || last <= first) return 0
  return (frames - 1) / ((last - first) / 1000)
}

function makeCanvas() {
  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 270
  return canvas
}

function drawCover(canvas, source, width, height) {
  const context = canvas.getContext('2d')
  if (!context) return false
  try {
    const scale = Math.max(canvas.width / width, canvas.height / height)
    const drawWidth = width * scale
    const drawHeight = height * scale
    context.drawImage(source, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight)
    return true
  } catch {
    return false
  }
}

async function uploadThumb(asset, canvas) {
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.82))
  if (!blob) return false
  await apiUploadThumb(asset.id, blob)
  return true
}

async function probeVideo(asset) {
  const video = document.createElement('video')
  video.preload = 'auto'
  video.muted = true
  video.playsInline = true
  video.crossOrigin = 'anonymous'
  video.src = mediaUrl(asset.id)
  const result = {
    width: 0,
    height: 0,
    duration: 0,
    fps: 0,
    hasAudio: null,
    animated: true,
    thumb: false,
    probeError: null,
  }
  try {
    await waitForEvent(video, 'loadedmetadata', 12000)
    result.width = video.videoWidth || 0
    result.height = video.videoHeight || 0
    result.duration = Number.isFinite(video.duration) ? video.duration : 0
    if (typeof video.audioTracks !== 'undefined' && video.audioTracks) {
      if (video.audioTracks.length > 0) result.hasAudio = true
    }
    const mp4 = await parseMp4Info(asset)
    if (mp4) {
      if (mp4.hasAudio === true) result.hasAudio = true
      if (mp4.width > 0 && result.width === 0) result.width = mp4.width
      if (mp4.height > 0 && result.height === 0) result.height = mp4.height
      if (mp4.fps > 0) result.fps = Math.round(mp4.fps * 100) / 100
    }
    if (result.fps === 0 && result.duration > 0) {
      const measured = await measureVideoFps(video, result.duration)
      if (measured > 0) result.fps = Math.round(measured * 100) / 100
    }
    const seekTo = result.duration > 0 ? Math.min(Math.max(0.5, result.duration * 0.1), result.duration - 0.1) : 0
    if (seekTo > 0) {
      video.currentTime = seekTo
      await waitForEvent(video, 'seeked', 6000).catch(() => {})
    }
    if (video.videoWidth > 0) {
      const canvas = makeCanvas()
      if (drawCover(canvas, video, video.videoWidth, video.videoHeight)) {
        await uploadThumb(asset, canvas).catch(() => false)
        result.thumb = true
      }
    }
  } catch (error) {
    result.probeError = error instanceof Error ? error.message : String(error)
  } finally {
    try {
      video.pause()
    } catch {
      /* ignore */
    }
    video.removeAttribute('src')
    try {
      video.load()
    } catch {
      /* ignore */
    }
  }
  return result
}

async function probeImage(asset) {
  const image = new Image()
  image.crossOrigin = 'anonymous'
  image.src = mediaUrl(asset.id)
  const result = {
    width: 0,
    height: 0,
    duration: 0,
    fps: 0,
    hasAudio: false,
    animated: asset.kind === 'gif',
    thumb: false,
    probeError: null,
  }
  try {
    await waitForEvent(image, 'load', 12000)
    result.width = image.naturalWidth || 0
    result.height = image.naturalHeight || 0
    if (result.width > 0 && result.height > 0) {
      const canvas = makeCanvas()
      if (drawCover(canvas, image, result.width, result.height)) {
        await uploadThumb(asset, canvas).catch(() => false)
        result.thumb = true
      }
    }
  } catch (error) {
    result.probeError = error instanceof Error ? error.message : String(error)
  }
  return result
}

async function probeAsset(asset) {
  if (asset.kind === 'video') return probeVideo(asset)
  return probeImage(asset)
}

function probeAudioDuration(track) {
  return new Promise((resolve, reject) => {
    const audio = document.createElement('audio')
    audio.preload = 'metadata'
    audio.src = audioUrl(track.id)
    const cleanup = () => {
      audio.removeAttribute('src')
      try {
        audio.load()
      } catch {
        /* ignore */
      }
    }
    const timer = window.setTimeout(() => {
      cleanup()
      reject(new Error('音频元数据超时'))
    }, 8000)
    audio.addEventListener('loadedmetadata', () => {
      window.clearTimeout(timer)
      const duration = Number.isFinite(audio.duration) ? audio.duration : 0
      cleanup()
      resolve(duration)
    }, { once: true })
    audio.addEventListener('error', () => {
      window.clearTimeout(timer)
      cleanup()
      reject(new Error('音频加载失败'))
    }, { once: true })
  })
}

/* ---- 30-renderer.js ---- */
/* =========================================================================
 * 30-renderer — the only place that owns the body-level background layer.
 * Two layers (A/B) allow fades without rebuilding the whole stage.
 * ========================================================================= */

class Renderer {
  constructor(studio) {
    this.studio = studio
    this.root = null
    this.layers = []
    this.activeIndex = 0
    this.currentAsset = null
    this.currentVideo = null
    this.currentSettings = null
    this.opacity = 1
    this.surface = { dark: 0.34, light: 0.62 }
    this.token = 0
    this.hiddenByOpacity = false
    this.startupBackground = false
    this.deferredPosterLayer = null
  }

  mount() {
    if (this.root !== null) return
    const previous = document.getElementById('dbs-root')
    if (previous?.parentNode) previous.parentNode.removeChild(previous)
    const root = document.createElement('div')
    root.id = 'dbs-root'
    root.dataset.visible = '0'
    root.setAttribute('aria-hidden', 'true')
    for (let index = 0; index < 2; index += 1) {
      const layer = document.createElement('div')
      layer.className = 'dbs-layer'
      layer.dataset.slot = index === 0 ? 'a' : 'b'
      root.appendChild(layer)
      this.layers.push(layer)
    }
    document.body.insertBefore(root, document.body.firstChild)
    this.root = root
    this.setSurface(this.surface)
    this.injectTokens()
  }

  injectTokens() {
    for (const stale of Array.from(document.querySelectorAll('style[data-dbs="tokens"]'))) stale.remove()
    const style = document.createElement('style')
    style.dataset.dbs = 'tokens'
    style.textContent = `
      html[data-dbs="on"] body {
        background-color: transparent !important;
        --dsw-alias-bg-base: rgba(18, 20, 26, var(--dbs-surface-dark, .34)) !important;
        --dsw-alias-bg-layer-1: rgba(24, 27, 35, var(--dbs-layer1-dark, .46)) !important;
        --dsw-alias-bg-layer-2: rgba(31, 35, 45, var(--dbs-layer2-dark, .54)) !important;
        --dsw-alias-bg-layer-3: rgba(38, 42, 53, var(--dbs-layer3-dark, .60)) !important;
        --dsw-specific-sidebar-fill: rgba(17, 19, 25, var(--dbs-sidebar-dark, .30)) !important;
      }
      html[data-dbs="on"] body:not([data-ds-dark-theme]) {
        --dsw-alias-bg-base: rgba(255, 255, 255, var(--dbs-surface-light, .62)) !important;
        --dsw-alias-bg-layer-1: rgba(255, 255, 255, var(--dbs-layer1-light, .72)) !important;
        --dsw-alias-bg-layer-2: rgba(255, 255, 255, var(--dbs-layer2-light, .80)) !important;
        --dsw-alias-bg-layer-3: rgba(255, 255, 255, var(--dbs-layer3-light, .86)) !important;
        --dsw-specific-sidebar-fill: rgba(249, 250, 251, var(--dbs-sidebar-light, .64)) !important;
      }
      #dbs-root {
        position: fixed;
        inset: 0;
        z-index: -1;
        overflow: hidden;
        pointer-events: none;
        background: #05070b;
        opacity: 0;
        transition: opacity var(--dbs-root-fade, 420ms) ease;
      }
      #dbs-root[data-visible="1"] { opacity: 1; }
      #dbs-root .dbs-layer {
        position: absolute;
        inset: 0;
        opacity: 0;
        transition: opacity var(--dbs-fade, 420ms) ease;
        will-change: opacity;
      }
      #dbs-root .dbs-layer > img,
      #dbs-root .dbs-layer > video {
        display: block;
        width: 100%;
        height: 100%;
        border: 0;
        outline: 0;
        max-width: none;
        max-height: none;
        background: #05070b;
        user-select: none;
        -webkit-user-drag: none;
      }
      @media (prefers-reduced-motion: reduce) {
        #dbs-root .dbs-layer { transition-duration: 1ms; }
      }
    `
    document.head.appendChild(style)
    this.tokenStyle = style
  }

  setSurface(surface) {
    this.surface = {
      dark: clamp(num(surface?.dark, 0.34), 0.05, 0.92),
      light: clamp(num(surface?.light, 0.62), 0.05, 0.95),
    }
    const root = document.documentElement
    const dark = this.surface.dark
    const light = this.surface.light
    root.style.setProperty('--dbs-surface-dark', String(dark))
    root.style.setProperty('--dbs-layer1-dark', String(clamp(dark + 0.10, 0, 0.96)))
    root.style.setProperty('--dbs-layer2-dark', String(clamp(dark + 0.18, 0, 0.97)))
    root.style.setProperty('--dbs-layer3-dark', String(clamp(dark + 0.24, 0, 0.98)))
    root.style.setProperty('--dbs-sidebar-dark', String(clamp(dark - 0.04, 0.04, 0.92)))
    root.style.setProperty('--dbs-surface-light', String(light))
    root.style.setProperty('--dbs-layer1-light', String(clamp(light + 0.10, 0, 0.97)))
    root.style.setProperty('--dbs-layer2-light', String(clamp(light + 0.18, 0, 0.98)))
    root.style.setProperty('--dbs-layer3-light', String(clamp(light + 0.24, 0, 0.99)))
    root.style.setProperty('--dbs-sidebar-light', String(clamp(light + 0.02, 0.05, 0.96)))
    this.updateTokens()
  }

  updateTokens() {
    const enabled = this.root !== null && (this.startupBackground || (this.currentAsset !== null && this.opacity > 0.001))
    document.documentElement.dataset.dbs = enabled ? 'on' : 'off'
    if (enabled) {
      this.root.dataset.visible = '1'
      this.root.style.opacity = '1'
    } else {
      this.root.dataset.visible = '0'
    }
  }

  /** Keep the background stage visible while a Mode B startup layer is over it. */
  beginStartupBackground() {
    this.startupBackground = true
    this.updateTokens()
  }

  endStartupBackground() {
    this.startupBackground = false
    this.updateTokens()
    if (this.currentVideo && this.studio.isPlaying()) {
      this.hiddenByOpacity = false
      this.currentVideo.play().catch(() => {})
    }
  }

  setMediaFit(element, asset, settings) {
    const display = settings.display
    const scale = clamp(num(settings.scale, 1), 0.1, 4)
    element.style.objectPosition = 'center center'
    element.style.transform = 'none'
    element.style.transformOrigin = 'center center'
    if (display === 'contain') element.style.objectFit = 'contain'
    else if (display === 'center' || display === 'original') element.style.objectFit = 'none'
    else if (display === 'custom') {
      element.style.objectFit = 'none'
      element.style.transform = `scale(${scale})`
    } else element.style.objectFit = 'cover'
  }

  applyDisplay(asset, settings) {
    const layer = this.layers[this.activeIndex]
    const media = layer?.firstElementChild
    if (media) this.setMediaFit(media, asset, settings)
    if (this.currentSettings) this.currentSettings = settings
  }

  setDisplay(settings) {
    if (!this.currentAsset) return
    this.currentSettings = settings
    this.applyDisplay(this.currentAsset, settings)
  }

  setOpacity(value) {
    const opacity = clamp(num(value, 1), 0, 1)
    this.opacity = opacity
    if (this.root === null) return
    if (opacity <= 0.001) {
      if (!this.startupBackground) {
        this.root.dataset.visible = '0'
        document.documentElement.dataset.dbs = 'off'
      }
      if (this.currentVideo && !this.currentVideo.paused) {
        this.hiddenByOpacity = true
        this.currentVideo.pause()
      }
      return
    }
    document.documentElement.dataset.dbs = 'on'
    this.root.dataset.visible = '1'
    for (let index = 0; index < this.layers.length; index += 1) {
      const layer = this.layers[index]
      if (index === this.activeIndex) layer.style.opacity = String(opacity)
      else layer.style.opacity = '0'
    }
    if (this.hiddenByOpacity && this.currentVideo) {
      this.hiddenByOpacity = false
      this.currentVideo.play().catch(() => {})
    }
  }

  setLoop(loop) {
    if (this.currentVideo) this.currentVideo.loop = loop !== false
  }

  /** Cancel an in-flight show without changing the currently visible layer. */
  invalidate() {
    this.token += 1
  }

  clearLayer(layer) {
    if (!layer) return
    const media = layer.firstElementChild
    if (media) {
      if (media.tagName === 'VIDEO') this.studio.audio?.releaseVideo(media)
      try {
        media.pause?.()
      } catch {
        /* ignore */
      }
      try {
        media.removeAttribute('src')
        media.load?.()
      } catch {
        /* ignore */
      }
      layer.removeChild(media)
    }
    layer.style.opacity = '0'
    layer.style.backgroundImage = 'none'
  }

  createVideo(asset, settings) {
    const video = document.createElement('video')
    video.className = 'dbs-media dbs-video'
    video.src = mediaUrl(asset.id)
    video.preload = 'auto'
    video.playsInline = true
    video.loop = settings.loop !== false
    video.muted = this.studio.audio?.startupSuppressed === true
    video.volume = 1
    video.disablePictureInPicture = true
    video.addEventListener('error', () => {
      const message = video.error ? `视频播放失败（code ${video.error.code}）` : '视频播放失败'
      this.studio.toast('error', `${asset.name}：${message}`)
      this.studio.playlist?.handleMediaError(asset.id)
    }, { once: true })
    video.addEventListener('ended', () => {
      this.studio.playlist?.handleMediaEnded(video)
    })
    return video
  }

  createImage(asset) {
    const image = document.createElement('img')
    image.className = 'dbs-media dbs-image'
    image.alt = ''
    image.decoding = 'async'
    image.draggable = false
    image.src = mediaUrl(asset.id)
    return image
  }

  async waitReady(media, isVideo) {
    if (isVideo) {
      if (media.readyState >= 2) return
      await waitForEvent(media, 'loadeddata', 15000)
      return
    }
    if (media.complete && media.naturalWidth > 0) return
    await waitForEvent(media, 'load', 15000)
  }

  async show(asset, settings, options = {}) {
    this.mount()
    const token = ++this.token
    const targetIndex = this.activeIndex === 0 ? 1 : 0
    const oldIndex = this.activeIndex
    const target = this.layers[targetIndex]
    const old = this.layers[oldIndex]
    const previous = {
      asset: this.currentAsset,
      settings: this.currentSettings,
      opacity: this.opacity,
      video: this.currentVideo,
    }
    this.clearLayer(target)

    const isVideo = asset.kind === 'video'
    const desired = clamp(num(settings.opacity, 1), 0, 1)
    const media = isVideo ? this.createVideo(asset, settings) : this.createImage(asset)
    this.setMediaFit(media, asset, settings)
    media.style.opacity = '1'
    target.appendChild(media)
    target.style.transitionDuration = `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`
    target.style.backgroundSize = 'cover'
    target.style.backgroundPosition = 'center center'
    target.style.backgroundRepeat = 'no-repeat'
    if (asset.thumb && desired > 0.001) target.style.backgroundImage = `url("${thumbUrl(asset)}")`
    else target.style.backgroundImage = 'none'
    target.style.opacity = '0'
    this.root.style.setProperty('--dbs-fade', `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`)
    this.root.style.setProperty('--dbs-root-fade', `${clamp(num(settings.fadeMs, 420), 0, 5000)}ms`)

    // Claim the stage immediately so the poster/thumbnail (or the image itself)
    // is visible while a large video reaches loadeddata. Previously the current
    // asset stayed null until `loadeddata`, so the whole background remained
    // hidden for seconds on a 4K video.
    this.currentAsset = asset
    this.currentSettings = settings
    this.currentVideo = isVideo ? media : null
    this.opacity = desired
    this.updateTokens()
    this.studio.markTimeline?.('background-visible', asset.kind)
    if (desired > 0.001) {
      old.style.opacity = '0'
      target.style.opacity = String(desired)
    }

    try {
      await this.waitReady(media, isVideo)
    } catch (error) {
      this.clearLayer(target)
      if (token === this.token) {
        this.currentAsset = previous.asset
        this.currentSettings = previous.settings
        this.opacity = previous.opacity
        this.currentVideo = previous.video
        if (previous.asset && old) old.style.opacity = String(previous.opacity)
        this.updateTokens()
        this.studio.toast('error', `${asset.name}：${error instanceof Error ? error.message : String(error)}`)
      }
      throw error
    }
    if (token !== this.token) {
      this.clearLayer(target)
      return null
    }
    this.studio.markTimeline?.('background-media-ready', asset.kind)

    if (isVideo) {
      if (options.paused === true) {
        try {
          media.pause()
        } catch {
          /* already paused */
        }
        this.studio.markTimeline?.('background-video-deferred', 'paused during startup')
      } else {
        try {
          await media.play()
        } catch {
          try {
            media.muted = true
            await media.play()
            this.studio.toast('warning', '系统拦截了自动播放，背景已静音；点击页面任意位置可恢复声音。')
            this.studio.audio?.markBlocked()
          } catch {
            this.studio.toast('error', `${asset.name}：无法开始播放`)
          }
        }
        window.setTimeout(() => {
          const decoded = media.webkitAudioDecodedByteCount
          if (typeof decoded === 'number' && decoded > 0 && asset.hasAudio !== true) {
            asset.hasAudio = true
            this.studio.scheduleSave(600)
            this.studio.emit()
          }
        }, 1400)
      }
    }

    this.activeIndex = targetIndex
    this.currentAsset = asset
    this.currentSettings = settings
    this.currentVideo = isVideo ? media : null
    this.opacity = clamp(num(settings.opacity, 1), 0, 1)

    target.style.opacity = String(this.opacity)
    old.style.opacity = '0'
    this.updateTokens()
    if (this.opacity <= 0.001) {
      if (isVideo) media.pause()
      document.documentElement.dataset.dbs = 'off'
    }

    // The poster is only a bridge until the first real frame is ready.
    if (target.style.backgroundImage !== 'none') {
      if (options.paused === true) {
        this.deferredPosterLayer = target
      } else {
        window.setTimeout(() => {
          if (token === this.token) target.style.backgroundImage = 'none'
        }, 600)
      }
    }

    window.setTimeout(() => {
      if (token === this.token) this.clearLayer(old)
    }, clamp(num(settings.fadeMs, 420), 0, 5000) + 80)

    return { video: this.currentVideo, media }
  }

  pause() {
    if (this.currentVideo) {
      try {
        this.currentVideo.pause()
      } catch {
        /* ignore */
      }
    }
  }

  resume() {
    if (this.currentVideo) {
      this.currentVideo.play().catch(() => {})
    }
    if (this.deferredPosterLayer) {
      const layer = this.deferredPosterLayer
      this.deferredPosterLayer = null
      window.setTimeout(() => {
        if (this.activeIndex >= 0) layer.style.backgroundImage = 'none'
      }, 300)
    }
  }

  hide() {
    this.token += 1
    if (this.root !== null) {
      this.root.dataset.visible = '0'
      this.root.style.opacity = '0'
    }
    document.documentElement.dataset.dbs = 'off'
    for (const layer of this.layers) this.clearLayer(layer)
    this.currentAsset = null
    this.currentVideo = null
    this.currentSettings = null
  }

  dispose() {
    this.hide()
    if (this.tokenStyle?.parentNode) this.tokenStyle.parentNode.removeChild(this.tokenStyle)
    if (this.root?.parentNode) this.root.parentNode.removeChild(this.root)
    this.root = null
    this.layers = []
  }
}

/* ---- 40-audio.js ---- */
/* =========================================================================
 * 40-audio — one AudioContext, two kinds of sources (video element and
 * external audio), one master/limiter. No second audio path is allowed.
 * ========================================================================= */

class AudioGraph {
  constructor(studio) {
    this.studio = studio
    this.ctx = null
    this.master = null
    this.limiter = null
    this.deck = null
    this.preview = null
    this.videoEntries = new Set()
    this.muted = studio.state.global.audio.muted === true
    this.volume = num(studio.state.global.audio.masterVolume, 1)
    this.blocked = false
    this.failed = false
    this.pendingExternal = null
    this.currentVideo = null
    this.currentMode = 'mute'
    this.startupSuppressed = false
    this.startupSuppressionDepth = 0
    this.onUnlock = () => this.unlock()
  }

  ensure() {
    if (this.ctx || this.failed) return this.ctx
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext
      if (!Ctor) {
        this.failed = true
        return null
      }
      this.ctx = new Ctor()
      this.master = this.ctx.createGain()
      this.master.gain.value = this.muted ? 0 : this.volume
      this.limiter = this.ctx.createDynamicsCompressor()
      this.limiter.threshold.value = -2
      this.limiter.knee.value = 6
      this.limiter.ratio.value = 12
      this.limiter.attack.value = 0.003
      this.limiter.release.value = 0.25
      this.master.connect(this.limiter)
      this.limiter.connect(this.ctx.destination)
      document.addEventListener('pointerdown', this.onUnlock, true)
      document.addEventListener('keydown', this.onUnlock, true)
      if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {})
    } catch {
      this.failed = true
      this.ctx = null
    }
    return this.ctx
  }

  async unlock() {
    if (!this.ctx) return
    try {
      if (this.ctx.state === 'suspended') await this.ctx.resume()
    } catch {
      return
    }
    if (this.blocked) {
      this.blocked = false
      if (this.currentVideo && this.currentVideo.muted && this.currentMode !== 'mute') {
        this.currentVideo.muted = false
        this.currentVideo.play().catch(() => {})
      }
      if (this.pendingExternal) {
        const pending = this.pendingExternal
        this.pendingExternal = null
        this.playExternal(pending.track, pending.settings)
      }
    }
  }

  markBlocked() {
    this.blocked = true
  }

  ramp(param, target, ms) {
    if (!this.ctx || !param) return
    const now = this.ctx.currentTime
    const duration = Math.max(0.01, num(ms, 0) / 1000)
    try {
      param.cancelScheduledValues(now)
      param.setValueAtTime(param.value, now)
      param.linearRampToValueAtTime(target, now + duration)
    } catch {
      try {
        param.value = target
      } catch {
        /* ignore */
      }
    }
  }

  attachVideo(video) {
    if (!video) return null
    const ctx = this.ensure()
    if (!ctx) return null
    for (const entry of this.videoEntries) {
      if (entry.video === video) return entry.gain
    }
    try {
      const source = ctx.createMediaElementSource(video)
      const gain = ctx.createGain()
      gain.gain.value = 0
      source.connect(gain)
      gain.connect(this.master)
      const entry = { video, source, gain }
      this.videoEntries.add(entry)
      return gain
    } catch {
      return null
    }
  }

  videoGainFor(video) {
    for (const entry of this.videoEntries) {
      if (entry.video === video) return entry.gain
    }
    return this.attachVideo(video)
  }

  setVideoGain(video, target, ms = 420) {
    if (!video) return
    const ctx = this.ensure()
    if (!ctx) {
      video.volume = clamp(target, 0, 1)
      return
    }
    const gain = this.videoGainFor(video)
    if (gain) this.ramp(gain.gain, clamp(target, 0, 1), ms)
  }

  releaseVideo(video) {
    if (!video) return
    for (const entry of this.videoEntries) {
      if (entry.video !== video) continue
      this.ramp(entry.gain.gain, 0, 180)
      this.videoEntries.delete(entry)
      window.setTimeout(() => {
        try {
          entry.source.disconnect()
        } catch {
          /* ignore */
        }
        try {
          entry.gain.disconnect()
        } catch {
          /* ignore */
        }
      }, 260)
    }
  }

  applyForAsset(asset, settings, video) {
    if (!asset || !settings) return
    this.currentMode = settings.audioMode
    this.currentVideo = video ?? null
    if (this.startupSuppressed && video) video.muted = true
    const mode = settings.audioMode
    const wantsVideo = mode === 'video' || mode === 'mix'
    const wantsExternal = mode === 'external' || mode === 'mix'
    const ctx = this.ensure()

    if (video && ctx) {
      const canPlayVideo = asset.hasAudio !== false
      const target = wantsVideo && canPlayVideo ? settings.videoVolume : 0
      this.setVideoGain(video, target, settings.fadeMs)
    } else if (video) {
      video.muted = !wantsVideo
      video.volume = clamp(settings.videoVolume, 0, 1)
    }

    if (wantsExternal && settings.audioId) {
      const track = this.studio.audioById(settings.audioId)
      if (track && !track.missing) {
        this.playExternal(track, settings)
        return
      }
      if (mode === 'external') {
        this.studio.toast('warning', '这个背景绑定的音频已丢失，当前保持静音。')
      }
    }
    this.stopExternal(settings.fadeMs)
  }

  playExternal(track, settings) {
    const ctx = this.ensure()
    if (!ctx) return
    if (this.deck && this.deck.trackId === track.id && !this.deck.el.ended) {
      this.deck.el.loop = settings.audioLoop !== false
      this.ramp(this.deck.gain.gain, settings.audioVolume, settings.fadeMs)
      if (this.deck.el.paused) this.deck.el.play().catch(() => {})
      return
    }
    this.stopExternal(settings.fadeMs)
    const el = document.createElement('audio')
    el.preload = 'auto'
    el.src = audioUrl(track.id)
    el.loop = settings.audioLoop !== false
    el.volume = 1
    let source
    let gain
    try {
      source = ctx.createMediaElementSource(el)
      gain = ctx.createGain()
      gain.gain.value = 0
      source.connect(gain)
      gain.connect(this.master)
    } catch {
      el.volume = clamp(settings.audioVolume, 0, 1)
      el.loop = settings.audioLoop !== false
      source = null
      gain = null
    }
    const deck = { el, source, gain, trackId: track.id, token: Date.now() }
    this.deck = deck
    const start = clamp(num(settings.audioStartMs, 0), 0, 24 * 60 * 60 * 1000) / 1000
    const begin = () => {
      if (this.deck !== deck) return
      if (start > 0 && Number.isFinite(el.duration) && el.duration > 0) {
        el.currentTime = Math.min(start, Math.max(0, el.duration - 0.15))
      }
      el.play().then(() => {
        if (gain) this.ramp(deck.gain.gain, clamp(settings.audioVolume, 0, 1), settings.fadeMs)
      }).catch(() => {
        this.blocked = true
        this.pendingExternal = { track, settings }
        this.studio.toast('warning', '浏览器拦截了音频播放；点击页面任意位置可恢复。')
      })
    }
    el.addEventListener('loadedmetadata', begin, { once: true })
    el.addEventListener('ended', () => {
      if (this.deck === deck) {
        this.deck = null
        this.studio.handleExternalAudioEnded()
        try {
          source?.disconnect()
          gain?.disconnect()
        } catch {
          /* ignore */
        }
      }
    }, { once: true })
    if (gain) this.ramp(gain.gain, 0, 1)
    el.load()
  }

  stopExternal(ms = 320) {
    const deck = this.deck
    if (!deck) return
    this.deck = null
    this.pendingExternal = null
    if (deck.gain) this.ramp(deck.gain.gain, 0, ms)
    else this.rampElement(deck.el, ms)
    window.setTimeout(() => {
      try {
        deck.el.pause()
        deck.el.removeAttribute('src')
        deck.el.load()
      } catch {
        /* ignore */
      }
      try {
        deck.source?.disconnect()
        deck.gain?.disconnect()
      } catch {
        /* ignore */
      }
    }, Math.max(80, ms + 60))
  }

  rampElement(el, ms) {
    if (!el) return
    const from = el.volume
    const start = performance.now()
    const duration = Math.max(30, ms)
    const tick = () => {
      const ratio = Math.min(1, (performance.now() - start) / duration)
      try {
        el.volume = Math.max(0, from * (1 - ratio))
      } catch {
        /* ignore */
      }
      if (ratio < 1 && !el.paused) window.setTimeout(tick, 30)
    }
    tick()
  }

  pauseExternal() {
    if (this.deck) this.deck.el.pause()
  }

  resumeExternal() {
    if (this.deck) this.deck.el.play().catch(() => {})
  }

  startPreview(track, onEnd) {
    this.ensure()
    this.stopPreview()
    const el = document.createElement('audio')
    el.preload = 'auto'
    el.src = audioUrl(track.id)
    el.volume = 0.9
    const previous = this.master ? this.master.gain.value : this.volume
    if (this.master) this.ramp(this.master.gain, previous * 0.22, 180)
    this.preview = { el, previous, onEnd }
    el.addEventListener('ended', () => this.stopPreview(), { once: true })
    el.play().catch(() => {
      this.studio.toast('warning', '无法试听这个音频文件。')
      this.stopPreview()
    })
  }

  stopPreview() {
    const preview = this.preview
    if (!preview) return
    this.preview = null
    try {
      preview.el.pause()
      preview.el.removeAttribute('src')
      preview.el.load()
    } catch {
      /* ignore */
    }
    if (this.master) this.ramp(this.master.gain, this.muted ? 0 : this.volume, 220)
    preview.onEnd?.()
  }

  setMuted(muted, options = {}) {
    this.muted = muted === true
    if (this.master && !this.startupSuppressed) this.ramp(this.master.gain, this.muted ? 0 : this.volume, options.fadeMs ?? 160)
    if (this.currentVideo) {
      // Keep the element's own muted flag consistent with the user's intent.
      this.currentVideo.muted = this.startupSuppressed ? true : this.muted
    }
  }

  setMasterVolume(volume) {
    this.volume = clamp(num(volume, 1), 0, 1)
    if (this.master && !this.muted && !this.startupSuppressed) this.ramp(this.master.gain, this.volume, 120)
  }

  /** Silence the restored background while a startup/preview owns the screen. */
  beginStartupSuppression() {
    this.startupSuppressionDepth += 1
    this.startupSuppressed = true
    this.ensure()
    if (this.master) this.ramp(this.master.gain, 0, 120)
    if (this.currentVideo) this.currentVideo.muted = true
  }

  /** Restore the persisted background audio state without resetting any setting. */
  endStartupSuppression() {
    this.startupSuppressionDepth = Math.max(0, this.startupSuppressionDepth - 1)
    this.startupSuppressed = this.startupSuppressionDepth > 0
    if (this.startupSuppressed) return
    if (this.master) this.ramp(this.master.gain, this.muted ? 0 : this.volume, 220)
    if (this.currentVideo) this.currentVideo.muted = this.muted
  }

  dispose() {
    this.stopExternal(0)
    this.stopPreview()
    document.removeEventListener('pointerdown', this.onUnlock, true)
    document.removeEventListener('keydown', this.onUnlock, true)
    for (const entry of this.videoEntries) {
      try {
        entry.source.disconnect()
        entry.gain.disconnect()
      } catch {
        /* ignore */
      }
    }
    this.videoEntries.clear()
    if (this.ctx) {
      this.ctx.close().catch(() => {})
      this.ctx = null
    }
  }
}

/* ---- 50-playlist.js ---- */
/* =========================================================================
 * 50-playlist — one timer, one advance() path. Dwell, media end, audio end
 * and manual next all converge here so they can never double-switch.
 * ========================================================================= */

class PlaylistEngine {
  constructor(studio) {
    this.studio = studio
    this.playlistId = null
    this.queue = []
    this.index = 0
    this.playing = false
    this.token = 0
    this.timer = 0
    this.deadline = 0
    this.startedAt = 0
    this.waitMode = 'fixed'
    this.pausedRemaining = 0
    this.bag = []
    this.currentAssetId = null
    this.attempts = 0
  }

  get playlist() {
    return this.studio.playlistById(this.playlistId)
  }

  currentItem() {
    return this.queue[this.index] ?? null
  }

  currentAsset() {
    return this.queue[this.index]?.asset ?? null
  }

  buildQueue() {
    const playlist = this.playlist
    if (!playlist) return []
    const queue = []
    let missing = 0
    for (const item of playlist.items) {
      const asset = this.studio.assetById(item.assetId)
      if (!asset) continue
      if (asset.missing) {
        missing += 1
        continue
      }
      queue.push({ item, asset })
    }
    if (missing > 0) {
      this.studio.toast('warning', `已跳过 ${missing} 个缺失文件。`)
    }
    return queue
  }

  resolveDwell(asset, item, settings) {
    const globalSeconds = this.studio.state.global.defaultDwellSeconds
    const useFixed = (seconds) => ({ mode: 'fixed', seconds: clamp(num(seconds, globalSeconds), 1, 86400) })
    const useMediaEnd = () => (asset.kind === 'video' ? { mode: 'mediaEnd' } : useFixed(item.dwellSeconds || globalSeconds))

    if (item.dwellMode === 'fixed') return useFixed(item.dwellSeconds)
    if (item.dwellMode === 'mediaEnd') return useMediaEnd()
    if (settings.dwellMode === 'fixed') return useFixed(settings.dwellSeconds)
    if (settings.dwellMode === 'mediaEnd') return useMediaEnd()
    return useMediaEnd()
  }

  async start(playlistId, startIndex = 0, options = {}) {
    this.playlistId = playlistId
    this.queue = this.buildQueue()
    if (this.queue.length === 0) {
      this.studio.toast('error', '这个轮播方案里没有可用素材。')
      return false
    }
    this.bag = []
    this.attempts = 0
    const desired = clamp(Math.trunc(num(startIndex, 0)), 0, this.queue.length - 1)
    this.index = desired
    await this.load(desired, { paused: options.paused === true })
    return true
  }

  async load(index, options = {}) {
    const token = ++this.token
    this.clearTimer()
    if (this.queue.length === 0) {
      this.queue = this.buildQueue()
      if (this.queue.length === 0) {
        this.stop({ keepBackground: true, silent: true })
        return false
      }
    }
    this.index = clamp(index, 0, this.queue.length - 1)
    const entry = this.queue[this.index]
    if (!entry) return false
    const { asset, item } = entry
    const settings = this.studio.settingsFor(asset.id)
    const dwell = this.resolveDwell(asset, item, settings)
    this.currentAssetId = asset.id
    this.startedAt = performance.now()
    this.deadline = 0
    this.waitMode = dwell.mode
    if (token !== this.token) return false

    let handle = null
    try {
      handle = await this.studio.renderer.show(asset, settings, { paused: options.paused === true })
    } catch (error) {
      if (token !== this.token) return false
      this.studio.toast('error', `跳过无法播放的素材：${asset.name}`)
      return this.skipBroken(token)
    }
    if (!handle || token !== this.token) return false

    this.attempts = 0
    this.playing = options.paused !== true
    this.studio.audio.applyForAsset(asset, settings, handle.video)
    asset.lastUsedAt = new Date().toISOString()

    if (this.playing) {
      this.arm(asset, settings, handle.video, dwell)
    } else {
      this.studio.renderer.pause()
      this.studio.audio.pauseExternal()
    }

    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
    return true
  }

  arm(asset, settings, video, dwell) {
    this.clearTimer()
    if (!this.playing) return
    if (dwell.mode === 'mediaEnd') {
      if (video && asset.kind === 'video') {
        video.loop = false
        this.waitMode = 'mediaEnd'
        this.deadline = 0
        return
      }
      const seconds = clamp(num(settings.dwellSeconds, this.studio.state.global.defaultDwellSeconds), 1, 86400)
      this.armFixed(seconds * 1000)
      return
    }
    const ms = Math.max(500, dwell.seconds * 1000)
    if (video && asset.kind === 'video') {
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : num(asset.duration, 0)
      if (duration > 0 && ms > duration * 1000 + 200) {
        video.loop = settings.loop !== false
      } else {
        video.loop = false
      }
    }
    this.armFixed(ms)
  }

  armFixed(ms) {
    this.clearTimer()
    const duration = Math.max(300, ms)
    this.startedAt = performance.now()
    this.deadline = this.startedAt + duration
    const token = this.token
    this.timer = window.setTimeout(() => {
      if (token !== this.token) return
      if (this.playing) this.advance('timer')
    }, duration)
  }

  clearTimer() {
    if (this.timer) {
      window.clearTimeout(this.timer)
      this.timer = 0
    }
    this.deadline = 0
  }

  rescheduleDwell() {
    if (!this.playing) return
    const entry = this.currentItem()
    if (!entry) return
    const settings = this.studio.settingsFor(entry.asset.id)
    this.arm(entry.asset, settings, this.studio.renderer.currentVideo, this.resolveDwell(entry.asset, entry.item, settings))
  }

  pause() {
    if (!this.playing) return
    if (this.deadline > 0) {
      this.pausedRemaining = Math.max(0, this.deadline - performance.now())
    } else {
      this.pausedRemaining = 0
    }
    this.playing = false
    this.token += 1
    this.studio.renderer?.invalidate()
    this.clearTimer()
    this.studio.renderer.pause()
    this.studio.audio.pauseExternal()
    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
  }

  resume() {
    if (this.playing) return
    if (!this.currentItem()) return
    this.playing = true
    const entry = this.currentItem()
    const settings = this.studio.settingsFor(entry.asset.id)
    this.studio.renderer.resume()
    this.studio.audio.resumeExternal()
    if (this.pausedRemaining > 300) {
      this.armFixed(this.pausedRemaining)
    } else {
      this.arm(entry.asset, settings, this.studio.renderer.currentVideo, this.resolveDwell(entry.asset, entry.item, settings))
    }
    this.pausedRemaining = 0
    this.updateRuntime()
    this.studio.scheduleSave()
    this.studio.emit()
  }

  stop(options = {}) {
    this.playing = false
    this.token += 1
    this.studio.renderer?.invalidate()
    this.clearTimer()
    this.pausedRemaining = 0
    this.studio.audio?.stopExternal(260)
    if (options.keepBackground !== true) {
      this.studio.renderer?.hide()
      this.currentAssetId = null
      this.queue = []
      this.index = 0
    } else {
      this.studio.renderer?.pause()
    }
    this.updateRuntime()
    if (!options.silent) {
      this.studio.scheduleSave()
      this.studio.emit()
    }
  }

  updateRuntime() {
    const playlist = this.playlist
    this.studio.state.runtime = {
      mode: 'playlist',
      assetId: this.currentAssetId,
      playlistId: this.playlistId,
      itemIndex: this.index,
      playing: this.playing,
      updatedAt: Date.now(),
    }
    if (playlist) playlist.updatedAt = new Date().toISOString()
  }

  async advance(reason) {
    if (this.queue.length === 0) return
    const next = this.nextIndex()
    if (next === -1) {
      this.stop({ keepBackground: true })
      return
    }
    await this.load(next)
  }

  nextIndex() {
    const playlist = this.playlist
    if (!playlist) return -1
    const length = this.queue.length
    if (length <= 0) return -1
    if (playlist.shuffle === 'random') {
      if (length === 1) return 0
      let candidate = this.index
      for (let guard = 0; guard < 20 && candidate === this.index; guard += 1) {
        candidate = Math.floor(Math.random() * length)
      }
      return candidate
    }
    if (playlist.shuffle === 'noRepeat') {
      if (this.bag.length === 0) {
        this.bag = Array.from({ length }, (_, index) => index)
        for (let index = this.bag.length - 1; index > 0; index -= 1) {
          const swap = Math.floor(Math.random() * (index + 1))
          const value = this.bag[index]
          this.bag[index] = this.bag[swap]
          this.bag[swap] = value
        }
        if (length > 1 && this.bag[0] === this.index) {
          const first = this.bag[0]
          this.bag[0] = this.bag[this.bag.length - 1]
          this.bag[this.bag.length - 1] = first
        }
      }
      return this.bag.shift() ?? 0
    }
    if (this.index + 1 < length) return this.index + 1
    return playlist.loop === false ? -1 : 0
  }

  next(reason = 'manual') {
    if (this.queue.length === 0) return
    const next = this.nextIndex()
    if (next === -1) {
      this.stop({ keepBackground: true })
      return
    }
    this.load(next)
  }

  previous() {
    if (this.queue.length === 0) return
    const length = this.queue.length
    const previous = this.index > 0 ? this.index - 1 : this.playlist?.loop === false ? 0 : length - 1
    this.load(previous)
  }

  handleMediaEnded(video) {
    if (!this.playing) return
    if (video !== this.studio.renderer.currentVideo) return
    if (this.waitMode === 'mediaEnd') this.advance('mediaEnd')
    // A fixed dwell longer than the video intentionally freezes the last frame;
    // the timer remains the only switch trigger.
  }

  handleAudioEnded() {
    const entry = this.currentItem()
    if (!entry || !this.playing) return
    const settings = this.studio.settingsFor(entry.asset.id)
    if (settings.audioEndAction === 'next') this.advance('audioEnd')
  }

  async skipBroken(token) {
    this.attempts += 1
    if (token !== this.token) return false
    if (this.attempts > this.queue.length + 1) {
      this.studio.toast('error', '轮播中的所有素材都无法播放，已停止。')
      this.stop({ keepBackground: true })
      return false
    }
    const next = (this.index + 1) % this.queue.length
    return this.load(next)
  }

  handleMediaError(assetId) {
    if (!this.playing) return
    if (assetId !== this.currentAssetId) return
    window.setTimeout(() => {
      if (this.playing && assetId === this.currentAssetId) {
        const next = (this.index + 1) % Math.max(1, this.queue.length)
        this.load(next)
      }
    }, 700)
  }

  refreshQueue() {
    const currentId = this.currentAssetId
    this.queue = this.buildQueue()
    if (this.queue.length === 0) {
      this.stop({ keepBackground: true })
      return
    }
    const found = this.queue.findIndex((entry) => entry.asset.id === currentId)
    this.index = found >= 0 ? found : clamp(this.index, 0, this.queue.length - 1)
    this.bag = []
  }

  progress() {
    if (!this.playing || this.deadline <= 0) return null
    const now = performance.now()
    const total = Math.max(1, this.deadline - this.startedAt)
    const elapsed = clamp(now - this.startedAt, 0, total)
    return {
      elapsed,
      total,
      remaining: Math.max(0, this.deadline - now),
      ratio: elapsed / total,
    }
  }

  dispose() {
    this.clearTimer()
    this.playing = false
  }
}

/* ---- 55-startup.js ---- */
/* =========================================================================
 * 55-startup — startup animation controller.
 *
 * Mode A: a frame-wide, window-internal overlay above the app.
 * Mode B: a temporary layer inside the existing background stage, behind the
 *          DSH UI; it fades away to reveal the already-running background.
 *
 * The controller never re-creates the background/playlist/audio graph. It only
 * suppresses the master background gain while the startup owns the screen.
 * ========================================================================= */

class StartupController {
  constructor(studio, options = {}) {
    this.studio = studio
    this.kind = options.kind === 'preview' ? 'preview' : 'startup'
    this.active = null
    this.layer = null
    this.controls = null
    this.media = null
    this.audioEl = null
    this.endTimer = 0
    this.holdTimer = 0
    this.fadeTimer = 0
    this.backgroundPromise = Promise.resolve()
    this.sessionKey = 'dbs.startup.bootId'
    this.legacySessionKey = 'dbs.startup.consumed'
    this.memoryConsumed = false
    this.started = false
    this.phase = 'idle'
    this.onKey = (event) => {
      if (!this.active) return
      if (this.kind === 'startup' && this.studio.startupPreview?.active) return
      if (event.key === 'Escape' || event.key === 'Esc') {
        event.preventDefault()
        this.complete('skip')
        return
      }
      if ((event.key === ' ' || event.key === 'Enter') && this.studio.state.startupAnimation.skip) {
        event.preventDefault()
        this.complete('skip')
      }
    }
  }

  config() {
    return this.studio.state.startupAnimation
  }

  sessionConsumed() {
    if (this.memoryConsumed) return true
    const bootId = this.studio.bootId
    try {
      if (bootId) return window.sessionStorage.getItem(this.sessionKey) === bootId
      // Compatibility with an older Host that does not expose bootId.
      return window.sessionStorage.getItem(this.legacySessionKey) === '1'
    } catch {
      return false
    }
  }

  markSessionConsumed() {
    this.memoryConsumed = true
    const bootId = this.studio.bootId
    try {
      if (bootId) window.sessionStorage.setItem(this.sessionKey, bootId)
      else window.sessionStorage.setItem(this.legacySessionKey, '1')
    } catch {
      /* the in-memory marker still prevents a second run in this page */
    }
  }

  resetSession() {
    this.memoryConsumed = false
    try {
      window.sessionStorage.removeItem(this.sessionKey)
      window.sessionStorage.removeItem(this.legacySessionKey)
    } catch {
      /* ignore */
    }
  }

  setBackgroundPromise(promise) {
    this.backgroundPromise = promise ?? Promise.resolve()
  }

  candidates() {
    const config = this.config()
    return config.items
      .filter((item) => item.enabled !== false)
      .map((item) => ({ item, asset: this.studio.assetById(item.assetId) }))
      .filter(({ asset }) => asset && !asset.missing && (asset.kind === 'video' || asset.kind === 'gif'))
  }

  /** Decide once per boot; returns a plan or null. */
  prepare() {
    if (this.kind !== 'startup') return null
    // The injected boot script owns the formal startup so its overlay can be
    // on screen before the app bundle. This controller is only the fallback
    // for a Host that does not deliver index injections.
    if (window.__DBS_BOOT__?.decided === true) return null
    const config = this.config()
    // Do not consume the boot marker here. A page may be created and reloaded
    // before the overlay is actually shown; marking at decision time causes a
    // real cold start to be skipped. The marker is written when a formal
    // startup actually begins (and again once playback starts).
    if (!config.enabled) return null
    if (this.sessionConsumed()) return null
    if (config.trigger === 'firstLaunch' && config.firstRunDone) return null
    const list = this.candidates()
    if (list.length === 0) {
      if (config.enabled) this.studio.toast('warning', '启动动画已启用，但没有可用的 MP4/GIF 素材，已直接进入主界面。')
      return null
    }
    const chosen = config.trigger === 'random'
      ? list[Math.floor(Math.random() * list.length)]
      : list[0]
    return { item: chosen.item, asset: chosen.asset }
  }

  begin(plan, options = {}) {
    if (this.active || !plan) return false
    const preview = options.preview === true
    const config = this.config()
    this.active = {
      plan,
      preview,
      mode: preview ? 'fullscreen' : config.mode,
      config,
      reason: '',
    }
    this.started = false
    this.phase = 'loading'
    this.studio.audio.beginStartupSuppression()
    this.buildLayer()
    this.attachKeys()
    if (!preview && this.kind === 'startup') this.markSessionConsumed()
    this.playMedia().catch((error) => this.fail(error))
    return true
  }

  preview(item, asset) {
    if (this.active) return false
    return this.begin({ item, asset }, { preview: true })
  }

  buildLayer() {
    const { plan, mode, preview } = this.active
    const asset = plan.asset
    const config = this.active.config
    const layer = document.createElement('div')
    layer.className = mode === 'fullscreen' ? 'dbs-startup-overlay' : 'dbs-startup-layer'
    layer.id = mode === 'fullscreen' ? 'dbs-startup-overlay' : 'dbs-startup-layer'
    layer.dataset.mode = mode
    layer.dataset.preview = preview ? '1' : '0'
    layer.style.opacity = '0'
    layer.style.transitionProperty = 'opacity'
    layer.style.transitionTimingFunction = 'ease'
    layer.style.transitionDuration = `${clamp(num(config.fadeInMs, 500), 0, 5000)}ms`
    layer.style.backgroundSize = 'cover'
    layer.style.backgroundPosition = 'center center'
    layer.style.backgroundRepeat = 'no-repeat'
    if (asset.thumb && asset.kind !== 'video') layer.style.backgroundImage = `url("${thumbUrl(asset)}")`

    const mediaWrap = document.createElement('div')
    mediaWrap.className = 'dbs-startup-media'
    const media = asset.kind === 'video' ? document.createElement('video') : document.createElement('img')
    media.className = 'dbs-startup-asset'
    media.setAttribute('aria-hidden', 'true')
    if (asset.kind === 'video') {
      media.src = mediaUrl(asset.id)
      media.preload = 'auto'
      media.playsInline = true
      media.loop = false
      media.muted = config.audio.mode !== 'video'
      media.volume = clamp(num(config.audio.volume, 1), 0, 1)
    } else {
      media.src = mediaUrl(asset.id)
      media.alt = ''
      media.draggable = false
    }
    media.style.objectFit = config.display === 'contain' ? 'contain' : config.display === 'center' ? 'none' : 'cover'
    media.style.objectPosition = 'center center'
    mediaWrap.appendChild(media)
    layer.appendChild(mediaWrap)

    if (mode === 'fullscreen') {
      const hint = document.createElement('div')
      hint.className = 'dbs-startup-hint'
      hint.textContent = preview ? '启动动画预览' : '正在启动'
      layer.appendChild(hint)
      if (config.skip || preview) layer.appendChild(this.makeSkipButton(preview))
      document.body.appendChild(layer)
    } else {
      this.studio.renderer.beginStartupBackground()
      this.studio.renderer.root.appendChild(layer)
      const controls = document.createElement('div')
      controls.className = 'dbs-startup-controls'
      if (config.skip) controls.appendChild(this.makeSkipButton(false))
      document.body.appendChild(controls)
      this.controls = controls
    }

    this.layer = layer
    this.media = media
  }

  makeSkipButton(preview) {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'dbs-startup-skip'
    button.textContent = preview ? '关闭预览' : '跳过启动动画'
    const stop = (event) => {
      event.preventDefault()
      event.stopPropagation()
      this.complete('skip')
    }
    // pointerdown is more reliable than click if a transparent always-on-top
    // helper window (for example the desktop pet) overlaps part of the screen.
    // pointerdown also avoids waiting for a full click gesture.
    button.addEventListener('pointerdown', stop)
    button.addEventListener('click', stop)
    this.skipButton = button
    return button
  }

  attachKeys() {
    document.addEventListener('keydown', this.onKey, true)
  }

  detachKeys() {
    document.removeEventListener('keydown', this.onKey, true)
  }

  async playMedia() {
    const { plan, preview } = this.active
    const asset = plan.asset
    const config = this.active.config
    const isVideo = asset.kind === 'video'

    if (isVideo) {
      try {
        if (this.media.readyState < 2) await waitForEvent(this.media, 'loadeddata', 12000)
        try {
          await this.media.play()
        } catch {
          this.media.muted = true
          await this.media.play()
          this.studio.toast('warning', '系统拦截了启动动画自动播放，已静音播放。')
        }
      } catch (error) {
        throw new Error(`视频加载失败：${error instanceof Error ? error.message : String(error)}`)
      }
    } else {
      if (!(this.media.complete && this.media.naturalWidth > 0)) {
        await waitForEvent(this.media, 'load', 12000)
      }
    }

    if (!this.active) return
    this.started = true
    this.studio.markTimeline?.('startup-media-ready', asset.kind)
    if (this.layer && this.layer.style.backgroundImage) {
      const posterLayer = this.layer
      window.setTimeout(() => {
        if (this.layer === posterLayer && this.active) posterLayer.style.backgroundImage = 'none'
      }, 600)
    }
    await this.startAudio()

    if (!this.active) return
    const layer = this.layer
    if (layer) {
      const fadeIn = clamp(num(config.fadeInMs, 500), 0, 5000)
      if (fadeIn <= 0) layer.style.opacity = '1'
      else requestAnimationFrame(() => {
        if (this.layer === layer) layer.style.opacity = '1'
      })
    }
    if (!preview && this.kind === 'startup') {
      if (!config.firstRunDone) {
        config.firstRunDone = true
        this.studio.scheduleSave(300)
      }
      this.markSessionConsumed()
    }
    const target = this.targetDuration(asset)
    this.phase = 'playing'
    this.endTimer = window.setTimeout(() => this.complete('timer'), target)
  }

  targetDuration(asset) {
    const config = this.active.config
    if (config.durationMode === 'custom') return clamp(num(config.customSeconds, 8) * 1000, 500, 300000)
    const mediaDuration = asset.kind === 'video' && this.media && Number.isFinite(this.media.duration) ? this.media.duration : 0
    if (mediaDuration > 0) return clamp(mediaDuration * 1000, 500, 300000)
    if (asset.duration > 0) return clamp(asset.duration * 1000, 500, 300000)
    return 8000
  }

  async startAudio() {
    const { plan } = this.active
    const asset = plan.asset
    const config = this.active.config
    const mode = config.audio.mode
    const volume = clamp(num(config.audio.volume, 1), 0, 1)
    if (mode === 'mute') {
      if (asset.kind === 'video') this.media.muted = true
      return
    }
    if (mode === 'video') {
      if (asset.kind === 'video') {
        this.media.muted = false
        this.media.volume = volume
      }
      return
    }
    if (mode === 'external') {
      if (asset.kind === 'video') this.media.muted = true
      const track = this.studio.audioById(config.audio.audioId)
      if (!track || track.missing) {
        this.studio.toast('warning', '启动动画关联的音频不可用，已静音播放。')
        return
      }
      const audio = document.createElement('audio')
      audio.preload = 'auto'
      audio.src = audioUrl(track.id)
      audio.volume = volume
      audio.loop = false
      this.audioEl = audio
      try {
        await audio.play()
      } catch {
        this.studio.toast('warning', '启动动画音频被自动播放策略拦截。')
      }
    }
  }

  stopStartupAudio() {
    if (this.audioEl) {
      try {
        this.audioEl.pause()
        this.audioEl.removeAttribute('src')
        this.audioEl.load()
      } catch {
        /* ignore */
      }
      this.audioEl = null
    }
    if (this.media && this.media.tagName === 'VIDEO') {
      try {
        this.media.muted = true
      } catch {
        /* ignore */
      }
    }
  }

  complete(reason) {
    if (!this.active || this.phase === 'leaving' || this.phase === 'finished') return
    this.phase = 'holding'
    this.clearTimers()
    const config = this.active.config
    if (this.active.preview || reason === 'skip') {
      this.leave(reason)
      return
    }
    if (this.active.mode === 'background' && config.holdMs > 0) {
      this.holdTimer = window.setTimeout(() => this.leave(reason), clamp(num(config.holdMs, 0), 0, 10000))
      return
    }
    this.leave(reason)
  }

  async leave(reason) {
    if (!this.active) return
    this.phase = 'leaving'
    this.clearTimers()
    const active = this.active
    const config = active.config
    const fade = reason === 'skip' ? Math.min(300, clamp(num(config.fadeOutMs, 700), 0, 5000)) : clamp(num(config.fadeOutMs, 700), 0, 5000)
    if (!active.preview) {
      // Do not reveal a blank/default stage while the restored background is
      // still loading. A skip gets a much shorter grace period.
      const waitMs = reason === 'skip' ? 1500 : 8000
      this.studio.markTimeline?.('startup-wait-background', `max ${waitMs}ms`)
      await Promise.race([this.backgroundPromise, sleep(waitMs)]).catch(() => {})
      this.studio.markTimeline?.('startup-background-wait-done')
    }
    if (!this.active || this.active !== active) return
    if (this.layer) {
      this.layer.style.transitionDuration = `${fade}ms`
      this.layer.style.opacity = '0'
    }
    if (this.skipButton) this.skipButton.disabled = true
    this.fadeTimer = window.setTimeout(() => this.finish(reason), fade + 80)
  }

  finish(reason) {
    if (!this.active) return
    const active = this.active
    this.active = null
    this.phase = 'finished'
    this.clearTimers()
    this.detachKeys()
    this.stopStartupAudio()
    if (this.media) {
      try {
        this.media.pause?.()
        this.media.removeAttribute('src')
        this.media.load?.()
      } catch {
        /* ignore */
      }
      this.media = null
    }
    if (this.layer?.parentNode) this.layer.parentNode.removeChild(this.layer)
    this.layer = null
    if (this.controls?.parentNode) this.controls.parentNode.removeChild(this.controls)
    this.controls = null
    this.skipButton = null
    if (active.mode === 'background') this.studio.renderer?.endStartupBackground()
    this.studio.audio.endStartupSuppression()
    if (active.preview) {
      this.studio.emit()
      return
    }
    this.studio.markTimeline?.('startup-finished', reason)
    if (reason === 'error') this.studio.toast('error', '启动动画播放失败，已跳过。')
    this.studio.scheduleSave(300)
    this.studio.emit()
  }

  fail(error) {
    if (!this.active) return
    console.warn('[dsh-background-studio] startup animation failed', error)
    this.active.reason = 'error'
    this.finish('error')
  }

  stopIfItem(itemId) {
    if (this.active?.plan?.item?.id !== itemId) return
    this.finish('removed')
  }

  stopIfAsset(assetId) {
    if (this.active?.plan?.asset?.id !== assetId) return
    this.finish('removed')
  }

  clearTimers() {
    if (this.endTimer) window.clearTimeout(this.endTimer)
    if (this.holdTimer) window.clearTimeout(this.holdTimer)
    if (this.fadeTimer) window.clearTimeout(this.fadeTimer)
    this.endTimer = 0
    this.holdTimer = 0
    this.fadeTimer = 0
  }

  dispose() {
    this.clearTimers()
    this.detachKeys()
    if (this.active) this.finish('dispose')
    if (this.layer?.parentNode) this.layer.parentNode.removeChild(this.layer)
    if (this.controls?.parentNode) this.controls.parentNode.removeChild(this.controls)
    this.layer = null
    this.controls = null
    this.media = null
    this.audioEl = null
    this.active = null
  }
}

/* ---- 60-ui-panel.js ---- */
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

/* ---- 61-ui-playlist.js ---- */
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

/* ---- 62-ui-misc.js ---- */
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

/* ---- 63-ui-quickbar.js ---- */
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

/* ---- 64-ui-startup.js ---- */
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

/* ---- 70-apply.js ---- */
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

    return { name: 'dsh-background-studio', inject: ['slots'], apply }
  },
});
