'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Bike, Store, MapPin, Sparkles } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import { gsap, EASE, MOTION_EASE, prefersReducedMotion } from '@/lib/animation/gsap'
import { heroDelay } from '@/lib/animation/preloader-state'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Magnetic from '@/components/animation/Magnetic'

// Hero-afbeeldingen uit de galerij die continu rouleren
const heroImages = [
  '/assets/gallery/2025-10-06-WakenBake-002.jpg',
  '/assets/gallery/IMG_0973.jpeg',
  '/assets/gallery/IMG_1130.jpeg',
  '/assets/gallery/IMG_1131.jpeg',
  '/assets/gallery/IMG_1132.jpeg',
  '/assets/gallery/IMG_1133.jpeg',
  '/assets/gallery/IMG_1498.jpeg',
  '/assets/gallery/IMG_1500.jpeg',
  '/assets/gallery/IMG_2280.jpeg',
  '/assets/gallery/IMG_2781.jpeg',
  '/assets/gallery/IMG_3065.jpeg',
  '/assets/gallery/IMG_3088.jpeg',
  '/assets/gallery/IMG_8268.jpeg',
  '/assets/gallery/IMG_8353.jpeg',
  '/assets/gallery/IMG_8406.jpeg',
  '/assets/gallery/IMG_9032.jpeg',
  '/assets/gallery/IMG_9033.jpeg',
]

