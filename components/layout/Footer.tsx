'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import { LOCATIONS, RestaurantLocation } from '@/lib/data/locations'

function FooterLocation({
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
      className={`rounded-2xl p-5 transition-colors ${
        isActive ? 'bg-white/5 border border-white/10' : 'border border-transparent'
      }`}
    >
      <h4 className="font-montserrat font-bold text-lg mb-1 flex items-center gap-2">
        {loc.id === 'express' ? 'Xpress' : 'Panificio'}
        {loc.isNew && (
          <span className="px-2 py-0.5 rounded-full bg-crust text-espresso text-[10px] font-oswald font-bold uppercase tracking-widest rotate-2">
            {t('loc.badge.new')}
          </span>
        )}
      </h4>
      <p
        className="font-stamp text-sm mb-4"
        style={{ color: loc.accent.hex }}
      >
        {loc.address.area}
      </p>
      <div className="space-y-3 text-white/80 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-crust flex-shrink-0 mt-0.5" />
          <div>
            {loc.address.street}
            <br />
            {loc.address.postalCode} {loc.address.city}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-crust flex-shrink-0" />
          <a href={loc.phoneHref} className="hover:text-crust transition-colors">
            {loc.phone}
          </a>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-4 h-4 text-crust flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            {loc.hoursDisplay[language].map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        {loc.isPlaceholder && (
          <p className="text-white/40 text-xs italic">{t('loc.placeholderNote')}</p>
        )}
        {!isActive && (
          <button
            onClick={onSwitch}
            data-cursor="link"
            className="inline-flex items-center gap-1.5 font-oswald uppercase tracking-wider text-xs transition-colors cursor-pointer hover:text-white group"
            style={{ color: loc.accent.hex }}
          >
            {t('loc.switchTo')} {t(`loc.${loc.id}.label`)}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>
    </div>
  )
}

export default function Footer() {
  const { t } = useLanguage()
  const { locationId, location, switchLocation } = useLocation()

  return (
    <footer className="bg-espresso text-white rounded-t-[3rem]">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo.png"
                  alt="Wake N' Bake Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold text-xl">
                  WAKE N&apos; BAKE
                </h3>
                <p className="font-playfair text-sm text-crust">
                  come taste the difference
                </p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            <p className="font-stamp text-lg text-crust">{t('loc.twoLocations')}</p>
            <div className="flex items-center gap-3 mt-4">
              <Mail className="w-4 h-4 text-crust flex-shrink-0" />
              <a
                href={`mailto:${location.email}`}
                className="text-white/80 hover:text-crust transition-colors text-sm"
              >
                {location.email}
              </a>
            </div>
          </div>

          {/* Beide locaties */}
          <FooterLocation
            loc={LOCATIONS.original}
            isActive={locationId === 'original'}
            onSwitch={() => switchLocation('original')}
          />
          <FooterLocation
            loc={LOCATIONS.express}
            isActive={locationId === 'express'}
            onSwitch={() => switchLocation('express')}
          />

          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-6">{t('footer.links')}</h4>
            <div className="space-y-3">
              <Link
                href="/menu"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                {t('nav.menu')}
              </Link>
              <Link
                href="/over-ons"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                {t('nav.about')}
              </Link>
              <Link
                href="/gallerij"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                {t('nav.gallery')}
              </Link>
              <Link
                href="/contact"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                {t('nav.contact')}
              </Link>
              <Link
                href="/privacy"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/cookies"
                className="block text-white/80 hover:text-crust transition-colors"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Social & Copyright */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            &copy; {new Date().getFullYear()} Wake N&apos; Bake Panificio. {t('footer.rights')}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.instagram.com/wakenbake.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-crust rounded-full transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.tripadvisor.com/wakenbakepanificio"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-crust rounded-full transition-colors"
              aria-label="TripAdvisor"
            >
              <span className="text-sm font-bold">TA</span>
            </a>
          </div>
        </div>

        {/* Font License */}
        <div className="border-t border-white/10 mt-4 pt-4 text-center">
          <p className="text-white/40 text-xs">
            Font &quot;Comodo Stamp&quot; from{' '}
            <a
              href="https://www.onlinewebfonts.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 underline"
            >
              onlinewebfonts.com
            </a>{' '}
            licensed under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 underline"
            >
              CC BY 4.0
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
