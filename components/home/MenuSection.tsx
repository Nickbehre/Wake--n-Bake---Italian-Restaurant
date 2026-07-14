'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Coffee, Leaf, Fish, Sandwich, UtensilsCrossed } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import { useLanguage } from '@/lib/context/LanguageContext'
import { gsap } from '@/lib/animation/gsap'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import Magnetic from '@/components/animation/Magnetic'
import MenuPhotoOverlay, { type MenuPhoto } from '@/components/menu/MenuPhotoOverlay'

const schiacciatMenuPhotos: MenuPhoto[] = [
  { src: '/assets/menu/menu-pork.jpg', alt: 'Schiacciata Pork Menu', label: 'Schiacciata — Pork', color: 'bg-crust' },
  { src: '/assets/menu/menu-beef-fish.jpg', alt: 'Schiacciata Beef & Fish Menu', label: 'Schiacciata — Beef & Fish', color: 'bg-crust' },
  { src: '/assets/menu/menu-veggie.jpg', alt: 'Schiacciata Vegetarian Menu', label: 'Schiacciata — Vegetarian', color: 'bg-crust' },
]

const togoMenuPhotos: MenuPhoto[] = [
  { src: '/assets/menu/schiacciatamenutogo.jpg', alt: 'Schiacciata To-Go Menu', label: 'Schiacciata To-Go', color: 'bg-pistachio' },
  { src: '/assets/menu/coffeeandsweetsmenu.jpg', alt: 'Coffee & Sweet Treats Menu', label: 'Coffee & Sweet Treats', color: 'bg-pistachio' },
]

interface MenuCard {
  id: string
  image: string
  /** vertaal-key óf letterlijke tekst */
  label: string
  sub: string
  icon: React.ReactNode
  group: 'schiacciata' | 'togo'
  groupIndex: number
}

const menuCards: MenuCard[] = [
  {
    id: 'pork',
    image: '/assets/menu/menu-pork.jpg',
    label: 'menu.category.pork',
    sub: 'menuPage.schiacciatMenuTag',
    icon: <UtensilsCrossed className="w-4 h-4" />,
    group: 'schiacciata',
    groupIndex: 0,
  },
  {
    id: 'beef',
    image: '/assets/menu/menu-beef-fish.jpg',
    label: 'menu.category.beef',
    sub: 'menuPage.schiacciatMenuTag',
    icon: <Fish className="w-4 h-4" />,
    group: 'schiacciata',
    groupIndex: 1,
  },
  {
    id: 'vegetarian',
    image: '/assets/menu/menu-veggie.jpg',
    label: 'menu.category.vegetarian',
    sub: 'menuPage.schiacciatMenuTag',
    icon: <Leaf className="w-4 h-4" />,
    group: 'schiacciata',
    groupIndex: 2,
  },
  {
    id: 'togo',
    image: '/assets/menu/schiacciatamenutogo.jpg',
    label: 'Schiacciata To-Go',
    sub: 'menuPage.togoMenuTag',
    icon: <Sandwich className="w-4 h-4" />,
    group: 'togo',
    groupIndex: 0,
  },
  {
    id: 'coffee',
    image: '/assets/menu/coffeeandsweetsmenu.jpg',
    label: 'Coffee & Sweet Treats',
    sub: 'menuPage.togoMenuTag',
    icon: <Coffee className="w-4 h-4" />,
    group: 'togo',
    groupIndex: 1,
  },
]

/**
 * Menu-showpiece: op desktop een gepinde horizontale scroll-galerij
 * met container-parallax per kaart; op mobiel een native snap-carousel.
 * Klikken opent de bestaande MenuPhotoOverlay op de juiste foto.
 */
