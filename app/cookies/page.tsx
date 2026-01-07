import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Cookiebeleid | Wake N' Bake Panificio",
  description:
    'Lees ons cookiebeleid en hoe wij cookies gebruiken op onze website.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-montserrat font-bold text-5xl mb-8 text-espresso">
            Cookiebeleid
          </h1>

          <div className="prose prose-lg max-w-none text-espresso/80">
            <p className="lead">
              Deze website maakt gebruik van cookies om uw ervaring te
              verbeteren. Hieronder leggen wij uit wat cookies zijn en hoe wij
              ze gebruiken.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> Januari 2026
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              1. Wat zijn cookies?
            </h2>
            <p>
              Cookies zijn kleine tekstbestanden die op uw computer of mobiele
              apparaat worden opgeslagen wanneer u onze website bezoekt. Ze
              helpen ons om de website goed te laten functioneren en om uw
              voorkeuren te onthouden.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              2. Welke cookies gebruiken wij?
            </h2>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              Noodzakelijke cookies
            </h3>
            <p>
              Deze cookies zijn essentieel voor het functioneren van de website
              en kunnen niet worden uitgeschakeld. Ze worden alleen geplaatst
              als reactie op acties die u uitvoert, zoals het instellen van uw
              privacyvoorkeuren.
            </p>
            <table className="w-full border-collapse my-4">
              <thead>
                <tr className="bg-crust/10">
                  <th className="border border-espresso/20 p-3 text-left">
                    Cookie
                  </th>
                  <th className="border border-espresso/20 p-3 text-left">
                    Doel
                  </th>
                  <th className="border border-espresso/20 p-3 text-left">
                    Duur
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-espresso/20 p-3">
                    cookieConsent
                  </td>
                  <td className="border border-espresso/20 p-3">
                    Onthoudt uw cookievoorkeuren
                  </td>
                  <td className="border border-espresso/20 p-3">1 jaar</td>
                </tr>
              </tbody>
            </table>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              Analytische cookies
            </h3>
            <p>
              Deze cookies helpen ons begrijpen hoe bezoekers onze website
              gebruiken. Alle informatie wordt geanonimiseerd verzameld.
            </p>

            <h3 className="font-montserrat font-bold text-xl mt-8 mb-3 text-espresso">
              Marketing cookies
            </h3>
            <p>
              Wij gebruiken momenteel geen marketing cookies. Mocht dit in de
              toekomst veranderen, dan informeren wij u hierover en vragen wij
              om uw toestemming.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              3. Hoe kunt u cookies beheren?
            </h2>
            <p>
              U kunt uw cookievoorkeuren op elk moment aanpassen via de
              instellingen van uw browser. Hieronder vindt u links naar de
              instructies van de meest gebruikte browsers:
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
              4. Cookies van derden
            </h2>
            <p>
              Onze website kan content bevatten van derden, zoals een embedded
              map van OpenStreetMap. Deze partijen kunnen hun eigen cookies
              plaatsen. Wij hebben geen controle over deze cookies. Raadpleeg
              het privacybeleid van deze partijen voor meer informatie.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              5. Contact
            </h2>
            <p>
              Heeft u vragen over ons cookiebeleid? Neem dan contact met ons op:
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
              6. Wijzigingen
            </h2>
            <p>
              Wij behouden ons het recht voor om dit cookiebeleid aan te passen.
              Wijzigingen worden op deze pagina gepubliceerd.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
