"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useLanguage } from "@/lib/context/LanguageContext";
import { CheckCircle2, MapPin, CalendarClock, Loader2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { nl, enUS } from "date-fns/locale";
import Confetti from "react-confetti";
import { trackPurchase } from "@/lib/analytics";

interface OrderSnapshot {
  items: any[];
  totals: any;
  pickupTime: string | null;
  customerDetails: { name: string; email: string; phone: string } | null;
}

type PaymentState = "verifying" | "paid" | "unpaid" | "pay_at_pickup";

/**
 * Deze pagina toont uitsluitend een geslaagde bestelling als de server
 * bevestigt dat Stripe de betaling heeft ontvangen.
 *
 * Eerder stuurde deze pagina zelf de bevestigings- én winkelmail, puur op basis
 * van een localStorage-snapshot. Daardoor kreeg de winkel een "NIEUWE
 * BESTELLING"-mail zodra iemand op /order-success kwam, ook bij een afgebroken
 * of mislukte betaling. Mailen gebeurt nu server-side in /api/confirm-order
 * (en in de Stripe-webhook), pas ná verificatie van de betaling.
 */
export default function OrderSuccessPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { clearCart, items, totals, pickupTime, customerDetails } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [orderData, setOrderData] = useState<OrderSnapshot | null>(null);
  const [paymentState, setPaymentState] = useState<PaymentState>("verifying");
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Snapshot is alleen voor de weergave (items/ophaaltijd), nooit het bewijs
    // dat er betaald is.
    let snapshot: OrderSnapshot | null = null;
    const savedOrder = localStorage.getItem("wnb-last-order");
    if (savedOrder) {
      try {
        snapshot = JSON.parse(savedOrder) as OrderSnapshot;
      } catch (e) {
        console.error("Failed to parse saved order:", e);
      }
    }
    if (!snapshot && items.length > 0) {
      const pt =
        typeof pickupTime === "string"
          ? pickupTime
          : pickupTime instanceof Date
            ? pickupTime.toISOString()
            : null;
      snapshot = { items, totals, pickupTime: pt, customerDetails };
    }
    setOrderData(snapshot);

    // Stripe hangt deze parameters aan de return_url.
    const params = new URLSearchParams(window.location.search);
    const paymentIntentId = params.get("payment_intent");
    const piClientSecret = params.get("payment_intent_client_secret");
    const placedOrderId = params.get("order");

    let cancelled = false;

    // Betalen-bij-ophalen (Click & Collect): er is geen Stripe-betaling, maar de
    // order bestaat wel al in de database. Verifieer dat bij de server.
    if (!paymentIntentId && placedOrderId) {
      (async () => {
        try {
          const res = await fetch(`/api/order?id=${encodeURIComponent(placedOrderId)}`);
          const data = await res.json();
          if (cancelled) return;
          if (res.ok && data.success) {
            setPaymentState("pay_at_pickup");
            setOrderId(data.order?.id ?? placedOrderId);
            localStorage.removeItem("wnb-last-order");
            clearCart();
          } else {
            setPaymentState("unpaid");
          }
        } catch (err) {
          if (cancelled) return;
          console.error("Kon de bestelling niet verifiëren:", err);
          setPaymentState("unpaid");
        }
      })();

      return () => {
        cancelled = true;
      };
    }

    if (!paymentIntentId || !piClientSecret) {
      // Rechtstreeks op deze pagina beland zonder betaling of bestelling.
      setPaymentState("unpaid");
      return;
    }

    (async () => {
      try {
        const res = await fetch("/api/confirm-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId,
            clientSecret: piClientSecret,
          }),
        });
        const data = await res.json();
        if (cancelled) return;

        if (res.ok && data.paid) {
          setPaymentState("paid");
          setOrderId(data.orderId ?? null);

          // Pas bij een bevestigde betaling de cart leegmaken, het snapshot
          // opruimen en de GA4-aankoop vuren.
          localStorage.removeItem("wnb-last-order");
          clearCart();

          if (snapshot) {
            try {
              trackPurchase(
                (snapshot.items || []).map((i: any) => ({
                  item_id: i.productId || i.id,
                  item_name: i.name,
                  price: i.price,
                  quantity: i.quantity,
                })),
                data.amountPaid ?? snapshot.totals?.total ?? 0,
                data.orderId ?? paymentIntentId
              );
            } catch (e) {
              console.error("Purchase tracking failed:", e);
            }
          }
        } else {
          setPaymentState("unpaid");
          setOrderId(data.orderId ?? null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("Kon de betaling niet verifiëren:", err);
        setPaymentState("unpaid");
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const dateLocale = language === "nl" ? nl : enUS;
  const pickupTimeStr = orderData?.pickupTime;
  const isTimeOnlyDisplay = pickupTimeStr && /^\d{2}:\d{2}$/.test(pickupTimeStr);
  const formattedPickup = pickupTimeStr
    ? isTimeOnlyDisplay
      ? `${format(new Date(), "EEEE d MMMM", { locale: dateLocale })} om ${pickupTimeStr}`
      : format(new Date(pickupTimeStr), "EEEE d MMMM 'om' HH:mm", { locale: dateLocale })
    : null;

  if (paymentState === "verifying") {
    return (
      <main className="min-h-screen bg-flour flex flex-col items-center justify-center text-center p-4">
        <Loader2 className="w-12 h-12 text-tomato animate-spin mb-6" />
        <p className="font-oswald text-xl uppercase tracking-wide text-espresso">
          {t("success.verifying")}
        </p>
      </main>
    );
  }

  if (paymentState === "unpaid") {
    return (
      <main className="min-h-screen bg-flour flex flex-col items-center justify-center text-center p-4">
        <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <AlertTriangle className="w-20 h-20 text-crust" />
          </div>

          <h1 className="font-stamp text-4xl md:text-5xl text-espresso mb-4">
            {t("success.notPaidTitle")}
          </h1>
          <p className="font-oswald text-lg text-espresso uppercase tracking-wide mb-6">
            {t("success.notPaidSubtitle")}
          </p>
          <p className="font-lato text-gray-600 mb-8">{t("success.notPaidBody")}</p>

          {orderId && (
            <p className="font-lato text-gray-400 text-sm mb-8">
              {t("success.orderNumber")}: <span className="font-mono">{orderId}</span>
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/checkout")}
              className="bg-tomato text-white px-8 py-3 rounded-full font-oswald uppercase hover:bg-red-700 transition"
            >
              {t("success.retryPayment")}
            </button>
            <button
              onClick={() => router.push("/")}
              className="bg-espresso text-white px-8 py-3 rounded-full font-oswald uppercase hover:bg-black transition"
            >
              {t("success.backHome")}
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-flour relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
      <Confetti
        width={dimensions.width}
        height={dimensions.height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.15}
      />

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 z-10">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-pistachio" />
        </div>

        <h1 className="font-stamp text-5xl text-tomato mb-4">{t('success.title')}</h1>
        <p className="font-oswald text-xl text-espresso uppercase tracking-wide mb-8">
          {t('success.subtitle')}
        </p>

        <div className="bg-gray-50 p-6 rounded border border-gray-100 mb-8 text-left">
          <h3 className="font-oswald text-lg text-espresso mb-4 border-b pb-2">{t('success.pickupDetails')}</h3>

          <div className="grid gap-4">
            {orderId && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-pistachio mt-0.5" />
                <div>
                  <p className="font-bold text-espresso uppercase text-sm">{t('success.orderNumber')}</p>
                  <p className="font-mono text-gray-700">{orderId}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <CalendarClock className="w-5 h-5 text-tomato mt-0.5" />
              <div>
                <p className="font-bold text-espresso uppercase text-sm">{t('success.time')}</p>
                <p className="font-lato text-gray-700 text-lg">
                  {formattedPickup || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-tomato mt-0.5" />
              <div>
                <p className="font-bold text-espresso uppercase text-sm">{t('success.location')}</p>
                <p className="font-lato text-gray-700">
                  Wake n Bake<br />
                  Vijzelstraat 93H<br />
                  1017 HH Amsterdam
                </p>
              </div>
            </div>
          </div>
        </div>

        {paymentState === "pay_at_pickup" && (
          <p className="font-lato text-espresso bg-mortadella/20 rounded p-4 mb-8">
            {t('success.payAtPickupNote')}
          </p>
        )}

        {orderData?.customerDetails?.email && (
          <p className="font-lato text-gray-600 mb-8">
            {t('success.emailSent')} <strong>{orderData.customerDetails.email}</strong>.<br />
            {t('success.showAtStore')}
          </p>
        )}

        <button
          onClick={() => router.push("/")}
          className="bg-espresso text-white px-8 py-3 rounded-full font-oswald uppercase hover:bg-black transition"
        >
          {t('success.backHome')}
        </button>
      </div>
    </main>
  );
}
