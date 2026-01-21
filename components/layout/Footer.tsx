'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Instagram, MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-espresso text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src="/assets/logo.svg"
                  alt="Wake N' Bake Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h3 className="font-montserrat font-extrabold text-xl">
                  WAKE N&apos; BAKE
                </h3>
                <p className="font-playfair text-sm text-crust">Panificio</p>
              </div>
            </div>
            <p className="text-white/80 leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-6">{t('footer.contact')}</h4>
            <div className="space-y-3 text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-crust flex-shrink-0 mt-0.5" />
                <div>
                  Vijzelstraat 93h
                  <br />
                  1017 HH Amsterdam
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-crust flex-shrink-0" />
                <a
                  href="tel:+31201234567"
                  className="hover:text-crust transition-colors"
                >
                  +31 20 123 4567
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-crust flex-shrink-0" />
                <a
                  href="mailto:info@wakenbakepanificio.nl"
                  className="hover:text-crust transition-colors"
                >
                  info@wakenbakepanificio.nl
                </a>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="font-montserrat font-bold text-lg mb-6">
              {t('footer.openingHours')}
            </h4>
            <div className="space-y-2 text-white/80">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-crust flex-shrink-0" />
                <span>{t('location.weekdays')}</span>
              </div>
              <div className="flex items-center gap-3 pl-8">
                <span>{t('location.weekends')}</span>
              </div>
            </div>
          </div>

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
      </div>
    </footer>
  )
}
