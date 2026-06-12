'use client'

import Link from 'next/link'
import { MapPin, Clock, Phone } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import Magnetic from '@/components/animation/Magnetic'

export default function CTASection() {
  const { t, language } = useLanguage()
  const { location } = useLocation()

  return (
    <section className="py-20 bg-crust rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Links: CTA */}
          <div>
            <SplitTextReveal
              as="h2"
              type="lines"
              className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6"
            >
              {t('cta.headline')}
            </SplitTextReveal>
            <SplitTextReveal
              as="p"
              type="lines"
              delay={0.1}
              className="text-espresso/80 text-xl mb-8 leading-relaxed"
            >
              {t('cta.description')}
            </SplitTextReveal>
            <Reveal staggerChildren stagger={0.1} y={30} className="flex flex-col sm:flex-row gap-4">
              <Magnetic>
                <Link
                  href="/contact"
                  data-cursor="link"
                  className="block bg-accent hover:opacity-90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-center rounded-full transition-all duration-300"
                >
                  {t('cta.visit')}
                </Link>
              </Magnetic>
              <Magnetic>
                <a
                  href={location.phoneHref}
                  data-cursor="link"
                  className="bg-espresso hover:bg-espresso/90 text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 text-center rounded-full transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  {t('cta.call')}
                </a>
              </Magnetic>
            </Reveal>
          </div>

          {/* Rechts: info-kaarten met actieve locatie */}
          <Reveal staggerChildren stagger={0.12} y={40} className="space-y-6">
            <div className="bg-flour p-6 flex items-start gap-4 rounded-2xl">
              <div className="p-3 bg-accent/15 rounded-full">
                <MapPin className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.location')}
                  {location.isNew && (
                    <span className="ml-2 px-2 py-0.5 rounded-full bg-accent text-white text-[10px] tracking-widest align-middle">
                      {t('loc.badge.new')}
                    </span>
                  )}
                </h3>
                <p className="text-espresso/80">
                  {location.name}
                  <br />
                  {location.address.street}
                  <br />
                  {location.address.postalCode} {location.address.city}
                </p>
              </div>
            </div>

            <div className="bg-flour p-6 flex items-start gap-4 rounded-2xl">
              <div className="p-3 bg-accent/15 rounded-full">
                <Clock className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.hours')}
                </h3>
                <p className="text-espresso/80">
                  {location.hoursDisplay[language].map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>
            </div>

            <div className="bg-flour p-6 flex items-start gap-4 rounded-2xl">
              <div className="p-3 bg-accent/15 rounded-full">
                <Phone className="w-6 h-6 text-espresso" />
              </div>
              <div>
                <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                  {t('cta.contact')}
                </h3>
                <p className="text-espresso/80">
                  <a
                    href={location.phoneHref}
                    data-cursor="link"
                    className="hover:text-accent transition-colors"
                  >
                    {location.phone}
                  </a>
                  <br />
                  <a
                    href={`mailto:${location.email}`}
                    data-cursor="link"
                    className="hover:text-accent transition-colors"
                  >
                    {location.email}
                  </a>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