export default function HeroSection() {
  const { t } = useLanguage()
  const { location, isExpress } = useLocation()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextImage, 5000)
    return () => clearInterval(interval)
  }, [nextImage])

  // Entrance-choreografie + scroll-parallax
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section) return

      if (prefersReducedMotion()) {
        gsap.set('[data-hero-reveal], [data-hero-edge]', {
          autoAlpha: 1,
          clearProps: 'transform',
        })
        return
      }

      const delay = heroDelay()

      // Entrance: gelaagde reveal (logo → ctas → dots/scroll)
      const tl = gsap.timeline({ delay, defaults: { ease: EASE.out } })
      tl.fromTo(
        '[data-hero-logo]',
        { clipPath: 'inset(100% 0% 0% 0%)', y: 60, autoAlpha: 0 },
        { clipPath: 'inset(0% 0% 0% 0%)', y: 0, autoAlpha: 1, duration: 1.2 }
      )
        .fromTo(
          '[data-hero-chip]',
          { y: 24, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7 },
          0.15
        )
        .fromTo(
          '[data-hero-ctas] [data-hero-reveal]',
          { y: 40, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.1 },
          0.9
        )
        .fromTo(
          '[data-hero-edge]',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8 },
          1.3
        )

      // Scroll: achtergrond zakt langzamer, content lift eruit
      gsap
        .timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
          defaults: { ease: 'none' },
        })
        .to(bgRef.current, { yPercent: 18, scale: 1.08 }, 0)
        .to(contentRef.current, { yPercent: -20, autoAlpha: 0 }, 0)
    },
    { scope: sectionRef }
  )

  const baseDelay = heroDelay()

  return (
    <section
      ref={sectionRef}
      className="relative z-10 h-[100svh] min-h-[640px] flex items-center justify-center overflow-hidden rounded-b-[3rem]"
    >
      {/* Rouleerende achtergrond met Ken Burns-drift */}
      <div ref={bgRef} className="absolute inset-0 z-0 bg-espresso will-change-transform">
        {heroImages.map((image, index) => {
          const isActive = index === currentImageIndex
          const prevIndex =
            currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
          const isPrevious = index === prevIndex

          return (
            <motion.div
              key={image}
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{
                opacity: isActive ? 1 : 0,
                scale: isActive ? 1 : 1.07,
              }}
              transition={{
                opacity: { duration: 1.5, ease: 'easeInOut' },
                scale: { duration: 6, ease: 'linear' },
              }}
              className="absolute inset-0"
              style={{
                zIndex: isActive ? 2 : isPrevious ? 1 : 0,
                pointerEvents: 'none',
              }}
            >
              <Image
                src={image}
                alt={`Wake n' Bake Panificio - Authentiek Italiaans ${index + 1}`}
                fill
                className="object-cover"
                priority={index <= 1}
                quality={90}
                sizes="100vw"
                loading={index <= 1 ? 'eager' : 'lazy'}
              />
            </motion.div>
          )
        })}

        {/* Donkere overlay voor leesbaarheid */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/40 to-espresso/70 z-10" />
      </div>

      {/* Content */}
      <div
        ref={contentRef}
        className="relative z-20 container mx-auto px-4 text-center text-white will-change-transform"
      >
        {/* Locatie-chip — wisselt mee met het filiaal */}
        <div data-hero-reveal data-hero-chip className="invisible flex justify-center mb-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.id}
              initial={{ y: 18, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -18, opacity: 0 }}
              transition={{ duration: 0.45, ease: MOTION_EASE.out }}
              className="inline-flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/25 backdrop-blur-md font-oswald uppercase tracking-[0.2em] text-xs md:text-sm">
                <MapPin className="w-3.5 h-3.5 text-accent" style={{ color: location.accent.hex }} />
                {location.address.street} · {location.address.area}
              </span>
              {isExpress && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-crust text-espresso font-oswald font-bold uppercase tracking-[0.15em] text-xs md:text-sm rotate-2">
                  <Sparkles className="w-3 h-3" />
                  {t('express.hero.badge')}
                </span>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Brand-logo */}
        <div
          data-hero-reveal
          data-hero-logo
          className="invisible relative h-36 md:h-52 lg:h-60 mb-2 overflow-hidden will-change-transform"
        >
          <img
            src="/assets/logo-text.png"
            alt="Wake n' Bake"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[280px] md:h-[380px] lg:h-[470px] w-auto drop-shadow-2xl pointer-events-none object-contain"
          />
          {isExpress && (
            <span className="absolute left-1/2 -translate-x-1/2 bottom-1 font-street text-lg md:text-2xl tracking-[0.5em] text-crust drop-shadow-lg">
              XPRESS
            </span>
          )}
        </div>

        {/* Stamp-tagline — per woord uit een mask */}
        <SplitTextReveal
          as="p"
          type="words"
          immediate
          delay={baseDelay + 0.5}
          className="font-stamp text-2xl md:text-5xl mb-4 md:mb-8 drop-shadow-lg relative z-10"
        >
          come taste the difference
        </SplitTextReveal>

        {/* Tagline — per regel */}
        <SplitTextReveal
          as="p"
          type="lines"
          immediate
          delay={baseDelay + 0.75}
          className="text-lg md:text-2xl mb-6 md:mb-12 max-w-3xl mx-auto font-lato font-light"
        >
          {t('hero.tagline')}
        </SplitTextReveal>

        {/* CTA's */}
        <div
          data-hero-ctas
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {location.thuisbezorgdUrl ? (
            <Magnetic>
              <a
                data-hero-reveal
                href={location.thuisbezorgdUrl}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="invisible group flex items-center gap-3 bg-black hover:bg-gray-800 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-lg transition-colors duration-300 hover:shadow-2xl rounded-full"
              >
                <Bike className="w-5 h-5 group-hover:animate-bounce" />
                {t('hero.cta.delivery')}
              </a>
            </Magnetic>
          ) : (
            <span
              data-hero-reveal
              className="invisible flex items-center gap-3 bg-black/40 text-white/60 font-oswald font-bold uppercase tracking-wider px-8 py-4 text-lg rounded-full cursor-not-allowed"
              title={t('loc.deliverySoon')}
            >
              <Bike className="w-5 h-5" />
              {t('hero.cta.delivery')} · {t('loc.comingSoon')}
            </span>
          )}

          <Magnetic>
            <Link
              data-hero-reveal
              href="/menu"
              data-cursor="link"
              className="invisible group flex items-center gap-3 bg-accent hover:opacity-90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-lg transition-all duration-300 hover:shadow-2xl rounded-full"
            >
              <Store className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
              {t('hero.cta.takeaway')}
            </Link>
          </Magnetic>
        </div>
      </div>

      {/* Foto-indicatoren */}
      <div
        data-hero-edge
        className="invisible absolute bottom-20 md:bottom-28 left-1/2 -translate-x-1/2 z-20 flex gap-2"
      >
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`h-2 box-content bg-clip-content p-1 -m-1 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-crust w-8'
                : 'bg-white/50 hover:bg-white/80 w-2'
            }`}
            aria-label={`Ga naar afbeelding ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll-indicator */}
      <div
        data-hero-edge
        className="invisible absolute bottom-[3%] left-1/2 -translate-x-1/2 z-20 hidden sm:flex"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white text-xs font-oswald tracking-widest uppercase drop-shadow-lg">
            Scroll
          </span>
          <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.div>
      </div>
    </section>
  )
}
