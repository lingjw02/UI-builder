// ============================================================
// EXPORT & PERSISTENCE ENGINE
// Manages:
//   1. JSON project import / export / localStorage auto-save
//   2. Clean, production-ready React + Tailwind CSS code generation
// ============================================================

import type { Project, Frame, ComponentInstance } from '../types'

const LOCAL_STORAGE_KEY = 'proto_ide_project_v1'

// ─────────────────────────────────────────
// Persistence (JSON & LocalStorage)
// ─────────────────────────────────────────

export function exportProjectToJSON(project: Project): string {
  return JSON.stringify(project, null, 2)
}

export function importProjectFromJSON(jsonString: string): Project {
  const parsed = JSON.parse(jsonString)
  if (!parsed || !Array.isArray(parsed.pages)) {
    throw new Error('Invalid project file: missing pages array')
  }
  return parsed as Project
}

export function saveProjectToLocalStorage(project: Project): void {
  try {
    const json = JSON.stringify(project)
    localStorage.setItem(LOCAL_STORAGE_KEY, json)
  } catch (err) {
    console.error('Failed to save project to localStorage', err)
  }
}

export function loadProjectFromLocalStorage(): Project | null {
  try {
    const json = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!json) return null
    return importProjectFromJSON(json)
  } catch (err) {
    console.error('Failed to load project from localStorage', err)
    return null
  }
}

export function downloadProjectFile(project: Project, filename?: string): void {
  const json = exportProjectToJSON(project)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename || `${project.settings.name.toLowerCase().replace(/\s+/g, '-')}.proto.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─────────────────────────────────────────
// React + Tailwind CSS Code Generator
// ─────────────────────────────────────────

function sanitizeJsxText(text: string): string {
  return text.replace(/{/g, '{"{"}').replace(/}/g, '{"}"}')
}

function componentToReactJsx(comp: ComponentInstance, indent = '      '): string {
  const p = comp.props
  const type = comp.componentType

  // Grid styling for component placement
  let layoutClass = ''
  if (comp.layout.mode === 'grid' && comp.layout.grid) {
    const g = comp.layout.grid
    layoutClass = `col-start-${g.gridColumn} col-span-${g.columnSpan} row-start-${g.gridRow} row-span-${g.rowSpan}`
  }

  switch (type) {
    case 'button': {
      const variantClass = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white',
        secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-200',
        destructive: 'bg-red-600 hover:bg-red-700 text-white',
        outline: 'border border-blue-500 text-blue-400 bg-transparent hover:bg-blue-500/10',
      }[String(p.variant ?? 'primary')] ?? 'bg-blue-600 text-white'

      return `${indent}<button className="${layoutClass} px-4 py-2 rounded-lg font-medium text-sm transition-colors ${variantClass}">\n${indent}  ${sanitizeJsxText(String(p.label ?? 'Button'))}\n${indent}</button>`
    }

    case 'text': {
      const sizeClass = Number(p.fontSize) > 20 ? 'text-2xl font-bold' : Number(p.fontSize) > 16 ? 'text-lg font-semibold' : 'text-sm'
      return `${indent}<p className="${layoutClass} ${sizeClass} text-slate-100">\n${indent}  ${sanitizeJsxText(String(p.content ?? 'Text'))}\n${indent}</p>`
    }

    case 'input': {
      return `${indent}<div className="${layoutClass} flex flex-col gap-1.5">\n` +
        (p.label ? `${indent}  <label className="text-xs font-medium text-slate-400">${sanitizeJsxText(String(p.label))}</label>\n` : '') +
        `${indent}  <input type="${p.type ?? 'text'}" placeholder="${p.placeholder ?? 'Enter text...'}" className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500" />\n` +
        `${indent}</div>`
    }

    case 'stat-card': {
      const isUp = String(p.trend ?? 'up') === 'up'
      return `${indent}<div className="${layoutClass} bg-slate-850 border border-slate-800 rounded-xl p-4 flex flex-col justify-between shadow-sm">\n` +
        `${indent}  <div className="flex items-center justify-between text-xs text-slate-400 font-medium">\n` +
        `${indent}    <span>${sanitizeJsxText(String(p.title ?? 'Metric'))}</span>\n` +
        `${indent}    <span className="text-base">${p.icon ?? '📈'}</span>\n` +
        `${indent}  </div>\n` +
        `${indent}  <div className="text-2xl font-bold text-slate-100 my-2">${sanitizeJsxText(String(p.value ?? '$0'))}</div>\n` +
        `${indent}  <div className="flex items-center gap-1.5 text-xs ${isUp ? 'text-emerald-400' : 'text-rose-400'}">\n` +
        `${indent}    <span>${isUp ? '↑' : '↓'} ${p.change ?? '0%'}</span>\n` +
        `${indent}    <span className="text-slate-500 text-[10px]">${sanitizeJsxText(String(p.subtext ?? ''))}</span>\n` +
        `${indent}  </div>\n` +
        `${indent}</div>`
    }

    case 'chart': {
      return `${indent}<div className="${layoutClass} bg-slate-850 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">\n` +
        `${indent}  <div className="flex items-center justify-between mb-3">\n` +
        `${indent}    <span className="text-sm font-semibold text-slate-200">${sanitizeJsxText(String(p.title ?? 'Chart'))}</span>\n` +
        `${indent}    <span className="text-xs bg-slate-800 text-blue-400 px-2 py-0.5 rounded capitalize">${p.chartType ?? 'bar'}</span>\n` +
        `${indent}  </div>\n` +
        `${indent}  <div className="flex-1 min-h-[140px] flex items-end justify-between gap-2 pt-4 border-t border-slate-800">\n` +
        `${indent}    {[40, 70, 55, 90, 65, 85, 95].map((h, i) => (\n` +
        `${indent}      <div key={i} className="flex-1 bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t" style={{ height: \`\${h}%\` }} />\n` +
        `${indent}    ))}\n` +
        `${indent}  </div>\n` +
        `${indent}</div>`
    }

    case 'ai-chat': {
      return `${indent}<div className="${layoutClass} bg-slate-900 border border-slate-800 rounded-xl flex flex-col overflow-hidden">\n` +
        `${indent}  <div className="px-4 py-3 bg-slate-850 border-b border-slate-800 flex items-center justify-between text-xs">\n` +
        `${indent}    <span className="font-semibold text-slate-200">${sanitizeJsxText(String(p.title ?? 'AI Assistant'))}</span>\n` +
        `${indent}    <span className="text-slate-400 bg-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">Model: ${p.model ?? 'Gemini'}</span>\n` +
        `${indent}  </div>\n` +
        `${indent}  <div className="flex-1 p-4 space-y-3 overflow-y-auto text-xs">\n` +
        `${indent}    <div className="bg-slate-800 text-slate-200 p-2.5 rounded-lg rounded-tl-none max-w-[85%]">Hello! How can I assist you with your prototypes today?</div>\n` +
        `${indent}  </div>\n` +
        `${indent}</div>`
    }

    case 'prompt-input': {
      return `${indent}<div className="${layoutClass} bg-slate-900 border border-slate-700 rounded-xl p-2 flex items-center gap-2 shadow-lg">\n` +
        `${indent}  <input type="text" placeholder="${p.placeholder ?? 'Type instructions...'}" className="flex-1 bg-transparent px-3 py-1.5 text-xs text-slate-100 outline-none placeholder-slate-500" />\n` +
        `${indent}  <button className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-lg text-xs transition-colors flex items-center gap-1.5">Send ➤</button>\n` +
        `${indent}</div>`
    }

    case 'card': {
      return `${indent}<div className="${layoutClass} bg-slate-850 border border-slate-800 rounded-xl p-4 flex flex-col shadow-sm">\n` +
        (p.title ? `${indent}  <h3 className="font-semibold text-sm text-slate-100 mb-1">${sanitizeJsxText(String(p.title))}</h3>\n` : '') +
        (p.description ? `${indent}  <p className="text-xs text-slate-400 whitespace-pre-line">${sanitizeJsxText(String(p.description))}</p>\n` : '') +
        `${indent}</div>`
    }

    case 'alert': {
      return `${indent}<div className="${layoutClass} bg-blue-950/40 border border-blue-500/30 rounded-lg p-3 flex items-center justify-between text-xs text-blue-200">\n` +
        `${indent}  <div>\n` +
        `${indent}    <div className="font-semibold text-slate-100">${sanitizeJsxText(String(p.title ?? 'Alert'))}</div>\n` +
        `${indent}    <div className="text-slate-400 text-[11px]">${sanitizeJsxText(String(p.message ?? ''))}</div>\n` +
        `${indent}  </div>\n` +
        `${indent}</div>`
    }

    default:
      return `${indent}<div className="${layoutClass} bg-slate-800 border border-slate-700 rounded-lg p-3 text-xs text-slate-300">\n${indent}  {/* ${type} */}\n${indent}</div>`
  }
}

