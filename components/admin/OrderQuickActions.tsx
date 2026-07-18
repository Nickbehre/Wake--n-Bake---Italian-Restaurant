'use client'

import { useState } from 'react'
import { Check, X, Loader2, ShoppingBag, ChefHat } from 'lucide-react'
import { toast } from 'sonner'

interface OrderQuickActionsProps {
  orderId: string
  status: string
  onStatusChange?: (orderId: string, newStatus: string) => void
}

/**
 * Snelknoppen per status zodat personeel niet elke order hoeft te openen:
 * pending → Confirm/Cancel, confirmed → Start prep, preparing → Ready,
 * ready → Picked up. (DB-statuswaarden blijven ongewijzigd.)
 */
export default function OrderQuickActions({ orderId, status, onStatusChange }: OrderQuickActionsProps) {
  const [loading, setLoading] = useState(false)

  async function setStatus(newStatus: string, successMsg: string) {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status: newStatus }),
      })
      if (res.ok) {
        onStatusChange?.(orderId, newStatus)
        toast.success(successMsg)
      } else {
        toast.error('Could not change status')
      }
    } catch {
      toast.error('Could not change status')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
  }

  const btn = 'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-oswald uppercase tracking-wider transition text-white'

  switch (status) {
    case 'pending':
      return (
        <div className="flex items-center gap-2">
          <button onClick={() => setStatus('confirmed', 'Order confirmed!')} className={`${btn} bg-green-500 hover:bg-green-600`} title="Confirm">
            <Check className="w-3.5 h-3.5" /> Confirm
          </button>
          <button onClick={() => setStatus('cancelled', 'Order cancelled')} className={`${btn} bg-red-500 hover:bg-red-600`} title="Cancel">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      )
    case 'confirmed':
      return (
        <button onClick={() => setStatus('preparing', 'Preparation started')} className={`${btn} bg-orange-500 hover:bg-orange-600`} title="Start preparing">
          <ChefHat className="w-3.5 h-3.5" /> Start prep
        </button>
      )
    case 'preparing':
      return (
        <button onClick={() => setStatus('ready', 'Marked ready for pickup')} className={`${btn} bg-emerald-500 hover:bg-emerald-600`} title="Ready for pickup">
          <Check className="w-3.5 h-3.5" /> Ready
        </button>
      )
    case 'ready':
      return (
        <button onClick={() => setStatus('completed', 'Order picked up')} className={`${btn} bg-gray-500 hover:bg-gray-600`} title="Picked up">
          <ShoppingBag className="w-3.5 h-3.5" /> Picked up
        </button>
      )
    default:
      return <span className="text-gray-300 text-xs">—</span>
  }
}
