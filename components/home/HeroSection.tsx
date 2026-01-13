'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

// Hero images that rotate - all 4 images will continuously cycle
const heroImages = [
  '/assets/hero/hero-1.jpeg',
  '/assets/hero/hero-2.jpeg',
  '/assets/hero/hero-3.jpeg',
  '/assets/hero/hero-4.jpeg',
]

export default function HeroSection() {
  const { t } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(nextImage, 5000) // Change image every 5 seconds
    return () => clearInterval(interval)
  }, [nextImage])

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Rotating Background Images */}
      <div className="absolute inset-0 z-0 bg-espresso">
        {heroImages.map((image, index) => {
          const isActive = index === currentImageIndex
          const prevIndex = currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
          const isPrevious = index === prevIndex
          
          return (
          <motion.div
              key={image}
              initial={{ opacity: index === 0 ? 1 : 0 }}
              animate={{
                opacity: isActive ? 1 : isPrevious ? 0 : 0,
                scale: isActive ? 1 : 1.05,
              }}
              transition={{ 
                duration: 1.5, 
                ease: 'easeInOut',
                opacity: { duration: 1.5 }
              }}
            className="absolute inset-0"
              style={{ 
                zIndex: isActive ? 2 : isPrevious ? 1 : 0,
                pointerEvents: 'none'
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

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-espresso/60 via-espresso/40 to-espresso/70 z-10" />
      </div>

      {/* Image indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? 'bg-crust w-8'
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Brand Name with Lobster font and logo-style shadow */}
          <h1 className="font-brand text-6xl md:text-8xl lg:text-9xl mb-4 tracking-wide">
            Wake <span className="text-4xl md:text-6xl lg:text-7xl">n</span>&apos; Bake
          </h1>
          <p className="font-stamp text-3xl md:text-5xl mb-8 drop-shadow-lg">
            Panificio
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-lato font-light"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link
            href="/menu"
            className="bg-tomato hover:bg-tomato/90 text-white font-oswald font-bold uppercase tracking-wider px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {t('hero.cta.menu')}
          </Link>
          <a
            href="https://www.order.store/nl/store/wake-n-bake-panificio/xon7rL6IRMqMdtpdlRryxg"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-crust hover:bg-crust/90 text-espresso font-oswald font-bold uppercase tracking-wider px-10 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
          >
            {t('hero.cta.order')}
          </a>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white/50 text-xs font-oswald tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="w-8 h-8 text-white/70" />
        </motion.div>
      </motion.div>

      {/* Ripped Paper Edge Transition */}
      <div className="absolute bottom-0 left-0 right-0 z-30">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120V60C20 65 40 50 60 55C80 60 100 45 120 50C140 55 160 40 180 45C200 50 220 35 240 40C260 45 280 30 300 35C320 40 340 25 360 30C380 35 400 20 420 25C440 30 460 15 480 20C500 25 520 10 540 15C560 20 580 5 600 10C620 15 640 0 660 5C680 10 700 0 720 5C740 10 760 0 780 5C800 10 820 0 840 5C860 10 880 0 900 5C920 10 940 0 960 5C980 10 1000 0 1020 5C1040 10 1060 0 1080 5C1100 10 1120 0 1140 5C1160 10 1180 0 1200 5C1220 10 1240 0 1260 5C1280 10 1300 0 1320 5C1340 10 1360 0 1380 5C1400 10 1420 0 1440 5V120H0Z"
            fill="#F9F7F2"
          />
          <path
            d="M0 120V70C20 75 40 60 60 65C80 70 100 55 120 60C140 65 160 50 180 55C200 60 220 45 240 50C260 55 280 40 300 45C320 50 340 35 360 40C380 45 400 30 420 35C440 40 460 25 480 30C500 35 520 20 540 25C560 30 580 15 600 20C620 25 640 10 660 15C680 20 700 10 720 15C740 20 760 10 780 15C800 20 820 10 840 15C860 20 880 10 900 15C920 20 940 10 960 15C980 20 1000 10 1020 15C1040 20 1060 10 1080 15C1100 20 1120 10 1140 15C1160 20 1180 10 1200 15C1220 20 1240 10 1260 15C1280 20 1300 10 1320 15C1340 20 1360 10 1380 15C1400 20 1420 10 1440 15V120H0Z"
            fill="#F9F7F2"
            fillOpacity="0.7"
          />
        </svg>
        {/* Shadow underneath the rip for depth */}
        <div className="absolute -top-4 left-0 right-0 h-8 bg-gradient-to-b from-black/20 to-transparent pointer-events-none" />
      </div>
    </section>
  )
}
