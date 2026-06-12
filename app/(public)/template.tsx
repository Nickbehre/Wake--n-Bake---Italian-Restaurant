'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { MOTION_EASE } from '@/lib/animation/gsap'

/**
 * Page transition: elke route-wissel komt binnen met een zachte
 * lift + fade (template.tsx remount per navigatie). Reduced motion
 * wordt globaal afgehandeld via MotionConfig in de layout.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: MOTION_EASE.out }}
    >
      {children}
    </motion.div>
  )
}
