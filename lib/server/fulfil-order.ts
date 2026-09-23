import type Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { sendOrderEmails } from '@/lib/email/send';

/**
 * Eén enkele, betalings-geverifieerde route naar "order is echt besteld".
 *
 * Zowel de Stripe-webhook als /api/confirm-order (de success-pagina) komen hier
 * uit. Welke van de twee het eerst arriveert maakt niet uit: de overgang
 * awaiting_payment -> pending is een conditionele UPDATE, dus precies één
 * aanroep wint en stuurt de e-mails. De ander ziet 0 gewijzigde rijen en doet
 * niets meer. Zo kan een order nooit dubbel gemaild worden, en nooit zichtbaar
 * worden zonder dat Stripe de betaling bevestigd heeft.
 */

export interface FulfilResult {
  /** Stripe bevestigt dat er betaald is. */
  paid: boolean;
  /** Deze aanroep heeft de order van awaiting_payment naar pending gezet. */
  transitioned: boolean;
  orderId: string | null;
  order?: {
    id: string;
    total: number;
    pickupTime: string;
    status: string;
    customerEmail: string;
  };
  reason?: string;
}

function metadataString(pi: Stripe.PaymentIntent, key: string): string {
  const value = pi.metadata?.[key];
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Markeer de order van een geslaagde PaymentIntent als betaald en zichtbaar.
 * Idempotent: veilig om meerdere keren aan te roepen voor dezelfde PI.
 */
export async function markOrderPaid(pi: Stripe.PaymentIntent): Promise<FulfilResult> {
  const orderId = metadataString(pi, 'order_id') || null;

  if (pi.status !== 'succeeded') {
    return { paid: false, transitioned: false, orderId, reason: `payment_intent status: ${pi.status}` };
  }

  if (!orderId) {
    console.error('[fulfil-order] Geslaagde PaymentIntent zonder order_id in metadata:', pi.id);
    return { paid: true, transitioned: false, orderId: null, reason: 'missing_order_id' };
  }

  const supabase = createAdminClient();
  const amountPaid = (pi.amount_received ?? 0) / 100;

  // Contactgegevens uit de PI-metadata als vangnet: als de browser van de klant
  // ze niet heeft kunnen opslaan (tab gesloten, netwerk weg), dan staan ze hier
  // nog wel en wil het personeel ze alsnog zien.
  const fallbackName = metadataString(pi, 'customer_name');
  const fallbackEmail = metadataString(pi, 'customer_email');
  const fallbackPhone = metadataString(pi, 'customer_phone');
  const fallbackPickup = metadataString(pi, 'pickup_time');

  const { data: existing, error: readError } = await supabase
    .from('orders')
    .select('id, items, customer_name, customer_email, customer_phone, total, pickup_time, status')
    .eq('id', orderId)
    .maybeSingle();

  if (readError) {
    console.error('[fulfil-order] Kon order niet lezen:', orderId, readError);
    throw new Error(`Kon order ${orderId} niet lezen: ${readError.message}`);
  }

  if (!existing) {
    // De insert bij het aanmaken van de PaymentIntent is mislukt, maar er is wél
    // betaald. Nooit laten verdwijnen: reconstrueer de order uit Stripe.
    console.error('[fulfil-order] Betaalde order bestaat niet in de database, wordt hersteld:', orderId);
    const { error: insertError } = await supabase.from('orders').insert({
      id: orderId,
      items: [],
      customer_name: fallbackName,
      customer_email: fallbackEmail,
      customer_phone: fallbackPhone,
      subtotal: amountPaid,
      total: amountPaid,
      pickup_time: fallbackPickup,
      status: 'pending',
      payment_method: 'stripe',
      stripe_payment_intent_id: pi.id,
      stripe_payment_status: 'succeeded',
      stripe_amount_received: pi.amount_received,
      location: metadataString(pi, 'location') || 'original',
      notes: 'Automatisch hersteld uit Stripe - items onbekend, controleer de betaling in Stripe.',
    });

    if (insertError) {
      console.error('[fulfil-order] Herstel-insert mislukt:', orderId, insertError);
      throw new Error(`Herstel-insert mislukt voor ${orderId}: ${insertError.message}`);
    }

    return {
      paid: true,
      transitioned: true,
      orderId,
      order: {
        id: orderId,
        total: amountPaid,
        pickupTime: fallbackPickup,
        status: 'pending',
        customerEmail: fallbackEmail,
      },
    };
  }

  const customerName = existing.customer_name || fallbackName;
  const customerEmail = existing.customer_email || fallbackEmail;
  const customerPhone = existing.customer_phone || fallbackPhone;
  const pickupTime = existing.pickup_time || fallbackPickup;

  // Conditionele overgang: alleen de aanroep die awaiting_payment aantreft mag
  // de e-mails sturen. Dit is de idempotentie-sleutel van de hele flow.
  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({
      status: 'pending',
      stripe_payment_status: 'succeeded',
      stripe_amount_received: pi.amount_received,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      pickup_time: pickupTime,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('status', 'awaiting_payment')
    .select('id');

  if (updateError) {
    console.error('[fulfil-order] Statusupdate mislukt:', orderId, updateError);
    throw new Error(`Statusupdate mislukt voor ${orderId}: ${updateError.message}`);
  }

  const transitioned = (updated?.length ?? 0) > 0;

  const order = {
    id: orderId,
    total: Number(existing.total),
    pickupTime,
    status: transitioned ? 'pending' : existing.status,
    customerEmail,
  };

  if (!transitioned) {
    // Al eerder afgehandeld (webhook en success-pagina racen met elkaar).
    return { paid: true, transitioned: false, orderId, order, reason: 'already_fulfilled' };
  }

  // Pas hier - na bevestigde betaling - gaat er een mail naar klant en winkel.
  const { error: notifyError } = await supabase.from('notifications').insert({
    order_id: orderId,
    type: 'payment_received',
    title: `Betaling ontvangen - ${orderId}`,
    message: `EUR ${amountPaid.toFixed(2)} ontvangen via Stripe`,
  });
  if (notifyError) {
    console.error('[fulfil-order] Notificatie aanmaken mislukt:', orderId, notifyError);
  }

  if (customerEmail) {
    try {
      const emailResults = await sendOrderEmails({
        orderId,
        items: Array.isArray(existing.items) ? existing.items : [],
        customer: { name: customerName || 'Klant', email: customerEmail, phone: customerPhone },
        total: Number(existing.total),
        pickupTime: pickupTime || 'Onbekend',
      });
      if (!emailResults.customerEmail.success || !emailResults.storeEmail.success) {
        console.error('[fulfil-order] E-mail deels mislukt:', orderId, emailResults);
      }
    } catch (err) {
      // De betaling is binnen en de order staat in het dashboard: een mislukte
      // mail mag dat nooit terugdraaien.
      console.error('[fulfil-order] Verzenden ordermails mislukt:', orderId, err);
    }
  } else {
    console.warn('[fulfil-order] Geen e-mailadres bekend, geen bevestiging verstuurd:', orderId);
  }

  return { paid: true, transitioned: true, orderId, order };
}

/** Markeer een mislukte betaling, zonder de order zichtbaar te maken. */
export async function markOrderPaymentFailed(pi: Stripe.PaymentIntent): Promise<void> {
  const orderId = metadataString(pi, 'order_id');
  if (!orderId) return;

  const supabase = createAdminClient();
  const { error } = await supabase
    .from('orders')
    .update({
      stripe_payment_status: 'failed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('status', 'awaiting_payment');

  if (error) {
    console.error('[fulfil-order] Kon mislukte betaling niet vastleggen:', orderId, error);
    throw new Error(`Kon mislukte betaling niet vastleggen voor ${orderId}: ${error.message}`);
  }
}
