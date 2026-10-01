// ============================================================
// TOOLBAR — Phase 1: Editor Shell
// Top bar with mode switching, zoom, and project controls
// ============================================================

import React, { useState } from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'
import { ExportModal } from '../Modals/ExportModal'
import { AIGenerateModal } from '../Modals/AIGenerateModal'
import { cn } from '../../lib/utils'

export const Toolbar: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)

  const mode = useEditorStore(s => s.mode)
  const setMode = useEditorStore(s => s.setMode)
  const zoom = useEditorStore(s => s.canvas.zoom)
  const setCanvasZoom = useEditorStore(s => s.setCanvasZoom)
  const resetCanvas = useEditorStore(s => s.resetCanvas)

  const canUndo = useProjectStore(s => s.canUndo())
  const canRedo = useProjectStore(s => s.canRedo())
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const projectName = useProjectStore(s => s.project?.settings.name ?? 'Untitled')

  const modes = [
    { id: 'design', label: 'Design', icon: '✏️' },
    { id: 'flow', label: 'Flow', icon: '🔀' },
    { id: 'preview', label: 'Preview', icon: '▶️' },
  ] as const

  return (
    <div className="flex items-center justify-between h-10 px-3 bg-[#181825] border-b border-[#45475a] shrink-0 select-none">
      {/* Left: Logo + Project Name */}
      <div className="flex items-center gap-3 min-w-[200px]">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-[#89b4fa] rounded flex items-center justify-center text-[10px] font-bold text-[#1e1e2e]">
            UI
          </div>
          <span className="text-[#cdd6f4] text-xs font-medium">Proto IDE</span>
        </div>
        <span className="text-[#585b70] text-xs">|</span>
        <span className="text-[#cdd6f4] text-xs truncate max-w-[160px]">{projectName}</span>
      </div>

      {/* Center: Mode Switcher */}
      <div className="flex items-center gap-1 bg-[#313244] rounded-md p-0.5">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={cn(
              'flex items-center gap-1 px-3 py-1 rounded text-xs font-medium transition-colors',
              mode === m.id
                ? 'bg-[#89b4fa] text-[#1e1e2e]'
                : 'text-[#585b70] hover:text-[#cdd6f4]'
            )}
          >
            <span>{m.icon}</span>
            <span>{m.label}</span>
          </button>
        ))}
      </div>

      {/* Right: AI & Export + Undo/Redo + Zoom */}
      <div className="flex items-center gap-2 min-w-[320px] justify-end">
        {/* AI Studio & Export Buttons */}
        <button
          onClick={() => setIsAIOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-medium transition-all shadow-sm"
          title="AI UI Generation Studio"
        >
          <span>✦</span>
          <span>AI Studio</span>
        </button>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] text-xs font-medium transition-colors border border-transparent hover:border-[#45475a]"
          title="Export React Code & Project JSON"
        >
          <span>🚀</span>
          <span>Export</span>
        </button>

        {/* Divider */}
        <div className="w-px h-4 bg-[#45475a]" />

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={cn(
              'w-7 h-7 rounded flex items-center justify-center text-xs transition-colors',
              canUndo
                ? 'text-[#cdd6f4] hover:bg-[#313244]'
                : 'text-[#45475a] cursor-not-allowed'
            )}
          >
            ↩
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={cn(
              'w-7 h-7 rounded flex items-center justify-center text-xs transition-colors',
              canRedo
                ? 'text-[#cdd6f4] hover:bg-[#313244]'
                : 'text-[#45475a] cursor-not-allowed'
            )}
          >
            ↪
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-4 bg-[#45475a]" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCanvasZoom(zoom - 0.1)}
            className="w-5 h-5 text-[#585b70] hover:text-[#cdd6f4] text-sm"
          >−</button>
          <button
            onClick={resetCanvas}
            className="text-xs text-[#585b70] hover:text-[#cdd6f4] w-12 text-center"
            title="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            onClick={() => setCanvasZoom(zoom + 0.1)}
            className="w-5 h-5 text-[#585b70] hover:text-[#cdd6f4] text-sm"
          >+</button>
        </div>
      </div>

      {/* Modals */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />
      <AIGenerateModal isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />
    </div>
  )
}
