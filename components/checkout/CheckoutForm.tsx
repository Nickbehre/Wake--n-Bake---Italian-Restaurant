"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { nl } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, CheckCircle2, ShoppingBag, Clock, MapPin } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { generateAvailableTimeSlots, TimeSlot } from "@/lib/utils/time-slots";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Zod Schema
const checkoutSchema = z.object({
    name: z.string().min(2, "Naam is verplicht"),
    email: z.string().email("Ongeldig e-mailadres"),
    phone: z.string().min(10, "Ongeldig telefoonnummer"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const { items, totals, pickupTime, setPickupTime, customerDetails, setCustomerDetails, clearCart } = useCartStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);

    // Form setup
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        trigger,
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            name: customerDetails?.name || "",
            email: customerDetails?.email || "",
            phone: customerDetails?.phone || "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        // Generate slots on client side to ensure 'now' is accurate
        setAvailableSlots(generateAvailableTimeSlots());
    }, []);

    const onSubmit = async (data: CheckoutFormData) => {
        if (!pickupTime) {
            toast.error("Selecteer a.u.b. een ophaaltijd.");
            return;
        }

        if (!stripe || !elements) {
            return;
        }

        setIsProcessing(true);
        setErrorMessage(null);
        setCustomerDetails(data); // Save details for later re-use if they come back

        try {
            // 1. Trigger Payment
            const { error: submitError } = await elements.submit();
            if (submitError) {
                throw submitError;
            }

            // 2. Confirm Payment
            // We expect the clientSecret to be passed from the parent page/provider
            // But actually, usually specific creation happens earlier OR we can't do confirmPayment 
            // without a clientSecret known to the Elements provider.
            // Wait: The Layout/Page usually creates the Intent. 
            // If we are using `elements.submit()`, we are likely using the newer Payment Element flow 
            // where we confirm with the clientSecret we got from the server.

            // However, usually we confirm against the intent that was created when the page loaded.
            // Let's assume the parent component handles the creation and passes clientSecret implicitly via Elements context,
            // OR we need to fetch a *new* intent here if the amount changed? 
            // For simplicity, let's assume the Intent was created for the correct amount on page load in the parent.

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-success`,
                    payment_method_data: {
                        billing_details: {
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                        },
                    },
                },
            });

            if (error) {
                // This point will only be reached if there is an immediate error when
                // confirming the payment. Show error to your customer (e.g., payment
                // details incomplete)
                setErrorMessage(error.message ?? "Er ging iets mis met de betaling.");
                toast.error("Betaling mislukt. Probeer het opnieuw.");
            } else {
                // Your customer will be redirected to your `return_url`. For some payment
                // methods like iDEAL, your customer will be redirected to an intermediate
                // site first to authorize the payment, then redirected to the `return_url`.
            }
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || "Er is een onverwachte fout opgetreden.");
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="font-oswald text-3xl text-espresso mb-4">Je winkelmandje is leeg</h2>
                <p className="text-gray-600 mb-8 font-lato">Ga terug naar het menu om lekkere dingen toe te voegen.</p>
                <button
                    onClick={() => router.push("/menu")}
                    className="bg-tomato text-white px-8 py-3 rounded hover:bg-red-700 transition font-oswald uppercase bold tracking-wider"
                >
                    Naar Menu
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4 py-8">
            {/* LEFT COLUMN: DETAILS & TIME */}
            <div className="space-y-12">
                {/* Section 1: Details */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">1</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">Jouw Gegevens</h2>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">Naam</label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                placeholder="Hoe mogen we je noemen?"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">Email (voor bon)</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                placeholder="naam@voorbeeld.nl"
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">Telefoonnummer</label>
                            <input
                                {...register("phone")}
                                type="tel"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                placeholder="06 12345678"
                            />
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>
                </section>

                {/* Section 2: Time Slot */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">2</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">Kies je ophaaltijd</h2>
                    </div>

                    <p className="text-gray-600 mb-4 font-lato text-sm italic">
                        <Clock className="inline w-4 h-4 mr-1 text-crust" />
                        Winkel open: 10:00 - 18:00. Minimaal 30 min bereidingstijd.
                    </p>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
                        {availableSlots.length === 0 ? (
                            <div className="col-span-full py-4 text-center text-gray-500 italic">
                                Helaas, er zijn vandaag geen ophaalmomenten meer beschikbaar.
                            </div>
                        ) : (
                            availableSlots.map((slot, idx) => {
                                const isSelected = pickupTime?.getTime() === slot.date.getTime();
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={!slot.available}
                                        onClick={() => setPickupTime(slot.date)}
                                        className={cn(
                                            "py-2 px-1 text-sm font-oswald rounded border transition-all duration-200",
                                            slot.available
                                                ? "hover:border-crust cursor-pointer"
                                                : "opacity-30 cursor-not-allowed bg-gray-100 border-transparent",
                                            isSelected
                                                ? "bg-crust text-white border-crust shadow-md scale-105"
                                                : "bg-white border-gray-200 text-gray-700"
                                        )}
                                    >
                                        {slot.label}
                                    </button>
                                )
                            })
                        )}
                    </div>
                    {!pickupTime && <p className="text-yellow-600 text-xs mt-2 font-medium">Selecteer een tijdstip om verder te gaan.</p>}
                </section>
            </div>

            {/* RIGHT COLUMN: SUMMARY & PAYMENT */}
            <div className="lg:pl-8 lg:border-l border-gray-200 space-y-8">

                {/* Order Summary */}
                <section className="bg-flour p-6 rounded-lg border border-stone-200">
                    <h3 className="font-oswald text-xl uppercase mb-4 text-espresso border-b border-stone-300 pb-2">Jouw Bestelling</h3>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start font-lato text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold text-tomato">{item.quantity}x</span>
                                    <span className="text-espresso">{item.name}</span>
                                </div>
                                <span className="text-gray-600">€{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-300 pt-3 space-y-1 font-lato">
                        <div className="flex justify-between text-gray-600 text-sm">
                            <span>Subtotaal</span>
                            <span>€{totals.subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs">
                            <span>BTW (9%)</span>
                            <span>€{totals.tax.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-oswald text-xl text-espresso mt-2 pt-2 border-t border-stone-200">
                            <span>Totaal</span>
                            <span>€{totals.total.toFixed(2)}</span>
                        </div>
                    </div>
                </section>

                {/* Payment */}
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">3</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">Afrekenen</h2>
                    </div>

                    <div className="bg-white p-5 rounded border border-gray-200 shadow-sm mb-6">
                        <PaymentElement options={{
                            layout: "tabs",
                            business: { name: "Wake n Bake" }
                        }} />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100 flex items-center gap-2">
                            <span className="font-bold">Let op:</span> {errorMessage}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!stripe || !elements || !pickupTime || isProcessing}
                        className={cn(
                            "w-full py-4 rounded font-oswald uppercase text-lg tracking-wider text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2",
                            (!stripe || !elements || !pickupTime || isProcessing)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-tomato hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
                        )}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> Verwerken...
                            </>
                        ) : (
                            <>Betaal & Bestel</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1 font-lato">
                        <CheckCircle2 className="w-3 h-3" /> Veilig betalen via Stripe
                    </p>
                </section>

            </div>
        </div>
    );
}
