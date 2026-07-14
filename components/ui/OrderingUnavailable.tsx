'use client'

import { motion } from 'framer-motion'
import { MapPin, Wrench, Clock } from 'lucide-react'
import { LOCATIONS } from '@/lib/data/locations'
import { useLanguage } from '@/lib/context/LanguageContext'

const COPY = {
  nl: {
    tag: 'Tijdelijk niet beschikbaar',
    title: 'Online bestellen werkt even niet',
    body:
      'Er is een technisch probleem en we werken aan een oplossing. ' +
      'Onze excuses voor het ongemak — je bent natuurlijk van harte welkom om in de winkel te bestellen!',
    visit: 'Bestel in de winkel',
  },
  en: {
    tag: 'Temporarily unavailable',
    title: 'Online ordering is down right now',
    body:
      'We’re experiencing a technical issue and are working on a fix. ' +
      'Sorry for the inconvenience — you’re very welcome to come order in store!',
    visit: 'Order in store',
  },
}

/**
 * Nette fallback wanneer het menu/bestellen niet uit de database geladen
 * kan worden: leg uit dat online bestellen tijdelijk niet werkt en nodig
 * mensen uit om in de winkel te bestellen (beide filialen + openingstijden).
 */
export default function OrderingUnavailable() {
  const { language } = useLanguage()
  const copy = COPY[language] ?? COPY.nl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-auto max-w-2xl text-center py-10 md:py-16"
    >
      <div className="mx-auto mb-8 w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
        <Wrench className="w-9 h-9 text-accent" />
      </div>
      <span className="inline-block font-oswald text-xs uppercase tracking-[0.2em] text-accent mb-4">
        {copy.tag}
      </span>
      <h2 className="font-comodo text-4xl md:text-5xl text-espresso mb-5">{copy.title}</h2>
      <p className="font-lato text-lg text-espresso/70 leading-relaxed mb-10">{copy.body}</p>

      {/* Beide filialen: adres + openingstijden */}
      <p className="font-oswald text-sm uppercase tracking-widest text-espresso/50 mb-5">
        {copy.visit}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
        {Object.values(LOCATIONS).map((loc) => (
          <a
            key={loc.id}
            href={loc.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white rounded-2xl border border-espresso/10 p-5 hover:shadow-lg transition-shadow"
          >
            <p className="font-oswald font-bold uppercase tracking-wider text-espresso mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" style={{ color: loc.accent.hex }} />
              {loc.name}
            </p>
            <p className="font-lato text-sm text-espresso/70 mb-3">
              {loc.address.street}, {loc.address.postalCode} {loc.address.city}
            </p>
            <div className="font-lato text-xs text-espresso/50 space-y-0.5">
              {(loc.hoursDisplay[language] ?? loc.hoursDisplay.nl).map((line) => (
                <p key={line} className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 flex-shrink-0" />
                  {line}
                </p>
              ))}
            </div>
          </a>
        ))}
      </div>
    </motion.div>
  )
}
