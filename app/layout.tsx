import type { Metadata } from 'next'
import { Montserrat, Lato, Playfair_Display, Oswald } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import CookieBanner from '@/components/ui/CookieBanner'
import CartDrawer from '@/components/cart/CartDrawer'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { LanguageProvider } from '@/lib/context/LanguageContext'
import { CartProvider } from '@/lib/context/CartContext'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Wake N' Bake Panificio | Authentieke Italiaanse Bakkerij in Amsterdam",
  description:
    'Geniet van vers gebakken focaccia, schiacciata en Italiaanse specialiteiten. De beste Italiaanse bakkerij in Amsterdam op Vijzelstraat 93h.',
  keywords:
    'italiaans brood amsterdam, focaccia amsterdam, schiacciata, panificio, bakkerij vijzelstraat',
  openGraph: {
    title: "Wake N' Bake Panificio | Vers Italiaans Brood",
    description: 'Authentieke Italiaanse bakkerij in Amsterdam',
    url: 'https://www.wakenbakepanificio.nl',
    siteName: "Wake N' Bake Panificio",
    locale: 'nl_NL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Wake N' Bake Panificio",
    description: 'Authentieke Italiaanse bakkerij in Amsterdam',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Bakery',
              name: "Wake N' Bake Panificio",
              description: 'Authentieke Italiaanse bakkerij in Amsterdam',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Vijzelstraat 93h',
                addressLocality: 'Amsterdam',
                postalCode: '1017 HH',
                addressCountry: 'NL',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 52.3625,
                longitude: 4.8892,
              },
              telephone: '+31 20 123 4567',
              url: 'https://www.wakenbakepanificio.nl',
              servesCuisine: 'Italian',
              priceRange: '€€',
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                  ],
                  opens: '08:00',
                  closes: '18:00',
                },
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Saturday', 'Sunday'],
                  opens: '09:00',
                  closes: '17:00',
                },
              ],
              sameAs: [
                'https://www.instagram.com/wakenbake.nl/',
                'https://www.tripadvisor.com/wakenbakepanificio',
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${lato.variable} ${playfair.variable} ${oswald.variable} font-lato antialiased bg-flour text-espresso`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <LanguageProvider>
            <CartProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
              <CartDrawer />
              <CookieBanner />
              <Toaster position="bottom-right" />
            </CartProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
