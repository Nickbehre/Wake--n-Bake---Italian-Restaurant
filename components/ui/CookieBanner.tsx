'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

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
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShowBanner(false)
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-espresso text-white p-6 shadow-2xl"
        >
          <div className="container mx-auto">
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
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDecline}
                  className="px-6 py-2 border-2 border-white text-white hover:bg-white hover:text-espresso transition-all duration-300 font-montserrat font-semibold"
                >
                  Weigeren
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2 bg-crust text-espresso hover:bg-crust/90 transition-all duration-300 font-montserrat font-bold"
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
