// ============================================================
// PROTOTYPE ENGINES & STORES TESTS
// ============================================================

import { describe, it, expect, beforeEach } from 'vitest'
import { useSharedComponentStore } from '../store/sharedComponentStore'
import { useStateEngine } from '../engine/stateEngine'
import { useFlowEngine } from '../engine/flowEngine'
import { InteractionExecutor, createInteraction, type RuntimeContext } from '../engine/interactionEngine'
import { createComponentInstance } from '../store/projectFactory'
import type { ComponentInstance } from '../types'

describe('Shared Component Store', () => {
  beforeEach(() => {
    useSharedComponentStore.setState({ sharedComponents: [], instanceOverrides: {} })
  })

  it('creates a shared component and does not duplicate definition', () => {
    const rootInstance: ComponentInstance = createComponentInstance('sidebar', { mode: 'auto' }, { width: 240 })
    const id = useSharedComponentStore.getState().createSharedComponent('Main Sidebar', rootInstance, ['content'])

    expect(id).toBeDefined()
    const sc = useSharedComponentStore.getState().getSharedComponent(id)
    expect(sc?.name).toBe('Main Sidebar')
    expect(sc?.rootInstance.componentType).toBe('sidebar')
  })

  it('maintains page-specific active state and prop overrides for shared instances', () => {
    const rootInstance: ComponentInstance = createComponentInstance('sidebar', { mode: 'auto' })
    const sharedId = useSharedComponentStore.getState().createSharedComponent('Nav Sidebar', rootInstance)

    // Set page 1 override: Home is active
    useSharedComponentStore.getState().setInstanceActiveState(sharedId, 'page-1', 'home-active')
    useSharedComponentStore.getState().setInstancePropOverride(sharedId, 'page-1', 'title', 'Home Page')

    // Set page 2 override: Settings is active
    useSharedComponentStore.getState().setInstanceActiveState(sharedId, 'page-2', 'settings-active')
    useSharedComponentStore.getState().setInstancePropOverride(sharedId, 'page-2', 'title', 'Settings Page')

    const override1 = useSharedComponentStore.getState().getInstanceOverride(sharedId, 'page-1')
    const override2 = useSharedComponentStore.getState().getInstanceOverride(sharedId, 'page-2')

    expect(override1?.activeState).toBe('home-active')
    expect(override1?.propOverrides?.title).toBe('Home Page')

    expect(override2?.activeState).toBe('settings-active')
    expect(override2?.propOverrides?.title).toBe('Settings Page')
  })
})

describe('State Engine', () => {
  beforeEach(() => {
    useStateEngine.setState({ states: {} })
  })

  it('returns default state when no override exists', () => {
    const state = useStateEngine.getState().getActiveState('frame-1', 'comp-1')
    expect(state).toBe('default')
  })

  it('sets and clears temporary state (hover)', () => {
    useStateEngine.getState().setTemporaryState('frame-1', 'comp-1', 'hover')
    expect(useStateEngine.getState().getActiveState('frame-1', 'comp-1')).toBe('hover')

    useStateEngine.getState().clearTemporaryState('frame-1', 'comp-1')
    expect(useStateEngine.getState().getActiveState('frame-1', 'comp-1')).toBe('default')
  })

  it('design state takes precedence and is not cleared by clearTemporaryState', () => {
    useStateEngine.getState().setDesignState('frame-1', 'comp-1', 'disabled')
    expect(useStateEngine.getState().getActiveState('frame-1', 'comp-1')).toBe('disabled')

    useStateEngine.getState().clearTemporaryState('frame-1', 'comp-1')
    expect(useStateEngine.getState().getActiveState('frame-1', 'comp-1')).toBe('disabled')
  })
})

describe('Interaction & Flow Engines', () => {
  beforeEach(() => {
    useFlowEngine.getState().resetNavigation('page-start')
  })

  it('navigates to target page and tracks history', () => {
    const flow = useFlowEngine.getState()
    expect(flow.currentPageId).toBe('page-start')
    expect(flow.canGoBack()).toBe(false)

    useFlowEngine.getState().navigateTo('page-dashboard')
    expect(useFlowEngine.getState().currentPageId).toBe('page-dashboard')
    expect(useFlowEngine.getState().canGoBack()).toBe(true)

    useFlowEngine.getState().navigateTo('page-settings')
    expect(useFlowEngine.getState().currentPageId).toBe('page-settings')

    // Navigate back
    useFlowEngine.getState().navigateBack()
    expect(useFlowEngine.getState().currentPageId).toBe('page-dashboard')

    // Navigate forward
    useFlowEngine.getState().navigateForward()
    expect(useFlowEngine.getState().currentPageId).toBe('page-settings')
  })

  it('executes click interaction and triggers navigation via InteractionExecutor', async () => {
    let navigatedTo = ''
    let overlayOpened = ''

    const mockContext: RuntimeContext = {
      navigateTo: (pageId) => { navigatedTo = pageId },
      openOverlay: (id) => { overlayOpened = id },
      closeOverlay: () => {},
      toggle: () => {},
      changeState: () => {},
      playAnimation: () => {},
      openExternalUrl: () => {},
      runAction: async () => {},
    }

    const executor = new InteractionExecutor(mockContext)

    const navInteraction = createInteraction('click', 'navigate', 'page-analytics')
    await executor.fire('click', [navInteraction])
    expect(navigatedTo).toBe('page-analytics')

    const overlayInteraction = createInteraction('click', 'open-overlay', 'modal-confirm')
    await executor.fire('click', [overlayInteraction])
    expect(overlayOpened).toBe('modal-confirm')
  })
})
