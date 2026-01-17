'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useCart } from '@/lib/context/CartContext'
import type { MenuItem } from '@/lib/data/menu'

interface MenuCardProps {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addItem, updateQuantity, getItemQuantity } = useCart()
  const quantity = getItemQuantity(item.id)

  const tagVariants: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    populair: 'primary',
    nieuw: 'primary',
    "chef's keuze": 'secondary',
    vegetarisch: 'success',
    glutenvrij: 'success',
    deal: 'warning',
    favoriet: 'warning',
  }

  const handleAddToOrder = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem(item)
  }

  const handleQuantityChange = (e: React.MouseEvent, delta: number) => {
    e.stopPropagation()
    updateQuantity(item.id, quantity + delta)
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
          <div className="text-xs text-espresso/60 mb-4">
            <span className="font-semibold">Allergenen:</span>{' '}
            {item.allergens.join(', ')}
          </div>
        )}

        {/* Add to Order Button / Quantity Selector */}
        {quantity === 0 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAddToOrder}
            className="w-full bg-tomato text-white py-3 font-oswald font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors"
          >
            Add to Order
          </motion.button>
        ) : (
          <div className="flex items-center justify-center gap-4 bg-espresso/5 py-2 px-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleQuantityChange(e, -1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
            >
              <Minus className="w-5 h-5" />
            </motion.button>
            <span className="font-oswald text-2xl font-bold text-espresso w-8 text-center">
              {quantity}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => handleQuantityChange(e, 1)}
              className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  )
}
