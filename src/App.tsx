// ============================================================
// APP ROOT
// ============================================================

import { useEffect } from 'react'
import { Editor } from './editor/Editor'
import { useProjectStore } from './store/projectStore'
import { ensureMotionStylesMounted } from './engine/motionEngine'
import { loadProjectFromLocalStorage, saveProjectToLocalStorage } from './engine/exportEngine'

// Bootstrap: register all built-in components
import './components/registry/builtinComponents'

ensureMotionStylesMounted()

export default function App() {
  const newProject = useProjectStore(s => s.newProject)
  const loadProject = useProjectStore(s => s.loadProject)
  const project = useProjectStore(s => s.project)

  // Auto-load or create project on first mount
  useEffect(() => {
    if (!project) {
      const saved = loadProjectFromLocalStorage()
      if (saved) {
        loadProject(saved)
      } else {
        newProject('My First Prototype')
      }
    }
  }, [project, newProject, loadProject])

  // Autosave to localStorage on project change
  useEffect(() => {
    if (project) {
      saveProjectToLocalStorage(project)
    }
  }, [project])

  if (!project) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#1e1e2e]">
        <div className="text-[#cdd6f4] text-sm">Loading Proto IDE...</div>
      </div>
    )
  }

  return <Editor />
}
