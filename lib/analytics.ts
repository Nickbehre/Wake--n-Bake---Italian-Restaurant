// ============================================
// GA4 E-COMMERCE TRACKING
// Alle helpers zijn veilige no-ops zolang gtag
// niet geladen is (geen consent of geen GA-ID).
// ============================================

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// CookieBanner dispatcht dit event zodat GA direct
// na 'Accepteren' laadt, zonder page reload.
export const CONSENT_CHANGED_EVENT = 'wnb-consent-changed';

export interface AnalyticsItem {
  item_id: string;
  item_name: string;
  price: number;
  quantity: number;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Events die vóór het laden van gtag.js afgevuurd worden (bv. purchase
// direct na de Stripe-redirect) worden gebufferd en geflusht zodra
// GoogleAnalytics geïnitialiseerd is. Zonder buffer gaan die verloren.
const pendingEvents: Array<[string, Record<string, unknown>]> = [];
const MAX_PENDING = 20;

function gtagEvent(name: string, params: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  if (window.gtag) {
    window.gtag('event', name, params);
  } else if (pendingEvents.length < MAX_PENDING) {
    pendingEvents.push([name, params]);
  }
}

export function flushPendingEvents() {
  if (typeof window === 'undefined' || !window.gtag) return;
  while (pendingEvents.length > 0) {
    const [name, params] = pendingEvents.shift()!;
    window.gtag('event', name, params);
  }
}

export function trackAddToCart(item: AnalyticsItem) {
  gtagEvent('add_to_cart', {
    currency: 'EUR',
    value: item.price * item.quantity,
    items: [item],
  });
}

export function trackBeginCheckout(items: AnalyticsItem[], value: number) {
  gtagEvent('begin_checkout', {
    currency: 'EUR',
    value,
    items,
  });
}

export function trackPurchase(
  items: AnalyticsItem[],
  value: number,
  transactionId: string
) {
  gtagEvent('purchase', {
    currency: 'EUR',
    value,
    transaction_id: transactionId,
    items,
  });
}
