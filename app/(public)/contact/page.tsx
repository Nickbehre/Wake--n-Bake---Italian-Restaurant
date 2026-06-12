'use client'

import ContactForm from '@/components/contact/ContactForm'
import MapSection from '@/components/contact/MapSection'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Instagram,
  UtensilsCrossed,
  PartyPopper,
  Building2,
  ArrowRight,
  Check,
} from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import { LOCATIONS, RestaurantLocation } from '@/lib/data/locations'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import Magnetic from '@/components/animation/Magnetic'

function ContactLocationCard({
  loc,
  isActive,
  onSwitch,
}: {
  loc: RestaurantLocation
  isActive: boolean
  onSwitch: () => void
}) {
  const { t, language } = useLanguage()

  return (
    <div
      className={`rounded-2xl p-6 border-2 transition-all duration-300 ${
        isActive ? 'bg-white shadow-lg' : 'bg-white/50 border-transparent shadow-sm'
      }`}
      style={isActive ? { borderColor: loc.accent.hex } : undefined}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-stamp text-xl" style={{ color: loc.accent.hex }}>
          {loc.name}
        </h3>
        <div className="flex items-center gap-2">
          {loc.isNew && (
            <span className="px-2 py-0.5 rounded-full bg-crust text-espresso text-[10px] font-oswald font-bold uppercase tracking-widest rotate-2">
              {t('loc.badge.new')}
            </span>
          )}
          {isActive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-espresso text-flour text-[10px] font-oswald uppercase tracking-widest">
              <Check className="w-3 h-3" />
              {t('loc.youAreHere')}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 font-lato text-espresso/80 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: loc.accent.hex }} />
          <span>
            {loc.address.street}, {loc.address.postalCode} {loc.address.city} ·{' '}
            {loc.address.area}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 flex-shrink-0" style={{ color: loc.accent.hex }} />
          <a href={loc.phoneHref} className="hover:text-crust transition-colors">
            {loc.phone}
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: loc.accent.hex }} />
          <span>
            {loc.hoursDisplay[language].map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </span>
        </div>
        {loc.isPlaceholder && (
          <p className="text-xs italic text-espresso/50">{t('loc.placeholderNote')}</p>
        )}
      </div>

      {!isActive && (
        <button
          onClick={onSwitch}
          data-cursor="link"
          className="mt-4 inline-flex items-center gap-1.5 font-oswald font-semibold uppercase tracking-wider text-xs cursor-pointer hover:opacity-75 transition-opacity group"
          style={{ color: loc.accent.hex }}
        >
          {t('loc.switchTo')} {t(`loc.${loc.id}.label`)}
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      )}
    </div>
  )
}

export default function ContactPage() {
  const { t } = useLanguage()
  const { locationId, location, switchLocation } = useLocation()

  return (
    <div className="min-h-screen bg-flour">
      {/* Hero */}
      <section className="relative pt-36 md:pt-44 pb-20 bg-espresso text-white overflow-hidden rounded-b-[3rem]">
        <span
          aria-hidden
          className="absolute -bottom-8 left-0 right-0 text-center font-brand-sm text-[22vw] leading-none opacity-[0.05] select-none pointer-events-none whitespace-nowrap"
        >
          Ciao
        </span>
        <div className="container mx-auto px-4 relative">
          <div className="text-center mt-4 md:mt-8">
            <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
              {t('contact.title')}
            </Reveal>
            <SplitTextReveal
              as="h1"
              type="lines"
              immediate
              delay={0.15}
              className="font-brand text-4xl md:text-6xl lg:text-7xl mb-6"
            >
              {t('contact.subtitle')}
            </SplitTextReveal>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Locaties + contact */}
            <Reveal y={40}>
              <h2 className="font-brand-dark text-4xl md:text-5xl mb-8 text-espresso">
                {t('loc.ourLocations')}
              </h2>

              {/* Beide filialen — glashelder twee adressen */}
              <div className="space-y-5 mb-10">
                <ContactLocationCard
                  loc={LOCATIONS.original}
                  isActive={locationId === 'original'}
                  onSwitch={() => switchLocation('original')}
                />
                <ContactLocationCard
                  loc={LOCATIONS.express}
                  isActive={locationId === 'express'}
                  onSwitch={() => switchLocation('express')}
                />
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.email')}
                    </h3>
                    <a
                      href={`mailto:${location.email}`}
                      data-cursor="link"
                      className="font-lato text-espresso/80 hover:text-crust transition-colors"
                    >
                      {location.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Instagram className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.socialMedia')}
                    </h3>
                    <a
                      href="https://www.instagram.com/wakenbake.nl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="link"
                      className="font-lato text-espresso/80 hover:text-crust transition-colors"
                    >
                      @wakenbake.nl
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-pistachio/20 border-l-4 border-pistachio p-6 rounded-2xl">
                <h3 className="font-oswald font-bold text-lg mb-2 text-espresso uppercase tracking-wide">
                  {t('contact.takeaway')}
                </h3>
                <p className="font-lato text-espresso/80">{t('contact.takeawayText')}</p>
              </div>
            </Reveal>

            {/* Formulier */}
            <Reveal y={40} delay={0.15}>
              <h2 className="font-brand-dark text-4xl md:text-5xl mb-8 text-espresso">
                {t('contact.sendMessage')}
              </h2>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Catering */}
      <section className="py-20 bg-crust rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
                {t('contact.cateringOptions')}
              </Reveal>
              <SplitTextReveal
                as="h2"
                type="lines"
                className="font-brand-dark text-4xl md:text-5xl text-espresso mb-4"
              >
                {t('contact.cateringTitle')}
              </SplitTextReveal>
              <Reveal as="p" delay={0.1} className="font-lato text-espresso/70 text-lg max-w-2xl mx-auto leading-relaxed">
                {t('contact.cateringDescription')}
              </Reveal>
            </div>

            <Reveal staggerChildren stagger={0.12} y={40} className="grid sm:grid-cols-3 gap-6 mb-10">
              <div className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-crust/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-espresso" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringOffice')}
                </h3>
              </div>
              <div className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-tomato/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-7 h-7 text-tomato" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringBirthday')}
                </h3>
              </div>
              <div className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 bg-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-7 h-7 text-pistachio" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringPrivate')}
                </h3>
              </div>
            </Reveal>

            <div className="text-center">
              <Magnetic>
                <a
                  href="#contact-form"
                  data-cursor="link"
                  onClick={(e) => {
                    e.preventDefault()
                    const form = document.querySelector('[data-contact-form]')
                    if (form) form.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="inline-flex items-center gap-2 bg-accent text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:opacity-90 transition-all duration-300 shadow-md"
                >
                  {t('contact.cateringCta')}
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </section>

      {/* Kaart */}
      <section className="py-20">
        <MapSection />
      </section>
    </div>
  )
}
