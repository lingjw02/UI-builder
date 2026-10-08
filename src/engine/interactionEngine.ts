// ============================================================
// INTERACTION ENGINE
// Executes interactions: trigger → action → effect
//
// This engine is used in BOTH:
//   - Preview Mode (full execution)
//   - Design Mode (visual interaction editing only, no execution)
//
// Interactions are stored on ComponentInstance.interactions[]
// and processed here against the current document model.
// ============================================================

import type { Interaction, TriggerType, ActionType } from '../types'

// ─────────────────────────────────────────
// Runtime Context
// (provided by the Prototype Runtime)
// ─────────────────────────────────────────

export interface RuntimeContext {
  /** Navigate to a page by ID */
  navigateTo: (pageId: string) => void
  /** Open an overlay (modal/drawer) component */
  openOverlay: (componentId: string) => void
  /** Close an overlay */
  closeOverlay: (componentId: string) => void
  /** Toggle a component's visibility or state */
  toggle: (componentId: string) => void
  /** Change a component's state */
  changeState: (frameId: string, componentId: string, stateName: string) => void
  /** Play an animation */
  playAnimation: (componentId: string, animationId: string) => void
  /** Navigate to an external URL */
  openExternalUrl: (url: string) => void
  /** Run a custom action (mock API, etc.) */
  runAction: (actionId: string) => Promise<void>
}

// ─────────────────────────────────────────
// Interaction Executor
// ─────────────────────────────────────────

export class InteractionExecutor {
  private context: RuntimeContext

  constructor(context: RuntimeContext) {
    this.context = context
  }

  /**
   * Execute a single interaction given its trigger has fired.
   */
  async execute(interaction: Interaction): Promise<void> {
    const { action, target, params } = interaction

    switch (action as ActionType) {
      case 'navigate':
        if (target) this.context.navigateTo(target)
        break

      case 'open-overlay':
        if (target) this.context.openOverlay(target)
        break

      case 'close-overlay':
        if (target) this.context.closeOverlay(target)
        break

      case 'toggle':
        if (target) this.context.toggle(target)
        break

      case 'change-state':
        if (target && params?.frameId && params?.stateName) {
          this.context.changeState(
            params.frameId as string,
            target,
            params.stateName as string
          )
        }
        break

      case 'play-animation':
        if (target && params?.animationId) {
          this.context.playAnimation(target, params.animationId as string)
        }
        break

      case 'external-url':
        if (target) this.context.openExternalUrl(target)
        break

      case 'run-action':
        if (target) await this.context.runAction(target)
        break

      default:
        console.warn('[InteractionEngine] Unknown action:', action)
    }
  }

  /**
   * Execute all interactions on a component that match the given trigger.
   */
  async fire(
    trigger: TriggerType,
    interactions: Interaction[]
  ): Promise<void> {
    const matching = interactions.filter(i => i.trigger === trigger)
    await Promise.all(matching.map(i => this.execute(i)))
  }
}

// ─────────────────────────────────────────
// Interaction Builder Helpers
// (used by the UI to create new interactions)
// ─────────────────────name───────────────

import { v4 as uuidv4 } from 'uuid'

export function createInteraction(
  trigger: TriggerType,
  action: ActionType,
  target?: string,
  params?: Record<string, unknown>
): Interaction {
  return { id: uuidv4(), trigger, action, target, params }
}

// ─────────────────────────────────────────
// Trigger display labels
// ─────────────────────────────────────────

export const TRIGGER_LABELS: Record<TriggerType, string> = {
  click: 'On Click',
  hover: 'On Hover',
  press: 'On Press',
  scroll: 'On Scroll',
  load: 'On Load',
  delay: 'After Delay',
  drag: 'On Drag',
  keyboard: 'On Key Press',
}

export const ACTION_LABELS: Record<ActionType, string> = {
  navigate: 'Navigate to Page',
  'open-overlay': 'Open Overlay',
  'close-overlay': 'Close Overlay',
  toggle: 'Toggle Visibility',
  'change-state': 'Change State',
  'run-action': 'Run Action',
  'external-url': 'Open URL',
  'play-animation': 'Play Animation',
}
