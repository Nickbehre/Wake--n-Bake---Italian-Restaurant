import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { markOrderPaid, markOrderPaymentFailed } from '@/lib/server/fulfil-order'

// Stripe lazy initialiseren — voorkomt build-time errors wanneer
// STRIPE_SECRET_KEY niet beschikbaar is tijdens `next build`.
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY)
}

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    console.error('[stripe-webhook] Verzoek zonder stripe-signature header')
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // Dit is de stille killer: zonder secret wordt élke betaling genegeerd en
    // verschijnt er nooit een order in het dashboard. Luid loggen.
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET ontbreekt — betalingen kunnen niet worden verwerkt!')
    return NextResponse.json({ error: 'Webhook secret not configured' }, { status: 500 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('[stripe-webhook] Signature-verificatie mislukt:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        const result = await markOrderPaid(pi)
        console.log('[stripe-webhook] payment_intent.succeeded verwerkt:', {
          orderId: result.orderId,
          transitioned: result.transitioned,
          reason: result.reason,
        })
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await markOrderPaymentFailed(pi)
        break
      }
    }
  } catch (err: any) {
    // 500 teruggeven zodat Stripe het event opnieuw aanbiedt. Een 200 bij een
    // fout zou betekenen dat een betaalde order definitief onzichtbaar blijft.
    console.error('[stripe-webhook] Verwerken van event mislukt:', event.type, err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
