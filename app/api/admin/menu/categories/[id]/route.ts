import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'
import { categoryPatchSchema } from '@/lib/validation/menu'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const parsed = categoryPatchSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid update', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('menu_categories')
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
  return NextResponse.json({ category: data })
}

/** DELETE — alleen toegestaan als de categorie leeg is (409 anders) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id } = await params
  const admin = createAdminClient()

  const { count } = await admin
    .from('menu_products')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', id)

  if (count && count > 0) {
    return NextResponse.json(
      { error: 'Category is not empty. Move or delete its products first.' },
      { status: 409 }
    )
  }

  const { error } = await admin.from('menu_categories').delete().eq('id', id)
  if (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
  return NextResponse.json({ success: true })
}
