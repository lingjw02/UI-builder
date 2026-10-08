// ============================================================
// RESPONSIVE ENGINE TESTS
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  DEVICE_PRESETS,
  getDevicePreset,
  applyDevicePresetToFrame,
} from '../engine/responsiveEngine'
import { createFrame, createComponentInstance } from '../store/projectFactory'
import type { Frame } from '../types'

describe('Responsive Engine', () => {
  it('contains presets for desktop, laptop, ipad, iphone, android', () => {
    const ids = DEVICE_PRESETS.map(p => p.id)
    expect(ids).toContain('desktop')
    expect(ids).toContain('laptop')
    expect(ids).toContain('ipad')
    expect(ids).toContain('iphone')
    expect(ids).toContain('android')
  })

  it('retrieves preset by device type', () => {
    const iphone = getDevicePreset('iphone')
    expect(iphone).toBeDefined()
    expect(iphone?.width).toBe(375)
    expect(iphone?.defaultColumns).toBe(4)
  })

  it('reflows grid components when switching from desktop (12 col) to mobile (4 col)', () => {
    const frame: Frame = createFrame({
      id: 'frame-test',
      width: 1440,
      height: 900,
      deviceType: 'desktop',
      grid: {
        columns: 12,
        rows: 8,
        columnGap: 16,
        rowGap: 16,
        padding: { top: 24, right: 24, bottom: 24, left: 24 },
        snap: true,
        autoPlace: false,
        showGrid: true,
      },
      children: [
        // Component spanning 6 columns at col 7 (overflows 4 columns)
        createComponentInstance('card', {
          mode: 'grid',
          grid: { gridColumn: 7, gridRow: 1, columnSpan: 6, rowSpan: 2 },
        }),
      ],
    })

    const iphonePreset = getDevicePreset('iphone')!
    const updates = applyDevicePresetToFrame(frame, iphonePreset)

    expect(updates.width).toBe(375)
    expect(updates.height).toBe(812)
    expect(updates.deviceType).toBe('iphone')
    expect(updates.grid?.columns).toBe(4)

    // The child component should have reflowed:
    const reflowedComp = updates.children?.[0]
    expect(reflowedComp).toBeDefined()
    if (reflowedComp?.layout.mode === 'grid' && reflowedComp.layout.grid) {
      expect(reflowedComp.layout.grid.columnSpan).toBeLessThanOrEqual(4)
      expect(
        reflowedComp.layout.grid.gridColumn + reflowedComp.layout.grid.columnSpan - 1
      ).toBeLessThanOrEqual(4)
    }
  })

  it('clamps freeform components within target device viewport', () => {
    const frame: Frame = createFrame({
      id: 'freeform-frame',
      width: 1440,
      height: 900,
      deviceType: 'desktop',
      layoutMode: 'freeform',
      children: [
        createComponentInstance('card', {
          mode: 'freeform',
          freeform: { x: 1200, y: 100, width: 400, height: 200 },
        }),
      ],
    })

    const iphonePreset = getDevicePreset('iphone')!
    const updates = applyDevicePresetToFrame(frame, iphonePreset)

    const comp = updates.children?.[0]
    if (comp?.layout.mode === 'freeform' && comp.layout.freeform) {
      expect(comp.layout.freeform.width).toBeLessThanOrEqual(iphonePreset.width)
      expect(comp.layout.freeform.x + comp.layout.freeform.width).toBeLessThanOrEqual(
        iphonePreset.width
      )
    }
  })
})
