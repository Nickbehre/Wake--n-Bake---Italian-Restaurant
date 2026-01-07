'use client'

import { MapPin, ExternalLink } from 'lucide-react'

export default function MapSection() {
  const latitude = 52.3625
  const longitude = 4.8892
  const address = 'Vijzelstraat 93h, 1017 HH Amsterdam'

  return (
    <section className="w-full">
      {/* Map Container */}
      <div className="relative w-full h-[400px] bg-espresso/10">
        {/* Using OpenStreetMap embed as a free alternative */}
        <iframe
          src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01}%2C${latitude - 0.005}%2C${longitude + 0.01}%2C${latitude + 0.005}&layer=mapnik&marker=${latitude}%2C${longitude}`}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Locatie Wake N' Bake Panificio"
          className="w-full h-full"
        />

        {/* Info Card */}
        <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-96 bg-flour p-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-tomato rounded-full flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-montserrat font-bold text-lg text-espresso mb-1">
                Wake N&apos; Bake Panificio
              </h3>
              <p className="text-espresso/80 mb-4">{address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-tomato hover:text-tomato/80 font-montserrat font-semibold transition-colors"
              >
                Routebeschrijving
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
