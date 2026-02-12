'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { MapPin, Clock, ExternalLink, Navigation } from 'lucide-react'

// Check if currently open based on Amsterdam time
function checkIsOpen(): boolean {
  // Get current time in Amsterdam timezone
  const now = new Date()
  const amsterdamTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' }))
  const day = amsterdamTime.getDay() // 0 = Sunday, 1 = Monday, etc.
  const hours = amsterdamTime.getHours()
  const minutes = amsterdamTime.getMinutes()
  const currentTime = hours * 60 + minutes // Convert to minutes for easier comparison

  // Opening hours in minutes from midnight
  // Mon - Fri: 07:30 - 16:30
  // Sat: 08:00 - 18:00
  // Sun: Closed
  if (day === 0) {
    // Sunday - closed
    return false
  } else if (day >= 1 && day <= 5) {
    // Monday to Friday
    return currentTime >= 7 * 60 + 30 && currentTime < 16 * 60 + 30
  } else {
    // Saturday
    return currentTime >= 8 * 60 && currentTime < 18 * 60
  }
}

export default function LocationSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isOpen, setIsOpen] = useState(false)

  // Update open status on mount and every minute
  useEffect(() => {
    setIsOpen(checkIsOpen())
    const interval = setInterval(() => {
      setIsOpen(checkIsOpen())
    }, 60000) // Check every minute
    return () => clearInterval(interval)
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  const headerOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 1])
  const headerY = useTransform(scrollYProgress, [0.1, 0.3], [50, 0])
  const contentOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1])

  // Exact coordinates for Vijzelstraat 93h, 1017 HH Amsterdam
  const latitude = 52.36383074070107
  const longitude = 4.891507396929842

  // Thuisbezorgd order link
  const THUISBEZORGD_URL = 'https://www.thuisbezorgd.nl/menu/wake-n-bake-panificio'

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
            className="inline-block font-stamp text-2xl md:text-3xl mb-4"
          >
            {t('location.label')}
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
              className="bg-white p-6 shadow-xl border-l-4 border-crust rounded-lg"
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
              className="bg-white p-6 shadow-xl border-l-4 border-pistachio rounded-lg"
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
                    <p>{t('location.saturday')}</p>
                    <p>{t('location.sunday')}</p>
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
                href={THUISBEZORGD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-tomato hover:bg-tomato/90 text-white text-center font-oswald font-bold uppercase tracking-wider py-4 px-6 rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
              >
                {t('location.orderOnline')}
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
                {/* Google Maps Iframe */}
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d731.8510597653282!2d4.892293707375058!3d52.36318569111751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x47c60986e493b3a9%3A0x51d128d5f0204561!2sWake%20N'%20Bake%2C%20Vijzelstraat%2093h%2C%201017%20HH%20Amsterdam!3m2!1d52.363344999999995!2d4.89238!5e1!3m2!1sen!2snl!4v1769987377221!5m2!1sen!2snl"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'saturate(0.8) contrast(1.1)' }}
                  allowFullScreen
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
                  <div className={`w-3 h-3 rounded-full ${isOpen ? 'bg-pistachio' : 'bg-tomato'}`} />
                  <span className="text-white/80 text-sm font-oswald uppercase tracking-wide">
                    {isOpen ? t('location.openNow') : t('location.closed')}
                  </span>
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:text-white text-sm font-oswald font-semibold uppercase tracking-wide transition-colors flex items-center gap-1"
                >
                  {t('location.googleMaps')}
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
