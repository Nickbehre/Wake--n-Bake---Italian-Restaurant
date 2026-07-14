import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'
import { categoryBodySchema, slugify } from '@/lib/validation/menu'

export async function GET() {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('menu_categories')
    .select('*')
    .order('sort_order')

  if (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
  return NextResponse.json({ categories: data })
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const parsed = categoryBodySchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid category', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const body = parsed.data

  const admin = createAdminClient()

  const base = slugify(body.name_en) || 'categorie'
  let id = base
  for (let attempt = 2; attempt < 20; attempt++) {
    const { data } = await admin.from('menu_categories').select('id').eq('id', id).maybeSingle()
    if (!data) break
    id = `${base}-${attempt}`
  }

  const { data: last } = await admin
    .from('menu_categories')
    .select('sort_order')
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = (last?.sort_order ?? -10) + 10

  const { data, error } = await admin
    .from('menu_categories')
    .insert({ id, sort_order, ...body })
    .select()
    .single()

  if (error) {
    console.error('Error creating category:', error)
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }

  return NextResponse.json({ category: data }, { status: 201 })
}
