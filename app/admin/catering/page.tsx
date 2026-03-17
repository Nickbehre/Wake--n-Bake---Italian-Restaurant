'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, Phone, Calendar, MessageSquare, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ContactRequest {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  status: string
  created_at: string
}

export default function AdminCateringPage() {
  const [requests, setRequests] = useState<ContactRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchRequests()

    const channel = supabase
      .channel('admin-catering')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_requests' }, () => {
        fetchRequests()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function fetchRequests() {
    const res = await fetch('/api/admin/contact-requests')
    const data = await res.json()
    if (data.requests) {
      setRequests(data.requests)
    }
    setLoading(false)
  }

  async function handleAction(id: string, status: 'responded' | 'dismissed') {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/contact-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
        toast.success(status === 'responded' ? 'Marked as responded' : 'Dismissed')
      }
    } catch {
      toast.error('Could not change status')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'responded':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-oswald uppercase">Responded</span>
      case 'dismissed':
        return <span className="px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs font-oswald uppercase">Dismissed</span>
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-oswald uppercase">New</span>
    }
  }

  const getSubjectLabel = (subject: string) => {
    const labels: Record<string, string> = {
      catering: 'Catering',
      bestelling: 'Order',
      feedback: 'Feedback',
      vacature: 'Job application',
      anders: 'Other',
    }
    return labels[subject] || subject
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  const cateringRequests = requests.filter((r) => r.subject === 'catering')
  const otherRequests = requests.filter((r) => r.subject !== 'catering')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-oswald text-3xl uppercase tracking-wider text-espresso">Catering & Messages</h1>
        <p className="text-gray-500 font-lato mt-1">
          {cateringRequests.length} catering request{cateringRequests.length === 1 ? '' : 's'} &middot; {otherRequests.length} other messages
        </p>
      </div>

      {/* Catering Requests */}
      <div>
        <h2 className="font-oswald text-xl uppercase tracking-wider text-espresso mb-4">Catering Requests</h2>
        {cateringRequests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center text-gray-400 font-lato">
            No catering requests
          </div>
        ) : (
          <div className="space-y-4">
            {cateringRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                actionLoading={actionLoading}
                onAction={handleAction}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                getSubjectLabel={getSubjectLabel}
              />
            ))}
          </div>
        )}
      </div>

      {/* Other Contact Requests */}
      {otherRequests.length > 0 && (
        <div>
          <h2 className="font-oswald text-xl uppercase tracking-wider text-espresso mb-4">Other Messages</h2>
          <div className="space-y-4">
            {otherRequests.map((req) => (
              <RequestCard
                key={req.id}
                request={req}
                actionLoading={actionLoading}
                onAction={handleAction}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
                getSubjectLabel={getSubjectLabel}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function RequestCard({
  request,
  actionLoading,
  onAction,
  formatDate,
  getStatusBadge,
  getSubjectLabel,
}: {
  request: ContactRequest
  actionLoading: string | null
  onAction: (id: string, status: 'responded' | 'dismissed') => void
  formatDate: (d: string) => string
  getStatusBadge: (s: string) => React.ReactNode
  getSubjectLabel: (s: string) => string
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 bg-espresso/10 text-espresso rounded text-xs font-oswald uppercase">
            {getSubjectLabel(request.subject)}
          </span>
          {getStatusBadge(request.status)}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400 font-lato">
          <Calendar className="w-3.5 h-3.5" />
          {formatDate(request.created_at)}
        </div>
      </div>

      <h3 className="font-oswald text-lg text-espresso mb-2">{request.name}</h3>

      <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-500 font-lato">
        <a href={`mailto:${request.email}`} className="flex items-center gap-1.5 hover:text-tomato transition">
          <Mail className="w-4 h-4" />
          {request.email}
        </a>
        {request.phone && (
          <a href={`tel:${request.phone}`} className="flex items-center gap-1.5 hover:text-tomato transition">
            <Phone className="w-4 h-4" />
            {request.phone}
          </a>
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-2">
          <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-700 font-lato whitespace-pre-wrap">{request.message}</p>
        </div>
      </div>

      {request.status === 'new' && (
        <div className="flex items-center gap-2">
          {actionLoading === request.id ? (
            <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
          ) : (
            <>
              <button
                onClick={() => onAction(request.id, 'responded')}
                className="flex items-center gap-1.5 px-4 py-2 bg-green-500 text-white rounded-lg text-xs font-oswald uppercase tracking-wider hover:bg-green-600 transition"
              >
                <Check className="w-3.5 h-3.5" />
                Responded
              </button>
              <button
                onClick={() => onAction(request.id, 'dismissed')}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500 text-white rounded-lg text-xs font-oswald uppercase tracking-wider hover:bg-red-600 transition"
              >
                <X className="w-3.5 h-3.5" />
                Dismiss
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
