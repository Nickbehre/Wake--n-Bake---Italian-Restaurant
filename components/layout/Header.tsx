'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/lib/context/LanguageContext'

// Uber Eats order link
const UBER_EATS_URL = 'https://www.order.store/nl/store/wake-n-bake-panificio/xon7rL6IRMqMdtpdlRryxg'

const navItems = [
  { key: 'nav.home', href: '/' },
  { key: 'nav.menu', href: '/menu' },
  { key: 'nav.about', href: '/over-ons' },
  { key: 'nav.gallery', href: '/gallerij' },
  { key: 'nav.contact', href: '/contact' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  // Check if we're on menu or gallery page
  const isMenuOrGalleryPage = pathname === '/menu' || pathname === '/gallerij'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isMenuOrGalleryPage
          ? 'bg-tomato py-2'
          : isScrolled || isMobileMenuOpen
          ? 'bg-flour/95 backdrop-blur-md shadow-lg py-1'
          : 'bg-transparent py-2'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo - LARGE brand stamp, image only, NO TEXT */}
          <Link href="/" className="relative z-10 flex-shrink-0">
            <motion.div
              className={`relative transition-all duration-300 ${
                isScrolled
                  ? 'w-16 h-16 md:w-20 md:h-20'
                  : 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src="/assets/logo.png"
                alt="Wake N' Bake Panificio"
                className="w-full h-full object-contain drop-shadow-xl"
                style={{
                  filter: isScrolled ? 'none' : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))'
                }}
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation - Stamp font style */}
          <nav className="hidden xl:flex items-center gap-2 2xl:gap-6 flex-nowrap">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-stamp text-base 2xl:text-xl whitespace-nowrap transition-colors duration-300 relative group ${
                  pathname === item.href
                    ? 'text-crust'
                    : isMenuOrGalleryPage
                    ? 'text-white hover:text-crust'
                    : isScrolled
                    ? 'text-espresso hover:text-crust'
                    : 'text-white hover:text-crust'
                }`}
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crust group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* CTA, Language Toggle & Social */}
          <div className="hidden xl:flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageToggle variant={isMenuOrGalleryPage ? 'light' : isScrolled ? 'dark' : 'light'} />

            <a
              href="https://www.instagram.com/wakenbake.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                isMenuOrGalleryPage
                  ? 'text-white hover:bg-white/20'
                  : isScrolled
                  ? 'text-espresso hover:bg-pistachio/20'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="tel:+31201234567"
              className={`p-2 rounded-full transition-colors ${
                isMenuOrGalleryPage
                  ? 'text-white hover:bg-white/20'
                  : isScrolled
                  ? 'text-espresso hover:bg-pistachio/20'
                  : 'text-white hover:bg-white/20'
              }`}
              aria-label="Bel ons"
            >
              <Phone className="w-5 h-5" />
            </a>
            {/* Order button - links to Uber Eats */}
            <a
              href={UBER_EATS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tomato hover:bg-tomato/90 text-white font-oswald font-bold uppercase tracking-wider px-6 py-2.5 transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.order')}
            </a>
          </div>

          {/* Mobile: Language Toggle & Menu Button */}
          <div className="xl:hidden flex items-center gap-2">
            <LanguageToggle variant={isMenuOrGalleryPage ? 'light' : (isScrolled || isMobileMenuOpen) ? 'dark' : 'light'} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 ${isMenuOrGalleryPage ? 'text-white' : (isScrolled || isMobileMenuOpen) ? 'text-espresso' : 'text-white'}`}
              aria-label={isMobileMenuOpen ? 'Sluit menu' : 'Open menu'}
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="xl:hidden bg-flour border-t border-espresso/10"
          >
            <nav className="container mx-auto px-4 py-6 flex flex-wrap gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-stamp text-xl md:text-2xl ${
                    pathname === item.href ? 'text-crust' : 'text-espresso'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="flex items-center gap-4 pt-4 border-t border-espresso/10">
                <a
                  href="https://www.instagram.com/wakenbakepanificio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-espresso hover:text-crust transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-6 h-6" />
                </a>
                <a
                  href="tel:+31201234567"
                  className="p-2 text-espresso hover:text-crust transition-colors"
                  aria-label="Bel ons"
                >
                  <Phone className="w-6 h-6" />
                </a>
              </div>
              {/* Mobile Order button - links to Uber Eats */}
              <a
                href={UBER_EATS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-tomato text-white text-center font-oswald font-bold uppercase tracking-wider py-3 mt-4"
              >
                {t('nav.order')}
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
