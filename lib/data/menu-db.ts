// ============================================
// MENU UIT SUPABASE — vervangt de hardcoded
// lib/data/products.ts. Server-side fetchers;
// lezen kan met de publishable key (RLS: public
// read), schrijven gaat via de admin-client in
// de /api/admin/menu/* routes.
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { DbCategory, DbProduct, MenuCategoryPayload } from '@/lib/data/menu-types'

export type { DbCategory, DbProduct, MenuCategoryPayload }
export { toLocalizedProduct, toLocalizedCategory } from '@/lib/data/menu-types'

// Publieke read-client (geen cookies/service key nodig)
function createReadClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? 'placeholder-anon-key'
  )
}

/**
 * Volledige menustructuur, gesorteerd op sort_order.
 * @param includeHidden true voor het admin-overzicht
 */
export async function fetchMenu(includeHidden = false): Promise<MenuCategoryPayload[]> {
  const supabase = createReadClient()
  const [catsRes, prodsRes] = await Promise.all([
    supabase.from('menu_categories').select('*').order('sort_order'),
    supabase.from('menu_products').select('*').order('sort_order'),
  ])
  if (catsRes.error) throw catsRes.error
  if (prodsRes.error) throw prodsRes.error

  const products = (prodsRes.data as DbProduct[]).filter(
    (p) => includeHidden || !p.hidden
  )
  return (catsRes.data as DbCategory[]).map((cat) => ({
    ...cat,
    products: products.filter((p) => p.category_id === cat.id),
  }))
}

/** Producten op id, voor server-side prijsvalidatie bij checkout. */
export async function fetchProductsByIds(ids: string[]): Promise<DbProduct[]> {
  if (ids.length === 0) return []
  const supabase = createReadClient()
  const { data, error } = await supabase
    .from('menu_products')
    .select('*')
    .in('id', ids)
  if (error) throw error
  return data as DbProduct[]
}
