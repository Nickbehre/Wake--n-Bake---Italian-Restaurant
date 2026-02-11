'use client';

import { motion } from 'framer-motion';
import type { Category, Product } from '@/lib/types/order';
import MenuProductCard from './MenuProductCard';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ChefHat, ShoppingBag } from 'lucide-react';

interface MenuCategorySectionProps {
  category: Category;
  onProductClick?: (product: Product) => void;
}

const categoryIcons: Record<string, string> = {
  'our-signature-schiacciata': '\u{1F96A}',
  'calzone': '\u{1F355}',
  'schiacciata-togo': '\u{1F96A}',
  'pizza-al-taglio': '\u{1F355}',
  'drinks': '\u{1F379}',
  'coffee-hot': '\u2615',
  'cold-drinks': '\u{1F964}',
  'coffee-extras': '\u2795',
  'dolci': '\u{1F370}',
  'wake-n-bake-deals': '\u{1F381}',
  'biscotti': '\u{1F36A}',
  'italian-pantry': '\u{1FAD2}',
  'pasta': '\u{1F35D}',
};

// Category subtitles
const categorySubtitles: Record<string, string> = {
  'calzone': 'Folded Pizza',
  'pizza-al-taglio': 'By The Slice',
  'schiacciata-togo': 'To Go',
  'coffee-hot': 'Hot Drinks',
  'dolci': 'Sweets',
};

export default function MenuCategorySection({ category, onProductClick }: MenuCategorySectionProps) {
  const icon = categoryIcons[category.id] || '\u{1F37D}\uFE0F';
  const { t } = useLanguage();
  const isMadeToOrder = category.menu === 'schiacciata';
  const isReadyToGo = category.menu === 'togo';
  const subtitle = categorySubtitles[category.id];

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      id={category.id}
      className="scroll-mt-32"
    >
      {/* Category Header */}
      <div className="mb-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center gap-3 md:gap-4 mb-3"
        >
          <span className="text-4xl" role="img" aria-hidden="true">
            {icon}
          </span>
          <div className="flex items-baseline gap-3">
            <h2 className="font-comodo text-3xl md:text-4xl text-espresso">
              {category.name}
            </h2>
            {subtitle && (
              <span className="font-lato text-base md:text-lg text-espresso/50 italic">
                {subtitle}
              </span>
            )}
          </div>
          {isMadeToOrder && (
            <span className="inline-flex items-center gap-1.5 bg-crust/10 text-crust font-oswald text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">
              <ChefHat className="w-3.5 h-3.5" />
              {t('menuPage.madeToOrder')}
            </span>
          )}
          {isReadyToGo && (
            <span className="inline-flex items-center gap-1.5 bg-pistachio/20 text-pistachio font-oswald text-xs uppercase tracking-wider px-3 py-1.5 rounded-full">
              <ShoppingBag className="w-3.5 h-3.5" />
              {t('menuPage.readyToGo')}
            </span>
          )}
        </motion.div>
        <div className="w-24 h-1 bg-gradient-to-r from-tomato to-crust rounded-full ml-14" />
      </div>

      {/* Products Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {category.products.map((product, index) => (
          <MenuProductCard key={product.id} product={product} index={index} onProductClick={onProductClick} />
        ))}
      </div>
    </motion.section>
  );
}
