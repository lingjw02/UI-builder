// ============================================================
// TEMPLATES PANEL — Left Panel Tab
// Phase 17: Prototype Templates
// ============================================================

import React from 'react'
import { TEMPLATES_METADATA, loadTemplateProject } from '../../engine/templateEngine'
import { useProjectStore } from '../../store/projectStore'
import { useFlowEngine } from '../../engine/flowEngine'

export const TemplatesPanel: React.FC = () => {
  const loadProject = useProjectStore(s => s.loadProject)
  const setCurrentPage = useFlowEngine(s => s.setCurrentPage)

  const handleApplyTemplate = (templateId: string, templateName: string) => {
    if (window.confirm(`Load "${templateName}" template? This will load the complete multi-page prototype with frames, grids, and components.`)) {
      const project = loadTemplateProject(templateId)
      loadProject(project)
      if (project.pages[0]) {
        setCurrentPage(project.pages[0].id)
      }
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      <div className="mb-2">
        <h3 className="text-xs font-semibold text-[#cdd6f4]">Starter Templates</h3>
        <p className="text-[11px] text-[#6c7086]">Production-grade prototype architectures composed of native document components.</p>
      </div>

      <div className="space-y-3">
        {TEMPLATES_METADATA.map(template => (
          <div
            key={template.id}
            className="group bg-[#1e1e2e] border border-[#313244] hover:border-[#89b4fa] rounded-xl p-3 transition-all cursor-pointer shadow-sm hover:shadow-md"
            onClick={() => handleApplyTemplate(template.id, template.name)}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xl p-1 bg-[#313244] rounded-lg">{template.icon}</span>
                <span className="text-xs font-semibold text-[#cdd6f4] group-hover:text-[#89b4fa] transition-colors">
                  {template.name}
                </span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#89b4fa]/20 text-[#89b4fa] font-medium">
                {template.badge}
              </span>
            </div>

            <p className="text-[11px] text-[#a6adc8] mb-3 leading-relaxed">
              {template.description}
            </p>

            <button
              className="w-full py-1.5 px-3 bg-[#313244] group-hover:bg-[#89b4fa] text-[#cdd6f4] group-hover:text-[#11111b] font-medium rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Load Template</span>
              <span>→</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
