'use client'

import { useLanguage } from '@/lib/context/LanguageContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

interface LanguageToggleProps {
  variant?: 'light' | 'dark'
}

export default function LanguageToggle({ variant = 'dark' }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const flags = {
    nl: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm shadow-sm">
        <path fill="#21468B" d="M0 0h640v480H0z" />
        <path fill="#FFF" d="M0 0h640v320H0z" />
        <path fill="#AE1C28" d="M0 0h640v160H0z" />
      </svg>
    ),
    en: (
      <svg viewBox="0 0 640 480" className="w-6 h-4 rounded-sm shadow-sm">
        <path fill="#012169" d="M0 0h640v480H0z" />
        <path
          fill="#FFF"
          d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"
        />
        <path
          fill="#C8102E"
          d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"
        />
        <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z" />
        <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z" />
      </svg>
    ),
  }

  const textColor = variant === 'light' ? 'text-white' : 'text-espresso'
  const bgColor = variant === 'light' ? 'bg-white/10 hover:bg-white/20' : 'bg-espresso/10 hover:bg-espresso/20'
  const dropdownBg = 'bg-flour'

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 rounded-full ${bgColor} transition-colors duration-200`}
        aria-label="Change language"
      >
        {flags[language]}
        <span className={`text-sm font-montserrat font-semibold uppercase ${textColor}`}>
          {language}
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className={`absolute right-0 top-full mt-2 ${dropdownBg} rounded-lg shadow-xl overflow-hidden z-50 min-w-[140px]`}
            >
              <button
                onClick={() => {
                  setLanguage('nl')
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-crust/20 transition-colors ${
                  language === 'nl' ? 'bg-crust/10' : ''
                }`}
              >
                {flags.nl}
                <span className="text-espresso font-montserrat font-medium">
                  Nederlands
                </span>
              </button>
              <button
                onClick={() => {
                  setLanguage('en')
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-crust/20 transition-colors ${
                  language === 'en' ? 'bg-crust/10' : ''
                }`}
              >
                {flags.en}
                <span className="text-espresso font-montserrat font-medium">
                  English
                </span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
