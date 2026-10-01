// ============================================================
// CONTEXT MENU — Phase 7 + 8
// Right-click contextual actions
// Architecture Rule A: shares the same document model as Right Panel
// ============================================================

import React, { useEffect, useRef } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'
import { useSharedComponentStore } from '../../store/sharedComponentStore'
import type { LayoutMode } from '../../types'

export const ContextMenu: React.FC = () => {
  const menuRef = useRef<HTMLDivElement>(null)
  const contextMenu = useEditorStore(s => s.contextMenu)
  const closeContextMenu = useEditorStore(s => s.closeContextMenu)
  const selection = useEditorStore(s => s.selection)
  const activePageId = useEditorStore(s => s.activePageId)
  const activeFrameId = useEditorStore(s => s.activeFrameId)
  const setRightPanelTab = useEditorStore(s => s.setRightPanelTab)

  const deleteComponent = useProjectStore(s => s.deleteComponent)
  const duplicateComponent = useProjectStore(s => s.duplicateComponent)
  const setLayoutMode = useProjectStore(s => s.setLayoutMode)
  const updateGrid = useProjectStore(s => s.updateGrid)
  const project = useProjectStore(s => s.project)

  const createSharedComponent = useSharedComponentStore(s => s.createSharedComponent)

  const activeFrame = useProjectStore(s => {
    const pid = useEditorStore.getState().activePageId
    const fid = useEditorStore.getState().activeFrameId
    return pid && fid
      ? s.project?.pages.find(p => p.id === pid)?.frames.find(f => f.id === fid)
      : undefined
  })

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeContextMenu()
      }
    }
    if (contextMenu.isOpen) {
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }
  }, [contextMenu.isOpen, closeContextMenu])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeContextMenu()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [closeContextMenu])

  if (!contextMenu.isOpen) return null

  const pageId = selection.pageId ?? activePageId
  const frameId = selection.frameId ?? activeFrameId
  const grid = activeFrame?.grid

  // ── Component context menu ─────────────
  if (contextMenu.targetType === 'component') {
    const componentId = contextMenu.targetId

    // Find the selected component
    const component = pageId && frameId
      ? project?.pages.find(p => p.id === pageId)?.frames.find(f => f.id === frameId)?.children.find(c => c.id === componentId)
      : undefined

    const items = [
      {
        label: 'Duplicate',
        shortcut: 'Ctrl+D',
        action: () => {
          if (pageId && frameId && componentId) duplicateComponent(pageId, frameId, componentId)
          closeContextMenu()
        },
      },
      {
        label: 'Delete',
        shortcut: 'Del',
        danger: true,
        action: () => {
          if (pageId && frameId && componentId) deleteComponent(pageId, frameId, componentId)
          closeContextMenu()
        },
      },
      { divider: true },
      {
        label: 'Create Shared Component',
        action: () => {
          if (component) {
            const name = prompt('Shared component name:', component.name ?? component.componentType)
            if (name) {
              createSharedComponent(name, component)
            }
          }
          closeContextMenu()
        },
      },
      { divider: true },
      {
        label: 'Edit Interactions',
        action: () => { setRightPanelTab('interactions'); closeContextMenu() },
      },
      {
        label: 'Edit States',
        action: () => { setRightPanelTab('states'); closeContextMenu() },
      },
      { divider: true },
      { label: 'Bring Forward', disabled: true },
      { label: 'Send Backward', disabled: true },
    ]

    return <MenuPopup items={items} x={contextMenu.x} y={contextMenu.y} ref={menuRef} />
  }

  // ── Frame context menu ─────────────────
  if (contextMenu.targetType === 'frame') {
    const setMode = (mode: LayoutMode) => {
      if (pageId && frameId) setLayoutMode(pageId, frameId, mode)
      closeContextMenu()
    }

    const items = [
      { label: 'LAYOUT', disabled: true, header: true },
      { label: `  Freeform${activeFrame?.layoutMode === 'freeform' ? ' ✓' : ''}`, action: () => setMode('freeform') },
      { label: `  Grid${activeFrame?.layoutMode === 'grid' ? ' ✓' : ''}`, action: () => setMode('grid') },
      { label: `  Auto Layout${activeFrame?.layoutMode === 'auto' ? ' ✓' : ''}`, action: () => setMode('auto') },
      { divider: true },
      {
        label: 'Grid Settings...',
        action: () => { setRightPanelTab('layout'); closeContextMenu() },
      },
      ...(grid ? [
        { label: `Columns: ${grid.columns}`, disabled: true },
        { label: `Rows: ${grid.rows}`, disabled: true },
        { label: `Gap: ${grid.columnGap}px`, disabled: true },
      ] : []),
      { divider: true },
      {
        label: `${grid?.showGrid ? '✓ ' : ''}Show Grid`,
        action: () => { if (pageId && frameId) updateGrid(pageId, frameId, { showGrid: !grid?.showGrid }); closeContextMenu() },
      },
      {
        label: `${grid?.snap ? '✓ ' : ''}Snap to Grid`,
        action: () => { if (pageId && frameId) updateGrid(pageId, frameId, { snap: !grid?.snap }); closeContextMenu() },
      },
      {
        label: `${grid?.autoPlace ? '✓ ' : ''}Auto Placement`,
        action: () => { if (pageId && frameId) updateGrid(pageId, frameId, { autoPlace: !grid?.autoPlace }); closeContextMenu() },
      },
    ]

    return <MenuPopup items={items} x={contextMenu.x} y={contextMenu.y} ref={menuRef} />
  }

  // ── Canvas context menu ────────────────
  const items = [
    { label: 'Add Page', disabled: true },
    { label: 'Paste', shortcut: 'Ctrl+V', disabled: true },
  ]
  return <MenuPopup items={items} x={contextMenu.x} y={contextMenu.y} ref={menuRef} />
}

