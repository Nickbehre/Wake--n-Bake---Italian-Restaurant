'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu,
  X,
  Instagram,
  Phone,
  Bike,
  Store,
  MapPin,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { usePathname } from 'next/navigation'
import LanguageToggle from '@/components/ui/LanguageToggle'
import LocationToggle from '@/components/location/LocationToggle'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import { checkIsOpen } from '@/lib/data/locations'
import { MOTION_EASE } from '@/lib/animation/gsap'

const navItems = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.menu', href: '/menu' },
  { key: 'nav.about', href: '/over-ons' },
  { key: 'nav.gallery', href: '/gallerij' },
  { key: 'nav.contact', href: '/contact' },
]

/**
 * Slanke adres-strip bovenaan: maakt op elk moment glashelder
 * WELKE locatie je bekijkt, met een open/dicht-indicator en een
 * NIEUW-link naar het andere filiaal.
 */
function LocationBar() {
  const { location, otherLocation, switchLocation, isExpress } = useLocation()
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const update = () => setIsOpen(checkIsOpen(location))
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [location])

  return (
    <div className="bg-espresso text-flour relative z-[60]">
      {/* accentlijn die meekleurt met het filiaal */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent" />
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between gap-3 h-9 text-[11px] md:text-xs font-oswald uppercase tracking-wider">
          {/* Actieve locatie */}
          <AnimatePresence mode="wait">
            <motion.div
              key={location.id}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.4, ease: MOTION_EASE.out }}
              className="flex items-center gap-2 min-w-0"
            >
              <MapPin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              <span className="truncate">
                <span className="text-accent font-bold">
                  {isExpress ? 'Xpress' : 'Panificio'}
                </span>
                <span className="hidden sm:inline">
                  {' '}
                  · {location.address.street}, {location.address.area}
                </span>
                <span className="sm:hidden"> · {location.address.area}</span>
              </span>
              <span
                className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  isOpen ? 'bg-pistachio' : 'bg-tomato'
                }`}
                aria-label={isOpen ? t('location.openNow') : t('location.closed')}
              />
              <span className="hidden md:inline text-flour/60">
                {isOpen ? t('location.openNow') : t('location.closed')}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Link naar het andere filiaal */}
          <button
            onClick={() => switchLocation(otherLocation.id)}
            data-cursor="link"
            className="flex items-center gap-1.5 text-flour/80 hover:text-crust transition-colors whitespace-nowrap cursor-pointer group"
          >
            {otherLocation.isNew && (
              <>
                <Sparkles className="w-3 h-3 text-crust" />
                <span className="hidden sm:inline">{t('loc.discoverExpress')}</span>
                <span className="sm:hidden">{t('loc.badge.new')}: Xpress</span>
              </>
            )}
            {!otherLocation.isNew && (
              <span>
                {t('loc.switchTo')} {t(`loc.${otherLocation.id}.label`)}
              </span>
            )}
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()
  const { location } = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Sluit mobiel menu en order-modal bij routewissel
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsOrderModalOpen(false)
  }, [pathname])

  const isHomePage = pathname === '/'
  const solid = !isHomePage || isScrolled || isMobileMenuOpen

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <LocationBar />

      <div
        className={`transition-all duration-500 ${
          solid ? 'pt-2 px-3 md:px-6' : 'pt-0 px-0'
        }`}
      >
        <div
          className={`container mx-auto transition-all duration-500 ${
            solid
              ? 'bg-[#f7f1e1]/95 backdrop-blur-md shadow-lg px-4 py-1 rounded-2xl'
              : 'bg-transparent px-4 py-2'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <Link href="/" className="relative z-10 flex-shrink-0" data-cursor="link">
              <motion.div
                className={`relative transition-all duration-300 ${
                  isScrolled
                    ? 'w-14 h-14 md:w-16 md:h-16'
                    : 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24'
                }`}
                whileHover={{ scale: 1.05, rotate: -3 }}
                transition={{ duration: 0.25, ease: MOTION_EASE.out }}
              >
                <img
                  src="/assets/logo.png"
                  alt="Wake N' Bake Panificio"
                  className="w-full h-full object-contain drop-shadow-xl"
                  style={{
                    filter: solid
                      ? 'none'
                      : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
                  }}
                />
              </motion.div>
            </Link>

            {/* Desktop navigatie */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-3 2xl:gap-5 flex-nowrap">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="link"
                  className={`font-stamp text-sm xl:text-base 2xl:text-lg whitespace-nowrap transition-colors duration-300 relative group ${
                    pathname === item.href
                      ? 'text-crust'
                      : !solid
                        ? 'text-white hover:text-crust'
                        : 'text-espresso hover:text-crust'
                  }`}
                >
                  {t(item.key)}
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-crust scale-x-0 group-hover:scale-x-100 origin-right group-hover:origin-left transition-transform duration-[450ms] ease-[cubic-bezier(0.83,0,0.17,1)]" />
                </Link>
              ))}
            </nav>

            {/* Toggle, taal, social, CTA */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-3">
              {/* DE locatie-toggle */}
              <LocationToggle variant={solid ? 'dark' : 'light'} />

              <LanguageToggle variant={!solid ? 'light' : 'dark'} />

              <a
                href={location.instagram}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className={`p-2 rounded-full transition-colors hidden xl:block ${
                  !solid
                    ? 'text-white hover:bg-white/20'
                    : 'text-espresso hover:bg-crust/20'
                }`}
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={location.phoneHref}
                data-cursor="link"
                className={`p-2 rounded-full transition-colors hidden xl:block ${
                  !solid
                    ? 'text-white hover:bg-white/20'
                    : 'text-espresso hover:bg-crust/20'
                }`}
                aria-label="Bel ons"
              >
                <Phone className="w-5 h-5" />
              </a>

              <button
                onClick={() => setIsOrderModalOpen(true)}
                data-cursor="link"
                className="bg-accent hover:opacity-90 text-white font-oswald font-bold uppercase tracking-wider px-5 xl:px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105 cursor-pointer whitespace-nowrap"
              >
                {t('nav.order')}
              </button>
            </div>

            {/* Mobiel: taal + hamburger */}
            <div className="lg:hidden flex items-center gap-2">
              <LanguageToggle variant={!solid ? 'light' : 'dark'} />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`p-2 ${!solid ? 'text-white' : 'text-espresso'}`}
                aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobiel menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: MOTION_EASE.out }}
              className="lg:hidden absolute right-3 md:right-6 top-full mt-2 w-[calc(100vw-1.5rem)] max-w-sm bg-[#f7f1e1]/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden"
            >
              <nav className="px-5 py-4 flex flex-col gap-1 max-h-[calc(100vh-8rem)] overflow-y-auto" data-lenis-prevent>
                {/* Locatie-toggle prominent bovenaan */}
                <div className="pb-3 mb-2 border-b border-espresso/10">
                  <LocationToggle variant="dark" expanded />
                </div>

                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`font-stamp text-lg py-2 px-2 rounded-lg transition-colors ${
                      pathname === item.href
                        ? 'text-crust bg-crust/10'
                        : 'text-espresso hover:bg-espresso/5'
                    }`}
                  >
                    {t(item.key)}
                  </Link>
                ))}
                <div className="flex items-center gap-3 pt-2 mt-1 border-t border-espresso/10">
                  <a
                    href={location.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-espresso hover:text-crust transition-colors"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                  <a
                    href={location.phoneHref}
                    className="p-2 text-espresso hover:text-crust transition-colors"
                    aria-label="Bel ons"
                  >
                    <Phone className="w-5 h-5" />
                  </a>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    setIsOrderModalOpen(true)
                  }}
                  className="block w-full bg-accent text-white text-center font-oswald font-bold uppercase tracking-wider py-2.5 mt-2 rounded-full text-sm cursor-pointer"
                >
                  {t('nav.order')}
                </button>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Order-modal — via portal zodat fixed/transform van de header geen invloed heeft */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {isOrderModalOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                  onClick={() => setIsOrderModalOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25, ease: MOTION_EASE.out }}
                  className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-[#f7f1e1] rounded-2xl shadow-2xl p-8 relative w-[90vw] max-w-md pointer-events-auto">
                    <button
                      onClick={() => setIsOrderModalOpen(false)}
                      className="absolute top-4 right-4 text-espresso/50 hover:text-espresso transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      <X className="w-5 h-5" />
                    </button>

                    <h2 className="font-stamp text-3xl text-accent text-center mb-1">
                      {t('nav.order')}
                    </h2>
                    {/* Locatie-context in de modal */}
                    <p className="flex items-center justify-center gap-1.5 font-oswald uppercase tracking-wider text-xs text-espresso/60 mb-6">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {location.name} · {location.address.street}
                    </p>

                    <div className="flex flex-col gap-4">
                      {location.thuisbezorgdUrl ? (
                        <a
                          href={location.thuisbezorgdUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-3 bg-black text-white py-4 px-6 rounded-full font-oswald uppercase tracking-wider text-lg hover:bg-black/80 transition-all duration-300 hover:scale-[1.02]"
                        >
                          <Bike className="w-5 h-5" />
                          {t('hero.cta.delivery')}
                        </a>
                      ) : (
                        <div className="flex items-center justify-center gap-3 bg-espresso/10 text-espresso/50 py-4 px-6 rounded-full font-oswald uppercase tracking-wider text-lg cursor-not-allowed">
                          <Bike className="w-5 h-5" />
                          {t('hero.cta.delivery')} — {t('loc.comingSoon')}
                        </div>
                      )}
                      <Link
                        href="/menu"
                        onClick={() => setIsOrderModalOpen(false)}
                        className="flex items-center justify-center gap-3 bg-accent text-white py-4 px-6 rounded-full font-oswald uppercase tracking-wider text-lg hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Store className="w-5 h-5" />
                        {t('hero.cta.takeaway')}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </header>
  )
}
