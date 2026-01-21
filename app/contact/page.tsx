'use client'

import ContactForm from '@/components/contact/ContactForm'
import MapSection from '@/components/contact/MapSection'
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour">
      {/* Header */}
      <section className="bg-espresso text-white pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/80">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="font-montserrat font-bold text-3xl mb-8 text-espresso">
                {t('contact.visitBakery')}
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      {t('contact.address')}
                    </h3>
                    <p className="text-espresso/80">
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
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      {t('contact.phone')}
                    </h3>
                    <a
                      href="tel:+31201234567"
                      className="text-espresso/80 hover:text-crust transition-colors"
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
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      {t('contact.email')}
                    </h3>
                    <a
                      href="mailto:info@wakenbakepanificio.nl"
                      className="text-espresso/80 hover:text-crust transition-colors"
                    >
                      info@wakenbakepanificio.nl
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Clock className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      {t('contact.openingHours')}
                    </h3>
                    <div className="text-espresso/80 space-y-1">
                      <p>{t('location.weekdays')}</p>
                      <p>{t('location.weekends')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Instagram className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      {t('contact.socialMedia')}
                    </h3>
                    <a
                      href="https://www.instagram.com/wakenbake.nl/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-espresso/80 hover:text-crust transition-colors"
                    >
                      @wakenbake.nl
                    </a>
                  </div>
                </div>
              </div>

              <div className="bg-pistachio/20 border-l-4 border-pistachio p-6">
                <h3 className="font-montserrat font-bold text-lg mb-2 text-espresso">
                  {t('contact.takeaway')}
                </h3>
                <p className="text-espresso/80">
                  {t('contact.takeawayText')}
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-montserrat font-bold text-3xl mb-8 text-espresso">
                {t('contact.sendMessage')}
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection />
    </div>
  )
}