// ─────────────────────────────────────────
// Menu popup component
// ─────────────────────────────────────────

interface MenuItem {
  label?: string
  shortcut?: string
  action?: () => void
  divider?: boolean
  disabled?: boolean
  danger?: boolean
  header?: boolean
}

const MenuPopup = React.forwardRef<HTMLDivElement, {
  items: MenuItem[]
  x: number
  y: number
}>(({ items, x, y }, ref) => {
  // Clamp to viewport
  const safeX = Math.min(x, window.innerWidth - 210)
  const safeY = Math.min(y, window.innerHeight - items.length * 32)

  return (
    <div
      ref={ref}
      className="fixed z-50 bg-[#313244] border border-[#45475a] rounded-lg shadow-2xl py-1 min-w-[200px]"
      style={{ left: safeX, top: safeY }}
    >
      {items.map((item, i) => {
        if (item.divider) {
          return <div key={i} className="my-1 border-t border-[#45475a]" />
        }
        if (item.header) {
          return (
            <div key={i} className="px-3 py-1 text-[10px] text-[#45475a] uppercase tracking-widest">
              {item.label}
            </div>
          )
        }
        return (
          <button
            key={i}
            onClick={item.action}
            disabled={item.disabled}
            className={`w-full flex items-center justify-between px-3 py-1.5 text-xs text-left transition-colors ${
              item.disabled
                ? 'text-[#45475a] cursor-not-allowed'
                : item.danger
                ? 'text-red-400 hover:bg-red-500/20'
                : 'text-[#cdd6f4] hover:bg-[#89b4fa]/20 hover:text-[#89b4fa]'
            }`}
          >
            <span>{item.label}</span>
            {item.shortcut && (
              <span className="text-[#585b70] text-[10px] ml-4">{item.shortcut}</span>
            )}
          </button>
        )
      })}
    </div>
  )
})
MenuPopup.displayName = 'MenuPopup'
