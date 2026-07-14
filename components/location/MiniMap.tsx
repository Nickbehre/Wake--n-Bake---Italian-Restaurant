'use client'

import { MapPin } from 'lucide-react'
import type { LocationId } from '@/lib/data/locations'

/**
 * Gestileerde mini-map: straatjes, grachten en een pulserende pin.
 * Elk filiaal heeft z'n eigen herkenbare stratenpatroon:
 * - original (Nes): dichte binnenstad-steegjes langs één gracht
 * - express (Heisteeg): diagonale straatjes tussen twee grachten (Singel-kant)
 */
export default function MiniMap({
  accentHex,
  variant = 'original',
  className = 'h-20',
}: {
  accentHex: string
  variant?: LocationId
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
        {variant === 'original' ? (
          <>
            {/* straten — dicht stratennet rond de Nes */}
            <path d="M0 25 L200 18" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="5" />
            <path d="M0 55 L200 62" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="7" />
            <path d="M60 0 L52 80" stroke="#2C2C2C" strokeOpacity="0.10" strokeWidth="4" />
            <path d="M140 0 L150 80" stroke="#2C2C2C" strokeOpacity="0.10" strokeWidth="5" />
            {/* huizenblokken */}
            <rect x="70" y="6" width="18" height="10" rx="2" fill="#2C2C2C" fillOpacity="0.08" transform="rotate(-2 79 11)" />
            <rect x="160" y="66" width="22" height="9" rx="2" fill="#2C2C2C" fillOpacity="0.08" />
            {/* gracht */}
            <path
              d="M0 40 Q100 32 200 44"
              stroke="#9DBFD4"
              strokeOpacity="0.5"
              strokeWidth="6"
              fill="none"
            />
          </>
        ) : (
          <>
            {/* straten — diagonale steegjes tussen Singel en Herengracht */}
            <path d="M0 14 L200 30" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="6" />
            <path d="M0 68 L200 52" stroke="#2C2C2C" strokeOpacity="0.10" strokeWidth="5" />
            <path d="M92 0 L112 80" stroke="#2C2C2C" strokeOpacity="0.12" strokeWidth="5" />
            <path d="M30 80 L48 0" stroke="#2C2C2C" strokeOpacity="0.08" strokeWidth="3" />
            {/* huizenblokken */}
            <rect x="130" y="8" width="26" height="11" rx="2" fill="#2C2C2C" fillOpacity="0.08" transform="rotate(4 143 13)" />
            <rect x="8" y="34" width="16" height="12" rx="2" fill="#2C2C2C" fillOpacity="0.08" />
            {/* twee grachten */}
            <path
              d="M0 52 Q60 60 120 54 T200 62"
              stroke="#9DBFD4"
              strokeOpacity="0.55"
              strokeWidth="7"
              fill="none"
            />
            <path
              d="M0 6 Q80 0 200 10"
              stroke="#9DBFD4"
              strokeOpacity="0.4"
              strokeWidth="5"
              fill="none"
            />
          </>
        )}
      </svg>
      {/* pin */}
      <span
        className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center ${
          variant === 'original' ? 'left-1/2' : 'left-[58%]'
        }`}
      >
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
