'use client'

import { useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { Play, X, Instagram, Volume2, VolumeX } from 'lucide-react'

// Real video content - story videos from public/assets/videos folder
const instagramReels = [
  {
    id: 1,
    video: '/assets/videos/story-1.mp4',
    caption: 'Het Deeg',
    description: 'De perfecte crunch begint met het perfecte deeg',
    rotation: -3,
  },
  {
    id: 2,
    video: '/assets/videos/story-2.mp4',
    caption: 'De Oven',
    description: 'Kijk hoe het rijst in onze authentieke oven',
    rotation: 2,
  },
  {
    id: 3,
    video: '/assets/videos/story-3.mp4',
    caption: 'Het Resultaat',
    description: 'Vers uit de oven, klaar om van te genieten',
    rotation: -2,
  },
]

interface ReelCardProps {
  reel: typeof instagramReels[0]
  index: number
  onOpen: () => void
}

function ReelCard({ reel, index, onOpen }: ReelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const isInView = useInView(cardRef, { once: true, margin: '-100px' })

  return (
    <motion.div
      ref={cardRef}
      layoutId={`reel-container-${reel.id}`}
      initial={{ opacity: 0, y: 60, rotate: 0 }}
      animate={isInView ? {
        opacity: 1,
        y: 0,
        rotate: reel.rotation,
      } : {}}
      transition={{
        duration: 0.6,
        delay: index * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{
        scale: 1.05,
        rotate: 0,
        zIndex: 10,
        transition: { duration: 0.3 },
      }}
      onClick={onOpen}
      className="relative group cursor-pointer w-full max-w-[220px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[280px]"
      style={{ transformOrigin: 'center bottom' }}
    >
      {/* Phone frame */}
      <div className="relative bg-espresso rounded-3xl p-2 shadow-2xl w-full">
        {/* Screen */}
        <div className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden bg-[#2C2C2C]">
          {/* Real Video - muted, loop, autoplay with fallback background */}
          <video
            ref={videoRef}
            src={reel.video}
            muted
            loop
            playsInline
            autoPlay
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover bg-[#2C2C2C]"
            style={{ backgroundColor: '#2C2C2C' }}
          />

          {/* Instagram-style gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

          {/* Play indicator on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-16 h-16 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </motion.div>
          </div>

          {/* Click to expand hint */}
          <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-white text-xs font-oswald uppercase tracking-wider">Klik om te vergroten</span>
          </div>

          {/* Instagram UI elements */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-crust flex items-center justify-center">
                <span className="text-xs font-bold text-espresso">WB</span>
              </div>
              <span className="text-white text-sm font-semibold">wakenbake.nl</span>
            </div>
            <p className="text-white/90 text-sm font-oswald uppercase tracking-wide">
              {reel.caption}
            </p>
          </div>
        </div>

        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-espresso rounded-full" />
      </div>

      {/* Tape/sticker decoration for scrapbook effect */}
      {index % 2 === 0 && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 bg-crust/60 rotate-3 z-20" />
      )}
      {index % 2 === 1 && (
        <div className="absolute -top-2 right-4 w-12 h-5 bg-mortadella/60 -rotate-6 z-20" />
      )}
    </motion.div>
  )
}

// Lightbox Modal Component
interface LightboxProps {
  reel: typeof instagramReels[0]
  onClose: () => void
}

function Lightbox({ reel, onClose }: LightboxProps) {
  const [isMuted, setIsMuted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setIsMuted(!isMuted)
    }
  }, [isMuted])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg"
      onClick={onClose}
    >
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Sluiten"
      >
        <X className="w-8 h-8 text-white" />
      </motion.button>

      {/* Mute/Unmute button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        onClick={(e) => {
          e.stopPropagation()
          toggleMute()
        }}
        className="absolute top-6 left-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label={isMuted ? 'Geluid aan' : 'Geluid uit'}
      >
        {isMuted ? (
          <VolumeX className="w-6 h-6 text-white" />
        ) : (
          <Volume2 className="w-6 h-6 text-white" />
        )}
      </motion.button>

      {/* Video container */}
      <motion.div
        layoutId={`reel-container-${reel.id}`}
        className="relative w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone frame - larger */}
        <div className="relative bg-espresso rounded-[2.5rem] p-3 shadow-2xl">
          {/* Screen */}
          <div className="relative aspect-[9/16] w-full rounded-[2rem] overflow-hidden bg-espresso">
            {/* Video with sound enabled */}
            <video
              ref={videoRef}
              src={reel.video}
              muted={isMuted}
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover bg-[#2C2C2C]"
              style={{ backgroundColor: '#2C2C2C' }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

            {/* Caption */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-crust flex items-center justify-center">
                  <span className="text-sm font-bold text-espresso">WB</span>
                </div>
                <div>
                  <span className="text-white font-semibold block">wakenbake.nl</span>
                  <span className="text-white/60 text-sm">Amsterdam</span>
                </div>
              </div>
              <h3 className="text-white text-2xl font-oswald uppercase tracking-wide mb-2">
                {reel.caption}
              </h3>
              <p className="text-white/80 font-lato">
                {reel.description}
              </p>
            </div>
          </div>

          {/* Notch */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-7 bg-espresso rounded-full" />
        </div>
      </motion.div>

      {/* Hint text */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="absolute bottom-8 text-white/50 text-sm font-oswald uppercase tracking-wider"
      >
        Klik ergens om te sluiten
      </motion.p>
    </motion.div>
  )
}

export default function StorySection() {
  const { t } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: '-100px' })
  const [selectedReel, setSelectedReel] = useState<typeof instagramReels[0] | null>(null)

  return (
    <>
      <section
        ref={containerRef}
        className="relative py-24 md:py-32 bg-flour overflow-hidden"
      >
        {/* Subtle texture background */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-crust/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-pistachio/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 text-tomato font-oswald font-bold text-sm tracking-[0.2em] uppercase mb-4"
            >
              <Instagram className="w-4 h-4" />
              Ons Verhaal
            </motion.span>

            <h2 className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('story.headline')}
            </h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
              className="font-lato text-xl md:text-2xl text-espresso/80 max-w-3xl mx-auto leading-relaxed"
            >
              {t('story.subtext1')}
            </motion.p>
          </motion.div>

          {/* Instagram Reels Grid - 3 videos */}
          <div className="relative max-w-5xl mx-auto">
            {/* Grid container - 3 columns for 3 videos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 lg:gap-10 justify-items-center">
              {instagramReels.map((reel, index) => (
                <ReelCard
                  key={reel.id}
                  reel={reel}
                  index={index}
                  onOpen={() => setSelectedReel(reel)}
                />
              ))}
            </div>

            {/* Floating quote */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-16 text-center"
            >
              <blockquote className="relative inline-block">
                <span className="absolute -top-6 -left-4 text-6xl text-crust/20 font-playfair">&ldquo;</span>
                <p className="font-playfair italic text-2xl md:text-3xl lg:text-4xl text-espresso/90 max-w-4xl mx-auto leading-relaxed px-8">
                  {t('story.subtext2')}
                </p>
                <span className="absolute -bottom-10 -right-4 text-6xl text-crust/20 font-playfair">&rdquo;</span>
              </blockquote>
            </motion.div>
          </div>

          {/* Instagram CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-center mt-16"
          >
            <a
              href="https://www.instagram.com/wakenbake.nl/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl group"
            >
              <Instagram className="w-5 h-5" />
              Volg ons op Instagram
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedReel && (
          <Lightbox
            reel={selectedReel}
            onClose={() => setSelectedReel(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
