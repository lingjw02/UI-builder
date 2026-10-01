// ============================================================
// EDITOR — Main editor layout shell
// Phase 1 + 11 + 12: Design / Flow / Preview mode routing
// ============================================================

import React, { useEffect } from 'react'
import { Toolbar } from './Toolbar/Toolbar'
import { LeftPanel } from './LeftPanel/LeftPanel'
import { Canvas } from './Canvas/Canvas'
import { RightPanel } from './RightPanel/RightPanel'
import { StatusBar } from './StatusBar/StatusBar'
import { ContextMenu } from './ContextMenu/ContextMenu'
import { FlowEditor } from './FlowEditor/FlowEditor'
import { PrototypeRuntime } from './Preview/PrototypeRuntime'
import { useEditorStore } from '../store/editorStore'
import { useProjectStore } from '../store/projectStore'
import { useFlowEngine } from '../engine/flowEngine'

export const Editor: React.FC = () => {
  const panels = useEditorStore(s => s.panels)
  const mode = useEditorStore(s => s.mode)
  const activePageId = useEditorStore(s => s.activePageId)
  const setActivePage = useEditorStore(s => s.setActivePage)
  const setActiveFrame = useEditorStore(s => s.setActiveFrame)
  const undo = useProjectStore(s => s.undo)
  const redo = useProjectStore(s => s.redo)
  const project = useProjectStore(s => s.project)
  const selection = useEditorStore(s => s.selection)
  const deleteComponent = useProjectStore(s => s.deleteComponent)
  const duplicateComponent = useProjectStore(s => s.duplicateComponent)

  const resetNavigation = useFlowEngine(s => s.resetNavigation)

  // Auto-select first page on load
  useEffect(() => {
    if (project && !activePageId && project.pages.length > 0) {
      const page = project.pages[0]
      setActivePage(page.id)
      if (page.frames.length > 0) {
        setActiveFrame(page.frames[0].id)
      }
    }
  }, [project, activePageId, setActivePage, setActiveFrame])

  // Initialize flow engine when entering preview mode
  useEffect(() => {
    if (mode === 'preview' && project?.pages.length) {
      const startPage = project.pages.find(p => p.id === activePageId) ?? project.pages[0]
      resetNavigation(startPage.id)
    }
  }, [mode])

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey
      const isTyping =
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      // Undo/Redo
      if (!isTyping && ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo() }
      if (!isTyping && ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo() }

      // Delete selected component
      if (!isTyping && (e.key === 'Delete' || e.key === 'Backspace') && selection.componentIds.length > 0) {
        e.preventDefault()
        const { pageId, frameId, componentIds } = selection
        if (pageId && frameId) {
          componentIds.forEach(id => deleteComponent(pageId, frameId, id))
        }
      }

      // Duplicate Ctrl+D
      if (!isTyping && ctrl && e.key === 'd' && selection.componentIds.length > 0) {
        e.preventDefault()
        const { pageId, frameId, componentIds } = selection
        if (pageId && frameId && componentIds.length === 1) {
          duplicateComponent(pageId, frameId, componentIds[0])
        }
      }

      // Mode shortcuts
      if (!isTyping && e.key === 'F1') { e.preventDefault(); useEditorStore.getState().setMode('design') }
      if (!isTyping && e.key === 'F2') { e.preventDefault(); useEditorStore.getState().setMode('flow') }
      if (!isTyping && e.key === 'F3') { e.preventDefault(); useEditorStore.getState().setMode('preview') }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, selection, deleteComponent, duplicateComponent])

  const isPreview = mode === 'preview'
  const isFlow = mode === 'flow'
  const isDesign = mode === 'design'

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Toolbar — always visible */}
      {panels.toolbar && <Toolbar />}

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel — design and flow modes */}
        {panels.leftPanel && !isPreview && <LeftPanel />}

        {/* Main content area — switches by mode */}
        {isDesign && <Canvas />}
        {isFlow && <FlowEditor />}
        {isPreview && <PrototypeRuntime />}

        {/* Right Panel — design mode only */}
        {panels.rightPanel && isDesign && <RightPanel />}
      </div>

      {/* Status bar */}
      {panels.statusBar && !isPreview && <StatusBar />}

      {/* Context Menu — design mode only */}
      {isDesign && <ContextMenu />}
    </div>
  )
}
