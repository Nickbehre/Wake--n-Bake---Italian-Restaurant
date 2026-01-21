'use client'

import { useLanguage } from '@/lib/context/LanguageContext'

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-montserrat font-bold text-5xl mb-8 text-espresso">
            {t('privacy.title')}
          </h1>

          <div className="prose prose-lg max-w-none text-espresso/80">
            <p className="lead">
              {t('privacy.intro')}
            </p>

            <p>
              <strong>{t('privacy.lastUpdated')}:</strong> Januari 2026
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section1Title')}
            </h2>
            <p>
              {t('privacy.section1Text')}
            </p>
            <ul>
              <li>{t('privacy.section1Item1')}</li>
              <li>{t('privacy.section1Item2')}</li>
              <li>{t('privacy.section1Item3')}</li>
              <li>{t('privacy.section1Item4')}</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section2Title')}
            </h2>
            <p>{t('privacy.section2Text')}</p>
            <ul>
              <li>{t('privacy.section2Item1')}</li>
              <li>{t('privacy.section2Item2')}</li>
              <li>{t('privacy.section2Item3')}</li>
              <li>{t('privacy.section2Item4')}</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section3Title')}
            </h2>
            <p>
              {t('privacy.section3Text')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section4Title')}
            </h2>
            <p>
              {t('privacy.section4Text')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section5Title')}
            </h2>
            <p>{t('privacy.section5Text')}</p>
            <ul>
              <li>{t('privacy.section5Item1')}</li>
              <li>{t('privacy.section5Item2')}</li>
              <li>{t('privacy.section5Item3')}</li>
              <li>{t('privacy.section5Item4')}</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section6Title')}
            </h2>
            <p>
              {t('privacy.section6Text')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section7Title')}
            </h2>
            <p>
              {t('privacy.section7Text')}
            </p>
            <ul>
              <li>
                E-mail:{' '}
                <a
                  href="mailto:info@wakenbakepanificio.nl"
                  className="text-crust hover:underline"
                >
                  info@wakenbakepanificio.nl
                </a>
              </li>
              <li>Telefoon: +31 20 123 4567</li>
              <li>Adres: Vijzelstraat 93h, 1017 HH Amsterdam</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('privacy.section8Title')}
            </h2>
            <p>
              {t('privacy.section8Text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
