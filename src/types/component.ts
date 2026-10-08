// ============================================================
// COMPONENT DEFINITION TYPES
// ============================================================

export type ComponentCategory =
  | 'basic-ui'
  | 'navigation'
  | 'content'
  | 'feedback'
  | 'data'
  | 'media'
  | 'authentication'
  | 'ecommerce'
  | 'ai-agent'
  | 'layout'

export type PropType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'color'
  | 'select'
  | 'text'
  | 'image'
  | 'icon'
  | 'array'
  | 'object'

export interface PropOption {
  label: string
  value: string | number | boolean
}

export interface PropDefinition {
  name: string
  label: string
  type: PropType
  defaultValue: unknown
  options?: PropOption[]    // for 'select' type
  required?: boolean
  description?: string
}

export interface StateDefinition {
  name: string
  label: string
  description?: string
  // Style overrides that apply in this state
  styleOverrides?: Record<string, unknown>
}

export interface EventDefinition {
  name: string
  label: string
  description?: string
}

export interface ComponentDefinition {
  type: string              // unique identifier e.g. 'button', 'input'
  name: string              // display name e.g. 'Button'
  category: ComponentCategory
  description?: string
  icon?: string             // icon name or SVG string

  props: PropDefinition[]

  states?: StateDefinition[]

  events?: EventDefinition[]

  // Default layout footprint suggestion
  defaultSize?: {
    width: number
    height: number
  }

  // Whether this component can contain children
  isContainer?: boolean

  // Named slots this component exposes
  slots?: string[]

  // Tags for search
  tags?: string[]
}
