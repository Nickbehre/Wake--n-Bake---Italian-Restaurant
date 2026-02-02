"use client";

import { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import { useCartStore } from "@/lib/store/cart-store";
import { Loader2, ShoppingBag, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

// Ensure string is defined, otherwise throw safe error or fallback
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function CheckoutPage() {
  const { totals, items } = useCartStore();
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Prevent creating intent if empty cart (handled in component UI too, but safer here)
    if (items.length === 0 || totals.total <= 0) return;

    setIsLoading(true);
    setError(null);

    // Create PaymentIntent as soon as the page loads
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        } else {
          console.error("No client secret returned", data);
          setError(data.error || "Er ging iets mis bij het voorbereiden van de betaling.");
        }
      })
      .catch((err) => {
        console.error("Error creating payment intent:", err);
        setError("Kon geen verbinding maken met de betaalservice. Probeer het later opnieuw.");
      })
      .finally(() => setIsLoading(false));
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
    <main className="min-h-screen bg-flour pt-28 pb-12">
      <div className="container mx-auto px-4">
        {/* Back to menu link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-espresso hover:text-tomato transition-colors mb-6 font-lato"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Terug naar menu</span>
        </Link>

        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="font-stamp text-5xl md:text-6xl text-tomato mb-3">Checkout</h1>
          <p className="font-oswald text-espresso tracking-widest uppercase text-sm">Click & Collect</p>
        </header>

        {/* Empty cart state */}
        {items.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="font-oswald text-2xl text-espresso mb-3">Je winkelmandje is leeg</h2>
            <p className="text-gray-500 mb-6 font-lato px-4">Ga terug naar het menu om lekkere dingen toe te voegen.</p>
            <Link
              href="/menu"
              className="inline-block bg-tomato text-white px-8 py-3 hover:bg-red-700 transition font-oswald uppercase tracking-wider"
            >
              Naar Menu
            </Link>
          </div>
        ) : error ? (
          /* Error state */
          <div className="text-center py-16 bg-white rounded-lg shadow-sm max-w-md mx-auto">
            <AlertCircle className="w-16 h-16 text-tomato mx-auto mb-4" />
            <h2 className="font-oswald text-2xl text-espresso mb-3">Er ging iets mis</h2>
            <p className="text-gray-500 mb-6 font-lato px-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-block bg-tomato text-white px-8 py-3 hover:bg-red-700 transition font-oswald uppercase tracking-wider"
            >
              Probeer opnieuw
            </button>
          </div>
        ) : isLoading || !clientSecret ? (
          /* Loading state */
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-tomato mb-4" />
            <p className="font-lato text-gray-500">Betaling voorbereiden...</p>
          </div>
        ) : (
          /* Checkout form */
          <Elements options={options} stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>
    </main>
  );
}
