import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { markOrderPaid, markOrderPaymentFailed } from '@/lib/server/fulfil-order';

/**
 * POST /api/confirm-order
 *
 * De success-pagina vraagt hier of er écht betaald is. De waarheid komt van
 * Stripe zelf (server-side retrieve), niet van de browser van de klant.
 *
 * Dit is bewust een tweede, onafhankelijke route naast de webhook: als de
 * webhook niet geconfigureerd is of faalt, komt de order hierlangs alsnog in
 * het dashboard. Allebei gebruiken dezelfde idempotente helper.
 *
 * Publiek endpoint, maar niet te misbruiken: je moet het client_secret van de
 * PaymentIntent kennen, en de betaalstatus wordt bij Stripe opgehaald.
 */

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export async function POST(request: Request) {
  try {
    const { paymentIntentId, clientSecret } = (await request.json()) as {
      paymentIntentId?: string;
      clientSecret?: string;
    };

    if (!paymentIntentId || !clientSecret) {
      return NextResponse.json(
        { paid: false, error: 'paymentIntentId en clientSecret zijn verplicht' },
        { status: 400 }
      );
    }

    if (!/^pi_[A-Za-z0-9_]+$/.test(paymentIntentId)) {
      return NextResponse.json({ paid: false, error: 'Ongeldige payment intent' }, { status: 400 });
    }

    const stripe = getStripe();

    let pi: Stripe.PaymentIntent;
    try {
      pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (err: any) {
      console.error('[confirm-order] PaymentIntent niet op te halen:', paymentIntentId, err?.message);
      return NextResponse.json({ paid: false, error: 'Betaling niet gevonden' }, { status: 404 });
    }

    // Bewijs dat deze bezoeker bij deze checkout hoort.
    if (!pi.client_secret || pi.client_secret !== clientSecret) {
      console.warn('[confirm-order] client_secret komt niet overeen voor', paymentIntentId);
      return NextResponse.json({ paid: false, error: 'Niet toegestaan' }, { status: 403 });
    }

    if (pi.status !== 'succeeded') {
      if (pi.status === 'requires_payment_method' || pi.status === 'canceled') {
        await markOrderPaymentFailed(pi);
      }
      return NextResponse.json({
        paid: false,
        status: pi.status,
        orderId: pi.metadata?.order_id ?? null,
      });
    }

    const result = await markOrderPaid(pi);

    return NextResponse.json({
      paid: true,
      orderId: result.orderId,
      order: result.order ?? null,
      amountPaid: (pi.amount_received ?? 0) / 100,
    });
  } catch (error: any) {
    console.error('[confirm-order] Onverwachte fout:', error);
    return NextResponse.json(
      { paid: false, error: 'Kon de betaling niet verifiëren' },
      { status: 500 }
    );
  }
}
