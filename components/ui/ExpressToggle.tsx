'use client'

import { motion } from 'framer-motion'
import { useId } from 'react'
import { useExpress } from '@/lib/context/ExpressContext'
import { useLanguage } from '@/lib/context/LanguageContext'

interface ExpressToggleProps {
  variant?: 'light' | 'dark'
}

export default function ExpressToggle({ variant = 'dark' }: ExpressToggleProps) {
  const { isExpress, setExpress } = useExpress()
  const { t } = useLanguage()
  // Unique per instance so the desktop and mobile toggles don't share a
  // framer-motion layoutId (which would make the pill animate between them).
  const pillId = useId()

  const trackBg = variant === 'light' ? 'bg-white/10' : 'bg-espresso/10'
  const idleText = variant === 'light' ? 'text-white/80' : 'text-espresso/70'

  const options: { key: boolean; label: string }[] = [
    { key: false, label: t('nav.classic') },
    { key: true, label: t('nav.express') },
  ]

  return (
    <div
      className={`relative flex items-center ${trackBg} rounded-full p-1`}
      role="group"
      aria-label="Wake n' Bake mode"
    >
      {options.map((option) => {
        const active = isExpress === option.key
        return (
          <button
            key={String(option.key)}
            onClick={() => setExpress(option.key)}
            aria-pressed={active}
            className="relative z-10 px-3 py-1.5 rounded-full text-xs font-oswald font-bold uppercase tracking-wider transition-colors duration-200"
          >
            {active && (
              <motion.span
                layoutId={pillId}
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-crust shadow-sm"
              />
            )}
            <span className={`relative z-10 ${active ? 'text-white' : idleText}`}>
              {option.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
