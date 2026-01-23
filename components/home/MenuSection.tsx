'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Leaf, Fish } from 'lucide-react'

interface MenuCategory {
  id: string
  nameKey: string
  icon: React.ReactNode
  image: string
}

const menuCategories: MenuCategory[] = [
  {
    id: 'pork',
    nameKey: 'menu.category.pork',
    icon: <span className="text-2xl">🐷</span>,
    image: '/assets/menu/menu-pork.jpg',
  },
  {
    id: 'beef',
    nameKey: 'menu.category.beef',
    icon: <Fish className="w-6 h-6 text-tomato" />,
    image: '/assets/menu/menu-beef-fish.jpg',
  },
  {
    id: 'vegetarian',
    nameKey: 'menu.category.vegetarian',
    icon: <Leaf className="w-6 h-6 text-pistachio" />,
    image: '/assets/menu/menu-veggie.jpg',
  },
]

export default function MenuSection() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('pork')
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const activeMenuImage = menuCategories.find((cat) => cat.id === activeCategory)?.image || ''

  return (
    <section ref={sectionRef} className="py-24 bg-flour relative overflow-hidden">
      {/* Textured paper background */}
      <div className="absolute inset-0">
        {/* Paper texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {/* Subtle wood grain pattern to mimic wooden frames */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              #8B4513 2px,
              #8B4513 4px
            )`,
            backgroundSize: '100px 100%',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('menu.label')}
          </span>
          <h2 className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6">
            {t('menu.headline')}
          </h2>
          <p className="font-lato text-xl text-espresso/70 max-w-2xl mx-auto">
            {t('menu.subheadline')}
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {menuCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 font-oswald font-bold uppercase tracking-wider transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-espresso text-white shadow-lg scale-105'
                  : 'bg-white text-espresso hover:bg-crust/20 shadow-md'
              }`}
            >
              {category.icon}
              <span>{t(category.nameKey)}</span>
            </button>
          ))}
        </motion.div>

        {/* Menu Image Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          {/* Menu Image with shadow */}
          <div className="relative rounded-lg overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[1890/2646]"
              >
                <Image
                  src={activeMenuImage}
                  alt={`${activeCategory} schiacciata menu`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 672px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* View Full Menu CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-tomato hover:bg-tomato/90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 transition-all duration-300 transform hover:scale-105 group"
          >
            {t('menu.viewFull')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
