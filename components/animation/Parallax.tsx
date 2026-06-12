'use client'

import { useRef, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/animation/gsap'

interface ParallaxProps {
  children: ReactNode
  className?: string
  /**
   * Snelheid: positief beweegt langzamer (achtergrond),
   * negatief sneller (voorgrond). Bereik ±1 ≈ ±20% verschuiving.
   */
  speed?: number
}

/** Scrub-parallax op transform — alleen GPU-properties. */
export default function Parallax({
  children,
  className = '',
  speed = 0.5,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (prefersReducedMotion() || !ref.current) return
      gsap.fromTo(
        ref.current,
        { yPercent: speed * 10 },
        {
          yPercent: speed * -10,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      )
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
