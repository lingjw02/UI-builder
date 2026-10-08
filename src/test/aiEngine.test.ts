// ============================================================
// AI UI GENERATOR TESTS
// ============================================================

import { describe, it, expect } from 'vitest'
import { generateUIFromPrompt } from '../engine/aiEngine'

describe('AI UI Generator Engine', () => {
  it('generates 3-tier pricing layout for pricing prompt', () => {
    const plan = generateUIFromPrompt('Create a modern SaaS pricing page with 3 tiers')
    expect(plan.title).toContain('Pricing')
    expect(plan.operations.pageName).toBe('Pricing')

    const frame = plan.operations.frame
    expect(frame.layoutMode).toBe('grid')
    expect(frame.grid?.columns).toBe(12)

    const cards = frame.children.filter(c => c.componentType === 'card')
    expect(cards.length).toBe(3)
  })

  it('generates mobile screen layout for mobile prompt', () => {
    const plan = generateUIFromPrompt('Build an iPhone mobile wallet profile screen')
    expect(plan.title).toContain('Mobile')
    expect(plan.operations.frame.deviceType).toBe('iphone')
    expect(plan.operations.frame.width).toBe(375)
    expect(plan.operations.frame.grid?.columns).toBe(4)

    const compTypes = plan.operations.frame.children.map(c => c.componentType)
    expect(compTypes).toContain('avatar')
    expect(compTypes).toContain('stat-card')
    expect(compTypes).toContain('button')
  })

  it('generates full SaaS dashboard with KPIs, chart, and table for general prompt', () => {
    const plan = generateUIFromPrompt('Generate a comprehensive analytics dashboard')
    expect(plan.operations.frame.deviceType).toBe('desktop')

    const compTypes = plan.operations.frame.children.map(c => c.componentType)
    expect(compTypes).toContain('sidebar')
    expect(compTypes).toContain('navbar')
    expect(compTypes).toContain('stat-card')
    expect(compTypes).toContain('chart')
    expect(compTypes).toContain('table')
  })
})
