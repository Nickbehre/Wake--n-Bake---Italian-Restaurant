'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Instagram, Phone } from 'lucide-react'
import { usePathname } from 'next/navigation'
import LanguageToggle from '@/components/ui/LanguageToggle'
import { useLanguage } from '@/lib/context/LanguageContext'

// Thuisbezorgd order link
const THUISBEZORGD_URL = 'https://www.thuisbezorgd.nl/menu/wake-n-bake-panificio'

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

  // Check if we're on home page
  const isHomePage = pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isHomePage
          ? isScrolled || isMobileMenuOpen
            ? 'pt-2 px-3 md:px-6'
            : 'pt-0 px-0'
          : 'pt-2 px-3 md:px-6'
      }`}
    >
      <div className={`container mx-auto transition-all duration-500 ${
        isHomePage && !isScrolled && !isMobileMenuOpen
          ? 'bg-transparent px-4 py-2'
          : 'bg-[#f7f1e1]/95 backdrop-blur-md shadow-lg px-4 py-1 rounded-2xl'
      }`}>
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
          <nav className="hidden lg:flex items-center gap-1 xl:gap-4 2xl:gap-6 flex-nowrap">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`font-stamp text-sm xl:text-base 2xl:text-xl whitespace-nowrap transition-colors duration-300 relative group ${
                  pathname === item.href
                    ? 'text-crust'
                    : isHomePage && !isScrolled
                    ? 'text-white hover:text-crust'
                    : 'text-espresso hover:text-crust'
                }`}
              >
                {t(item.key)}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-crust group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          {/* CTA, Language Toggle & Social */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Toggle */}
            <LanguageToggle variant={isHomePage && !isScrolled ? 'light' : 'dark'} />

            <a
              href="https://www.instagram.com/wakenbake.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-full transition-colors ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/20'
                  : 'text-espresso hover:bg-crust/20'
              }`}
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="tel:+31653764546"
              className={`p-2 rounded-full transition-colors ${
                isHomePage && !isScrolled
                  ? 'text-white hover:bg-white/20'
                  : 'text-espresso hover:bg-crust/20'
              }`}
              aria-label="Bel ons"
            >
              <Phone className="w-5 h-5" />
            </a>
            {/* Order button - links to Uber Eats */}
            <a
              href={THUISBEZORGD_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-tomato hover:bg-tomato/90 text-white font-oswald font-bold uppercase tracking-wider px-6 py-2.5 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {t('nav.order')}
            </a>
          </div>

          {/* Mobile: Language Toggle & Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageToggle variant={isHomePage && !isScrolled && !isMobileMenuOpen ? 'light' : 'dark'} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 ${isHomePage && !isScrolled && !isMobileMenuOpen ? 'text-white' : 'text-espresso'}`}
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
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute right-3 md:right-6 top-full mt-2 w-56 bg-[#f7f1e1]/95 backdrop-blur-md shadow-xl rounded-2xl overflow-hidden"
          >
            <nav className="px-5 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-stamp text-lg py-2 px-2 rounded-lg transition-colors ${
                    pathname === item.href ? 'text-crust bg-crust/10' : 'text-espresso hover:bg-espresso/5'
                  }`}
                >
                  {t(item.key)}
                </Link>
              ))}
              <div className="flex items-center gap-3 pt-2 mt-1 border-t border-espresso/10">
                <a
                  href="https://www.instagram.com/wakenbake.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-espresso hover:text-crust transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="tel:+31653764546"
                  className="p-2 text-espresso hover:text-crust transition-colors"
                  aria-label="Bel ons"
                >
                  <Phone className="w-5 h-5" />
                </a>
              </div>
              <a
                href={THUISBEZORGD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-tomato text-white text-center font-oswald font-bold uppercase tracking-wider py-2.5 mt-2 rounded-full text-sm"
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
