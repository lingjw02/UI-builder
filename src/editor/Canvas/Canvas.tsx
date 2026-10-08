// ============================================================
// CANVAS — Main editing area
// Drag-and-drop visual design surface
// ============================================================

import React, { useRef, useCallback } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'
import { FrameRenderer } from './FrameRenderer'

const FRAME_MARGIN = 80   // pixels between frames

export const Canvas: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const isPanning = useRef(false)
  const lastPan = useRef({ x: 0, y: 0 })

  const canvas = useEditorStore(s => s.canvas)
  const mode = useEditorStore(s => s.mode)
  const drag = useEditorStore(s => s.drag)
  const panCanvas = useEditorStore(s => s.panCanvas)
  const setCanvasZoom = useEditorStore(s => s.setCanvasZoom)
  const clearSelection = useEditorStore(s => s.clearSelection)
  const updateDrag = useEditorStore(s => s.updateDrag)
  const endDrag = useEditorStore(s => s.endDrag)
  const closeContextMenu = useEditorStore(s => s.closeContextMenu)

  const activePageId = useEditorStore(s => s.activePageId)
  const project = useProjectStore(s => s.project)

  const activePage = project?.pages.find(p => p.id === activePageId) ?? project?.pages[0]

  // ── Wheel zoom / pan ──────────────────

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = -e.deltaY * 0.001
      setCanvasZoom(canvas.zoom + delta)
    } else {
      // Pan
      panCanvas(-e.deltaX, -e.deltaY)
    }
  }, [canvas.zoom, setCanvasZoom, panCanvas])

  // ── Middle-mouse pan ──────────────────

  const handleMouseDown = (e: React.MouseEvent) => {
    closeContextMenu()
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      isPanning.current = true
      lastPan.current = { x: e.clientX, y: e.clientY }
      e.preventDefault()
    } else if (e.button === 0 && e.target === canvasRef.current) {
      clearSelection()
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      const dx = e.clientX - lastPan.current.x
      const dy = e.clientY - lastPan.current.y
      panCanvas(dx, dy)
      lastPan.current = { x: e.clientX, y: e.clientY }
    }
    if (drag.isDragging) {
      updateDrag(e.clientX, e.clientY)
    }
  }

  const handleMouseUp = () => {
    isPanning.current = false
    if (drag.isDragging) {
      endDrag()
    }
  }

  // ── Frame layout positions ────────────

  // Simple: just use frame list with accumulated X
  const frameLayouts: Array<{ frameId: string; x: number; y: number }> = []
  if (activePage) {
    let currentX = FRAME_MARGIN
    for (const frame of activePage.frames) {
      frameLayouts.push({ frameId: frame.id, x: currentX, y: FRAME_MARGIN })
      currentX += frame.width + FRAME_MARGIN
    }
  }

  if (!project) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#1e1e2e]">
        <div className="text-center">
          <div className="text-6xl mb-4">🎨</div>
          <h2 className="text-[#cdd6f4] text-xl font-medium mb-2">Welcome to UI Prototyping IDE</h2>
          <p className="text-[#585b70] text-sm">Create a new project to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex-1 overflow-hidden relative bg-[#1e1e2e]"
      style={{ cursor: isPanning.current ? 'grabbing' : mode === 'design' ? 'default' : 'default' }}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      ref={canvasRef}
    >
      {/* Dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #45475a 1px, transparent 1px)`,
          backgroundSize: `${20 * canvas.zoom}px ${20 * canvas.zoom}px`,
          backgroundPosition: `${canvas.x % (20 * canvas.zoom)}px ${canvas.y % (20 * canvas.zoom)}px`,
        }}
      />

      {/* Viewport transform */}
      <div
        className="absolute origin-top-left"
        style={{
          transform: `translate(${canvas.x}px, ${canvas.y}px) scale(${canvas.zoom})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Render all frames in active page */}
        {activePage?.frames.map((frame, i) => {
          const layout = frameLayouts[i]
          if (!layout) return null
          return (
            <FrameRenderer
              key={frame.id}
              frame={frame}
              pageId={activePage.id}
              x={layout.x}
              y={layout.y}
            />
          )
        })}

        {/* Empty state */}
        {activePage && activePage.frames.length === 0 && (
          <div
            className="absolute flex items-center justify-center"
            style={{ left: FRAME_MARGIN, top: FRAME_MARGIN, width: 400, height: 300 }}
          >
            <div className="text-center text-[#45475a]">
              <div className="text-4xl mb-2">⊞</div>
              <p className="text-sm">No frames yet. Add a frame to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-3 right-3 text-[10px] text-[#585b70] bg-[#181825] px-2 py-1 rounded">
        {Math.round(canvas.zoom * 100)}%
      </div>
    </div>
  )
}
