import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createAdminClient } from '@/lib/supabase/admin'

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
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
        await supabase
          .from('orders')
          .update({
            stripe_payment_status: 'succeeded',
            stripe_amount_received: pi.amount_received,
            status: 'confirmed',
            updated_at: new Date().toISOString(),
          })
          .eq('id', orderId)

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
