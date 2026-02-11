'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import type { Product } from '@/lib/types/order';
import { useOrderStore } from '@/lib/store/order-store';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useOrderStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      categoryId: product.categoryId,
    });

    // Show feedback
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        {/* Product Name */}
        <h3 className="font-montserrat font-bold text-lg text-espresso mb-2">
          {product.name}
        </h3>

        {/* Description (only if exists) */}
        {product.description && (
          <p className="font-lato text-sm text-espresso/70 mb-4 line-clamp-3">
            {product.description}
          </p>
        )}

        {/* Price and Add Button */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-espresso/10">
          <span className="font-oswald font-bold text-xl text-crust">
            €{product.price.toFixed(2)}
          </span>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-oswald font-semibold text-sm uppercase tracking-wide transition-colors ${
              isAdded
                ? 'bg-green-500 text-white'
                : 'bg-tomato text-white hover:bg-tomato/90'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Add
              </>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
