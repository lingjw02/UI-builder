// ============================================================
// COMPONENT REGISTRY — Phase 4
// Maps componentType strings to their ComponentDefinition
// ============================================================

import type { ComponentDefinition } from '../../types'

const registry = new Map<string, ComponentDefinition>()

export function registerComponent(def: ComponentDefinition): void {
  registry.set(def.type, def)
}

export function getComponentDefinition(type: string): ComponentDefinition | undefined {
  return registry.get(type)
}

export function getAllComponentDefinitions(): ComponentDefinition[] {
  return Array.from(registry.values())
}

export function getComponentsByCategory(category: ComponentDefinition['category']): ComponentDefinition[] {
  return getAllComponentDefinitions().filter(d => d.category === category)
}

export function searchComponents(query: string): ComponentDefinition[] {
  const q = query.toLowerCase()
  return getAllComponentDefinitions().filter(d =>
    d.name.toLowerCase().includes(q) ||
    d.description?.toLowerCase().includes(q) ||
    d.tags?.some((t: string) => t.toLowerCase().includes(q))
  )
}
