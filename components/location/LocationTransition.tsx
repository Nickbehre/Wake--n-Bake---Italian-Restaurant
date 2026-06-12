'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { MapPin } from 'lucide-react'
import type Lenis from 'lenis'
import { useLocation } from '@/lib/context/LocationContext'
import { useLanguage } from '@/lib/context/LanguageContext'
import { getLocation } from '@/lib/data/locations'
import { MOTION_EASE } from '@/lib/animation/gsap'

const COVER_HOLD_MS = 1100 // hoe lang de bestemming leesbaar blijft

/**
 * De cinematografische locatie-switch: twee full-screen panelen
 * (accentkleur van de bestemming + espresso) vegen van boven naar
 * binnen, presenteren de bestemming (naam, adres, 'andere locatie'),
 * de site-context swapt achter de overlay, en de panelen vegen door
 * naar beneden weg — één doorlopende beweging, geen harde swap.
 */
export default function LocationTransition() {
  const { phase, pendingId, location, commitSwitch, finishSwitch } =
    useLocation()
  const { t } = useLanguage()
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Bestemming blijft stabiel gedurende de hele transitie
  const dest = pendingId ? getLocation(pendingId) : location
  const isActive = phase !== 'idle'
  const isRevealing = phase === 'revealing' || phase === 'switching'

  // Scroll-lock tijdens de transitie
  useEffect(() => {
    const lenis = (window as unknown as { __wnbLenis?: Lenis }).__wnbLenis
    if (isActive) lenis?.stop()
    else lenis?.start()
  }, [isActive])

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current)
    }
  }, [])

  if (!isActive) return null

  const onCovered = () => {
    holdTimer.current = setTimeout(() => {
      // Achter de overlay: naar boven scrollen zodat je bij de
      // nieuwe locatie 'aankomt' bij de hero
      const lenis = (window as unknown as { __wnbLenis?: Lenis }).__wnbLenis
      if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
      window.scrollTo(0, 0)
      commitSwitch()
    }, COVER_HOLD_MS)
  }

  const panelTransition = (delay: number) => ({
    duration: 0.75,
    ease: MOTION_EASE.inOut,
    delay,
  })

  return (
    <div
      className="fixed inset-0 z-[200]"
      role="status"
      aria-live="polite"
      aria-label={`${t('loc.transition.welcome')} ${dest.name}`}
    >
      {/* Paneel 1 — accentkleur van de bestemming */}
      <motion.div
        className="absolute inset-0"
        style={{ backgroundColor: dest.accent.hex }}
        initial={{ y: '-100%' }}
        animate={{ y: isRevealing ? '100%' : '0%' }}
        transition={panelTransition(isRevealing ? 0.1 : 0)}
      />

      {/* Paneel 2 — espresso, met de bestemming-presentatie */}
      <motion.div
        className="absolute inset-0 bg-espresso flex items-center justify-center overflow-hidden"
        initial={{ y: '-100%' }}
        animate={{ y: isRevealing ? '100%' : '0%' }}
        transition={panelTransition(isRevealing ? 0 : 0.09)}
        onAnimationComplete={() => {
          if (phase === 'covering') onCovered()
          if (phase === 'revealing') finishSwitch()
        }}
      >
        {/* Reusachtige watermerk-naam op de achtergrond */}
        <span
          aria-hidden
          className="absolute font-brand-sm text-[28vw] leading-none opacity-[0.06] select-none whitespace-nowrap"
        >
          {dest.id === 'express' ? 'Express' : 'Panificio'}
        </span>

        <motion.div
          className="relative flex flex-col items-center text-center px-6"
          initial="hidden"
          animate={isRevealing ? 'exit' : 'visible'}
          variants={{
            visible: { transition: { staggerChildren: 0.08, delayChildren: 0.45 } },
            exit: { transition: { staggerChildren: 0.03 } },
          }}
        >
          {/* Logo-stempel */}
          <motion.img
            src="/assets/logo.png"
            alt=""
            className="w-24 h-24 md:w-32 md:h-32 object-contain mb-6 drop-shadow-2xl"
            variants={{
              hidden: { scale: 0.4, opacity: 0, rotate: -12 },
              visible: {
                scale: 1,
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.7, ease: MOTION_EASE.spring },
              },
              exit: { opacity: 0, y: -24, transition: { duration: 0.3 } },
            }}
          />

          {/* 'Andere locatie' badge */}
          <motion.div
            className="flex items-center gap-2 mb-4"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: MOTION_EASE.out } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-oswald uppercase tracking-[0.2em] text-xs md:text-sm text-espresso"
              style={{ backgroundColor: dest.accent.hex, color: '#F9F7F2' }}
            >
              <MapPin className="w-3.5 h-3.5" />
              {t('loc.badge.otherLocation')}
            </span>
            {dest.isNew && (
              <span className="inline-block px-3 py-1.5 rounded-full bg-crust text-espresso font-oswald font-bold uppercase tracking-[0.2em] text-xs md:text-sm rotate-2">
                {t('loc.badge.new')}
              </span>
            )}
          </motion.div>

          {/* Welkom bij */}
          <motion.span
            className="font-stamp text-xl md:text-2xl mb-2"
            style={{ color: '#F9F7F2' }}
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: MOTION_EASE.out } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
            }}
          >
            {t('loc.transition.welcome')}
          </motion.span>

          {/* Naam van het filiaal */}
          <motion.h2
            className="font-brand text-5xl md:text-7xl lg:text-8xl mb-5"
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: MOTION_EASE.out } },
              exit: { opacity: 0, y: -24, transition: { duration: 0.3 } },
            }}
          >
            {dest.id === 'express' ? "Wake n' Bake Express" : "Wake n' Bake"}
          </motion.h2>

          {/* Adres */}
          <motion.p
            className="font-oswald uppercase tracking-[0.25em] text-sm md:text-base text-white/80"
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: MOTION_EASE.out } },
              exit: { opacity: 0, y: -16, transition: { duration: 0.3 } },
            }}
          >
            {dest.address.street} · {dest.address.area}, {dest.address.city}
          </motion.p>

          {/* Accentlijn die uittekent */}
          <motion.div
            className="h-[3px] rounded-full mt-6"
            style={{ backgroundColor: dest.accent.hex }}
            variants={{
              hidden: { width: 0, opacity: 0 },
              visible: {
                width: 96,
                opacity: 1,
                transition: { duration: 0.7, ease: MOTION_EASE.inOut },
              },
              exit: { opacity: 0, transition: { duration: 0.25 } },
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
