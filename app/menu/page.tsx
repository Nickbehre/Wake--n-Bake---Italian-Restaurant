'use client'

import MenuCategory from '@/components/menu/MenuCategory'
import MenuPDFButton from '@/components/menu/MenuPDFButton'
import { menuData } from '@/lib/data/menu'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function MenuPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6 text-espresso">
            {t('menuPage.title')}
          </h1>
          <p className="text-xl text-espresso/80 max-w-2xl mx-auto">
            {t('menuPage.subtitle')}
          </p>
        </div>

        {/* Category Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 mb-16">
          {menuData.categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="px-6 py-2 bg-white shadow-md font-montserrat font-semibold text-espresso hover:bg-crust hover:text-espresso transition-colors"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {/* Menu Categories */}
        <div className="space-y-20">
          {menuData.categories.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}
        </div>

        {/* Allergen Info */}
        <div className="mt-20 p-8 bg-mortadella/20 text-center">
          <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
            {t('menuPage.allergenTitle')}
          </h3>
          <p className="text-espresso/80 max-w-2xl mx-auto">
            {t('menuPage.allergenText')}
          </p>
        </div>

        {/* Download Menu Button */}
        <div className="mt-16 text-center">
          <MenuPDFButton />
        </div>
      </div>
    </div>
  )
}
