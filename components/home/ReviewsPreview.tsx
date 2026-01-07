'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import Link from 'next/link'

const reviews = [
  {
    name: 'Maria S.',
    rating: 5,
    text: 'De beste focaccia die ik ooit heb geproefd! Doet me denken aan mijn tijd in Italië. Absolute aanrader!',
    source: 'Google',
  },
  {
    name: 'Thomas K.',
    rating: 5,
    text: 'Geweldige sfeer en nog betere producten. De schiacciata met prosciutto is ongelooflijk lekker.',
    source: 'TripAdvisor',
  },
  {
    name: 'Lisa M.',
    rating: 5,
    text: 'Mijn nieuwe favoriete plek voor lunch in Amsterdam! Vers, lekker en authentiek Italiaans.',
    source: 'Google',
  },
]

export default function ReviewsPreview() {
  return (
    <section className="py-20 bg-flour">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6 text-espresso">
            Wat Onze Klanten Zeggen
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-crust text-crust" />
            ))}
          </div>
          <p className="text-espresso/80 text-xl">
            4.9 sterren op basis van 200+ reviews
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-8 shadow-lg relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-crust/20" />
              <div className="flex items-center gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-crust text-crust" />
                ))}
              </div>
              <p className="text-espresso/80 mb-6 leading-relaxed italic">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="font-montserrat font-bold text-espresso">
                  {review.name}
                </span>
                <span className="text-sm text-espresso/60">{review.source}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <a
            href="https://www.tripadvisor.com/wakenbakepanificio"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-espresso hover:text-crust font-montserrat font-semibold underline underline-offset-4 transition-colors"
          >
            Bekijk alle reviews op TripAdvisor
          </a>
        </motion.div>
      </div>
    </section>
  )
}
