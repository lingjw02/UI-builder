// ============================================================
// FLOW ENGINE — Phase 11
// Manages the page navigation graph and flow state
//
// The flow engine answers:
//   - What pages are connected?
//   - What is the current page in preview mode?
//   - What's the navigation history (back/forward)?
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { FlowConnection } from '../types'

interface FlowEngineState {
  // ── Navigation state (preview mode) ──
  currentPageId: string | null
  navigationHistory: string[]
  historyIndex: number

  // ── Overlay state ─────────────────────
  openOverlays: string[]   // component IDs of open overlays

  // ── Flow graph operations ──────────────
  addConnection: (fromPageId: string, toPageId: string, label?: string) => string
  removeConnection: (connectionId: string) => void
  getConnectionsFrom: (pageId: string, connections: FlowConnection[]) => FlowConnection[]
  getConnectionsTo: (pageId: string, connections: FlowConnection[]) => FlowConnection[]

  // ── Navigation (preview mode) ──────────
  setCurrentPage: (pageId: string) => void
  navigateTo: (pageId: string) => void
  navigateBack: () => void
  navigateForward: () => void
  canGoBack: () => boolean
  canGoForward: () => boolean
  resetNavigation: (startPageId: string) => void

  // ── Overlays ──────────────────────────
  openOverlay: (componentId: string) => void
  closeOverlay: (componentId: string) => void
  toggleOverlay: (componentId: string) => void
  isOverlayOpen: (componentId: string) => boolean
  closeAllOverlays: () => void
}

export const useFlowEngine = create<FlowEngineState>()(
  immer((set, get) => ({
    currentPageId: null,
    navigationHistory: [],
    historyIndex: -1,
    openOverlays: [],

    // ── Flow graph ────────────────────────

    addConnection: (_fromPageId, _toPageId, _label) => {
      // Note: connections live in the project store (Flow.connections[])
      // This function is a factory only — caller must add to project store
      return uuidv4()
    },

    removeConnection: (_connectionId) => {
      // Caller removes from project store
    },

    getConnectionsFrom: (pageId, connections) => {
      return connections.filter(c => c.fromPageId === pageId)
    },

    getConnectionsTo: (pageId, connections) => {
      return connections.filter(c => c.toPageId === pageId)
    },

    // ── Navigation ─────────────────────────

    setCurrentPage: (pageId) => {
      set(s => {
        s.currentPageId = pageId
        s.navigationHistory = [pageId]
        s.historyIndex = 0
        s.openOverlays = []
      })
    },

    navigateTo: (pageId) => {
      set(s => {
        // Trim forward history on new navigation
        const newHistory = s.navigationHistory.slice(0, s.historyIndex + 1)
        newHistory.push(pageId)
        s.navigationHistory = newHistory
        s.historyIndex = newHistory.length - 1
        s.currentPageId = pageId
        s.openOverlays = [] // close all overlays on navigation
      })
    },

    navigateBack: () => {
      const { historyIndex, navigationHistory } = get()
      if (historyIndex <= 0) return
      const newIndex = historyIndex - 1
      set(s => {
        s.historyIndex = newIndex
        s.currentPageId = navigationHistory[newIndex]
        s.openOverlays = []
      })
    },

    navigateForward: () => {
      const { historyIndex, navigationHistory } = get()
      if (historyIndex >= navigationHistory.length - 1) return
      const newIndex = historyIndex + 1
      set(s => {
        s.historyIndex = newIndex
        s.currentPageId = navigationHistory[newIndex]
        s.openOverlays = []
      })
    },

    canGoBack: () => get().historyIndex > 0,
    canGoForward: () => get().historyIndex < get().navigationHistory.length - 1,

    resetNavigation: (startPageId) => {
      set(s => {
        s.currentPageId = startPageId
        s.navigationHistory = [startPageId]
        s.historyIndex = 0
        s.openOverlays = []
      })
    },

    // ── Overlays ──────────────────────────

    openOverlay: (componentId) => {
      set(s => {
        if (!s.openOverlays.includes(componentId)) {
          s.openOverlays.push(componentId)
        }
      })
    },

    closeOverlay: (componentId) => {
      set(s => {
        s.openOverlays = s.openOverlays.filter(id => id !== componentId)
      })
    },

    toggleOverlay: (componentId) => {
      const { openOverlays } = get()
      if (openOverlays.includes(componentId)) {
        get().closeOverlay(componentId)
      } else {
        get().openOverlay(componentId)
      }
    },

    isOverlayOpen: (componentId) => {
      return get().openOverlays.includes(componentId)
    },

    closeAllOverlays: () => {
      set(s => { s.openOverlays = [] })
    },
  }))
)
