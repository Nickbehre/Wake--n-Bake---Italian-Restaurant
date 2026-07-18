"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { useLanguage } from "@/lib/context/LanguageContext";
import { CheckCircle2, MapPin, CalendarClock } from "lucide-react";
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

export default function OrderSuccessPage() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { clearCart, items, totals, pickupTime, customerDetails } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [orderData, setOrderData] = useState<OrderSnapshot | null>(null);

  // GA4 purchase-event vanuit een order-snapshot. Dubbel vuren kan niet:
  // het snapshot wordt direct na lezen verwijderd en de cart geleegd.
  const trackPurchaseFromSnapshot = (snapshot: OrderSnapshot) => {
    try {
      trackPurchase(
        (snapshot.items || []).map((i: any) => ({
          item_id: i.productId || i.id,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        snapshot.totals?.total ?? 0,
        `wnb-stripe-${snapshot.customerDetails?.email || 'guest'}-${snapshot.totals?.total ?? 0}-${snapshot.pickupTime || ''}`
      );
    } catch (e) {
      console.error("Purchase tracking failed:", e);
    }
  };

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Try to read order data from the dedicated localStorage snapshot first
    // (more reliable than zustand after Stripe full-page redirects)
    const savedOrder = localStorage.getItem('wnb-last-order');
    if (savedOrder) {
      try {
        const parsed = JSON.parse(savedOrder) as OrderSnapshot;
        setOrderData(parsed);
        trackPurchaseFromSnapshot(parsed);

        // Send confirmation email
        if (parsed.customerDetails?.email) {
          const isTimeOnly = parsed.pickupTime && /^\d{2}:\d{2}$/.test(parsed.pickupTime);
          const pickupFormatted = parsed.pickupTime
            ? (isTimeOnly
              ? `${format(new Date(), "EEEE d MMMM", { locale: nl })} om ${parsed.pickupTime}`
              : format(new Date(parsed.pickupTime), "EEEE d MMMM 'om' HH:mm", { locale: nl }))
            : "Onbekend";
          fetch("/api/send-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: parsed.customerDetails.email,
              orderDetails: parsed,
              pickupTimeFormatted: pickupFormatted,
            })
          }).catch(err => console.error("Email send failed:", err));
        }

        // Clean up
        localStorage.removeItem('wnb-last-order');
        clearCart();
        return;
      } catch (e) {
        console.error("Failed to parse saved order:", e);
      }
    }

    // Fallback: read from zustand cart store
    if (items.length > 0) {
      const pt = typeof pickupTime === 'string' ? pickupTime : pickupTime instanceof Date ? pickupTime.toISOString() : null;
      setOrderData({
        items,
        totals,
        pickupTime: pt,
        customerDetails: customerDetails,
      });
      trackPurchaseFromSnapshot({ items, totals, pickupTime: pt, customerDetails });

      if (customerDetails?.email) {
        const isTimeOnlyFb = pt && /^\d{2}:\d{2}$/.test(pt);
        const pickupFormatted = pt
          ? (isTimeOnlyFb
            ? `${format(new Date(), "EEEE d MMMM", { locale: nl })} om ${pt}`
            : format(new Date(pt), "EEEE d MMMM 'om' HH:mm", { locale: nl }))
          : "Onbekend";
        fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: customerDetails.email,
            orderDetails: { items, totals, pickupTime: pt, customerDetails },
            pickupTimeFormatted: pickupFormatted,
          })
        }).catch(err => console.error("Email send failed:", err));
      }

      clearCart();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  const dateLocale = language === 'nl' ? nl : enUS;
  const pickupTimeStr = orderData?.pickupTime;
  const isTimeOnlyDisplay = pickupTimeStr && /^\d{2}:\d{2}$/.test(pickupTimeStr);
  const formattedPickup = pickupTimeStr
    ? (isTimeOnlyDisplay
      ? `${format(new Date(), "EEEE d MMMM", { locale: dateLocale })} om ${pickupTimeStr}`
      : format(new Date(pickupTimeStr), "EEEE d MMMM 'om' HH:mm", { locale: dateLocale }))
    : null;

  return (
    <main className="min-h-screen bg-flour relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
      {mounted && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={500} gravity={0.15} />}

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
