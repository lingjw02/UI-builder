// ============================================================
// PHASE 21 — FINAL QA COMPLETE WORKFLOW INTEGRATION TEST
// Verifies the entire sequence from BUILD_PHASES.md Section 3:
//   1. Create Project
//   2. Create Dashboard Page
//   3. Create Laptop Frame (1280x800)
//   4. Set Grid
//   5. Add Sidebar, Navbar, Cards
//   6. Create Shared Sidebar
//   7. Create Settings Page & Reuse Sidebar
//   8. Create Button Interaction (Navigate)
//   9. Run Prototype & Execute Navigation
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest'
import { useProjectStore } from '../store/projectStore'
import { useSharedComponentStore } from '../store/sharedComponentStore'
import { useFlowEngine } from '../engine/flowEngine'
import { useStateEngine } from '../engine/stateEngine'
import { InteractionExecutor, createInteraction, type RuntimeContext } from '../engine/interactionEngine'
import { getDevicePreset } from '../engine/responsiveEngine'
import { exportProjectToJSON, importProjectFromJSON, generateReactCode } from '../engine/exportEngine'

describe('Phase 21 — Final QA Complete Workflow Test', () => {
  beforeEach(() => {
    useProjectStore.getState().newProject('QA Workflow Project')
    useSharedComponentStore.setState({ sharedComponents: [], instanceOverrides: {} })
    useFlowEngine.setState({ navigationHistory: [], historyIndex: -1, openOverlays: [] })
  })

  it('successfully executes the complete 18-step prototyping lifecycle', () => {
    const store = useProjectStore.getState()
    expect(store.project).toBeDefined()

    // 1. Create Dashboard Page
    const dashboardPageId = store.addPage('Dashboard Page')
    expect(dashboardPageId).toBeDefined()

    // 2. Create Laptop Frame (1280x800)
    const laptopPreset = getDevicePreset('laptop')!
    expect(laptopPreset).toBeDefined()

    const frameId = store.addFrame(dashboardPageId, {
      name: 'Laptop Frame',
      width: laptopPreset.width,
      height: laptopPreset.height,
      deviceType: 'laptop',
    })
    expect(frameId).toBeDefined()

    // 3. Set Grid = 12 cols, 6 rows
    store.updateGrid(dashboardPageId, frameId, {
      columns: 12,
      rows: 6,
      columnGap: 16,
      rowGap: 16,
    })

    // 4. Add Sidebar (Col 1-2, Rows 1-6)
    const sidebarId = store.addComponent(
      dashboardPageId,
      frameId,
      'sidebar',
      { mode: 'grid', grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 6 } },
      { background: '#181825', width: 220 }
    )
    expect(sidebarId).toBeDefined()

    // 5. Add Navbar (Col 3-12, Row 1)
    const navbarId = store.addComponent(
      dashboardPageId,
      frameId,
      'navbar',
      { mode: 'grid', grid: { gridColumn: 3, gridRow: 1, columnSpan: 10, rowSpan: 1 } },
      { background: '#1e1e2e' }
    )
    expect(navbarId).toBeDefined()

    // 6. Add Cards (Col 3-6, Row 2)
    const cardId = store.addComponent(
      dashboardPageId,
      frameId,
      'stat-card',
      { mode: 'grid', grid: { gridColumn: 3, gridRow: 2, columnSpan: 4, rowSpan: 1 } },
      { title: 'Monthly Revenue', value: '$72,400', change: '+18.2%' }
    )
    expect(cardId).toBeDefined()

    // 7. Promote Sidebar to Shared Component
    const project = useProjectStore.getState().project!
    const page1 = project.pages.find(p => p.id === dashboardPageId)!
    const frame1 = page1.frames.find(f => f.id === frameId)!
    const sidebarComp = frame1.children.find(c => c.id === sidebarId)!

    const sharedSidebarId = useSharedComponentStore.getState().createSharedComponent(
      'Global App Sidebar',
      sidebarComp,
      ['nav-items']
    )
    expect(sharedSidebarId).toBeDefined()

    // 8. Create Settings Page
    const settingsPageId = store.addPage('Settings Page')
    expect(settingsPageId).toBeDefined()

    const settingsFrameId = store.addFrame(settingsPageId, {
      name: 'Settings Frame',
      width: 1280,
      height: 800,
    })

    // 9. Reuse Shared Sidebar on Settings Page
    const sharedInstanceId = store.addComponent(
      settingsPageId,
      settingsFrameId,
      `shared:${sharedSidebarId}`,
      { mode: 'grid', grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 6 } }
    )
    expect(sharedInstanceId).toBeDefined()

    // 10. Change active state override for Settings page
    useSharedComponentStore.getState().setInstanceActiveState(
      sharedSidebarId,
      settingsPageId,
      'settings-active'
    )
    const override = useSharedComponentStore.getState().getInstanceOverride(sharedSidebarId, settingsPageId)
    expect(override?.activeState).toBe('settings-active')

    // 11. Create Button with Navigate Interaction to Settings Page
    const btnId = store.addComponent(
      dashboardPageId,
      frameId,
      'button',
      { mode: 'grid', grid: { gridColumn: 3, gridRow: 3, columnSpan: 2, rowSpan: 1 } },
      { label: 'Go to Settings', variant: 'primary' }
    )

    const navInteraction = createInteraction('click', 'navigate', settingsPageId)
    store.addInteraction(dashboardPageId, frameId, btnId, navInteraction)

    // 12. Add Motion Animation to Button
    store.updateComponentMotion(dashboardPageId, frameId, btnId, {
      preset: 'spring-bounce',
      duration: 350,
      delay: 0,
      easing: 'spring',
    })

    // 13. Connect Flow
    store.addFlowConnection(dashboardPageId, settingsPageId, 'Go to Settings')

    // 14. Execute Interaction via Prototype Runtime Executor
    useFlowEngine.getState().setCurrentPage(dashboardPageId)
    expect(useFlowEngine.getState().currentPageId).toBe(dashboardPageId)

    const runtimeContext: RuntimeContext = {
      navigateTo: (pid: string) => useFlowEngine.getState().navigateTo(pid),
      openOverlay: (oid: string) => useFlowEngine.getState().openOverlay(oid),
      closeOverlay: (oid: string) => useFlowEngine.getState().closeOverlay(oid),
      toggle: () => {},
      changeState: (fid: string, cid: string, st: string) => useStateEngine.getState().setDesignState(fid, cid, st),
      playAnimation: () => {},
      openExternalUrl: () => {},
      runAction: async () => {},
    }

    const executor = new InteractionExecutor(runtimeContext)
    executor.execute(navInteraction)

    // Flow engine navigated to Settings Page
    expect(useFlowEngine.getState().currentPageId).toBe(settingsPageId)
    expect(useFlowEngine.getState().canGoBack()).toBe(true)

    // 15. Navigate Back
    useFlowEngine.getState().navigateBack()
    expect(useFlowEngine.getState().currentPageId).toBe(dashboardPageId)

    // 16. Verify Code Export Engine on Frame
    const updatedFrame = useProjectStore.getState().project!.pages
      .find(p => p.id === dashboardPageId)!.frames.find(f => f.id === frameId)!
    const reactCode = generateReactCode(updatedFrame, 'DashboardView')
    expect(reactCode).toContain('export const DashboardView')
    expect(reactCode).toContain('Monthly Revenue')
    expect(reactCode).toContain('Go to Settings')

    // 17. Verify JSON Persistence Round-trip
    const serialized = exportProjectToJSON(useProjectStore.getState().project!)
    const reimported = importProjectFromJSON(serialized)
    expect(reimported.pages.length).toBeGreaterThanOrEqual(2)

    // 18. Verify Undo / Redo
    expect(store.canUndo()).toBe(true)
  })
})
