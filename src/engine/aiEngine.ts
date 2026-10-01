// ============================================================
// AI UI GENERATOR ENGINE — Phase 18
// Transforms natural language prompts into document model operations
// Architecture Rule: AI manipulates the exact same canonical document model
// ============================================================

import { v4 as uuidv4 } from 'uuid'
import type { Frame } from '../types'
import { createFrame, createComponentInstance } from '../store/projectFactory'

export interface AIPromptPlan {
  title: string
  explanation: string
  operations: {
    pageName: string
    frame: Frame
  }
}

/**
 * Parses user prompt and generates corresponding pages, frames, grids, and components.
 */
export function generateUIFromPrompt(prompt: string): AIPromptPlan {
  const p = prompt.toLowerCase()
  const frameId = uuidv4()

  // 1. Pricing Plan
  if (p.includes('pricing') || p.includes('tier') || p.includes('plan')) {
    const frame: Frame = createFrame({
      id: frameId,
      name: 'Pricing Plans',
      width: 1440,
      height: 900,
      deviceType: 'desktop',
      background: '#11111b',
      layoutMode: 'grid',
      grid: {
        columns: 12,
        rows: 8,
        columnGap: 20,
        rowGap: 20,
        padding: { top: 40, right: 40, bottom: 40, left: 40 },
        snap: true,
        autoPlace: false,
        showGrid: true,
      },
      children: [
        // Heading Title
        createComponentInstance('text', {
          mode: 'grid',
          grid: { gridColumn: 4, gridRow: 1, columnSpan: 6, rowSpan: 1 },
        }, {
          content: 'Simple, Transparent Pricing',
          fontSize: 28,
          fontWeight: '700',
          align: 'center',
          color: '#cdd6f4',
        }),
        // Subtitle
        createComponentInstance('text', {
          mode: 'grid',
          grid: { gridColumn: 4, gridRow: 2, columnSpan: 6, rowSpan: 1 },
        }, {
          content: 'Choose the plan that fits your team scale. Cancel anytime.',
          fontSize: 14,
          align: 'center',
          color: '#a6adc8',
        }),
        // Tier 1: Starter
        createComponentInstance('card', {
          mode: 'grid',
          grid: { gridColumn: 2, gridRow: 3, columnSpan: 3, rowSpan: 5 },
        }, {
          title: 'Starter — $19/mo',
          description: 'Best for solo founders and freelancers.\n• Up to 3 active projects\n• Basic analytics\n• Community support',
        }),
        // Tier 2: Pro (Highlighted)
        createComponentInstance('card', {
          mode: 'grid',
          grid: { gridColumn: 5, gridRow: 3, columnSpan: 4, rowSpan: 5 },
        }, {
          title: 'Pro Team — $79/mo (Most Popular)',
          description: 'For scaling companies and high velocity teams.\n• Unlimited active prototypes\n• Advanced motion and mock APIs\n• Real-time team collaboration\n• Priority 24/7 support',
        }),
        // Tier 3: Enterprise
        createComponentInstance('card', {
          mode: 'grid',
          grid: { gridColumn: 9, gridRow: 3, columnSpan: 3, rowSpan: 5 },
        }, {
          title: 'Enterprise — Custom',
          description: 'Dedicated infrastructure and SSO.\n• Custom SLA guarantee\n• Dedicated solutions engineer\n• On-premise deployment option',
        }),
      ],
    })

    return {
      title: 'Generated Pricing Page',
      explanation: 'Built a 3-tier responsive grid pricing layout with Starter, Pro, and Enterprise packages.',
      operations: {
        pageName: 'Pricing',
        frame,
      },
    }
  }

  // 2. Mobile App screen (e.g. "mobile login" or "mobile profile")
  if (p.includes('mobile') || p.includes('phone') || p.includes('iphone')) {
    const frame: Frame = createFrame({
      id: frameId,
      name: 'Mobile App Screen',
      width: 375,
      height: 812,
      deviceType: 'iphone',
      background: '#181825',
      layoutMode: 'grid',
      grid: {
        columns: 4,
        rows: 12,
        columnGap: 12,
        rowGap: 12,
        padding: { top: 24, right: 16, bottom: 24, left: 16 },
        snap: true,
        autoPlace: false,
        showGrid: true,
      },
      children: [
        createComponentInstance('avatar', {
          mode: 'grid',
          grid: { gridColumn: 1, gridRow: 2, columnSpan: 4, rowSpan: 2 },
        }, { name: 'Elena Rostova', role: 'Premium Subscriber' }),
        createComponentInstance('stat-card', {
          mode: 'grid',
          grid: { gridColumn: 1, gridRow: 4, columnSpan: 4, rowSpan: 2 },
        }, { title: 'Wallet Balance', value: '$3,820.50', change: '+5.4%', trend: 'up', icon: '💳' }),
        createComponentInstance('button', {
          mode: 'grid',
          grid: { gridColumn: 1, gridRow: 7, columnSpan: 4, rowSpan: 1 },
        }, { label: 'Send Payment', variant: 'primary' }),
        createComponentInstance('button', {
          mode: 'grid',
          grid: { gridColumn: 1, gridRow: 8, columnSpan: 4, rowSpan: 1 },
        }, { label: 'Request Transfer', variant: 'secondary' }),
      ],
    })

    return {
      title: 'Generated Mobile View',
      explanation: 'Constructed an iPhone screen layout with user avatar, wallet KPI stat-card, and payment action buttons.',
      operations: {
        pageName: 'Mobile Screen',
        frame,
      },
    }
  }

  // 3. Default: Full SaaS Dashboard or Workspace
  const frame: Frame = createFrame({
    id: frameId,
    name: 'Generated Workspace',
    width: 1440,
    height: 900,
    deviceType: 'desktop',
    background: '#11111b',
    layoutMode: 'grid',
    grid: {
      columns: 12,
      rows: 8,
      columnGap: 16,
      rowGap: 16,
      padding: { top: 20, right: 24, bottom: 20, left: 24 },
      snap: true,
      autoPlace: false,
      showGrid: true,
    },
    children: [
      // Sidebar
      createComponentInstance('sidebar', {
        mode: 'grid',
        grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 8 },
      }, { background: '#181825' }),
      // Navbar
      createComponentInstance('navbar', {
        mode: 'grid',
        grid: { gridColumn: 3, gridRow: 1, columnSpan: 10, rowSpan: 1 },
      }, { background: '#181825' }),
      // Notification Alert
      createComponentInstance('alert', {
        mode: 'grid',
        grid: { gridColumn: 3, gridRow: 2, columnSpan: 10, rowSpan: 1 },
      }, {
        title: 'AI Generation Complete',
        message: `Synthesized layout for: "${prompt}". Components placed in 12-column grid.`,
        variant: 'success',
      }),
      // KPI 1
      createComponentInstance('stat-card', {
        mode: 'grid',
        grid: { gridColumn: 3, gridRow: 3, columnSpan: 3, rowSpan: 1 },
      }, { title: 'Operational Speed', value: '99.98%', change: '+0.1%', trend: 'up', icon: '⚡' }),
      // KPI 2
      createComponentInstance('stat-card', {
        mode: 'grid',
        grid: { gridColumn: 6, gridRow: 3, columnSpan: 3, rowSpan: 1 },
      }, { title: 'Active Connections', value: '14,290', change: '+18.3%', trend: 'up', icon: '🌐' }),
      // KPI 3
      createComponentInstance('stat-card', {
        mode: 'grid',
        grid: { gridColumn: 9, gridRow: 3, columnSpan: 4, rowSpan: 1 },
      }, { title: 'Error Rate', value: '0.02%', change: '-0.01%', trend: 'down', icon: '🛡️' }),
      // Chart
      createComponentInstance('chart', {
        mode: 'grid',
        grid: { gridColumn: 3, gridRow: 4, columnSpan: 6, rowSpan: 4 },
      }, { title: 'Performance Trends', chartType: 'bar' }),
      // Table
      createComponentInstance('table', {
        mode: 'grid',
        grid: { gridColumn: 9, gridRow: 4, columnSpan: 4, rowSpan: 4 },
      }, { striped: true }),
    ],
  })

  return {
    title: 'Generated Dashboard',
    explanation: `Constructed a comprehensive 12-column dashboard layout containing navigation, KPI cards, analytics chart, and real-time data table tailored to "${prompt}".`,
    operations: {
      pageName: 'AI Dashboard',
      frame,
    },
  }
}
