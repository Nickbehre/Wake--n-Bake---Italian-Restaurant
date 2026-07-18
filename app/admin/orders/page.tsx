'use client'

import { Suspense, useEffect, useState, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Bell, BellOff } from 'lucide-react'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import OrderQuickActions from '@/components/admin/OrderQuickActions'
import OrderRowCard from '@/components/admin/OrderRowCard'
import { dutchDayBounds, dutchLastDaysBounds } from '@/lib/utils/dutch-time'
import { toast } from 'sonner'

interface OrderRow {
  id: string
  customer_name: string
  customer_email: string
  total: number
  status: string
  pickup_time: string
  payment_method: string
  stripe_payment_status: string | null
  created_at: string
  items: any[]
}

const STATUS_FILTERS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'New order' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready for pickup' },
  { value: 'completed', label: 'Picked up' },
  { value: 'cancelled', label: 'Cancelled' },
]

type DateRange = 'today' | 'week' | 'all'

const DATE_FILTERS: { value: DateRange; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'Last 7 days' },
  { value: 'all', label: 'All' },
]

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    }>
      <AdminOrdersContent />
    </Suspense>
  )
}

function AdminOrdersContent() {
  const searchParams = useSearchParams()
  const [orders, setOrders] = useState<OrderRow[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all')
  const [dateRange, setDateRange] = useState<DateRange>('today')
  const [searchQuery, setSearchQuery] = useState('')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const orderCountRef = useRef(0)
  const supabase = createClient()

  const fetchOrders = useCallback(async () => {
    const params = new URLSearchParams()
    if (statusFilter !== 'all') params.set('status', statusFilter)
    if (searchQuery) params.set('search', searchQuery)
    // Daggrenzen in Amsterdamse tijd
    if (dateRange === 'today') {
      const { start, end } = dutchDayBounds()
      params.set('from', start)
      params.set('to', end)
      params.set('limit', '200')
    } else if (dateRange === 'week') {
      const { start, end } = dutchLastDaysBounds(7)
      params.set('from', start)
      params.set('to', end)
      params.set('limit', '200')
    }

    const res = await fetch(`/api/admin/orders?${params.toString()}`)
    const data = await res.json()

    if (data.orders) {
      // Check for new orders and play sound
      if (orderCountRef.current > 0 && data.orders.length > orderCountRef.current && soundEnabled) {
        playNotificationSound()
        toast.success('New order received!', {
          duration: 5000,
        })
      }
      orderCountRef.current = data.orders.length
      setOrders(data.orders)
      setTotal(data.total ?? data.orders.length)
    }
    setLoading(false)
  }, [statusFilter, searchQuery, dateRange, soundEnabled])

  useEffect(() => {
    fetchOrders()

    // Realtime subscription
    const channel = supabase
      .channel('admin-orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchOrders])

  function playNotificationSound() {
    try {
      if (!audioRef.current) {
        audioRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbsGczHjiR08/JbDs9MIe6z9nKfkw3PXuoud7EimQ1MpW44ciGaTE0')
      }
      audioRef.current.play().catch(() => {})
    } catch {
      // Audio not supported
    }
  }

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    )
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const itemsCount = (items: any[]) => {
    if (!Array.isArray(items)) return 0
    return items.reduce((sum, i) => sum + (i.quantity || 1), 0)
  }

  const rangeLabel = DATE_FILTERS.find((f) => f.value === dateRange)?.label ?? ''

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Orders</h1>
          <p className="text-gray-500 font-lato mt-1">
            {loading ? '…' : `${total} order${total !== 1 ? 's' : ''}`} · {rangeLabel}
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-oswald uppercase tracking-wider transition ${
            soundEnabled
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-gray-50 text-gray-500 border border-gray-200'
          }`}
        >
          {soundEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
          Sound {soundEnabled ? 'on' : 'off'}
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Periode */}
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1 self-start">
          {DATE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setDateRange(f.value)}
              className={`px-4 py-1.5 rounded-md font-oswald uppercase text-xs tracking-wider transition whitespace-nowrap ${
                dateRange === f.value ? 'bg-espresso text-white' : 'text-espresso/60 hover:text-espresso'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by order ID or customer name..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-gray-300 rounded-lg px-3 py-2.5 font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none cursor-pointer"
          >
            {STATUS_FILTERS.map((f) => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-400 font-lato">
            No orders found{dateRange !== 'all' ? ` (${rangeLabel.toLowerCase()})` : ''}
          </div>
        ) : (
          <>
            {/* Mobiel: kaarten */}
            <div className="md:hidden divide-y divide-gray-100">
              {orders.map((order) => (
                <OrderRowCard key={order.id} order={order} onStatusChange={handleStatusChange} />
              ))}
            </div>

            {/* Desktop: tabel */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Order</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Customer</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Items</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Total</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Pickup</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Status</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Payment</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 font-oswald uppercase text-xs text-gray-500 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <Link href={`/admin/orders/${order.id}`} className="text-tomato hover:underline font-mono text-sm">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-lato text-sm">{order.customer_name || '-'}</div>
                        <div className="font-lato text-xs text-gray-400">{order.customer_email || ''}</div>
                      </td>
                      <td className="px-6 py-4 font-lato text-sm">{itemsCount(order.items)}</td>
                      <td className="px-6 py-4 font-lato text-sm font-bold">&euro;{Number(order.total).toFixed(2)}</td>
                      <td className="px-6 py-4 font-lato text-sm">{order.pickup_time || '-'}</td>
                      <td className="px-6 py-4">
                        <OrderStatusSelect
                          orderId={order.id}
                          currentStatus={order.status}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-lato text-xs capitalize">{order.payment_method}</div>
                        {order.stripe_payment_status && (
                          <div className={`font-lato text-xs ${
                            order.stripe_payment_status === 'succeeded' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {order.stripe_payment_status === 'succeeded' ? 'Paid' : order.stripe_payment_status}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 font-lato text-xs text-gray-500">{formatDate(order.created_at)}</td>
                      <td className="px-6 py-4">
                        <OrderQuickActions orderId={order.id} status={order.status} onStatusChange={handleStatusChange} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