/**
 * Generates clean React functional component code for a frame
 */
export function generateReactCode(frame: Frame, componentName = 'PrototypeView'): string {
  const isGrid = frame.layoutMode === 'grid' && frame.grid
  const cols = frame.grid?.columns ?? 12
  const rows = frame.grid?.rows ?? 8
  const colGap = frame.grid?.columnGap ?? 16
  const rowGap = frame.grid?.rowGap ?? 16

  const childrenCode = frame.children
    .map(comp => componentToReactJsx(comp, '        '))
    .join('\n\n')

  return `import React from 'react'

export interface ${componentName}Props {
  className?: string
}

export const ${componentName}: React.FC<${componentName}Props> = ({ className = '' }) => {
  return (
    <div
      className={\`w-full min-h-screen bg-[${frame.background}] p-6 text-slate-100 \${className}\`}
    >
      ${isGrid ? `{/* Responsive Grid Layout (${cols} cols × ${rows} rows) */}` : `{/* Layout Container */}`}
      <div
        className="w-full max-w-[${frame.width}px] mx-auto min-h-[${frame.height}px] ${
          isGrid
            ? `grid grid-cols-${cols} grid-rows-${rows} gap-x-[${colGap}px] gap-y-[${rowGap}px]`
            : 'relative'
        }"
      >
${childrenCode}
      </div>
    </div>
  )
}

export default ${componentName}
`
}
