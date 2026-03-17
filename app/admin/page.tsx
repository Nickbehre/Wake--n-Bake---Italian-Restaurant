'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ShoppingBag, Euro, Clock, TrendingUp, ChevronRight, AlertCircle } from 'lucide-react'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'

interface OrderRow {
  id: string
  customer_name: string
  total: number
  status: string
  pickup_time: string
  payment_method: string
  created_at: string
  items: any[]
}

interface Stats {
  todayOrders: number
  todayRevenue: number
  pendingCount: number
  preparingCount: number
  readyCount: number
}

export default function AdminDashboard() {
  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([])
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

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchData() {
    const today = new Date().toISOString().split('T')[0]
    const startOfDay = `${today}T00:00:00.000Z`
    const endOfDay = `${today}T23:59:59.999Z`

    // Fetch today's orders for stats
    const { data: todayOrders } = await supabase
      .from('orders')
      .select('*')
      .gte('created_at', startOfDay)
      .lte('created_at', endOfDay)

    // Fetch recent orders
    const { data: recent } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10)

    if (todayOrders) {
      setStats({
        todayOrders: todayOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total), 0),
        pendingCount: todayOrders.filter((o) => o.status === 'pending').length,
        preparingCount: todayOrders.filter((o) => o.status === 'preparing').length,
        readyCount: todayOrders.filter((o) => o.status === 'ready').length,
      })
    }

    if (recent) setRecentOrders(recent)
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

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="font-oswald text-xl uppercase tracking-wider text-espresso">Recent orders</h2>
          <Link
            href="/admin/orders"
            className="text-tomato hover:text-red-700 font-oswald uppercase text-sm tracking-wider flex items-center gap-1"
          >
            All orders <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-lato">
            No orders yet
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Order</th>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Total</th>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Pickup</th>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link href={`/admin/orders/${order.id}`} className="text-tomato hover:underline font-mono text-sm">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-lato text-sm">{order.customer_name || '-'}</td>
                    <td className="px-6 py-4 font-lato text-sm font-bold">&euro;{Number(order.total).toFixed(2)}</td>
                    <td className="px-6 py-4 font-lato text-sm">{order.pickup_time || '-'}</td>
                    <td className="px-6 py-4">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 font-lato text-sm capitalize">{order.payment_method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
