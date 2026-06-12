'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import CartDrawer from '@/components/cart/CartDrawer'
import Preloader from '@/components/ui/Preloader'
import Cursor from '@/components/ui/Cursor'
import LocationTransition from '@/components/location/LocationTransition'
import SmoothScroll from '@/components/providers/SmoothScroll'
import { ThemeProvider } from 'next-themes'
import { MotionConfig } from 'framer-motion'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import { CartProvider } from '@/lib/context/CartContext'
import { LocationProvider } from '@/lib/context/LocationContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <MotionConfig reducedMotion="user">
      <LanguageProvider>
        <LocationProvider>
          <CartProvider>
            <SmoothScroll>
              <div className="bg-flour text-espresso">
                <Preloader />
                <LocationTransition />
                <Cursor />
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
                <CartDrawer />
                <CookieBanner />
                <Toaster position="bottom-right" />
              </div>
            </SmoothScroll>
          </CartProvider>
        </LocationProvider>
      </LanguageProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
