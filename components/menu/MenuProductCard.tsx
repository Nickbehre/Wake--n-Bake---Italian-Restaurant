'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Flame, Leaf, Nut, Plus, Minus, ShoppingBag, Check } from 'lucide-react';
import type { Product, ProductExtra } from '@/lib/types/order';
import { useCartStore, type SelectedExtra } from '@/lib/store/cart-store';
import { useLanguage } from '@/lib/context/LanguageContext';

interface MenuProductCardProps {
  product: Product;
  index: number;
  onProductClick?: (product: Product) => void;
}

function getProductTags(description: string): string[] {
  const tags: string[] = [];
  const lowerDesc = description.toLowerCase();

  if (lowerDesc.includes('vegetarisch') || lowerDesc.includes('vegetarian')) {
    tags.push('vegetarisch');
  }
  if (lowerDesc.includes('vegan')) {
    tags.push('vegan');
  }
  if (lowerDesc.includes('pittig') || lowerDesc.includes('spicy')) {
    tags.push('pittig');
  }
  if (lowerDesc.includes('bevat noten') || lowerDesc.includes('contains nuts')) {
    tags.push('noten');
  }

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

export default function MenuProductCard({ product, index, onProductClick }: MenuProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const [selectedSize, setSelectedSize] = useState<'regular' | 'large'>('regular');
  const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set());
  const { addItem, updateQuantity, items } = useCartStore();
  const { t } = useLanguage();

  const tags = getProductTags(product.description);
  const cleanedDescription = cleanDescription(product.description);
  const hasImage = !!product.image;
  const hasSizes = product.hasSizes && product.priceRegular && product.priceLarge;
  const hasExtras = product.availableExtras && product.availableExtras.length > 0;

  // Get the current price based on selected size
  const basePrice = hasSizes
    ? (selectedSize === 'regular' ? product.priceRegular! : product.priceLarge!)
    : product.price;

  // Calculate extras total
  const extrasTotal = hasExtras
    ? product.availableExtras!.filter(e => selectedExtras.has(e.id)).reduce((sum, e) => sum + e.price, 0)
    : 0;

  const currentPrice = basePrice + extrasTotal;

  // Cart item ID includes size and extras for unique identification
  const extrasSuffix = selectedExtras.size > 0
    ? '-' + Array.from(selectedExtras).sort().join('-')
    : '';
  const cartItemId = hasSizes
    ? `${product.id}-${selectedSize}${extrasSuffix}`
    : `${product.id}${extrasSuffix}`;

  // Find this product in cart (exact match on ID including extras)
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.03 }}
      className="group relative bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
    >
      {/* Image Section - 4:3 aspect ratio for beautiful display */}
      {hasImage && (
        <div
          className={`relative aspect-[4/3] overflow-hidden ${onProductClick ? 'cursor-pointer' : ''}`}
          onClick={() => onProductClick?.(product)}
        >
          <Image
            src={product.image!}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Tags on Image */}
          {tags.length > 0 && (
            <div className="absolute top-3 right-3 flex gap-1.5">
              {tags.includes('vegetarisch') && (
                <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Vegetarisch">
                  <Leaf className="w-4 h-4 text-green-600" />
                </span>
              )}
              {tags.includes('vegan') && (
                <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Vegan">
                  <Leaf className="w-4 h-4 text-emerald-600" />
                </span>
              )}
              {tags.includes('pittig') && (
                <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Pittig / Spicy">
                  <Flame className="w-4 h-4 text-red-500" />
                </span>
              )}
              {tags.includes('noten') && (
                <span className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-md" title="Bevat Noten / Contains Nuts">
                  <Nut className="w-4 h-4 text-amber-600" />
                </span>
              )}
            </div>
          )}

          {/* Price badge on image */}
          <div className="absolute bottom-3 left-3">
            {hasSizes ? (
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full font-oswald text-lg font-bold text-crust shadow-md">
                €{product.priceRegular!.toFixed(2)} | €{product.priceLarge!.toFixed(2)}
              </span>
            ) : (
              <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full font-oswald text-lg font-bold text-crust shadow-md">
                €{product.price.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`p-5 flex flex-col flex-1 ${!hasImage ? 'pt-5' : ''}`}>
        {/* Decorative accent for cards without images */}
        {!hasImage && (
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-tomato to-crust opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        )}

        {/* Header with name and tags (for cards without images) */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3
            className={`font-oswald font-bold text-lg text-espresso group-hover:text-crust transition-colors uppercase tracking-wide leading-tight ${onProductClick ? 'cursor-pointer' : ''}`}
            onClick={() => onProductClick?.(product)}
          >
            {product.name}
          </h3>

          {/* Tags (only show here if no image) */}
          {!hasImage && tags.length > 0 && (
            <div className="flex gap-1.5 flex-shrink-0">
              {tags.includes('vegetarisch') && (
                <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center" title="Vegetarisch">
                  <Leaf className="w-3.5 h-3.5 text-green-600" />
                </span>
              )}
              {tags.includes('vegan') && (
                <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center" title="Vegan">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                </span>
              )}
              {tags.includes('pittig') && (
                <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center" title="Pittig">
                  <Flame className="w-3.5 h-3.5 text-red-500" />
                </span>
              )}
              {tags.includes('noten') && (
                <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center" title="Bevat Noten">
                  <Nut className="w-3.5 h-3.5 text-amber-600" />
                </span>
              )}
            </div>
          )}
        </div>

        {/* Description */}
        {cleanedDescription && (
          <p className="font-lato text-sm text-espresso/70 leading-relaxed mb-4 line-clamp-2 flex-1">
            {cleanedDescription}
          </p>
        )}

        {/* Price (only for cards without images) */}
        {!hasImage && (
          <div className="mb-4">
            {hasSizes ? (
              <span className="font-oswald text-2xl font-bold text-crust">
                €{product.priceRegular!.toFixed(2)} | €{product.priceLarge!.toFixed(2)}
              </span>
            ) : (
              <span className="font-oswald text-2xl font-bold text-crust">
                €{product.price.toFixed(2)}
              </span>
            )}
          </div>
        )}

        {/* Size Selector */}
        {hasSizes && (
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setSelectedSize('regular')}
              className={`flex-1 py-2 rounded-lg font-oswald font-bold text-sm uppercase tracking-wide transition-all ${
                selectedSize === 'regular'
                  ? 'bg-crust text-white shadow-md'
                  : 'bg-espresso/5 text-espresso/70 hover:bg-espresso/10'
              }`}
            >
              Regular — €{product.priceRegular!.toFixed(2)}
            </button>
            <button
              onClick={() => setSelectedSize('large')}
              className={`flex-1 py-2 rounded-lg font-oswald font-bold text-sm uppercase tracking-wide transition-all ${
                selectedSize === 'large'
                  ? 'bg-crust text-white shadow-md'
                  : 'bg-espresso/5 text-espresso/70 hover:bg-espresso/10'
              }`}
            >
              Large — €{product.priceLarge!.toFixed(2)}
            </button>
          </div>
        )}

        {/* Extras Selector */}
        {hasExtras && (
          <div className="mb-3">
            <p className="font-oswald font-bold text-xs uppercase tracking-wider text-espresso/50 mb-2">
              Extras
            </p>
            <div className="flex flex-wrap gap-1.5">
              {product.availableExtras!.map((extra) => (
                <button
                  key={extra.id}
                  onClick={() => toggleExtra(extra.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-oswald font-bold uppercase tracking-wide transition-all ${
                    selectedExtras.has(extra.id)
                      ? 'bg-crust text-white shadow-sm'
                      : 'bg-espresso/5 text-espresso/60 hover:bg-espresso/10'
                  }`}
                >
                  {extra.name} +€{extra.price.toFixed(2)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <div className="mt-auto pt-3 border-t border-espresso/10">
          {quantityInCart === 0 ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddToCart}
              disabled={isAdded}
              className={`w-full py-3 rounded-lg font-oswald font-bold uppercase tracking-wide flex items-center justify-center gap-2 transition-all ${
                isAdded
                  ? 'bg-green-500 text-white'
                  : 'bg-tomato text-white hover:bg-red-700'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  {t('menuPage.added')}
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  {t('menuPage.addToOrder')} {extrasTotal > 0 && `— €${currentPrice.toFixed(2)}`}
                </>
              )}
            </motion.button>
          ) : (
            <div className="flex items-center justify-between bg-espresso/5 rounded-lg p-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleDecrement}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
              >
                <Minus className="w-4 h-4" />
              </motion.button>
              <span className="font-oswald text-xl font-bold text-espresso px-4">
                {quantityInCart}
              </span>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleIncrement}
                className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-tomato hover:text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
