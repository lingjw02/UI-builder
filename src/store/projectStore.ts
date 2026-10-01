// ============================================================
// PROJECT STORE — Zustand
// Manages the document model (Project) and undo/redo history
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type {
  Project,
  Page,
  Frame,
  ComponentInstance,
  GridConfig,
  LayoutMode,
  ComponentLayout,
} from '../types'
import { createProject, createPage, createFrame, createComponentInstance } from './projectFactory'
import { applyDevicePresetToFrame, type DevicePreset } from '../engine/responsiveEngine'

// ─────────────────────────────────────────
// History (Undo/Redo)
// ─────────────────────────────────────────

const MAX_HISTORY = 100

interface HistoryEntry {
  project: Project
  description: string
}

// ─────────────────────────────────────────
// Store Shape
// ─────────────────────────────────────────

interface ProjectStore {
  project: Project | null
  history: HistoryEntry[]
  historyIndex: number   // current position in history (points to current state)

  // ── Project lifecycle ──────────────────
  newProject: (name?: string) => void
  loadProject: (project: Project) => void
  saveSnapshot: (description: string) => void

  // ── Undo / Redo ────────────────────────
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  // ── Pages ──────────────────────────────
  addPage: (name?: string) => string
  renamePage: (pageId: string, name: string) => void
  deletePage: (pageId: string) => void
  duplicatePage: (pageId: string) => string

  // ── Frames ─────────────────────────────
  addFrame: (pageId: string, overrides?: Partial<Frame>) => string
  updateFrame: (pageId: string, frameId: string, updates: Partial<Frame>) => void
  applyDevicePreset: (pageId: string, frameId: string, preset: DevicePreset) => void
  deleteFrame: (pageId: string, frameId: string) => void

  // ── Grid ───────────────────────────────
  updateGrid: (pageId: string, frameId: string, grid: Partial<GridConfig>) => void
  setLayoutMode: (pageId: string, frameId: string, mode: LayoutMode) => void

  // ── Components ─────────────────────────
  addComponent: (
    pageId: string,
    frameId: string,
    componentType: string,
    layout: ComponentLayout,
    props?: Record<string, unknown>
  ) => string
  updateComponentProps: (
    pageId: string,
    frameId: string,
    componentId: string,
    props: Record<string, unknown>
  ) => void
  // ── Interactions ───────────────────────
  addInteraction: (
    pageId: string,
    frameId: string,
    componentId: string,
    interaction: import('../types').Interaction
  ) => void
  deleteInteraction: (
    pageId: string,
    frameId: string,
    componentId: string,
    interactionId: string
  ) => void

  // ── Flow Connections ───────────────────
  addFlowConnection: (
    fromPageId: string,
    toPageId: string,
    label?: string
  ) => string
  removeFlowConnection: (connectionId: string) => void

  updateComponentLayout: (
    pageId: string,
    frameId: string,
    componentId: string,
    layout: ComponentLayout
  ) => void
  deleteComponent: (pageId: string, frameId: string, componentId: string) => void
  duplicateComponent: (pageId: string, frameId: string, componentId: string) => string | null
  setComponentState: (
    pageId: string,
    frameId: string,
    componentId: string,
    state: string | undefined
  ) => void
  updateComponentMotion: (
    pageId: string,
    frameId: string,
    componentId: string,
    motion?: import('../types').MotionConfig
  ) => void

  // ── Project Settings ───────────────────
  updateProjectName: (name: string) => void
}

// ─────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────

function findFrame(project: Project, pageId: string, frameId: string): Frame | undefined {
  return project.pages
    .find(p => p.id === pageId)
    ?.frames.find(f => f.id === frameId)
}

function findComponent(
  project: Project,
  pageId: string,
  frameId: string,
  componentId: string
): ComponentInstance | undefined {
  return findFrame(project, pageId, frameId)?.children.find(c => c.id === componentId)
}

// ─────────────────────────────────────────
// Store
// ─────────────────────────────────────────

