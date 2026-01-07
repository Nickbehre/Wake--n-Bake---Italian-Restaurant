'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const featuredItems = [
  {
    name: 'Focaccia Mortadella',
    description: 'Met pistachepesto en burrata',
    price: '€12.50',
    image: '/assets/gallery/focaccia-01.webp',
  },
  {
    name: 'Schiacciata Prosciutto',
    description: 'Met rucola en parmezaan',
    price: '€11.50',
    image: '/assets/gallery/schiacciata-01.webp',
  },
  {
    name: 'Cappuccino + Cornetto',
    description: 'De perfecte ochtend',
    price: '€6.00',
    image: '/assets/gallery/coffee-01.webp',
  },
]

export default function MenuPreview() {
  return (
    <section className="py-20 bg-espresso text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
            Onze Specialiteiten
          </h2>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Proef de authentieke smaken van Italië. Alles wordt dagelijks vers
            bereid met de beste ingrediënten.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredItems.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="relative h-64 mb-6 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-montserrat font-bold text-xl mb-2 group-hover:text-crust transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-white/70">{item.description}</p>
                </div>
                <span className="font-playfair text-2xl text-crust font-bold">
                  {item.price}
                </span>
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
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 bg-crust hover:bg-crust/90 text-espresso font-montserrat font-bold px-8 py-4 transition-all duration-300 transform hover:scale-105 group"
          >
            BEKIJK VOLLEDIG MENU
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
