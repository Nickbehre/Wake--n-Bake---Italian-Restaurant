'use client'

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import CartDrawer from '@/components/cart/CartDrawer'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import { ExpressProvider } from '@/lib/context/ExpressContext'
import { CartProvider } from '@/lib/context/CartContext'

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <ExpressProvider>
          <CartProvider>
            <div className="bg-flour text-espresso">
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartDrawer />
              <CookieBanner />
              <Toaster position="bottom-right" />
            </div>
          </CartProvider>
        </ExpressProvider>
      </LanguageProvider>
    </ThemeProvider>
  )
}