export const useProjectStore = create<ProjectStore>()(
  immer((set, get) => ({
    project: null,
    history: [],
    historyIndex: -1,

    // ── Project lifecycle ─────────────────

    newProject: (name = 'Untitled Project') => {
      const project = createProject(name)
      set(state => {
        state.project = project
        state.history = [{ project: structuredClone(project), description: 'New project' }]
        state.historyIndex = 0
      })
    },

    loadProject: (project) => {
      set(state => {
        state.project = project
        state.history = [{ project: structuredClone(project), description: 'Load project' }]
        state.historyIndex = 0
      })
    },

    saveSnapshot: (description) => {
      const { project, history, historyIndex } = get()
      if (!project) return
      const snapshot = structuredClone(project)
      const truncated = history.slice(0, historyIndex + 1)
      const next = [...truncated, { project: snapshot, description }].slice(-MAX_HISTORY)
      set(state => {
        state.history = next
        state.historyIndex = next.length - 1
      })
    },

    // ── Undo / Redo ───────────────────────

    canUndo: () => get().historyIndex > 0,
    canRedo: () => get().historyIndex < get().history.length - 1,

    undo: () => {
      const { historyIndex, history } = get()
      if (historyIndex <= 0) return
      const newIndex = historyIndex - 1
      const entry = history[newIndex]
      set(state => {
        state.project = structuredClone(entry.project)
        state.historyIndex = newIndex
      })
    },

    redo: () => {
      const { historyIndex, history } = get()
      if (historyIndex >= history.length - 1) return
      const newIndex = historyIndex + 1
      const entry = history[newIndex]
      set(state => {
        state.project = structuredClone(entry.project)
        state.historyIndex = newIndex
      })
    },

    // ── Pages ─────────────────────────────

    addPage: (name) => {
      const id = uuidv4()
      const page = createPage({ id, name: name ?? `Page ${get().project?.pages.length ?? 1 + 1}` })
      set(state => { state.project?.pages.push(page) })
      get().saveSnapshot(`Add page "${page.name}"`)
      return id
    },

    renamePage: (pageId, name) => {
      set(state => {
        const page = state.project?.pages.find(p => p.id === pageId)
        if (page) page.name = name
      })
      get().saveSnapshot(`Rename page to "${name}"`)
    },

    deletePage: (pageId) => {
      set(state => {
        if (!state.project) return
        state.project.pages = state.project.pages.filter(p => p.id !== pageId)
      })
      get().saveSnapshot('Delete page')
    },

    duplicatePage: (pageId) => {
      const { project } = get()
      const page = project?.pages.find(p => p.id === pageId)
      if (!page) return ''
      const newPage: Page = {
        ...structuredClone(page),
        id: uuidv4(),
        name: `${page.name} (copy)`,
      }
      set(state => { state.project?.pages.push(newPage) })
      get().saveSnapshot(`Duplicate page "${page.name}"`)
      return newPage.id
    },

    // ── Frames ────────────────────────────

    addFrame: (pageId, overrides) => {
      const id = uuidv4()
      const frame = createFrame({ id, ...overrides })
      set(state => {
        state.project?.pages.find(p => p.id === pageId)?.frames.push(frame)
      })
      get().saveSnapshot('Add frame')
      return id
    },

    updateFrame: (pageId, frameId, updates) => {
      set(state => {
        const frame = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
        if (frame) Object.assign(frame, updates)
      })
    },

    applyDevicePreset: (pageId, frameId, preset) => {
      const { project } = get()
      if (!project) return
      const frame = findFrame(project, pageId, frameId)
      if (!frame) return
      const updates = applyDevicePresetToFrame(frame, preset)
      set(state => {
        const targetFrame = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
        if (targetFrame) {
          Object.assign(targetFrame, updates)
        }
      })
      get().saveSnapshot(`Set device preset to ${preset.name}`)
    },

    deleteFrame: (pageId, frameId) => {
      set(state => {
        const page = state.project?.pages.find(p => p.id === pageId)
        if (page) page.frames = page.frames.filter(f => f.id !== frameId)
      })
      get().saveSnapshot('Delete frame')
    },

    // ── Grid ──────────────────────────────

    updateGrid: (pageId, frameId, gridUpdates) => {
      set(state => {
        const frame = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
        if (frame) {
          if (!frame.grid) {
            frame.grid = {
              columns: 4,
              rows: 2,
              columnGap: 16,
              rowGap: 16,
              padding: { top: 24, right: 24, bottom: 24, left: 24 },
              snap: true,
              autoPlace: true,
              showGrid: true,
            }
          }
          Object.assign(frame.grid, gridUpdates)
        }
      })
    },

    setLayoutMode: (pageId, frameId, mode) => {
      set(state => {
        const frame = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
        if (frame) frame.layoutMode = mode
      })
      get().saveSnapshot(`Set layout mode to ${mode}`)
    },

    // ── Components ────────────────────────

    addComponent: (pageId, frameId, componentType, layout, props = {}) => {
      const instance = createComponentInstance(componentType, layout, props)
      set(state => {
        state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.push(instance)
      })
      get().saveSnapshot(`Add ${componentType}`)
      return instance.id
    },

    updateComponentProps: (pageId, frameId, componentId, props) => {
      set(state => {
        const comp = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp) comp.props = { ...comp.props, ...props }
      })
    },

    updateComponentLayout: (pageId, frameId, componentId, layout) => {
      set(state => {
        const comp = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp) comp.layout = layout
      })
    },

    deleteComponent: (pageId, frameId, componentId) => {
      set(state => {
        const frame = state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
        if (frame) frame.children = frame.children.filter(c => c.id !== componentId)
      })
      get().saveSnapshot('Delete component')
    },

    duplicateComponent: (pageId, frameId, componentId) => {
      const { project } = get()
      const comp = findComponent(project!, pageId, frameId, componentId)
      if (!comp) return null
      const newComp: ComponentInstance = {
        ...structuredClone(comp),
        id: uuidv4(),
        name: comp.name ? `${comp.name} (copy)` : undefined,
      }
      set(state => {
        state.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.push(newComp)
      })
      get().saveSnapshot('Duplicate component')
      return newComp.id
    },

    setComponentState: (pageId, frameId, componentId, state) => {
      set(s => {
        const comp = s.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp) comp.state = state
      })
    },

    updateComponentMotion: (pageId, frameId, componentId, motion) => {
      set(s => {
        const comp = s.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp) comp.motion = motion
      })
      get().saveSnapshot('Update component motion')
    },

    // ── Interactions ─────────────────────

    addInteraction: (pageId, frameId, componentId, interaction) => {
      set(s => {
        const comp = s.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp) {
          if (!comp.interactions) comp.interactions = []
          comp.interactions.push(interaction)
        }
      })
      get().saveSnapshot('Add interaction')
    },

    deleteInteraction: (pageId, frameId, componentId, interactionId) => {
      set(s => {
        const comp = s.project?.pages
          .find(p => p.id === pageId)
          ?.frames.find(f => f.id === frameId)
          ?.children.find(c => c.id === componentId)
        if (comp && comp.interactions) {
          comp.interactions = comp.interactions.filter(i => i.id !== interactionId)
        }
      })
      get().saveSnapshot('Delete interaction')
    },

    // ── Flow Connections ──────────────────

    addFlowConnection: (fromPageId, toPageId, label) => {
      const id = uuidv4()
      set(s => {
        if (s.project) {
          if (!s.project.flow) s.project.flow = { connections: [] }
          s.project.flow.connections.push({ id, fromPageId, toPageId, label })
        }
      })
      get().saveSnapshot('Add flow connection')
      return id
    },

    removeFlowConnection: (connectionId) => {
      set(s => {
        if (s.project && s.project.flow) {
          s.project.flow.connections = s.project.flow.connections.filter(c => c.id !== connectionId)
        }
      })
      get().saveSnapshot('Remove flow connection')
    },

    // ── Project Settings ──────────────────

    updateProjectName: (name) => {
      set(state => {
        if (state.project) {
          state.project.settings.name = name
          state.project.settings.updatedAt = new Date().toISOString()
        }
      })
      get().saveSnapshot(`Rename project to "${name}"`)
    },
  }))
)
