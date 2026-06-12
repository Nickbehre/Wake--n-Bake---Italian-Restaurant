'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MOTION_EASE } from '@/lib/animation/gsap'
import {
  preloaderWillShow,
  markPreloaderShown,
  markPreloaderDone,
} from '@/lib/animation/preloader-state'

/**
 * Thematische preloader: het logo stempelt neer op een espresso-doek,
 * de accentlijn tekent uit en het doek licht op naar boven.
 * Eén keer per sessie; reduced motion slaat hem volledig over.
 */
export default function Preloader() {
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (!preloaderWillShow()) return
    markPreloaderShown()
    setShow(true)

    document.documentElement.style.overflow = 'hidden'
    const t1 = setTimeout(() => setLeaving(true), 1700)
    const t2 = setTimeout(() => {
      setShow(false)
      markPreloaderDone()
      document.documentElement.style.overflow = ''
    }, 2500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      markPreloaderDone()
      document.documentElement.style.overflow = ''
    }
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] bg-espresso flex items-center justify-center overflow-hidden"
          initial={{ y: 0 }}
          animate={leaving ? { y: '-100%' } : { y: 0 }}
          transition={{ duration: 0.8, ease: MOTION_EASE.inOut }}
          aria-hidden
        >
          {/* watermerk */}
          <span className="absolute font-brand-sm text-[30vw] leading-none opacity-[0.05] select-none whitespace-nowrap">
            Panificio
          </span>

          <div className="relative flex flex-col items-center">
            {/* Logo stempelt neer */}
            <motion.img
              src="/assets/logo.png"
              alt=""
              className="w-28 h-28 md:w-36 md:h-36 object-contain drop-shadow-2xl"
              initial={{ scale: 2.2, opacity: 0, rotate: -14 }}
              animate={
                leaving
                  ? { opacity: 0, y: -30, transition: { duration: 0.3 } }
                  : {
                      scale: 1,
                      opacity: 1,
                      rotate: 0,
                      transition: { duration: 0.55, ease: MOTION_EASE.inOut, delay: 0.15 },
                    }
              }
            />

            <motion.p
              className="font-stamp text-2xl md:text-3xl mt-5"
              style={{ color: '#F9F7F2' }}
              initial={{ opacity: 0, y: 20 }}
              animate={
                leaving
                  ? { opacity: 0, y: -20, transition: { duration: 0.3 } }
                  : { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.6, ease: MOTION_EASE.out } }
              }
            >
              come taste the difference
            </motion.p>

            {/* accentlijn tekent uit */}
            <motion.div
              className="h-[3px] bg-accent rounded-full mt-5"
              initial={{ width: 0 }}
              animate={
                leaving
                  ? { opacity: 0, transition: { duration: 0.25 } }
                  : { width: 120, transition: { duration: 0.8, delay: 0.75, ease: MOTION_EASE.inOut } }
              }
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
