"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart-store";
import { CheckCircle2, MapPin, CalendarClock } from "lucide-react";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import Confetti from "react-confetti";

export default function OrderSuccessPage() {
  const router = useRouter();
  const { clearCart, items, totals, pickupTime, customerDetails } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const [lastOrderDetails, setLastOrderDetails] = useState<{
    items: typeof items,
    totals: typeof totals,
    pickupTime: Date | null,
    customerDetails: typeof customerDetails
  } | null>(null);

  useEffect(() => {
    setMounted(true);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    if (items.length > 0) {
      setLastOrderDetails({ items, totals, pickupTime, customerDetails });

      // Trigger Email Sending
      fetch("/api/send-email", {
        method: "POST",
        body: JSON.stringify({
          email: customerDetails?.email,
          orderDetails: { items, totals, pickupTime, customerDetails },
          pickupTime,
        })
      }).catch(err => console.error(err));

      clearCart();
    }
  }, []);

  if (!mounted) return null;

  const displayPickup = lastOrderDetails?.pickupTime;

  return (
    <main className="min-h-screen bg-flour relative overflow-hidden flex flex-col items-center justify-center text-center p-4">
      {mounted && <Confetti width={dimensions.width} height={dimensions.height} recycle={false} numberOfPieces={500} gravity={0.15} />}

      <div className="bg-white p-8 md:p-12 rounded-lg shadow-xl max-w-2xl w-full border border-gray-200 z-10">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-pistachio" />
        </div>

        <h1 className="font-comodo text-5xl text-tomato mb-4">Grazie Mille!</h1>
        <p className="font-oswald text-xl text-espresso uppercase tracking-wide mb-8">
          Je bestelling is geslaagd.
        </p>

        <div className="bg-gray-50 p-6 rounded border border-gray-100 mb-8 text-left">
          <h3 className="font-oswald text-lg text-espresso mb-4 border-b pb-2">Ophaal Details</h3>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <CalendarClock className="w-5 h-5 text-tomato mt-0.5" />
              <div>
                <p className="font-bold text-espresso uppercase text-sm">Tijdstip</p>
                <p className="font-lato text-gray-700 text-lg">
                  {displayPickup ? format(new Date(displayPickup), "EEEE d MMMM 'om' HH:mm", { locale: nl }) : "Tijdstip..."}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-tomato mt-0.5" />
              <div>
                <p className="font-bold text-espresso uppercase text-sm">Locatie</p>
                <p className="font-lato text-gray-700">
                  Wake n Bake<br />
                  Vijzelstraat 93H<br />
                  1017 HH Amsterdam
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="font-lato text-gray-600 mb-8">
          We hebben een bevestiging gestuurd naar <strong>{lastOrderDetails?.customerDetails?.email}</strong>.<br />
          Laat deze zien in de winkel bij het afhalen.
        </p>

        <button
          onClick={() => router.push("/")}
          className="bg-espresso text-white px-8 py-3 rounded font-oswald uppercase hover:bg-black transition"
        >
          Terug naar Home
        </button>
      </div>
    </main>
  );
}
