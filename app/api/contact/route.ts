import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Minimale tijd tussen het openen van het formulier en versturen. Een mens
// doet er altijd langer over; bots posten binnen een seconde.
const MIN_FILL_MS = 3000

/**
 * Herkent de bot-spam die sinds juli binnenkomt: willekeurige naam als
 * "YaHKZWmmiUYdjWEtHj", een gmail-adres vol puntjes en een "bericht" dat
 * alleen uit cijfers of één willekeurig woord bestaat.
 */
function looksLikeSpam(name: string, message: string): boolean {
  const words = message.trim().split(/\s+/).filter((w) => /\p{L}/u.test(w))

  // Geen enkel woord met letters (bijv. "2549327050"), of maar één woord
  // (bijv. "kXXeMpiRkqTYqDyXhq"): geen echt bericht.
  if (words.length < 2) return true

  // Eén lange naam zonder spaties met veel hoofd/kleine-letterwissels.
  const trimmedName = name.trim()
  if (!/\s/.test(trimmedName) && trimmedName.length >= 12) {
    const caseSwitches = (trimmedName.match(/[a-z][A-Z]|[A-Z][a-z]/g) ?? []).length
    if (caseSwitches >= 5) return true
  }

  return false
}

export async function POST(request: NextRequest) {
  const { name, email, phone, subject, message, website, startedAt } = await request.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
  }

  // Honeypot ('website' is onzichtbaar voor mensen), te snel verstuurd, of
  // spam-patroon. Niet weggooien: bewaren met status 'spam' (verborgen in de
  // admin, zonder melding), zodat een onterecht geblokt bericht terug te
  // vinden is. De afzender krijgt gewoon "success".
  const tooFast =
    typeof startedAt !== 'number' || Date.now() - startedAt < MIN_FILL_MS
  const isSpam = !!website || tooFast || looksLikeSpam(String(name), String(message))

  const admin = createAdminClient()

  const { error } = await admin.from('contact_requests').insert({
    name,
    email,
    phone: phone || null,
    subject,
    message,
    ...(isSpam ? { status: 'spam' } : {}),
  })

  if (error) {
    console.error('Error saving contact request:', error)
    return NextResponse.json({ error: 'Could not save message' }, { status: 500 })
  }

  if (isSpam) {
    console.warn('[contact] Als spam gemarkeerd:', { name, email, honeypot: !!website, tooFast })
    return NextResponse.json({ success: true })
  }

  // Create notification for admin
  await admin.from('notifications').insert({
    type: subject === 'catering' ? 'catering_request' : 'contact_request',
    title: subject === 'catering' ? `Catering request - ${name}` : `Contact message - ${name}`,
    message: message.substring(0, 200),
  })

  return NextResponse.json({ success: true })
}
