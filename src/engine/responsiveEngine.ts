// ============================================================
// RESPONSIVE BREAKPOINT & DEVICE PRESET ENGINE
// Manages device presets, grid reflow calculations, and breakpoints
// ============================================================

import type { DeviceType, Frame, GridConfig } from '../types'

export interface DevicePreset {
  id: DeviceType
  name: string
  category: 'desktop' | 'tablet' | 'mobile'
  width: number
  height: number
  icon: string
  defaultColumns: number
  defaultRows: number
}

export const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'desktop',
    name: 'Desktop (Large)',
    category: 'desktop',
    width: 1440,
    height: 900,
    icon: '🖥️',
    defaultColumns: 12,
    defaultRows: 8,
  },
  {
    id: 'laptop',
    name: 'Laptop (MacBook)',
    category: 'desktop',
    width: 1280,
    height: 800,
    icon: '💻',
    defaultColumns: 12,
    defaultRows: 6,
  },
  {
    id: 'ipad',
    name: 'Tablet (iPad)',
    category: 'tablet',
    width: 768,
    height: 1024,
    icon: '📱',
    defaultColumns: 8,
    defaultRows: 10,
  },
  {
    id: 'iphone',
    name: 'Mobile (iPhone 14/15)',
    category: 'mobile',
    width: 375,
    height: 812,
    icon: '📱',
    defaultColumns: 4,
    defaultRows: 12,
  },
  {
    id: 'android',
    name: 'Mobile (Pixel/Galaxy)',
    category: 'mobile',
    width: 412,
    height: 915,
    icon: '📱',
    defaultColumns: 4,
    defaultRows: 12,
  },
]

export function getDevicePreset(type: DeviceType): DevicePreset | undefined {
  return DEVICE_PRESETS.find(p => p.id === type)
}

/**
 * Resizes a frame to a target device preset, automatically scaling
 * or reflowing the grid columns to suit the device viewport.
 */
export function applyDevicePresetToFrame(
  frame: Frame,
  preset: DevicePreset
): Partial<Frame> {
  const currentGrid = frame.grid
  const newGrid: GridConfig | undefined = currentGrid
    ? {
        ...currentGrid,
        columns: preset.defaultColumns,
        rows: preset.defaultRows,
      }
    : undefined

  // Reflow child components that exceed the new column limit
  const reflowedChildren = frame.children.map(comp => {
    if (comp.layout.mode === 'grid' && comp.layout.grid) {
      const g = comp.layout.grid
      const maxColSpan = Math.min(g.columnSpan, preset.defaultColumns)
      const adjustedCol = Math.min(g.gridColumn, preset.defaultColumns - maxColSpan + 1)
      return {
        ...comp,
        layout: {
          ...comp.layout,
          grid: {
            ...g,
            gridColumn: Math.max(1, adjustedCol),
            columnSpan: maxColSpan,
          },
        },
      }
    }
    // Freeform: clamp within new dimensions
    if (comp.layout.mode === 'freeform' && comp.layout.freeform) {
      const f = comp.layout.freeform
      return {
        ...comp,
        layout: {
          ...comp.layout,
          freeform: {
            ...f,
            width: Math.min(f.width, preset.width - 40),
            x: Math.min(f.x, preset.width - Math.min(f.width, preset.width - 40)),
          },
        },
      }
    }
    return comp
  })

  return {
    width: preset.width,
    height: preset.height,
    deviceType: preset.id,
    grid: newGrid,
    children: reflowedChildren,
  }
}
