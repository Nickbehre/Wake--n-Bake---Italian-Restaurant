'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function CartDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { items, totalItems, totalPrice, updateQuantity, removeItem } = useCart()
  const { t } = useLanguage()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Don't render anything until mounted to avoid hydration mismatch
  if (!isMounted) {
    return null
  }

  // Don't show floating button if cart is empty
  if (totalItems === 0 && !isOpen) {
    return null
  }

  return (
    <>
      {/* Floating Cart Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-tomato text-white px-5 py-3 rounded-full shadow-lg hover:bg-tomato/90 transition-colors"
      >
        <ShoppingBag className="w-5 h-5" />
        <span className="font-oswald font-semibold">
          {totalItems} {totalItems === 1 ? t('cart.item') : t('cart.items')}
        </span>
        <span className="font-oswald font-bold">€{totalPrice.toFixed(2)}</span>
      </motion.button>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-flour z-50 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-espresso/10">
              <h2 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide">
                {t('cart.yourOrder')}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-espresso/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-espresso" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-16 h-16 text-espresso/30 mb-4" />
                  <p className="font-lato text-espresso/60">{t('cart.empty')}</p>
                  <p className="font-lato text-sm text-espresso/40 mt-2">
                    {t('cart.emptySubtext')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 bg-white p-4 rounded-lg shadow-sm"
                    >
                      {/* Item Image */}
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Item Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-montserrat font-semibold text-espresso truncate">
                          {item.name}
                        </h3>
                        <p className="font-oswald text-crust font-bold text-lg">
                          {item.price}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-espresso/10 rounded-full hover:bg-espresso/20 transition-colors"
                          >
                            <Minus className="w-4 h-4 text-espresso" />
                          </button>
                          <span className="font-oswald font-bold text-espresso w-6 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-espresso/10 rounded-full hover:bg-espresso/20 transition-colors"
                          >
                            <Plus className="w-4 h-4 text-espresso" />
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-auto p-2 text-tomato hover:bg-tomato/10 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {items.length > 0 && (
              <div className="border-t border-espresso/10 p-6 space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xl text-espresso uppercase tracking-wide">
                    {t('cart.total')}
                  </span>
                  <span className="font-oswald text-3xl font-bold text-crust">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-tomato text-white text-center py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors"
                >
                  {t('cart.checkout')}
                </Link>

                <p className="text-center text-xs text-espresso/50 font-lato">
                  {t('cart.clickCollect')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
