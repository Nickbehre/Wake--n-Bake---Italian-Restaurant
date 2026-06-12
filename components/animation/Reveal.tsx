'use client'

import { useRef, ElementType, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, EASE, prefersReducedMotion } from '@/lib/animation/gsap'

interface RevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Verticale offset in px */
  y?: number
  delay?: number
  duration?: number
  /** Clip-path reveal van onder naar boven (mooi voor afbeeldingen) */
  clip?: boolean
  /** Subtiele scale-in (afbeeldingen: 1.15 → 1) */
  scale?: number
  start?: string
  stagger?: number
  /** Animeer de directe children gestaggerd i.p.v. de wrapper */
  staggerChildren?: boolean
}

/** Generieke scroll-triggered reveal op transform/opacity (GPU-vriendelijk). */
export default function Reveal({
  children,
  as: Tag = 'div',
  className = '',
  y = 48,
  delay = 0,
  duration = 1,
  clip = false,
  scale,
  start = 'top 85%',
  stagger = 0.1,
  staggerChildren = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      const targets = staggerChildren ? Array.from(el.children) : el

      if (prefersReducedMotion()) {
        gsap.set(targets, { autoAlpha: 1, clearProps: 'all' })
        return
      }

      const from: gsap.TweenVars = { autoAlpha: 0, y }
      const to: gsap.TweenVars = {
        autoAlpha: 1,
        y: 0,
        duration,
        delay,
        ease: EASE.out,
        stagger: staggerChildren ? stagger : 0,
        scrollTrigger: { trigger: el, start, once: true },
      }

      if (clip) {
        from.clipPath = 'inset(100% 0% 0% 0%)'
        to.clipPath = 'inset(0% 0% 0% 0%)'
      }
      if (scale) {
        from.scale = scale
        to.scale = 1
      }

      gsap.fromTo(targets, from, to)
    },
    { scope: ref }
  )

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  )
}
