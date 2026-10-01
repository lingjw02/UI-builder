// ============================================================
// MOTION ENGINE — Phase 13
// Generates CSS keyframe rules, transitions, and spring physics
// Architecture Rule D: Runtime uses the same motion model as editor
// ============================================================

import type { MotionConfig, AnimationEasing } from '../types'

/**
 * Returns CSS properties for a given MotionConfig
 */
export function getMotionStyles(motion?: MotionConfig): React.CSSProperties {
  if (!motion) return {}

  const durationSec = `${(motion.duration || 300) / 1000}s`
  const delaySec = `${(motion.delay || 0) / 1000}s`
  const timingFn = getTimingFunction(motion.easing)
  const iteration = motion.repeat === 'infinite' ? 'infinite' : (motion.repeat || 1)
  const dir = motion.direction || 'normal'

  return {
    animationName: `proto-${motion.preset}`,
    animationDuration: durationSec,
    animationDelay: delaySec,
    animationTimingFunction: timingFn,
    animationIterationCount: iteration,
    animationDirection: dir,
    animationFillMode: 'both',
  }
}

/**
 * Converts easing curve or spring to CSS timing function
 */
export function getTimingFunction(easing: AnimationEasing): string {
  switch (easing) {
    case 'linear': return 'linear'
    case 'ease': return 'ease'
    case 'ease-in': return 'cubic-bezier(0.4, 0, 1, 1)'
    case 'ease-out': return 'cubic-bezier(0, 0, 0.2, 1)'
    case 'ease-in-out': return 'cubic-bezier(0.4, 0, 0.2, 1)'
    case 'spring': return 'cubic-bezier(0.175, 0.885, 0.32, 1.275)' // bouncy cubic-bezier
    default: return 'ease'
  }
}

/**
 * Global CSS Keyframe rules injected for all motion presets
 */
export const MOTION_KEYFRAME_CSS = `
@keyframes proto-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes proto-fade-out {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes proto-slide-up {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes proto-slide-down {
  from { opacity: 0; transform: translateY(-24px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes proto-slide-left {
  from { opacity: 0; transform: translateX(24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes proto-slide-right {
  from { opacity: 0; transform: translateX(-24px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes proto-scale-in {
  from { opacity: 0; transform: scale(0.85); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes proto-scale-out {
  from { opacity: 1; transform: scale(1); }
  to { opacity: 0; transform: scale(0.85); }
}

@keyframes proto-spring-bounce {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.08); opacity: 1; }
  70% { transform: scale(0.95); }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes proto-blur-in {
  from { filter: blur(12px); opacity: 0; }
  to { filter: blur(0); opacity: 1; }
}

@keyframes proto-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

@keyframes proto-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}

@keyframes proto-marquee {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
`

/**
 * Ensures motion CSS keyframes are mounted in document head
 */
export function ensureMotionStylesMounted(): void {
  if (typeof document === 'undefined') return
  const id = 'ui-builder-motion-keyframes'
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.textContent = MOTION_KEYFRAME_CSS
    document.head.appendChild(style)
  }
}
