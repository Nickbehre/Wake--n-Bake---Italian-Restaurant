'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, Trash2, Bike, Store } from 'lucide-react';
import Link from 'next/link';
import { useOrderStore } from '@/lib/store/order-store';
import { useLanguage } from '@/lib/context/LanguageContext';

export default function OrderCartDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { t } = useLanguage();

  const items = useOrderStore((state) => state.items);
  const updateQuantity = useOrderStore((state) => state.updateQuantity);
  const removeItem = useOrderStore((state) => state.removeItem);
  const getCartSummary = useOrderStore((state) => state.getCartSummary);

  const summary = getCartSummary();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  if (summary.itemCount === 0 && !isOpen) {
    return null;
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
          {summary.itemCount} {summary.itemCount === 1 ? t('cart.item') : t('cart.items')}
        </span>
        <span className="font-oswald font-bold">€{summary.total.toFixed(2)}</span>
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
                {t('checkout.orderSummary')}
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
                  <p className="font-lato text-espresso/60">{t('checkoutOptions.emptyCart')}</p>
                  <p className="font-lato text-sm text-espresso/40 mt-2">
                    {t('checkoutOptions.emptyCartText')}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Line Items */}
                  {summary.lineItems.map((lineItem) => {
                    const cartItem = items.find((i) => i.id === lineItem.id);
                    if (!cartItem) return null;

                    return (
                      <motion.div
                        key={lineItem.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        {/* Product Name and Price */}
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1 pr-4">
                            <h3 className="font-montserrat font-semibold text-espresso">
                              {lineItem.productName}
                            </h3>
                            {cartItem.description && (
                              <p className="font-lato text-xs text-espresso/60 mt-1 line-clamp-2">
                                {cartItem.description}
                              </p>
                            )}
                          </div>
                          <span className="font-oswald font-bold text-crust whitespace-nowrap">
                            €{lineItem.unitPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Quantity Controls and Line Total */}
                        <div className="flex items-center justify-between mt-3 pt-3 border-t border-espresso/10">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                updateQuantity(lineItem.id, cartItem.quantity - 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-espresso/10 rounded-full hover:bg-espresso/20 transition-colors"
                            >
                              <Minus className="w-4 h-4 text-espresso" />
                            </button>
                            <span className="font-oswald font-bold text-espresso w-6 text-center">
                              {lineItem.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(lineItem.id, cartItem.quantity + 1)
                              }
                              className="w-8 h-8 flex items-center justify-center bg-espresso/10 rounded-full hover:bg-espresso/20 transition-colors"
                            >
                              <Plus className="w-4 h-4 text-espresso" />
                            </button>
                            <button
                              onClick={() => removeItem(lineItem.id)}
                              className="ml-2 p-2 text-tomato hover:bg-tomato/10 rounded-full transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Line Total */}
                          <span className="font-oswald font-bold text-lg text-espresso">
                            €{lineItem.lineTotal.toFixed(2)}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer with Summary and Checkout Options */}
            {items.length > 0 && (
              <div className="border-t border-espresso/10 p-6 space-y-4">
                {/* Order Summary */}
                <div className="space-y-2 pb-4 border-b border-espresso/10">
                  <div className="flex justify-between text-sm">
                    <span className="font-lato text-espresso/70">
                      {t('checkout.orderSummary')} ({summary.itemCount} {summary.itemCount === 1 ? (t('cart.item') || 'item') : (t('cart.items') || 'items')})
                    </span>
                    <span className="font-oswald text-espresso">
                      €{summary.subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xl text-espresso uppercase tracking-wide">
                    {t('checkout.total')}
                  </span>
                  <span className="font-oswald text-3xl font-bold text-crust">
                    €{summary.total.toFixed(2)}
                  </span>
                </div>

                {/* Checkout Options */}
                <div className="space-y-3 pt-2">
                  {/* Single Checkout Button - Goes to Options Page */}
                  <Link
                    href="/checkout-options"
                    onClick={() => setIsOpen(false)}
                    className="w-full flex items-center justify-center gap-3 bg-tomato text-white text-center py-4 rounded font-oswald text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-colors group shadow-md"
                  >
                    <ShoppingBag className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                    {t('checkoutOptions.continueCheckout')}
                  </Link>
                </div>

                <p className="text-center text-xs text-espresso/50 font-lato mt-2">
                  {t('checkoutOptions.chooseDelivery')}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
