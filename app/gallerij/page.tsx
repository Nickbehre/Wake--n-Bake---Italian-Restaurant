'use client'

import GalleryGrid from '@/components/gallery/GalleryGrid'
import { useLanguage } from '@/lib/context/LanguageContext'

const galleryImages = [
  {
    src: '/assets/gallery/2025-10-06-WakenBake-002.jpg',
    alt: 'Wake N\' Bake Panificio',
    title: 'Wake N\' Bake',
  },
  {
    src: '/assets/gallery/IMG_0973.jpeg',
    alt: 'Verse Schiacciata',
    title: 'Schiacciata',
  },
  {
    src: '/assets/gallery/IMG_1130.jpeg',
    alt: 'Heerlijke Italiaanse broodjes',
    title: 'Panini',
  },
  {
    src: '/assets/gallery/IMG_1131.jpeg',
    alt: 'Vers uit de oven',
    title: 'Vers Gebakken',
  },
  {
    src: '/assets/gallery/IMG_1132.jpeg',
    alt: 'Authentieke Italiaanse smaak',
    title: 'Authentiek Italiaans',
  },
  {
    src: '/assets/gallery/IMG_1133.jpeg',
    alt: 'Rijkelijk belegd',
    title: 'Rijkelijk Belegd',
  },
  {
    src: '/assets/gallery/IMG_1498.jpeg',
    alt: 'Onze specialiteiten',
    title: 'Specialiteiten',
  },
  {
    src: '/assets/gallery/IMG_1500.jpeg',
    alt: 'Dagelijks vers bereid',
    title: 'Dagelijks Vers',
  },
  {
    src: '/assets/gallery/IMG_2280.jpeg',
    alt: 'In onze bakkerij',
    title: 'De Bakkerij',
  },
  {
    src: '/assets/gallery/IMG_2781.jpeg',
    alt: 'Met liefde gemaakt',
    title: 'Met Liefde Gemaakt',
  },
  {
    src: '/assets/gallery/IMG_3065.jpeg',
    alt: 'Verse ingrediënten',
    title: 'Verse Ingrediënten',
  },
  {
    src: '/assets/gallery/IMG_3088.jpeg',
    alt: 'Ambachtelijk bereid',
    title: 'Ambachtelijk',
  },
  {
    src: '/assets/gallery/IMG_8268.jpeg',
    alt: 'Italiaanse tradities',
    title: 'Italiaanse Tradities',
  },
  {
    src: '/assets/gallery/IMG_8353.jpeg',
    alt: 'Ons assortiment',
    title: 'Assortiment',
  },
  {
    src: '/assets/gallery/IMG_8406.jpeg',
    alt: 'Heerlijke creaties',
    title: 'Creaties',
  },
  {
    src: '/assets/gallery/IMG_9032.jpeg',
    alt: 'Schiacciata close-up',
    title: 'Schiacciata Detail',
  },
  {
    src: '/assets/gallery/IMG_9033.jpeg',
    alt: 'Klaar om te serveren',
    title: 'Klaar om te Serveren',
  },
]

export default function GalleryPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour pt-36 md:pt-44 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 mt-4 md:mt-8">
          <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6 text-espresso">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-espresso/80 max-w-2xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </div>

        <GalleryGrid images={galleryImages} />

        {/* Instagram CTA */}
        <div className="mt-16 text-center">
          <p className="text-espresso/80 mb-4">
            {t('gallery.instagramCta')}
          </p>
          <a
            href="https://www.instagram.com/wakenbake.nl/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-montserrat font-bold px-8 py-4 transition-all duration-300 transform hover:scale-105"
          >
            @wakenbake.nl
          </a>
        </div>
      </div>
    </div>
  )
}
