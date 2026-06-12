'use client'

import { MapPin } from 'lucide-react'

/** Gestileerde mini-map: straatjes, een gracht en een pulserende pin. */
export default function MiniMap({
  accentHex,
  className = 'h-20',
}: {
  accentHex: string
  className?: string
}) {
  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-flour border border-espresso/10 ${className}`}
    >
      <svg
        viewBox="0 0 200 80"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        {/* straten */}
        <path d="M0 25 L200 18" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="5" />
        <path d="M0 55 L200 62" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="7" />
        <path d="M60 0 L52 80" stroke="#2C2C2C" strokeOpacity="0.10" strokeWidth="4" />
        <path d="M140 0 L150 80" stroke="#2C2C2C" strokeOpacity="0.10" strokeWidth="5" />
        {/* gracht */}
        <path
          d="M0 40 Q100 32 200 44"
          stroke="#9DBFD4"
          strokeOpacity="0.5"
          strokeWidth="6"
          fill="none"
        />
      </svg>
      {/* pin */}
      <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
        <span
          className="absolute w-8 h-8 rounded-full animate-ping opacity-30"
          style={{ backgroundColor: accentHex }}
        />
        <span
          className="relative w-6 h-6 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: accentHex }}
        >
          <MapPin className="w-3.5 h-3.5 text-white" />
        </span>
      </span>
    </div>
  )
}
