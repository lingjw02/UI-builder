// ============================================================
// FLOW EDITOR — Phase 11
// Visual page flow graph — shown in "Flow" editor mode
//
// Renders pages as nodes and flow connections as arrows.
// Users can drag pages, click to select, and draw connections.
//
// NOTE: This is a custom lightweight graph renderer.
// React Flow / xyflow could be adopted in a future phase
// for more advanced flow editing (Phase 11 extension).
// ============================================================

import React, { useRef, useState } from 'react'
import { useProjectStore } from '../../store/projectStore'
import { useEditorStore } from '../../store/editorStore'
import { useFlowEngine } from '../../engine/flowEngine'
import type { Page } from '../../types'
import { cn } from '../../lib/utils'

// ─────────────────────────────────────────
// Node position (stored locally, not in document model yet)
// TODO Phase 11+: persist node positions in project settings
// ─────────────────────────────────────────

const NODE_WIDTH = 180
const NODE_HEIGHT = 100
const NODE_PADDING = 60

interface NodePosition {
  x: number
  y: number
}

function getDefaultPosition(index: number): NodePosition {
  const cols = 3
  const col = index % cols
  const row = Math.floor(index / cols)
  return {
    x: NODE_PADDING + col * (NODE_WIDTH + 80),
    y: NODE_PADDING + row * (NODE_HEIGHT + 80),
  }
}

// ─────────────────────────────────────────
// Flow Connection Arrow
// ─────────────────────────────────────────

interface ArrowProps {
  fromX: number
  fromY: number
  toX: number
  toY: number
  label?: string
  selected?: boolean
  onClick?: () => void
}

const FlowArrow: React.FC<ArrowProps> = ({ fromX, fromY, toX, toY, label, selected, onClick }) => {
  const midX = (fromX + toX) / 2
  const midY = (fromY + toY) / 2
  const dx = toX - fromX
  const dy = toY - fromY

  // Arrow head
  const arrowSize = 8
  const angle = Math.atan2(dy, dx)
  const ax1 = toX - arrowSize * Math.cos(angle - Math.PI / 6)
  const ay1 = toY - arrowSize * Math.sin(angle - Math.PI / 6)
  const ax2 = toX - arrowSize * Math.cos(angle + Math.PI / 6)
  const ay2 = toY - arrowSize * Math.sin(angle + Math.PI / 6)

  return (
    <g onClick={onClick} className="pointer-events-auto cursor-pointer">
      {/* Click area */}
      <line
        x1={fromX} y1={fromY} x2={toX} y2={toY}
        stroke="transparent"
        strokeWidth={12}
      />
      {/* Line */}
      <line
        x1={fromX} y1={fromY} x2={toX} y2={toY}
        stroke={selected ? '#89b4fa' : '#585b70'}
        strokeWidth={selected ? 2 : 1.5}
        strokeDasharray={selected ? 'none' : '6,3'}
      />
      {/* Arrow head */}
      <polygon
        points={`${toX},${toY} ${ax1},${ay1} ${ax2},${ay2}`}
        fill={selected ? '#89b4fa' : '#585b70'}
      />
      {/* Label */}
      {label && (
        <text
          x={midX} y={midY - 8}
          textAnchor="middle"
          fontSize={10}
          fill={selected ? '#89b4fa' : '#585b70'}
        >
          {label}
        </text>
      )}
    </g>
  )
}

// ─────────────────────────────────────────
// Page Node
// ─────────────────────────────────────────

interface PageNodeProps {
  page: Page
  position: NodePosition
  isSelected: boolean
  isCurrent: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  onStartConnection: () => void
}

