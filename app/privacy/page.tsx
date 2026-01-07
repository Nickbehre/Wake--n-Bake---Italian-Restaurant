import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Privacybeleid | Wake N' Bake Panificio",
  description:
    "Lees ons privacybeleid en hoe wij omgaan met uw persoonsgegevens.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-montserrat font-bold text-5xl mb-8 text-espresso">
            Privacybeleid
          </h1>

          <div className="prose prose-lg max-w-none text-espresso/80">
            <p className="lead">
              Wake N&apos; Bake Panificio respecteert uw privacy en zorgt ervoor
              dat de persoonlijke informatie die u met ons deelt vertrouwelijk
              wordt behandeld.
            </p>

            <p>
              <strong>Laatst bijgewerkt:</strong> Januari 2026
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              1. Welke gegevens verzamelen wij?
            </h2>
            <p>
              Wij verzamelen de volgende persoonsgegevens wanneer u contact met
              ons opneemt of een bestelling plaatst:
            </p>
            <ul>
              <li>Naam</li>
              <li>E-mailadres</li>
              <li>Telefoonnummer (optioneel)</li>
              <li>Bericht- of bestelinhoud</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              2. Waarom verzamelen wij deze gegevens?
            </h2>
            <p>Wij gebruiken uw gegevens voor de volgende doeleinden:</p>
            <ul>
              <li>Om uw vragen of opmerkingen te beantwoorden</li>
              <li>Om uw bestellingen te verwerken</li>
              <li>Om u te informeren over onze producten en diensten</li>
              <li>Om onze website en dienstverlening te verbeteren</li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              3. Hoe lang bewaren wij uw gegevens?
            </h2>
            <p>
              Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk
              is voor de doeleinden waarvoor ze zijn verzameld. Contactgegevens
              worden maximaal 2 jaar bewaard na het laatste contact.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              4. Delen wij uw gegevens met derden?
            </h2>
            <p>
              Wij delen uw persoonsgegevens niet met derden, tenzij dit
              noodzakelijk is voor de uitvoering van onze diensten of wanneer
              wij hiertoe wettelijk verplicht zijn.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              5. Uw rechten
            </h2>
            <p>U heeft het recht om:</p>
            <ul>
              <li>Uw persoonsgegevens in te zien</li>
              <li>Uw persoonsgegevens te laten corrigeren</li>
              <li>Uw persoonsgegevens te laten verwijderen</li>
              <li>
                Bezwaar te maken tegen de verwerking van uw persoonsgegevens
              </li>
            </ul>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              6. Beveiliging
            </h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om
              uw persoonsgegevens te beschermen tegen verlies, diefstal en
              ongeautoriseerde toegang.
            </p>

            <h2 className="font-montserrat font-bold text-2xl mt-12 mb-4 text-espresso">
              7. Contact
            </h2>
            <p>
              Heeft u vragen over ons privacybeleid of wilt u gebruik maken van
              uw rechten? Neem dan contact met ons op:
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
              8. Wijzigingen
            </h2>
            <p>
              Wij behouden ons het recht voor om dit privacybeleid aan te
              passen. Wijzigingen worden op deze pagina gepubliceerd. Wij raden
              u aan om regelmatig dit beleid te raadplegen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
