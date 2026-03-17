'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Bike, Store, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useOrderStore } from '@/lib/store/order-store';
import CartSummary from '@/components/order/CartSummary';
import { StoreStatusGate } from '@/components/order/StoreClosedModal';
import { useLanguage } from '@/lib/context/LanguageContext';

const THUISBEZORGD_URL = 'https://www.thuisbezorgd.nl/menu/wake-n-bake-panificio';

export default function CheckoutOptionsPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const items = useOrderStore((state) => state.items);
  const getCartSummary = useOrderStore((state) => state.getCartSummary);
  const summary = getCartSummary();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-comodo text-4xl md:text-5xl mb-6 text-espresso">
            {t('checkoutOptions.emptyCart')}
          </h1>
          <p className="text-espresso/70 mb-8">
            {t('checkoutOptions.emptyCartText')}
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-tomato text-white px-6 py-3 rounded-full font-oswald font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            {t('checkoutOptions.backToMenu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StoreStatusGate>
    <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/order"
          className="inline-flex items-center gap-2 text-espresso/70 hover:text-espresso mb-8 font-lato transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('checkoutOptions.backToMenu')}
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-comodo text-4xl md:text-5xl mb-4 text-espresso">
            {t('checkoutOptions.title')}
          </h1>
          <p className="text-espresso/70">
            {t('checkoutOptions.subtitle')}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="font-oswald text-xl font-bold text-espresso uppercase tracking-wide mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                {t('checkoutOptions.orderSummary')}
              </h2>
              <CartSummary showLineItems={true} />
            </div>
          </motion.div>

          {/* Delivery Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            {/* Thuisbezorgd Delivery Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-md p-8 border-2 border-transparent hover:border-pistachio transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-black text-white p-4 rounded-full">
                  <Bike className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-2">
                    {t('checkoutOptions.deliveryTitle')}
                  </h3>
                  <p className="text-espresso/70 font-lato text-sm">
                    {t('checkoutOptions.deliveryDescription')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-pistachio rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.deliveryFeature1')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-pistachio rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.deliveryFeature2')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-pistachio rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.deliveryFeature3')}
                  </span>
                </div>
              </div>

              <a
                href={THUISBEZORGD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded-full font-oswald text-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors group"
              >
                <Bike className="w-5 h-5 group-hover:animate-pulse" />
                {t('checkoutOptions.deliveryButton')}
              </a>
            </motion.div>

            {/* Click & Collect Option */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl shadow-md p-8 border-2 border-transparent hover:border-tomato transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-tomato text-white p-4 rounded-full">
                  <Store className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-2">
                    {t('checkoutOptions.collectTitle')}
                  </h3>
                  <p className="text-espresso/70 font-lato text-sm">
                    {t('checkoutOptions.collectDescription')}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-tomato rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.collectFeature1')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-tomato rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.collectFeature2')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-espresso/60">
                  <span className="w-2 h-2 bg-tomato rounded-full" />
                  <span className="font-lato">
                    {t('checkoutOptions.collectFeature3')}
                  </span>
                </div>
              </div>

              <Link
                href="/order-checkout"
                className="mt-6 w-full flex items-center justify-center gap-3 bg-tomato text-white py-4 rounded-full font-oswald text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-colors group shadow-md"
              >
                <Store className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                {t('checkoutOptions.collectButton')}
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Info Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto mt-12 p-6 bg-mortadella/20 rounded-lg"
        >
          <p className="text-center text-espresso/70 font-lato text-sm">
            {t('checkoutOptions.note')}
          </p>
        </motion.div>
      </div>
    </div>
    </StoreStatusGate>
  );
}
