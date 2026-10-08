// ============================================================
// TEMPLATE ENGINE
// Production prototype templates composed of native document components
// ============================================================

import { v4 as uuidv4 } from 'uuid'
import type { Project, Page, Frame } from '../types'
import { createProject, createPage, createFrame, createComponentInstance } from '../store/projectFactory'

export interface TemplateMetadata {
  id: string
  name: string
  description: string
  category: 'saas' | 'ai' | 'auth' | 'mobile'
  icon: string
  badge: string
}

export const TEMPLATES_METADATA: TemplateMetadata[] = [
  {
    id: 'saas-dashboard',
    name: 'SaaS Analytics Dashboard',
    description: 'Executive dashboard with KPIs, analytics chart, user retention donut, and real-time transaction table.',
    category: 'saas',
    icon: '📊',
    badge: 'Popular',
  },
  {
    id: 'ai-copilot',
    name: 'AI Agent & Copilot Platform',
    description: 'Modern generative AI workspace with chat stream, expandable prompt bar, and agent tool execution cards.',
    category: 'ai',
    icon: '🤖',
    badge: 'AI Powered',
  },
  {
    id: 'auth-admin',
    name: 'Admin Portal & Authentication',
    description: 'Multi-page flow with login gate and comprehensive user management admin console.',
    category: 'auth',
    icon: '🔐',
    badge: 'Multi-Page',
  },
]

/**
 * Creates a SaaS Analytics Dashboard project
 */
export function createSaaSDashboardTemplate(): Project {
  const pageId = uuidv4()
  const frameId = uuidv4()

  const frame: Frame = createFrame({
    id: frameId,
    name: 'Analytics Dashboard',
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
      // Left Sidebar (Col 1-2, Rows 1-8)
      createComponentInstance(
        'sidebar',
        { mode: 'grid', grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 8 } },
        { background: '#181825', width: 220 }
      ),

      // Top Navbar (Col 3-12, Row 1)
      createComponentInstance(
        'navbar',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 1, columnSpan: 10, rowSpan: 1 } },
        { background: '#181825' }
      ),

      // KPI Card 1 (Col 3-5, Row 2)
      createComponentInstance(
        'stat-card',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 2, columnSpan: 3, rowSpan: 1 } },
        { title: 'Gross Revenue', value: '$148,920', change: '+22.4%', trend: 'up', icon: '💰', subtext: 'vs last quarter' }
      ),

      // KPI Card 2 (Col 6-8, Row 2)
      createComponentInstance(
        'stat-card',
        { mode: 'grid', grid: { gridColumn: 6, gridRow: 2, columnSpan: 3, rowSpan: 1 } },
        { title: 'Active Subscriptions', value: '8,419', change: '+12.1%', trend: 'up', icon: '⚡', subtext: '98.2% retention' }
      ),

      // KPI Card 3 (Col 9-10, Row 2)
      createComponentInstance(
        'stat-card',
        { mode: 'grid', grid: { gridColumn: 9, gridRow: 2, columnSpan: 2, rowSpan: 1 } },
        { title: 'Churn Rate', value: '1.4%', change: '-0.3%', trend: 'down', icon: '📉', subtext: 'target < 2%' }
      ),

      // KPI Card 4 (Col 11-12, Row 2)
      createComponentInstance(
        'stat-card',
        { mode: 'grid', grid: { gridColumn: 11, gridRow: 2, columnSpan: 2, rowSpan: 1 } },
        { title: 'Avg. LTV', value: '$1,840', change: '+4.5%', trend: 'up', icon: '👥', subtext: 'per paid account' }
      ),

      // Bar Chart (Col 3-8, Rows 3-5)
      createComponentInstance(
        'chart',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 3, columnSpan: 6, rowSpan: 3 } },
        { title: 'Monthly Recurring Revenue (MRR)', chartType: 'bar' }
      ),

      // Donut Chart (Col 9-12, Rows 3-5)
      createComponentInstance(
        'chart',
        { mode: 'grid', grid: { gridColumn: 9, gridRow: 3, columnSpan: 4, rowSpan: 3 } },
        { title: 'Traffic & Conversion Channels', chartType: 'donut' }
      ),

      // Transactions Table (Col 3-12, Rows 6-8)
      createComponentInstance(
        'table',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 6, columnSpan: 10, rowSpan: 3 } },
        { striped: true }
      ),
    ],
  })

  const page: Page = createPage({
    id: pageId,
    name: 'Overview Dashboard',
    frames: [frame],
  })

  const project = createProject('SaaS Analytics Dashboard')
  project.settings.description = 'Production-ready SaaS analytics dashboard with interactive components.'
  project.pages = [page]
  return project
}

/**
 * Creates an AI Agent & Copilot Studio template
 */
