// ============================================
// Gedeelde types + pure helpers voor het menu
// uit Supabase. Client-safe (geen server-deps):
// wordt zowel door de menu-pagina als de API
// routes gebruikt.
// ============================================

import type { LocationId } from '@/lib/data/locations'
import type { Category, Product, ProductExtra } from '@/lib/types/order'

export interface DbProduct {
  id: string
  category_id: string
  name_nl: string
  name_en: string
  description_nl: string
  description_en: string
  price: number
  has_sizes: boolean
  price_regular: number | null
  price_large: number | null
  extras: ProductExtra[]
  available_at: LocationId[] | null
  sold_out: boolean
  hidden: boolean
  sort_order: number
  image_url: string | null
}

export interface DbCategory {
  id: string
  name_nl: string
  name_en: string
  menu: 'schiacciata' | 'togo'
  sort_order: number
  available_at: LocationId[] | null
}

export interface MenuCategoryPayload extends DbCategory {
  products: DbProduct[]
}

/** DB-rij → bestaand Product-type zodat alle menu/cart-componenten blijven werken. */
export function toLocalizedProduct(p: DbProduct, lang: 'nl' | 'en'): Product {
  const name = lang === 'nl' ? p.name_nl : p.name_en
  const description = lang === 'nl' ? p.description_nl : p.description_en
  return {
    id: p.id,
    name: name || p.name_en,
    description: description || p.description_en,
    price: Number(p.price),
    categoryId: p.category_id,
    image: p.image_url ?? undefined,
    hasSizes: p.has_sizes || undefined,
    priceRegular: p.price_regular != null ? Number(p.price_regular) : undefined,
    priceLarge: p.price_large != null ? Number(p.price_large) : undefined,
    availableExtras: p.extras?.length ? p.extras : undefined,
    availableAt: p.available_at ?? undefined,
    soldOut: p.sold_out || undefined,
  }
}

export function toLocalizedCategory(
  cat: MenuCategoryPayload,
  lang: 'nl' | 'en'
): Category {
  return {
    id: cat.id,
    name: (lang === 'nl' ? cat.name_nl : cat.name_en) || cat.name_en,
    menu: cat.menu,
    availableAt: cat.available_at ?? undefined,
    products: cat.products.map((p) => toLocalizedProduct(p, lang)),
  }
}
