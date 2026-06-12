'use client'

import { MapPin, ExternalLink } from 'lucide-react'
import { useLocation } from '@/lib/context/LocationContext'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function MapSection() {
  const { location } = useLocation()
  const { t } = useLanguage()

  return (
    <section className="w-full">
      <div className="relative w-full h-[400px] bg-espresso/10">
        <iframe
          key={location.id}
          src={location.mapEmbedSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Locatie ${location.name}`}
          className="w-full h-full"
        />

        {/* Info-kaart */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-flour p-6 shadow-xl rounded-2xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-accent rounded-full flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-lg text-espresso mb-1 flex items-center gap-2">
                {location.name}
                {location.isNew && (
                  <span className="px-2 py-0.5 rounded-full bg-crust text-espresso text-[10px] font-oswald font-bold uppercase tracking-widest">
                    {t('loc.badge.new')}
                  </span>
                )}
              </h3>
              <p className="text-espresso/80 mb-4">
                {location.address.street}, {location.address.postalCode}{' '}
                {location.address.city}
              </p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${location.geo.lat},${location.geo.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="inline-flex items-center gap-2 text-accent hover:opacity-80 font-montserrat font-semibold transition-opacity"
              >
                {t('location.directions')}
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
