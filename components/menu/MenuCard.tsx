'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Minus, ShoppingBag } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useCartStore, type ItemSize } from '@/lib/store/cart-store'
import { useLanguage } from '@/lib/context/LanguageContext'
import type { MenuItem } from '@/lib/data/menu'

interface MenuCardProps {
  item: MenuItem
}

export default function MenuCard({ item }: MenuCardProps) {
  const { addItem, updateQuantity, items } = useCartStore()
  const { language } = useLanguage()
  const [selectedSize, setSelectedSize] = useState<ItemSize>(item.hasSizes ? 'regular' : null)

  const description = language === 'en' && item.descriptionEN ? item.descriptionEN : item.description

  // Generate unique cart ID based on product + size
  const getCartId = (size: ItemSize) => {
    return size ? `${item.id}-${size}` : item.id
  }

  // Find items in cart for this product (could be multiple sizes)
  const regularInCart = items.find((i) => i.id === getCartId('regular'))
  const largeInCart = items.find((i) => i.id === getCartId('large'))
  const noSizeInCart = items.find((i) => i.id === item.id && !item.hasSizes)

  const regularQty = regularInCart?.quantity || 0
  const largeQty = largeInCart?.quantity || 0
  const noSizeQty = noSizeInCart?.quantity || 0

  // Current price based on selected size
  const getCurrentPrice = (): number => {
    if (!item.hasSizes) {
      return parseFloat(item.price.replace('€', '').replace(',', '.').trim()) || 0
    }
    return selectedSize === 'large' ? (item.priceLarge || 0) : (item.priceRegular || 0)
  }

  const tagVariants: Record<string, 'primary' | 'secondary' | 'success' | 'warning'> = {
    populair: 'primary',
    nieuw: 'primary',
    "chef's keuze": 'secondary',
    vegetarisch: 'success',
    glutenvrij: 'success',
    deal: 'warning',
    favoriet: 'warning',
    vegan: 'success',
  }

  const handleAddToOrder = (e: React.MouseEvent) => {
    e.stopPropagation()
    const price = getCurrentPrice()
    const cartId = getCartId(selectedSize)
    const sizeLabel = selectedSize === 'large'
      ? (language === 'en' ? 'Large' : 'Groot')
      : selectedSize === 'regular'
        ? (language === 'en' ? 'Regular' : 'Klein')
        : undefined

    addItem({
      id: cartId,
      productId: item.id,
      name: item.name,
      size: selectedSize,
      sizeLabel,
      price,
      quantity: 1,
      image: item.image
    })
  }

  const handleQuantityChange = (e: React.MouseEvent, size: ItemSize, delta: number) => {
    e.stopPropagation()
    const cartId = getCartId(size)
    const currentQty = size === 'large' ? largeQty : size === 'regular' ? regularQty : noSizeQty
    updateQuantity(cartId, currentQty + delta)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden group cursor-pointer transition-all duration-300 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="absolute top-3 right-3 flex flex-col gap-1.5">
            {item.tags.map((tag) => (
              <Badge key={tag} variant={tagVariants[tag] || 'primary'}>
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-oswald font-bold text-lg text-espresso group-hover:text-crust transition-colors uppercase tracking-wide">
            {item.name}
          </h3>
        </div>

        <p className="text-espresso/70 text-sm mb-3 leading-relaxed flex-1">
          {description}
        </p>

        {/* Allergens */}
        {item.allergens.length > 0 && (
          <div className="text-xs text-espresso/50 mb-4">
            <span className="font-semibold">{language === 'en' ? 'Allergens:' : 'Allergenen:'}</span>{' '}
            {item.allergens.join(', ')}
          </div>
        )}

        {/* Size Selection for items with sizes */}
        {item.hasSizes && (
          <div className="mb-4">
            <p className="text-xs text-espresso/60 uppercase tracking-wider mb-2 font-oswald">
              {language === 'en' ? 'Choose size' : 'Kies formaat'}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {/* Regular Size */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSize('regular')
                }}
                className={`relative py-3 px-3 rounded border-2 transition-all duration-200 ${
                  selectedSize === 'regular'
                    ? 'border-crust bg-crust/10 shadow-sm'
                    : 'border-gray-200 hover:border-crust/50'
                }`}
              >
                <div className="text-xs font-oswald uppercase text-espresso/70">
                  {language === 'en' ? 'Regular' : 'Klein'}
                </div>
                <div className="font-oswald font-bold text-lg text-espresso">
                  €{item.priceRegular?.toFixed(2)}
                </div>
                {regularQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tomato text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {regularQty}
                  </span>
                )}
              </button>

              {/* Large Size */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedSize('large')
                }}
                className={`relative py-3 px-3 rounded border-2 transition-all duration-200 ${
                  selectedSize === 'large'
                    ? 'border-crust bg-crust/10 shadow-sm'
                    : 'border-gray-200 hover:border-crust/50'
                }`}
              >
                <div className="text-xs font-oswald uppercase text-espresso/70">
                  {language === 'en' ? 'Large' : 'Groot'}
                </div>
                <div className="font-oswald font-bold text-lg text-espresso">
                  €{item.priceLarge?.toFixed(2)}
                </div>
                {largeQty > 0 && (
                  <span className="absolute -top-2 -right-2 bg-tomato text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {largeQty}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Price for non-sized items */}
        {!item.hasSizes && (
          <div className="mb-4">
            <span className="font-oswald text-2xl text-crust font-bold">
              {item.price}
            </span>
          </div>
        )}

        {/* Add to Order Button */}
        {item.hasSizes ? (
          // For sized items - show add button for selected size, or quantity controls if in cart
          <>
            {((selectedSize === 'regular' && regularQty === 0) || (selectedSize === 'large' && largeQty === 0)) ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToOrder}
                className="w-full bg-tomato text-white py-3 font-oswald font-bold uppercase tracking-wide hover:bg-red-700 transition-colors flex items-center justify-center gap-2 rounded"
              >
                <ShoppingBag className="w-4 h-4" />
                {language === 'en' ? 'Add to Order' : 'Toevoegen'}
              </motion.button>
            ) : (
              <div className="flex items-center justify-center gap-4 bg-espresso/5 py-2 px-4 rounded">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleQuantityChange(e, selectedSize, -1)}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="font-oswald text-xl font-bold text-espresso w-6 text-center">
                  {selectedSize === 'large' ? largeQty : regularQty}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleQuantityChange(e, selectedSize, 1)}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </>
        ) : (
          // For non-sized items - simpler logic
          <>
            {noSizeQty === 0 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToOrder}
                className="w-full bg-tomato text-white py-3 font-oswald font-bold uppercase tracking-wide hover:bg-red-700 transition-colors flex items-center justify-center gap-2 rounded"
              >
                <ShoppingBag className="w-4 h-4" />
                {language === 'en' ? 'Add to Order' : 'Toevoegen'}
              </motion.button>
            ) : (
              <div className="flex items-center justify-center gap-4 bg-espresso/5 py-2 px-4 rounded">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleQuantityChange(e, null, -1)}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </motion.button>
                <span className="font-oswald text-xl font-bold text-espresso w-6 text-center">
                  {noSizeQty}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => handleQuantityChange(e, null, 1)}
                  className="w-9 h-9 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>
            )}
          </>
        )}
      </div>
    </motion.div>
  )
}
