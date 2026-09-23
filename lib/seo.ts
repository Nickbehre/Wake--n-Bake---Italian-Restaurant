import type { Metadata } from 'next'

export const SITE_URL = 'https://www.wakenbakepanificio.nl'
export const SITE_NAME = "Wake N' Bake Panificio"

export const INSTAGRAM_URL = 'https://www.instagram.com/wakenbake.nl/'

// De oude link (tripadvisor.com/wakenbakepanificio) is geen geldige
// TripAdvisor-URL. Plak hier de echte listing-URL
// (https://www.tripadvisor.com/Restaurant_Review-g...-d...-Reviews-...html);
// dan verschijnt het icoon in de footer en in de structured data.
export const TRIPADVISOR_URL: string | null = null

// Social profielen voor schema.org `sameAs`
export const SOCIAL_PROFILES = [INSTAGRAM_URL, ...(TRIPADVISOR_URL ? [TRIPADVISOR_URL] : [])]

/**
 * Metadata voor een pagina: eigen titel/omschrijving, canonical URL en
 * bijpassende Open Graph-velden. Een eigen openGraph-object overschrijft de
 * geërfde app/opengraph-image.jpg, dus die zetten we hier expliciet.
 */
const OG_IMAGE = {
  url: '/opengraph-image.jpg',
  width: 1200,
  height: 630,
  alt: "Wake N' Bake Panificio — vers gebakken Italiaanse schiacciata in Amsterdam",
}

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string
  description: string
  path: string
  noindex?: boolean
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: 'nl_NL',
      type: 'website',
      images: [OG_IMAGE],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [OG_IMAGE.url],
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  }
}
