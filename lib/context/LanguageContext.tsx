'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Language = 'nl' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations: Record<Language, Record<string, string>> = {
  nl: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'Over Ons',
    'nav.gallery': 'Gallerij',
    'nav.contact': 'Contact',
    'nav.order': 'BESTEL NU',

    // Hero
    'hero.tagline': "De knapperigste Schiacciata van Amsterdam. Rijkelijk belegd, vers uit de oven.",
    'hero.cta.menu': 'BEKIJK MENU',
    'hero.cta.order': 'BESTEL NU',
    'hero.cta.delivery': 'BEZORGEN',
    'hero.cta.takeaway': 'AFHALEN',

    // Story Section
    'story.headline': 'Van Sicilië naar de Vijzelstraat.',
    'story.subtext1': "Drie Siciliaanse vrienden, één droom: de authentieke smaken van Sicilië naar Amsterdam brengen. Geen shortcuts, alleen tijd, passie en familiegeheimen.",
    'story.subtext2': 'Elke dag vers deeg. Rijkelijk belegd. The real Sicilian deal, right here in Amsterdam.',
    'story.videoCaption': 'Bekijk hoe het allemaal begon',
    'story.label': 'Ons Verhaal',
    'story.followInstagram': 'Volg ons op Instagram',
    'story.clickToEnlarge': 'Klik om te vergroten',
    'story.close': 'Sluiten',
    'story.soundOn': 'Geluid aan',
    'story.soundOff': 'Geluid uit',
    'story.clickToClose': 'Klik ergens om te sluiten',
    'story.video1.caption': 'Het Deeg',
    'story.video1.description': 'De perfecte crunch begint met het perfecte deeg',
    'story.video2.caption': 'De Oven',
    'story.video2.description': 'Kijk hoe het rijst in onze authentieke oven',
    'story.video3.caption': 'Het Resultaat',
    'story.video3.description': 'Vers uit de oven, klaar om van te genieten',

    // USP Section
    'usp.label': 'Wat Ons Uniek Maakt',
    'usp.headline': "Waarom Wake N' Bake?",
    'usp.authentic.title': 'Authentiek Ambachtelijk',
    'usp.authentic.desc': 'Traditionele Italiaanse recepten, dagelijks vers gebakken met de beste ingrediënten.',
    'usp.fast.title': 'Snel & Vers',
    'usp.fast.desc': 'Direct uit de oven. Perfect voor een snelle lunch of heerlijk ontbijt.',
    'usp.love.title': 'Met Liefde Gemaakt',
    'usp.love.desc': 'Elke focaccia wordt met passie en aandacht voor detail bereid.',

    // Menu Section (Home)
    'menu.label': 'Schiacciata',
    'menu.headline': 'Ons Menu',
    'menu.subheadline': 'Verse Schiacciata, dagelijks bereid',
    'menu.regular': 'Normaal',
    'menu.large': 'Groot',
    'menu.category.pork': 'Varken Schiacciata',
    'menu.category.vegetarian': 'Vegetarische Schiacciata',
    'menu.category.beef': 'Rund | Vis Schiacciata',
    'menu.viewFull': 'Bekijk Volledig Menu',

    // Menu Page
    'menuPage.title': 'ONS MENU',
    'menuPage.subtitle': 'Alle producten worden dagelijks vers voor je gemaakt met authentieke Italiaanse ingrediënten.',
    'menuPage.allergenTitle': 'Allergeneninformatie',
    'menuPage.allergenText': 'Heb je een allergie of dieetwens? Laat het ons weten! We bereiden onze producten met zorg, maar er kan kruisbesmetting optreden in onze keuken.',
    'menuPage.addToOrder': 'Toevoegen',

    // Location Section
    'location.headline': 'Kom Proeven.',
    'location.subheadline': 'Vind ons in hartje Amsterdam',
    'location.address': 'Vijzelstraat 93h, 1017 HH Amsterdam',
    'location.directions': 'Routebeschrijving',
    'location.hours': 'Openingstijden',
    'location.weekdays': 'Ma - Vr: 08:00 - 18:00',
    'location.weekends': 'Za - Zo: 09:00 - 17:00',
    'location.openNow': 'Nu Open',
    'location.closed': 'Gesloten',
    'location.googleMaps': 'Open in Google Maps',
    'location.label': 'Bezoek Ons',
    'location.orderOnline': 'Bestel Nu Online',

    // Reviews Section
    'reviews.label': 'Geliefd bij Locals',
    'reviews.headline': 'Geliefd bij Locals',
    'reviews.subheadline': 'Wat onze klanten zeggen',
    'reviews.rating': '4.9 sterren op basis van 200+ reviews',
    'reviews.cta': 'Bekijk alle reviews op Google',

    // CTA Section
    'cta.headline': 'Kom Langs!',
    'cta.description': 'Ervaar de authentieke Italiaanse sfeer en proef onze vers gebakken specialiteiten. We verwelkomen je graag in onze bakkerij.',
    'cta.visit': 'PLAN JE BEZOEK',
    'cta.call': 'BEL ONS',
    'cta.location': 'Locatie',
    'cta.hours': 'Openingstijden',
    'cta.contact': 'Contact',

    // Footer
    'footer.description': 'Authentieke Italiaanse bakkerij in hartje Amsterdam. Elke dag vers gebakken met liefde en passie.',
    'footer.contact': 'Contact',
    'footer.openingHours': 'Openingstijden',
    'footer.links': 'Links',
    'footer.rights': 'Alle rechten voorbehouden.',

    // Contact Page
    'contact.title': 'CONTACT & LOCATIE',
    'contact.subtitle': 'Kom langs voor de beste Italiaanse focaccia van Amsterdam, of neem contact op voor vragen.',
    'contact.visitBakery': 'Bezoek Onze Bakkerij',
    'contact.address': 'Adres',
    'contact.phone': 'Telefoon',
    'contact.email': 'Email',
    'contact.openingHours': 'Openingstijden',
    'contact.socialMedia': 'Social Media',
    'contact.takeaway': 'Takeaway & Catering',
    'contact.takeawayText': 'Bel of mail ons voor grote bestellingen en catering mogelijkheden. We verzorgen graag jouw evenement met onze verse Italiaanse producten.',
    'contact.sendMessage': 'Stuur Een Bericht',

    // Contact Form
    'form.name': 'Naam',
    'form.namePlaceholder': 'Jouw naam',
    'form.nameError': 'Naam moet minimaal 2 karakters zijn',
    'form.email': 'Email',
    'form.emailPlaceholder': 'jouw@email.nl',
    'form.emailError': 'Ongeldig email adres',
    'form.phone': 'Telefoon (optioneel)',
    'form.phonePlaceholder': '06 12345678',
    'form.subject': 'Onderwerp',
    'form.subjectPlaceholder': 'Selecteer een onderwerp',
    'form.subjectError': 'Selecteer een onderwerp',
    'form.subjectOrder': 'Bestelling / Reservering',
    'form.subjectCatering': 'Catering',
    'form.subjectFeedback': 'Feedback',
    'form.subjectVacancy': 'Vacature',
    'form.subjectOther': 'Anders',
    'form.message': 'Bericht',
    'form.messagePlaceholder': 'Vertel ons waarmee we je kunnen helpen...',
    'form.messageError': 'Bericht moet minimaal 10 karakters zijn',
    'form.submit': 'Verstuur Bericht',
    'form.submitting': 'Verzenden...',
    'form.success': 'Bericht verzonden! We nemen zo snel mogelijk contact op.',
    'form.error': 'Er ging iets mis. Probeer het opnieuw.',

    // Gallery Page
    'gallery.title': 'GALLERIJ',
    'gallery.subtitle': 'Een kijkje in onze bakkerij en onze heerlijke producten',
    'gallery.instagramCta': 'Volg ons op Instagram voor dagelijkse updates!',

    // About Page
    'about.heroTitle': 'ONS VERHAAL',
    'about.heroSubtitle': "Drie Sicilianen, één droom. Van Sicilië naar Amsterdam - ontdek de passie achter Wake N' Bake Panificio.",
    'about.storyTitle': 'Van Sicilië naar Amsterdam',
    'about.storyP1': "Het verhaal van Wake N' Bake begon toen drie vrienden uit Sicilië elkaar ontmoetten in Amsterdam. Elk van hen groeide op met de geur van vers gebakken brood - van nonnas die om 5 uur 's ochtends het deeg al kneedden, van familiefeesten waar de schiacciata nooit mocht ontbreken.",
    'about.storyP2': 'In Amsterdam vonden zij elkaar en deelden ze dezelfde droom: de authentieke smaken van Sicilië naar Nederland brengen. Niet zo lang geleden openden zij de deuren van Wake N\' Bake Panificio in de Vijzelstraat, met recepten die van generatie op generatie zijn doorgegeven.',
    'about.storyP3': 'Elke ochtend staan we vroeg op om vers deeg te kneden, precies zoals we het thuis hebben geleerd. We importeren onze bloem en ingrediënten rechtstreeks uit Sicilië. Geen haast, geen compromissen - alleen de echte Siciliaanse smaak.',
    'about.valuesTitle': 'Waar Wij Voor Staan',
    'about.valueQuality': 'Kwaliteit',
    'about.valueQualityDesc': 'We gebruiken alleen de beste ingrediënten, rechtstreeks geïmporteerd uit Sicilië.',
    'about.valuePassion': 'Passie',
    'about.valuePassionDesc': 'Elke dag staan we met liefde in de keuken om de perfecte schiacciata te maken.',
    'about.valueAuthenticity': 'Authenticiteit',
    'about.valueAuthenticityDesc': 'Onze recepten zijn overgeleverd van generatie op generatie uit Sicilië.',
    'about.valueCommunity': 'Gemeenschap',
    'about.valueCommunityDesc': 'We zijn trots deel uit te maken van de Amsterdamse buurt en community.',
    'about.teamTitle': 'Ons Team',
    'about.teamP1': "Achter Wake N' Bake staan drie Siciliaanse vrienden die hun passie voor authentiek Italiaans brood delen. Samen met ons team brengen we elke dag de smaken van Sicilië naar Amsterdam.",
    'about.teamP2': 'We geloven in een warme sfeer, precies zoals thuis in Sicilië. Kom gerust langs voor een praatje en proef waarom onze vaste klanten ons als hun tweede huiskamer zien.',
    'about.workWithUs': 'WERKEN BIJ ONS?',
    'about.ctaTitle': 'Proef Het Zelf',
    'about.ctaText': 'De beste manier om ons verhaal te begrijpen? Kom langs en proef onze producten. We verwelkomen je graag!',
    'about.viewMenu': 'BEKIJK MENU',
    'about.visitUs': 'BEZOEK ONS',

    // Checkout Page
    'checkout.title': 'Afrekenen',
    'checkout.clickCollect': 'Click & Collect',
    'checkout.backToMenu': 'Terug naar Menu',
    'checkout.step1': 'Jouw Gegevens',
    'checkout.step2': 'Ophaaltijd',
    'checkout.step3': 'Betaling',
    'checkout.fullName': 'Volledige Naam',
    'checkout.email': 'E-mailadres',
    'checkout.phone': 'Telefoonnummer',
    'checkout.nameRequired': 'Naam is verplicht',
    'checkout.emailRequired': 'Email is verplicht',
    'checkout.emailInvalid': 'Voer een geldig e-mailadres in',
    'checkout.phoneRequired': 'Telefoonnummer is verplicht',
    'checkout.phoneInvalid': 'Voer een geldig telefoonnummer in',
    'checkout.continueToPickup': 'Verder naar Ophaaltijd',
    'checkout.selectPickupTime': 'Selecteer Ophaaltijd',
    'checkout.selectTimeSlot': 'Kies een tijdslot van 15 minuten om je bestelling op te halen',
    'checkout.noSlotsTitle': 'Geen tijdslots beschikbaar',
    'checkout.noSlotsText': 'Probeer het morgen opnieuw tussen 10:00 - 18:00',
    'checkout.selectTimeRequired': 'Selecteer een ophaaltijd',
    'checkout.back': 'Terug',
    'checkout.continueToPayment': 'Verder naar Betaling',
    'checkout.payment': 'Betaling',
    'checkout.orderSummary': 'Bestelling Overzicht',
    'checkout.total': 'Totaal',
    'checkout.pickupTime': 'Ophaaltijd',
    'checkout.demoNotice': 'Dit is een prototype. Er wordt geen echte betaling verwerkt.',
    'checkout.processing': 'Verwerken...',
    'checkout.payAndOrder': 'Betaal & Plaats Bestelling',
    'checkout.yourOrder': 'Jouw Bestelling',
    'checkout.payAtCheckout': 'Click & Collect • Betaal bij afrekenen',

    // Order Success Page
    'success.orderNumber': 'Bestelnummer',
    'success.pickupTime': 'Ophaaltijd',
    'success.orderDetails': 'Bestelgegevens',
    'success.totalPaid': 'Totaal Betaald',
    'success.customer': 'Klant',
    'success.collectionPoint': 'Afhaallocatie',
    'success.showReceipt': 'Toon dit bonnetje aan de balie om je eten op te halen',
    'success.thankYou': 'Bedankt voor je bestelling!',
    'success.orderMore': 'Meer Bestellen',
    'success.backToHome': 'Terug naar Home',

    // Privacy Page
    'privacy.title': 'Privacybeleid',
    'privacy.intro': "Wake N' Bake Panificio respecteert uw privacy en zorgt ervoor dat de persoonlijke informatie die u met ons deelt vertrouwelijk wordt behandeld.",
    'privacy.lastUpdated': 'Laatst bijgewerkt',
    'privacy.section1Title': '1. Welke gegevens verzamelen wij?',
    'privacy.section1Text': 'Wij verzamelen de volgende persoonsgegevens wanneer u contact met ons opneemt of een bestelling plaatst:',
    'privacy.section1Item1': 'Naam',
    'privacy.section1Item2': 'E-mailadres',
    'privacy.section1Item3': 'Telefoonnummer (optioneel)',
    'privacy.section1Item4': 'Bericht- of bestelinhoud',
    'privacy.section2Title': '2. Waarom verzamelen wij deze gegevens?',
    'privacy.section2Text': 'Wij gebruiken uw gegevens voor de volgende doeleinden:',
    'privacy.section2Item1': 'Om uw vragen of opmerkingen te beantwoorden',
    'privacy.section2Item2': 'Om uw bestellingen te verwerken',
    'privacy.section2Item3': 'Om u te informeren over onze producten en diensten',
    'privacy.section2Item4': 'Om onze website en dienstverlening te verbeteren',
    'privacy.section3Title': '3. Hoe lang bewaren wij uw gegevens?',
    'privacy.section3Text': 'Wij bewaren uw persoonsgegevens niet langer dan strikt noodzakelijk is voor de doeleinden waarvoor ze zijn verzameld. Contactgegevens worden maximaal 2 jaar bewaard na het laatste contact.',
    'privacy.section4Title': '4. Delen wij uw gegevens met derden?',
    'privacy.section4Text': 'Wij delen uw persoonsgegevens niet met derden, tenzij dit noodzakelijk is voor de uitvoering van onze diensten of wanneer wij hiertoe wettelijk verplicht zijn.',
    'privacy.section5Title': '5. Uw rechten',
    'privacy.section5Text': 'U heeft het recht om:',
    'privacy.section5Item1': 'Uw persoonsgegevens in te zien',
    'privacy.section5Item2': 'Uw persoonsgegevens te laten corrigeren',
    'privacy.section5Item3': 'Uw persoonsgegevens te laten verwijderen',
    'privacy.section5Item4': 'Bezwaar te maken tegen de verwerking van uw persoonsgegevens',
    'privacy.section6Title': '6. Beveiliging',
    'privacy.section6Text': 'Wij nemen passende technische en organisatorische maatregelen om uw persoonsgegevens te beschermen tegen verlies, diefstal en ongeautoriseerde toegang.',
    'privacy.section7Title': '7. Contact',
    'privacy.section7Text': 'Heeft u vragen over ons privacybeleid of wilt u gebruik maken van uw rechten? Neem dan contact met ons op:',
    'privacy.section8Title': '8. Wijzigingen',
    'privacy.section8Text': 'Wij behouden ons het recht voor om dit privacybeleid aan te passen. Wijzigingen worden op deze pagina gepubliceerd. Wij raden u aan om regelmatig dit beleid te raadplegen.',

    // Cookies Page
    'cookies.title': 'Cookiebeleid',
    'cookies.intro': 'Deze website maakt gebruik van cookies om uw ervaring te verbeteren. Hieronder leggen wij uit wat cookies zijn en hoe wij ze gebruiken.',
    'cookies.lastUpdated': 'Laatst bijgewerkt',
    'cookies.section1Title': '1. Wat zijn cookies?',
    'cookies.section1Text': 'Cookies zijn kleine tekstbestanden die op uw computer of mobiele apparaat worden opgeslagen wanneer u onze website bezoekt. Ze helpen ons om de website goed te laten functioneren en om uw voorkeuren te onthouden.',
    'cookies.section2Title': '2. Welke cookies gebruiken wij?',
    'cookies.necessaryTitle': 'Noodzakelijke cookies',
    'cookies.necessaryText': 'Deze cookies zijn essentieel voor het functioneren van de website en kunnen niet worden uitgeschakeld. Ze worden alleen geplaatst als reactie op acties die u uitvoert, zoals het instellen van uw privacyvoorkeuren.',
    'cookies.tableCookie': 'Cookie',
    'cookies.tablePurpose': 'Doel',
    'cookies.tableDuration': 'Duur',
    'cookies.consentPurpose': 'Onthoudt uw cookievoorkeuren',
    'cookies.analyticalTitle': 'Analytische cookies',
    'cookies.analyticalText': 'Deze cookies helpen ons begrijpen hoe bezoekers onze website gebruiken. Alle informatie wordt geanonimiseerd verzameld.',
    'cookies.marketingTitle': 'Marketing cookies',
    'cookies.marketingText': 'Wij gebruiken momenteel geen marketing cookies. Mocht dit in de toekomst veranderen, dan informeren wij u hierover en vragen wij om uw toestemming.',
    'cookies.section3Title': '3. Hoe kunt u cookies beheren?',
    'cookies.section3Text': 'U kunt uw cookievoorkeuren op elk moment aanpassen via de instellingen van uw browser. Hieronder vindt u links naar de instructies van de meest gebruikte browsers:',
    'cookies.section4Title': '4. Cookies van derden',
    'cookies.section4Text': 'Onze website kan content bevatten van derden, zoals een embedded map van OpenStreetMap. Deze partijen kunnen hun eigen cookies plaatsen. Wij hebben geen controle over deze cookies. Raadpleeg het privacybeleid van deze partijen voor meer informatie.',
    'cookies.section5Title': '5. Contact',
    'cookies.section5Text': 'Heeft u vragen over ons cookiebeleid? Neem dan contact met ons op:',
    'cookies.section6Title': '6. Wijzigingen',
    'cookies.section6Text': 'Wij behouden ons het recht voor om dit cookiebeleid aan te passen. Wijzigingen worden op deze pagina gepubliceerd.',

    // Cookie Banner
    'cookieBanner.message': 'Wij gebruiken cookies om uw ervaring te verbeteren.',
    'cookieBanner.accept': 'Accepteren',
    'cookieBanner.decline': 'Weigeren',
    'cookieBanner.learnMore': 'Meer info',

    // Cart
    'cart.yourOrder': 'Jouw Bestelling',
    'cart.empty': 'Je winkelwagen is leeg',
    'cart.emptySubtext': 'Voeg heerlijke items toe van ons menu!',
    'cart.total': 'Totaal',
    'cart.checkout': 'Verder naar Afrekenen',
    'cart.clickCollect': 'Alleen Click & Collect • Betaal bij afrekenen',
    'cart.item': 'item',
    'cart.items': 'items',
    'cart.delivery': 'Bezorgen (Uber Eats)',
    'cart.takeaway': 'Afhalen (Click & Collect)',
    'cart.pickupNote': 'Afhalen kan binnen 30 minuten.',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.menu': 'Menu',
    'nav.about': 'About Us',
    'nav.gallery': 'Gallery',
    'nav.contact': 'Contact',
    'nav.order': 'ORDER NOW',

    // Hero
    'hero.tagline': "The crispiest Schiacciata in Amsterdam. Generously topped, fresh from the oven.",
    'hero.cta.menu': 'VIEW MENU',
    'hero.cta.order': 'ORDER NOW',
    'hero.cta.delivery': 'DELIVERY',
    'hero.cta.takeaway': 'TAKEAWAY',

    // Story Section
    'story.headline': 'From Sicily to Vijzelstraat.',
    'story.subtext1': "Three Sicilian friends, one dream: to bring the authentic flavors of Sicily to Amsterdam. No shortcuts, just time, passion and family secrets.",
    'story.subtext2': 'Fresh dough every day. Generously topped. The real Sicilian deal, right here in Amsterdam.',
    'story.videoCaption': 'Watch how it all started',
    'story.label': 'Our Story',
    'story.followInstagram': 'Follow us on Instagram',
    'story.clickToEnlarge': 'Click to enlarge',
    'story.close': 'Close',
    'story.soundOn': 'Sound on',
    'story.soundOff': 'Sound off',
    'story.clickToClose': 'Click anywhere to close',
    'story.video1.caption': 'The Dough',
    'story.video1.description': 'The perfect crunch starts with the perfect dough',
    'story.video2.caption': 'The Oven',
    'story.video2.description': 'Watch it rise in our authentic oven',
    'story.video3.caption': 'The Result',
    'story.video3.description': 'Fresh from the oven, ready to enjoy',

    // USP Section
    'usp.label': 'What Makes Us Unique',
    'usp.headline': "Why Wake N' Bake?",
    'usp.authentic.title': 'Authentic & Artisanal',
    'usp.authentic.desc': 'Traditional Italian recipes, freshly baked daily with the finest ingredients.',
    'usp.fast.title': 'Quick & Fresh',
    'usp.fast.desc': 'Straight from the oven. Perfect for a quick lunch or delicious breakfast.',
    'usp.love.title': 'Made With Love',
    'usp.love.desc': 'Every focaccia is prepared with passion and attention to detail.',

    // Menu Section (Home)
    'menu.label': 'Schiacciata',
    'menu.headline': 'Our Menu',
    'menu.subheadline': 'Fresh Schiacciata, made daily',
    'menu.regular': 'Regular',
    'menu.large': 'Large',
    'menu.category.pork': 'Pork Schiacciata',
    'menu.category.vegetarian': 'Vegetarian Schiacciata',
    'menu.category.beef': 'Beef | Fish Schiacciata',
    'menu.viewFull': 'View Full Menu',

    // Menu Page
    'menuPage.title': 'OUR MENU',
    'menuPage.subtitle': 'All products are freshly made daily with authentic Italian ingredients.',
    'menuPage.allergenTitle': 'Allergen Information',
    'menuPage.allergenText': 'Do you have an allergy or dietary requirement? Let us know! We prepare our products with care, but cross-contamination may occur in our kitchen.',
    'menuPage.addToOrder': 'Add to Order',

    // Location Section
    'location.headline': 'Come Taste It.',
    'location.subheadline': 'Find us in the heart of Amsterdam',
    'location.address': 'Vijzelstraat 93h, 1017 HH Amsterdam',
    'location.directions': 'Get Directions',
    'location.hours': 'Opening Hours',
    'location.weekdays': 'Mon - Fri: 08:00 - 18:00',
    'location.weekends': 'Sat - Sun: 09:00 - 17:00',
    'location.openNow': 'Open Now',
    'location.closed': 'Closed',
    'location.googleMaps': 'Open in Google Maps',
    'location.label': 'Visit Us',
    'location.orderOnline': 'Order Now Online',

    // Reviews Section
    'reviews.label': 'Loved by Locals',
    'reviews.headline': 'Loved by Locals',
    'reviews.subheadline': 'What our customers say',
    'reviews.rating': '4.9 stars based on 200+ reviews',
    'reviews.cta': 'View all reviews on Google',

    // CTA Section
    'cta.headline': 'Visit Us!',
    'cta.description': 'Experience the authentic Italian atmosphere and taste our freshly baked specialties. We warmly welcome you to our bakery.',
    'cta.visit': 'PLAN YOUR VISIT',
    'cta.call': 'CALL US',
    'cta.location': 'Location',
    'cta.hours': 'Opening Hours',
    'cta.contact': 'Contact',

    // Footer
    'footer.description': 'Authentic Italian bakery in the heart of Amsterdam. Freshly baked every day with love and passion.',
    'footer.contact': 'Contact',
    'footer.openingHours': 'Opening Hours',
    'footer.links': 'Links',
    'footer.rights': 'All rights reserved.',

    // Contact Page
    'contact.title': 'CONTACT & LOCATION',
    'contact.subtitle': 'Visit us for the best Italian focaccia in Amsterdam, or get in touch with any questions.',
    'contact.visitBakery': 'Visit Our Bakery',
    'contact.address': 'Address',
    'contact.phone': 'Phone',
    'contact.email': 'Email',
    'contact.openingHours': 'Opening Hours',
    'contact.socialMedia': 'Social Media',
    'contact.takeaway': 'Takeaway & Catering',
    'contact.takeawayText': 'Call or email us for large orders and catering options. We would love to cater your event with our fresh Italian products.',
    'contact.sendMessage': 'Send a Message',

    // Contact Form
    'form.name': 'Name',
    'form.namePlaceholder': 'Your name',
    'form.nameError': 'Name must be at least 2 characters',
    'form.email': 'Email',
    'form.emailPlaceholder': 'your@email.com',
    'form.emailError': 'Invalid email address',
    'form.phone': 'Phone (optional)',
    'form.phonePlaceholder': '+31 6 1234 5678',
    'form.subject': 'Subject',
    'form.subjectPlaceholder': 'Select a subject',
    'form.subjectError': 'Please select a subject',
    'form.subjectOrder': 'Order / Reservation',
    'form.subjectCatering': 'Catering',
    'form.subjectFeedback': 'Feedback',
    'form.subjectVacancy': 'Job Vacancy',
    'form.subjectOther': 'Other',
    'form.message': 'Message',
    'form.messagePlaceholder': 'Tell us how we can help you...',
    'form.messageError': 'Message must be at least 10 characters',
    'form.submit': 'Send Message',
    'form.submitting': 'Sending...',
    'form.success': 'Message sent! We will get back to you as soon as possible.',
    'form.error': 'Something went wrong. Please try again.',

    // Gallery Page
    'gallery.title': 'GALLERY',
    'gallery.subtitle': 'A glimpse into our bakery and our delicious products',
    'gallery.instagramCta': 'Follow us on Instagram for daily updates!',

    // About Page
    'about.heroTitle': 'OUR STORY',
    'about.heroSubtitle': "Three Sicilians, one dream. From Sicily to Amsterdam - discover the passion behind Wake N' Bake Panificio.",
    'about.storyTitle': 'From Sicily to Amsterdam',
    'about.storyP1': "The story of Wake N' Bake began when three friends from Sicily met each other in Amsterdam. Each of them grew up with the smell of freshly baked bread - from nonnas who were already kneading dough at 5 in the morning, from family celebrations where schiacciata was never missing.",
    'about.storyP2': 'In Amsterdam, they found each other and shared the same dream: to bring the authentic flavors of Sicily to the Netherlands. Not so long ago, they opened the doors of Wake N\' Bake Panificio on the Vijzelstraat, with recipes passed down from generation to generation.',
    'about.storyP3': 'Every morning we get up early to knead fresh dough, just as we learned at home. We import our flour and ingredients directly from Sicily. No rush, no compromises - just the real Sicilian taste.',
    'about.valuesTitle': 'What We Stand For',
    'about.valueQuality': 'Quality',
    'about.valueQualityDesc': 'We only use the finest ingredients, imported directly from Sicily.',
    'about.valuePassion': 'Passion',
    'about.valuePassionDesc': 'Every day we stand in the kitchen with love to make the perfect schiacciata.',
    'about.valueAuthenticity': 'Authenticity',
    'about.valueAuthenticityDesc': 'Our recipes have been passed down from generation to generation from Sicily.',
    'about.valueCommunity': 'Community',
    'about.valueCommunityDesc': 'We are proud to be part of the Amsterdam neighborhood and community.',
    'about.teamTitle': 'Our Team',
    'about.teamP1': "Behind Wake N' Bake are three Sicilian friends who share their passion for authentic Italian bread. Together with our team, we bring the flavors of Sicily to Amsterdam every day.",
    'about.teamP2': 'We believe in a warm atmosphere, just like home in Sicily. Feel free to stop by for a chat and taste why our regular customers see us as their second living room.',
    'about.workWithUs': 'WORK WITH US?',
    'about.ctaTitle': 'Taste It Yourself',
    'about.ctaText': 'The best way to understand our story? Come by and taste our products. We welcome you warmly!',
    'about.viewMenu': 'VIEW MENU',
    'about.visitUs': 'VISIT US',

    // Checkout Page
    'checkout.title': 'Checkout',
    'checkout.clickCollect': 'Click & Collect',
    'checkout.backToMenu': 'Back to Menu',
    'checkout.step1': 'Your Details',
    'checkout.step2': 'Pickup Time',
    'checkout.step3': 'Payment',
    'checkout.fullName': 'Full Name',
    'checkout.email': 'Email Address',
    'checkout.phone': 'Phone Number',
    'checkout.nameRequired': 'Name is required',
    'checkout.emailRequired': 'Email is required',
    'checkout.emailInvalid': 'Please enter a valid email',
    'checkout.phoneRequired': 'Phone number is required',
    'checkout.phoneInvalid': 'Please enter a valid phone number',
    'checkout.continueToPickup': 'Continue to Pickup Time',
    'checkout.selectPickupTime': 'Select Pickup Time',
    'checkout.selectTimeSlot': 'Choose a 15-minute window to collect your order',
    'checkout.noSlotsTitle': 'No pickup slots available',
    'checkout.noSlotsText': 'Please try again tomorrow between 10:00 - 18:00',
    'checkout.selectTimeRequired': 'Please select a pickup time',
    'checkout.back': 'Back',
    'checkout.continueToPayment': 'Continue to Payment',
    'checkout.payment': 'Payment',
    'checkout.orderSummary': 'Order Summary',
    'checkout.total': 'Total',
    'checkout.pickupTime': 'Pickup Time',
    'checkout.demoNotice': 'This is a prototype. No actual payment will be processed.',
    'checkout.processing': 'Processing...',
    'checkout.payAndOrder': 'Pay & Place Order',
    'checkout.yourOrder': 'Your Order',
    'checkout.payAtCheckout': 'Click & Collect only • Pay at checkout',

    // Order Success Page
    'success.orderNumber': 'Order Number',
    'success.pickupTime': 'Pickup Time',
    'success.orderDetails': 'Order Details',
    'success.totalPaid': 'Total Paid',
    'success.customer': 'Customer',
    'success.collectionPoint': 'Collection Point',
    'success.showReceipt': 'Show this receipt at the counter to collect your food',
    'success.thankYou': 'Thank you for your order!',
    'success.orderMore': 'Order More',
    'success.backToHome': 'Back to Home',

    // Privacy Page
    'privacy.title': 'Privacy Policy',
    'privacy.intro': "Wake N' Bake Panificio respects your privacy and ensures that the personal information you share with us is treated confidentially.",
    'privacy.lastUpdated': 'Last updated',
    'privacy.section1Title': '1. What data do we collect?',
    'privacy.section1Text': 'We collect the following personal data when you contact us or place an order:',
    'privacy.section1Item1': 'Name',
    'privacy.section1Item2': 'Email address',
    'privacy.section1Item3': 'Phone number (optional)',
    'privacy.section1Item4': 'Message or order content',
    'privacy.section2Title': '2. Why do we collect this data?',
    'privacy.section2Text': 'We use your data for the following purposes:',
    'privacy.section2Item1': 'To answer your questions or comments',
    'privacy.section2Item2': 'To process your orders',
    'privacy.section2Item3': 'To inform you about our products and services',
    'privacy.section2Item4': 'To improve our website and services',
    'privacy.section3Title': '3. How long do we keep your data?',
    'privacy.section3Text': 'We do not keep your personal data longer than strictly necessary for the purposes for which it was collected. Contact details are kept for a maximum of 2 years after the last contact.',
    'privacy.section4Title': '4. Do we share your data with third parties?',
    'privacy.section4Text': 'We do not share your personal data with third parties unless this is necessary for the execution of our services or when we are legally obliged to do so.',
    'privacy.section5Title': '5. Your rights',
    'privacy.section5Text': 'You have the right to:',
    'privacy.section5Item1': 'View your personal data',
    'privacy.section5Item2': 'Have your personal data corrected',
    'privacy.section5Item3': 'Have your personal data deleted',
    'privacy.section5Item4': 'Object to the processing of your personal data',
    'privacy.section6Title': '6. Security',
    'privacy.section6Text': 'We take appropriate technical and organizational measures to protect your personal data against loss, theft and unauthorized access.',
    'privacy.section7Title': '7. Contact',
    'privacy.section7Text': 'Do you have questions about our privacy policy or do you want to exercise your rights? Please contact us:',
    'privacy.section8Title': '8. Changes',
    'privacy.section8Text': 'We reserve the right to modify this privacy policy. Changes will be published on this page. We recommend that you consult this policy regularly.',

    // Cookies Page
    'cookies.title': 'Cookie Policy',
    'cookies.intro': 'This website uses cookies to improve your experience. Below we explain what cookies are and how we use them.',
    'cookies.lastUpdated': 'Last updated',
    'cookies.section1Title': '1. What are cookies?',
    'cookies.section1Text': 'Cookies are small text files that are stored on your computer or mobile device when you visit our website. They help us to make the website function properly and to remember your preferences.',
    'cookies.section2Title': '2. What cookies do we use?',
    'cookies.necessaryTitle': 'Necessary cookies',
    'cookies.necessaryText': 'These cookies are essential for the functioning of the website and cannot be switched off. They are only placed in response to actions you take, such as setting your privacy preferences.',
    'cookies.tableCookie': 'Cookie',
    'cookies.tablePurpose': 'Purpose',
    'cookies.tableDuration': 'Duration',
    'cookies.consentPurpose': 'Remembers your cookie preferences',
    'cookies.analyticalTitle': 'Analytical cookies',
    'cookies.analyticalText': 'These cookies help us understand how visitors use our website. All information is collected anonymously.',
    'cookies.marketingTitle': 'Marketing cookies',
    'cookies.marketingText': 'We currently do not use marketing cookies. Should this change in the future, we will inform you and ask for your consent.',
    'cookies.section3Title': '3. How can you manage cookies?',
    'cookies.section3Text': 'You can adjust your cookie preferences at any time via your browser settings. Below you will find links to the instructions of the most commonly used browsers:',
    'cookies.section4Title': '4. Third-party cookies',
    'cookies.section4Text': 'Our website may contain content from third parties, such as an embedded map from OpenStreetMap. These parties may place their own cookies. We have no control over these cookies. Please consult the privacy policy of these parties for more information.',
    'cookies.section5Title': '5. Contact',
    'cookies.section5Text': 'Do you have questions about our cookie policy? Please contact us:',
    'cookies.section6Title': '6. Changes',
    'cookies.section6Text': 'We reserve the right to modify this cookie policy. Changes will be published on this page.',

    // Cookie Banner
    'cookieBanner.message': 'We use cookies to improve your experience.',
    'cookieBanner.accept': 'Accept',
    'cookieBanner.decline': 'Decline',
    'cookieBanner.learnMore': 'Learn more',

    // Cart
    'cart.yourOrder': 'Your Order',
    'cart.empty': 'Your cart is empty',
    'cart.emptySubtext': 'Add some delicious items from our menu!',
    'cart.total': 'Total',
    'cart.checkout': 'Proceed to Checkout',
    'cart.clickCollect': 'Click & Collect only • Pay at checkout',
    'cart.item': 'item',
    'cart.items': 'items',
    'cart.delivery': 'Delivery (Uber Eats)',
    'cart.takeaway': 'Takeaway (Click & Collect)',
    'cart.pickupNote': 'Pickup available within 30 minutes.',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('nl')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check localStorage for saved preference
    const saved = localStorage.getItem('language') as Language
    if (saved && (saved === 'nl' || saved === 'en')) {
      setLanguageState(saved)
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem('language', lang)
  }

  // Always render children, but use default language until mounted
  const contextValue = {
    language: mounted ? language : 'nl',
    setLanguage,
    t: (key: string) => translations[mounted ? language : 'nl'][key] || key,
  }

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
