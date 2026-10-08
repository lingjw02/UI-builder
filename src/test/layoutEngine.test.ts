// ============================================================
// LAYOUT ENGINE TESTS
// Grid System Acceptance Tests
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  calculateCellSize,
  getCellPixelRect,
  getGridComponentPixelRect,
  getAllCellGeometries,
  buildOccupancyMap,
  isPlacementValid,
  findAutoPlacementPosition,
  pixelToGridCell,
  computeDragPreview,
} from '../engine/layoutEngine'
import { createFrame } from '../store/projectFactory'
import type { Frame, ComponentInstance } from '../types'

function makeFrame(overrides: Partial<Frame> = {}): Frame {
  return createFrame({
    width: 1440,
    height: 900,
    layoutMode: 'grid',
    grid: {
      columns: 4,
      rows: 2,
      columnGap: 16,
      rowGap: 16,
      padding: { top: 24, right: 24, bottom: 24, left: 24 },
      snap: true,
      autoPlace: true,
      showGrid: true,
    },
    ...overrides,
  })
}

function makeComponent(
  id: string,
  col: number,
  row: number,
  colSpan: number,
  rowSpan: number
): ComponentInstance {
  return {
    id,
    componentType: 'button',
    props: {},
    layout: { mode: 'grid', grid: { gridColumn: col, gridRow: row, columnSpan: colSpan, rowSpan: rowSpan } },
    interactions: [],
  }
}

describe('Layout Engine — Cell Size', () => {
  it('calculates cell size correctly for 4×2 grid', () => {
    const frame = makeFrame()
    const { cellWidth, cellHeight } = calculateCellSize(frame)

    // Available width = 1440 - 24 - 24 - (3 * 16) = 1344
    // Cell width = 1344 / 4 = 336
    expect(cellWidth).toBeCloseTo(336, 1)

    // Available height = 900 - 24 - 24 - (1 * 16) = 836
    // Cell height = 836 / 2 = 418
    expect(cellHeight).toBeCloseTo(418, 1)
  })
})

describe('Layout Engine — Cell Pixel Rect', () => {
  it('returns correct rect for cell (1,1)', () => {
    const frame = makeFrame()
    const rect = getCellPixelRect(frame, 1, 1)
    expect(rect.x).toBe(24)
    expect(rect.y).toBe(24)
  })

  it('returns correct rect for cell (2,1)', () => {
    const frame = makeFrame()
    const { cellWidth } = calculateCellSize(frame)
    const rect = getCellPixelRect(frame, 2, 1)
    expect(rect.x).toBeCloseTo(24 + cellWidth + 16, 1)
    expect(rect.y).toBe(24)
  })
})

describe('Layout Engine — Component Pixel Rect', () => {
  it('correctly converts 2×1 footprint to pixel rect', () => {
    const frame = makeFrame()
    const { cellWidth } = calculateCellSize(frame)
    const rect = getGridComponentPixelRect(frame, { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 1 })

    // Width = 2 cells + 1 gap = 2*336 + 16 = 688
    expect(rect.width).toBeCloseTo(2 * cellWidth + 16, 1)
  })
})

describe('Layout Engine — Occupancy Map', () => {
  it('marks occupied cells correctly', () => {
    const frame = makeFrame()
    frame.children = [makeComponent('a', 1, 1, 2, 1)]

    const occupied = buildOccupancyMap(frame)
    expect(occupied.has('1,1')).toBe(true)
    expect(occupied.has('2,1')).toBe(true)
    expect(occupied.has('3,1')).toBe(false)
  })

  it('excludes specified component', () => {
    const frame = makeFrame()
    frame.children = [makeComponent('a', 1, 1, 2, 1)]

    const occupied = buildOccupancyMap(frame, 'a')
    expect(occupied.has('1,1')).toBe(false)
  })
})

describe('Layout Engine — Collision Detection', () => {
  it('allows valid placement', () => {
    const frame = makeFrame()
    frame.children = [makeComponent('a', 1, 1, 2, 1)]

    const occupied = buildOccupancyMap(frame)
    expect(isPlacementValid(frame, 3, 1, 2, 1, occupied)).toBe(true)
  })

  it('rejects overlapping placement', () => {
    const frame = makeFrame()
    frame.children = [makeComponent('a', 1, 1, 2, 1)]

    const occupied = buildOccupancyMap(frame)
    expect(isPlacementValid(frame, 2, 1, 1, 1, occupied)).toBe(false)
  })

  it('rejects out-of-bounds placement', () => {
    const frame = makeFrame()
    const occupied = buildOccupancyMap(frame)

    // 5th column in a 4-column grid
    expect(isPlacementValid(frame, 5, 1, 1, 1, occupied)).toBe(false)

    // Span overflow: col 4 with span 2 would go to col 5
    expect(isPlacementValid(frame, 4, 1, 2, 1, occupied)).toBe(false)
  })
})

describe('Layout Engine — Auto Placement', () => {
  it('finds first available position in empty grid', () => {
    const frame = makeFrame()
    frame.children = []
    const pos = findAutoPlacementPosition(frame, 1, 1)
    expect(pos).toEqual({ col: 1, row: 1 })
  })

  it('finds available position after occupied cells', () => {
    const frame = makeFrame()
    // Fill first 3 cells of row 1
    frame.children = [
      makeComponent('a', 1, 1, 1, 1),
      makeComponent('b', 2, 1, 1, 1),
      makeComponent('c', 3, 1, 1, 1),
    ]
    const pos = findAutoPlacementPosition(frame, 1, 1)
    expect(pos).toEqual({ col: 4, row: 1 })
  })

  it('returns null when grid is full', () => {
    const frame = makeFrame()
    // Fill 4×2 = 8 cells
    frame.children = [
      makeComponent('a', 1, 1, 4, 1),
      makeComponent('b', 1, 2, 4, 1),
    ]
    const pos = findAutoPlacementPosition(frame, 1, 1)
    expect(pos).toBeNull()
  })
})

describe('Layout Engine — Pixel to Grid Cell', () => {
  it('maps pixel position to correct cell', () => {
    const frame = makeFrame()
    // Click inside first cell (after padding of 24)
    const cell = pixelToGridCell(frame, 30, 30)
    expect(cell).toEqual({ col: 1, row: 1 })
  })

  it('returns null for position outside padding', () => {
    const frame = makeFrame()
    const cell = pixelToGridCell(frame, 10, 10)
    expect(cell).toBeNull()
  })
})

describe('Layout Engine — All Cells', () => {
  it('generates correct number of cells', () => {
    const frame = makeFrame()
    const cells = getAllCellGeometries(frame)
    expect(cells).toHaveLength(8) // 4 × 2
  })
})

describe('Layout Engine — Drag Preview', () => {
  it('computes drag preview for valid cell', () => {
    const frame = makeFrame()
    const preview = computeDragPreview(frame, 30, 30, 1, 1)
    expect(preview).not.toBeNull()
    expect(preview?.isValid).toBe(true)
    expect(preview?.col).toBe(1)
    expect(preview?.row).toBe(1)
  })
})
