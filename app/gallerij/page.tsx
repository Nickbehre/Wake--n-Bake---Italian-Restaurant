'use client'

import GalleryGrid from '@/components/gallery/GalleryGrid'
import { useLanguage } from '@/lib/context/LanguageContext'

const galleryImages = [
  {
    src: '/assets/gallery/focaccia-01.webp',
    alt: 'Verse focaccia met mortadella en pistachepesto',
    title: 'Focaccia Mortadella',
  },
  {
    src: '/assets/gallery/focaccia-02.webp',
    alt: 'Knapperige focaccia met verse toppings',
    title: 'Focaccia Special',
  },
  {
    src: '/assets/gallery/schiacciata-01.webp',
    alt: 'Schiacciata met prosciutto',
    title: 'Schiacciata Prosciutto',
  },
  {
    src: '/assets/gallery/pizza-slice-01.webp',
    alt: 'Pizza slice met verse ingrediënten',
    title: 'Pizza al Taglio',
  },
  {
    src: '/assets/gallery/interior-01.webp',
    alt: "Interieur van Wake N' Bake Panificio",
    title: 'Onze Bakkerij',
  },
  {
    src: '/assets/gallery/coffee-01.webp',
    alt: 'Perfecte Italiaanse espresso',
    title: 'Espresso',
  },
  {
    src: '/assets/gallery/cornetto-01.webp',
    alt: 'Verse cornetti met cappuccino',
    title: 'Cornetti',
  },
  {
    src: '/assets/gallery/tiramisu-01.webp',
    alt: 'Huisgemaakt tiramisù',
    title: 'Tiramisù',
  },
  {
    src: '/assets/gallery/team-01.webp',
    alt: 'Ons team aan het werk',
    title: 'Ons Team',
  },
]

export default function GalleryPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
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
