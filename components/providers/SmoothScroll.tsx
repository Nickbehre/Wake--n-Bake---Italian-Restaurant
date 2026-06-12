'use client'

import { ReactNode, useEffect } from 'react'
import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/animation/gsap'

/**
 * Lenis smooth/inertia scrolling, gekoppeld aan GSAP's ticker zodat
 * ScrollTrigger en Lenis exact synchroon lopen.
 * - prefers-reduced-motion → native scroll, geen Lenis
 * - elementen met [data-lenis-prevent] (drawers/modals) scrollen native
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (prefersReducedMotion()) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    })

    lenis.on('scroll', ScrollTrigger.update)

    // Globaal beschikbaar voor o.a. de locatie-transitie (scroll-lock)
    ;(window as unknown as { __wnbLenis?: Lenis }).__wnbLenis = lenis

    const raf = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    // Ankerlinks (bv. categorie-navigatie op de orderpagina) via Lenis
    const onAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const el = document.querySelector(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el as HTMLElement, { offset: -120 })
      }
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(raf)
      lenis.destroy()
      delete (window as unknown as { __wnbLenis?: Lenis }).__wnbLenis
    }
  }, [])

  return <>{children}</>
}
