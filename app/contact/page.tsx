import { Metadata } from 'next'
import ContactForm from '@/components/contact/ContactForm'
import MapSection from '@/components/contact/MapSection'
import { Phone, Mail, MapPin, Clock, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: "Contact | Wake N' Bake Panificio",
  description:
    "Neem contact op met Wake N' Bake Panificio. Bezoek ons op Vijzelstraat 93h, Amsterdam.",
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-flour">
      {/* Header */}
      <section className="bg-espresso text-white pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6">
            CONTACT & LOCATIE
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-white/80">
            Kom langs voor de beste Italiaanse focaccia van Amsterdam, of neem
            contact op voor vragen.
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
                Bezoek Onze Bakkerij
              </h2>

              <div className="space-y-6 mb-12">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <MapPin className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      Adres
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
                      Telefoon
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
                      Email
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
                      Openingstijden
                    </h3>
                    <div className="text-espresso/80 space-y-1">
                      <p>Ma - Vr: 08:00 - 18:00</p>
                      <p>Za - Zo: 09:00 - 17:00</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-crust/20 rounded-full flex-shrink-0">
                    <Instagram className="w-6 h-6 text-crust" />
                  </div>
                  <div>
                    <h3 className="font-montserrat font-bold text-lg mb-1">
                      Social Media
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
                  Takeaway & Catering
                </h3>
                <p className="text-espresso/80">
                  Bel of mail ons voor grote bestellingen en catering
                  mogelijkheden. We verzorgen graag jouw evenement met onze
                  verse Italiaanse producten.
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="font-montserrat font-bold text-3xl mb-8 text-espresso">
                Stuur Een Bericht
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
