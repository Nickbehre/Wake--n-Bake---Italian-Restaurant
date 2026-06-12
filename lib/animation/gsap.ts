// ============================================
// Centrale GSAP-setup
// Eén plek voor plugin-registratie en de
// signature-eases van de site. Importeer gsap
// ALTIJD via dit bestand, nooit direct.
// ============================================

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'

let registered = false

if (typeof window !== 'undefined' && !registered) {
  registered = true
  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase)

  // Signature-eases — verzorgde cubic-beziers, geen defaults
  CustomEase.create('wnb.out', '0.16, 1, 0.3, 1') // expo-achtig uitrollen
  CustomEase.create('wnb.inOut', '0.83, 0, 0.17, 1') // cinematische wipe
  CustomEase.create('wnb.soft', '0.25, 0.46, 0.45, 0.94') // zachte reveal
  CustomEase.create('wnb.spring', '0.34, 1.56, 0.64, 1') // subtiele overshoot

  gsap.defaults({ ease: 'wnb.out', duration: 0.9 })
}

/** Ease-namen voor GSAP tweens */
export const EASE = {
  out: 'wnb.out',
  inOut: 'wnb.inOut',
  soft: 'wnb.soft',
  spring: 'wnb.spring',
} as const

/** Dezelfde curves als arrays voor Framer Motion */
export const MOTION_EASE = {
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.83, 0, 0.17, 1] as const,
  soft: [0.25, 0.46, 0.45, 0.94] as const,
  spring: [0.34, 1.56, 0.64, 1] as const,
}

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export { gsap, ScrollTrigger, SplitText }
