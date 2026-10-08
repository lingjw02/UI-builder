// ============================================================
// STATES PANEL
// Right Panel "States" tab: view and switch component states in design mode
// ============================================================

import React from 'react'
import { useStateEngine } from '../../engine/stateEngine'
import { cn } from '../../lib/utils'
import type { Frame } from '../../types'

interface StatesPanelProps {
  frameId: string | null
  frame?: Frame
  selectedComponentIds: string[]
}

export const StatesPanel: React.FC<StatesPanelProps> = ({
  frameId,
  frame,
  selectedComponentIds,
}) => {
  const getActiveState = useStateEngine(s => s.getActiveState)
  const setDesignState = useStateEngine(s => s.setDesignState)
  const getAvailableStates = useStateEngine(s => s.getAvailableStates)
  const resetState = useStateEngine(s => s.resetState)

  const componentId = selectedComponentIds[0]
  const component = frame?.children.find(c => c.id === componentId)

  if (!component || !frameId) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">Select a component to view its states</p>
      </div>
    )
  }

  const availableStates = getAvailableStates(component.componentType)
  const activeStateName = getActiveState(frameId, componentId)

  if (availableStates.length === 0) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">This component has no defined states</p>
      </div>
    )
  }

  return (
    <div className="p-3 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
          States
        </h3>
        {activeStateName !== 'default' && (
          <button
            onClick={() => resetState(frameId, componentId)}
            className="text-[10px] text-[#585b70] hover:text-[#89b4fa] transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      <p className="text-[10px] text-[#585b70]">
        Preview a state to see how this component looks in each condition.
      </p>

      <div className="space-y-1">
        {availableStates.map(state => {
          const isActive = activeStateName === state.name

          return (
            <button
              key={state.name}
              onClick={() => {
                if (isActive) {
                  resetState(frameId, componentId)
                } else {
                  setDesignState(frameId, componentId, state.name)
                }
              }}
              className={cn(
                'w-full flex items-center justify-between px-3 py-2 rounded text-xs text-left transition-colors',
                isActive
                  ? 'bg-[#89b4fa]/20 text-[#89b4fa]'
                  : 'text-[#cdd6f4] hover:bg-[#313244]'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  isActive ? 'bg-[#89b4fa]' : 'bg-[#45475a]'
                )} />
                <span>{state.label}</span>
              </div>
              {isActive && (
                <span className="text-[10px] text-[#89b4fa] opacity-70">active</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="pt-2 border-t border-[#45475a]">
        <p className="text-[10px] text-[#45475a]">
          States affect visual appearance only in design mode.
          In preview mode, states are driven by interactions.
        </p>
      </div>
    </div>
  )
}
