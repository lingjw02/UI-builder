// ============================================================
// LAYOUT ENGINE — Phase 3
// Converts logical grid positions → pixel coordinates
// Handles collision detection, footprint placement, auto-placement
// ============================================================

import type { Frame, ComponentInstance, GridLayout } from '../types'

// ─────────────────────────────────────────
// Pixel Rect (rendered output)
// ─────────────────────────────────────────

export interface PixelRect {
  x: number
  y: number
  width: number
  height: number
}

// ─────────────────────────────────────────
// Grid Cell Geometry
// ─────────────────────────────────────────

export interface GridCellGeometry {
  column: number
  row: number
  x: number
  y: number
  width: number
  height: number
}

// ─────────────────────────────────────────
// Cell Size Calculation
// ─────────────────────────────────────────

/**
 * Calculates the pixel width and height of a single grid cell.
 */
export function calculateCellSize(frame: Frame): { cellWidth: number; cellHeight: number } {
  const grid = frame.grid
  if (!grid) return { cellWidth: 0, cellHeight: 0 }

  const availableWidth =
    frame.width - grid.padding.left - grid.padding.right - grid.columnGap * (grid.columns - 1)
  const availableHeight =
    frame.height - grid.padding.top - grid.padding.bottom - grid.rowGap * (grid.rows - 1)

  return {
    cellWidth: Math.max(0, availableWidth / grid.columns),
    cellHeight: Math.max(0, availableHeight / grid.rows),
  }
}

/**
 * Returns the pixel rect of a specific grid cell (1-indexed).
 */
export function getCellPixelRect(
  frame: Frame,
  column: number,
  row: number,
): PixelRect {
  const grid = frame.grid
  if (!grid) return { x: 0, y: 0, width: 0, height: 0 }

  const { cellWidth, cellHeight } = calculateCellSize(frame)

  const x = grid.padding.left + (column - 1) * (cellWidth + grid.columnGap)
  const y = grid.padding.top + (row - 1) * (cellHeight + grid.rowGap)

  return { x, y, width: cellWidth, height: cellHeight }
}

// ─────────────────────────────────────────
// Component → Pixel Rect
// ─────────────────────────────────────────

/**
 * Converts a component's logical layout to a rendered pixel rect.
 */
export function getComponentPixelRect(frame: Frame, component: ComponentInstance): PixelRect {
  const { layout } = component

  if (layout.mode === 'freeform') {
    return {
      x: layout.freeform.x,
      y: layout.freeform.y,
      width: layout.freeform.width,
      height: layout.freeform.height,
    }
  }

  if (layout.mode === 'grid' && frame.grid) {
    return getGridComponentPixelRect(frame, layout.grid)
  }

  return { x: 0, y: 0, width: 100, height: 40 }
}

/**
 * Converts a grid layout (column/row/span) to pixel rect.
 */
export function getGridComponentPixelRect(frame: Frame, gridLayout: GridLayout): PixelRect {
  const grid = frame.grid
  if (!grid) return { x: 0, y: 0, width: 0, height: 0 }

  const { cellWidth, cellHeight } = calculateCellSize(frame)

  const x = grid.padding.left + (gridLayout.gridColumn - 1) * (cellWidth + grid.columnGap)
  const y = grid.padding.top + (gridLayout.gridRow - 1) * (cellHeight + grid.rowGap)

  const width =
    gridLayout.columnSpan * cellWidth + (gridLayout.columnSpan - 1) * grid.columnGap
  const height =
    gridLayout.rowSpan * cellHeight + (gridLayout.rowSpan - 1) * grid.rowGap

  return { x, y, width, height }
}

// ─────────────────────────────────────────
// All Cell Geometries
// ─────────────────────────────────────────

/**
 * Returns geometry for all cells in a grid frame.
 */
export function getAllCellGeometries(frame: Frame): GridCellGeometry[] {
  const grid = frame.grid
  if (!grid) return []

  const cells: GridCellGeometry[] = []
  const { cellWidth, cellHeight } = calculateCellSize(frame)

  for (let row = 1; row <= grid.rows; row++) {
    for (let col = 1; col <= grid.columns; col++) {
      const x = grid.padding.left + (col - 1) * (cellWidth + grid.columnGap)
      const y = grid.padding.top + (row - 1) * (cellHeight + grid.rowGap)
      cells.push({ column: col, row, x, y, width: cellWidth, height: cellHeight })
    }
  }

  return cells
}

// ─────────────────────────────────────────
// Collision Detection
// ─────────────────────────────────────────

/**
 * Occupancy map: which cells are already taken.
 * Returns a Set of "col,row" strings for occupied cells.
 */
