// ============================================================
// MOCK DATA PANEL
// Left Panel API/Mock Data tab: view and create simulated endpoints & request logs
// ============================================================

import React, { useState } from 'react'
import { useMockApiStore } from '../../store/mockApiStore'
import type { HttpMethod } from '../../types'
import { cn } from '../../lib/utils'

export const MockDataPanel: React.FC = () => {
  const endpoints = useMockApiStore(s => s.endpoints)
  const addEndpoint = useMockApiStore(s => s.addEndpoint)
  const deleteEndpoint = useMockApiStore(s => s.deleteEndpoint)
  const executeRequest = useMockApiStore(s => s.executeRequest)
  const activeRequests = useMockApiStore(s => s.activeRequests)
  const requestLogs = useMockApiStore(s => s.requestLogs)

  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [method, setMethod] = useState<HttpMethod>('GET')
  const [url, setUrl] = useState('/api/')
  const [delayMs, setDelayMs] = useState(500)
  const [statusCode, setStatusCode] = useState(200)
  const [jsonBody, setJsonBody] = useState('{\n  "message": "success"\n}')

  const handleCreate = () => {
    if (!name || !url) return
    let parsedBody: unknown = {}
    try {
      parsedBody = JSON.parse(jsonBody)
    } catch {
      alert('Invalid JSON response body')
      return
    }

    addEndpoint({
      name,
      method,
      url,
      delayMs,
      statusCode,
      responseBody: parsedBody,
    })

    setIsAdding(false)
    setName('')
    setUrl('/api/')
  }

  const methodColor = (m: HttpMethod) => {
    switch (m) {
      case 'GET': return 'bg-blue-500/20 text-blue-400'
      case 'POST': return 'bg-green-500/20 text-green-400'
      case 'PUT': return 'bg-yellow-500/20 text-yellow-400'
      case 'DELETE': return 'bg-red-500/20 text-red-400'
      case 'PATCH': return 'bg-purple-500/20 text-purple-400'
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto p-2 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
          Mock Endpoints
        </span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-[#89b4fa] hover:text-[#b4befe]"
        >
          {isAdding ? 'Cancel' : '+ New API'}
        </button>
      </div>

      {isAdding && (
        <div className="bg-[#313244] p-2.5 rounded-lg space-y-2 border border-[#45475a]">
          <input
            type="text"
            placeholder="Endpoint Name (e.g. Fetch Profile)"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-[#1e1e2e] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
          />
          <div className="flex gap-2">
            <select
              value={method}
              onChange={e => setMethod(e.target.value as HttpMethod)}
              className="bg-[#1e1e2e] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
            >
              <option value="GET">GET</option>
              <option value="POST">POST</option>
              <option value="PUT">PUT</option>
              <option value="DELETE">DELETE</option>
              <option value="PATCH">PATCH</option>
            </select>
            <input
              type="text"
              placeholder="/api/resource"
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="flex-1 bg-[#1e1e2e] text-[#cdd6f4] text-xs rounded px-2 py-1 outline-none border border-transparent focus:border-[#89b4fa]"
            />
          </div>

          <div className="flex gap-2 text-xs">
            <div className="flex-1">
              <label className="text-[10px] text-[#585b70]">Delay (ms)</label>
              <input
                type="number"
                value={delayMs}
                onChange={e => setDelayMs(Number(e.target.value))}
                className="w-full bg-[#1e1e2e] text-[#cdd6f4] rounded px-2 py-1 outline-none"
              />
            </div>
            <div className="w-20">
              <label className="text-[10px] text-[#585b70]">Status</label>
              <input
                type="number"
                value={statusCode}
                onChange={e => setStatusCode(Number(e.target.value))}
                className="w-full bg-[#1e1e2e] text-[#cdd6f4] rounded px-2 py-1 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] text-[#585b70]">Response JSON</label>
            <textarea
              rows={3}
              value={jsonBody}
              onChange={e => setJsonBody(e.target.value)}
              className="w-full bg-[#1e1e2e] text-[#a6e3a1] font-mono text-[11px] rounded p-2 outline-none border border-transparent focus:border-[#89b4fa]"
            />
          </div>

          <button
            onClick={handleCreate}
            className="w-full py-1 text-xs bg-[#89b4fa] text-[#1e1e2e] rounded font-medium hover:bg-[#74c7ec]"
          >
            Save Endpoint
          </button>
        </div>
      )}

      {/* Endpoint List */}
      <div className="space-y-1.5">
        {endpoints.map(ep => {
          const isLoading = activeRequests.includes(ep.id)
          return (
            <div
              key={ep.id}
              className="bg-[#181825] border border-[#313244] hover:border-[#45475a] rounded p-2 space-y-1 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <span className={cn('text-[9px] font-mono px-1.5 py-0.5 rounded font-bold', methodColor(ep.method))}>
                  {ep.method}
                </span>
                <span className="text-[10px] text-[#585b70]">
                  {ep.delayMs}ms · {ep.statusCode}
                </span>
              </div>
              <div className="text-xs text-[#cdd6f4] font-medium truncate">{ep.name}</div>
              <div className="text-[10px] font-mono text-[#585b70] truncate">{ep.url}</div>

              <div className="pt-1 flex items-center justify-between border-t border-[#313244]">
                <button
                  onClick={() => executeRequest(ep.id)}
                  disabled={isLoading}
                  className="text-[10px] text-[#89b4fa] hover:underline flex items-center gap-1"
                >
                  {isLoading ? 'Sending...' : '⚡ Test Call'}
                </button>
                <button
                  onClick={() => deleteEndpoint(ep.id)}
                  className="text-[10px] text-[#585b70] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Network Logs */}
      {requestLogs.length > 0 && (
        <div className="pt-2 border-t border-[#313244] space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-[#585b70] font-semibold">
            Recent Network Calls
          </span>
          <div className="space-y-1">
            {requestLogs.slice(0, 5).map(log => (
              <div
                key={log.id}
                className="bg-[#1e1e2e] text-[10px] p-1.5 rounded flex items-center justify-between font-mono"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className={cn('px-1 rounded', log.status < 300 ? 'text-green-400' : 'text-red-400')}>
                    {log.status}
                  </span>
                  <span className="text-[#cdd6f4] truncate">{log.url}</span>
                </div>
                <span className="text-[#585b70] shrink-0">{log.duration}ms</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
