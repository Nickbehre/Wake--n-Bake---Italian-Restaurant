'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ShoppingBag, Euro, Clock, TrendingUp, ChevronRight, AlertCircle, Flame } from 'lucide-react'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

function getUrgency(order: OrderRow): { level: 'critical' | 'high' | 'medium' | 'low'; label: string; color: string; bg: string } {
  const now = new Date()
  const created = new Date(order.created_at)
  const minutesSinceCreated = Math.floor((now.getTime() - created.getTime()) / 60000)

  if (order.status === 'ready' || order.status === 'picked_up' || order.status === 'cancelled') {
    return { level: 'low', label: '', color: '', bg: '' }
  }

  // If pending for more than 10 min → critical
  if (order.status === 'pending' && minutesSinceCreated > 10) {
    return { level: 'critical', label: `${minutesSinceCreated}m waiting`, color: 'text-red-700', bg: 'bg-red-100' }
  }
  // If pending for more than 3 min → high
  if (order.status === 'pending' && minutesSinceCreated > 3) {
    return { level: 'high', label: `${minutesSinceCreated}m waiting`, color: 'text-orange-700', bg: 'bg-orange-100' }
  }
  // If pending less than 3 min → medium
  if (order.status === 'pending') {
    return { level: 'medium', label: 'New', color: 'text-yellow-700', bg: 'bg-yellow-100' }
  }
  // If preparing for more than 15 min
  if (order.status === 'preparing' && minutesSinceCreated > 15) {
    return { level: 'high', label: `${minutesSinceCreated}m in prep`, color: 'text-orange-700', bg: 'bg-orange-100' }
  }
  if (order.status === 'confirmed' && minutesSinceCreated > 5) {
    return { level: 'medium', label: 'Start prep', color: 'text-yellow-700', bg: 'bg-yellow-100' }
  }
  return { level: 'low', label: '', color: '', bg: '' }
}

