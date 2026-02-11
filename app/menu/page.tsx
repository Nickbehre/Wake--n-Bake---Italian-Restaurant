'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { schiacciataMenuCategories, togoMenuCategories, additionalCategories, productCategories } from '@/lib/data/products';
import MenuCategorySection from '@/components/menu/MenuCategorySection';
import MenuPDFButton from '@/components/menu/MenuPDFButton';
import CartDrawer from '@/components/cart/CartDrawer';
import MenuPhotoOverlay, { type MenuPhoto } from '@/components/menu/MenuPhotoOverlay';
import ProductDetailModal from '@/components/menu/ProductDetailModal';
import { useLanguage } from '@/lib/context/LanguageContext';
import { ChefHat, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types/order';

const schiacciatMenuPhotos: MenuPhoto[] = [
  { src: '/assets/menu/menu-pork.jpg', alt: 'Schiacciata Pork Menu', label: 'Schiacciata — Pork', color: 'bg-crust' },
  { src: '/assets/menu/menu-beef-fish.jpg', alt: 'Schiacciata Beef & Fish Menu', label: 'Schiacciata — Beef & Fish', color: 'bg-crust' },
  { src: '/assets/menu/menu-veggie.jpg', alt: 'Schiacciata Vegetarian Menu', label: 'Schiacciata — Vegetarian', color: 'bg-crust' },
];

const togoMenuPhotos: MenuPhoto[] = [
  { src: '/assets/menu/schiacciatamenutogo.jpg', alt: 'Schiacciata To-Go Menu', label: 'Schiacciata & Pizza', color: 'bg-pistachio' },
  { src: '/assets/menu/coffeeandsweetsmenu.jpg', alt: 'Coffee & Sweet Treats Menu', label: 'Coffee & Sweet Treats', color: 'bg-pistachio' },
];

export default function MenuPage() {
  const { t } = useLanguage();
  const [schiacciatOverlayOpen, setSchiacciatOverlayOpen] = useState(false);
  const [schiacciatOverlayIndex, setSchiacciatOverlayIndex] = useState(0);
  const [togoOverlayOpen, setTogoOverlayOpen] = useState(false);
  const [togoOverlayIndex, setTogoOverlayIndex] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productModalOpen, setProductModalOpen] = useState(false);

  const openSchiacciatOverlay = (index: number) => {
    setSchiacciatOverlayIndex(index);
    setSchiacciatOverlayOpen(true);
  };

  const openTogoOverlay = (index: number) => {
    setTogoOverlayIndex(index);
    setTogoOverlayOpen(true);
  };

  const handleProductClick = useCallback((product: Product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
      {/* Floating Menu Navigation Buttons */}
      <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        <motion.a
          href="#schiacciata-menu"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, type: 'spring' }}
          onClick={(e) => { e.preventDefault(); document.getElementById('schiacciata-menu')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="group w-14 h-14 bg-crust text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-crust/90"
          title={t('menuPage.schiacciatMenuTitle')}
        >
          <ChefHat className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="#togo-menu"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1, type: 'spring' }}
          onClick={(e) => { e.preventDefault(); document.getElementById('togo-menu')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="group w-14 h-14 bg-pistachio text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 hover:bg-pistachio/90"
          title={t('menuPage.togoMenuTitle')}
        >
          <ShoppingBag className="w-6 h-6" />
        </motion.a>
      </div>

      {/* Mobile floating buttons */}
      <div className="fixed bottom-24 right-4 z-40 md:hidden flex flex-col gap-2">
        <motion.a
          href="#schiacciata-menu"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, type: 'spring' }}
          onClick={(e) => { e.preventDefault(); document.getElementById('schiacciata-menu')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="w-12 h-12 bg-crust text-white rounded-full shadow-lg flex items-center justify-center"
          title={t('menuPage.schiacciatMenuTitle')}
        >
          <ChefHat className="w-5 h-5" />
        </motion.a>
        <motion.a
          href="#togo-menu"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: 'spring' }}
          onClick={(e) => { e.preventDefault(); document.getElementById('togo-menu')?.scrollIntoView({ behavior: 'smooth' }); }}
          className="w-12 h-12 bg-pistachio text-white rounded-full shadow-lg flex items-center justify-center"
          title={t('menuPage.togoMenuTitle')}
        >
          <ShoppingBag className="w-5 h-5" />
        </motion.a>
      </div>

      <div className="container mx-auto px-4">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 mt-4 md:mt-8"
        >
          <h1 className="font-comodo text-5xl md:text-7xl mb-6 text-espresso">
            {t('menuPage.title')}
          </h1>
          <p className="text-xl text-espresso/80 max-w-2xl mx-auto font-lato">
            {t('menuPage.subtitle')}
          </p>
        </motion.div>

        {/* Sticky Category Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="sticky top-24 z-30 bg-flour/95 backdrop-blur-sm py-4 mb-16 -mx-4 px-4 border-b border-espresso/10"
        >
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-5xl mx-auto">
            {/* Menu type quick links */}
            <motion.a
              href="#schiacciata-menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="px-4 py-2 bg-crust text-white shadow-sm font-oswald font-bold text-sm uppercase tracking-wider rounded-full whitespace-nowrap flex items-center gap-1.5 hover:bg-crust/80 transition-colors"
            >
              <ChefHat className="w-3.5 h-3.5" />
              Schiacciata
            </motion.a>
            <motion.a
              href="#togo-menu"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="px-4 py-2 bg-pistachio text-white shadow-sm font-oswald font-bold text-sm uppercase tracking-wider rounded-full whitespace-nowrap flex items-center gap-1.5 hover:bg-pistachio/80 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              To-Go
            </motion.a>
            <div className="w-px h-8 bg-espresso/20 mx-1 self-center hidden md:block" />
            {productCategories.map((category, index) => (
              <motion.a
                key={category.id}
                href={`#${category.id}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + index * 0.02 }}
                className="px-3 py-1.5 bg-white shadow-sm font-montserrat font-semibold text-xs text-espresso hover:bg-crust hover:text-white transition-all duration-200 rounded-full whitespace-nowrap"
              >
                {category.name}
              </motion.a>
            ))}
          </div>
        </motion.nav>

        {/* ═══════════════════════════════════════════ */}
        {/* SCHIACCIATA MENU — Made to Order           */}
        {/* ═══════════════════════════════════════════ */}
        <div id="schiacciata-menu" className="scroll-mt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-16 rounded-2xl overflow-hidden"
          >
            {/* Background image — click to view full menu photo */}
            <button
              onClick={() => openSchiacciatOverlay(0)}
              className="relative h-48 md:h-64 w-full cursor-pointer group/banner"
            >
              <Image
                src="/assets/menu/schiacciatamenutogo.jpg"
                alt="Schiacciata Menu"
                fill
                className="object-cover group-hover/banner:scale-[1.02] transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/60 to-espresso/40 group-hover/banner:from-espresso/70 group-hover/banner:via-espresso/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-12 text-left">
                  <span className="inline-flex items-center gap-2 bg-crust text-white font-oswald text-xs md:text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    <ChefHat className="w-4 h-4" />
                    {t('menuPage.schiacciatMenuTag')}
                  </span>
                  <h2 className="font-comodo text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                    {t('menuPage.schiacciatMenuTitle')}
                  </h2>
                  <p className="font-lato text-white/80 text-base md:text-lg max-w-lg">
                    {t('menuPage.schiacciatMenuSubtitle')}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>

          <div className="space-y-24">
            {schiacciataMenuCategories.map((category) => (
              <MenuCategorySection key={category.id} category={category} onProductClick={handleProductClick} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-24 flex items-center gap-6">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-espresso/20 to-espresso/20" />
          <span className="text-espresso/30 text-4xl">&#9830;</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-espresso/20 to-espresso/20" />
        </div>

        {/* ═══════════════════════════════════════════ */}
        {/* WAKE N' BAKE MENU — To Go                  */}
        {/* ═══════════════════════════════════════════ */}
        <div id="togo-menu" className="scroll-mt-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative mb-16 rounded-2xl overflow-hidden"
          >
            {/* Background image — click to view full menu photo */}
            <button
              onClick={() => openTogoOverlay(0)}
              className="relative h-48 md:h-64 w-full cursor-pointer group/banner"
            >
              <Image
                src="/assets/menu/coffeeandsweetsmenu.jpg"
                alt="Wake N' Bake Menu"
                fill
                className="object-cover group-hover/banner:scale-[1.02] transition-transform duration-500"
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/80 via-espresso/60 to-espresso/40 group-hover/banner:from-espresso/70 group-hover/banner:via-espresso/50 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-center">
                <div className="px-8 md:px-12 text-left">
                  <span className="inline-flex items-center gap-2 bg-pistachio text-white font-oswald text-xs md:text-sm uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                    <ShoppingBag className="w-4 h-4" />
                    {t('menuPage.togoMenuTag')}
                  </span>
                  <h2 className="font-comodo text-4xl md:text-5xl lg:text-6xl text-white mb-2">
                    {t('menuPage.togoMenuTitle')}
                  </h2>
                  <p className="font-lato text-white/80 text-base md:text-lg italic">
                    {t('menuPage.togoMenuSubtitle')}
                  </p>
                </div>
              </div>
            </button>
          </motion.div>

          <div className="space-y-24">
            {togoMenuCategories.map((category) => (
              <MenuCategorySection key={category.id} category={category} onProductClick={handleProductClick} />
            ))}
          </div>
        </div>

        {/* Divider */}
        {additionalCategories.length > 0 && (
          <>
            <div className="my-24 flex items-center gap-6">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-espresso/20 to-espresso/20" />
              <span className="text-espresso/30 text-4xl">&#9830;</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-espresso/20 to-espresso/20" />
            </div>

            {/* Additional Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-comodo text-4xl md:text-5xl text-espresso">
                {t('menuPage.alsoAvailable')}
              </h2>
            </motion.div>

            <div className="space-y-24">
              {additionalCategories.map((category) => (
                <MenuCategorySection key={category.id} category={category} onProductClick={handleProductClick} />
              ))}
            </div>
          </>
        )}

        {/* Allergen Info */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-24 p-8 md:p-12 bg-gradient-to-br from-mortadella/20 to-flour rounded-2xl text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <span className="text-2xl">&#9888;&#65039;</span>
            </div>
            <h3 className="font-montserrat font-bold text-2xl mb-4 text-espresso">
              {t('menuPage.allergenTitle')}
            </h3>
            <p className="text-espresso/80 font-lato leading-relaxed">
              {t('menuPage.allergenText')}
            </p>
          </div>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-espresso/70"
        >
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-xs">&#127807;</span>
            <span>{t('menuPage.vegetarian')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs">&#127793;</span>
            <span>{t('menuPage.vegan')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-xs">&#127798;&#65039;</span>
            <span>{t('menuPage.spicy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs">&#129372;</span>
            <span>{t('menuPage.containsNuts')}</span>
          </div>
        </motion.div>

        {/* Download Menu Button */}
        <div className="mt-16 text-center">
          <MenuPDFButton />
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Schiacciata Menu Photo Overlay */}
      <MenuPhotoOverlay
        isOpen={schiacciatOverlayOpen}
        onClose={() => setSchiacciatOverlayOpen(false)}
        photos={schiacciatMenuPhotos}
        initialIndex={schiacciatOverlayIndex}
      />

      {/* To-Go Menu Photo Overlay */}
      <MenuPhotoOverlay
        isOpen={togoOverlayOpen}
        onClose={() => setTogoOverlayOpen(false)}
        photos={togoMenuPhotos}
        initialIndex={togoOverlayIndex}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
      />
    </div>
  );
}
