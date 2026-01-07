'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { MapPin, Clock, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function CTASection() {
  const { t } = useLanguage()

  return (
    <section className="py-20 bg-crust">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('cta.headline')}
            </h2>
            <p className="text-espresso/80 text-xl mb-8 leading-relaxed">
              {t('cta.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/contact"
                className="bg-tomato hover:bg-tomato/90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-center transition-all duration-300 transform hover:scale-105"
              >
                {t('cta.visit')}
              </Link>
              <a
                href="tel:+31201234567"
                className="bg-espresso hover:bg-espresso/90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-center transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                {t('cta.call')}
              </a>
            </div>
          </motion.div>

          {/* Right: Info Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-flour p-6 flex items-start gap-4">
              <div className="p-3 bg-crust/20 rounded-full">
                <MapPin className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.location')}
                </h3>
                <p className="text-espresso/80">
                  Vijzelstraat 93h
                  <br />
                  1017 HH Amsterdam
                </p>
              </div>
            </div>

            <div className="bg-flour p-6 flex items-start gap-4">
              <div className="p-3 bg-crust/20 rounded-full">
                <Clock className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.hours')}
                </h3>
                <p className="text-espresso/80">
                  {t('location.weekdays')}
                  <br />
                  {t('location.weekends')}
                </p>
              </div>
            </div>

            <div className="bg-flour p-6 flex items-start gap-4">
              <div className="p-3 bg-crust/20 rounded-full">
                <Phone className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.contact')}
                </h3>
                <p className="text-espresso/80">
                  <a
                    href="tel:+31201234567"
                    className="hover:text-tomato transition-colors"
                  >
                    +31 20 123 4567
                  </a>
                  <br />
                  <a
                    href="mailto:info@wakenbakepanificio.nl"
                    className="hover:text-tomato transition-colors"
                  >
                    info@wakenbakepanificio.nl
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
