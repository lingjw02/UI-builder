// ============================================================
// STATUS BAR — Bottom bar with contextual info
// Phase 1: Editor Shell
// ============================================================

import React from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'

export const StatusBar: React.FC = () => {
  const mode = useEditorStore(s => s.mode)
  const selection = useEditorStore(s => s.selection)
  const canvas = useEditorStore(s => s.canvas)
  const activePageId = useEditorStore(s => s.activePageId)
  const activeFrameId = useEditorStore(s => s.activeFrameId)

  const project = useProjectStore(s => s.project)
  const activePage = project?.pages.find(p => p.id === (activePageId ?? project?.pages[0]?.id))
  const activeFrame = activePage?.frames.find(f => f.id === activeFrameId)

  const totalComponents = activeFrame?.children.length ?? 0
  const selectedCount = selection.componentIds.length

  return (
    <div className="flex items-center justify-between h-7 px-4 bg-[#181825] border-t border-[#45475a] shrink-0 text-[10px] text-[#585b70] select-none">
      {/* Left */}
      <div className="flex items-center gap-4">
        <span className="capitalize">{mode} Mode</span>
        {activePage && <span>Page: {activePage.name}</span>}
        {activeFrame && <span>Frame: {activeFrame.name} ({activeFrame.width}×{activeFrame.height})</span>}
        {activeFrame?.layoutMode && (
          <span className="capitalize">{activeFrame.layoutMode}</span>
        )}
        {activeFrame?.layoutMode === 'grid' && activeFrame.grid && (
          <span>{activeFrame.grid.columns}×{activeFrame.grid.rows} grid</span>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        {selectedCount > 0 && (
          <span className="text-[#89b4fa]">{selectedCount} selected</span>
        )}
        <span>{totalComponents} component{totalComponents !== 1 ? 's' : ''}</span>
        <span>{Math.round(canvas.zoom * 100)}%</span>
        <span className="text-[#45475a]">UI Prototyping IDE v0.1.0</span>
      </div>
    </div>
  )
}
