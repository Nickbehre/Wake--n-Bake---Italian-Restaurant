import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'
import { reorderSchema } from '@/lib/validation/menu'

/**
 * PUT — nieuwe volgorde vastleggen: ids in gewenste volgorde,
 * sort_order wordt index * 10.
 */
export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const parsed = reorderSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid reorder', details: parsed.error.flatten() },
      { status: 400 }
    )
  }
  const { type, ids } = parsed.data
  const table = type === 'products' ? 'menu_products' : 'menu_categories'

  const admin = createAdminClient()
  const updatedAt = new Date().toISOString()
  const results = await Promise.all(
    ids.map((id, index) =>
      admin.from(table).update({ sort_order: index * 10, updated_at: updatedAt }).eq('id', id)
    )
  )

  const failed = results.find((r) => r.error)
  if (failed?.error) {
    console.error('Error reordering:', failed.error)
    return NextResponse.json({ error: 'Failed to reorder' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
