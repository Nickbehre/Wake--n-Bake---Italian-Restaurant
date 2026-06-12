'use client'

import { useRef, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/animation/gsap'

interface MagneticProps {
  children: ReactNode
  className?: string
  /** Hoe sterk het element naar de cursor trekt (0–1) */
  strength?: number
}

/**
 * Magnetic wrapper: het kind beweegt richting de cursor en veert
 * elastisch terug. Alleen actief op fine-pointer devices.
 */
export default function Magnetic({
  children,
  className = '',
  strength = 0.35,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = ref.current
      if (!el) return
      if (prefersReducedMotion()) return
      if (!window.matchMedia('(pointer: fine)').matches) return

      const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect()
        const relX = e.clientX - (rect.left + rect.width / 2)
        const relY = e.clientY - (rect.top + rect.height / 2)
        xTo(relX * strength)
        yTo(relY * strength)
      }
      const onLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' })
      }

      el.addEventListener('mousemove', onMove)
      el.addEventListener('mouseleave', onLeave)
      return () => {
        el.removeEventListener('mousemove', onMove)
        el.removeEventListener('mouseleave', onLeave)
      }
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={`inline-block ${className}`}>
      {children}
    </div>
  )
}