export default function MenuSection() {
  const { t } = useLanguage()
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const [overlayOpen, setOverlayOpen] = useState(false)
  const [overlayPhotos, setOverlayPhotos] = useState<MenuPhoto[]>(schiacciatMenuPhotos)
  const [overlayIndex, setOverlayIndex] = useState(0)

  const openCard = (card: MenuCard) => {
    setOverlayPhotos(card.group === 'schiacciata' ? schiacciatMenuPhotos : togoMenuPhotos)
    setOverlayIndex(card.groupIndex)
    setOverlayOpen(true)
  }

  useGSAP(
    () => {
      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const mm = gsap.matchMedia()
      mm.add(
        '(min-width: 1024px) and (prefers-reduced-motion: no-preference)',
        () => {
          const getDistance = () => track.scrollWidth - window.innerWidth

          gsap.to(track, {
            x: () => -getDistance(),
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: () => `+=${getDistance()}`,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                if (progressRef.current) {
                  progressRef.current.style.transform = `scaleX(${self.progress})`
                }
              },
            },
          })
        }
      )
    },
    { scope: sectionRef }
  )

  return (
    <>
      <section
        ref={sectionRef}
        className="relative bg-flour overflow-hidden lg:h-[100svh] lg:flex lg:flex-col lg:justify-center py-20 lg:py-0"
      >
        {/* Papier-textuur */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Header */}
        <div className="container mx-auto px-4 relative z-10 text-center mb-10 lg:mb-12">
          <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('menu.label')}
          </Reveal>
          <SplitTextReveal
            as="h2"
            type="lines"
            className="font-brand-dark text-5xl md:text-6xl lg:text-7xl mb-4"
          >
            {t('menu.headline')}
          </SplitTextReveal>
          <Reveal as="p" delay={0.1} className="font-lato text-lg md:text-xl text-espresso/70">
            {t('menu.subheadline')}
          </Reveal>
        </div>

        {/* Horizontale track (desktop) / snap-carousel (mobiel) */}
        <div className="relative z-10">
          <div
            ref={trackRef}
            className="flex gap-5 md:gap-8 px-4 md:px-8 lg:px-[8vw] overflow-x-auto lg:overflow-visible snap-x snap-mandatory lg:snap-none scrollbar-hide will-change-transform"
          >
            {menuCards.map((card, i) => (
              <button
                key={card.id}
                data-menu-card
                onClick={() => openCard(card)}
                data-cursor="link"
                className="group relative flex-shrink-0 w-[75vw] sm:w-[46vw] lg:w-[26vw] snap-center text-left cursor-pointer"
                aria-label={`${t(card.label)} — ${t('story.clickToEnlarge')}`}
              >
                <Reveal
                  clip
                  delay={i * 0.08}
                  className="relative aspect-[5/7] rounded-3xl overflow-hidden shadow-xl"
                >
                  <Image
                    src={card.image}
                    alt={t(card.label)}
                    fill
                    sizes="(max-width: 1024px) 75vw, 26vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  {/* gradient + label */}
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/85 via-espresso/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white font-oswald uppercase tracking-widest text-[10px] mb-3">
                      {card.icon}
                      {t(card.sub)}
                    </span>
                    <h3 className="font-stamp text-2xl md:text-3xl text-white drop-shadow-md">
                      {t(card.label)}
                    </h3>
                    <span className="mt-2 inline-flex items-center gap-1.5 text-crust font-oswald uppercase tracking-wider text-xs opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      {t('story.clickToEnlarge')}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Reveal>
              </button>
            ))}

            {/* Slotkaart: CTA naar volledig menu */}
            <div
              data-menu-card
              className="relative flex-shrink-0 w-[75vw] sm:w-[46vw] lg:w-[26vw] snap-center"
            >
              <Reveal
                clip
                delay={menuCards.length * 0.08}
                className="relative aspect-[5/7] rounded-3xl overflow-hidden shadow-xl bg-espresso flex items-center justify-center"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center font-brand-sm text-[9rem] leading-none opacity-[0.06] select-none rotate-[-12deg] pointer-events-none"
                >
                  Menu
                </span>
                <div className="relative text-center px-8 py-24">
                  <p className="font-stamp text-2xl text-crust mb-6">
                    {t('menuPage.togoMenuSubtitle')}
                  </p>
                  <Magnetic>
                    <Link
                      href="/menu"
                      data-cursor="link"
                      className="inline-flex items-center gap-3 bg-accent text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 rounded-full transition-all duration-300 hover:shadow-2xl group"
                    >
                      {t('menu.viewFull')}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Magnetic>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Voortgangsbalk (desktop pin) */}
          <div className="hidden lg:block mx-auto mt-10 w-48 h-[3px] bg-espresso/10 rounded-full overflow-hidden">
            <div
              ref={progressRef}
              className="h-full bg-accent rounded-full origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </section>

      <MenuPhotoOverlay
        isOpen={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        photos={overlayPhotos}
        initialIndex={overlayIndex}
      />
    </>
  )
}
