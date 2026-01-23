"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useCartStore } from "@/lib/store/cart-store";
import { Loader2 } from "lucide-react";

// Ensure string is defined, otherwise throw safe error or fallback
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { totals, items } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    // Prevent creating intent if empty cart (handled in component UI too, but safer here)
    if (items.length === 0 || totals.total <= 0) return;

    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        // We actually only need items to calc on server, but we send them here
        // The server SHOULD recalculate prices.
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret returned", data);
        }
      })
      .catch((err) => console.error("Error creating payment intent:", err));
  }, [items, totals.total]);

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#CE2029',
      colorBackground: '#ffffff',
      colorText: '#2C2C2C',
      colorDanger: '#df1b41',
      fontFamily: 'Lato, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '4px',
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <main className="min-h-screen bg-flour pt-32 pb-12">
      <div className="container mx-auto">
        <header className="text-center mb-10">
          <h1 className="font-comodo text-5xl text-tomato mb-2">Checkout</h1>
          <p className="font-oswald text-espresso tracking-widest uppercase text-sm">Click & Collect</p>
        </header>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="font-oswald text-3xl text-espresso mb-4">Je winkelmandje is leeg</h2>
            <p className="text-gray-600 mb-8 font-lato">Ga terug naar het menu om lekkere dingen toe te voegen.</p>
            <button
              onClick={() => window.location.href = "/menu"}
              className="bg-tomato text-white px-8 py-3 rounded hover:bg-red-700 transition font-oswald uppercase bold tracking-wider"
            >
              Naar Menu
            </button>
          </div>
        ) : items.length > 0 && !clientSecret ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-tomato mb-4" />
            <p className="font-lato text-gray-500">Betaling voorbereiden...</p>
          </div>
        ) : (
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </main>
  );
}
