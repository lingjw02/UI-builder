// ============================================================
// FRAME RENDERER — Renders a Frame on the canvas with its grid
// ============================================================

import React, { useRef } from 'react'
import type { Frame, ComponentLayout, PropDefinition } from '../../types'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'
import { ComponentRenderer } from './ComponentRenderer'
import {
  getAllCellGeometries,
  computeDragPreview,
  findAutoPlacementPosition,
  pixelToGridCell,
} from '../../engine/layoutEngine'
import { DEVICE_PRESETS } from '../../engine/responsiveEngine'
import { cn } from '../../lib/utils'
import { getComponentDefinition } from '../../components/registry/componentRegistry'

interface FrameRendererProps {
  frame: Frame
  pageId: string
  x: number   // canvas offset X
  y: number   // canvas offset Y
}

export const FrameRenderer: React.FC<FrameRendererProps> = ({ frame, pageId, x, y }) => {
  const frameRef = useRef<HTMLDivElement>(null)

  const selection = useEditorStore(s => s.selection)
  const hoveredComponentId = useEditorStore(s => s.hoveredComponentId)
  const drag = useEditorStore(s => s.drag)
  const selectFrame = useEditorStore(s => s.selectFrame)
  const endDrag = useEditorStore(s => s.endDrag)
  const openContextMenu = useEditorStore(s => s.openContextMenu)

  const addComponent = useProjectStore(s => s.addComponent)
  const applyDevicePreset = useProjectStore(s => s.applyDevicePreset)

  const isFrameSelected = selection.frameId === frame.id && selection.componentIds.length === 0

  // ── Grid cell overlay ──────────────────
  const cells = frame.layoutMode === 'grid' && frame.grid?.showGrid
    ? getAllCellGeometries(frame)
    : []

  // ── Drag preview ──────────────────────
  let dragPreview = null
  if (drag.isDragging && frameRef.current) {
    const frameRect = frameRef.current.getBoundingClientRect()
    const localX = drag.currentX - frameRect.left
    const localY = drag.currentY - frameRect.top
    if (frame.layoutMode === 'grid') {
      dragPreview = computeDragPreview(
        frame,
        localX,
        localY,
        drag.ghostColumnSpan ?? 1,
        drag.ghostRowSpan ?? 1,
        drag.componentId,
      )
    }
  }

  // ── Drag-over handler ─────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }

  // ── Drop handler ──────────────────────
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const componentType = e.dataTransfer.getData('componentType')
    if (!componentType || !frameRef.current) return

    const def = getComponentDefinition(componentType)
    const defaultProps: Record<string, unknown> = {}
    def?.props.forEach((p: PropDefinition) => { defaultProps[p.name] = p.defaultValue })

    let layout: ComponentLayout

    if (frame.layoutMode === 'grid' && frame.grid) {
      const frameRect = frameRef.current.getBoundingClientRect()
      const localX = e.clientX - frameRect.left
      const localY = e.clientY - frameRect.top

      const cell = pixelToGridCell(frame, localX, localY)

      if (cell) {
        layout = {
          mode: 'grid',
          grid: {
            gridColumn: cell.col,
            gridRow: cell.row,
            columnSpan: 1,
            rowSpan: 1,
          },
        }
      } else if (frame.grid.autoPlace) {
        const pos = findAutoPlacementPosition(frame, 1, 1)
        if (pos) {
          layout = {
            mode: 'grid',
            grid: { gridColumn: pos.col, gridRow: pos.row, columnSpan: 1, rowSpan: 1 },
          }
        } else {
          return // No space available
        }
      } else {
        return
      }
    } else {
      // Freeform layout
      const frameRect = frameRef.current.getBoundingClientRect()
      layout = {
        mode: 'freeform',
        freeform: {
          x: e.clientX - frameRect.left,
          y: e.clientY - frameRect.top,
          width: def?.defaultSize?.width ?? 120,
          height: def?.defaultSize?.height ?? 40,
        },
      }
    }

    addComponent(pageId, frame.id, componentType, layout, defaultProps)
    endDrag()
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === frameRef.current) {
      selectFrame(pageId, frame.id)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    if (e.target === frameRef.current || e.target === e.currentTarget) {
      e.preventDefault()
      selectFrame(pageId, frame.id)
      openContextMenu(e.clientX, e.clientY, 'frame', frame.id)
    }
  }

  return (
    <div
      className="absolute"
      style={{ left: x, top: y }}
    >
      {/* Frame header bar */}
      <div className="absolute -top-7 left-0 right-0 flex items-center justify-between text-[11px] text-[#585b70] font-medium select-none pb-1">
        <div className="flex items-center gap-2">
          <span className="text-[#cdd6f4] font-semibold">{frame.name}</span>
          <span className="text-[#6c7086]">({frame.width} × {frame.height})</span>
          {frame.grid && (
            <span className="bg-[#313244] text-[#89b4fa] text-[10px] px-1.5 py-0.5 rounded font-mono">
              {frame.grid.columns}c × {frame.grid.rows}r
            </span>
          )}
        </div>

        {/* Device preset quick buttons */}
        <div className="flex items-center gap-1 bg-[#181825]/80 backdrop-blur rounded px-1.5 py-0.5 border border-[#313244]">
          {DEVICE_PRESETS.map(preset => {
            const isActive = frame.deviceType === preset.id
            return (
              <button
                key={preset.id}
                onClick={(e) => {
                  e.stopPropagation()
                  applyDevicePreset(pageId, frame.id, preset)
                }}
                title={`${preset.name} (${preset.width}×${preset.height})`}
                className={cn(
                  'px-1.5 py-0.5 rounded text-[10px] transition-colors flex items-center gap-1',
                  isActive
                    ? 'bg-[#89b4fa] text-[#11111b] font-bold'
                    : 'text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244]'
                )}
              >
                <span>{preset.icon}</span>
                <span className="hidden sm:inline capitalize">{preset.id}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Frame body */}
      <div
        ref={frameRef}
        className={cn(
          'relative overflow-hidden',
          isFrameSelected && 'outline outline-2 outline-[#89b4fa]',
        )}
        style={{
          width: frame.width,
          height: frame.height,
          background: frame.background,
        }}
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Grid cell overlay */}
        {cells.map(cell => (
          <div
            key={`${cell.column}-${cell.row}`}
            className="absolute border border-[#89b4fa]/15 pointer-events-none"
            style={{
              left: cell.x,
              top: cell.y,
              width: cell.width,
              height: cell.height,
            }}
          />
        ))}

        {/* Drag preview ghost */}
        {dragPreview && (
          <div
            className={cn(
              'absolute pointer-events-none rounded transition-all',
              dragPreview.isValid
                ? 'bg-[#89b4fa]/20 border-2 border-[#89b4fa] border-dashed'
                : 'bg-red-400/20 border-2 border-red-400 border-dashed'
            )}
            style={{
              left: dragPreview.rect.x,
              top: dragPreview.rect.y,
              width: dragPreview.rect.width,
              height: dragPreview.rect.height,
            }}
          />
        )}

        {/* Components */}
        {frame.children.map(component => (
          <ComponentRenderer
            key={component.id}
            component={component}
            frame={frame}
            pageId={pageId}
            frameId={frame.id}
            isSelected={selection.componentIds.includes(component.id)}
            isHovered={hoveredComponentId === component.id}
          />
        ))}
      </div>
    </div>
  )
}
