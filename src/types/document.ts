// ============================================================
// DOCUMENT MODEL — Core Types
// Interactive UI Prototyping IDE
// ============================================================

// ─────────────────────────────────────────
// Layout Types
// ─────────────────────────────────────────

export type LayoutMode = 'freeform' | 'grid' | 'auto'

export interface GridConfig {
  columns: number
  rows: number
  columnGap: number
  rowGap: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  snap: boolean
  autoPlace: boolean
  showGrid: boolean
}

export interface AutoLayoutConfig {
  direction: 'horizontal' | 'vertical'
  gap: number
  padding: {
    top: number
    right: number
    bottom: number
    left: number
  }
  alignment: 'start' | 'center' | 'end' | 'stretch'
  wrap: boolean
}

// ─────────────────────────────────────────
// Component Layout Position
// ─────────────────────────────────────────

export interface FreeformLayout {
  x: number
  y: number
  width: number
  height: number
  rotation?: number
}

export interface GridLayout {
  gridColumn: number
  gridRow: number
  columnSpan: number
  rowSpan: number
}

export type ComponentLayout =
  | { mode: 'freeform'; freeform: FreeformLayout }
  | { mode: 'grid'; grid: GridLayout }
  | { mode: 'auto' }

// ─────────────────────────────────────────
// Interaction System
// ─────────────────────────────────────────

export type TriggerType =
  | 'click'
  | 'hover'
  | 'press'
  | 'scroll'
  | 'load'
  | 'delay'
  | 'drag'
  | 'keyboard'

export type ActionType =
  | 'navigate'
  | 'open-overlay'
  | 'close-overlay'
  | 'toggle'
  | 'change-state'
  | 'run-action'
  | 'external-url'
  | 'play-animation'

export interface Interaction {
  id: string
  trigger: TriggerType
  action: ActionType
  target?: string          // page id, overlay id, etc.
  params?: Record<string, unknown>
}

// ─────────────────────────────────────────
// Component Instance
// ─────────────────────────────────────────

export interface ComponentInstance {
  id: string
  componentType: string    // references ComponentDefinition.type
  name?: string

  props: Record<string, unknown>

  layout: ComponentLayout

  state?: string           // active state name (e.g. 'hover', 'disabled')

  interactions: Interaction[]

  motion?: import('./motion').MotionConfig

  children?: ComponentInstance[]  // for container/slot components
}

// ─────────────────────────────────────────
// Frame
// ─────────────────────────────────────────

export type DeviceType =
  | 'iphone'
  | 'ipad'
  | 'android'
  | 'laptop'
  | 'desktop'
  | 'browser'
  | 'custom'

export interface Frame {
  id: string
  name: string

  width: number
  height: number
  deviceType: DeviceType

  background: string

  layoutMode: LayoutMode
  grid?: GridConfig
  autoLayout?: AutoLayoutConfig

  children: ComponentInstance[]
}

// ─────────────────────────────────────────
// Page
// ─────────────────────────────────────────

export interface Page {
  id: string
  name: string
  frames: Frame[]
}

// ─────────────────────────────────────────
// Shared Component (Global Component Definition)
// ─────────────────────────────────────────

export interface SharedComponent {
  id: string
  name: string
  description?: string

  // The canonical structure of this shared component
  rootInstance: ComponentInstance

  // Named slots that page instances can fill
  slots: string[]

  // Tags for organization
  tags?: string[]
}

// ─────────────────────────────────────────
// Flow (Page Navigation Graph)
// ─────────────────────────────────────────

export interface FlowConnection {
  id: string
  fromPageId: string
  toPageId: string
  label?: string
  interactionId?: string  // the interaction that triggers this
}

export interface Flow {
  connections: FlowConnection[]
}

// ─────────────────────────────────────────
// Mock Data
// ─────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface MockEndpoint {
  id: string
  name: string
  method: HttpMethod
  url: string
  delayMs: number
  statusCode: number
  responseBody: unknown
}

// ─────────────────────────────────────────
// Asset
// ─────────────────────────────────────────

export type AssetType = 'image' | 'icon' | 'font' | 'video' | 'audio'

export interface Asset {
  id: string
  name: string
  type: AssetType
  url: string
}

// ─────────────────────────────────────────
// Project (Root Document)
// ─────────────────────────────────────────

export interface ProjectSettings {
  name: string
  description?: string
  defaultDeviceType: DeviceType
  version: string
  createdAt: string
  updatedAt: string
}

export interface Project {
  id: string
  settings: ProjectSettings

  pages: Page[]
  sharedComponents: SharedComponent[]
  assets: Asset[]
  mockEndpoints: MockEndpoint[]
  flow: Flow
}
