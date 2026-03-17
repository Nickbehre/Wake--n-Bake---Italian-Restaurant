'use client'

import { motion } from 'framer-motion'
import ContactForm from '@/components/contact/ContactForm'
import MapSection from '@/components/contact/MapSection'
import { Phone, Mail, MapPin, Clock, Instagram, UtensilsCrossed, PartyPopper, Building2, ArrowRight } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour">
      {/* Hero Section */}
      <section className="relative pt-36 md:pt-44 pb-20 bg-espresso text-white overflow-hidden rounded-b-[3rem]">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mt-4 md:mt-8"
          >
            <span className="inline-block font-stamp text-2xl md:text-3xl mb-4">
              {t('contact.title')}
            </span>
            <h1 className="font-brand text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('contact.subtitle')}
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-brand-dark text-4xl md:text-5xl mb-8 text-espresso">
                {t('contact.visitBakery')}
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.address')}
                    </h3>
                    <p className="font-lato text-espresso/80">
                      Vijzelstraat 93h
                      <br />
                      1017 HH Amsterdam
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Phone className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.phone')}
                    </h3>
                    <a
                      href="tel:+31201234567"
                      className="font-lato text-espresso/80 hover:text-crust transition-colors"
                    >
                      +31 20 123 4567
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Mail className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.email')}
                    </h3>
                    <a
                      href="mailto:info@wakenbake.nl"
                      className="font-lato text-espresso/80 hover:text-crust transition-colors"
                    >
                      info@wakenbake.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.openingHours')}
                    </h3>
                    <div className="font-lato text-espresso/80 space-y-1">
                      <p>{t('location.weekdays')}</p>
                      <p>{t('location.saturday')}</p>
                      <p>{t('location.sunday')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Instagram className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-oswald font-bold text-lg mb-1 text-espresso uppercase tracking-wide">
                      {t('contact.socialMedia')}
                    </h3>
                    <a
                      href="https://www.instagram.com/wakenbake.nl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-lato text-espresso/80 hover:text-crust transition-colors"
                    >
                      @wakenbake.nl
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-pistachio/20 border-l-4 border-pistachio p-6 rounded-2xl">
                <h3 className="font-oswald font-bold text-lg mb-2 text-espresso uppercase tracking-wide">
                  {t('contact.takeaway')}
                </h3>
                <p className="font-lato text-espresso/80">
                  {t('contact.takeawayText')}
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-brand-dark text-4xl md:text-5xl mb-8 text-espresso">
                {t('contact.sendMessage')}
              </h2>
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Catering Section — floating box */}
      <section className="py-20 bg-crust rounded-[3rem] mx-4 md:mx-8 lg:mx-16 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-block font-stamp text-2xl md:text-3xl mb-4">
                {t('contact.cateringOptions')}
              </span>
              <h2 className="font-brand-dark text-4xl md:text-5xl text-espresso mb-4">
                {t('contact.cateringTitle')}
              </h2>
              <p className="font-lato text-espresso/70 text-lg max-w-2xl mx-auto leading-relaxed">
                {t('contact.cateringDescription')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0 }}
                className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-crust/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-7 h-7 text-espresso" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringOffice')}
                </h3>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-tomato/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="w-7 h-7 text-tomato" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringBirthday')}
                </h3>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-flour rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-pistachio/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UtensilsCrossed className="w-7 h-7 text-pistachio" />
                </div>
                <h3 className="font-oswald font-bold text-lg text-espresso uppercase tracking-wide">
                  {t('contact.cateringPrivate')}
                </h3>
              </motion.div>
            </div>

            <div className="text-center">
              <a
                href="#contact-form"
                onClick={(e) => {
                  e.preventDefault()
                  const form = document.querySelector('[data-contact-form]')
                  if (form) form.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 bg-tomato text-white font-oswald font-bold uppercase tracking-wider px-8 py-4 rounded-full hover:bg-red-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {t('contact.cateringCta')}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-20">
        <MapSection />
      </section>
    </div>
  )
}
