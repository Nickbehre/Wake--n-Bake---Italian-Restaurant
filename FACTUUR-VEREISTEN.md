# Factuur & Kostenoverzicht — Wake 'n Bake Website

## Project Overzicht

Volledige website voor Wake 'n Bake (Italiaans restaurant) met:
- Publieke website (homepage, menu, galerij, over ons, contact)
- Online bestelsysteem met winkelwagen
- Checkout met Stripe betalingen + bankoverschrijving optie
- Orderbevestiging e-mails
- Admin dashboard (orders beheren, instellingen, catering aanvragen, betalingsbewijzen)
- Supabase database (producten, orders, instellingen, contactverzoeken)
- Privacy-, cookie- en contactpagina's

---

## Eenmalige Kosten (Factuur)

### 1. Website Ontwikkeling
| Onderdeel | Omschrijving |
|-----------|-------------|
| Frontend website | Next.js 15 met React 19, Tailwind CSS, Framer Motion animaties |
| Online bestelsysteem | Winkelwagen, checkout flow, tijdslot selectie |
| Stripe integratie | Betalingsverwerking, webhooks, payment intents |
| Bankoverschrijving optie | Alternatieve betaalmethode met betalingsbewijs upload |
| E-mail systeem | Orderbevestigingen en notificaties via Resend |
| Admin dashboard | Orderbeheer, instellingen, catering aanvragen bekijken |
| Database opzet | Supabase tabellen, RLS policies, storage buckets |
| Responsive design | Mobiel, tablet en desktop |
| SEO & juridisch | Privacy policy, cookie policy, contactpagina |

### 2. Opzet & Configuratie
| Onderdeel | Omschrijving |
|-----------|-------------|
| Hosting configuratie | Vercel deployment setup |
| Domein koppeling | DNS configuratie voor wakenbake.nl |
| Stripe account setup | Test + live keys, webhook configuratie |
| Supabase project setup | Database, authentication, storage |
| E-mail domein setup | Resend configuratie voor order.wakenbake.nl |

---

## Maandelijkse / Doorlopende Kosten (voor Ruben)

### Hosting & Infrastructuur

| Service | Free Tier | Geschatte kosten bij groei | Toelichting |
|---------|-----------|---------------------------|-------------|
| **Vercel** (hosting) | Gratis (Hobby plan) | ~$20/maand (Pro) | Gratis is voldoende voor start. Pro nodig bij commercieel gebruik of >100GB bandwidth |
| **Supabase** (database) | Gratis (500MB database, 1GB storage) | $25/maand (Pro) | Gratis tier is ruim voldoende voor start. Pro nodig bij >500MB data of >50.000 monthly active users |
| **Custom domein** (wakenbake.nl) | n.v.t. | ~$10-15/jaar | Jaarlijkse domeinregistratie |

### Betaaldiensten

| Service | Kosten | Toelichting |
|---------|--------|-------------|
| **Stripe** | 1,4% + $0,25 per transactie (EU kaarten) | Geen maandelijks bedrag, alleen per transactie. Hogere fee voor niet-EU kaarten (2,9% + $0,25) |

### E-mail

| Service | Free Tier | Geschatte kosten bij groei | Toelichting |
|---------|-----------|---------------------------|-------------|
| **Resend** (transactie e-mails) | 100 emails/dag gratis | $20/maand (5.000 emails/maand) | Orderbevestigingen, notificaties. Gratis tier is voldoende bij start |

---

## Samenvatting Maandelijkse Kosten

### Bij start (gratis tiers)
| | Kosten |
|-|--------|
| Vercel Hobby | $0 |
| Supabase Free | $0 |
| Resend Free | $0 |
| Stripe | Alleen per transactie |
| **Totaal vast** | **~$0/maand** + domeinkosten (~$1/maand) |

### Bij groei (betaalde tiers)
| | Kosten |
|-|--------|
| Vercel Pro | $20/maand |
| Supabase Pro | $25/maand |
| Resend Pro | $20/maand |
| Stripe | Alleen per transactie |
| **Totaal vast** | **~$65/maand** + transactiekosten |

---

## Belangrijk: Vercel Hobby vs Pro

Het Vercel **Hobby plan** (gratis) is bedoeld voor persoonlijke projecten. Voor een commerciele website zoals Wake 'n Bake is het **Pro plan ($20/maand)** technisch gezien vereist volgens Vercel's voorwaarden. Dit is iets om rekening mee te houden.

---

## Optionele Toekomstige Kosten

| Service | Wanneer | Geschatte kosten |
|---------|---------|-----------------|
| Google Analytics | Altijd gratis | $0 |
| Google Maps API | Bij >28.000 loads/maand | ~$7 per 1.000 extra loads |
| SSL certificaat | Inbegrepen bij Vercel | $0 |
| CDN / afbeeldingen | Inbegrepen bij Vercel/Next.js | $0 |

---

*Document aangemaakt: 17 maart 2026*
