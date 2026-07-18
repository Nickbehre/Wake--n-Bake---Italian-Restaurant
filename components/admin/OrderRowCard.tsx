'use client'

import Link from 'next/link'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import OrderQuickActions from '@/components/admin/OrderQuickActions'

export interface OrderCardData {
  id: string
  customer_name: string
  total: number
  status: string
  pickup_time: string
  payment_method: string
  stripe_payment_status?: string | null
  created_at: string
  items: any[]
}

interface OrderRowCardProps {
  order: OrderCardData
  onStatusChange?: (orderId: string, newStatus: string) => void
  /** Bijv. "5m waiting" met kleurklassen, van getUrgency() op het dashboard */
  urgencyLabel?: string
  urgencyClassName?: string
}

function itemsCount(items: any[]): number {
  if (!Array.isArray(items)) return 0
  return items.reduce((sum, i) => sum + (i.quantity || 1), 0)
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

/**
 * Compacte orderkaart voor kleine schermen — vervangt de brede tabellen
 * op het dashboard en de orderspagina (< md).
 */
export default function OrderRowCard({ order, onStatusChange, urgencyLabel, urgencyClassName }: OrderRowCardProps) {
  const count = itemsCount(order.items)
  return (
    <div className="p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <Link href={`/admin/orders/${order.id}`} className="text-tomato hover:underline font-mono text-sm">
            {order.id}
          </Link>
          <p className="font-lato text-sm text-espresso truncate">{order.customer_name || '-'}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-lato text-sm font-bold">&euro;{Number(order.total).toFixed(2)}</p>
          <p className="font-lato text-xs text-gray-400">{count} item{count !== 1 ? 's' : ''} · {formatTime(order.created_at)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-lato text-gray-500">
        {urgencyLabel && (
          <span className={`px-2 py-0.5 rounded-full font-bold ${urgencyClassName ?? ''}`}>{urgencyLabel}</span>
        )}
        <span>Pickup: {order.pickup_time || '-'}</span>
        <span className="capitalize">
          {order.payment_method}
          {order.stripe_payment_status === 'succeeded' && <span className="text-green-600"> · Paid</span>}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2">
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} onStatusChange={onStatusChange} />
        <OrderQuickActions orderId={order.id} status={order.status} onStatusChange={onStatusChange} />
      </div>
    </div>
  )
}
