'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'nl' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  nl: {
    // Story Section
    'story.headline': 'Van Italië naar de Vijzelstraat.',
    'story.subtext1': "Het begon met een obsessie voor de perfecte 'crunch'. Geen shortcuts, alleen tijd, passie en de beste ingrediënten.",
    'story.subtext2': 'Elke dag vers deeg. Rijkelijk belegd. The real Italian deal, right here in Amsterdam.',
    'story.videoCaption': 'Bekijk hoe het allemaal begon',
    'story.label': 'Ons Verhaal',
    'story.followInstagram': 'Volg ons op Instagram',
    'story.clickToEnlarge': 'Klik om te vergroten',
    'story.close': 'Sluiten',
    'story.soundOn': 'Geluid aan',
    'story.soundOff': 'Geluid uit',
    'story.clickToClose': 'Klik ergens om te sluiten',
    'story.video1.caption': 'Het Deeg',
    'story.video1.description': 'De perfecte crunch begint met het perfecte deeg',
    'story.video2.caption': 'De Oven',
    'story.video2.description': 'Kijk hoe het rijst in onze authentieke oven',
    'story.video3.caption': 'Het Resultaat',
    'story.video3.description': 'Vers uit de oven, klaar om van te genieten',

    // Location Section
    'location.headline': 'Kom Proeven.',
    'location.subheadline': 'Vind ons in hartje Amsterdam',
    'location.address': 'Vijzelstraat 93h, 1017 HH Amsterdam',
    'location.directions': 'Routebeschrijving',
    'location.hours': 'Openingstijden',
    'location.weekdays': 'Ma - Vr: 08:00 - 18:00',
    'location.weekends': 'Za - Zo: 09:00 - 17:00',
    'location.openNow': 'Nu Open',
    'location.closed': 'Gesloten',
    'location.googleMaps': 'Open in Google Maps',
    'location.label': 'Bezoek Ons',
    'location.orderOnline': 'Bestel Nu Online',

    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'Over Ons',
    'nav.gallery': 'Gallerij',
    'nav.contact': 'Contact',
    'nav.order': 'BESTEL NU',

    // Hero
    'hero.tagline': "De knapperigste Schiacciata van Amsterdam. Rijkelijk belegd, vers uit de oven.",
    'hero.cta.menu': 'BEKIJK MENU',
    'hero.cta.order': 'BESTEL NU',

    // USP Section
    'usp.label': 'Wat Ons Uniek Maakt',
    'usp.headline': "Waarom Wake N' Bake?",
    'usp.authentic.title': 'Authentiek Ambachtelijk',
    'usp.authentic.desc': 'Traditionele Italiaanse recepten, dagelijks vers gebakken met de beste ingrediënten.',
    'usp.fast.title': 'Snel & Vers',
    'usp.fast.desc': 'Direct uit de oven. Perfect voor een snelle lunch of heerlijk ontbijt.',
    'usp.love.title': 'Met Liefde Gemaakt',
    'usp.love.desc': 'Elke focaccia wordt met passie en aandacht voor detail bereid.',

    // Menu Section
    'menu.label': 'Schiacciata',
    'menu.headline': 'Ons Menu',
    'menu.subheadline': 'Verse Schiacciata, dagelijks bereid',
    'menu.regular': 'Normaal',
    'menu.large': 'Groot',
    'menu.category.pork': 'Varken Schiacciata',
    'menu.category.vegetarian': 'Vegetarische Schiacciata',
    'menu.category.beef': 'Rund | Vis Schiacciata',
    'menu.viewFull': 'Bekijk Volledig Menu',

    // Reviews Section
    'reviews.label': 'Geliefd bij Locals',
    'reviews.headline': 'Geliefd bij Locals',
    'reviews.subheadline': 'Wat onze klanten zeggen',
    'reviews.rating': '4.9 sterren op basis van 200+ reviews',
    'reviews.cta': 'Bekijk alle reviews op Google',

    // CTA Section
    'cta.headline': 'Kom Langs!',
    'cta.description': 'Ervaar de authentieke Italiaanse sfeer en proef onze vers gebakken specialiteiten. We verwelkomen je graag in onze bakkerij.',
    'cta.visit': 'PLAN JE BEZOEK',
    'cta.call': 'BEL ONS',
    'cta.location': 'Locatie',
    'cta.hours': 'Openingstijden',
    'cta.contact': 'Contact',

    // Footer
    'footer.description': 'Authentieke Italiaanse bakkerij in hartje Amsterdam. Elke dag vers gebakken met liefde en passie.',
    'footer.rights': 'Alle rechten voorbehouden.',
  },
  en: {
    // Story Section
    'story.headline': 'From Italy to Vijzelstraat.',
    'story.subtext1': "It started with an obsession for the perfect 'crunch'. No shortcuts, just time, passion and the finest ingredients.",
    'story.subtext2': 'Fresh dough every day. Generously topped. The real Italian deal, right here in Amsterdam.',
    'story.videoCaption': 'Watch how it all started',
    'story.label': 'Our Story',
    'story.followInstagram': 'Follow us on Instagram',
    'story.clickToEnlarge': 'Click to enlarge',
    'story.close': 'Close',
    'story.soundOn': 'Sound on',
    'story.soundOff': 'Sound off',
    'story.clickToClose': 'Click anywhere to close',
    'story.video1.caption': 'The Dough',
    'story.video1.description': 'The perfect crunch starts with the perfect dough',
    'story.video2.caption': 'The Oven',
    'story.video2.description': 'Watch it rise in our authentic oven',
    'story.video3.caption': 'The Result',
    'story.video3.description': 'Fresh from the oven, ready to enjoy',

    // Location Section
    'location.headline': 'Come Taste It.',
    'location.subheadline': 'Find us in the heart of Amsterdam',
    'location.address': 'Vijzelstraat 93h, 1017 HH Amsterdam',
    'location.directions': 'Get Directions',
    'location.hours': 'Opening Hours',
    'location.weekdays': 'Mon - Fri: 08:00 - 18:00',
    'location.weekends': 'Sat - Sun: 09:00 - 17:00',
    'location.openNow': 'Open Now',
    'location.closed': 'Closed',
    'location.googleMaps': 'Open in Google Maps',
    'location.label': 'Visit Us',
    'location.orderOnline': 'Order Now Online',

    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About Us',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.order': 'ORDER NOW',

    // Hero
    'hero.tagline': "The crispiest Schiacciata in Amsterdam. Generously topped, fresh from the oven.",
    'hero.cta.menu': 'VIEW MENU',
    'hero.cta.order': 'ORDER NOW',

    // USP Section
    'usp.label': 'What Makes Us Unique',
    'usp.headline': "Why Wake N' Bake?",
    'usp.authentic.title': 'Authentic & Artisanal',
    'usp.authentic.desc': 'Traditional Italian recipes, freshly baked daily with the finest ingredients.',
    'usp.fast.title': 'Quick & Fresh',
    'usp.fast.desc': 'Straight from the oven. Perfect for a quick lunch or delicious breakfast.',
    'usp.love.title': 'Made With Love',
    'usp.love.desc': 'Every focaccia is prepared with passion and attention to detail.',

    // Menu Section
    'menu.label': 'Schiacciata',
    'menu.headline': 'Our Menu',
    'menu.subheadline': 'Fresh Schiacciata, made daily',
    'menu.regular': 'Regular',
    'menu.large': 'Large',
    'menu.category.pork': 'Pork Schiacciata',
    'menu.category.vegetarian': 'Vegetarian Schiacciata',
    'menu.category.beef': 'Beef | Fish Schiacciata',
    'menu.viewFull': 'View Full Menu',

    // Reviews Section
    'reviews.label': 'Loved by Locals',
    'reviews.headline': 'Loved by Locals',
    'reviews.subheadline': 'What our customers say',
    'reviews.rating': '4.9 stars based on 200+ reviews',
    'reviews.cta': 'View all reviews on Google',

    // CTA Section
    'cta.headline': 'Visit Us!',
    'cta.description': 'Experience the authentic Italian atmosphere and taste our freshly baked specialties. We warmly welcome you to our bakery.',
    'cta.visit': 'PLAN YOUR VISIT',
    'cta.call': 'CALL US',
    'cta.location': 'Location',
    'cta.hours': 'Opening Hours',
    'cta.contact': 'Contact',

    // Footer
    'footer.description': 'Authentic Italian bakery in the heart of Amsterdam. Freshly baked every day with love and passion.',
    'footer.rights': 'All rights reserved.',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage for saved preference
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'nl' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // Always render children, but use default language until mounted
  const contextValue = {
    language: mounted ? language : 'nl',
    setLanguage,
    t: (key: string) => translations[mounted ? language : 'nl'][key] || key,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
