'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import { useLocation } from '@/lib/context/LocationContext'
import { useLanguage } from '@/lib/context/LanguageContext'
import { LOCATIONS, checkIsOpen, LocationId } from '@/lib/data/locations'
import { MOTION_EASE } from '@/lib/animation/gsap'
import MiniMap from '@/components/location/MiniMap'

interface LocationToggleProps {
  /** 'light' op donkere hero, 'dark' op lichte achtergrond */
  variant?: 'light' | 'dark'
  /** Volle breedte + altijd zichtbare info (mobiel menu) */
  expanded?: boolean
}

export default function LocationToggle({
  variant = 'dark',
  expanded = false,
}: LocationToggleProps) {
  const { locationId, switchLocation, phase } = useLocation()
  const { t, language } = useLanguage()
  const [hovered, setHovered] = useState<LocationId | null>(null)
  const [openStatus, setOpenStatus] = useState<Record<LocationId, boolean>>({
    original: false,
    express: false,
  })

  useEffect(() => {
    const update = () =>
      setOpenStatus({
        original: checkIsOpen(LOCATIONS.original),
        express: checkIsOpen(LOCATIONS.express),
      })
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [])

  const light = variant === 'light' && !expanded
  const previewId: LocationId | null =
    hovered && hovered !== locationId ? hovered : null
  const preview = previewId ? LOCATIONS[previewId] : null

  const segment = (id: LocationId) => {
    const active = id === locationId
    const loc = LOCATIONS[id]
    return (
      <button
        key={id}
        onClick={() => switchLocation(id)}
        onMouseEnter={() => setHovered(id)}
        onFocus={() => setHovered(id)}
        onBlur={() => setHovered(null)}
        disabled={phase !== 'idle'}
        aria-pressed={active}
        aria-label={`${loc.name} — ${loc.address.street}, ${loc.address.area}`}
        data-cursor="link"
        className={`relative z-10 px-3 xl:px-4 py-1.5 rounded-full font-oswald font-semibold uppercase tracking-wider text-xs xl:text-sm whitespace-nowrap transition-colors duration-300 cursor-pointer ${
          active
            ? 'text-white'
            : light
              ? 'text-white/80 hover:text-white'
              : 'text-espresso/70 hover:text-espresso'
        }`}
      >
        {active && (
          <motion.span
            layoutId={`loc-thumb-${expanded ? 'mobile' : 'desktop'}`}
            className="absolute inset-0 rounded-full bg-accent shadow-md -z-10"
            transition={{ duration: 0.45, ease: MOTION_EASE.inOut }}
          />
        )}
        <span className="inline-flex items-center gap-1.5">
          {active && <MapPin className="w-3 h-3" />}
          {t(`loc.${id}.label`)}
          {loc.isNew && (
            <span
              className={`px-1.5 py-px rounded-full bg-crust text-espresso text-[9px] xl:text-[10px] font-bold tracking-widest rotate-3 ${
                active ? '' : 'animate-pulse'
              }`}
            >
              {t('loc.badge.new')}
            </span>
          )}
        </span>
      </button>
    )
  }

  return (
    <div
      className={`relative ${expanded ? 'w-full' : ''}`}
      onMouseLeave={() => setHovered(null)}
    >
      <div
        role="group"
        aria-label={t('loc.switch')}
        className={`flex items-center gap-1 p-1 rounded-full border backdrop-blur-md transition-colors duration-300 ${
          expanded ? 'w-full justify-center' : ''
        } ${
          light
            ? 'bg-white/10 border-white/25'
            : 'bg-espresso/5 border-espresso/15'
        }`}
      >
        {segment('original')}
        {segment('express')}
      </div>

      {/* Info-popover: maakt direct duidelijk dat dit een ANDERE locatie is */}
      <AnimatePresence>
        {(preview || expanded) && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.25, ease: MOTION_EASE.out }}
            className={
              expanded
                ? 'mt-3 w-full'
                : 'absolute top-full right-0 mt-3 w-72 z-50'
            }
          >
            {(() => {
              const info = preview ?? LOCATIONS[locationId === 'original' ? 'express' : 'original']
              const infoIsOpen = openStatus[info.id]
              return (
                <div className="bg-flour rounded-2xl shadow-2xl border border-espresso/10 p-4 text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-white font-oswald uppercase tracking-widest text-[10px]"
                      style={{ backgroundColor: info.accent.hex }}
                    >
                      <MapPin className="w-3 h-3" />
                      {t('loc.badge.otherLocation')}
                    </span>
                    {info.isNew && (
                      <span className="px-2 py-1 rounded-full bg-crust text-espresso font-oswald font-bold uppercase tracking-widest text-[10px] rotate-2">
                        {t('loc.badge.new')}
                      </span>
                    )}
                  </div>

                  <MiniMap accentHex={info.accent.hex} variant={info.id} />

                  <div className="mt-3 mb-1 font-stamp text-xl" style={{ color: info.accent.hex }}>
                    {info.name}
                  </div>
                  <p className="font-lato text-sm text-espresso/80">
                    {info.address.street}, {info.address.postalCode}{' '}
                    {info.address.city} · {info.address.area}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-xs font-oswald uppercase tracking-wide text-espresso/70">
                    <span
                      className={`w-2 h-2 rounded-full ${infoIsOpen ? 'bg-pistachio' : 'bg-tomato'}`}
                    />
                    {infoIsOpen ? t('location.openNow') : t('location.closed')}
                    <span className="text-espresso/30">·</span>
                    <Clock className="w-3 h-3" />
                    {info.hoursDisplay[language][0]}
                  </div>

                  {info.isPlaceholder && (
                    <p className="mt-2 text-[11px] font-lato italic text-espresso/50">
                      {t('loc.placeholderNote')}
                    </p>
                  )}

                  <button
                    onClick={() => switchLocation(info.id)}
                    disabled={phase !== 'idle'}
                    data-cursor="link"
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-full text-white font-oswald font-bold uppercase tracking-wider text-sm transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
                    style={{ backgroundColor: info.accent.hex }}
                  >
                    {t('loc.switchTo')} {t(`loc.${info.id}.label`)}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
