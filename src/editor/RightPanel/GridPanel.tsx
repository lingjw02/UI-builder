// ============================================================
// GRID PANEL — Right Panel Layout Tab
// Phase 6: Grid configuration in the Right Panel
// ============================================================

import React from 'react'
import { useProjectStore } from '../../store/projectStore'
import { DEVICE_PRESETS } from '../../engine/responsiveEngine'
import { cn } from '../../lib/utils'
import type { Frame, LayoutMode, GridConfig } from '../../types'

interface GridPanelProps {
  pageId: string | null
  frameId: string | null
  frame?: Frame
}

function NumberInput({
  label,
  value,
  onChange,
  min = 0,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-[#585b70] whitespace-nowrap">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        onChange={e => onChange(Number(e.target.value))}
        className="w-16 bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 text-right outline-none border border-transparent focus:border-[#89b4fa]"
      />
    </div>
  )
}

export const GridPanel: React.FC<GridPanelProps> = ({ pageId, frameId, frame }) => {
  const updateFrame = useProjectStore(s => s.updateFrame)
  const updateGrid = useProjectStore(s => s.updateGrid)
  const setLayoutMode = useProjectStore(s => s.setLayoutMode)
  const applyDevicePreset = useProjectStore(s => s.applyDevicePreset)

  if (!frame || !pageId || !frameId) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">Select a frame to configure its layout</p>
      </div>
    )
  }

  const layoutMode = frame.layoutMode
  const grid = frame.grid

  const handleLayoutMode = (mode: LayoutMode) => {
    setLayoutMode(pageId, frameId, mode)
  }

  const handleGridUpdate = (updates: Partial<GridConfig>) => {
    if (!grid) return
    updateGrid(pageId, frameId, updates)
  }

  return (
    <div className="p-3 space-y-4">
      {/* Device Preset Switcher */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-2">
          Device Preset
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {DEVICE_PRESETS.map(preset => {
            const isCurrent = frame.deviceType === preset.id
            return (
              <button
                key={preset.id}
                onClick={() => applyDevicePreset(pageId, frameId, preset)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1.5 rounded text-xs transition-colors border text-left',
                  isCurrent
                    ? 'bg-[#89b4fa]/15 border-[#89b4fa] text-[#89b4fa] font-medium'
                    : 'bg-[#313244]/60 border-transparent text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4]'
                )}
              >
                <span>{preset.icon}</span>
                <div className="min-w-0">
                  <div className="truncate font-medium">{preset.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-[#6c7086]">{preset.width}×{preset.height}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {/* Frame Size */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-2">
          Frame Dimensions
        </h3>
        <div className="space-y-2">
          <NumberInput
            label="Width"
            value={frame.width}
            onChange={v => updateFrame(pageId, frameId, { width: v })}
            min={1}
          />
          <NumberInput
            label="Height"
            value={frame.height}
            onChange={v => updateFrame(pageId, frameId, { height: v })}
            min={1}
          />
        </div>
      </section>

      {/* Layout Mode */}
      <section>
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-2">
          Layout Mode
        </h3>
        <div className="space-y-1">
          {(['freeform', 'grid', 'auto'] as LayoutMode[]).map(mode => (
            <button
              key={mode}
              onClick={() => handleLayoutMode(mode)}
              className={cn(
                'w-full flex items-center gap-2 px-2 py-1.5 rounded text-xs transition-colors text-left',
                layoutMode === mode
                  ? 'bg-[#89b4fa]/20 text-[#89b4fa]'
                  : 'text-[#585b70] hover:text-[#cdd6f4] hover:bg-[#313244]'
              )}
            >
              <span className="w-3 h-3 rounded-full border flex items-center justify-center">
                {layoutMode === mode && <span className="w-1.5 h-1.5 rounded-full bg-[#89b4fa]" />}
              </span>
              <span className="capitalize">{mode === 'auto' ? 'Auto Layout' : mode.charAt(0).toUpperCase() + mode.slice(1)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid Config */}
      {layoutMode === 'grid' && grid && (
        <section>
          <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold mb-2">
            Grid
          </h3>
          <div className="space-y-2">
            <NumberInput label="Columns" value={grid.columns} onChange={v => handleGridUpdate({ columns: Math.max(1, v) })} min={1} />
            <NumberInput label="Rows" value={grid.rows} onChange={v => handleGridUpdate({ rows: Math.max(1, v) })} min={1} />
          </div>

          <h4 className="text-[10px] text-[#585b70] mt-3 mb-2">Gap</h4>
          <div className="space-y-2">
            <NumberInput label="Column Gap" value={grid.columnGap} onChange={v => handleGridUpdate({ columnGap: v })} />
            <NumberInput label="Row Gap" value={grid.rowGap} onChange={v => handleGridUpdate({ rowGap: v })} />
          </div>

          <h4 className="text-[10px] text-[#585b70] mt-3 mb-2">Padding</h4>
          <div className="space-y-2">
            <NumberInput label="Top" value={grid.padding.top} onChange={v => handleGridUpdate({ padding: { ...grid.padding, top: v } })} />
            <NumberInput label="Right" value={grid.padding.right} onChange={v => handleGridUpdate({ padding: { ...grid.padding, right: v } })} />
            <NumberInput label="Bottom" value={grid.padding.bottom} onChange={v => handleGridUpdate({ padding: { ...grid.padding, bottom: v } })} />
            <NumberInput label="Left" value={grid.padding.left} onChange={v => handleGridUpdate({ padding: { ...grid.padding, left: v } })} />
          </div>

          {/* Toggles */}
          <div className="mt-3 space-y-2">
            {[
              { key: 'showGrid', label: 'Show Grid' },
              { key: 'snap', label: 'Snap to Grid' },
              { key: 'autoPlace', label: 'Auto Placement' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!grid[key as keyof typeof grid]}
                  onChange={e => handleGridUpdate({ [key]: e.target.checked })}
                  className="w-3 h-3 accent-[#89b4fa]"
                />
                <span className="text-xs text-[#cdd6f4]">{label}</span>
              </label>
            ))}
          </div>
        </section>
      )}

      {layoutMode === 'auto' && (
        <section>
          <p className="text-xs text-[#585b70]">Auto Layout configuration — Phase 3 extension</p>
        </section>
      )}
    </div>
  )
}
