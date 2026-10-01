// ============================================================
// EDITOR STATE TYPES
// ─ Transient UI state (not part of the saved document)
// ============================================================

export type EditorMode = 'design' | 'flow' | 'preview'

export interface SelectionState {
  pageId: string | null
  frameId: string | null
  componentIds: string[]
}

export interface CanvasTransform {
  x: number      // pan X offset in pixels
  y: number      // pan Y offset in pixels
  zoom: number   // scale factor (1 = 100%)
}

export interface DragState {
  isDragging: boolean
  componentType?: string          // when dragging from library
  componentId?: string            // when moving existing component
  startX: number
  startY: number
  currentX: number
  currentY: number
  ghostGridColumn?: number        // grid preview column
  ghostGridRow?: number           // grid preview row
  ghostColumnSpan?: number
  ghostRowSpan?: number
}

export interface ResizeState {
  isResizing: boolean
  componentId?: string
  handle?: 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw'
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

export interface ContextMenuState {
  isOpen: boolean
  x: number
  y: number
  targetType: 'canvas' | 'frame' | 'component' | null
  targetId: string | null
}

export interface PanelVisibility {
  leftPanel: boolean
  rightPanel: boolean
  toolbar: boolean
  statusBar: boolean
}

export interface EditorState {
  mode: EditorMode

  // Which project is loaded
  activeProjectId: string | null

  // Selection
  selection: SelectionState

  // Canvas viewport
  canvas: CanvasTransform

  // Hover state
  hoveredComponentId: string | null
  hoveredFrameId: string | null

  // Drag
  drag: DragState

  // Resize
  resize: ResizeState

  // Context menu
  contextMenu: ContextMenuState

  // Panel visibility
  panels: PanelVisibility

  // Right panel active tab
  rightPanelTab: 'properties' | 'layout' | 'states' | 'interactions' | 'animation'

  // Undo/Redo stacks (managed separately via history store)
  canUndo: boolean
  canRedo: boolean
}
