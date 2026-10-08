// ============================================================
// MOTION & ANIMATION TYPES
// Defines animation presets, easing curves, and motion configurations
// ============================================================

export type AnimationPreset =
  | 'fade-in'
  | 'fade-out'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'scale-in'
  | 'scale-out'
  | 'spring-bounce'
  | 'blur-in'
  | 'pulse'
  | 'shake'
  | 'marquee'

export type AnimationEasing =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'

export interface MotionConfig {
  preset: AnimationPreset
  duration: number     // ms (e.g. 300)
  delay: number        // ms (e.g. 0)
  easing: AnimationEasing
  repeat?: number | 'infinite'
  direction?: 'normal' | 'reverse' | 'alternate'
  stagger?: number     // ms for children stagger
}

export const ANIMATION_PRESETS: { id: AnimationPreset; label: string; description: string }[] = [
  { id: 'fade-in', label: 'Fade In', description: 'Smooth opacity transition from 0 to 1' },
  { id: 'fade-out', label: 'Fade Out', description: 'Smooth opacity transition from 1 to 0' },
  { id: 'slide-up', label: 'Slide Up', description: 'Slides in upwards with fade' },
  { id: 'slide-down', label: 'Slide Down', description: 'Slides in downwards with fade' },
  { id: 'slide-left', label: 'Slide Left', description: 'Slides in from right to left' },
  { id: 'slide-right', label: 'Slide Right', description: 'Slides in from left to right' },
  { id: 'scale-in', label: 'Scale In', description: 'Zooms in from 80% to 100%' },
  { id: 'scale-out', label: 'Scale Out', description: 'Zooms out from 100% to 80%' },
  { id: 'spring-bounce', label: 'Spring Bounce', description: 'Playful bouncy spring entrance' },
  { id: 'blur-in', label: 'Blur In', description: 'Clears from blurred to sharp focus' },
  { id: 'pulse', label: 'Pulse', description: 'Gentle repeating scale pulse' },
  { id: 'shake', label: 'Shake', description: 'Subtle attention-grabbing horizontal shake' },
  { id: 'marquee', label: 'Marquee', description: 'Continuous smooth horizontal ticker scroll' },
]
