'use client'

import { motion } from 'framer-motion'
import GalleryGrid from '@/components/gallery/GalleryGrid'
import { useLanguage } from '@/lib/context/LanguageContext'
import { Instagram } from 'lucide-react'

const galleryImages = [
  { src: '/assets/gallery/2025-10-06-WakenBake-002.jpg', alt: 'Wake N\' Bake Panificio', title: 'Wake N\' Bake', width: 1200, height: 800 },
  { src: '/assets/gallery/IMG_0973.jpeg', alt: 'Verse Schiacciata', title: 'Schiacciata', width: 800, height: 1000 },
  { src: '/assets/gallery/IMG_1130.jpeg', alt: 'Heerlijke Italiaanse broodjes', title: 'Panini', width: 1000, height: 800 },
  { src: '/assets/gallery/IMG_1131.jpeg', alt: 'Vers uit de oven', title: 'Vers Gebakken', width: 1080, height: 1350 },
  { src: '/assets/gallery/IMG_1132.jpeg', alt: 'Authentieke Italiaanse smaak', title: 'Authentiek Italiaans', width: 1200, height: 800 },
  { src: '/assets/gallery/IMG_1133.jpeg', alt: 'Rijkelijk belegd', title: 'Rijkelijk Belegd', width: 900, height: 1200 },
  { src: '/assets/gallery/IMG_1498.jpeg', alt: 'Onze specialiteiten', title: 'Specialiteiten', width: 1000, height: 1000 },
  { src: '/assets/gallery/IMG_1500.jpeg', alt: 'Dagelijks vers bereid', title: 'Dagelijks Vers', width: 800, height: 1000 },
  { src: '/assets/gallery/IMG_2280.jpeg', alt: 'In onze bakkerij', title: 'De Bakkerij', width: 1200, height: 900 },
  { src: '/assets/gallery/IMG_2781.jpeg', alt: 'Met liefde gemaakt', title: 'Met Liefde Gemaakt', width: 750, height: 1000 },
  { src: '/assets/gallery/IMG_3065.jpeg', alt: 'Verse ingrediënten', title: 'Verse Ingrediënten', width: 1000, height: 750 },
  { src: '/assets/gallery/IMG_3088.jpeg', alt: 'Ambachtelijk bereid', title: 'Ambachtelijk', width: 1080, height: 1350 },
  { src: '/assets/gallery/IMG_8268.jpeg', alt: 'Italiaanse tradities', title: 'Italiaanse Tradities', width: 1000, height: 1000 },
  { src: '/assets/gallery/IMG_8353.jpeg', alt: 'Ons assortiment', title: 'Assortiment', width: 1200, height: 800 },
  { src: '/assets/gallery/IMG_8406.jpeg', alt: 'Heerlijke creaties', title: 'Creaties', width: 900, height: 1200 },
  { src: '/assets/gallery/IMG_9032.jpeg', alt: 'Schiacciata close-up', title: 'Schiacciata Detail', width: 1000, height: 1000 },
  { src: '/assets/gallery/IMG_9033.jpeg', alt: 'Klaar om te serveren', title: 'Klaar om te Serveren', width: 800, height: 1200 },
]

export default function GalleryPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour">
      {/* Hero Section */}
      <section className="relative pt-36 md:pt-44 pb-20 bg-espresso text-white overflow-hidden rounded-b-[3rem]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-4 md:mt-8"
          >
            <h1 className="font-stamp text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('gallery.title')}
            </h1>
            <p className="font-lato text-xl text-white/80 max-w-2xl mx-auto">
              {t('gallery.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <GalleryGrid images={galleryImages} />
        </div>
      </section>

      {/* Instagram CTA — floating box */}
      <section className="py-16 bg-espresso text-white text-center rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl mb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="font-lato text-xl text-white/80 mb-6">
              {t('gallery.instagramCta')}
            </p>
            <a
              href="https://www.instagram.com/wakenbake.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
            >
              <Instagram className="w-5 h-5" />
              @wakenbake.nl
              <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
