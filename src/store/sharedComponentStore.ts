// ============================================================
// SHARED COMPONENT STORE
// Manages global reusable component definitions + local instance states
//
// Design Principle:
//   SharedComponent has ONE canonical definition.
//   Multiple pages reference it by ID.
//   Local state (e.g. active nav item) lives on the page-level instance override.
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { SharedComponent, ComponentInstance } from '../types'

// ─────────────────────────────────────────
// Per-page instance override
// (stores page-specific state for a shared component)
// ─────────────────────────────────────────

export interface SharedInstanceOverride {
  sharedComponentId: string
  pageId: string
  /** Active state name for this page (e.g. which nav item is highlighted) */
  activeState?: string
  /** Slot content overrides: slotName → ComponentInstance[] */
  slotContent?: Record<string, ComponentInstance[]>
  /** Prop overrides specific to this page */
  propOverrides?: Record<string, unknown>
}

// ─────────────────────────────────────────
// Store
// ─────────────────────────────────────────

interface SharedComponentStore {
  /** All globally defined shared components */
  sharedComponents: SharedComponent[]

  /** Per-page instance overrides keyed by `${sharedComponentId}:${pageId}` */
  instanceOverrides: Record<string, SharedInstanceOverride>

  // ── CRUD ──────────────────────────────
  createSharedComponent: (
    name: string,
    rootInstance: ComponentInstance,
    slots?: string[]
  ) => string

  updateSharedComponent: (id: string, updates: Partial<SharedComponent>) => void

  deleteSharedComponent: (id: string) => void

  getSharedComponent: (id: string) => SharedComponent | undefined

  // ── Instance Overrides ─────────────────
  /** Set page-specific active state for a shared component instance */
  setInstanceActiveState: (
    sharedComponentId: string,
    pageId: string,
    activeState: string
  ) => void

  /** Override a prop for a specific page instance */
  setInstancePropOverride: (
    sharedComponentId: string,
    pageId: string,
    propName: string,
    value: unknown
  ) => void

  /** Set slot content for a specific page instance */
  setSlotContent: (
    sharedComponentId: string,
    pageId: string,
    slotName: string,
    content: ComponentInstance[]
  ) => void

  /** Get the resolved override for a page instance */
  getInstanceOverride: (
    sharedComponentId: string,
    pageId: string
  ) => SharedInstanceOverride | undefined
}

export const useSharedComponentStore = create<SharedComponentStore>()(
  immer((set, get) => ({
    sharedComponents: [],
    instanceOverrides: {},

    // ── CRUD ────────────────────────────

    createSharedComponent: (name, rootInstance, slots = []) => {
      const id = uuidv4()
      const shared: SharedComponent = {
        id,
        name,
        rootInstance,
        slots,
      }
      set(s => { s.sharedComponents.push(shared) })
      return id
    },

    updateSharedComponent: (id, updates) => {
      set(s => {
        const sc = s.sharedComponents.find(c => c.id === id)
        if (sc) Object.assign(sc, updates)
      })
    },

    deleteSharedComponent: (id) => {
      set(s => {
        s.sharedComponents = s.sharedComponents.filter(c => c.id !== id)
        // Clean up instance overrides
        Object.keys(s.instanceOverrides).forEach(key => {
          if (key.startsWith(`${id}:`)) {
            delete s.instanceOverrides[key]
          }
        })
      })
    },

    getSharedComponent: (id) => {
      return get().sharedComponents.find(c => c.id === id)
    },

    // ── Instance Overrides ───────────────

    setInstanceActiveState: (sharedComponentId, pageId, activeState) => {
      const key = `${sharedComponentId}:${pageId}`
      set(s => {
        if (!s.instanceOverrides[key]) {
          s.instanceOverrides[key] = { sharedComponentId, pageId }
        }
        s.instanceOverrides[key].activeState = activeState
      })
    },

    setInstancePropOverride: (sharedComponentId, pageId, propName, value) => {
      const key = `${sharedComponentId}:${pageId}`
      set(s => {
        if (!s.instanceOverrides[key]) {
          s.instanceOverrides[key] = { sharedComponentId, pageId }
        }
        if (!s.instanceOverrides[key].propOverrides) {
          s.instanceOverrides[key].propOverrides = {}
        }
        s.instanceOverrides[key].propOverrides![propName] = value
      })
    },

    setSlotContent: (sharedComponentId, pageId, slotName, content) => {
      const key = `${sharedComponentId}:${pageId}`
      set(s => {
        if (!s.instanceOverrides[key]) {
          s.instanceOverrides[key] = { sharedComponentId, pageId }
        }
        if (!s.instanceOverrides[key].slotContent) {
          s.instanceOverrides[key].slotContent = {}
        }
        s.instanceOverrides[key].slotContent![slotName] = content
      })
    },

    getInstanceOverride: (sharedComponentId, pageId) => {
      return get().instanceOverrides[`${sharedComponentId}:${pageId}`]
    },
  }))
)
