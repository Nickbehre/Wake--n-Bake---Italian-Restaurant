'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap, prefersReducedMotion } from '@/lib/animation/gsap'

/**
 * Cursor-follower: een accent-dot met een tragere ring eromheen.
 * Groeit op links/knoppen ([data-cursor="link"], a, button).
 * Alleen op fine-pointer desktops; de native cursor blijft zichtbaar.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(pointer: fine)').matches) return
    setEnabled(true)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power2.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power2.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    let visible = false
    const onMove = (e: MouseEvent) => {
      if (!visible) {
        visible = true
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.3 })
      }
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
    }

    const isInteractive = (target: EventTarget | null) =>
      target instanceof Element &&
      !!target.closest('a, button, [data-cursor="link"], [role="button"]')

    const onOver = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        gsap.to(ring, { scale: 1.8, duration: 0.35, ease: 'power3.out' })
        gsap.to(dot, { scale: 0.5, duration: 0.35, ease: 'power3.out' })
      }
    }
    const onOut = (e: MouseEvent) => {
      if (isInteractive(e.target)) {
        gsap.to(ring, { scale: 1, duration: 0.35, ease: 'power3.out' })
        gsap.to(dot, { scale: 1, duration: 0.35, ease: 'power3.out' })
      }
    }
    const onLeaveWindow = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3 })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    document.documentElement.addEventListener('mouseleave', onLeaveWindow)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
      document.documentElement.removeEventListener('mouseleave', onLeaveWindow)
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[400]" aria-hidden>
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border-2 border-accent/70 will-change-transform"
      />
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-accent will-change-transform"
      />
    </div>
  )
}
