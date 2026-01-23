'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronDown, Bike, Store } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

const UBER_EATS_URL = 'https://www.order.store/nl/store/wake-n-bake-panificio/xon7rL6IRMqMdtpdlRryxg'

// Hero images from gallery that rotate continuously
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
          {/* Brand Logo Image - absolutely positioned to not affect layout */}
          <div className="relative h-40 md:h-56 lg:h-64 mb-4 overflow-hidden">
            <img
              src="/assets/logo-text.png"
              alt="Wake n' Bake"
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] md:h-[400px] lg:h-[500px] w-auto drop-shadow-2xl pointer-events-none object-contain"
            />
          </div>
          <p className="font-stamp text-3xl md:text-5xl mb-8 drop-shadow-lg relative z-10">
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
          {/* Delivery - Uber Eats */}
          <a
            href={UBER_EATS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 bg-black hover:bg-gray-800 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-lg"
          >
            <Bike className="w-5 h-5 group-hover:animate-bounce" />
            {t('hero.cta.delivery')}
          </a>

          {/* Takeaway - Click & Collect */}
          <Link
            href="/menu"
            className="group flex items-center gap-3 bg-tomato hover:bg-red-700 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl rounded-lg"
          >
            <Store className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
            {t('hero.cta.takeaway')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-[3%] left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-white text-xs font-oswald tracking-widest uppercase drop-shadow-lg">
            Scroll
          </span>
          <ChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
        </motion.div>
      </motion.div>

    </section>
  )
}
