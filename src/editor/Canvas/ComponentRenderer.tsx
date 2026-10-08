// ============================================================
// COMPONENT RENDERER — Renders a ComponentInstance on the canvas
// ============================================================

import React from 'react'
import type { ComponentInstance, Frame } from '../../types'
import { getComponentPixelRect } from '../../engine/layoutEngine'
import { getMotionStyles } from '../../engine/motionEngine'
import { useEditorStore } from '../../store/editorStore'
import { useSharedComponentStore } from '../../store/sharedComponentStore'
import { ComponentView } from '../../components/renderers/ComponentView'
import { cn } from '../../lib/utils'

interface ComponentRendererProps {
  component: ComponentInstance
  frame: Frame
  pageId: string
  frameId: string
  isSelected: boolean
  isHovered: boolean
}



export const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  frame,
  pageId,
  frameId,
  isSelected,
  isHovered,
}) => {
  const selectComponent = useEditorStore(s => s.selectComponent)
  const setHoveredComponent = useEditorStore(s => s.setHoveredComponent)
  const startDragComponent = useEditorStore(s => s.startDragComponent)
  const openContextMenu = useEditorStore(s => s.openContextMenu)

  const rect = getComponentPixelRect(frame, component)

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
      }
    : component

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    selectComponent(pageId, frameId, component.id, e.shiftKey)
    if (isSelected) {
      startDragComponent(component.id, e.clientX, e.clientY)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    selectComponent(pageId, frameId, component.id)
    openContextMenu(e.clientX, e.clientY, 'component', component.id)
  }

  const outlineColor = isShared ? '#cba6f7' : '#89b4fa'

  return (
    <div
      data-component-id={component.id}
      className={cn(
        'absolute cursor-pointer transition-all duration-75',
        isSelected && (isShared ? 'outline outline-2 outline-[#cba6f7] outline-offset-0' : 'outline outline-2 outline-[#89b4fa] outline-offset-0'),
        isHovered && !isSelected && (isShared ? 'outline outline-1 outline-[#cba6f7]/50' : 'outline outline-1 outline-[#89b4fa]/50'),
      )}
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        ...getMotionStyles(effectiveComponent.motion),
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setHoveredComponent(component.id)}
      onMouseLeave={() => setHoveredComponent(null)}
      onContextMenu={handleContextMenu}
    >
      <ComponentView
        type={effectiveComponent.componentType}
        props={effectiveComponent.props}
        activeState={effectiveComponent.state}
        isInteractive={false}
      />

      {/* Selection handles */}
      {isSelected && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Corner handles */}
          {['top-0 left-0 -translate-x-1/2 -translate-y-1/2',
            'top-0 right-0 translate-x-1/2 -translate-y-1/2',
            'bottom-0 left-0 -translate-x-1/2 translate-y-1/2',
            'bottom-0 right-0 translate-x-1/2 translate-y-1/2'].map((pos, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-white border rounded-sm ${pos}`}
              style={{ borderColor: outlineColor }}
            />
          ))}
        </div>
      )}

      {/* Component label (shown when hovered or selected) */}
      {(isHovered || isSelected) && (
        <div
          className="absolute -top-5 left-0 text-[#1e1e2e] text-[10px] px-1.5 py-0.5 rounded whitespace-nowrap pointer-events-none z-10 flex items-center gap-1 font-medium"
          style={{ background: outlineColor }}
        >
          {isShared && <span>❖</span>}
          <span>{isShared && sharedDef ? sharedDef.name : (component.name ?? component.componentType)}</span>
        </div>
      )}
    </div>
  )
}
