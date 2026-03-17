'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, X, Clock } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

function triggerHaptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate([100, 50, 100])
  }
}

interface StoreStatusGateProps {
  children: React.ReactNode
}

export function StoreStatusGate({ children }: StoreStatusGateProps) {
  const { t } = useLanguage()
  const [showModal, setShowModal] = useState(false)
  const [storeMessage, setStoreMessage] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function checkStore() {
      try {
        const res = await fetch('/api/time-slots')
        const data = await res.json()

        if (data.paused) {
          setStoreMessage(data.message || t('storeClosed.defaultMessage'))
          setShowModal(true)
          triggerHaptic()
        } else if (!data.slots || data.slots.length === 0) {
          setStoreMessage(data.message || t('storeClosed.noSlots'))
          setShowModal(true)
          triggerHaptic()
        } else {
          const hasAvailable = data.slots.some((s: any) => s.available)
          if (!hasAvailable) {
            setStoreMessage(t('storeClosed.allSlotsFull'))
            setShowModal(true)
            triggerHaptic()
          }
        }
      } catch {
        // If API fails, let them through
      }
      setChecking(false)
    }

    checkStore()
  }, [t])

  if (checking) {
    return (
      <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-tomato border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <>
      {showModal && (
        <Modal
          message={storeMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      {children}
    </>
  )
}

function Modal({ message, onClose }: { message: string; onClose: () => void }) {
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-tomato" />
            </div>
            <h2 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-2">
              {t('storeClosed.title')}
            </h2>
            <p className="text-espresso/70 font-lato mb-6">
              {message}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-espresso/50 mb-6">
              <Clock className="w-4 h-4" />
              <span className="font-lato">{t('storeClosed.hint')}</span>
            </div>
            <button
              onClick={onClose}
              className="w-full bg-tomato text-white py-3 rounded-full font-oswald text-lg font-bold uppercase tracking-wide hover:bg-red-700 transition-colors"
            >
              {t('storeClosed.button')}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
