import MenuPageClient from '@/components/menu/MenuPageClient'
import { fetchMenu, type MenuCategoryPayload } from '@/lib/data/menu-db'
import { pageMetadata, SITE_URL } from '@/lib/seo'

// Server-side gerenderd zodat Google (en de eerste paint) het echte menu ziet.
// De client ververst daarna zelf, dus dashboardwijzigingen blijven direct zichtbaar.
export const revalidate = 60

export const metadata = pageMetadata({
  title: 'Menu — Schiacciata, focaccia & koffie',
  description:
    'Bekijk het menu van Wake N’ Bake: vers gebakken Italiaanse schiacciata met mortadella, prosciutto, porchetta en vegetarische opties, plus koffie en zoetigheden. Online bestellen en afhalen in Amsterdam.',
  path: '/menu',
})

function menuJsonLd(menu: MenuCategoryPayload[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${SITE_URL}/menu#menu`,
    name: "Wake N' Bake menu",
    url: `${SITE_URL}/menu`,
    inLanguage: 'nl',
    hasMenuSection: menu
      .filter((c) => c.products.length > 0)
      .map((c) => ({
        '@type': 'MenuSection',
        name: c.name_nl,
        hasMenuItem: c.products.map((p) => {
          const price = p.has_sizes ? (p.price_regular ?? p.price) : p.price
          return {
            '@type': 'MenuItem',
            name: p.name_nl,
            ...(p.description_nl ? { description: p.description_nl } : {}),
            ...(p.image_url ? { image: p.image_url } : {}),
            offers: {
              '@type': 'Offer',
              price: Number(price).toFixed(2),
              priceCurrency: 'EUR',
              availability: p.sold_out
                ? 'https://schema.org/OutOfStock'
                : 'https://schema.org/InStock',
            },
          }
        }),
      })),
  }
}

export default async function MenuPage() {
  let menu: MenuCategoryPayload[] | null = null
  try {
    menu = await fetchMenu(false)
  } catch (error) {
    // Geen ramp: de client haalt het menu dan zelf op via /api/products
    console.error('[menu] server-side fetch failed:', error)
  }

  return (
    <>
      {menu && menu.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(menuJsonLd(menu)).replace(/</g, '\\u003c'),
          }}
        />
      )}
      <MenuPageClient initialMenu={menu} />
    </>
  )
}