function formatTime(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

function timeAgo(dateStr: string): string {
  const now = new Date()
  const d = new Date(dateStr)
  const mins = Math.floor((now.getTime() - d.getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  return `${hrs}h ${mins % 60}m ago`
}

interface OrderRow {
  id: string
  customer_name: string
  total: number
  status: string
  pickup_time: string
  payment_method: string
  created_at: string
  items: any[]
  location: string | null
}

interface Stats {
  todayOrders: number
  todayRevenue: number
  pendingCount: number
  preparingCount: number
  readyCount: number
}

// Live-secties per filiaal. Orders zonder location (van vóór de
// locatie-kolom) tellen bij Panificio — dat was toen het enige
// filiaal met online bestellen.
const SHOP_SECTIONS = [
  {
    id: 'original',
    name: "Panificio · Vijzelstraat",
    accent: '#CE2029',
    match: (o: OrderRow) => o.location !== 'express',
  },
  {
    id: 'express',
    name: "Xpress · Heisteeg",
    accent: '#5E9C42',
    match: (o: OrderRow) => o.location === 'express',
  },
] as const

const ACTIVE_STATUSES = ['pending', 'confirmed', 'preparing', 'ready']

export default function AdminDashboard() {
  const [todaysOrders, setTodaysOrders] = useState<OrderRow[]>([])
  const [stats, setStats] = useState<Stats>({
    todayOrders: 0,
    todayRevenue: 0,
    pendingCount: 0,
    preparingCount: 0,
    readyCount: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()

    // Realtime subscription
    const channel = supabase
      .channel('admin-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchData()
      })
      .subscribe()

    // Elke minuut verversen zodat wachttijd-labels ("5m waiting") kloppen
    const tick = setInterval(fetchData, 60_000)

    return () => {
      supabase.removeChannel(channel)
      clearInterval(tick)
    }
  }, [])

  async function fetchData() {
    // Get today's date in Dutch timezone (handles CET/CEST automatically)
    const dutchDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Amsterdam' }).format(new Date())
    // Calculate Amsterdam's UTC offset dynamically
    const ref = new Date(`${dutchDate}T12:00:00Z`)
    const amsterdamHour = parseInt(new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Amsterdam', hour: 'numeric', hour12: false }).format(ref))
    const offsetHours = amsterdamHour - 12 // 1 for CET, 2 for CEST
    // Convert Amsterdam midnight/end-of-day to UTC
    const startOfDay = new Date(new Date(`${dutchDate}T00:00:00Z`).getTime() - offsetHours * 3600000).toISOString()
    const endOfDay = new Date(new Date(`${dutchDate}T23:59:59.999Z`).getTime() - offsetHours * 3600000).toISOString()

    // Fetch today's orders (stats + live per-shop sections)
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)
      .order('created_at', { ascending: false })

    if (todayOrders) {
      const paidStatuses = ['confirmed', 'preparing', 'ready', 'picked_up']
      setStats({
        todayOrders: todayOrders.filter((o) => o.status !== 'cancelled').length,
        todayRevenue: todayOrders
          .filter((o) => paidStatuses.includes(o.status))
          .reduce((sum, o) => sum + Number(o.total), 0),
        pendingCount: todayOrders.filter((o) => o.status === 'pending').length,
        preparingCount: todayOrders.filter((o) => o.status === 'preparing').length,
        readyCount: todayOrders.filter((o) => o.status === 'ready').length,
      })
      setTodaysOrders(todayOrders)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Dashboard</h1>
        <p className="text-gray-500 font-lato mt-1">Today&apos;s overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-lato">Orders today</p>
              <p className="font-oswald text-3xl text-espresso mt-1">{stats.todayOrders}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-full">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-lato">Revenue today</p>
              <p className="font-oswald text-3xl text-espresso mt-1">&euro;{stats.todayRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-full">
              <Euro className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-lato">Pending / Preparing</p>
              <p className="font-oswald text-3xl text-espresso mt-1">
                {stats.pendingCount} / {stats.preparingCount}
              </p>
            </div>
            <div className="bg-yellow-50 p-3 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-lato">Ready for pickup</p>
              <p className="font-oswald text-3xl text-espresso mt-1">{stats.readyCount}</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Urgent: Pending Orders */}
      {stats.pendingCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <p className="text-yellow-800 font-lato text-sm">
            <strong>{stats.pendingCount} order(s)</strong> waiting for confirmation.
          </p>
          <Link
            href="/admin/orders?status=pending"
            className="ml-auto text-yellow-700 hover:text-yellow-900 font-oswald uppercase text-xs tracking-wider"
          >
            View &rarr;
          </Link>
        </div>
      )}

      {/* Live orders per filiaal */}
      {SHOP_SECTIONS.map((shop) => {
        const shopOrders = todaysOrders.filter(shop.match)
        const activeCount = shopOrders.filter((o) => ACTIVE_STATUSES.includes(o.status)).length
        return (
          <div key={shop.id} className="bg-white rounded-lg shadow-sm border border-gray-100">
            <div
              className="flex items-center justify-between p-6 border-b border-gray-100 border-t-4 rounded-t-lg"
              style={{ borderTopColor: shop.accent }}
            >
              <div className="flex items-center gap-3">
                {/* Live-indicator */}
                <span className="relative flex h-3 w-3">
                  <span
                    className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${activeCount > 0 ? 'animate-ping' : ''}`}
                    style={{ backgroundColor: shop.accent }}
                  />
                  <span className="relative inline-flex rounded-full h-3 w-3" style={{ backgroundColor: shop.accent }} />
                </span>
                <div>
                  <h2 className="font-oswald text-xl uppercase tracking-wider text-espresso">{shop.name}</h2>
                  <p className="text-xs text-gray-400 font-lato">
                    {activeCount > 0
                      ? `${activeCount} active order${activeCount !== 1 ? 's' : ''} · live`
                      : `No active orders · ${shopOrders.length} today`}
                  </p>
                </div>
              </div>
              <Link
                href="/admin/orders"
                className="text-tomato hover:text-red-700 font-oswald uppercase text-sm tracking-wider flex items-center gap-1"
              >
                All orders <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {shopOrders.length === 0 ? (
              <div className="p-10 text-center text-gray-400 font-lato">
                No orders today
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Urgency</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Order</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Customer</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Items</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Total</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Pickup</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Received</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {shopOrders.slice(0, 10).map((order) => {
                      const urgency = getUrgency(order)
                      const itemCount = Array.isArray(order.items) ? order.items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0) : 0
                      return (
                        <tr
                          key={order.id}
                          className={`hover:bg-gray-50 transition ${urgency.level === 'critical' ? 'bg-red-50/50' : urgency.level === 'high' ? 'bg-orange-50/30' : ''}`}
                        >
                          <td className="px-6 py-4">
                            {urgency.label ? (
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${urgency.color} ${urgency.bg}`}>
                                {urgency.level === 'critical' && <Flame className="w-3 h-3" />}
                                {urgency.label}
                              </span>
                            ) : (
                              <span className="text-gray-300 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Link href={`/admin/orders/${order.id}`} className="text-tomato hover:underline font-mono text-sm">
                              {order.id}
                            </Link>
                          </td>
                          <td className="px-6 py-4 font-lato text-sm">{order.customer_name || '-'}</td>
                          <td className="px-6 py-4 font-lato text-sm text-gray-600">{itemCount} item{itemCount !== 1 ? 's' : ''}</td>
                          <td className="px-6 py-4 font-lato text-sm font-bold">&euro;{Number(order.total).toFixed(2)}</td>
                          <td className="px-6 py-4 font-lato text-sm">{order.pickup_time || '-'}</td>
                          <td className="px-6 py-4 font-lato text-sm">
                            <div className="text-espresso">{formatTime(order.created_at)}</div>
                            <div className="text-gray-400 text-xs">{timeAgo(order.created_at)}</div>
                          </td>
                          <td className="px-6 py-4">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 font-lato text-sm capitalize">{order.payment_method}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {shopOrders.length > 10 && (
                  <p className="px-6 py-3 text-xs text-gray-400 font-lato border-t border-gray-50">
                    Showing latest 10 of {shopOrders.length} orders today.
                  </p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
