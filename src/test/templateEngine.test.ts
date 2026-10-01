// ============================================================
// TEMPLATE ENGINE TESTS — Phase 17
// ============================================================

import { describe, it, expect } from 'vitest'
import {
  TEMPLATES_METADATA,
  createSaaSDashboardTemplate,
  createAIAssistantTemplate,
  createAuthAdminTemplate,
  loadTemplateProject,
} from '../engine/templateEngine'

describe('Phase 17 — Template Engine', () => {
  it('has metadata for SaaS, AI, and Auth templates', () => {
    const ids = TEMPLATES_METADATA.map(t => t.id)
    expect(ids).toContain('saas-dashboard')
    expect(ids).toContain('ai-copilot')
    expect(ids).toContain('auth-admin')
  })

  it('creates SaaS Dashboard template with valid frame, grid, and modern components', () => {
    const project = createSaaSDashboardTemplate()
    expect(project.pages.length).toBeGreaterThan(0)
    const page = project.pages[0]
    expect(page.frames.length).toBe(1)

    const frame = page.frames[0]
    expect(frame.width).toBe(1440)
    expect(frame.layoutMode).toBe('grid')
    expect(frame.grid?.columns).toBe(12)

    const compTypes = frame.children.map(c => c.componentType)
    expect(compTypes).toContain('sidebar')
    expect(compTypes).toContain('navbar')
    expect(compTypes).toContain('stat-card')
    expect(compTypes).toContain('chart')
    expect(compTypes).toContain('table')
  })

  it('creates AI Copilot template with chat stream and tool call cards', () => {
    const project = createAIAssistantTemplate()
    const frame = project.pages[0].frames[0]
    const compTypes = frame.children.map(c => c.componentType)

    expect(compTypes).toContain('ai-chat')
    expect(compTypes).toContain('agent-tool-call')
    expect(compTypes).toContain('prompt-input')
  })

  it('creates multi-page Auth Admin template with navigation flow connection', () => {
    const project = createAuthAdminTemplate()
    expect(project.pages.length).toBe(2)
    const [loginPage, adminPage] = project.pages

    expect(loginPage.name).toBe('Sign In')
    expect(adminPage.name).toBe('Admin Console')

    // Expect flow connection between pages
    expect(project.flow.connections.length).toBe(1)
    expect(project.flow.connections[0].fromPageId).toBe(loginPage.id)
    expect(project.flow.connections[0].toPageId).toBe(adminPage.id)

    // Check interaction on button in login page
    const loginFrame = loginPage.frames[0]
    const button = loginFrame.children.find(c => c.componentType === 'button')
    expect(button?.interactions?.length).toBe(1)
    expect(button?.interactions?.[0].action).toBe('navigate')
    expect(button?.interactions?.[0].target).toBe(adminPage.id)
  })

  it('loadTemplateProject safely resolves known templates', () => {
    const p1 = loadTemplateProject('saas-dashboard')
    expect(p1.settings.name).toContain('SaaS')

    const p2 = loadTemplateProject('ai-copilot')
    expect(p2.settings.name).toContain('AI')

    const p3 = loadTemplateProject('auth-admin')
    expect(p3.settings.name).toContain('Admin')
  })
})
