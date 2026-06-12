'use client'

import { useEffect, useState } from 'react'
import { MapPin, Clock, ArrowRight, Sparkles, Check } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import {
  LOCATIONS,
  checkIsOpen,
  LocationId,
  RestaurantLocation,
} from '@/lib/data/locations'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import Magnetic from '@/components/animation/Magnetic'
import MiniMap from '@/components/location/MiniMap'

function LocationCard({
  loc,
  isActive,
  isOpen,
  onSwitch,
}: {
  loc: RestaurantLocation
  isActive: boolean
  isOpen: boolean
  onSwitch: () => void
}) {
  const { t, language } = useLanguage()

  return (
    <div
      className={`relative group bg-flour rounded-3xl p-6 md:p-8 transition-all duration-500 border-2 ${
        isActive
          ? 'shadow-2xl scale-[1.01]'
          : 'border-transparent shadow-lg hover:shadow-2xl hover:-translate-y-1'
      }`}
      style={isActive ? { borderColor: loc.accent.hex } : undefined}
    >
      {/* Badges */}
      <div className="flex items-center justify-between mb-5">
        <span
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-white font-oswald uppercase tracking-widest text-[11px]"
          style={{ backgroundColor: loc.accent.hex }}
        >
          <MapPin className="w-3 h-3" />
          {loc.address.area}
        </span>
        <div className="flex items-center gap-2">
          {loc.isNew && (
            <span className="px-2.5 py-1 rounded-full bg-crust text-espresso font-oswald font-bold uppercase tracking-widest text-[11px] rotate-2">
              {t('loc.badge.new')}
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-espresso text-flour font-oswald uppercase tracking-widest text-[11px]">
              <Check className="w-3 h-3" />
              {t('loc.youAreHere')}
            </span>
          )}
        </div>
      </div>

      <MiniMap accentHex={loc.accent.hex} className="h-28 md:h-32" />

      <h3 className="font-stamp text-2xl md:text-3xl mt-5 mb-2" style={{ color: loc.accent.hex }}>
        {loc.name}
      </h3>

      <p className="font-lato text-espresso/80 mb-3">
        {loc.address.street}, {loc.address.postalCode} {loc.address.city}
      </p>

      <div className="flex items-center gap-2 text-xs font-oswald uppercase tracking-wide text-espresso/70 mb-1">
        <span className={`w-2 h-2 rounded-full ${isOpen ? 'bg-pistachio' : 'bg-tomato'}`} />
        {isOpen ? t('location.openNow') : t('location.closed')}
      </div>
      <div className="flex items-start gap-2 text-sm text-espresso/70 font-lato">
        <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>
          {loc.hoursDisplay[language].slice(0, 2).map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </div>

      {loc.isPlaceholder && (
        <p className="mt-3 text-xs font-lato italic text-espresso/50">
          {t('loc.placeholderNote')}
        </p>
      )}

      {!isActive && (
        <button
          onClick={onSwitch}
          data-cursor="link"
          className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-full text-white font-oswald font-bold uppercase tracking-wider text-sm transition-transform duration-300 hover:scale-[1.02] cursor-pointer"
          style={{ backgroundColor: loc.accent.hex }}
        >
          {t('loc.switchTo')} {t(`loc.${loc.id}.label`)}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

/**
 * Express-aankondiging: maakt op de homepage onmiskenbaar duidelijk
 * dat er een TWEEDE locatie is — met beide filialen naast elkaar,
 * een NIEUW-stempel en een directe switch (de cinematografische morph).
 */
export default function ExpressSection() {
  const { t } = useLanguage()
  const { locationId, switchLocation, isExpress } = useLocation()
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

  return (
    <section className="relative py-24 md:py-32 bg-espresso rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl overflow-hidden">
      {/* accent-gloed bovenin die meekleurt met het filiaal */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[60rem] h-64 rounded-full blur-3xl opacity-20 bg-accent transition-colors duration-700"
        aria-hidden
      />
      {/* watermerk */}
      <span
        aria-hidden
        className="absolute -bottom-10 left-0 right-0 text-center font-brand-sm text-[20vw] leading-none opacity-[0.045] select-none pointer-events-none whitespace-nowrap"
      >
        due posti
      </span>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 md:mb-20">
          <Reveal
            as="div"
            y={24}
            className="inline-flex items-center gap-2 mb-5"
          >
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-crust text-espresso font-oswald font-bold uppercase tracking-[0.2em] text-xs md:text-sm -rotate-2">
              <Sparkles className="w-3.5 h-3.5" />
              {t('express.announce.label')}
            </span>
          </Reveal>

          <SplitTextReveal
            as="h2"
            type="lines"
            className="font-brand text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            {t('express.announce.headline')}
          </SplitTextReveal>

          <SplitTextReveal
            as="p"
            type="lines"
            delay={0.15}
            className="font-lato text-lg md:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed"
          >
            {t('express.announce.text')}
          </SplitTextReveal>
        </div>

        {/* Duo-locatiekaarten */}
        <Reveal
          staggerChildren
          stagger={0.15}
          y={60}
          className="grid md:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto items-stretch"
        >
          <LocationCard
            loc={LOCATIONS.original}
            isActive={locationId === 'original'}
            isOpen={openStatus.original}
            onSwitch={() => switchLocation('original')}
          />
          <LocationCard
            loc={LOCATIONS.express}
            isActive={locationId === 'express'}
            isOpen={openStatus.express}
            onSwitch={() => switchLocation('express')}
          />
        </Reveal>

        {/* Grote switch-CTA */}
        <Reveal y={30} delay={0.2} className="text-center mt-12">
          <Magnetic>
            <button
              onClick={() => switchLocation()}
              data-cursor="link"
              className="group inline-flex items-center gap-3 bg-accent text-white font-oswald font-bold uppercase tracking-wider px-10 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-2xl cursor-pointer"
            >
              {isExpress
                ? t('express.announce.original.cta')
                : t('express.announce.cta')}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Magnetic>
          <p className="mt-4 font-stamp text-xl text-crust">
            {t('loc.twoLocations')}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
