'use client'

import { useLanguage } from '@/lib/context/LanguageContext'

export default function CookiesPage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-montserrat font-bold text-5xl mb-8 text-espresso">
            {t('cookies.title')}
          </h1>

          <div className="prose prose-lg max-w-none text-espresso/80">
            <p className="lead">
              {t('cookies.intro')}
            </p>

            <p>
              <strong>{t('cookies.lastUpdated')}:</strong> Januari 2026
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section1Title')}
            </h2>
            <p>
              {t('cookies.section1Text')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section2Title')}
            </h2>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              {t('cookies.necessaryTitle')}
            </h3>
            <p>
              {t('cookies.necessaryText')}
            </p>
            <table className="w-full border-collapse my-4">
              <thead>
                <tr className="bg-crust/10">
                  <th className="border border-espresso/20 p-3 text-left">
                    {t('cookies.tableCookie')}
                  </th>
                  <th className="border border-espresso/20 p-3 text-left">
                    {t('cookies.tablePurpose')}
                  </th>
                  <th className="border border-espresso/20 p-3 text-left">
                    {t('cookies.tableDuration')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-espresso/20 p-3">
                    cookieConsent
                  </td>
                  <td className="border border-espresso/20 p-3">
                    {t('cookies.consentPurpose')}
                  </td>
                  <td className="border border-espresso/20 p-3">1 jaar</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              {t('cookies.analyticalTitle')}
            </h3>
            <p>
              {t('cookies.analyticalText')}
            </p>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              {t('cookies.marketingTitle')}
            </h3>
            <p>
              {t('cookies.marketingText')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section3Title')}
            </h2>
            <p>
              {t('cookies.section3Text')}
            </p>
            <ul>
              <li>
                <a
                  href="https://support.google.com/chrome/answer/95647"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:underline"
                >
                  Google Chrome
                </a>
              </li>
              <li>
                <a
                  href="https://support.mozilla.org/nl/kb/cookies-verwijderen"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:underline"
                >
                  Mozilla Firefox
                </a>
              </li>
              <li>
                <a
                  href="https://support.apple.com/nl-nl/guide/safari/sfri11471/mac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:underline"
                >
                  Safari
                </a>
              </li>
              <li>
                <a
                  href="https://support.microsoft.com/nl-nl/windows/cookies-verwijderen-en-beheren"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-crust hover:underline"
                >
                  Microsoft Edge
                </a>
              </li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section4Title')}
            </h2>
            <p>
              {t('cookies.section4Text')}
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section5Title')}
            </h2>
            <p>
              {t('cookies.section5Text')}
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
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              {t('cookies.section6Title')}
            </h2>
            <p>
              {t('cookies.section6Text')}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
