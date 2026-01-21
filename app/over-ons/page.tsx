'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Heart, Wheat, Award, Users } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'

export default function AboutPage() {
  const { t } = useLanguage()

  const values = [
    {
      icon: Wheat,
      titleKey: 'about.valueQuality',
      descKey: 'about.valueQualityDesc',
    },
    {
      icon: Heart,
      titleKey: 'about.valuePassion',
      descKey: 'about.valuePassionDesc',
    },
    {
      icon: Award,
      titleKey: 'about.valueAuthenticity',
      descKey: 'about.valueAuthenticityDesc',
    },
    {
      icon: Users,
      titleKey: 'about.valueCommunity',
      descKey: 'about.valueCommunityDesc',
    },
  ]

  return (
    <div className="min-h-screen bg-flour">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-espresso text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6">
              {t('about.heroTitle')}
            </h1>
            <p className="text-xl text-white/80 leading-relaxed">
              {t('about.heroSubtitle')}
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
                {t('about.storyTitle')}
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>{t('about.storyP1')}</p>
                <p>{t('about.storyP2')}</p>
                <p>{t('about.storyP3')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-crust/20">
        <div className="container mx-auto px-4">
          <h2 className="font-montserrat font-bold text-4xl text-center mb-16 text-espresso">
            {t('about.valuesTitle')}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div
                key={value.titleKey}
                className="bg-flour p-8 text-center group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="inline-block p-4 bg-crust/20 rounded-full mb-6 group-hover:bg-crust/30 transition-colors">
                  <value.icon className="w-8 h-8 text-crust" />
                </div>
                <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
                  {t(value.titleKey)}
                </h3>
                <p className="text-espresso/80">{t(value.descKey)}</p>
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
                {t('about.teamTitle')}
              </h2>
              <div className="prose prose-lg text-espresso/80 space-y-4">
                <p>{t('about.teamP1')}</p>
                <p>{t('about.teamP2')}</p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 mt-8 bg-tomato hover:bg-tomato/90 text-white font-montserrat font-bold px-8 py-4 transition-all duration-300 transform hover:scale-105"
              >
                {t('about.workWithUs')}
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
            {t('about.ctaTitle')}
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            {t('about.ctaText')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="bg-crust hover:bg-crust/90 text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300 transform hover:scale-105"
            >
              {t('about.viewMenu')}
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-espresso font-montserrat font-bold px-10 py-4 transition-all duration-300"
            >
              {t('about.visitUs')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
