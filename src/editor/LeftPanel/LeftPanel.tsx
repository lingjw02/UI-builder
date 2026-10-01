// ============================================================
// LEFT PANEL — Pages / Components / Shared
// Phase 1 + 4 + 8
// ============================================================

import React, { useState } from 'react'
import { getAllComponentDefinitions, getComponentsByCategory, searchComponents } from '../../components/registry/componentRegistry'
import { useEditorStore } from '../../store/editorStore'
import { cn } from '../../lib/utils'
import type { ComponentCategory } from '../../types'
import { PagePanel } from './PagePanel'
import { SharedComponentsPanel } from './SharedComponentsPanel'
import { MockDataPanel } from './MockDataPanel'
import { TemplatesPanel } from './TemplatesPanel'

const CATEGORIES: { id: ComponentCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'layout', label: 'Layout' },
  { id: 'basic-ui', label: 'Basic UI' },
  { id: 'navigation', label: 'Nav' },
  { id: 'content', label: 'Content' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'media', label: 'Media' },
  { id: 'data', label: 'Data' },
  { id: 'ai-agent', label: 'AI' },
]

type LeftTab = 'pages' | 'components' | 'shared' | 'api' | 'templates'

export const LeftPanel: React.FC = () => {
  const [leftTab, setLeftTab] = useState<LeftTab>('pages')
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<ComponentCategory | 'all'>('all')
  const startDragFromLibrary = useEditorStore(s => s.startDragFromLibrary)

  const components = search
    ? searchComponents(search)
    : selectedCategory === 'all'
      ? getAllComponentDefinitions()
      : getComponentsByCategory(selectedCategory as ComponentCategory)

  const handleDragStart = (e: React.DragEvent, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType)
    e.dataTransfer.effectAllowed = 'copy'
    startDragFromLibrary(componentType, e.clientX, e.clientY)
  }

  return (
    <div className="flex flex-col h-full bg-[#181825] border-r border-[#45475a] w-[240px] shrink-0">
      {/* Tab switcher */}
      <div className="flex border-b border-[#45475a] shrink-0">
        {([
          { id: 'pages', label: 'Pages' },
          { id: 'components', label: 'Lib' },
          { id: 'templates', label: 'Tmpl' },
          { id: 'shared', label: 'Shared' },
          { id: 'api', label: 'API' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setLeftTab(t.id)}
            className={cn(
              'flex-1 py-2 text-[10px] font-medium uppercase tracking-wide transition-colors',
              leftTab === t.id
                ? 'text-[#89b4fa] border-b-2 border-[#89b4fa] -mb-px'
                : 'text-[#585b70] hover:text-[#cdd6f4]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Pages tab */}
      {leftTab === 'pages' && (
        <div className="flex-1 overflow-y-auto pt-2">
          <PagePanel />
        </div>
      )}

      {/* Shared Components tab */}
      {leftTab === 'shared' && (
        <div className="flex-1 overflow-y-auto pt-2">
          <SharedComponentsPanel />
        </div>
      )}

      {/* Mock API tab */}
      {leftTab === 'api' && (
        <div className="flex-1 overflow-y-auto">
          <MockDataPanel />
        </div>
      )}

      {/* Templates tab */}
      {leftTab === 'templates' && (
        <div className="flex-1 overflow-y-auto">
          <TemplatesPanel />
        </div>
      )}

      {/* Components tab */}
      {leftTab === 'components' && (
        <>
          <div className="px-2 py-2 border-b border-[#45475a]">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search components..."
              className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none placeholder-[#585b70] border border-transparent focus:border-[#89b4fa]"
            />
          </div>

          {!search && (
            <div className="flex flex-wrap gap-1 p-2 border-b border-[#45475a]">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'text-[10px] px-2 py-0.5 rounded transition-colors',
                    selectedCategory === cat.id
                      ? 'bg-[#89b4fa] text-[#1e1e2e] font-semibold'
                      : 'text-[#585b70] hover:text-[#cdd6f4] hover:bg-[#313244]'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {components.length === 0 ? (
              <p className="text-[#585b70] text-xs text-center py-4">No components found</p>
            ) : (
              components.map(def => (
                <div
                  key={def.type}
                  draggable
                  onDragStart={e => handleDragStart(e, def.type)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-[#313244] active:cursor-grabbing group transition-colors"
                  title={def.description}
                >
                  <div className="w-5 h-5 bg-[#313244] group-hover:bg-[#45475a] rounded flex items-center justify-center text-[10px] text-[#89b4fa] shrink-0 font-mono transition-colors">
                    {def.name[0]}
                  </div>
                  <span className="text-xs text-[#cdd6f4] truncate">{def.name}</span>
                </div>
              ))
            )}
          </div>

          <div className="px-3 py-1.5 border-t border-[#45475a]">
            <p className="text-[10px] text-[#585b70]">{components.length} components</p>
          </div>
        </>
      )}
    </div>
  )
}
