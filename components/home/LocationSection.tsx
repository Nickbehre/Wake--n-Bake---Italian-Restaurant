'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import { checkIsOpen } from '@/lib/data/locations'
import {
  MapPin,
  Clock,
  ExternalLink,
  Navigation,
  Bike,
  Store,
  ArrowRight,
} from 'lucide-react'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import MiniMap from '@/components/location/MiniMap'

export default function LocationSection() {
  const { t, language } = useLanguage()
  const { location, otherLocation, switchLocation } = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const update = () => setIsOpen(checkIsOpen(location))
    update()
    const interval = setInterval(update, 60000)
    return () => clearInterval(interval)
  }, [location])

  return (
    <section className="relative bg-flour py-24 md:py-32 overflow-hidden">
      {/* Achtergrondpatroon */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232C2C2C' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('location.label')}
          </Reveal>
          <SplitTextReveal
            as="h2"
            type="lines"
            className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            {t('location.headline')}
          </SplitTextReveal>
          <Reveal as="p" delay={0.15} className="font-lato text-xl text-espresso/70 max-w-2xl mx-auto">
            {t('location.subheadline')}
          </Reveal>
        </div>

        {/* Map & Info Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          {/* Info-kaarten links */}
          <Reveal staggerChildren stagger={0.12} y={40} className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Adres */}
            <div className="bg-white p-6 shadow-xl border-l-4 border-accent rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-lg text-espresso mb-1 uppercase tracking-wide">
                    {location.name}
                  </h3>
                  <span className="inline-block mb-2 px-2 py-0.5 rounded-full bg-accent/10 text-accent font-oswald uppercase tracking-widest text-[10px]">
                    {location.address.area}
                    {location.isNew && ` · ${t('loc.badge.new')}`}
                  </span>
                  <p className="text-espresso/80 mb-4">
                    {location.address.street}
                    <br />
                    {location.address.postalCode} {location.address.city}
                  </p>
                  <a
                    href={location.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="inline-flex items-center gap-2 text-crust hover:text-accent font-oswald font-semibold uppercase tracking-wide transition-colors group"
                  >
                    <Navigation className="w-4 h-4" />
                    {t('location.directions')}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </div>

            {/* Openingstijden */}
            <div className="bg-white p-6 shadow-xl border-l-4 border-pistachio rounded-lg">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-pistachio rounded-full flex-shrink-0">
                  <Clock className="w-6 h-6 text-espresso" />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-lg text-espresso mb-2 uppercase tracking-wide">
                    {t('location.hours')}
                  </h3>
                  <div className="text-espresso/80 space-y-1">
                    {location.hoursDisplay[language].map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                  {location.isPlaceholder && (
                    <p className="mt-2 text-xs italic text-espresso/50">
                      {t('loc.placeholderNote')}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* CTA's */}
            <div className="flex flex-col gap-3">
              {location.thuisbezorgdUrl ? (
                <a
                  href={location.thuisbezorgdUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="flex items-center justify-center gap-3 w-full bg-black hover:bg-gray-800 text-white font-oswald font-bold uppercase tracking-wider py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                >
                  <Bike className="w-5 h-5" />
                  {t('hero.cta.delivery')}
                </a>
              ) : (
                <span
                  className="flex items-center justify-center gap-3 w-full bg-black/30 text-white/70 font-oswald font-bold uppercase tracking-wider py-4 px-6 rounded-full cursor-not-allowed"
                  title={t('loc.deliverySoon')}
                >
                  <Bike className="w-5 h-5" />
                  {t('hero.cta.delivery')} · {t('loc.comingSoon')}
                </span>
              )}
              <a
                href="/menu"
                data-cursor="link"
                className="flex items-center justify-center gap-3 w-full bg-accent hover:opacity-90 text-white font-oswald font-bold uppercase tracking-wider py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                <Store className="w-5 h-5" />
                {t('hero.cta.takeaway')}
              </a>
            </div>

            {/* Andere locatie — compact wisselkaartje */}
            <button
              onClick={() => switchLocation(otherLocation.id)}
              data-cursor="link"
              className="w-full text-left bg-espresso text-flour p-5 rounded-lg shadow-xl group cursor-pointer hover:shadow-2xl transition-shadow"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-16 flex-shrink-0">
                    <MiniMap accentHex={otherLocation.accent.hex} variant={otherLocation.id} className="h-12" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-oswald uppercase tracking-widest text-[10px] text-flour/60 mb-0.5">
                      {t('loc.badge.otherLocation')}
                      {otherLocation.isNew && (
                        <span className="ml-1.5 px-1.5 py-px rounded-full bg-crust text-espresso font-bold">
                          {t('loc.badge.new')}
                        </span>
                      )}
                    </p>
                    <p className="font-stamp text-lg truncate" style={{ color: otherLocation.accent.hex }}>
                      {otherLocation.name}
                    </p>
                    <p className="text-xs text-flour/70 truncate">
                      {otherLocation.address.street} · {otherLocation.address.area}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </Reveal>

          {/* Kaart rechts */}
          <Reveal y={50} delay={0.15} className="lg:col-span-2 order-1 lg:order-2">
            <div className="relative bg-espresso rounded-lg overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-crust via-accent to-crust z-10 transition-colors duration-700" />

              <div className="relative h-[400px] md:h-[500px]">
                <iframe
                  key={location.id}
                  src={location.mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'saturate(0.8) contrast(1.1)' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`${location.name} locatie`}
                  className="w-full h-full"
                />

                {/* Transparante overlay tegen per-ongeluk slepen */}
                <div className="absolute inset-0 z-[5]" />

                {/* Custom marker */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
                  <motion.div
                    key={location.id}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className="relative"
                  >
                    <div className="bg-accent text-white px-4 py-2 rounded-full font-oswald font-bold uppercase tracking-wide text-sm shadow-lg whitespace-nowrap transition-colors duration-700">
                      {location.name}
                    </div>
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                      style={{ borderTopColor: location.accent.hex }}
                    />
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-4 h-4">
                      <span className="absolute inset-0 bg-accent/40 rounded-full animate-ping" />
                      <span className="absolute inset-1 bg-accent rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Onderbalk */}
              <div className="bg-espresso p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-pistachio' : 'bg-tomato'}`} />
                  <span className="text-white/80 text-sm font-oswald uppercase tracking-wide">
                    {isOpen ? t('location.openNow') : t('location.closed')}
                  </span>
                </div>
                <a
                  href={location.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="text-crust hover:text-white text-sm font-oswald font-semibold uppercase tracking-wide transition-colors flex items-center gap-1"
                >
                  {t('location.googleMaps')}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
