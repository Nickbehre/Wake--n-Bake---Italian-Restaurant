"use client";

import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { useCartStore } from "@/lib/store/cart-store";
import { useLanguage } from "@/lib/context/LanguageContext";
import type { TimeSlot } from "@/lib/utils/time-slots";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const COUNTRY_CODES = [
    { code: '+31', flag: '🇳🇱', label: 'NL' },
    { code: '+39', flag: '🇮🇹', label: 'IT' },
    { code: '+49', flag: '🇩🇪', label: 'DE' },
    { code: '+32', flag: '🇧🇪', label: 'BE' },
    { code: '+44', flag: '🇬🇧', label: 'UK' },
    { code: '+33', flag: '🇫🇷', label: 'FR' },
    { code: '+1', flag: '🇺🇸', label: 'US' },
    { code: '+34', flag: '🇪🇸', label: 'ES' },
];

const checkoutSchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    phone: z.string().optional().or(z.literal('')),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutForm({ orderId }: { orderId?: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const { t } = useLanguage();

    const { items, totals, pickupTime, setPickupTime, customerDetails, setCustomerDetails } = useCartStore();

    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [storePaused, setStorePaused] = useState(false);
    const [pauseMessage, setPauseMessage] = useState('');
    const [countryCode, setCountryCode] = useState('+31');

    const {
        register,
        handleSubmit,
        formState: { errors },
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
        async function fetchSlots() {
            try {
                const res = await fetch('/api/time-slots');
                const data = await res.json();

                if (data.paused) {
                    setStorePaused(true);
                    setPauseMessage(data.message || '');
                    setAvailableSlots([]);
                    setPickupTime(null as any);
                    return;
                }

                const slots: TimeSlot[] = (data.slots || [])
                    .filter((s: any) => s.available)
                    .map((s: any) => ({
                        date: new Date(s.date),
                        label: s.time,
                        available: true,
                    }));

                setAvailableSlots(slots);

                if (slots.length === 0) {
                    setPickupTime(null as any);
                } else if (pickupTime) {
                    const isStillValid = slots.some(slot => slot.label === pickupTime);
                    if (!isStillValid) {
                        setPickupTime(null as any);
                    }
                }
            } catch {
                // Fallback: generate slots locally
                const { generateAvailableTimeSlots } = await import('@/lib/utils/time-slots');
                setAvailableSlots(generateAvailableTimeSlots());
            }
        }
        fetchSlots();
    }, []);

    const noSlotsAvailable = availableSlots.length === 0;

    const onSubmit = async (data: CheckoutFormData) => {
        if (!pickupTime || noSlotsAvailable) {
            toast.error(t('checkout.selectPickupError'));
            return;
        }

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);
        const fullPhone = data.phone ? (data.phone.startsWith('+') ? data.phone : `${countryCode}${data.phone.replace(/^0+/, '')}`) : '';
        setCustomerDetails({ ...data, phone: fullPhone });

        // Save order snapshot to localStorage before Stripe redirect
        // (zustand persist may not survive full-page redirects reliably)
        const orderSnapshot = {
            items,
            totals,
            pickupTime: typeof pickupTime === 'string' ? pickupTime : pickupTime instanceof Date ? pickupTime.toISOString() : null,
            customerDetails: { ...data, phone: fullPhone },
        };
        localStorage.setItem('wnb-last-order', JSON.stringify(orderSnapshot));

        try {
            // Update order in DB with customer details and pickup time
            if (orderId) {
                const pickupTimeStr = typeof pickupTime === 'string'
                    ? pickupTime
                    : pickupTime instanceof Date
                        ? pickupTime.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
                        : '';
                await fetch('/api/update-order', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId,
                        customer: { name: data.name, email: data.email, phone: fullPhone },
                        pickupTime: pickupTimeStr,
                    }),
                });
            }

            const { error: submitError } = await elements.submit();
            if (submitError) throw submitError;

            const { error } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/order-success`,
                    payment_method_data: {
                        billing_details: {
                            name: data.name,
                            email: data.email,
                            phone: fullPhone,
                        },
                    },
                },
            });

            if (error) {
                setErrorMessage(error.message ?? t('checkout.paymentError'));
                toast.error(t('checkout.paymentFailed'));
            }
        } catch (err: any) {
            console.error(err);
            setErrorMessage(err.message || t('checkout.unexpectedError'));
        } finally {
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="font-oswald text-3xl text-espresso mb-4">{t('cart.empty')}</h2>
                <p className="text-gray-600 mb-8 font-lato">{t('cart.emptySubtext')}</p>
                <a
                    href="/menu"
                    className="bg-tomato text-white px-8 py-3 rounded-full hover:bg-red-700 transition font-oswald uppercase bold tracking-wider"
                >
                    {t('checkout.backToMenu')}
                </a>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto px-4 py-8">
            {/* LEFT: Details & Time */}
            <div className="space-y-12">
                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">1</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">{t('checkout.step1')}</h2>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">{t('checkout.nameLabel')}</label>
                            <input
                                {...register("name")}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                placeholder={t('checkout.namePlaceholder')}
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">{t('checkout.emailLabel')}</label>
                            <input
                                {...register("email")}
                                type="email"
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                placeholder={t('checkout.emailPlaceholder')}
                            />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div>
                            <label className="block font-oswald uppercase text-xs text-gray-500 mb-1 tracking-wider">{t('checkout.phoneLabel')}</label>
                            <div className="flex">
                                <div className="relative">
                                    <select
                                        value={countryCode}
                                        onChange={(e) => setCountryCode(e.target.value)}
                                        className="appearance-none h-full px-3 py-3 pr-7 bg-white border border-r-0 border-gray-300 rounded-l focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato text-sm cursor-pointer"
                                    >
                                        {COUNTRY_CODES.map((c) => (
                                            <option key={c.code} value={c.code}>
                                                {c.flag} {c.code}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                                </div>
                                <input
                                    {...register("phone")}
                                    type="tel"
                                    className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-r focus:border-tomato focus:ring-1 focus:ring-tomato outline-none transition font-lato"
                                    placeholder={t('checkout.phonePlaceholder')}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                        </div>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">2</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">{t('checkout.step2')}</h2>
                    </div>

                    {storePaused ? (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 font-lato text-sm">
                            <strong>De winkel accepteert momenteel geen bestellingen.</strong>
                            {pauseMessage && <p className="mt-1">{pauseMessage}</p>}
                        </div>
                    ) : (
                    <>
                    <p className="text-gray-600 mb-4 font-lato text-sm italic">
                        <Clock className="inline w-4 h-4 mr-1 text-crust" />
                        {t('checkout.pickupInfo')}
                    </p>

                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-60 overflow-y-auto p-1">
                        {availableSlots.length === 0 ? (
                            <div className="col-span-full py-4 text-center text-gray-500 italic">
                                {t('checkout.noSlots')}
                            </div>
                        ) : (
                            availableSlots.map((slot, idx) => {
                                const isSelected = pickupTime === slot.label;
                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setPickupTime(slot.label)}
                                        className={cn(
                                            "py-2 px-1 text-sm font-oswald rounded border transition-all duration-200 hover:border-crust cursor-pointer",
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
                    {!pickupTime && <p className="text-yellow-600 text-xs mt-2 font-medium">{t('checkout.selectTime')}</p>}
                    </>
                    )}
                </section>
            </div>

            {/* RIGHT: Summary & Payment */}
            <div className="lg:pl-8 lg:border-l border-gray-200 space-y-8">
                <section className="bg-flour p-6 rounded-lg border border-stone-200">
                    <h3 className="font-oswald text-xl uppercase mb-4 text-espresso border-b border-stone-300 pb-2">{t('checkout.yourOrder')}</h3>
                    <div className="space-y-3 mb-4 max-h-64 overflow-y-auto pr-2">
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between items-start font-lato text-sm">
                                <div className="flex gap-2">
                                    <span className="font-bold text-tomato">{item.quantity}x</span>
                                    <span className="text-espresso">{item.name}{item.sizeLabel ? ` (${item.sizeLabel})` : ''}</span>
                                </div>
                                <span className="text-gray-600">&euro;{(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-300 pt-3 font-lato">
                        <div className="flex justify-between font-oswald text-xl text-espresso">
                            <span>{t('checkout.total')}</span>
                            <span>&euro;{totals.total.toFixed(2)}</span>
                        </div>
                        <p className="text-gray-400 text-xs mt-1">{t('checkout.inclBtw')}</p>
                    </div>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-espresso text-white w-8 h-8 rounded-full flex items-center justify-center font-oswald text-sm">3</div>
                        <h2 className="font-oswald text-2xl uppercase text-espresso tracking-wide">{t('checkout.step3')}</h2>
                    </div>

                    <div className="bg-white p-5 rounded border border-gray-200 shadow-sm mb-6">
                        <PaymentElement options={{
                            layout: "tabs",
                            business: { name: "Wake n Bake" }
                        }} />
                    </div>

                    {errorMessage && (
                        <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100 flex items-center gap-2">
                            <span className="font-bold">{t('checkout.warning')}</span> {errorMessage}
                        </div>
                    )}

                    <button
                        onClick={handleSubmit(onSubmit)}
                        disabled={!stripe || !elements || !pickupTime || noSlotsAvailable || isProcessing}
                        className={cn(
                            "w-full py-4 rounded font-oswald uppercase text-lg tracking-wider text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2",
                            (!stripe || !elements || !pickupTime || isProcessing)
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-tomato hover:bg-red-700 hover:shadow-xl hover:-translate-y-0.5"
                        )}
                    >
                        {isProcessing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" /> {t('checkout.processingPayment')}
                            </>
                        ) : (
                            <>{t('checkout.payButton')}</>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1 font-lato">
                        <CheckCircle2 className="w-3 h-3" /> {t('checkout.securePayment')}
                    </p>
                </section>
            </div>
        </div>
    );
}
