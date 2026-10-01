// ============================================================
// EXPORT MODAL — Phase 19
// Code Generation & JSON Project Persistence
// ============================================================

import React, { useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useFlowEngine } from '../../engine/flowEngine'
import {
  exportProjectToJSON,
  importProjectFromJSON,
  downloadProjectFile,
  generateReactCode,
} from '../../engine/exportEngine'
import { cn } from '../../lib/utils'

interface ExportModalProps {
  isOpen: boolean
  onClose: () => void
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const project = useProjectStore(s => s.project)
  const loadProject = useProjectStore(s => s.loadProject)
  const currentPageId = useFlowEngine(s => s.currentPageId)

  const [activeTab, setActiveTab] = useState<'code' | 'json'>('code')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !project) return null

  const activePage = project.pages.find(p => p.id === currentPageId) ?? project.pages[0]
  const activeFrame = activePage?.frames[0]

  const reactCode = activeFrame
    ? generateReactCode(activeFrame, `${activePage.name.replace(/[^a-zA-Z0-9]/g, '') || 'Page'}View`)
    : '// No active frame found to export'

  const projectJson = exportProjectToJSON(project)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownloadCode = () => {
    if (!activeFrame) return
    const blob = new Blob([reactCode], { type: 'text/typescript' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${activeFrame.name.replace(/[^a-zA-Z0-9]/g, '') || 'Component'}.tsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string
        const imported = importProjectFromJSON(content)
        loadProject(imported)
        alert(`Successfully imported "${imported.settings.name}"!`)
        onClose()
      } catch (err) {
        alert(`Failed to import file: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#181825] border border-[#313244] rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#313244] bg-[#1e1e2e]">
          <div className="flex items-center gap-3">
            <span className="text-xl">🚀</span>
            <div>
              <h2 className="text-sm font-bold text-[#cdd6f4]">Export & Code Generator</h2>
              <p className="text-[11px] text-[#6c7086]">Generate production React + Tailwind code or backup project JSON.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex bg-[#313244] rounded-lg p-0.5 text-xs">
              <button
                onClick={() => setActiveTab('code')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors',
                  activeTab === 'code' ? 'bg-[#89b4fa] text-[#11111b]' : 'text-[#a6adc8] hover:text-[#cdd6f4]'
                )}
              >
                ⚛️ React Code
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={cn(
                  'px-3 py-1 rounded-md font-medium transition-colors',
                  activeTab === 'json' ? 'bg-[#89b4fa] text-[#11111b]' : 'text-[#a6adc8] hover:text-[#cdd6f4]'
                )}
              >
                💾 Project JSON
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors ml-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5 overflow-y-auto">
          {activeTab === 'code' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#a6adc8]">
                <span>
                  Frame: <strong className="text-[#cdd6f4]">{activeFrame?.name ?? 'None'}</strong> ({activeFrame?.width}×{activeFrame?.height})
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(reactCode)}
                    className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] rounded-lg transition-colors font-medium flex items-center gap-1.5"
                  >
                    <span>{copied ? '✓ Copied!' : '📋 Copy Code'}</span>
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="px-3 py-1.5 bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-medium rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>⬇ Download .tsx</span>
                  </button>
                </div>
              </div>

              <pre className="bg-[#11111b] border border-[#313244] rounded-xl p-4 text-xs font-mono text-[#cdd6f4] overflow-x-auto max-h-[400px]">
                {reactCode}
              </pre>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-[#a6adc8]">
                  Download your entire project document model as JSON or import an existing file.
                </div>
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4] rounded-lg transition-colors font-medium cursor-pointer text-xs flex items-center gap-1.5">
                    <span>📂 Upload .proto.json</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    onClick={() => downloadProjectFile(project)}
                    className="px-3 py-1.5 bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-medium rounded-lg transition-colors text-xs flex items-center gap-1.5"
                  >
                    <span>💾 Download Project JSON</span>
                  </button>
                </div>
              </div>

              <pre className="bg-[#11111b] border border-[#313244] rounded-xl p-4 text-xs font-mono text-[#a6adc8] overflow-x-auto max-h-[400px]">
                {projectJson}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
