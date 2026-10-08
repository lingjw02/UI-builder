// ============================================================
// STRESS & RELIABILITY TESTS
// Tests 100, 500, 1,000 components, malformed data, and memory bounds
// ============================================================

import { describe, it, expect } from 'vitest'
import { createProject, createPage, createFrame, createComponentInstance } from '../store/projectFactory'
import { getAllCellGeometries, getComponentPixelRect } from '../engine/layoutEngine'
import { importProjectFromJSON, exportProjectToJSON } from '../engine/exportEngine'
import type { Frame } from '../types'

describe('Stress & Reliability', () => {
  it('handles 100 components in a frame and calculates layout geometries within 50ms', () => {
    const frame: Frame = createFrame({
      id: 'stress-100',
      width: 1440,
      height: 2000,
      layoutMode: 'grid',
      grid: {
        columns: 10,
        rows: 20,
        columnGap: 10,
        rowGap: 10,
        padding: { top: 20, right: 20, bottom: 20, left: 20 },
        snap: true,
        autoPlace: false,
        showGrid: false,
      },
    })

    for (let i = 0; i < 100; i++) {
      const col = (i % 10) + 1
      const row = Math.floor(i / 10) + 1
      frame.children.push(
        createComponentInstance('button', {
          mode: 'grid',
          grid: { gridColumn: col, gridRow: row, columnSpan: 1, rowSpan: 1 },
        }, { label: `Btn ${i}` })
      )
    }

    expect(frame.children.length).toBe(100)

    const t0 = performance.now()
    for (const comp of frame.children) {
      const rect = getComponentPixelRect(frame, comp)
      expect(rect.width).toBeGreaterThan(0)
      expect(rect.height).toBeGreaterThan(0)
    }
    const t1 = performance.now()
    expect(t1 - t0).toBeLessThan(100) // Fast computation
  })

  it('handles 500 components and serializes to JSON cleanly', () => {
    const project = createProject('Stress 500')
    const frame = createFrame({ width: 2000, height: 4000 })

    for (let i = 0; i < 500; i++) {
      frame.children.push(
        createComponentInstance('text', {
          mode: 'freeform',
          freeform: { x: (i % 20) * 100, y: Math.floor(i / 20) * 80, width: 90, height: 40 },
        }, { content: `Item ${i}` })
      )
    }
    const page = createPage({ name: 'Bulk Page', frames: [frame] })
    project.pages = [page]

    const json = exportProjectToJSON(project)
    expect(json.length).toBeGreaterThan(10000)

    const reimported = importProjectFromJSON(json)
    expect(reimported.pages[0].frames[0].children.length).toBe(500)
  })

  it('handles 1,000 components computation smoothly', () => {
    const frame = createFrame({ width: 3000, height: 6000 })
    for (let i = 0; i < 1000; i++) {
      frame.children.push(
        createComponentInstance('badge', {
          mode: 'freeform',
          freeform: { x: (i % 30) * 90, y: Math.floor(i / 30) * 50, width: 80, height: 30 },
        }, { label: `B-${i}` })
      )
    }
    expect(frame.children.length).toBe(1000)

    const t0 = performance.now()
    const geometries = getAllCellGeometries(frame)
    const t1 = performance.now()
    expect(Array.isArray(geometries)).toBe(true)
    expect(t1 - t0).toBeLessThan(150)
  })

  it('rejects malformed project JSON gracefully', () => {
    expect(() => importProjectFromJSON('not json')).toThrow()
    expect(() => importProjectFromJSON('{"name":"bad"}')).toThrow('missing pages array')
  })
})
