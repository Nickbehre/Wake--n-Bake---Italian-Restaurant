const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'New order',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  preparing: {
    label: 'Preparing',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  ready: {
    label: 'Ready for pickup',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  completed: {
    label: 'Picked up',
    className: 'bg-gray-100 text-gray-600 border-gray-200',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
}

export default function OrderStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || statusConfig.pending

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-oswald uppercase tracking-wider border ${config.className}`}
    >
      {config.label}
    </span>
  )
}
