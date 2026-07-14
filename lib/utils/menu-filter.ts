// Pure filter-helper, gedeeld door menu-pagina en API.
// (Verhuisd uit lib/data/products.ts toen het menu naar Supabase ging.)

import type { LocationId } from '@/lib/data/locations'
import type { Category } from '@/lib/types/order'

/**
 * Filter menucategorieën voor een filiaal (alleen weergave — prijsvalidatie
 * gebeurt server-side op de volledige data). Categorie/product zonder
 * `availableAt` is overal zichtbaar; lege categorieën vallen weg.
 */
export function getMenuForLocation(
  categories: Category[],
  locationId: LocationId
): Category[] {
  return categories
    .filter((cat) => !cat.availableAt || cat.availableAt.includes(locationId))
    .map((cat) => ({
      ...cat,
      products: cat.products.filter(
        (p) => !p.availableAt || p.availableAt.includes(locationId)
      ),
    }))
    .filter((cat) => cat.products.length > 0)
}
