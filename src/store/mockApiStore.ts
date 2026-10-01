// ============================================================
// MOCK API STORE & ENGINE — Phase 14
// Simulates backend REST APIs with realistic network delay & status codes
// ============================================================

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { v4 as uuidv4 } from 'uuid'
import type { MockEndpoint, HttpMethod } from '../types'

interface MockApiResponse<T = unknown> {
  status: number
  ok: boolean
  data: T
  duration: number
}

interface MockApiStore {
  endpoints: MockEndpoint[]
  activeRequests: string[] // endpoint IDs currently in-flight
  requestLogs: Array<{
    id: string
    endpointId: string
    url: string
    method: HttpMethod
    status: number
    duration: number
    timestamp: string
  }>

  // ── Endpoint CRUD ─────────────────────
  addEndpoint: (endpoint: Omit<MockEndpoint, 'id'>) => string
  updateEndpoint: (id: string, updates: Partial<MockEndpoint>) => void
  deleteEndpoint: (id: string) => void
  getEndpoint: (id: string) => MockEndpoint | undefined
  findEndpointByUrl: (url: string, method?: HttpMethod) => MockEndpoint | undefined

  // ── Execution Simulation ──────────────
  executeRequest: (endpointId: string) => Promise<MockApiResponse>
}

export const DEFAULT_MOCK_ENDPOINTS: MockEndpoint[] = [
  {
    id: 'mock-users',
    name: 'Get Users List',
    method: 'GET',
    url: '/api/users',
    delayMs: 600,
    statusCode: 200,
    responseBody: [
      { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', avatar: '👨‍💻' },
      { id: 2, name: 'Sarah Chen', email: 'sarah@example.com', role: 'Designer', avatar: '👩‍🎨' },
      { id: 3, name: 'Michael Scott', email: 'mscott@dunder.com', role: 'Manager', avatar: '👔' },
    ],
  },
  {
    id: 'mock-login',
    name: 'User Login',
    method: 'POST',
    url: '/api/auth/login',
    delayMs: 800,
    statusCode: 200,
    responseBody: {
      token: 'mock-jwt-token-xyz-12345',
      user: { id: 1, name: 'Alex Johnson', email: 'alex@example.com' },
      expiresIn: 3600,
    },
  },
  {
    id: 'mock-metrics',
    name: 'Dashboard Metrics',
    method: 'GET',
    url: '/api/dashboard/metrics',
    delayMs: 400,
    statusCode: 200,
    responseBody: {
      totalRevenue: '$128,450',
      activeUsers: '14,290',
      conversionRate: '3.82%',
      growthMonthOverMonth: '+18.4%',
    },
  },
]

export const useMockApiStore = create<MockApiStore>()(
  immer((set, get) => ({
    endpoints: DEFAULT_MOCK_ENDPOINTS,
    activeRequests: [],
    requestLogs: [],

    addEndpoint: (endpoint) => {
      const id = uuidv4()
      set(s => {
        s.endpoints.push({ id, ...endpoint })
      })
      return id
    },

    updateEndpoint: (id, updates) => {
      set(s => {
        const ep = s.endpoints.find(e => e.id === id)
        if (ep) Object.assign(ep, updates)
      })
    },

    deleteEndpoint: (id) => {
      set(s => {
        s.endpoints = s.endpoints.filter(e => e.id !== id)
      })
    },

    getEndpoint: (id) => {
      return get().endpoints.find(e => e.id === id)
    },

    findEndpointByUrl: (url, method) => {
      return get().endpoints.find(e => e.url === url && (!method || e.method === method))
    },

    executeRequest: async (endpointId) => {
      const endpoint = get().getEndpoint(endpointId)
      if (!endpoint) {
        throw new Error(`[MockApi] Endpoint not found: ${endpointId}`)
      }

      set(s => {
        s.activeRequests.push(endpointId)
      })

      const start = Date.now()

      // Simulate realistic network latency
      await new Promise(resolve => setTimeout(resolve, endpoint.delayMs))

      const duration = Date.now() - start
      const ok = endpoint.statusCode >= 200 && endpoint.statusCode < 300

      set(s => {
        s.activeRequests = s.activeRequests.filter(id => id !== endpointId)
        s.requestLogs.unshift({
          id: uuidv4(),
          endpointId,
          url: endpoint.url,
          method: endpoint.method,
          status: endpoint.statusCode,
          duration,
          timestamp: new Date().toLocaleTimeString(),
        })
        if (s.requestLogs.length > 30) s.requestLogs.pop()
      })

      return {
        status: endpoint.statusCode,
        ok,
        data: endpoint.responseBody,
        duration,
      }
    },
  }))
)
