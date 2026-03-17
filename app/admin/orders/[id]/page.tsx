'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CreditCard, User, Phone, Mail, Clock, FileText, ExternalLink } from 'lucide-react'
import OrderStatusBadge from '@/components/admin/OrderStatusBadge'
import OrderStatusSelect from '@/components/admin/OrderStatusSelect'
import { toast } from 'sonner'

interface OrderDetail {
  id: string
  items: any[]
  customer_name: string
  customer_email: string
  customer_phone: string
  subtotal: number
  total: number
  pickup_time: string
  status: string
  payment_method: string
  stripe_payment_intent_id: string | null
  stripe_payment_status: string | null
  stripe_amount_received: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [order, setOrder] = useState<OrderDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  async function fetchOrder() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single()

    if (error || !data) {
      setLoading(false)
      return
    }

    setOrder(data)
    setNotes(data.notes || '')
    setLoading(false)
  }

  async function saveNotes() {
    setSavingNotes(true)
    const res = await fetch('/api/admin/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderId, notes }),
    })

    if (res.ok) {
      toast.success('Notities opgeslagen')
    } else {
      toast.error('Opslaan mislukt')
    }
    setSavingNotes(false)
  }

  const handleStatusChange = (_id: string, newStatus: string) => {
    setOrder((prev) => prev ? { ...prev, status: newStatus } : null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 font-lato mb-4">Bestelling niet gevonden</p>
        <Link href="/admin/orders" className="text-tomato hover:underline font-oswald">
          Terug naar bestellingen
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/orders"
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-500" />
        </Link>
        <div className="flex-1">
          <h1 className="font-oswald text-2xl uppercase tracking-wider text-espresso">
            {order.id}
          </h1>
          <p className="text-gray-500 font-lato text-sm">{formatDate(order.created_at)}</p>
        </div>
        <OrderStatusSelect
          orderId={order.id}
          currentStatus={order.status}
          onStatusChange={handleStatusChange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Order Items */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4">Bestelde items</h2>
            <div className="space-y-3">
              {Array.isArray(order.items) && order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-start font-lato text-sm">
                  <div className="flex gap-2">
                    <span className="font-bold text-tomato">{item.quantity}x</span>
                    <span className="text-espresso">
                      {item.name}
                      {item.size ? ` (${item.size === 'large' ? 'Groot' : 'Klein'})` : ''}
                      {item.sizeLabel ? ` (${item.sizeLabel})` : ''}
                    </span>
                  </div>
                  <span className="text-gray-600">&euro;{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 mt-4 pt-3">
              <div className="flex justify-between font-oswald text-lg text-espresso">
                <span>Totaal</span>
                <span>&euro;{Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Notities
            </h2>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded font-lato text-sm focus:border-tomato focus:ring-1 focus:ring-tomato outline-none resize-none"
              placeholder="Voeg notities toe..."
            />
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="mt-2 px-4 py-2 bg-espresso text-white rounded text-sm font-oswald uppercase tracking-wider hover:bg-gray-700 transition disabled:opacity-50"
            >
              {savingNotes ? 'Opslaan...' : 'Opslaan'}
            </button>
          </div>
        </div>

        {/* Right: Customer & Payment */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4">Klantgegevens</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 font-lato text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span>{order.customer_name || '-'}</span>
              </div>
              <div className="flex items-center gap-3 font-lato text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${order.customer_email}`} className="text-tomato hover:underline">
                  {order.customer_email || '-'}
                </a>
              </div>
              <div className="flex items-center gap-3 font-lato text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <a href={`tel:${order.customer_phone}`} className="text-tomato hover:underline">
                  {order.customer_phone || '-'}
                </a>
              </div>
              <div className="flex items-center gap-3 font-lato text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Ophalen: <strong>{order.pickup_time || '-'}</strong></span>
              </div>
            </div>
          </div>

          {/* Payment Proof */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
            <h2 className="font-oswald text-lg uppercase tracking-wider text-espresso mb-4 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Betaalbewijs
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between font-lato text-sm">
                <span className="text-gray-500">Methode</span>
                <span className="capitalize font-medium">{order.payment_method}</span>
              </div>

              {order.payment_method === 'stripe' && (
                <>
                  <div className="flex justify-between font-lato text-sm">
                    <span className="text-gray-500">Status</span>
                    <span className={`font-medium ${
                      order.stripe_payment_status === 'succeeded'
                        ? 'text-green-600'
                        : order.stripe_payment_status === 'failed'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      {order.stripe_payment_status === 'succeeded' ? 'Betaald' :
                       order.stripe_payment_status === 'failed' ? 'Mislukt' :
                       order.stripe_payment_status || 'In afwachting'}
                    </span>
                  </div>

                  {order.stripe_amount_received && (
                    <div className="flex justify-between font-lato text-sm">
                      <span className="text-gray-500">Ontvangen bedrag</span>
                      <span className="font-bold text-green-600">
                        &euro;{(order.stripe_amount_received / 100).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {order.stripe_payment_intent_id && (
                    <div className="flex justify-between items-center font-lato text-sm">
                      <span className="text-gray-500">Payment ID</span>
                      <a
                        href={`https://dashboard.stripe.com/payments/${order.stripe_payment_intent_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-tomato hover:underline flex items-center gap-1 font-mono text-xs"
                      >
                        {order.stripe_payment_intent_id.substring(0, 20)}...
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </>
              )}

              {order.payment_method === 'cash' && (
                <div className="bg-yellow-50 text-yellow-700 p-3 rounded text-sm font-lato">
                  Contante betaling bij ophalen
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
