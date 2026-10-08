// ============================================================
// EDITOR STORE — Zustand
// Manages transient editor UI state (selection, canvas, drag, etc.)
// NOT persisted to document
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import type {
  EditorMode,
  SelectionState,
  CanvasTransform,
  DragState,
  ResizeState,
  ContextMenuState,
  PanelVisibility,
} from '../types'

interface EditorStore {
  mode: EditorMode

  selection: SelectionState
  canvas: CanvasTransform
  hoveredComponentId: string | null
  hoveredFrameId: string | null
  drag: DragState
  resize: ResizeState
  contextMenu: ContextMenuState
  panels: PanelVisibility
  rightPanelTab: 'properties' | 'layout' | 'states' | 'interactions' | 'animation'

  // Active page (driven by selection or explicit navigation)
  activePageId: string | null
  activeFrameId: string | null

  // ── Mode ─────────────────────────────
  setMode: (mode: EditorMode) => void

  // ── Page / Frame navigation ───────────
  setActivePage: (pageId: string | null) => void
  setActiveFrame: (frameId: string | null) => void

  // ── Selection ─────────────────────────
  selectComponent: (pageId: string, frameId: string, componentId: string, addToSelection?: boolean) => void
  selectFrame: (pageId: string, frameId: string) => void
  clearSelection: () => void
  deselectComponent: (componentId: string) => void

  // ── Canvas ────────────────────────────
  setCanvasZoom: (zoom: number) => void
  setCanvasPan: (x: number, y: number) => void
  panCanvas: (dx: number, dy: number) => void
  resetCanvas: () => void

  // ── Hover ─────────────────────────────
  setHoveredComponent: (id: string | null) => void
  setHoveredFrame: (id: string | null) => void

  // ── Drag ──────────────────────────────
  startDragFromLibrary: (componentType: string, x: number, y: number) => void
  startDragComponent: (componentId: string, x: number, y: number) => void
  updateDrag: (x: number, y: number) => void
  setDragGhost: (col: number, row: number, colSpan: number, rowSpan: number) => void
  endDrag: () => void

  // ── Resize ────────────────────────────
  startResize: (componentId: string, handle: ResizeState['handle'], x: number, y: number, w: number, h: number) => void
  updateResize: (x: number, y: number) => void
  endResize: () => void

  // ── Context Menu ──────────────────────
  openContextMenu: (x: number, y: number, targetType: ContextMenuState['targetType'], targetId: string | null) => void
  closeContextMenu: () => void

  // ── Panels ────────────────────────────
  togglePanel: (panel: keyof PanelVisibility) => void
  setRightPanelTab: (tab: EditorStore['rightPanelTab']) => void
}

const INITIAL_DRAG: DragState = {
  isDragging: false,
  startX: 0,
  startY: 0,
  currentX: 0,
  currentY: 0,
}

const INITIAL_RESIZE: ResizeState = {
  isResizing: false,
  startX: 0,
  startY: 0,
  startWidth: 0,
  startHeight: 0,
}

export const useEditorStore = create<EditorStore>()(
  immer((set) => ({
    mode: 'design',

    selection: { pageId: null, frameId: null, componentIds: [] },
    canvas: { x: 0, y: 0, zoom: 1 },
    hoveredComponentId: null,
    hoveredFrameId: null,
    drag: INITIAL_DRAG,
    resize: INITIAL_RESIZE,
    contextMenu: { isOpen: false, x: 0, y: 0, targetType: null, targetId: null },
    panels: { leftPanel: true, rightPanel: true, toolbar: true, statusBar: true },
    rightPanelTab: 'properties',
    activePageId: null,
    activeFrameId: null,

    // ── Mode ──────────────────────────────

    setMode: (mode) => set(s => { s.mode = mode }),

    // ── Page / Frame navigation ───────────

    setActivePage: (pageId) => set(s => {
      s.activePageId = pageId
      s.selection = { pageId, frameId: null, componentIds: [] }
    }),

    setActiveFrame: (frameId) => set(s => {
      s.activeFrameId = frameId
      if (s.activePageId) {
        s.selection = { pageId: s.activePageId, frameId, componentIds: [] }
      }
    }),

    // ── Selection ─────────────────────────

    selectComponent: (pageId, frameId, componentId, addToSelection = false) => set(s => {
      s.activePageId = pageId
      s.activeFrameId = frameId
      if (addToSelection) {
        if (!s.selection.componentIds.includes(componentId)) {
          s.selection.componentIds.push(componentId)
        }
      } else {
        s.selection = { pageId, frameId, componentIds: [componentId] }
      }
    }),

    selectFrame: (pageId, frameId) => set(s => {
      s.activePageId = pageId
      s.activeFrameId = frameId
      s.selection = { pageId, frameId, componentIds: [] }
    }),

    clearSelection: () => set(s => {
      s.selection.componentIds = []
      s.selection.frameId = null
    }),

    deselectComponent: (componentId) => set(s => {
      s.selection.componentIds = s.selection.componentIds.filter(id => id !== componentId)
    }),

    // ── Canvas ────────────────────────────

    setCanvasZoom: (zoom) => set(s => { s.canvas.zoom = Math.max(0.1, Math.min(5, zoom)) }),

    setCanvasPan: (x, y) => set(s => { s.canvas.x = x; s.canvas.y = y }),

    panCanvas: (dx, dy) => set(s => { s.canvas.x += dx; s.canvas.y += dy }),

    resetCanvas: () => set(s => { s.canvas = { x: 0, y: 0, zoom: 1 } }),

    // ── Hover ─────────────────────────────

    setHoveredComponent: (id) => set(s => { s.hoveredComponentId = id }),
    setHoveredFrame: (id) => set(s => { s.hoveredFrameId = id }),

    // ── Drag ──────────────────────────────

    startDragFromLibrary: (componentType, x, y) => set(s => {
      s.drag = { isDragging: true, componentType, startX: x, startY: y, currentX: x, currentY: y }
    }),

    startDragComponent: (componentId, x, y) => set(s => {
      s.drag = { isDragging: true, componentId, startX: x, startY: y, currentX: x, currentY: y }
    }),

    updateDrag: (x, y) => set(s => {
      s.drag.currentX = x
      s.drag.currentY = y
    }),

    setDragGhost: (col, row, colSpan, rowSpan) => set(s => {
      s.drag.ghostGridColumn = col
      s.drag.ghostGridRow = row
      s.drag.ghostColumnSpan = colSpan
      s.drag.ghostRowSpan = rowSpan
    }),

    endDrag: () => set(s => { s.drag = INITIAL_DRAG }),

    // ── Resize ────────────────────────────

    startResize: (componentId, handle, x, y, w, h) => set(s => {
      s.resize = { isResizing: true, componentId, handle, startX: x, startY: y, startWidth: w, startHeight: h }
    }),

    updateResize: (_x, _y) => {
      // Delta updates applied via canvas drag handles
    },

    endResize: () => set(s => { s.resize = INITIAL_RESIZE }),

    // ── Context Menu ──────────────────────

    openContextMenu: (x, y, targetType, targetId) => set(s => {
      s.contextMenu = { isOpen: true, x, y, targetType, targetId }
    }),

    closeContextMenu: () => set(s => {
      s.contextMenu.isOpen = false
    }),

    // ── Panels ────────────────────────────

    togglePanel: (panel) => set(s => {
      s.panels[panel] = !s.panels[panel]
    }),

    setRightPanelTab: (tab) => set(s => {
      s.rightPanelTab = tab
    }),
  }))
)
