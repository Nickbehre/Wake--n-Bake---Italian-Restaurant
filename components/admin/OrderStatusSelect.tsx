'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const statusOptions = [
  { value: 'pending', label: 'New order' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready', label: 'Ready for pickup' },
  { value: 'completed', label: 'Picked up' },
  { value: 'cancelled', label: 'Cancelled' },
]

interface OrderStatusSelectProps {
  orderId: string
  currentStatus: string
  onStatusChange?: (orderId: string, newStatus: string) => void
}

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  onStatusChange,
}: OrderStatusSelectProps) {
  const [loading, setLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return

    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })

      if (res.ok) {
        onStatusChange?.(orderId, newStatus)
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        className="appearance-none bg-white border border-gray-300 rounded px-3 py-1.5 pr-8 text-sm font-lato cursor-pointer focus:border-tomato focus:ring-1 focus:ring-tomato outline-none disabled:opacity-50"
      >
        {statusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {loading && <Loader2 className="w-4 h-4 animate-spin text-tomato absolute right-2" />}
    </div>
  )
}
