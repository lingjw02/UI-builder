// ============================================================
// EXPORT & PERSISTENCE ENGINE TESTS
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  exportProjectToJSON,
  importProjectFromJSON,
  generateReactCode,
} from '../engine/exportEngine'
import { createProject, createPage, createFrame, createComponentInstance } from '../store/projectFactory'

describe('Export & Persistence Engine', () => {
  it('serializes and deserializes a project losslessly', () => {
    const project = createProject('My Prototyping App')
    const frame = createFrame({ name: 'Desktop View' })
    const comp = createComponentInstance('button', {
      mode: 'grid',
      grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 1 },
    }, { label: 'Click Me', variant: 'primary' })

    frame.children.push(comp)
    const page = createPage({ name: 'Home', frames: [frame] })
    project.pages = [page]

    const json = exportProjectToJSON(project)
    expect(typeof json).toBe('string')
    expect(json).toContain('My Prototyping App')
    expect(json).toContain('Click Me')

    const imported = importProjectFromJSON(json)
    expect(imported.settings.name).toBe('My Prototyping App')
    expect(imported.pages.length).toBe(1)
    expect(imported.pages[0].frames[0].children[0].props.label).toBe('Click Me')
  })

  it('generates clean React + Tailwind component code for a frame', () => {
    const frame = createFrame({
      name: 'DashboardFrame',
      width: 1440,
      height: 900,
      layoutMode: 'grid',
      grid: {
        columns: 12,
        rows: 8,
        columnGap: 16,
        rowGap: 16,
        padding: { top: 20, right: 24, bottom: 20, left: 24 },
        snap: true,
        autoPlace: false,
        showGrid: true,
      },
      children: [
        createComponentInstance('stat-card', {
          mode: 'grid',
          grid: { gridColumn: 1, gridRow: 1, columnSpan: 3, rowSpan: 1 },
        }, { title: 'Revenue', value: '$99,000' }),
        createComponentInstance('button', {
          mode: 'grid',
          grid: { gridColumn: 4, gridRow: 1, columnSpan: 2, rowSpan: 1 },
        }, { label: 'Download Report', variant: 'primary' }),
      ],
    })

    const code = generateReactCode(frame, 'GeneratedDashboard')
    expect(code).toContain("import React from 'react'")
    expect(code).toContain('export const GeneratedDashboard: React.FC')
    expect(code).toContain('grid-cols-12')
    expect(code).toContain('col-span-3')
    expect(code).toContain('Revenue')
    expect(code).toContain('Download Report')
  })
})
