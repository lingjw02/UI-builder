// ============================================================
// PAGE PANEL — Within Left Panel: Page list and navigation
// ============================================================

import React, { useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useEditorStore } from '../../store/editorStore'
import { cn } from '../../lib/utils'

export const PagePanel: React.FC = () => {
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const project = useProjectStore(s => s.project)
  const addPage = useProjectStore(s => s.addPage)
  const renamePage = useProjectStore(s => s.renamePage)
  const deletePage = useProjectStore(s => s.deletePage)

  const activePageId = useEditorStore(s => s.activePageId)
  const setActivePage = useEditorStore(s => s.setActivePage)
  const setActiveFrame = useEditorStore(s => s.setActiveFrame)

  const pages = project?.pages ?? []

  const handleSelectPage = (pageId: string, page: typeof pages[number]) => {
    setActivePage(pageId)
    // Auto-select first frame
    if (page.frames.length > 0) {
      setActiveFrame(page.frames[0].id)
    }
  }

  const handleStartEdit = (e: React.MouseEvent, pageId: string, name: string) => {
    e.stopPropagation()
    setEditing(pageId)
    setEditValue(name)
  }

  const handleFinishEdit = (pageId: string) => {
    if (editValue.trim()) {
      renamePage(pageId, editValue.trim())
    }
    setEditing(null)
  }

  return (
    <div className="flex flex-col">
      {/* Section header */}
      <div className="flex items-center justify-between px-3 py-1.5">
        <span className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
          Pages
        </span>
        <button
          onClick={() => {
            const id = addPage()
            setActivePage(id)
          }}
          className="text-[#585b70] hover:text-[#89b4fa] text-sm leading-none"
          title="Add page"
        >
          +
        </button>
      </div>

      {/* Page list */}
      <div className="space-y-0.5 px-1">
        {pages.map(page => (
          <div
            key={page.id}
            className={cn(
              'flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer group',
              activePageId === page.id
                ? 'bg-[#89b4fa]/20 text-[#89b4fa]'
                : 'text-[#cdd6f4] hover:bg-[#313244]'
            )}
            onClick={() => handleSelectPage(page.id, page)}
          >
            <span className="text-[10px] shrink-0">⬡</span>

            {editing === page.id ? (
              <input
                autoFocus
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={() => handleFinishEdit(page.id)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleFinishEdit(page.id)
                  if (e.key === 'Escape') setEditing(null)
                }}
                className="flex-1 bg-transparent text-xs outline-none border-b border-[#89b4fa]"
                onClick={e => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 text-xs truncate">{page.name}</span>
            )}

            {/* Actions */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={e => handleStartEdit(e, page.id, page.name)}
                className="text-[#585b70] hover:text-[#cdd6f4] text-[10px]"
                title="Rename"
              >✏</button>
              {pages.length > 1 && (
                <button
                  onClick={e => { e.stopPropagation(); deletePage(page.id) }}
                  className="text-[#585b70] hover:text-red-400 text-[10px]"
                  title="Delete"
                >✕</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
