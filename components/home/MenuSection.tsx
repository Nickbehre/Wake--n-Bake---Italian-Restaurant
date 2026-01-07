'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import Link from 'next/link'
import { ArrowRight, Leaf, Fish } from 'lucide-react'

interface MenuItem {
  name: string
  ingredients: string
  priceRegular: string
  priceLarge: string
}

interface MenuCategory {
  id: string
  nameKey: string
  icon: React.ReactNode
  items: MenuItem[]
}

const menuCategories: MenuCategory[] = [
  {
    id: 'pork',
    nameKey: 'menu.category.pork',
    icon: <span className="text-2xl">🐷</span>,
    items: [
      {
        name: 'Mortadella Original',
        ingredients: 'Fresh burrata, Pistachio mortadella, Pistachio pesto, Crumbled pistachios, EVO',
        priceRegular: '€8',
        priceLarge: '€12',
      },
      {
        name: 'Etna',
        ingredients: 'Calabrese hot salame, Caramelised red onions, Roasted peppers, Sweet gorgonzola creme, Rocket',
        priceRegular: '€9',
        priceLarge: '€13',
      },
      {
        name: 'Porchetta',
        ingredients: 'Roasted pork, Thinly sliced potatoes, Caramelised red onions, Choice of cheese or crème',
        priceRegular: '€11',
        priceLarge: '€15',
      },
    ],
  },
  {
    id: 'beef',
    nameKey: 'menu.category.beef',
    icon: <Fish className="w-6 h-6 text-tomato" />,
    items: [
      {
        name: 'Vitello Tonnato',
        ingredients: 'Thinly sliced beef, Tuna sauce, Capers, Rocket, EVO',
        priceRegular: '€9',
        priceLarge: '€13',
      },
      {
        name: 'Roastbeef Truffle',
        ingredients: 'Roastbeef, Black truffle mayo, Smoked provola, EVO',
        priceRegular: '€11',
        priceLarge: '€15',
      },
    ],
  },
  {
    id: 'vegetarian',
    nameKey: 'menu.category.vegetarian',
    icon: <Leaf className="w-6 h-6 text-pistachio" />,
    items: [
      {
        name: 'Caprese',
        ingredients: 'Buffalo mozzarella, Homemade basil pesto, Tomatoes',
        priceRegular: '€8',
        priceLarge: '€12',
      },
      {
        name: 'Gialla',
        ingredients: 'Yellow tomatoes, Burrata, Red peppers, Balsamic glaze',
        priceRegular: '€9',
        priceLarge: '€13',
      },
    ],
  },
]

export default function MenuSection() {
  const { t } = useLanguage()
  const [activeCategory, setActiveCategory] = useState('pork')
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const activeItems = menuCategories.find((cat) => cat.id === activeCategory)?.items || []

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
          <span className="inline-block text-crust font-oswald font-bold text-sm tracking-[0.3em] uppercase mb-4">
            Schiacciata
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

        {/* Menu Board Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-4xl mx-auto"
        >
          {/* Wooden frame effect */}
          <div className="relative bg-[#FDF8F0] rounded-sm shadow-2xl border-8 border-[#8B6914]/30">
            {/* Inner shadow for depth */}
            <div className="absolute inset-0 shadow-inner pointer-events-none" />

            {/* Paper texture inside */}
            <div className="relative p-8 md:p-12">
              {/* Price Header */}
              <div className="flex justify-end gap-8 pr-4 mb-6 border-b-2 border-dashed border-espresso/20 pb-4">
                <span className="font-oswald font-bold text-sm text-espresso/60 uppercase tracking-wider w-16 text-center">
                  {t('menu.regular')}
                </span>
                <span className="font-oswald font-bold text-sm text-espresso/60 uppercase tracking-wider w-16 text-center">
                  {t('menu.large')}
                </span>
              </div>

              {/* Menu Items */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {activeItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-espresso/10 last:border-b-0">
                        <div className="flex-1">
                          {/* Item name with decorative dot leader */}
                          <div className="flex items-baseline gap-2">
                            <h3 className="font-oswald font-bold text-xl md:text-2xl text-espresso group-hover:text-tomato transition-colors uppercase tracking-wide">
                              {item.name}
                            </h3>
                            <span className="hidden md:block flex-1 border-b-2 border-dotted border-espresso/20 mx-2" />
                          </div>
                          <p className="text-espresso/60 font-lato text-sm md:text-base mt-2 leading-relaxed italic">
                            {item.ingredients}
                          </p>
                        </div>
                        {/* Prices */}
                        <div className="flex items-center gap-8 flex-shrink-0">
                          <div className="w-16 text-center">
                            <span className="font-playfair text-xl md:text-2xl font-bold text-espresso">
                              {item.priceRegular}
                            </span>
                          </div>
                          <div className="w-16 text-center">
                            <span className="font-playfair text-xl md:text-2xl font-bold text-crust">
                              {item.priceLarge}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {/* Decorative stamp/badge */}
              <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-20 h-20 md:w-24 md:h-24 bg-tomato rounded-full flex items-center justify-center transform rotate-12 shadow-lg">
                <span className="font-oswald font-bold text-white text-center text-xs md:text-sm uppercase leading-tight">
                  100%<br />Italiano
                </span>
              </div>
            </div>
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
