'use client'

import { motion } from 'framer-motion'
import MenuCard from './MenuCard'
import type { MenuCategory as MenuCategoryType } from '@/lib/data/menu'
import { useLanguage } from '@/lib/context/LanguageContext'

interface MenuCategoryProps {
  category: MenuCategoryType
}

export default function MenuCategory({ category }: MenuCategoryProps) {
  const { language } = useLanguage()

  const categoryName = language === 'en' && category.nameEN ? category.nameEN : category.name
  const categoryDescription = language === 'en' && category.descriptionEN ? category.descriptionEN : category.description

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      id={category.id}
    >
      <div className="mb-8">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-espresso mb-2">
          {categoryName}
        </h2>
        <p className="text-espresso/70 text-lg">{categoryDescription}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </motion.section>
  )
}
