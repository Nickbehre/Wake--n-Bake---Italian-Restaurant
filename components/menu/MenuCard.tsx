'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Badge } from '@/components/ui/Badge'
import type { MenuItem } from '@/lib/data/menu'

interface MenuCardProps {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const tagVariants: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    populair: 'primary',
    nieuw: 'primary',
    "chef's keuze": 'secondary',
    vegetarisch: 'success',
    glutenvrij: 'success',
    deal: 'warning',
    favoriet: 'warning',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-none shadow-lg overflow-hidden group cursor-pointer transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant={tagVariants[tag] || 'primary'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-montserrat font-bold text-xl text-espresso group-hover:text-crust transition-colors">
            {item.name}
          </h3>
          <span className="font-playfair text-2xl text-crust font-bold">
            {item.price}
          </span>
        </div>

        <p className="text-espresso/80 mb-4 leading-relaxed">
          {item.description}
        </p>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="text-xs text-espresso/60">
            <span className="font-semibold">Allergenen:</span>{' '}
            {item.allergens.join(', ')}
          </div>
        )}
      </div>
    </motion.div>
  )
}