export function createAIAssistantTemplate(): Project {
  const pageId = uuidv4()
  const frameId = uuidv4()

  const frame: Frame = createFrame({
    id: frameId,
    name: 'Copilot Workspace',
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
      // Top Navigation (Col 1-12, Row 1)
      createComponentInstance(
        'navbar',
        { mode: 'grid', grid: { gridColumn: 1, gridRow: 1, columnSpan: 12, rowSpan: 1 } },
        { background: '#181825' }
      ),

      // Left Agent/Model selector (Col 1-3, Rows 2-8)
      createComponentInstance(
        'sidebar',
        { mode: 'grid', grid: { gridColumn: 1, gridRow: 2, columnSpan: 3, rowSpan: 7 } },
        { background: '#181825' }
      ),

      // Main AI Chat Stream (Col 4-8, Rows 2-7)
      createComponentInstance(
        'ai-chat',
        { mode: 'grid', grid: { gridColumn: 4, gridRow: 2, columnSpan: 5, rowSpan: 6 } },
        { title: 'Gemini Assistant', model: 'Gemini 1.5 Pro' }
      ),

      // Tool Call Execution 1 (Col 9-12, Row 2)
      createComponentInstance(
        'agent-tool-call',
        { mode: 'grid', grid: { gridColumn: 9, gridRow: 2, columnSpan: 4, rowSpan: 2 } },
        { toolName: 'query_vector_store', status: 'success' }
      ),

      // Tool Call Execution 2 (Col 9-12, Row 4)
      createComponentInstance(
        'agent-tool-call',
        { mode: 'grid', grid: { gridColumn: 9, gridRow: 4, columnSpan: 4, rowSpan: 2 } },
        { toolName: 'generate_code_artifact', status: 'running' }
      ),

      // Alert Notification (Col 9-12, Row 6)
      createComponentInstance(
        'alert',
        { mode: 'grid', grid: { gridColumn: 9, gridRow: 6, columnSpan: 4, rowSpan: 1 } },
        { title: 'Model Latency', message: 'Context window 128k tokens cached.', variant: 'success' }
      ),

      // Prompt Input Bar (Col 4-12, Row 8)
      createComponentInstance(
        'prompt-input',
        { mode: 'grid', grid: { gridColumn: 4, gridRow: 8, columnSpan: 9, rowSpan: 1 } },
        { placeholder: 'Ask AI copilot to write code, analyze data, or execute tools...' }
      ),
    ],
  })

  const page: Page = createPage({
    id: pageId,
    name: 'AI Agent Studio',
    frames: [frame],
  })

  const project = createProject('AI Agent Studio')
  project.settings.description = 'Conversational agent prototyping environment.'
  project.pages = [page]
  return project
}

/**
 * Creates an Admin Portal with multi-page Auth flow
 */
export function createAuthAdminTemplate(): Project {
  const loginPageId = uuidv4()
  const loginFrameId = uuidv4()
  const adminPageId = uuidv4()
  const adminFrameId = uuidv4()

  // ── Page 1: Login ──
  const loginFrame: Frame = createFrame({
    id: loginFrameId,
    name: 'Sign In',
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
      padding: { top: 40, right: 40, bottom: 40, left: 40 },
      snap: true,
      autoPlace: false,
      showGrid: true,
    },
    children: [
      // Centered Card Container (Col 5-8, Rows 3-6)
      createComponentInstance(
        'card',
        { mode: 'grid', grid: { gridColumn: 5, gridRow: 3, columnSpan: 4, rowSpan: 4 } },
        { title: 'Sign In to Workspace', description: 'Enter credentials to access the admin portal.' }
      ),
      // Email input
      createComponentInstance(
        'input',
        { mode: 'grid', grid: { gridColumn: 5, gridRow: 4, columnSpan: 4, rowSpan: 1 } },
        { label: 'Email', placeholder: 'admin@acme.com', type: 'email' }
      ),
      // Password input
      createComponentInstance(
        'input',
        { mode: 'grid', grid: { gridColumn: 5, gridRow: 5, columnSpan: 4, rowSpan: 1 } },
        { label: 'Password', placeholder: '••••••••', type: 'password' }
      ),
      // Submit Button with navigation interaction to admin page!
      {
        ...createComponentInstance(
          'button',
          { mode: 'grid', grid: { gridColumn: 5, gridRow: 6, columnSpan: 4, rowSpan: 1 } },
          { label: 'Sign In to Portal', variant: 'primary' }
        ),
        interactions: [
          {
            id: uuidv4(),
            trigger: 'click',
            action: 'navigate',
            target: adminPageId,
          },
        ],
      },
    ],
  })

  // ── Page 2: Admin Portal ──
  const adminFrame: Frame = createFrame({
    id: adminFrameId,
    name: 'Admin Console',
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
      createComponentInstance(
        'sidebar',
        { mode: 'grid', grid: { gridColumn: 1, gridRow: 1, columnSpan: 2, rowSpan: 8 } },
        { background: '#181825' }
      ),
      // Navbar
      createComponentInstance(
        'navbar',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 1, columnSpan: 10, rowSpan: 1 } },
        { background: '#181825' }
      ),
      // Welcome Alert
      createComponentInstance(
        'alert',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 2, columnSpan: 10, rowSpan: 1 } },
        { title: 'Welcome Admin', message: 'You have full access permissions.', variant: 'success' }
      ),
      // Users Table
      createComponentInstance(
        'table',
        { mode: 'grid', grid: { gridColumn: 3, gridRow: 3, columnSpan: 10, rowSpan: 5 } },
        { striped: true }
      ),
    ],
  })

  const loginPage = createPage({ id: loginPageId, name: 'Sign In', frames: [loginFrame] })
  const adminPage = createPage({ id: adminPageId, name: 'Admin Console', frames: [adminFrame] })

  const project = createProject('Admin Portal & Auth Flow')
  project.settings.description = 'Authenticated flow from login to admin console.'
  project.pages = [loginPage, adminPage]
  project.flow = {
    connections: [
      {
        id: uuidv4(),
        fromPageId: loginPageId,
        toPageId: adminPageId,
        label: 'Submit Login',
      },
    ],
  }
  return project
}

/**
 * Instantiates a template by ID
 */
export function loadTemplateProject(templateId: string): Project {
  switch (templateId) {
    case 'saas-dashboard':
      return createSaaSDashboardTemplate()
    case 'ai-copilot':
      return createAIAssistantTemplate()
    case 'auth-admin':
      return createAuthAdminTemplate()
    default:
      return createSaaSDashboardTemplate()
  }
}
