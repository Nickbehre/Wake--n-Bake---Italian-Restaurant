import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'
import { productPatchSchema } from '@/lib/validation/menu'

/** PATCH — deelupdate (ook voor snelle sold_out/hidden-toggles) */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const parsed = productPatchSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid update', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('menu_products')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }

  return NextResponse.json({ product: data })
}

/** DELETE — verwijdert product + (best effort) bijbehorende Storage-afbeelding */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const admin = createAdminClient()

  const { data: product } = await admin
    .from('menu_products')
    .select('image_url')
    .eq('id', id)
    .maybeSingle()

  const { error } = await admin.from('menu_products').delete().eq('id', id)
  if (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }

  // Geüploade afbeelding opruimen (statice /assets/-paden laten staan)
  const marker = '/storage/v1/object/public/menu-images/'
  if (product?.image_url?.includes(marker)) {
    const path = product.image_url.split(marker)[1]
    if (path) {
      await admin.storage.from('menu-images').remove([path]).catch(() => {})
    }
  }

  return NextResponse.json({ success: true })
}