const PageNode: React.FC<PageNodeProps> = ({
  page, position, isSelected, isCurrent, onSelect, onDragEnd, onStartConnection
}) => {
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation()
    dragStart.current = { x: e.clientX, y: e.clientY, px: position.x, py: position.y }
    onSelect()

    const handleMouseMove = (me: MouseEvent) => {
      if (!dragStart.current) return
      const dx = me.clientX - dragStart.current.x
      const dy = me.clientY - dragStart.current.y
      onDragEnd(dragStart.current.px + dx, dragStart.current.py + dy)
    }
    const handleMouseUp = () => {
      dragStart.current = null
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div
      className={cn(
        'absolute rounded-lg border-2 cursor-pointer transition-shadow select-none',
        isSelected
          ? 'border-[#89b4fa] shadow-[0_0_0_3px_rgba(137,180,250,0.2)]'
          : isCurrent
          ? 'border-[#a6e3a1] shadow-[0_0_0_3px_rgba(166,227,161,0.2)]'
          : 'border-[#45475a] hover:border-[#585b70]'
      )}
      style={{
        left: position.x,
        top: position.y,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        background: '#181825',
      }}
      onClick={e => {
        e.stopPropagation()
        onSelect()
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Page thumbnail area */}
      <div className="h-14 bg-[#313244] rounded-t-md flex items-center justify-center">
        <div className="w-20 h-10 bg-white rounded-sm opacity-80 flex items-center justify-center">
          <div className="space-y-1 w-14">
            <div className="h-1 bg-gray-300 rounded" />
            <div className="h-1 bg-gray-200 rounded w-3/4" />
            <div className="h-1 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>

      {/* Page name */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        <span className="text-xs text-[#cdd6f4] truncate flex-1">{page.name}</span>
        {isCurrent && (
          <span className="text-[9px] text-[#a6e3a1] font-medium ml-1">START</span>
        )}
      </div>

      {/* Connection handle */}
      <button
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-[#89b4fa] border-2 border-[#1e1e2e] hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
        onMouseDown={e => { e.stopPropagation(); onStartConnection() }}
        title="Draw connection"
      />
    </div>
  )
}

// ─────────────────────────────────────────
// Flow Editor
// ─────────────────────────────────────────

export const FlowEditor: React.FC = () => {
  const project = useProjectStore(s => s.project)
  const addFlowConnection = useProjectStore(s => s.addFlowConnection)
  const removeFlowConnection = useProjectStore(s => s.removeFlowConnection)
  const [nodePositions, setNodePositions] = useState<Record<string, NodePosition>>({})
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null)
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null)
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null)
  const currentPageId = useFlowEngine(s => s.currentPageId)
  const resetNavigation = useFlowEngine(s => s.resetNavigation)
  const setMode = useEditorStore(s => s.setMode)
  const setActivePage = useEditorStore(s => s.setActivePage)
  const setActiveFrame = useEditorStore(s => s.setActiveFrame)

  const pages = project?.pages ?? []
  const connections = project?.flow.connections ?? []

  const getPosition = (pageId: string, index: number): NodePosition => {
    return nodePositions[pageId] ?? getDefaultPosition(index)
  }

  const getNodeAnchor = (pageId: string, index: number, side: 'left' | 'right'): { x: number; y: number } => {
    const pos = getPosition(pageId, index)
    return {
      x: side === 'right' ? pos.x + NODE_WIDTH : pos.x,
      y: pos.y + NODE_HEIGHT / 2,
    }
  }

  const handleNodePosition = (pageId: string, x: number, y: number) => {
    setNodePositions(prev => ({ ...prev, [pageId]: { x, y } }))
  }

  const handleStartConnection = (pageId: string) => {
    setConnectingFrom(pageId)
  }

  const handleNodeClick = (page: Page) => {
    if (connectingFrom && connectingFrom !== page.id) {
      addFlowConnection(connectingFrom, page.id)
      setConnectingFrom(null)
    } else {
      setSelectedPageId(page.id)
      setConnectingFrom(null)
    }
  }

  const handleStartPreview = (startPageId: string) => {
    resetNavigation(startPageId)
    setActivePage(startPageId)
    const page = pages.find(p => p.id === startPageId)
    if (page?.frames[0]) setActiveFrame(page.frames[0].id)
    setMode('preview')
  }

  return (
    <div className="flex-1 relative overflow-hidden bg-[#1e1e2e]">
      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, #313244 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Toolbar */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="bg-[#181825] border border-[#45475a] rounded-lg px-3 py-1.5 flex items-center gap-2">
          <span className="text-xs text-[#585b70]">
            {pages.length} page{pages.length !== 1 ? 's' : ''} · {connections.length} connection{connections.length !== 1 ? 's' : ''}
          </span>
          {connectingFrom && (
            <span className="text-xs text-[#89b4fa]">
              Drawing connection from "{pages.find(p => p.id === connectingFrom)?.name}"... click target page
            </span>
          )}
        </div>

        {connectingFrom && (
          <button
            onClick={() => setConnectingFrom(null)}
            className="bg-[#313244] border border-[#45475a] rounded px-2 py-1 text-xs text-[#585b70] hover:text-[#cdd6f4]"
          >
            Cancel
          </button>
        )}
      </div>

      {/* SVG arrows layer */}
      <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#585b70" />
          </marker>
        </defs>
        {connections.map((conn) => {
          const fromIdx = pages.findIndex(p => p.id === conn.fromPageId)
          const toIdx = pages.findIndex(p => p.id === conn.toPageId)
          if (fromIdx === -1 || toIdx === -1) return null
          const from = getNodeAnchor(conn.fromPageId, fromIdx, 'right')
          const to = getNodeAnchor(conn.toPageId, toIdx, 'left')
          return (
            <FlowArrow
              key={conn.id}
              fromX={from.x} fromY={from.y}
              toX={to.x} toY={to.y}
              label={conn.label}
              selected={selectedConnectionId === conn.id}
              onClick={() => setSelectedConnectionId(
                selectedConnectionId === conn.id ? null : conn.id
              )}
            />
          )
        })}
      </svg>

      {/* Page nodes */}
      <div
        className="absolute inset-0"
        onClick={() => { setSelectedPageId(null); setConnectingFrom(null) }}
      >
        {pages.map((page, index) => (
          <div key={page.id} className="group">
            <PageNode
              page={page}
              position={getPosition(page.id, index)}
              isSelected={selectedPageId === page.id}
              isCurrent={currentPageId === page.id || (!currentPageId && index === 0)}
              onSelect={() => handleNodeClick(page)}
              onDragEnd={(x, y) => handleNodePosition(page.id, x, y)}
              onStartConnection={() => handleStartConnection(page.id)}
            />
          </div>
        ))}
      </div>

      {/* Selected page actions */}
      {selectedPageId && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#181825] border border-[#45475a] rounded-lg px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-[#cdd6f4]">
            {pages.find(p => p.id === selectedPageId)?.name}
          </span>
          <div className="w-px h-4 bg-[#45475a]" />
          <button
            onClick={() => {
              setActivePage(selectedPageId)
              const page = pages.find(p => p.id === selectedPageId)
              if (page?.frames[0]) setActiveFrame(page.frames[0].id)
              setMode('design')
            }}
            className="text-xs text-[#89b4fa] hover:underline"
          >
            Edit Page
          </button>
          <button
            onClick={() => handleStartPreview(selectedPageId)}
            className="text-xs text-[#a6e3a1] hover:underline"
          >
            ▶ Preview from here
          </button>
          <button
            onClick={() => handleStartConnection(selectedPageId)}
            className="text-xs text-[#585b70] hover:text-[#cdd6f4]"
          >
            + Connect
          </button>
        </div>
      )}

      {/* Selected connection actions */}
      {selectedConnectionId && !selectedPageId && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#181825] border border-[#45475a] rounded-lg px-4 py-2 flex items-center gap-3">
          <span className="text-xs text-[#89b4fa]">Connection selected</span>
          <div className="w-px h-4 bg-[#45475a]" />
          <button
            onClick={() => {
              removeFlowConnection(selectedConnectionId)
              setSelectedConnectionId(null)
            }}
            className="text-xs text-red-400 hover:underline"
          >
            Delete Connection
          </button>
          <button
            onClick={() => setSelectedConnectionId(null)}
            className="text-xs text-[#585b70] hover:text-[#cdd6f4]"
          >
            Deselect
          </button>
        </div>
      )}

      {/* Empty state */}
      {pages.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-[#45475a]">
            <div className="text-4xl mb-2">🔀</div>
            <p className="text-sm">No pages yet. Add pages in Design mode.</p>
          </div>
        </div>
      )}
    </div>
  )
}
