// ============================================================
// INTERACTION PANEL — Phase 10
// Right Panel "Interact" tab: view/add/edit/delete interactions
// ============================================================

import React, { useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useMockApiStore } from '../../store/mockApiStore'
import {
  TRIGGER_LABELS,
  ACTION_LABELS,
  createInteraction,
} from '../../engine/interactionEngine'
import { ANIMATION_PRESETS, type TriggerType, type ActionType } from '../../types'

interface InteractionPanelProps {
  pageId: string | null
  frameId: string | null
  selectedComponentIds: string[]
}

const TRIGGERS = Object.entries(TRIGGER_LABELS) as [TriggerType, string][]
const ACTIONS = Object.entries(ACTION_LABELS) as [ActionType, string][]

export const InteractionPanel: React.FC<InteractionPanelProps> = ({
  pageId,
  frameId,
  selectedComponentIds,
}) => {
  const [adding, setAdding] = useState(false)
  const [newTrigger, setNewTrigger] = useState<TriggerType>('click')
  const [newAction, setNewAction] = useState<ActionType>('navigate')
  const [newTarget, setNewTarget] = useState('')

  const project = useProjectStore(s => s.project)
  const addInteraction = useProjectStore(s => s.addInteraction)
  const deleteInteraction = useProjectStore(s => s.deleteInteraction)

  const componentId = selectedComponentIds[0]
  const frame = pageId && frameId
    ? project?.pages.find(p => p.id === pageId)?.frames.find(f => f.id === frameId)
    : undefined
  const component = frame?.children.find(c => c.id === componentId)

  const pages = project?.pages ?? []
  const endpoints = useMockApiStore(s => s.endpoints)

  if (!component) {
    return (
      <div className="p-3">
        <p className="text-[#585b70] text-xs">Select a component to manage its interactions</p>
      </div>
    )
  }

  const interactions = component.interactions ?? []

  const handleAddInteraction = () => {
    if (!pageId || !frameId || !componentId) return

    const interaction = createInteraction(newTrigger, newAction, newTarget || undefined)
    addInteraction(pageId, frameId, componentId, interaction)

    setAdding(false)
    setNewTarget('')
  }

  const handleDeleteInteraction = (interactionId: string) => {
    if (!pageId || !frameId || !componentId) return
    deleteInteraction(pageId, frameId, componentId, interactionId)
  }

  return (
    <div className="p-3 space-y-3">
      <h3 className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
        Interactions
      </h3>

      {/* Existing interactions */}
      {interactions.length === 0 ? (
        <p className="text-[#585b70] text-xs">No interactions yet</p>
      ) : (
        <div className="space-y-2">
          {interactions.map(interaction => (
            <div
              key={interaction.id}
              className="bg-[#313244] rounded p-2 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#89b4fa] font-medium">
                  {TRIGGER_LABELS[interaction.trigger]}
                </span>
                <button
                  onClick={() => handleDeleteInteraction(interaction.id)}
                  className="text-[#585b70] hover:text-red-400 text-[10px]"
                >
                  ✕
                </button>
              </div>
              <div className="text-[11px] text-[#cdd6f4]">
                {ACTION_LABELS[interaction.action]}
                {interaction.target && (
                  <span className="text-[#585b70] ml-1">
                    → {pages.find(p => p.id === interaction.target)?.name ?? interaction.target}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add interaction form */}
      {adding ? (
        <div className="bg-[#313244] rounded p-3 space-y-2">
          <p className="text-[10px] text-[#89b4fa] font-medium">New Interaction</p>

          <div>
            <label className="text-[10px] text-[#585b70] block mb-1">Trigger</label>
            <select
              value={newTrigger}
              onChange={e => setNewTrigger(e.target.value as TriggerType)}
              className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
            >
              {TRIGGERS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] text-[#585b70] block mb-1">Action</label>
            <select
              value={newAction}
              onChange={e => setNewAction(e.target.value as ActionType)}
              className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
            >
              {ACTIONS.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          {newAction === 'navigate' && (
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Target Page</label>
              <select
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              >
                <option value="">Select page...</option>
                {pages.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {(newAction === 'open-overlay' || newAction === 'close-overlay' || newAction === 'toggle') && (
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Target Component ID</label>
              <input
                type="text"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                placeholder="Component ID..."
                className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              />
            </div>
          )}

          {newAction === 'external-url' && (
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">URL</label>
              <input
                type="text"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              />
            </div>
          )}

          {newAction === 'run-action' && (
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Mock API Endpoint</label>
              <select
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              >
                <option value="">Select endpoint...</option>
                {endpoints.map(ep => (
                  <option key={ep.id} value={ep.id}>
                    {ep.method} {ep.url} ({ep.name})
                  </option>
                ))}
              </select>
            </div>
          )}

          {newAction === 'play-animation' && (
            <div>
              <label className="text-[10px] text-[#585b70] block mb-1">Animation Preset</label>
              <select
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
                className="w-full bg-[#45475a] text-[#cdd6f4] text-xs rounded px-2 py-1.5 outline-none border border-transparent focus:border-[#89b4fa]"
              >
                <option value="">Select animation...</option>
                {ANIMATION_PRESETS.map(anim => (
                  <option key={anim.id} value={anim.id}>
                    {anim.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-2 pt-1">
            <button
              onClick={handleAddInteraction}
              className="flex-1 py-1.5 text-xs bg-[#89b4fa] text-[#1e1e2e] rounded font-medium hover:bg-[#74c7ec] transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => setAdding(false)}
              className="flex-1 py-1.5 text-xs text-[#585b70] hover:text-[#cdd6f4] border border-[#45475a] rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full py-1.5 text-xs text-[#89b4fa] border border-[#89b4fa] border-dashed rounded hover:bg-[#89b4fa]/10 transition-colors"
        >
          + Add Interaction
        </button>
      )}
    </div>
  )
}
