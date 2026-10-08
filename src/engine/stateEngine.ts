// ============================================================
// STATE ENGINE
// Manages component state transitions in both Design and Preview modes
//
// States are first-class objects defined per ComponentDefinition.
// The engine resolves which state a component is currently in,
// considering: explicit state override, interaction triggers, and defaults.
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { getComponentDefinition } from '../components/registry/componentRegistry'
import type { StateDefinition } from '../types'

// ─────────────────────────────────────────
// State key: `${frameId}:${componentId}`
// ─────────────────────────────────────────

interface ComponentStateEntry {
  frameId: string
  componentId: string
  /** Currently active state name */
  activeName: string
  /** Whether this override is temporary (e.g. hover) or explicit (design) */
  isTemporary: boolean
}

interface StateEngine {
  states: Record<string, ComponentStateEntry>

  // ── Queries ───────────────────────────

  /** Get the active state name for a component */
  getActiveState: (frameId: string, componentId: string) => string

  /** Get the StateDefinition for the active state */
  getActiveStateDef: (
    frameId: string,
    componentId: string,
    componentType: string
  ) => StateDefinition | undefined

  /** Get all available states for a component type */
  getAvailableStates: (componentType: string) => StateDefinition[]

  // ── Mutations ─────────────────────────

  /** Set an explicit (design-mode) state override */
  setDesignState: (frameId: string, componentId: string, stateName: string) => void

  /** Set a temporary (preview/hover) state */
  setTemporaryState: (frameId: string, componentId: string, stateName: string) => void

  /** Clear the temporary state, reverting to explicit or default */
  clearTemporaryState: (frameId: string, componentId: string) => void

  /** Reset a component to its default state */
  resetState: (frameId: string, componentId: string) => void

  /** Reset all states for a frame */
  resetFrameStates: (frameId: string) => void
}

export const useStateEngine = create<StateEngine>()(
  immer((set, get) => ({
    states: {},

    // ── Queries ─────────────────────────

    getActiveState: (frameId, componentId) => {
      const key = `${frameId}:${componentId}`
      return get().states[key]?.activeName ?? 'default'
    },

    getActiveStateDef: (frameId, componentId, componentType) => {
      const activeName = get().getActiveState(frameId, componentId)
      const def = getComponentDefinition(componentType)
      return def?.states?.find((s: StateDefinition) => s.name === activeName)
    },

    getAvailableStates: (componentType) => {
      const def = getComponentDefinition(componentType)
      return def?.states ?? [{ name: 'default', label: 'Default' }]
    },

    // ── Mutations ────────────────────────

    setDesignState: (frameId, componentId, stateName) => {
      const key = `${frameId}:${componentId}`
      set(s => {
        s.states[key] = {
          frameId,
          componentId,
          activeName: stateName,
          isTemporary: false,
        }
      })
    },

    setTemporaryState: (frameId, componentId, stateName) => {
      const key = `${frameId}:${componentId}`
      const existing = get().states[key]
      // Only override if not already in a permanent design state
      if (!existing || existing.isTemporary) {
        set(s => {
          s.states[key] = {
            frameId,
            componentId,
            activeName: stateName,
            isTemporary: true,
          }
        })
      }
    },

    clearTemporaryState: (frameId, componentId) => {
      const key = `${frameId}:${componentId}`
      const entry = get().states[key]
      if (entry?.isTemporary) {
        set(s => { delete s.states[key] })
      }
    },

    resetState: (frameId, componentId) => {
      const key = `${frameId}:${componentId}`
      set(s => { delete s.states[key] })
    },

    resetFrameStates: (frameId) => {
      set(s => {
        Object.keys(s.states).forEach(key => {
          if (key.startsWith(`${frameId}:`)) delete s.states[key]
        })
      })
    },
  }))
)
