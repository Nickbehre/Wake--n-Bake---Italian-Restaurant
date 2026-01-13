'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '@/lib/context/LanguageContext'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Review {
  name: string
  rating: number
  text: string
  source: string
}

const reviews: Review[] = [
  {
    name: 'Gianluigi V.',
    rating: 5,
    text: 'Authentic Italian feel, food is awesome and the guys working there are friendly and efficient. Very nice experience.',
    source: 'Google',
  },
  {
    name: 'Paloma O.',
    rating: 5,
    text: 'Delicious food! They have many options of schiacciata and slices of pizza. Fresh products and very nice service!',
    source: 'Google',
  },
  {
    name: 'Meva A.',
    rating: 5,
    text: 'It was the most delicious caprese sandwich I have ever eaten. Everything was so tasty!',
    source: 'Google',
  },
  {
    name: 'Gabriela G.',
    rating: 5,
    text: 'Nice place, friendly staff, perfect for the lovers of Italian food! Variety of snacks and small bites.',
    source: 'Google',
  },
  {
    name: 'Marco T.',
    rating: 5,
    text: 'Finally, real Italian schiacciata in Amsterdam! The mortadella is incredible. Will come back every week!',
    source: 'Google',
  },
  {
    name: 'Sarah K.',
    rating: 5,
    text: 'Best lunch spot near Vijzelstraat. Quick, fresh, and the staff remembers your order. Love it!',
    source: 'Google',
  },
]

export default function ReviewsSection() {
  const { t } = useLanguage()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 380
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
      setTimeout(checkScroll, 300)
    }
  }

  return (
    <section className="py-24 bg-espresso relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A056' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('reviews.label')}
          </span>
          <h2 className="font-brand text-5xl md:text-6xl lg:text-7xl mb-6">
            {t('reviews.headline')}
          </h2>
          <p className="font-lato text-xl text-white/70 max-w-2xl mx-auto mb-6">
            {t('reviews.subheadline')}
          </p>

          {/* Rating Summary */}
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-crust text-crust" />
              ))}
            </div>
            <span className="text-white/80 font-oswald ml-2">
              {t('reviews.rating')}
            </span>
          </div>
        </motion.div>

        {/* Reviews Carousel */}
        <div className="relative">
          {/* Scroll Buttons */}
          <button
            onClick={() => scroll('left')}
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-crust rounded-full shadow-lg transition-all duration-300 hidden md:flex ${
              canScrollLeft
                ? 'opacity-100 hover:scale-110'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-6 h-6 text-espresso" />
          </button>
          <button
            onClick={() => scroll('right')}
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-crust rounded-full shadow-lg transition-all duration-300 hidden md:flex ${
              canScrollRight
                ? 'opacity-100 hover:scale-110'
                : 'opacity-0 pointer-events-none'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-6 h-6 text-espresso" />
          </button>

          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-espresso to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-espresso to-transparent z-10 pointer-events-none" />

          {/* Reviews Container */}
          <div
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-4 md:px-12 py-4 snap-x snap-mandatory"
          >
            {reviews.map((review, index) => (
              <motion.div
                key={review.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[340px] snap-center"
              >
                <div className="bg-flour p-8 h-full relative group hover:shadow-2xl transition-shadow duration-300">
                  {/* Quote Icon */}
                  <Quote className="absolute top-4 right-4 w-10 h-10 text-crust/20 group-hover:text-crust/40 transition-colors" />

                  {/* Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-crust text-crust"
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-espresso/80 font-lato text-lg leading-relaxed mb-6 italic">
                    &ldquo;{review.text}&rdquo;
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <p className="font-oswald font-bold text-espresso uppercase tracking-wide">
                        {review.name}
                      </p>
                      <p className="text-sm text-espresso/60">{review.source}</p>
                    </div>
                    {/* Google Icon */}
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow">
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a
            href="https://www.google.com/maps/place/Wake+N+Bake+Panificio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-crust hover:text-white font-oswald font-semibold uppercase tracking-wider transition-colors underline underline-offset-4"
          >
            {t('reviews.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
