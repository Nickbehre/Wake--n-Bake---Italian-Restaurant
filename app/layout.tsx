import type { Metadata } from 'next'
import { Montserrat, Lato, Playfair_Display, Oswald } from 'next/font/google'
import { LOCATIONS, toOpeningHoursSchema } from '@/lib/data/locations'
import './globals.css'

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
    "Geniet van vers gebakken focaccia, schiacciata en Italiaanse specialiteiten. Twee locaties in Amsterdam: Vijzelstraat 93h (Centrum) en Wake N' Bake Express in De Pijp.",
  keywords:
    'italiaans brood amsterdam, focaccia amsterdam, schiacciata, panificio, bakkerij vijzelstraat, wake n bake express, de pijp',
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
        {/* LocalBusiness-schema voor BEIDE filialen, gegenereerd uit lib/data/locations.ts */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              (['original', 'express'] as const).map((id) => {
                const loc = LOCATIONS[id]
                return {
                  '@context': 'https://schema.org',
                  '@type': 'Bakery',
                  '@id': `https://www.wakenbakepanificio.nl/#${id}`,
                  name: loc.name,
                  description:
                    id === 'express'
                      ? "Wake N' Bake Express — de nieuwe tweede locatie van de authentieke Italiaanse bakkerij, in De Pijp Amsterdam"
                      : 'Authentieke Italiaanse bakkerij in Amsterdam',
                  address: {
                    '@type': 'PostalAddress',
                    streetAddress: loc.address.street,
                    addressLocality: loc.address.city,
                    postalCode: loc.address.postalCode,
                    addressCountry: 'NL',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: loc.geo.lat,
                    longitude: loc.geo.lng,
                  },
                  telephone: loc.phone,
                  url:
                    id === 'express'
                      ? 'https://www.wakenbakepanificio.nl/?loc=express'
                      : 'https://www.wakenbakepanificio.nl',
                  servesCuisine: 'Italian',
                  priceRange: '€€',
                  openingHoursSpecification: toOpeningHoursSchema(loc),
                  sameAs: [
                    'https://www.instagram.com/wakenbake.nl/',
                    'https://www.tripadvisor.com/wakenbakepanificio',
                  ],
                }
              })
            ),
          }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${lato.variable} ${playfair.variable} ${oswald.variable} font-lato antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
