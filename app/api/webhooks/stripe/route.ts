import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

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

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = createAdminClient()

  switch (event.type) {
    case 'payment_intent.succeeded': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata.order_id

      if (orderId) {
        // Betaald → nu pas als "New order" zichtbaar voor het personeel
        // (orders staan tot dan op 'awaiting_payment' en zijn verborgen)
        await supabase
          .from('orders')
          .update({
            stripe_payment_status: 'succeeded',
            stripe_amount_received: pi.amount_received,
            status: 'pending',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
          .eq('status', 'awaiting_payment')

        // Create notification
        await supabase.from('notifications').insert({
          order_id: orderId,
          type: 'payment_received',
          title: `Betaling ontvangen - ${orderId}`,
          message: `EUR ${(pi.amount_received / 100).toFixed(2)} ontvangen via Stripe`,
        })
      }
      break
    }

    case 'payment_intent.payment_failed': {
      const pi = event.data.object as Stripe.PaymentIntent
      const orderId = pi.metadata.order_id

      if (orderId) {
        await supabase
          .from('orders')
          .update({
            stripe_payment_status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)
      }
      break
    }
  }

  return NextResponse.json({ received: true })
}
