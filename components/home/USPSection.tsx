'use client'

import { Wheat, Clock, Heart } from 'lucide-react'
import { useLanguage } from '@/lib/context/LanguageContext'
import SplitTextReveal from '@/components/animation/SplitTextReveal'
import Reveal from '@/components/animation/Reveal'

const usps = [
  {
    icon: Wheat,
    titleKey: 'usp.authentic.title',
    descKey: 'usp.authentic.desc',
    color: 'crust',
  },
  {
    icon: Clock,
    titleKey: 'usp.fast.title',
    descKey: 'usp.fast.desc',
    color: 'tomato',
  },
  {
    icon: Heart,
    titleKey: 'usp.love.title',
    descKey: 'usp.love.desc',
    color: 'pistachio',
  },
]

export default function USPSection() {
  const { t } = useLanguage()

  return (
    <section className="py-20 md:py-28 bg-flour relative overflow-hidden">
      {/* Subtiele achtergronddecoratie */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232C2C2C' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Reveal as="span" y={20} className="inline-block font-stamp text-2xl md:text-3xl mb-4">
            {t('usp.label')}
          </Reveal>
          <SplitTextReveal
            as="h2"
            type="lines"
            className="font-brand-dark text-5xl md:text-6xl lg:text-7xl"
          >
            {t('usp.headline')}
          </SplitTextReveal>
        </div>

        <Reveal
          staggerChildren
          stagger={0.15}
          y={50}
          className="grid md:grid-cols-3 gap-6 lg:gap-10"
        >
          {usps.map((usp) => (
            <div
              key={usp.titleKey}
              className="group text-center bg-white/60 rounded-3xl px-8 py-10 shadow-sm border border-espresso/5 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:[transform:perspective(900px)_rotateX(2deg)_translateY(-0.5rem)]"
            >
              <div
                className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${
                  usp.color === 'crust'
                    ? 'bg-crust/10 group-hover:bg-crust/25'
                    : usp.color === 'tomato'
                      ? 'bg-tomato/10 group-hover:bg-tomato/25'
                      : 'bg-pistachio/10 group-hover:bg-pistachio/25'
                }`}
              >
                <usp.icon
                  className={`w-10 h-10 ${
                    usp.color === 'crust'
                      ? 'text-crust'
                      : usp.color === 'tomato'
                        ? 'text-tomato'
                        : 'text-pistachio'
                  }`}
                />
              </div>
              <h3 className="font-oswald font-bold text-xl md:text-2xl mb-4 text-espresso uppercase tracking-wide">
                {t(usp.titleKey)}
              </h3>
              <p className="text-espresso/70 text-base md:text-lg leading-relaxed font-lato max-w-xs mx-auto">
                {t(usp.descKey)}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
