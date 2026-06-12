'use client'

import { useRef, ReactNode } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, prefersReducedMotion } from '@/lib/animation/gsap'

interface MarqueeProps {
  children: ReactNode
  className?: string
  /** Pixels per seconde */
  speed?: number
  /** Richting: 1 = naar links, -1 = naar rechts */
  direction?: 1 | -1
  /** Pauzeer bij hover */
  pauseOnHover?: boolean
}

/** Oneindige marquee — content wordt 2x gerenderd en naadloos geloopt. */
export default function Marquee({
  children,
  className = '',
  speed = 60,
  direction = 1,
  pauseOnHover = true,
}: MarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const wrap = wrapRef.current
      if (!wrap) return
      const track = wrap.querySelector<HTMLElement>('[data-marquee-track]')
      if (!track) return

      if (prefersReducedMotion()) return

      const half = track.scrollWidth / 2
      const tween = gsap.to(track, {
        x: -half * direction,
        duration: half / speed,
        ease: 'none',
        repeat: -1,
        // naadloos wrappen
        modifiers: {
          x: (x) => `${gsap.utils.wrap(-half, 0, parseFloat(x))}px`,
        },
      })

      const onEnter = () => gsap.to(tween, { timeScale: 0.15, duration: 0.5 })
      const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.5 })
      if (pauseOnHover) {
        wrap.addEventListener('mouseenter', onEnter)
        wrap.addEventListener('mouseleave', onLeave)
      }
      return () => {
        wrap.removeEventListener('mouseenter', onEnter)
        wrap.removeEventListener('mouseleave', onLeave)
        tween.kill()
      }
    },
    { scope: wrapRef }
  )

  return (
    <div ref={wrapRef} className={`overflow-hidden ${className}`}>
      <div data-marquee-track className="flex w-max will-change-transform">
        {children}
        {children}
      </div>
    </div>
  )
}
