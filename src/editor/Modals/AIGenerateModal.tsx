// ============================================================
// AI GENERATOR MODAL — Phase 18
// Natural Language to UI Prototyping
// Architecture Rule: Directly synthesizes canonical document model elements
// ============================================================

import React, { useState } from 'react'
import { generateUIFromPrompt, type AIPromptPlan } from '../../engine/aiEngine'
import { useProjectStore } from '../../store/projectStore'
import { useFlowEngine } from '../../engine/flowEngine'

interface AIGenerateModalProps {
  isOpen: boolean
  onClose: () => void
}

const SAMPLE_PROMPTS = [
  '📊 SaaS Analytics Dashboard with KPI metrics, MRR bar chart, and orders table',
  '💳 3-tier Pricing Page with Starter, Pro, and Enterprise feature cards',
  '📱 Modern mobile wallet screen with balance card and action buttons',
  '🤖 AI Copilot studio with conversation stream and agent tool execution',
]

export const AIGenerateModal: React.FC<AIGenerateModalProps> = ({ isOpen, onClose }) => {
  const [prompt, setPrompt] = useState('')
  const [plan, setPlan] = useState<AIPromptPlan | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const project = useProjectStore(s => s.project)
  const addPage = useProjectStore(s => s.addPage)
  const setCurrentPage = useFlowEngine(s => s.setCurrentPage)
  const saveSnapshot = useProjectStore(s => s.saveSnapshot)

  if (!isOpen) return null

  const handleGeneratePlan = () => {
    if (!prompt.trim()) return
    setIsGenerating(true)
    setTimeout(() => {
      const generatedPlan = generateUIFromPrompt(prompt)
      setPlan(generatedPlan)
      setIsGenerating(false)
    }, 400)
  }

  const handleApplyToCanvas = () => {
    if (!plan || !project) return

    // Create new page with generated frame
    const newPageId = addPage(plan.operations.pageName)
    const newPage = project.pages.find(p => p.id === newPageId)
    if (newPage) {
      newPage.frames = [plan.operations.frame]
      setCurrentPage(newPageId)
      saveSnapshot(`AI Generated: ${plan.title}`)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181825] border border-[#313244] rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#313244] bg-[#1e1e2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow">
              ✦
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#cdd6f4]">AI UI Generation Studio</h2>
              <p className="text-[11px] text-[#6c7086]">Generate multi-component layouts using natural language.</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#a6adc8] block mb-1.5">
              Describe the UI or prototype you want to create:
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder="e.g. Generate a responsive SaaS analytics dashboard with 4 KPI cards and a revenue chart..."
                className="w-full bg-[#11111b] border border-[#313244] focus:border-[#89b4fa] rounded-xl p-3 text-xs text-[#cdd6f4] outline-none placeholder-[#585b70] resize-none"
              />
            </div>
          </div>

          {/* Prompt chips */}
          <div>
            <span className="text-[10px] text-[#6c7086] uppercase tracking-wider font-semibold block mb-2">
              Suggestions:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(sample)}
                  className="text-[11px] px-2.5 py-1 bg-[#1e1e2e] hover:bg-[#313244] text-[#a6adc8] hover:text-[#cdd6f4] rounded-lg border border-[#313244] transition-colors text-left"
                >
                  {sample}
                </button>
              ))}
            </div>
          </div>

          {/* Generated Plan Review */}
          {plan && (
            <div className="bg-[#1e1e2e] border border-green-500/30 rounded-xl p-4 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-green-400 flex items-center gap-1.5">
                  <span>✓</span> {plan.title}
                </span>
                <span className="text-[10px] bg-[#313244] text-[#cdd6f4] px-2 py-0.5 rounded font-mono">
                  {plan.operations.frame.children.length} components
                </span>
              </div>
              <p className="text-xs text-[#a6adc8] leading-relaxed">
                {plan.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#1e1e2e] border-t border-[#313244] flex items-center justify-between">
          <span className="text-[11px] text-[#6c7086]">
            Generated layouts will be placed in a new page with 12-col grid.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#a6adc8] hover:text-[#cdd6f4] rounded-lg transition-colors"
            >
              Cancel
            </button>
            {!plan ? (
              <button
                onClick={handleGeneratePlan}
                disabled={!prompt.trim() || isGenerating}
                className="px-4 py-1.5 bg-[#89b4fa] hover:bg-[#b4befe] disabled:opacity-50 text-[#11111b] font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-[#11111b]/30 border-t-[#11111b] rounded-full animate-spin" />
                    <span>Synthesizing...</span>
                  </>
                ) : (
                  <>
                    <span>✦ Generate Layout</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleApplyToCanvas}
                className="px-4 py-1.5 bg-green-500 hover:bg-green-400 text-[#11111b] font-bold rounded-lg text-xs transition-colors flex items-center gap-1.5 shadow"
              >
                <span>Add Page to Canvas →</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
