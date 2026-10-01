// ============================================================
// SHARED COMPONENTS PANEL — Phase 8
// Panel in Left Panel for viewing and creating global shared components
// ============================================================

import React from 'react'
import { useSharedComponentStore } from '../../store/sharedComponentStore'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'

export const SharedComponentsPanel: React.FC = () => {
  const sharedComponents = useSharedComponentStore(s => s.sharedComponents)
  const deleteSharedComponent = useSharedComponentStore(s => s.deleteSharedComponent)
  const activePageId = useEditorStore(s => s.activePageId)
  const activeFrameId = useEditorStore(s => s.activeFrameId)
  const addComponent = useProjectStore(s => s.addComponent)
  const project = useProjectStore(s => s.project)

  const handlePlaceOnCanvas = (sharedComponentId: string) => {
    if (!activePageId || !activeFrameId) {
      alert('Select a frame first to place a shared component')
      return
    }

    const page = project?.pages.find(p => p.id === activePageId)
    const frame = page?.frames.find(f => f.id === activeFrameId)
    if (!frame) return

    addComponent(
      activePageId,
      activeFrameId,
      `shared:${sharedComponentId}`,
      { mode: 'freeform', freeform: { x: 40, y: 40, width: 240, height: 64 } },
      { sharedComponentId }
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
          Shared Components
        </span>
      </div>

      {sharedComponents.length === 0 ? (
        <div className="px-3 py-4 text-center">
          <p className="text-[#585b70] text-xs">No shared components yet.</p>
          <p className="text-[10px] text-[#45475a] mt-1">
            Right-click a component on the canvas → "Create Shared Component"
          </p>
        </div>
      ) : (
        <div className="space-y-0.5 px-1">
          {sharedComponents.map(sc => (
            <div
              key={sc.id}
              className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-[#313244] group"
            >
              <div className="w-5 h-5 bg-[#89b4fa]/20 rounded flex items-center justify-center text-[10px] text-[#89b4fa] shrink-0">
                ⬡
              </div>
              <span className="flex-1 text-xs text-[#cdd6f4] truncate">{sc.name}</span>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                <button
                  onClick={() => handlePlaceOnCanvas(sc.id)}
                  className="text-[#585b70] hover:text-[#89b4fa] text-[10px]"
                  title="Place on canvas"
                >
                  +
                </button>
                <button
                  onClick={() => deleteSharedComponent(sc.id)}
                  className="text-[#585b70] hover:text-red-400 text-[10px]"
                  title="Delete"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
