// ============================================
// LOCATION DATA — single source of truth
// Two filialen: Wake N' Bake (origineel) en
// Wake N' Bake Express (nieuw filiaal)
//
// ⚠️  EXPRESS BEVAT PLACEHOLDER-GEGEVENS — vervang
//     adres / tijden / telefoon / links zodra bekend.
//     Alles staat in dít bestand; de rest van de
//     site leest uitsluitend hieruit.
// ============================================

export type LocationId = 'original' | 'express'

export interface DayHours {
  /** 0 = zondag … 6 = zaterdag (Date.getDay) */
  days: number[]
  opens: string // 'HH:MM'
  closes: string // 'HH:MM'
}

export interface RestaurantLocation {
  id: LocationId
  name: string
  shortName: string
  /** Badge-tekst zoals 'NIEUW' — alleen voor Express */
  isNew: boolean
  /** Gegevens nog niet definitief? Dan tonen we 'binnenkort'-hints */
  isPlaceholder: boolean
  address: {
    street: string
    postalCode: string
    city: string
    area: string // buurt, bv. 'Centrum' / 'De Pijp'
  }
  geo: { lat: number; lng: number }
  phone: string
  phoneHref: string
  email: string
  thuisbezorgdUrl: string | null
  googleMapsUrl: string
  mapEmbedSrc: string
  /** Gestructureerde uren voor open/dicht-logica + schema.org */
  hours: DayHours[]
  /** Weergave-strings per taal (volgorde: weekdagen, zaterdag, zondag) */
  hoursDisplay: { nl: string[]; en: string[] }
  /** Accentkleur per filiaal (CSS custom properties) */
  accent: {
    hex: string
    rgb: string // 'R G B' voor alpha-varianten
    soft: string // zachte tint voor achtergronden
  }
  instagram: string
}

export const LOCATIONS: Record<LocationId, RestaurantLocation> = {
  original: {
    id: 'original',
    name: "Wake N' Bake Panificio",
    shortName: 'Vijzelstraat',
    isNew: false,
    isPlaceholder: false,
    address: {
      street: 'Vijzelstraat 93h',
      postalCode: '1017 HH',
      city: 'Amsterdam',
      area: 'Centrum',
    },
    geo: { lat: 52.36383074070107, lng: 4.891507396929842 },
    phone: '+31 6 53764546',
    phoneHref: 'tel:+31653764546',
    email: 'info@wakenbake.nl',
    thuisbezorgdUrl: 'https://www.thuisbezorgd.nl/menu/wake-n-bake-panificio',
    googleMapsUrl: 'https://maps.app.goo.gl/Drcw4nWtCkzg65M57',
    mapEmbedSrc:
      "https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d731.8510597653282!2d4.892293707375058!3d52.36318569111751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x47c60986e493b3a9%3A0x51d128d5f0204561!2sWake%20N'%20Bake%2C%20Vijzelstraat%2093h%2C%201017%20HH%20Amsterdam!3m2!1d52.363344999999995!2d4.89238!5e1!3m2!1sen!2snl!4v1769987377221!5m2!1sen!2snl",
    hours: [
      { days: [1, 2, 3, 4, 5], opens: '07:30', closes: '16:30' },
      { days: [6], opens: '08:00', closes: '18:00' },
    ],
    hoursDisplay: {
      nl: ['Ma – Vr: 07:30 – 16:30', 'Za: 08:00 – 18:00', 'Zo: Gesloten'],
      en: ['Mon – Fri: 07:30 – 16:30', 'Sat: 08:00 – 18:00', 'Sun: Closed'],
    },
    accent: {
      hex: '#CE2029', // tomato
      rgb: '206 32 41',
      soft: '#F9E4E5',
    },
    instagram: 'https://www.instagram.com/wakenbake.nl/',
  },

  // ──────────────────────────────────────────
  // ⚠️ PLACEHOLDER — vervang zodra de echte
  //    Express-gegevens bekend zijn
  // ──────────────────────────────────────────
  express: {
    id: 'express',
    name: "Wake N' Bake Express",
    shortName: 'Express · De Pijp',
    isNew: true,
    isPlaceholder: true,
    address: {
      street: 'Ferdinand Bolstraat 24', // ⚠️ PLACEHOLDER
      postalCode: '1072 LK', // ⚠️ PLACEHOLDER
      city: 'Amsterdam',
      area: 'De Pijp',
    },
    geo: { lat: 52.35586, lng: 4.89175 }, // ⚠️ PLACEHOLDER
    phone: '+31 6 53764546', // ⚠️ PLACEHOLDER (zelfde nummer)
    phoneHref: 'tel:+31653764546',
    email: 'express@wakenbake.nl', // ⚠️ PLACEHOLDER
    thuisbezorgdUrl: null, // ⚠️ nog geen Thuisbezorgd-link
    googleMapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Ferdinand+Bolstraat+24+Amsterdam', // ⚠️ PLACEHOLDER
    mapEmbedSrc:
      'https://www.google.com/maps?q=Ferdinand+Bolstraat+24,+1072+LK+Amsterdam&z=16&output=embed', // ⚠️ PLACEHOLDER
    hours: [
      { days: [1, 2, 3, 4, 5], opens: '08:00', closes: '20:00' }, // ⚠️ PLACEHOLDER
      { days: [6, 0], opens: '09:00', closes: '20:00' }, // ⚠️ PLACEHOLDER
    ],
    hoursDisplay: {
      nl: ['Ma – Vr: 08:00 – 20:00', 'Za – Zo: 09:00 – 20:00', '7 dagen per week'],
      en: ['Mon – Fri: 08:00 – 20:00', 'Sat – Sun: 09:00 – 20:00', '7 days a week'],
    },
    accent: {
      hex: '#5E9C42', // pistachio, iets dieper voor contrast (WCAG op flour)
      rgb: '94 156 66',
      soft: '#EAF3E4',
    },
    instagram: 'https://www.instagram.com/wakenbake.nl/',
  },
}

export const DEFAULT_LOCATION: LocationId = 'original'

export function getLocation(id: LocationId): RestaurantLocation {
  return LOCATIONS[id] ?? LOCATIONS[DEFAULT_LOCATION]
}

export function getOtherLocation(id: LocationId): RestaurantLocation {
  return id === 'original' ? LOCATIONS.express : LOCATIONS.original
}

export function isValidLocationId(value: string | null): value is LocationId {
  return value === 'original' || value === 'express'
}

/** Is het filiaal op dit moment open? (Amsterdam-tijd) */
export function checkIsOpen(location: RestaurantLocation): boolean {
  const now = new Date()
  const amsterdam = new Date(
    now.toLocaleString('en-US', { timeZone: 'Europe/Amsterdam' })
  )
  const day = amsterdam.getDay()
  const minutes = amsterdam.getHours() * 60 + amsterdam.getMinutes()

  for (const slot of location.hours) {
    if (!slot.days.includes(day)) continue
    const [oh, om] = slot.opens.split(':').map(Number)
    const [ch, cm] = slot.closes.split(':').map(Number)
    if (minutes >= oh * 60 + om && minutes < ch * 60 + cm) return true
  }
  return false
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

/** schema.org OpeningHoursSpecification voor een filiaal */
export function toOpeningHoursSchema(location: RestaurantLocation) {
  return location.hours.map((slot) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: slot.days.map((d) => DAY_NAMES[d]),
    opens: slot.opens,
    closes: slot.closes,
  }))
}
