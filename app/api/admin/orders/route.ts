import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const searchParams = request.nextUrl.searchParams
  const status = searchParams.get('status')
  const search = searchParams.get('search')
  const date = searchParams.get('date')
  const limit = parseInt(searchParams.get('limit') || '50')
  const offset = parseInt(searchParams.get('offset') || '0')

  const admin = createAdminClient()
  let query = admin
    .from('orders')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (status && status !== 'all') {
    query = query.eq('status', status)
  }

  if (search) {
    // Sanitize search input: limit length and escape special characters
    const sanitized = search.slice(0, 100).replace(/[%_\\'"()]/g, '')
    if (sanitized) {
      query = query.or(`id.ilike.%${sanitized}%,customer_name.ilike.%${sanitized}%,customer_email.ilike.%${sanitized}%`)
    }
  }

  if (date) {
    const startOfDay = `${date}T00:00:00.000Z`
    const endOfDay = `${date}T23:59:59.999Z`
    query = query.gte('created_at', startOfDay).lte('created_at', endOfDay)
  }

  const { data, error, count } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }

  return NextResponse.json({ orders: data, total: count })
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id, status, notes } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const updateData: Record<string, any> = {
    updated_at: new Date().toISOString(),
  }

  if (status) updateData.status = status
  if (notes !== undefined) updateData.notes = notes

  const { error } = await admin
    .from('orders')
    .update(updateData)
    .eq('id', id)

  if (error) {
    console.error('Error updating order:', error)
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }

  // Create notification for status change
  if (status) {
    await admin.from('notifications').insert({
      order_id: id,
      type: 'status_change',
      title: `Status changed - ${id}`,
      message: `Status changed to: ${status}`,
    })
  }

  return NextResponse.json({ success: true })
}
