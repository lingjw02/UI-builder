// ============================================================
// RIGHT PANEL — Properties, Layout, Grid, States, Interactions
// ============================================================

import React from 'react'
import { useEditorStore } from '../../store/editorStore'
import { useProjectStore } from '../../store/projectStore'
import { cn } from '../../lib/utils'
import { GridPanel } from './GridPanel'
import { PropertiesPanel } from './PropertiesPanel'
import { StatesPanel } from './StatesPanel'
import { InteractionPanel } from './InteractionPanel'
import { MotionPanel } from './MotionPanel'

const TABS = [
  { id: 'properties', label: 'Props' },
  { id: 'layout', label: 'Layout' },
  { id: 'states', label: 'States' },
  { id: 'interactions', label: 'Interact' },
  { id: 'animation', label: 'Motion' },
] as const

export const RightPanel: React.FC = () => {
  const tab = useEditorStore(s => s.rightPanelTab)
  const setTab = useEditorStore(s => s.setRightPanelTab)
  const selection = useEditorStore(s => s.selection)
  const activePageId = useEditorStore(s => s.activePageId)
  const activeFrameId = useEditorStore(s => s.activeFrameId)

  const frame = useProjectStore(s =>
    activePageId && activeFrameId
      ? s.project?.pages.find(p => p.id === activePageId)?.frames.find(f => f.id === activeFrameId)
      : undefined
  )

  return (
    <div className="flex flex-col h-full bg-[#181825] border-l border-[#45475a] w-[260px] shrink-0">
      {/* Tab Bar */}
      <div className="flex border-b border-[#45475a] shrink-0 overflow-x-auto">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              'flex-1 py-2 text-[10px] font-medium uppercase tracking-wide transition-colors whitespace-nowrap px-1',
              tab === t.id
                ? 'text-[#89b4fa] border-b-2 border-[#89b4fa] -mb-px'
                : 'text-[#585b70] hover:text-[#cdd6f4]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {!frame && selection.componentIds.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="text-[#45475a] text-3xl mb-3">⬡</div>
            <p className="text-[#585b70] text-xs">Select a frame or component to edit its properties</p>
          </div>
        ) : (
          <>
            {tab === 'properties' && (
              <PropertiesPanel
                pageId={activePageId}
                frameId={activeFrameId}
                frame={frame}
                selectedComponentIds={selection.componentIds}
              />
            )}
            {tab === 'layout' && (
              <GridPanel
                pageId={activePageId}
                frameId={activeFrameId}
                frame={frame}
              />
            )}
            {tab === 'states' && (
              <StatesPanel
                frameId={activeFrameId}
                frame={frame}
                selectedComponentIds={selection.componentIds}
              />
            )}
            {tab === 'interactions' && (
              <InteractionPanel
                pageId={activePageId}
                frameId={activeFrameId}
                selectedComponentIds={selection.componentIds}
              />
            )}
            {tab === 'animation' && (
              <MotionPanel
                pageId={activePageId}
                frameId={activeFrameId}
                selectedComponentIds={selection.componentIds}
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
