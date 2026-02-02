'use client'

import { MapPin, ExternalLink } from 'lucide-react'

export default function MapSection() {
  const latitude = 52.36383074070107
  const longitude = 4.891507396929842
  const address = 'Vijzelstraat 93h, 1017 HH Amsterdam'

  return (
    <section className="w-full">
      {/* Map Container */}
      <div className="relative w-full h-[400px] bg-espresso/10">
        {/* Google Maps embed */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d731.8510597653282!2d4.892293707375058!3d52.36318569111751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x47c60986e493b3a9%3A0x51d128d5f0204561!2sWake%20N'%20Bake%2C%20Vijzelstraat%2093h%2C%201017%20HH%20Amsterdam!3m2!1d52.363344999999995!2d4.89238!5e1!3m2!1sen!2snl!4v1769987377221!5m2!1sen!2snl"
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
