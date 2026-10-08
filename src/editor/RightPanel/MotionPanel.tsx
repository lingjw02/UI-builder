// ============================================================
// MOTION PANEL — Right Panel Motion Tab
// Configure animation presets, duration, delay, easing
// ============================================================

import React from 'react'
import { useProjectStore } from '../../store/projectStore'
import {
  ANIMATION_PRESETS,
  type MotionConfig,
  type AnimationPreset,
  type AnimationEasing,
} from '../../types'

interface MotionPanelProps {
  pageId: string | null
  frameId: string | null
  selectedComponentIds: string[]
}

const EASING_OPTIONS: { id: AnimationEasing; label: string }[] = [
  { id: 'ease', label: 'Ease (Natural)' },
  { id: 'ease-out', label: 'Ease Out (Decelerate)' },
  { id: 'ease-in', label: 'Ease In (Accelerate)' },
  { id: 'ease-in-out', label: 'Ease In-Out' },
  { id: 'spring', label: 'Spring (Bouncy)' },
  { id: 'linear', label: 'Linear' },
]

export const MotionPanel: React.FC<MotionPanelProps> = ({
  pageId,
  frameId,
  selectedComponentIds,
}) => {
  const project = useProjectStore(s => s.project)
  const updateComponentMotion = useProjectStore(s => s.updateComponentMotion)

  const componentId = selectedComponentIds[0]
  const frame = pageId && frameId
    ? project?.pages.find(p => p.id === pageId)?.frames.find(f => f.id === frameId)
    : undefined
  const component = frame?.children.find(c => c.id === componentId)

  if (!component || !pageId || !frameId) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">Select a component to configure its motion and animations</p>
      </div>
    )
  }

  const motion: MotionConfig = component.motion ?? {
    preset: 'fade-in',
    duration: 300,
    delay: 0,
    easing: 'ease-out',
    repeat: 1,
    direction: 'normal',
  }

  const isEnabled = !!component.motion

  const handleToggle = () => {
    if (isEnabled) {
      updateComponentMotion(pageId, frameId, component.id, undefined)
    } else {
      updateComponentMotion(pageId, frameId, component.id, motion)
    }
  }

  const handleUpdate = (updates: Partial<MotionConfig>) => {
    updateComponentMotion(pageId, frameId, component.id, {
      ...motion,
      ...updates,
    })
  }

  return (
    <div className="p-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
          Motion System
        </h3>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="accent-[#89b4fa]"
          />
          <span className="text-[11px] text-[#cdd6f4]">Enable</span>
        </label>
      </div>

      {!isEnabled ? (
        <div className="bg-[#313244] rounded-lg p-3 text-center">
          <p className="text-xs text-[#585b70] mb-2">No motion applied to this component.</p>
          <button
            onClick={handleToggle}
            className="text-xs px-3 py-1.5 bg-[#89b4fa] text-[#1e1e2e] rounded font-medium hover:bg-[#74c7ec] transition-colors"
          >
            + Add Animation Preset
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Preset selector */}
          <div>
            <label className="text-[10px] text-[#585b70] block mb-1">Preset</label>
            <select
              value={motion.preset}
              onChange={e => handleUpdate({ preset: e.target.value as AnimationPreset })}
              className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
            >
              {ANIMATION_PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="text-[10px] text-[#585b70] mt-1">
              {ANIMATION_PRESETS.find(p => p.id === motion.preset)?.description}
            </p>
          </div>

          {/* Duration & Delay */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Duration (ms)</label>
              <input
                type="number"
                min={0}
                step={50}
                value={motion.duration}
                onChange={e => handleUpdate({ duration: Number(e.target.value) })}
                className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Delay (ms)</label>
              <input
                type="number"
                min={0}
                step={50}
                value={motion.delay}
                onChange={e => handleUpdate({ delay: Number(e.target.value) })}
                className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
              />
            </div>
          </div>

          {/* Easing */}
          <div>
            <label className="text-[10px] text-[#585b70] block mb-1">Easing Curve</label>
            <select
              value={motion.easing}
              onChange={e => handleUpdate({ easing: e.target.value as AnimationEasing })}
              className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
            >
              {EASING_OPTIONS.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Repeat */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Repeat</label>
              <select
                value={String(motion.repeat)}
                onChange={e =>
                  handleUpdate({
                    repeat: e.target.value === 'infinite' ? 'infinite' : Number(e.target.value),
                  })
                }
                className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              >
                <option value="1">Once</option>
                <option value="2">2 times</option>
                <option value="3">3 times</option>
                <option value="infinite">Infinite (Loop)</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Direction</label>
              <select
                value={motion.direction ?? 'normal'}
                onChange={e =>
                  handleUpdate({
                    direction: e.target.value as MotionConfig['direction'],
                  })
                }
                className="w-full bg-[#313244] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              >
                <option value="normal">Normal</option>
                <option value="reverse">Reverse</option>
                <option value="alternate">Alternate</option>
              </select>
            </div>
          </div>

          {/* Preview Trigger button */}
          <button
            onClick={() => {
              // Re-trigger animation by momentarily updating duration or resetting
              handleUpdate({ duration: motion.duration })
            }}
            className="w-full py-1.5 text-xs text-[#89b4fa] border border-[#89b4fa] rounded hover:bg-[#89b4fa]/10 transition-colors"
          >
            ▶ Replay Animation Preview
          </button>
        </div>
      )}
    </div>
  )
}
