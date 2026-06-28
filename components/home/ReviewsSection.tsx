'use client'

import { Star, Quote, ExternalLink } from 'lucide-react'
import { ReactGoogleReviews, type ReactGoogleReview } from 'react-google-reviews'
import 'react-google-reviews/dist/index.css'
import { useLanguage } from '@/lib/context/LanguageContext'
import { useLocation } from '@/lib/context/LocationContext'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'
import Marquee from '@/components/animation/Marquee'

interface Review {
  name: string
  rating: number
  text: string
  source: string
}

// Statische fallback-reviews — getoond zolang Featurable nog niet gekoppeld is
// (env NEXT_PUBLIC_FEATURABLE_WIDGET_ID ontbreekt) of als de API niets teruggeeft.
const fallbackReviews: Review[] = [
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

/** Live Google-review → ons kaartformaat. Alleen reviews met tekst en 4+ sterren, max 12. */
function mapGoogleReviews(reviews: ReactGoogleReview[]): Review[] {
  return reviews
    .filter((r) => r.starRating >= 4 && r.comment?.trim())
    .map((r) => ({
      name: r.reviewer?.displayName?.trim() || 'Google',
      rating: Math.round(r.starRating),
      text: r.comment.trim(),
      source: 'Google',
    }))
    .slice(0, 12)
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="w-[320px] md:w-[380px] flex-shrink-0 mx-3 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm hover:bg-white/10 transition-colors duration-300">
      <Quote className="w-7 h-7 text-crust/60 mb-3" aria-hidden />
      <div className="flex items-center gap-1 mb-3" aria-label={`${review.rating} sterren`}>
        {[...Array(review.rating)].map((_, i) => (
          <Star key={i} className="w-4 h-4 fill-crust text-crust" />
        ))}
      </div>
      <p className="font-lato text-white/85 leading-relaxed mb-4 text-[15px]">
        {review.text}
      </p>
      <footer className="flex items-center justify-between">
        <span className="font-oswald font-semibold uppercase tracking-wide text-white">
          {review.name}
        </span>
        <span className="text-white/50 text-xs font-oswald uppercase tracking-widest">
          {review.source}
        </span>
      </footer>
    </article>
  )
}

/** Twee tegengestelde marquee-rijen met de meegegeven reviews. */
function ReviewMarquee({ items }: { items: Review[] }) {
  const half = Math.ceil(items.length / 2)
  const firstRow = items.slice(0, half)
  const secondRow = items.slice(half)

  return (
    <Reveal y={40} className="space-y-6">
      <Marquee speed={45} direction={1}>
        {firstRow.map((review, i) => (
          <ReviewCard key={`a-${i}-${review.name}`} review={review} />
        ))}
      </Marquee>
      {secondRow.length > 0 && (
        <Marquee speed={38} direction={-1}>
          {secondRow.map((review, i) => (
            <ReviewCard key={`b-${i}-${review.name}`} review={review} />
          ))}
        </Marquee>
      )}
    </Reveal>
  )
}

export default function ReviewsSection() {
  const { t } = useLanguage()
  const { location } = useLocation()
  // Publieke Featurable widget-ID (geen secret). Leeg = statische fallback tonen.
  const featurableId = process.env.NEXT_PUBLIC_FEATURABLE_WIDGET_ID

  return (
    <section className="py-24 bg-espresso relative overflow-hidden rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl">
      {/* Achtergrondpatroon */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23D4A056' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-4 text-center mb-14">
          <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('reviews.label')}
          </Reveal>
          <SplitTextReveal
            as="h2"
            type="lines"
            className="font-brand text-5xl md:text-6xl lg:text-7xl mb-6"
          >
            {t('reviews.headline')}
          </SplitTextReveal>
          <Reveal as="p" delay={0.1} className="font-lato text-xl text-white/70 max-w-2xl mx-auto mb-6">
            {t('reviews.subheadline')}
          </Reveal>

          <Reveal y={20} delay={0.2} className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-crust text-crust" />
              ))}
            </div>
            <span className="text-white/80 font-oswald ml-2">{t('reviews.rating')}</span>
          </Reveal>
        </div>

        {/* Reviews — live via Featurable (Google), met statische fallback */}
        {featurableId ? (
          <ReactGoogleReviews
            layout="custom"
            featurableId={featurableId}
            renderer={(googleReviews) => {
              const mapped = mapGoogleReviews(googleReviews)
              return <ReviewMarquee items={mapped.length ? mapped : fallbackReviews} />
            }}
          />
        ) : (
          <ReviewMarquee items={fallbackReviews} />
        )}

        {/* CTA */}
        <Reveal y={20} delay={0.1} className="text-center mt-12">
          <a
            href={location.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="inline-flex items-center gap-2 text-crust hover:text-white font-oswald font-semibold uppercase tracking-wider transition-colors link-underline"
          >
            {t('reviews.cta')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
