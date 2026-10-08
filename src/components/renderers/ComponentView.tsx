// ============================================================
// COMPONENT VIEW — Unified Component Visual Renderer
// Shared between Design Canvas and Prototype Runtime
// ============================================================

import React from 'react'
import { cn } from '../../lib/utils'

export interface ComponentViewProps {
  type: string
  props: Record<string, unknown>
  activeState?: string
  isInteractive?: boolean
  onAction?: (actionName: string, payload?: unknown) => void
}

export const ComponentView: React.FC<ComponentViewProps> = ({
  type,
  props,
  activeState = 'default',
  isInteractive = false,
  onAction,
}) => {
  switch (type) {
    // ─── Button ───────────────────────────────────────────────
    case 'button': {
      const isLoading = activeState === 'loading'
      const isDisabled = activeState === 'disabled' || Boolean(props.disabled)
      const isSuccess = activeState === 'success'

      const variant = String(props.variant ?? 'primary')
      const variantClasses: Record<string, string> = {
        primary: 'bg-blue-500 hover:bg-blue-600 text-white',
        secondary: 'bg-[#313244] hover:bg-[#45475a] text-[#cdd6f4]',
        destructive: 'bg-red-500 hover:bg-red-600 text-white',
        ghost: 'bg-transparent hover:bg-blue-500/10 text-blue-400',
        outline: 'border border-blue-500 hover:bg-blue-500/10 text-blue-400 bg-transparent',
      }

      return (
        <button
          className={cn(
            'w-full h-full rounded px-4 font-medium transition-all flex items-center justify-center gap-2 select-none text-sm',
            variantClasses[variant] ?? variantClasses.primary,
            isDisabled && 'opacity-50 cursor-not-allowed',
            isSuccess && '!bg-green-600 text-white',
            !isInteractive && 'pointer-events-none'
          )}
          disabled={isDisabled}
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : isSuccess ? (
            <span>✓ {String(props.label ?? 'Done')}</span>
          ) : (
            <span>{String(props.label ?? 'Button')}</span>
          )}
        </button>
      )
    }

    // ─── Text ─────────────────────────────────────────────────
    case 'text': {
      return (
        <div
          className="w-full h-full flex items-center overflow-hidden"
          style={{
            fontSize: `${Number(props.fontSize) || 14}px`,
            fontWeight: String(props.fontWeight ?? '400'),
            color: String(props.color ?? '#cdd6f4'),
            textAlign: (props.align as React.CSSProperties['textAlign']) ?? 'left',
          }}
        >
          {String(props.content ?? 'Text')}
        </div>
      )
    }

    // ─── Input ────────────────────────────────────────────────
    case 'input': {
      const isError = activeState === 'error'
      return (
        <div
          className={cn(
            'w-full h-full rounded border bg-[#1e1e2e] flex items-center px-3 text-sm text-[#cdd6f4]',
            isError ? 'border-red-500' : 'border-[#45475a]',
            !isInteractive && 'pointer-events-none'
          )}
        >
          {Boolean(props.label) && (
            <span className="text-[#a6adc8] mr-2 text-xs font-medium whitespace-nowrap">
              {String(props.label)}:
            </span>
          )}
          <input
            type={String(props.type ?? 'text')}
            placeholder={String(props.placeholder ?? 'Enter text...')}
            disabled={!isInteractive || Boolean(props.disabled)}
            className="w-full bg-transparent outline-none placeholder-[#585b70] text-xs"
            onChange={e => onAction?.('change', e.target.value)}
          />
        </div>
      )
    }

    // ─── Stat Card (KPI) ──────────────────────────────────────
    case 'stat-card': {
      const isUp = String(props.trend ?? 'up') === 'up'
      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] rounded-xl p-3.5 flex flex-col justify-between shadow-sm select-none">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#a6adc8] font-medium">{String(props.title ?? 'Total Revenue')}</span>
            <span className="text-base">{String(props.icon ?? '📈')}</span>
          </div>
          <div className="my-1">
            <div className="text-2xl font-bold text-[#cdd6f4] tracking-tight">
              {String(props.value ?? '$48,250')}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <div className={cn('flex items-center font-medium gap-0.5', isUp ? 'text-green-400' : 'text-red-400')}>
              <span>{isUp ? '↑' : '↓'}</span>
              <span>{String(props.change ?? '+14.2%')}</span>
            </div>
            <span className="text-[#6c7086] text-[10px]">{String(props.subtext ?? 'vs last month')}</span>
          </div>
        </div>
      )
    }

    // ─── Chart (Bar / Line / Donut) ───────────────────────────
    case 'chart': {
      const chartType = String(props.chartType ?? 'bar')
      const title = String(props.title ?? 'Analytics Overview')

      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] rounded-xl p-3.5 flex flex-col select-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#cdd6f4]">{title}</span>
            <span className="text-[10px] bg-[#313244] text-[#89b4fa] px-1.5 py-0.5 rounded capitalize">
              {chartType}
            </span>
          </div>

          <div className="flex-1 flex items-end justify-between gap-1.5 pt-2 pb-1 px-1">
            {chartType === 'bar' && (
              <>
                {[45, 78, 52, 90, 65, 82, 95].map((val, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <div
                      className="w-full rounded-t bg-gradient-to-t from-blue-600 to-[#89b4fa] transition-all hover:brightness-110"
                      style={{ height: `${val}%` }}
                    />
                    <span className="text-[9px] text-[#6c7086] font-mono">D{i + 1}</span>
                  </div>
                ))}
              </>
            )}

            {chartType === 'line' && (
              <svg className="w-full h-full overflow-visible" viewBox="0 0 200 80" preserveAspectRatio="none">
                <path
                  d="M 0,60 Q 40,10 80,45 T 160,20 T 200,30"
                  fill="none"
                  stroke="#89b4fa"
                  strokeWidth="3"
                />
                <circle cx="80" cy="45" r="4" fill="#89b4fa" />
                <circle cx="160" cy="20" r="4" fill="#a6e3a1" />
              </svg>
            )}

            {chartType === 'donut' && (
              <div className="w-full h-full flex items-center justify-center gap-4">
                <div className="relative w-20 h-20 rounded-full border-8 border-t-blue-500 border-r-[#89b4fa] border-b-purple-500 border-l-[#313244] flex items-center justify-center">
                  <span className="text-xs font-bold text-[#cdd6f4]">72%</span>
                </div>
                <div className="text-[10px] text-[#a6adc8] space-y-1">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Web (55%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#89b4fa]" /> Mobile (30%)</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-500" /> API (15%)</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }

    // ─── AI Chat Stream ───────────────────────────────────────
    case 'ai-chat': {
      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] rounded-xl flex flex-col overflow-hidden text-xs">
          {/* Header */}
          <div className="px-3 py-2 bg-[#1e1e2e] border-b border-[#313244] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-semibold text-[#cdd6f4]">AI Assistant</span>
            </div>
            <span className="text-[10px] text-[#a6adc8] bg-[#313244] px-1.5 py-0.5 rounded">
              Model: Gemini 1.5
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                U
              </div>
              <div className="bg-[#313244] text-[#cdd6f4] p-2 rounded-lg rounded-tl-none max-w-[85%]">
                Can you generate a summary for this quarterly metrics?
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                ✦
              </div>
              <div className="bg-[#1e1e2e] border border-[#45475a] text-[#cdd6f4] p-2 rounded-lg rounded-tl-none max-w-[85%] space-y-1">
                <p>Quarterly active users increased by <strong>+24.8%</strong> and conversion rate stabilized at 3.4%.</p>
                <div className="text-[10px] text-green-400">✓ 3 tool operations completed</div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ─── Prompt Input ─────────────────────────────────────────
    case 'prompt-input': {
      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] rounded-xl p-2 flex items-center gap-2 shadow-md">
          <button className="text-[#a6adc8] hover:text-[#cdd6f4] px-2 py-1 rounded hover:bg-[#313244] text-xs flex items-center gap-1">
            <span>📎</span>
          </button>
          <input
            type="text"
            placeholder={String(props.placeholder ?? 'Ask AI or type instructions...')}
            className="flex-1 bg-transparent text-xs text-[#cdd6f4] outline-none placeholder-[#585b70]"
            disabled={!isInteractive}
          />
          <span className="text-[10px] bg-[#313244] text-[#89b4fa] px-2 py-0.5 rounded font-mono hidden sm:inline">
            ⌘K
          </span>
          <button
            className={cn(
              'px-3 py-1.5 bg-[#89b4fa] hover:bg-[#b4befe] text-[#11111b] font-medium rounded-lg text-xs flex items-center gap-1 transition-colors',
              !isInteractive && 'pointer-events-none'
            )}
            onClick={() => onAction?.('send')}
          >
            <span>Send</span>
            <span>➤</span>
          </button>
        </div>
      )
    }

    // ─── Agent Tool Call ──────────────────────────────────────
    case 'agent-tool-call': {
      const status = String(props.status ?? 'success')
      const toolName = String(props.toolName ?? 'search_knowledge_base')

      return (
        <div className="w-full h-full bg-[#1e1e2e] border border-[#313244] rounded-lg p-2.5 flex flex-col justify-between font-mono text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[#89b4fa]">
              <span>⚙️</span>
              <span className="font-bold">{toolName}</span>
            </div>
            <span
              className={cn(
                'text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-semibold',
                status === 'success' && 'bg-green-500/20 text-green-400',
                status === 'running' && 'bg-yellow-500/20 text-yellow-400 animate-pulse',
                status === 'failed' && 'bg-red-500/20 text-red-400'
              )}
            >
              {status}
            </span>
          </div>

          <div className="bg-[#11111b] rounded p-1.5 text-[10px] text-[#a6adc8] truncate my-1">
            args: {JSON.stringify(props.params ?? { query: 'active_sessions', limit: 10 })}
          </div>

          <div className="text-[10px] text-[#6c7086] flex items-center justify-between">
            <span>Duration: 120ms</span>
            <span className="text-blue-400 hover:underline cursor-pointer">View Output ↗</span>
          </div>
        </div>
      )
    }

    // ─── Alert ────────────────────────────────────────────────
    case 'alert': {
      const variant = String(props.variant ?? 'info')
      const variantStyle = {
        info: 'bg-blue-900/20 border-blue-500/40 text-blue-300 icon:ℹ️',
        success: 'bg-green-900/20 border-green-500/40 text-green-300 icon:✅',
        warning: 'bg-yellow-900/20 border-yellow-500/40 text-yellow-300 icon:⚠️',
        error: 'bg-red-900/20 border-red-500/40 text-red-300 icon:🚨',
      }[variant] ?? 'bg-blue-900/20 border-blue-500/40 text-blue-300 icon:ℹ️'

      const [classes, icon] = [variantStyle.split(' icon:')[0], variantStyle.split(' icon:')[1]]

      return (
        <div className={cn('w-full h-full border rounded-lg p-3 flex items-start gap-2.5', classes)}>
          <span className="text-sm shrink-0">{icon}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-xs text-[#cdd6f4]">{String(props.title ?? 'Notification')}</div>
            <div className="text-[11px] text-[#a6adc8] truncate">{String(props.message ?? 'This is an alert notification message.')}</div>
          </div>
          {Boolean(props.dismissible) && (
            <button className="text-[#a6adc8] hover:text-[#cdd6f4] text-xs">✕</button>
          )}
        </div>
      )
    }

    // ─── Avatar ───────────────────────────────────────────────
    case 'avatar': {
      const name = String(props.name ?? 'Alex Morgan')
      const role = String(props.role ?? 'Product Designer')
      return (
        <div className="w-full h-full flex items-center gap-3 p-2 select-none">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-400 flex items-center justify-center text-white font-bold text-sm shadow">
              {name.split(' ').map(n => n[0]).join('')}
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#181825] rounded-full" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-semibold text-[#cdd6f4] truncate">{name}</div>
            <div className="text-[10px] text-[#a6adc8] truncate">{role}</div>
          </div>
        </div>
      )
    }

    // ─── Tabs ─────────────────────────────────────────────────
    case 'tabs': {
      const items = Array.isArray(props.items) ? props.items : ['Overview', 'Analytics', 'Settings']
      const activeTab = Number(props.activeTab ?? 0)
      return (
        <div className="w-full h-full flex items-center border-b border-[#313244] px-2 gap-4 select-none">
          {items.map((tab, i) => (
            <button
              key={i}
              className={cn(
                'text-xs font-medium py-2 border-b-2 transition-colors -mb-px',
                i === activeTab
                  ? 'border-[#89b4fa] text-[#89b4fa]'
                  : 'border-transparent text-[#a6adc8] hover:text-[#cdd6f4]'
              )}
              onClick={() => onAction?.('tab-change', i)}
            >
              {String(tab)}
            </button>
          ))}
        </div>
      )
    }

    // ─── Table ────────────────────────────────────────────────
    case 'table': {
      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] rounded-lg overflow-hidden text-[11px] select-none flex flex-col">
          <div className="bg-[#1e1e2e] grid grid-cols-4 px-3 py-2 text-[#a6adc8] font-semibold border-b border-[#313244]">
            <span>User</span>
            <span>Role</span>
            <span>Status</span>
            <span className="text-right">Action</span>
          </div>
          <div className="flex-1 divide-y divide-[#313244]/50 overflow-y-auto">
            {[
              { name: 'Sarah Connor', role: 'Admin', status: 'Active' },
              { name: 'John Doe', role: 'Editor', status: 'Pending' },
              { name: 'Emma Vance', role: 'Viewer', status: 'Active' },
            ].map((row, i) => (
              <div key={i} className="grid grid-cols-4 px-3 py-2 items-center text-[#cdd6f4] hover:bg-[#313244]/30">
                <span className="font-medium truncate">{row.name}</span>
                <span className="text-[#a6adc8]">{row.role}</span>
                <span>
                  <span className={cn('text-[9px] px-1.5 py-0.5 rounded-full font-medium', row.status === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400')}>
                    {row.status}
                  </span>
                </span>
                <span className="text-right text-[#89b4fa] hover:underline cursor-pointer">Edit</span>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // ─── Card ─────────────────────────────────────────────────
    case 'card': {
      return (
        <div
          className="w-full h-full rounded-xl overflow-hidden flex flex-col select-none border border-[#313244]"
          style={{
            background: String(props.background ?? '#181825'),
            borderRadius: `${Number(props.borderRadius) || 12}px`,
            padding: `${Number(props.padding) || 16}px`,
          }}
        >
          {Boolean(props.title) && (
            <div className="font-semibold text-sm text-[#cdd6f4] mb-1">{String(props.title)}</div>
          )}
          {Boolean(props.description) && (
            <div className="text-xs text-[#a6adc8]">{String(props.description)}</div>
          )}
        </div>
      )
    }

    // ─── Image ────────────────────────────────────────────────
    case 'image': {
      return (
        <div className="w-full h-full bg-[#181825] border border-[#313244] flex items-center justify-center rounded-lg overflow-hidden">
          {props.src ? (
            <img
              src={String(props.src)}
              alt={String(props.alt ?? '')}
              className="w-full h-full"
              style={{ objectFit: (props.objectFit as React.CSSProperties['objectFit']) ?? 'cover' }}
            />
          ) : (
            <div className="text-[#6c7086] text-xs flex flex-col items-center gap-1">
              <span className="text-2xl">🖼</span>
              <span>Image</span>
            </div>
          )}
        </div>
      )
    }

    // ─── Navbar ───────────────────────────────────────────────
    case 'navbar': {
      return (
        <div
          className="w-full h-full flex items-center justify-between px-4 border-b border-[#313244] select-none"
          style={{ background: String(props.background ?? '#181825') }}
        >
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#89b4fa] flex items-center justify-center font-bold text-xs text-[#11111b]">
              P
            </div>
            <span className="font-bold text-sm text-[#cdd6f4]">Acme Pro</span>
          </div>
          <div className="flex gap-4 text-xs font-medium text-[#a6adc8]">
            <span className="text-[#89b4fa]">Dashboard</span>
            <span className="hover:text-[#cdd6f4]">Analytics</span>
            <span className="hover:text-[#cdd6f4]">Projects</span>
            <span className="hover:text-[#cdd6f4]">Settings</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold text-xs flex items-center justify-center">
              JD
            </span>
          </div>
        </div>
      )
    }

    // ─── Sidebar ──────────────────────────────────────────────
    case 'sidebar': {
      return (
        <div
          className="w-full h-full flex flex-col p-3 border-r border-[#313244] select-none"
          style={{ background: String(props.background ?? '#11111b') }}
        >
          <div className="font-semibold text-xs text-[#6c7086] mb-3 px-2 uppercase tracking-wider">
            Navigation
          </div>
          {[
            { label: 'Dashboard', icon: '📊', active: true },
            { label: 'Analytics', icon: '📈' },
            { label: 'AI Agents', icon: '🤖' },
            { label: 'Customers', icon: '👥' },
            { label: 'Settings', icon: '⚙️' },
          ].map((item, idx) => (
            <div
              key={idx}
              className={cn(
                'flex items-center gap-2 px-2.5 py-2 text-xs rounded-lg mb-0.5 transition-colors cursor-pointer',
                item.active
                  ? 'bg-[#89b4fa]/20 text-[#89b4fa] font-medium'
                  : 'text-[#a6adc8] hover:bg-[#313244] hover:text-[#cdd6f4]'
              )}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )
    }

    // ─── Modal ────────────────────────────────────────────────
    case 'modal': {
      return (
        <div className="w-full h-full bg-[#181825] rounded-xl shadow-2xl flex flex-col border border-[#313244] overflow-hidden select-none">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#313244]">
            <span className="font-semibold text-xs text-[#cdd6f4]">
              {String(props.title ?? 'Dialog Window')}
            </span>
            <span className="text-[#6c7086] hover:text-[#cdd6f4] text-xs cursor-pointer">✕</span>
          </div>
          <div className="flex-1 p-4 text-xs text-[#a6adc8]">
            Modal dialog contents and configurable slot area.
          </div>
          <div className="flex justify-end gap-2 px-4 py-3 border-t border-[#313244] bg-[#11111b]">
            <button className="px-3 py-1 text-xs rounded border border-[#45475a] text-[#a6adc8]">
              Cancel
            </button>
            <button className="px-3 py-1 text-xs rounded bg-[#89b4fa] text-[#11111b] font-medium">
              Save Changes
            </button>
          </div>
        </div>
      )
    }

    // ─── Checkbox ─────────────────────────────────────────────
    case 'checkbox': {
      return (
        <div className="w-full h-full flex items-center gap-2 px-2 select-none">
          <div
            className={cn(
              'w-4 h-4 rounded border flex items-center justify-center transition-colors',
              props.checked ? 'bg-[#89b4fa] border-[#89b4fa]' : 'border-[#45475a] bg-[#1e1e2e]'
            )}
          >
            {Boolean(props.checked) && <span className="text-[#11111b] font-bold text-[10px]">✓</span>}
          </div>
          <span className="text-xs text-[#cdd6f4]">{String(props.label ?? 'Checkbox')}</span>
        </div>
      )
    }

    // ─── Switch ───────────────────────────────────────────────
    case 'switch': {
      return (
        <div className="w-full h-full flex items-center gap-2 px-2 select-none">
          <div
            className={cn(
              'w-8 h-4 rounded-full relative transition-colors',
              props.enabled ? 'bg-[#89b4fa]' : 'bg-[#45475a]'
            )}
          >
            <div
              className={cn(
                'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform',
                props.enabled ? 'left-4' : 'left-0.5'
              )}
            />
          </div>
          <span className="text-xs text-[#cdd6f4]">{String(props.label ?? 'Toggle')}</span>
        </div>
      )
    }

    // ─── Badge ────────────────────────────────────────────────
    case 'badge': {
      const variant = String(props.variant ?? 'default')
      return (
        <div className="w-full h-full flex items-center justify-center select-none">
          <span
            className={cn(
              'px-2.5 py-0.5 rounded-full text-[11px] font-medium',
              variant === 'success' && 'bg-green-500/20 text-green-400',
              variant === 'warning' && 'bg-yellow-500/20 text-yellow-400',
              variant === 'error' && 'bg-red-500/20 text-red-400',
              variant === 'info' && 'bg-blue-500/20 text-blue-400',
              (!variant || variant === 'default') && 'bg-[#313244] text-[#cdd6f4]'
            )}
          >
            {String(props.label ?? 'Badge')}
          </span>
        </div>
      )
    }

    // ─── Divider ──────────────────────────────────────────────
    case 'divider': {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-full h-px bg-[#313244]" />
        </div>
      )
    }

    // ─── Fallback Container / Panel ───────────────────────────
    default:
      return (
        <div
          className="w-full h-full border border-[#313244] rounded-lg p-2 flex flex-col justify-between"
          style={{ background: String(props.background ?? '#181825') }}
        >
          <span className="text-[10px] text-[#6c7086] font-mono capitalize">{type}</span>
          {Boolean(props.title) && (
            <span className="text-xs font-semibold text-[#cdd6f4]">{String(props.title)}</span>
          )}
        </div>
      )
  }
}
