'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Heart, Wheat, Award, Users, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

// Gallery images for the story slideshow
const storyImages = [
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

export default function AboutPage() {
  const { t } = useLanguage()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % storyImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + storyImages.length) % storyImages.length)
  }

  const values = [
    {
      icon: Wheat,
      titleKey: 'about.valueQuality',
      descKey: 'about.valueQualityDesc',
    },
    {
      icon: Heart,
      titleKey: 'about.valuePassion',
      descKey: 'about.valuePassionDesc',
    },
    {
      icon: Award,
      titleKey: 'about.valueAuthenticity',
      descKey: 'about.valueAuthenticityDesc',
    },
    {
      icon: Users,
      titleKey: 'about.valueCommunity',
      descKey: 'about.valueCommunityDesc',
    },
  ]

  return (
    <div className="min-h-screen bg-flour">
      {/* Hero Section */}
      <section className="relative pt-36 md:pt-44 pb-20 bg-espresso text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mt-4 md:mt-8">
            <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6">
              {t('about.heroTitle')}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              {t('about.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section with Clickable Slideshow */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Clickable Image Slideshow */}
            <div className="relative h-[500px] group">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={storyImages[currentImageIndex]}
                    alt="Wake N' Bake Panificio"
                    fill
                    className="object-cover rounded-lg"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-espresso" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100 z-10"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-espresso" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {storyImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'bg-crust w-6'
                        : 'bg-white/70 hover:bg-white'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Image Counter */}
              <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-oswald">
                {currentImageIndex + 1} / {storyImages.length}
              </div>
            </div>

            {/* Story Text */}
            <div>
              <h2 className="font-montserrat font-bold text-4xl mb-6 text-espresso">
                {t('about.storyTitle')}
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>{t('about.storyP1')}</p>
                <p>{t('about.storyP2')}</p>
                <p>{t('about.storyP3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-crust/20">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl text-center mb-16 text-espresso">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.titleKey}
                className="bg-flour p-8 text-center group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-block p-4 bg-crust/20 rounded-full mb-6 group-hover:bg-crust/30 transition-colors">
                  <value.icon className="w-8 h-8 text-crust" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
                  {t(value.titleKey)}
                </h3>
                <p className="text-espresso/80">{t(value.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-montserrat font-bold text-4xl mb-6 text-espresso">
                {t('about.teamTitle')}
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>{t('about.teamP1')}</p>
                <p>{t('about.teamP2')}</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-tomato hover:bg-tomato/90 text-white font-montserrat font-bold px-8 py-4 transition-all duration-300 transform hover:scale-105"
              >
                {t('about.workWithUs')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative h-[400px] order-1 lg:order-2">
              <Image
                src="/assets/gallery/IMG_2280.jpeg"
                alt="Ons team aan het werk in de bakkerij"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-espresso text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl mb-6">
            {t('about.ctaTitle')}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('about.ctaText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-crust hover:bg-crust/90 text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300 transform hover:scale-105"
            >
              {t('about.viewMenu')}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300"
            >
              {t('about.visitUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
