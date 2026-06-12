'use client'

import { useRef, ElementType, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, EASE, prefersReducedMotion } from '@/lib/animation/gsap'

interface SplitTextRevealProps {
  children: ReactNode
  as?: ElementType
  className?: string
  /** 'lines' | 'words' | 'chars' */
  type?: 'lines' | 'words' | 'chars'
  delay?: number
  stagger?: number
  duration?: number
  /** Animeer direct bij mount i.p.v. on-scroll (voor hero's) */
  immediate?: boolean
  /** ScrollTrigger start, default 'top 85%' */
  start?: string
}

/**
 * Tekst die per regel/woord/letter uit een mask omhoog rolt.
 * GSAP SplitText met mask-optie; wacht op fonts zodat regels
 * correct gesplitst worden. Reduced motion → simpele fade.
 *
 * NB: de animatie wordt ná fonts.ready (async) aangemaakt en
 * daarom via contextSafe geregistreerd, zodat useGSAP alles
 * netjes revert bij unmount (geen stale ScrollTriggers).
 */
export default function SplitTextReveal({
  children,
  as: Tag = 'div',
  className = '',
  type = 'lines',
  delay = 0,
  stagger,
  duration = 1.1,
  immediate = false,
  start = 'top 85%',
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current
      if (!el) return

      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 })
        return
      }

      let split: SplitText | null = null
      let cancelled = false

      const run = contextSafe!(() => {
        if (cancelled || !ref.current) return

        split = new SplitText(el, {
          type,
          mask: type,
          linesClass: 'split-line',
        })

        const targets =
          type === 'lines'
            ? split.lines
            : type === 'words'
              ? split.words
              : split.chars

        gsap.set(el, { autoAlpha: 1 })
        gsap.fromTo(
          targets,
          { yPercent: 115, rotate: type === 'chars' ? 6 : 2 },
          {
            yPercent: 0,
            rotate: 0,
            duration,
            delay,
            ease: EASE.out,
            stagger:
              stagger ?? (type === 'lines' ? 0.12 : type === 'words' ? 0.04 : 0.018),
            ...(immediate
              ? {}
              : {
                  scrollTrigger: {
                    trigger: el,
                    start,
                    once: true,
                  },
                }),
          }
        )
      })

      document.fonts.ready.then(run)

      return () => {
        cancelled = true
        split?.revert()
      }
    },
    { scope: ref }
  )

  return (
    // Onzichtbaar tot de animatie start om FOUC te voorkomen
    <Tag ref={ref} className={className} style={{ visibility: 'hidden' }}>
      {children}
    </Tag>
  )
}
