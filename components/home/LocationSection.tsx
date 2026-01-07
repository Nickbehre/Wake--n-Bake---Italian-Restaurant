'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { MapPin, Clock, ExternalLink, Navigation } from 'lucide-react'

export default function LocationSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const headerY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0])
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])

  // Exact coordinates for Vijzelstraat 93h, 1017 HH Amsterdam
  const latitude = 52.3613
  const longitude = 4.8932

  // Uber Eats order link
  const UBER_EATS_URL = 'https://www.order.store/nl/store/wake-n-bake-panificio/xon7rL6IRMqMdtpdlRryxg'

  return (
    <section
      ref={sectionRef}
      className="relative bg-flour py-24 md:py-32 overflow-hidden"
    >
      {/* Background Pattern */}
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
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block text-crust font-oswald font-bold text-sm tracking-[0.3em] uppercase mb-4"
          >
            The Destination
          </motion.span>
          <h2 className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6">
            {t('location.headline')}
          </h2>
          <p className="font-lato text-xl text-espresso/70 max-w-2xl mx-auto">
            {t('location.subheadline')}
          </p>
        </motion.div>

        {/* Map & Info Grid */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="grid lg:grid-cols-3 gap-8 items-start"
        >
          {/* Info Cards - Left Side */}
          <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
            {/* Address Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 shadow-xl border-l-4 border-crust"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-crust rounded-full flex-shrink-0">
                  <MapPin className="w-6 h-6 text-espresso" />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-lg text-espresso mb-2 uppercase tracking-wide">
                    {t('cta.location')}
                  </h3>
                  <p className="text-espresso/80 mb-4">
                    Vijzelstraat 93h
                    <br />
                    1017 HH Amsterdam
                  </p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-crust hover:text-tomato font-oswald font-semibold uppercase tracking-wide transition-colors group"
                  >
                    <Navigation className="w-4 h-4" />
                    {t('location.directions')}
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Hours Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 shadow-xl border-l-4 border-pistachio"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-pistachio rounded-full flex-shrink-0">
                  <Clock className="w-6 h-6 text-espresso" />
                </div>
                <div>
                  <h3 className="font-oswald font-bold text-lg text-espresso mb-2 uppercase tracking-wide">
                    {t('location.hours')}
                  </h3>
                  <div className="text-espresso/80 space-y-1">
                    <p>{t('location.weekdays')}</p>
                    <p>{t('location.weekends')}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <a
                href={UBER_EATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-tomato hover:bg-tomato/90 text-white text-center font-oswald font-bold uppercase tracking-wider py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                Bestel Nu Online
              </a>
            </motion.div>
          </div>

          {/* Map Container - Right Side */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2 order-1 lg:order-2"
          >
            <div className="relative bg-espresso rounded-lg overflow-hidden shadow-2xl">
              {/* Map Frame with brand styling */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-crust via-tomato to-crust" />

              {/* Map */}
              <div className="relative h-[400px] md:h-[500px]">
                {/* Styled Map Iframe */}
                <iframe
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.003}%2C${latitude - 0.0015}%2C${longitude + 0.003}%2C${latitude + 0.0015}&layer=mapnik&marker=${latitude}%2C${longitude}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'saturate(0.8) contrast(1.1)', pointerEvents: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Wake N' Bake Panificio Location"
                  className="w-full h-full"
                />

                {/* Transparent overlay to prevent map dragging */}
                <div className="absolute inset-0 z-[5]" />

                {/* Custom Marker Overlay */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="relative"
                  >
                    {/* Marker */}
                    <div className="bg-tomato text-white px-4 py-2 rounded-full font-oswald font-bold uppercase tracking-wide text-sm shadow-lg whitespace-nowrap">
                      Wake N&apos; Bake
                    </div>
                    {/* Marker Point */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-tomato" />
                    {/* Pulse */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 w-4 h-4">
                      <span className="absolute inset-0 bg-tomato/40 rounded-full animate-ping" />
                      <span className="absolute inset-1 bg-tomato rounded-full" />
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="bg-espresso p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-tomato rounded-full" />
                  <span className="text-white/80 text-sm font-oswald uppercase tracking-wide">
                    Closed
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/place/Vijzelstraat+93h,+1017+HH+Amsterdam`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:text-white text-sm font-oswald font-semibold uppercase tracking-wide transition-colors flex items-center gap-1"
                >
                  Open in Google Maps
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
