'use client'

import Link from 'next/link'
import { Bike, Store } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

interface OrderButtonsProps {
  variant?: 'default' | 'hero' | 'compact'
  className?: string
}

const THUISBEZORGD_URL = 'https://www.thuisbezorgd.nl/menu/wake-n-bake-panificio'

export default function OrderButtons({ variant = 'default', className = '' }: OrderButtonsProps) {
  const { language } = useLanguage()

  const deliveryText = language === 'en' ? 'Delivery (Thuisbezorgd)' : 'Bezorgen (Thuisbezorgd)'
  const takeawayText = language === 'en' ? 'Pick-up (Order Online)' : 'Pick-up (Online Bestellen)'

  if (variant === 'hero') {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        {/* Delivery - Uber Eats */}
        <a
          href={THUISBEZORGD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center justify-center gap-3 bg-black text-white px-8 py-4 rounded-lg font-oswald text-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Bike className="w-5 h-5 group-hover:animate-bounce" />
          {deliveryText}
        </a>

        {/* Takeaway - Click & Collect */}
        <Link
          href="/menu"
          className="group flex items-center justify-center gap-3 bg-tomato text-white px-8 py-4 rounded-lg font-oswald text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          <Store className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
          {takeawayText}
        </Link>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className={`flex gap-3 ${className}`}>
        <a
          href={THUISBEZORGD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded font-oswald text-sm font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors"
        >
          <Bike className="w-4 h-4" />
          {language === 'en' ? 'Delivery' : 'Bezorgen'}
        </a>
        <Link
          href="/menu"
          className="flex items-center gap-2 bg-tomato text-white px-4 py-2 rounded font-oswald text-sm font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
        >
          <Store className="w-4 h-4" />
          {language === 'en' ? 'Pick-up' : 'Pick-up'}
        </Link>
      </div>
    )
  }

  // Default variant
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <a
        href={THUISBEZORGD_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center gap-3 bg-black text-white py-4 rounded font-oswald text-lg font-bold uppercase tracking-wide hover:bg-gray-800 transition-colors group"
      >
        <Bike className="w-5 h-5 group-hover:animate-pulse" />
        {deliveryText}
      </a>
      <Link
        href="/menu"
        className="w-full flex items-center justify-center gap-3 bg-tomato text-white py-4 rounded font-oswald text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-colors group shadow-md"
      >
        <Store className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        {takeawayText}
      </Link>
    </div>
  )
}
