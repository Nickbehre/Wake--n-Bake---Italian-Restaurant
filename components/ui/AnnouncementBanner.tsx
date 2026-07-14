'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, X, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

interface Announcement {
  enabled: boolean
  text_nl?: string
  text_en?: string
  productId?: string
}

const DISMISS_KEY = 'wnb-announcement-dismissed'

/**
 * Aankondigingsbanner (bv. daily special) — instelbaar via het admin-dashboard
 * (Settings → Announcement). Dismissen onthouden we per tekst, zodat een
 * nieuwe aankondiging opnieuw verschijnt.
 */
export default function AnnouncementBanner() {
  const { language } = useLanguage()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    fetch('/api/announcement', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        const a: Announcement = data.announcement
        if (a?.enabled && (a.text_nl || a.text_en)) {
          setAnnouncement(a)
          const key = `${a.text_nl}|${a.text_en}`
          setDismissed(localStorage.getItem(DISMISS_KEY) === key)
        }
      })
      .catch(() => {})
  }, [])

  if (!announcement) return null

  const text = (language === 'nl' ? announcement.text_nl : announcement.text_en)
    || announcement.text_en || announcement.text_nl || ''

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, `${announcement!.text_nl}|${announcement!.text_en}`)
    setDismissed(true)
  }

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-xl"
        >
          <div className="flex items-center gap-3 bg-espresso text-white rounded-full shadow-2xl pl-4 pr-2 py-2.5">
            <Megaphone className="w-4 h-4 text-mortadella flex-shrink-0" />
            <p className="flex-1 font-lato text-sm leading-snug">{text}</p>
            {announcement.productId && (
              <Link
                href="/menu"
                onClick={dismiss}
                className="flex items-center gap-1 bg-tomato hover:bg-red-700 transition-colors rounded-full px-3 py-1.5 font-oswald text-xs uppercase tracking-wider whitespace-nowrap"
              >
                {language === 'nl' ? 'Bekijk' : 'View'}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            <button
              onClick={dismiss}
              className="p-1.5 text-white/60 hover:text-white transition-colors"
              aria-label={language === 'nl' ? 'Sluiten' : 'Dismiss'}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
