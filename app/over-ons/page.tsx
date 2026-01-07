import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Wheat, Award, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: "Over Ons | Wake N' Bake Panificio",
  description:
    "Leer meer over Wake N' Bake Panificio, onze passie voor authentiek Italiaans brood en onze reis naar Amsterdam.",
}

const values = [
  {
    icon: Wheat,
    title: 'Kwaliteit',
    description:
      'We gebruiken alleen de beste ingrediënten, van Italiaanse bloem tot verse lokale producten.',
  },
  {
    icon: Heart,
    title: 'Passie',
    description:
      'Elke dag staan we met liefde in de keuken om de perfecte focaccia te maken.',
  },
  {
    icon: Award,
    title: 'Authenticiteit',
    description:
      'Onze recepten zijn overgeleverd van generatie op generatie uit Italië.',
  },
  {
    icon: Users,
    title: 'Gemeenschap',
    description:
      'We zijn trots deel uit te maken van de Amsterdamse buurt en community.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-flour">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-espresso text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6">
              ONS VERHAAL
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Van een kleine bakkerij in Toscane naar het hart van Amsterdam.
              Ontdek de passie achter Wake N&apos; Bake Panificio.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-[500px]">
              <Image
                src="/assets/about-bakery.webp"
                alt="Onze bakkerij en bakkers aan het werk"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-montserrat font-bold text-4xl mb-6 text-espresso">
                De Droom Begon in Italië
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>
                  Het verhaal van Wake N&apos; Bake begon in een kleine bakkerij
                  in de heuvels van Toscane. Daar leerde onze oprichter de kunst
                  van het broodbakken van zijn grootmoeder - de geheimen van het
                  perfecte deeg, het belang van geduld en de magie van verse
                  ingrediënten.
                </p>
                <p>
                  In 2019 brachten we deze Italiaanse traditie naar Amsterdam.
                  Met dezelfde passie en dezelfde recepten als in Italië, maar
                  met een moderne twist. Het resultaat? De knapperigste
                  schiacciata en de luchtigste focaccia van de stad.
                </p>
                <p>
                  Elke ochtend staan we vroeg op om vers deeg te kneden. We
                  importeren onze bloem rechtstreeks uit Italië en werken alleen
                  met de beste lokale producten. Geen haast, geen compromissen -
                  alleen puur vakmanschap.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-crust/20">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl text-center mb-16 text-espresso">
            Waar Wij Voor Staan
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-flour p-8 text-center group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-block p-4 bg-crust/20 rounded-full mb-6 group-hover:bg-crust/30 transition-colors">
                  <value.icon className="w-8 h-8 text-crust" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
                  {value.title}
                </h3>
                <p className="text-espresso/80">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="font-montserrat font-bold text-4xl mb-6 text-espresso">
                Ons Team
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>
                  Achter elke focaccia staat een team van gepassioneerde bakkers
                  en barista&apos;s. Van onze hoofdbakker Marco, die al 20 jaar
                  brood bakt, tot onze jonge medewerkers die de traditie
                  voortzetten.
                </p>
                <p>
                  We geloven in een warme sfeer, zowel in onze keuken als in
                  onze winkel. Kom gerust langs voor een praatje en ontdek
                  waarom onze vaste klanten ons als hun tweede huiskamer zien.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-tomato hover:bg-tomato/90 text-white font-montserrat font-bold px-8 py-4 transition-all duration-300 transform hover:scale-105"
              >
                WERKEN BIJ ONS?
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="relative h-[400px] order-1 lg:order-2">
              <Image
                src="/assets/gallery/team-01.webp"
                alt="Ons team aan het werk in de bakkerij"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-espresso text-white text-center">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl mb-6">
            Proef Het Zelf
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            De beste manier om ons verhaal te begrijpen? Kom langs en proef onze
            producten. We verwelkomen je graag!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-crust hover:bg-crust/90 text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300 transform hover:scale-105"
            >
              BEKIJK MENU
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300"
            >
              BEZOEK ONS
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
