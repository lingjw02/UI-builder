// ============================================================
// PROJECT FACTORY — helpers to create default data structures
// ============================================================

import { v4 as uuidv4 } from 'uuid'
import type {
  Project,
  Page,
  Frame,
  ComponentInstance,
  GridConfig,
  ComponentLayout,
} from '../types'

export const DEFAULT_GRID_CONFIG: GridConfig = {
  columns: 4,
  rows: 2,
  columnGap: 16,
  rowGap: 16,
  padding: { top: 24, right: 24, bottom: 24, left: 24 },
  snap: true,
  autoPlace: true,
  showGrid: true,
}

export function createComponentInstance(
  componentType: string,
  layout: ComponentLayout,
  props: Record<string, unknown> = {},
): ComponentInstance {
  return {
    id: uuidv4(),
    componentType,
    props,
    layout,
    interactions: [],
  }
}

export function createFrame(overrides: Partial<Frame> = {}): Frame {
  return {
    id: uuidv4(),
    name: 'Frame',
    width: 1440,
    height: 900,
    deviceType: 'desktop',
    background: '#ffffff',
    layoutMode: 'grid',
    grid: { ...DEFAULT_GRID_CONFIG },
    children: [],
    ...overrides,
  }
}

export function createPage(overrides: Partial<Page> = {}): Page {
  return {
    id: uuidv4(),
    name: 'Page 1',
    frames: [createFrame({ name: 'Desktop Frame' })],
    ...overrides,
  }
}

export function createProject(name: string = 'Untitled Project'): Project {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    settings: {
      name,
      defaultDeviceType: 'desktop',
      version: '0.1.0',
      createdAt: now,
      updatedAt: now,
    },
    pages: [createPage({ name: 'Home' })],
    sharedComponents: [],
    assets: [],
    mockEndpoints: [],
    flow: { connections: [] },
  }
}