export function buildOccupancyMap(
  frame: Frame,
  excludeComponentId?: string,
): Set<string> {
  const occupied = new Set<string>()

  for (const comp of frame.children) {
    if (comp.id === excludeComponentId) continue
    if (comp.layout.mode !== 'grid') continue

    const { gridColumn, gridRow, columnSpan, rowSpan } = comp.layout.grid
    for (let r = gridRow; r < gridRow + rowSpan; r++) {
      for (let c = gridColumn; c < gridColumn + columnSpan; c++) {
        occupied.add(`${c},${r}`)
      }
    }
  }

  return occupied
}

/**
 * Checks if a footprint (col, row, colSpan, rowSpan) is valid:
 * - Within grid bounds
 * - No collision with existing components
 */
export function isPlacementValid(
  frame: Frame,
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number,
  occupancyMap: Set<string>,
): boolean {
  const grid = frame.grid
  if (!grid) return false

  // Check bounds
  if (col < 1 || row < 1) return false
  if (col + colSpan - 1 > grid.columns) return false
  if (row + rowSpan - 1 > grid.rows) return false

  // Check collisions
  for (let r = row; r < row + rowSpan; r++) {
    for (let c = col; c < col + colSpan; c++) {
      if (occupancyMap.has(`${c},${r}`)) return false
    }
  }

  return true
}

// ─────────────────────────────────────────
// Auto Placement
// ─────────────────────────────────────────

/**
 * Finds the first available grid position for a component footprint.
 * Scans left→right, top→bottom.
 * Returns null if no space available.
 */
export function findAutoPlacementPosition(
  frame: Frame,
  colSpan: number,
  rowSpan: number,
  excludeComponentId?: string,
): { col: number; row: number } | null {
  const grid = frame.grid
  if (!grid) return null

  const occupied = buildOccupancyMap(frame, excludeComponentId)

  for (let row = 1; row <= grid.rows; row++) {
    for (let col = 1; col <= grid.columns; col++) {
      if (isPlacementValid(frame, col, row, colSpan, rowSpan, occupied)) {
        return { col, row }
      }
    }
  }

  return null
}

// ─────────────────────────────────────────
// Hit Testing (Canvas → Grid Cell)
// ─────────────────────────────────────────

/**
 * Given a pixel coordinate within a frame, returns the grid cell it falls in.
 * Returns null if outside the grid area.
 */
export function pixelToGridCell(
  frame: Frame,
  pixelX: number,
  pixelY: number,
): { col: number; row: number } | null {
  const grid = frame.grid
  if (!grid) return null

  const { cellWidth, cellHeight } = calculateCellSize(frame)

  const relX = pixelX - grid.padding.left
  const relY = pixelY - grid.padding.top

  if (relX < 0 || relY < 0) return null

  const col = Math.floor(relX / (cellWidth + grid.columnGap)) + 1
  const row = Math.floor(relY / (cellHeight + grid.rowGap)) + 1

  if (col < 1 || col > grid.columns || row < 1 || row > grid.rows) return null

  return { col, row }
}

/**
 * Snaps a pixel position to the nearest grid cell position.
 * Returns the top-left pixel of the target cell.
 */
export function snapToGridCell(
  frame: Frame,
  pixelX: number,
  pixelY: number,
): PixelRect | null {
  const cell = pixelToGridCell(frame, pixelX, pixelY)
  if (!cell) return null

  return getCellPixelRect(frame, cell.col, cell.row)
}

// ─────────────────────────────────────────
// Drag Preview
// ─────────────────────────────────────────

export interface DragPreview {
  col: number
  row: number
  colSpan: number
  rowSpan: number
  isValid: boolean
  rect: PixelRect
}

/**
 * Given a drag position within a frame, computes the ghost placement preview.
 */
export function computeDragPreview(
  frame: Frame,
  pixelX: number,
  pixelY: number,
  colSpan: number,
  rowSpan: number,
  excludeComponentId?: string,
): DragPreview | null {
  if (!frame.grid || frame.layoutMode !== 'grid') return null

  const cell = pixelToGridCell(frame, pixelX, pixelY)
  if (!cell) return null

  const occupied = buildOccupancyMap(frame, excludeComponentId)
  const isValid = isPlacementValid(frame, cell.col, cell.row, colSpan, rowSpan, occupied)

  const rect = getGridComponentPixelRect(frame, {
    gridColumn: cell.col,
    gridRow: cell.row,
    columnSpan: colSpan,
    rowSpan: rowSpan,
  })

  return { col: cell.col, row: cell.row, colSpan, rowSpan, isValid, rect }
}
