// ============================================================
// PROTOTYPE RUNTIME
// Executes the interactive prototype:
//   - Renders the current page in preview mode
//   - Handles click/hover triggers
//   - Executes navigation, state changes, overlays
//   - Shows mock API loading states
// ============================================================

import React, { useEffect } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useSharedComponentStore } from '../../store/sharedComponentStore'
import { useFlowEngine } from '../../engine/flowEngine'
import { useStateEngine } from '../../engine/stateEngine'
import { useEditorStore } from '../../store/editorStore'
import { InteractionExecutor, type RuntimeContext } from '../../engine/interactionEngine'
import type { ComponentInstance, Frame, Page } from '../../types'
import { getComponentPixelRect } from '../../engine/layoutEngine'
import { getMotionStyles } from '../../engine/motionEngine'
import { ComponentView } from '../../components/renderers/ComponentView'
import { cn } from '../../lib/utils'

// ─────────────────────────────────────────
// Runtime Component Renderer
// Renders components with full interaction support
// ─────────────────────────────────────────

interface RuntimeComponentProps {
  component: ComponentInstance
  frame: Frame
  pageId: string
  executor: InteractionExecutor
}

const RuntimeComponent: React.FC<RuntimeComponentProps> = ({ component, frame, pageId, executor }) => {
  const isShared = component.componentType.startsWith('shared:')
  const sharedId = isShared
    ? component.componentType.replace('shared:', '')
    : (component.props?.sharedComponentId as string | undefined)

  const sharedDef = useSharedComponentStore(s => sharedId ? s.getSharedComponent(sharedId) : undefined)
  const instanceOverride = useSharedComponentStore(s => (sharedId && pageId) ? s.getInstanceOverride(sharedId, pageId) : undefined)

  const effectiveComponent: ComponentInstance = isShared && sharedDef
    ? {
        ...sharedDef.rootInstance,
        id: component.id,
        layout: component.layout,
        props: {
          ...sharedDef.rootInstance.props,
          ...(instanceOverride?.propOverrides ?? {}),
          ...component.props,
        },
        state: instanceOverride?.activeState ?? sharedDef.rootInstance.state,
        interactions: [
          ...(sharedDef.rootInstance.interactions ?? []),
          ...(component.interactions ?? []),
        ],
      }
    : component

  const activeStateName = useStateEngine(s => s.getActiveState(frame.id, effectiveComponent.id))
  const setTemporaryState = useStateEngine(s => s.setTemporaryState)
  const clearTemporaryState = useStateEngine(s => s.clearTemporaryState)
  const openOverlays = useFlowEngine(s => s.openOverlays)

  const rect = getComponentPixelRect(frame, effectiveComponent)
  const props = effectiveComponent.props
  const type = effectiveComponent.componentType
  const interactions = effectiveComponent.interactions ?? []

  const hasClickInteraction = interactions.some(i => i.trigger === 'click')
  const hasHoverInteraction = interactions.some(i => i.trigger === 'hover')

  const handleClick = async () => {
    await executor.fire('click', interactions)
  }

  const handleMouseEnter = async () => {
    setTemporaryState(frame.id, effectiveComponent.id, 'hover')
    await executor.fire('hover', interactions)
  }

  const handleMouseLeave = () => {
    clearTemporaryState(frame.id, effectiveComponent.id)
  }

  // Skip if this is an overlay component and it's not open
  if (type === 'modal' && !openOverlays.includes(effectiveComponent.id)) {
    return null
  }

  const content = renderRuntimeContent(type, props, activeStateName)

  return (
    <div
      data-component-id={effectiveComponent.id}
      className={cn(
        'absolute overflow-hidden',
        hasClickInteraction && 'cursor-pointer',
        hasHoverInteraction && 'cursor-pointer',
      )}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        ...getMotionStyles(effectiveComponent.motion),
      }}
      onClick={hasClickInteraction ? handleClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {content}

      {/* Interaction indicator (subtle pulse) */}
      {hasClickInteraction && (
        <div className="absolute inset-0 hover:ring-2 hover:ring-[#89b4fa]/30 rounded pointer-events-none transition-all" />
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// Runtime content rendering (state-aware)
// ─────────────────────────────────────────

function renderRuntimeContent(
  type: string,
  props: Record<string, unknown>,
  activeState: string
): React.ReactNode {
  return (
    <ComponentView
      type={type}
      props={props}
      activeState={activeState}
      isInteractive={true}
    />
  )
}

// ─────────────────────────────────────────
// Runtime Frame Renderer
// ─────────────────────────────────────────

interface RuntimeFrameProps {
  frame: Frame
  pageId: string
  executor: InteractionExecutor
}

const RuntimeFrame: React.FC<RuntimeFrameProps> = ({ frame, pageId, executor }) => {
  return (
    <div
      className="relative overflow-hidden shadow-2xl"
      style={{
        width: frame.width,
        height: frame.height,
        background: frame.background,
      }}
    >
      {frame.children.map(component => (
        <RuntimeComponent
          key={component.id}
          component={component}
          frame={frame}
          pageId={pageId}
          executor={executor}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────
// Prototype Runtime (main)
// ─────────────────────────────────────────

export const PrototypeRuntime: React.FC = () => {
  const project = useProjectStore(s => s.project)
  const currentPageId = useFlowEngine(s => s.currentPageId)
  const navigateTo = useFlowEngine(s => s.navigateTo)
  const openOverlay = useFlowEngine(s => s.openOverlay)
  const closeOverlay = useFlowEngine(s => s.closeOverlay)
  const toggleOverlay = useFlowEngine(s => s.toggleOverlay)
  const changeState = useStateEngine(s => s.setDesignState)
  const canGoBack = useFlowEngine(s => s.canGoBack())
  const canGoForward = useFlowEngine(s => s.canGoForward())
  const navigateBack = useFlowEngine(s => s.navigateBack)
  const navigateForward = useFlowEngine(s => s.navigateForward)
  const setMode = useEditorStore(s => s.setMode)

  const pages = project?.pages ?? []
  const activePage: Page | undefined =
    pages.find(p => p.id === currentPageId) ?? pages[0]

  // Build the runtime context
  const context: RuntimeContext = {
    navigateTo,
    openOverlay,
    closeOverlay,
    toggle: toggleOverlay,
    changeState,
    playAnimation: (componentId, animationId) => {
      const el = document.querySelector(`[data-component-id="${componentId}"]`) as HTMLElement | null
      if (el) {
        el.style.animation = 'none'
        void el.offsetWidth
        el.style.animation = `proto-${animationId} 400ms cubic-bezier(0.175, 0.885, 0.32, 1.275) both`
      }
    },
    openExternalUrl: (url) => {
      window.open(url, '_blank', 'noopener,noreferrer')
    },
    runAction: async (actionId) => {
      // Mock API action handler
      console.log('[Runtime] runAction', actionId)
    },
  }

  const executor = new InteractionExecutor(context)

  // Execute "load" interactions on page mount
  useEffect(() => {
    if (!activePage) return
    activePage.frames.forEach(frame => {
      frame.children.forEach(async comp => {
        const loadInteractions = (comp.interactions ?? []).filter(i => i.trigger === 'load')
        if (loadInteractions.length > 0) {
          await executor.fire('load', comp.interactions ?? [])
        }
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage?.id])

  if (!activePage) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e2e]">
        <div className="text-center text-[#45475a]">
          <div className="text-4xl mb-2">▶</div>
          <p className="text-sm">No pages to preview</p>
        </div>
      </div>
    )
  }

  const activeFrame = activePage.frames[0]

  return (
    <div className="flex-1 flex flex-col bg-[#1e1e2e] overflow-hidden">
      {/* Preview toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#181825] border-b border-[#45475a]">
        <div className="flex items-center gap-2">
          {/* Back/Forward */}
          <button
            onClick={navigateBack}
            disabled={!canGoBack}
            className={cn(
              'w-7 h-7 rounded flex items-center justify-center text-sm',
              canGoBack ? 'text-[#cdd6f4] hover:bg-[#313244]' : 'text-[#45475a] cursor-not-allowed'
            )}
          >←</button>
          <button
            onClick={navigateForward}
            disabled={!canGoForward}
            className={cn(
              'w-7 h-7 rounded flex items-center justify-center text-sm',
              canGoForward ? 'text-[#cdd6f4] hover:bg-[#313244]' : 'text-[#45475a] cursor-not-allowed'
            )}
          >→</button>

          <div className="w-px h-4 bg-[#45475a]" />

          {/* Page breadcrumb */}
          <span className="text-xs text-[#cdd6f4]">
            {activePage.name}
          </span>

          {/* Page jump */}
          <select
            value={activePage.id}
            onChange={e => navigateTo(e.target.value)}
            className="bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
          >
            {pages.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          {/* Frame info */}
          {activeFrame && (
            <span className="text-[10px] text-[#585b70]">
              {activeFrame.width} × {activeFrame.height}
            </span>
          )}

          {/* Exit preview */}
          <button
            onClick={() => setMode('design')}
            className="text-xs text-[#585b70] hover:text-[#cdd6f4] px-2 py-1 rounded hover:bg-[#313244] transition-colors"
          >
            ✕ Exit Preview
          </button>
        </div>
      </div>

      {/* Runtime canvas */}
      <div className="flex-1 overflow-auto flex items-start justify-center p-8">
        {activeFrame ? (
          <div className="relative">
            {/* Device chrome hint */}
            <div className="text-[10px] text-[#585b70] text-center mb-2">
              {activeFrame.name} — {activePage.name}
            </div>
            <RuntimeFrame frame={activeFrame} pageId={activePage.id} executor={executor} />
          </div>
        ) : (
          <div className="text-[#45475a] text-sm">No frame in this page</div>
        )}
      </div>
    </div>
  )
}
