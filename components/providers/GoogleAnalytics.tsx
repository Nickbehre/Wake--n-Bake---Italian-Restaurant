'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import {
  GA_MEASUREMENT_ID,
  CONSENT_CHANGED_EVENT,
  flushPendingEvents,
} from '@/lib/analytics'

// Laadt GA4 alleen na expliciete cookie-consent (AVG).
// Luistert naar het consent-event van de CookieBanner zodat
// tracking direct start na 'Accepteren', zonder reload.
export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false)

  useEffect(() => {
    const checkConsent = () =>
      setHasConsent(localStorage.getItem('cookieConsent') === 'accepted')

    checkConsent()
    window.addEventListener(CONSENT_CHANGED_EVENT, checkConsent)
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, checkConsent)
  }, [])

  useEffect(() => {
    if (!hasConsent || !GA_MEASUREMENT_ID || window.gtag) return

    // De gtag-stub queuet alles in de dataLayer; gtag.js verwerkt de
    // queue zodra het script geladen is. Zo gaan events die vóór het
    // laden afgevuurd worden (bv. purchase na Stripe-redirect) niet
    // verloren — die staan gebufferd en worden hier direct geflusht.
    window.dataLayer = window.dataLayer || []
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true })
    flushPendingEvents()
  }, [hasConsent])

  if (!GA_MEASUREMENT_ID || !hasConsent) return null

  return (
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      strategy="afterInteractive"
    />
  )
}
