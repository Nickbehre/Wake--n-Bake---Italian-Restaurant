import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'

interface OrderItemRow {
  productId?: string
  id?: string
  name?: string
  price?: number
  quantity?: number
}

/**
 * GET /api/admin/menu/insights?days=30&location=original|express|all
 * Best sellers uit de orders-tabel: aantal + omzet per product.
 * NB: orders van vóór de locatie-kolom hebben location null (tellen mee bij 'all').
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const searchParams = request.nextUrl.searchParams
  const days = Math.min(Math.max(parseInt(searchParams.get('days') || '30'), 1), 365)
  const location = searchParams.get('location') || 'all'

  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

  const admin = createAdminClient()
  let query = admin
    .from('orders')
    .select('items, location, status, created_at')
    .gte('created_at', since)
    .not('status', 'eq', 'cancelled')

  if (location === 'original' || location === 'express') {
    query = query.eq('location', location)
  }

  const { data, error } = await query
  if (error) {
    console.error('Error fetching insights:', error)
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 })
  }

  // Aggregatie in JS — ordervolume is klein genoeg
  const byProduct = new Map<string, { name: string; quantity: number; revenue: number }>()
  let orderCount = 0
  let totalRevenue = 0

  for (const order of data ?? []) {
    orderCount++
    const items = (order.items ?? []) as OrderItemRow[]
    for (const item of items) {
      const key = item.productId || item.id || 'unknown'
      const qty = item.quantity ?? 1
      const revenue = (item.price ?? 0) * qty
      totalRevenue += revenue
      const entry = byProduct.get(key) ?? { name: item.name || key, quantity: 0, revenue: 0 }
      entry.quantity += qty
      entry.revenue += revenue
      byProduct.set(key, entry)
    }
  }

  // Actuele namen erbij (voor hernoemde producten); order-item-naam is fallback
  const ids = [...byProduct.keys()]
  if (ids.length > 0) {
    const { data: products } = await admin
      .from('menu_products')
      .select('id, name_en')
      .in('id', ids)
    for (const p of products ?? []) {
      const entry = byProduct.get(p.id)
      if (entry) entry.name = p.name_en
    }
  }

  const bestSellers = [...byProduct.entries()]
    .map(([productId, v]) => ({ productId, ...v, revenue: Number(v.revenue.toFixed(2)) }))
    .sort((a, b) => b.quantity - a.quantity)

  return NextResponse.json({
    days,
    location,
    orderCount,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    bestSellers,
  })
}
