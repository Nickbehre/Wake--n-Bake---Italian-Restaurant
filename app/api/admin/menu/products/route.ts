import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'
import { fetchMenu } from '@/lib/data/menu-db'
import { productBodySchema, slugify } from '@/lib/validation/menu'

/** GET — volledig menu inclusief verborgen producten (dashboard-overzicht) */
export async function GET() {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  try {
    const categories = await fetchMenu(true)
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching admin menu:', error)
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 })
  }
}

/** POST — nieuw product; id wordt server-side afgeleid van de Engelse naam */
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const parsed = productBodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid product', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const body = parsed.data

  const admin = createAdminClient()

  // Uniek id op basis van naam; bij botsing een suffix
  const base = slugify(body.name_en) || 'product'
  let id = base
  for (let attempt = 2; attempt < 20; attempt++) {
    const { data } = await admin.from('menu_products').select('id').eq('id', id).maybeSingle()
    if (!data) break
    id = `${base}-${attempt}`
  }

  // Nieuw product achteraan in de categorie
  const { data: last } = await admin
    .from('menu_products')
    .select('sort_order')
    .eq('category_id', body.category_id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = (last?.sort_order ?? -10) + 10

  const { data, error } = await admin
    .from('menu_products')
    .insert({ id, sort_order, ...body })
    .select()
    .single()

  if (error) {
    console.error('Error creating product:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }

  return NextResponse.json({ product: data }, { status: 201 })
}
