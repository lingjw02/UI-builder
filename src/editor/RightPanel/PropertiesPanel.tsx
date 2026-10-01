// ============================================================
// PROPERTIES PANEL — Right Panel Properties Tab
// Shows editable props for selected components or frame info
// ============================================================

import React from 'react'
import { useProjectStore } from '../../store/projectStore'
import { getComponentDefinition } from '../../components/registry/componentRegistry'
import type { Frame, PropDefinition, PropOption } from '../../types'

interface PropertiesPanelProps {
  pageId: string | null
  frameId: string | null
  frame?: Frame
  selectedComponentIds: string[]
}

export const PropertiesPanel: React.FC<PropertiesPanelProps> = ({
  pageId,
  frameId,
  frame,
  selectedComponentIds,
}) => {
  const updateComponentProps = useProjectStore(s => s.updateComponentProps)
  const updateFrame = useProjectStore(s => s.updateFrame)

  const selectedComponent = frame?.children.find(c => c.id === selectedComponentIds[0])
  const def = selectedComponent ? getComponentDefinition(selectedComponent.componentType) : undefined

  // ── No selection ───────────────────────
  if (!frame) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">Select a frame or component</p>
      </div>
    )
  }

  // ── Frame selected (no component) ──────
  if (!selectedComponent) {
    return (
      <div className="p-3 space-y-3">
        <div>
          <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-2">
            Frame
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#585b70]">Name</span>
              <input
                type="text"
                value={frame.name}
                onChange={e => pageId && frameId && updateFrame(pageId, frameId, { name: e.target.value })}
                className="flex-1 bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa] text-right"
              />
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-[#585b70]">Background</span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={frame.background}
                  onChange={e => pageId && frameId && updateFrame(pageId, frameId, { background: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="text-xs text-[#cdd6f4] font-mono">{frame.background}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Component selected ─────────────────
  return (
    <div className="p-3 space-y-3">
      <div>
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-1">
          {def?.name ?? selectedComponent.componentType}
        </h3>
        <p className="text-[10px] text-[#45475a] mb-3">{def?.description}</p>

        {def?.props.map((prop: PropDefinition) => {
          const value = selectedComponent.props[prop.name] ?? prop.defaultValue

          const handleChange = (newValue: unknown) => {
            if (!pageId || !frameId) return
            updateComponentProps(pageId, frameId, selectedComponent.id, { [prop.name]: newValue })
          }

          return (
            <div key={prop.name} className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] text-[#585b70] shrink-0">{prop.label}</span>

              {prop.type === 'boolean' && (
                <input
                  type="checkbox"
                  checked={!!value}
                  onChange={e => handleChange(e.target.checked)}
                  className="accent-[#89b4fa]"
                />
              )}

              {(prop.type === 'string' || prop.type === 'text') && (
                <input
                  type="text"
                  value={String(value)}
                  onChange={e => handleChange(e.target.value)}
                  className="flex-1 bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa] text-right min-w-0"
                />
              )}

              {prop.type === 'number' && (
                <input
                  type="number"
                  value={Number(value)}
                  onChange={e => handleChange(Number(e.target.value))}
                  className="w-16 bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa] text-right"
                />
              )}

              {prop.type === 'color' && (
                <div className="flex items-center gap-1">
                  <input
                    type="color"
                    value={String(value)}
                    onChange={e => handleChange(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[10px] text-[#cdd6f4] font-mono">{String(value)}</span>
                </div>
              )}

              {prop.type === 'select' && prop.options && (
                <select
                  value={String(value)}
                  onChange={e => handleChange(e.target.value)}
                  className="bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
                >
                  {prop.options.map((opt: PropOption) => (
                    <option key={String(opt.value)} value={String(opt.value)}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
