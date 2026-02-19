'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Minus, Plus, ShoppingBag, Check, Flame, Leaf, Nut } from 'lucide-react';
import type { Product, ProductExtra } from '@/lib/types/order';
import { useCartStore, type SelectedExtra } from '@/lib/store/cart-store';
import { useLanguage } from '@/lib/context/LanguageContext';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

function getProductTags(description: string): string[] {
  const tags: string[] = [];
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes('vegetarisch') || lowerDesc.includes('vegetarian')) tags.push('vegetarisch');
  if (lowerDesc.includes('vegan')) tags.push('vegan');
  if (lowerDesc.includes('pittig') || lowerDesc.includes('spicy')) tags.push('pittig');
  if (lowerDesc.includes('bevat noten') || lowerDesc.includes('contains nuts')) tags.push('noten');
  return tags;
}

function cleanDescription(description: string): string {
  return description
    .replace(/Vegetarisch en Bevat Noten/gi, '')
    .replace(/Vegetarisch/gi, '')
    .replace(/Vegan en Bevat Noten/gi, '')
    .replace(/Vegan/gi, '')
    .replace(/Pittig/gi, '')
    .replace(/Bevat Noten/gi, '')
    .replace(/\.\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function ProductDetailModal({ product, isOpen, onClose }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large'>('regular');
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, updateQuantity, items } = useCartStore();
  const { t } = useLanguage();

  // Reset state when product changes
  useEffect(() => {
    if (isOpen) {
      setSelectedSize('regular');
      setSelectedExtras(new Set());
      setIsAdded(false);
    }
  }, [isOpen, product?.id]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!product) return null;

  const tags = getProductTags(product.description);
  const cleanedDescription = cleanDescription(product.description);
  const hasSizes = product.hasSizes && product.priceRegular && product.priceLarge;
  const hasExtras = product.availableExtras && product.availableExtras.length > 0;

  const basePrice = hasSizes
    ? (selectedSize === 'regular' ? product.priceRegular! : product.priceLarge!)
    : product.price;

  const extrasTotal = hasExtras
    ? product.availableExtras!.filter(e => selectedExtras.has(e.id)).reduce((sum, e) => sum + e.price, 0)
    : 0;

  const currentPrice = basePrice + extrasTotal;

  const extrasSuffix = selectedExtras.size > 0
    ? '-' + Array.from(selectedExtras).sort().join('-')
    : '';
  const cartItemId = hasSizes
    ? `${product.id}-${selectedSize}${extrasSuffix}`
    : `${product.id}${extrasSuffix}`;
  const cartItem = items.find((item) => item.id === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  const toggleExtra = (extraId: string) => {
    setSelectedExtras(prev => {
      const next = new Set(prev);
      if (next.has(extraId)) {
        next.delete(extraId);
      } else {
        next.add(extraId);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    const extras: SelectedExtra[] = hasExtras
      ? product.availableExtras!.filter(e => selectedExtras.has(e.id)).map(e => ({ id: e.id, name: e.name, price: e.price }))
      : [];

    addItem({
      id: cartItemId,
      productId: product.id,
      name: hasSizes ? `${product.name} (${selectedSize === 'regular' ? 'Regular' : 'Large'})` : product.name,
      size: hasSizes ? selectedSize : null,
      price: basePrice,
      extras: extras.length > 0 ? extras : undefined,
      quantity: 1,
      image: product.image,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, quantityInCart + 1);
    } else {
      handleAddToCart();
    }
  };

  const handleDecrement = () => {
    if (cartItem && quantityInCart > 0) {
      updateQuantity(cartItem.id, quantityInCart - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 z-20 w-10 h-10 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-colors"
            >
              <X className="w-5 h-5 text-espresso" />
            </button>

            {/* Product image */}
            {product.image && (
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 512px) 100vw, 512px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Tags on image */}
                {tags.length > 0 && (
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    {tags.includes('vegetarisch') && (
                      <span className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Vegetarisch">
                        <Leaf className="w-4.5 h-4.5 text-green-600" />
                      </span>
                    )}
                    {tags.includes('vegan') && (
                      <span className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Vegan">
                        <Leaf className="w-4.5 h-4.5 text-emerald-600" />
                      </span>
                    )}
                    {tags.includes('pittig') && (
                      <span className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Pittig / Spicy">
                        <Flame className="w-4.5 h-4.5 text-red-500" />
                      </span>
                    )}
                    {tags.includes('noten') && (
                      <span className="w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Bevat Noten / Contains Nuts">
                        <Nut className="w-4.5 h-4.5 text-amber-600" />
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              {/* Name */}
              <h2 className="font-oswald font-bold text-2xl md:text-3xl text-espresso uppercase tracking-wide mb-3">
                {product.name}
              </h2>

              {/* Full description */}
              {cleanedDescription && (
                <p className="font-lato text-base text-espresso/70 leading-relaxed mb-6">
                  {cleanedDescription}
                </p>
              )}

              {/* Size selector */}
              {hasSizes && (
                <div className="mb-6">
                  <p className="font-oswald font-bold text-sm uppercase tracking-wider text-espresso/60 mb-3">
                    {t('menuPage.chooseSize') || 'Choose size'}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setSelectedSize('regular')}
                      className={`py-4 rounded-xl font-oswald font-bold text-base uppercase tracking-wide transition-all border-2 ${
                        selectedSize === 'regular'
                          ? 'bg-crust text-white border-crust shadow-md scale-[1.02]'
                          : 'bg-white text-espresso/70 border-espresso/10 hover:border-crust/30'
                      }`}
                    >
                      <span className="block text-lg">Regular</span>
                      <span className={`block text-sm mt-0.5 ${selectedSize === 'regular' ? 'text-white/80' : 'text-crust'}`}>
                        &euro;{product.priceRegular!.toFixed(2)}
                      </span>
                    </button>
                    <button
                      onClick={() => setSelectedSize('large')}
                      className={`py-4 rounded-xl font-oswald font-bold text-base uppercase tracking-wide transition-all border-2 ${
                        selectedSize === 'large'
                          ? 'bg-crust text-white border-crust shadow-md scale-[1.02]'
                          : 'bg-white text-espresso/70 border-espresso/10 hover:border-crust/30'
                      }`}
                    >
                      <span className="block text-lg">Large</span>
                      <span className={`block text-sm mt-0.5 ${selectedSize === 'large' ? 'text-white/80' : 'text-crust'}`}>
                        &euro;{product.priceLarge!.toFixed(2)}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Price display (for non-size products) */}
              {!hasSizes && (
                <div className="mb-6">
                  <span className="font-oswald text-3xl font-bold text-crust">
                    &euro;{product.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Extras selector */}
              {hasExtras && (
                <div className="mb-6">
                  <p className="font-oswald font-bold text-sm uppercase tracking-wider text-espresso/60 mb-3">
                    Extras
                  </p>
                  <div className="space-y-2">
                    {product.availableExtras!.map((extra) => (
                      <button
                        key={extra.id}
                        onClick={() => toggleExtra(extra.id)}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-oswald text-sm uppercase tracking-wide transition-all border-2 ${
                          selectedExtras.has(extra.id)
                            ? 'bg-crust/5 text-espresso border-crust shadow-sm'
                            : 'bg-white text-espresso/70 border-espresso/10 hover:border-crust/30'
                        }`}
                      >
                        <span className="font-bold">{extra.name}</span>
                        <span className={selectedExtras.has(extra.id) ? 'text-crust font-bold' : 'text-espresso/50'}>
                          +&euro;{extra.price.toFixed(2)}
                        </span>
                      </button>
                    ))}
                  </div>
                  {extrasTotal > 0 && (
                    <p className="font-oswald text-sm text-crust font-bold mt-2 text-right">
                      Total: &euro;{currentPrice.toFixed(2)}
                    </p>
                  )}
                </div>
              )}

              {/* Add to cart */}
              <div className="pt-4 border-t border-espresso/10">
                {quantityInCart === 0 ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={`w-full py-4 rounded-xl font-oswald font-bold text-lg uppercase tracking-wide flex items-center justify-center gap-3 transition-all ${
                      isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-tomato text-white hover:bg-red-700'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-5 h-5" />
                        {t('menuPage.added')}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        {t('menuPage.addToOrder')} — &euro;{currentPrice.toFixed(2)}{extrasTotal > 0 && ` (incl. extras)`}
                      </>
                    )}
                  </motion.button>
                ) : (
                  <div className="flex items-center justify-between bg-espresso/5 rounded-xl p-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleDecrement}
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                    >
                      <Minus className="w-5 h-5" />
                    </motion.button>
                    <span className="font-oswald text-2xl font-bold text-espresso px-4">
                      {quantityInCart}
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleIncrement}
                      className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
