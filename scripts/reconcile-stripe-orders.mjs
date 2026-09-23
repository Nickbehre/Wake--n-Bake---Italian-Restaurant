/**
 * Reconciliatie: vergelijk elke order die op 'awaiting_payment' staat met de
 * echte betaalstatus in Stripe.
 *
 * Nodig omdat de webhook een tijd lang niets heeft bijgewerkt: orders die wél
 * betaald zijn kunnen daardoor nog op 'awaiting_payment' staan en zijn dan nooit
 * in het dashboard verschenen.
 *
 * Gebruik (standaard alleen rapporteren, wijzigt niets):
 *   node scripts/reconcile-stripe-orders.mjs
 *
 * Daadwerkelijk herstellen van betaalde orders:
 *   node scripts/reconcile-stripe-orders.mjs --apply
 *
 * Vereist in de omgeving (échte productiewaarden, niet de dummy's):
 *   STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Let op: met --apply worden betaalde orders op 'pending' gezet, zodat ze in het
 * dashboard verschijnen. Er worden GEEN e-mails verstuurd — bestellingen van
 * weken terug wil je niet alsnog naar de keuken sturen.
 */

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const APPLY = process.argv.includes('--apply');

const { STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

const missing = [
  ['STRIPE_SECRET_KEY', STRIPE_SECRET_KEY],
  ['NEXT_PUBLIC_SUPABASE_URL', NEXT_PUBLIC_SUPABASE_URL],
  ['SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY],
].filter(([, v]) => !v).map(([k]) => k);

if (missing.length) {
  console.error(`Ontbrekende omgevingsvariabelen: ${missing.join(', ')}`);
  process.exit(1);
}

const stripe = new Stripe(STRIPE_SECRET_KEY);
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const { data: orders, error } = await supabase
  .from('orders')
  .select('id, total, created_at, customer_name, customer_email, customer_phone, pickup_time, stripe_payment_intent_id, stripe_payment_status')
  .eq('status', 'awaiting_payment')
  .order('created_at', { ascending: true });

if (error) {
  console.error('Kon orders niet ophalen:', error.message);
  process.exit(1);
}

console.log(`${orders.length} order(s) met status 'awaiting_payment'.`);
console.log(APPLY ? 'Modus: HERSTELLEN (--apply)\n' : 'Modus: alleen rapporteren\n');

const buckets = { paid: [], unpaid: [], missing_pi: [], error: [] };

for (const order of orders) {
  if (!order.stripe_payment_intent_id) {
    buckets.missing_pi.push({ ...order, piStatus: 'geen payment intent' });
    continue;
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(order.stripe_payment_intent_id);
    const row = { ...order, piStatus: pi.status, amountReceived: (pi.amount_received ?? 0) / 100 };

    if (pi.status === 'succeeded') {
      buckets.paid.push(row);

      if (APPLY) {
        // Contactgegevens alleen aanvullen waar ze leeg zijn; wat er al staat
        // is betrouwbaarder dan de metadata.
        const update = {
          status: 'pending',
          stripe_payment_status: 'succeeded',
          stripe_amount_received: pi.amount_received,
          updated_at: new Date().toISOString(),
          notes: 'Handmatig gereconcilieerd met Stripe (betaling was al ontvangen).',
        };
        const meta = pi.metadata ?? {};
        if (!order.customer_name && meta.customer_name) update.customer_name = meta.customer_name;
        if (!order.customer_email && meta.customer_email) update.customer_email = meta.customer_email;
        if (!order.customer_phone && meta.customer_phone) update.customer_phone = meta.customer_phone;
        if (!order.pickup_time && meta.pickup_time) update.pickup_time = meta.pickup_time;

        const { error: updateError } = await supabase
          .from('orders')
          .update(update)
          .eq('id', order.id)
          .eq('status', 'awaiting_payment');

        if (updateError) {
          console.error(`  ! Herstellen mislukt voor ${order.id}: ${updateError.message}`);
        }
      }
    } else {
      buckets.unpaid.push(row);
    }
  } catch (err) {
    buckets.error.push({ ...order, piStatus: `fout: ${err.message}` });
  }
}

function report(title, rows) {
  if (!rows.length) return;
  console.log(`\n=== ${title} (${rows.length}) ===`);
  for (const r of rows) {
    const paid = r.amountReceived != null ? ` ontvangen EUR ${r.amountReceived.toFixed(2)}` : '';
    console.log(
      `${r.created_at.slice(0, 16).replace('T', ' ')}  ${r.id}  EUR ${Number(r.total).toFixed(2)}` +
        `  [${r.piStatus}]${paid}  ${r.customer_email || '(geen e-mail)'}`
    );
  }
}

report('BETAALD — hoorden in het dashboard te staan', buckets.paid);
report('Niet betaald — afgebroken checkouts, kunnen blijven staan', buckets.unpaid);
report('Geen payment intent', buckets.missing_pi);
report('Niet te controleren', buckets.error);

const totalPaid = buckets.paid.reduce((sum, r) => sum + (r.amountReceived ?? 0), 0);

console.log('\n--- Samenvatting ---');
console.log(`Betaald maar onzichtbaar : ${buckets.paid.length} order(s), EUR ${totalPaid.toFixed(2)}`);
console.log(`Afgebroken checkouts     : ${buckets.unpaid.length}`);
console.log(`Zonder payment intent    : ${buckets.missing_pi.length}`);
console.log(`Fouten                   : ${buckets.error.length}`);

if (!APPLY && buckets.paid.length) {
  console.log('\nDraai opnieuw met --apply om deze betaalde orders in het dashboard te zetten.');
}
