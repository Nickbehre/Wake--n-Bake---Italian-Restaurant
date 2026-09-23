import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * POST /api/checkout-details
 *
 * Slaat de contactgegevens + ophaaltijd op bij een order die nog op betaling
 * wacht. Wordt door de klant zelf aangeroepen, vlak voor de Stripe-redirect.
 *
 * Let op: /api/update-order is admin-only en gaf hier altijd een 401, waardoor
 * orders zonder naam, telefoon en ophaaltijd in het dashboard belandden. Dit
 * endpoint vervangt die aanroep en is opzettelijk zeer beperkt:
 *   - alleen customer_name / customer_email / customer_phone / pickup_time
 *   - alleen zolang de order status 'awaiting_payment' heeft
 *   - alleen met het juiste client_secret van de bijbehorende PaymentIntent
 *
 * De gegevens worden ook in de PaymentIntent-metadata gezet, zodat de webhook
 * ze kan terugschrijven als deze aanroep onderweg verloren gaat.
 */

function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

function clean(value: unknown, max = 200): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  try {
    const { orderId, clientSecret, customer, pickupTime } = (await request.json()) as {
      orderId?: string;
      clientSecret?: string;
      customer?: { name?: string; email?: string; phone?: string };
      pickupTime?: string;
    };

    if (!orderId || !clientSecret) {
      return NextResponse.json({ error: 'orderId en clientSecret zijn verplicht' }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: order, error: readError } = await supabase
      .from('orders')
      .select('id, status, stripe_payment_intent_id')
      .eq('id', orderId)
      .maybeSingle();

    if (readError) {
      console.error('[checkout-details] Kon order niet lezen:', orderId, readError);
      return NextResponse.json({ error: 'Kon order niet lezen' }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json({ error: 'Order niet gevonden' }, { status: 404 });
    }

    // Na betaling mag de klant hier niets meer wijzigen.
    if (order.status !== 'awaiting_payment') {
      return NextResponse.json({ error: 'Order is niet meer aanpasbaar' }, { status: 409 });
    }

    if (!order.stripe_payment_intent_id) {
      return NextResponse.json({ error: 'Order heeft geen betaling' }, { status: 409 });
    }

    const stripe = getStripe();

    let pi: Stripe.PaymentIntent;
    try {
      pi = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
    } catch (err: any) {
      console.error('[checkout-details] PaymentIntent niet op te halen:', orderId, err?.message);
      return NextResponse.json({ error: 'Betaling niet gevonden' }, { status: 404 });
    }

    if (!pi.client_secret || pi.client_secret !== clientSecret) {
      console.warn('[checkout-details] client_secret komt niet overeen voor', orderId);
      return NextResponse.json({ error: 'Niet toegestaan' }, { status: 403 });
    }

    const name = clean(customer?.name, 120);
    const email = clean(customer?.email, 160);
    const phone = clean(customer?.phone, 40);
    const pickup = clean(pickupTime, 40);

    const updateData: Record<string, string> = { updated_at: new Date().toISOString() };
    if (name) updateData.customer_name = name;
    if (email) updateData.customer_email = email;
    if (phone) updateData.customer_phone = phone;
    if (pickup) updateData.pickup_time = pickup;

    const { error: updateError } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .eq('status', 'awaiting_payment');

    if (updateError) {
      console.error('[checkout-details] Opslaan mislukt:', orderId, updateError);
      return NextResponse.json({ error: 'Opslaan mislukt' }, { status: 500 });
    }

    // Vangnet voor de webhook: ook in Stripe vastleggen.
    try {
      await stripe.paymentIntents.update(order.stripe_payment_intent_id, {
        metadata: {
          ...pi.metadata,
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          pickup_time: pickup,
        },
      });
    } catch (err) {
      // Niet fataal: de gegevens staan al in de database.
      console.error('[checkout-details] PaymentIntent-metadata bijwerken mislukt:', orderId, err);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('[checkout-details] Onverwachte fout:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
