'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { CONSENT_CHANGED_EVENT } from '@/lib/analytics'

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT))
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:max-w-2xl z-50 bg-espresso text-white p-5 md:p-6 rounded-2xl shadow-2xl border border-white/10"
        >
          <div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="font-montserrat font-bold text-lg mb-2">
                  We gebruiken cookies
                </h3>
                <p className="text-white/80 text-sm">
                  Deze website gebruikt cookies om de gebruikerservaring te
                  verbeteren. Lees ons{' '}
                  <Link
                    href="/cookies"
                    className="underline hover:text-crust transition-colors"
                  >
                    cookiebeleid
                  </Link>{' '}
                  voor meer informatie.
                </p>
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  onClick={handleDecline}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-full border-2 border-white/80 text-white hover:bg-white hover:text-espresso transition-all duration-300 font-montserrat font-semibold"
                >
                  Weigeren
                </button>
                <button
                  onClick={handleAccept}
                  className="flex-1 md:flex-none px-6 py-2.5 rounded-full bg-crust text-espresso hover:bg-crust/90 transition-all duration-300 font-montserrat font-bold"
                >
                  Accepteren
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
