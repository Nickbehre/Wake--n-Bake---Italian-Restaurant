'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Mail, Phone, Clock } from 'lucide-react';
import Link from 'next/link';
import { useOrderStore } from '@/lib/store/order-store';
import CartSummary from '@/components/order/CartSummary';
import { StoreStatusGate } from '@/components/order/StoreClosedModal';
import { trackBeginCheckout, trackPurchase } from '@/lib/analytics';

export default function OrderCheckoutPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const items = useOrderStore((state) => state.items);
  const getCartSummary = useOrderStore((state) => state.getCartSummary);
  const setCustomerInfo = useOrderStore((state) => state.setCustomerInfo);
  const setPickupTime = useOrderStore((state) => state.setPickupTime);
  const clearCart = useOrderStore((state) => state.clearCart);

  const summary = getCartSummary();

  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (items.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    trackBeginCheckout(
      items.map((i) => ({
        item_id: i.productId,
        item_name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
      summary.total
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    pickupTime: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Save customer info to store
      setCustomerInfo({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
      });
      setPickupTime(formData.pickupTime);

      // Submit order to API
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          pickupTime: formData.pickupTime,
          subtotal: summary.subtotal,
          total: summary.total,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to place order');
      }

      trackPurchase(
        items.map((i) => ({
          item_id: i.productId,
          item_name: i.name,
          price: i.price,
          quantity: i.quantity,
        })),
        summary.total,
        result.order?.id || `wnb-${formData.pickupTime}-${summary.total}`
      );

      // Clear cart and redirect to success page
      clearCart();
      router.push('/order-success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate pickup time options (every 15 minutes for the next 3 hours)
  const generateTimeSlots = () => {
    const slots: string[] = [];
    const now = new Date();
    const startTime = new Date(now);
    startTime.setMinutes(Math.ceil(now.getMinutes() / 15) * 15 + 15); // Start 15 mins from now

    for (let i = 0; i < 12; i++) {
      const time = new Date(startTime);
      time.setMinutes(startTime.getMinutes() + i * 15);
      const hours = time.getHours().toString().padStart(2, '0');
      const minutes = time.getMinutes().toString().padStart(2, '0');
      slots.push(`${hours}:${minutes}`);
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-comodo text-4xl md:text-5xl mb-6 text-espresso">
            Your Cart is Empty
          </h1>
          <p className="text-espresso/70 mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link
            href="/order"
            className="inline-flex items-center gap-2 bg-tomato text-white px-6 py-3 rounded-full font-oswald font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <StoreStatusGate>
    <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
      <div className="container mx-auto px-4">
        {/* Back Link */}
        <Link
          href="/order"
          className="inline-flex items-center gap-2 text-espresso/70 hover:text-espresso mb-8 font-lato transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Menu
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-comodo text-4xl md:text-5xl mb-4 text-espresso">
            Checkout
          </h1>
          <p className="text-espresso/70">
            Complete your order for click & collect
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Order Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Customer Details */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-oswald text-xl font-bold text-espresso uppercase tracking-wide mb-6">
                  Your Details
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-montserrat font-semibold text-sm text-espresso mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/40" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-espresso/20 rounded-lg font-lato focus:outline-none focus:border-tomato transition-colors"
                        placeholder="Enter your name"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-montserrat font-semibold text-sm text-espresso mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/40" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-espresso/20 rounded-lg font-lato focus:outline-none focus:border-tomato transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block font-montserrat font-semibold text-sm text-espresso mb-2"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/40" />
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border border-espresso/20 rounded-lg font-lato focus:outline-none focus:border-tomato transition-colors"
                        placeholder="+31 6 12345678"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pickup Time */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="font-oswald text-xl font-bold text-espresso uppercase tracking-wide mb-6">
                  Pickup Time
                </h2>

                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-espresso/40" />
                  <select
                    id="pickupTime"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-espresso/20 rounded-lg font-lato focus:outline-none focus:border-tomato transition-colors appearance-none bg-white"
                  >
                    <option value="">Select a pickup time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>

                <p className="text-sm text-espresso/60 mt-3 font-lato">
                  We&apos;ll have your order ready for pickup at the selected time.
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-tomato text-white py-4 rounded-lg font-oswald text-xl font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isSubmitting ? 'Placing Order...' : 'Place Order'}
              </motion.button>

              <p className="text-center text-sm text-espresso/50 font-lato">
                Payment will be made at pickup
              </p>
            </form>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:sticky lg:top-32 h-fit"
          >
            <CartSummary showLineItems={true} />
          </motion.div>
        </div>
      </div>
    </div>
    </StoreStatusGate>
  );
}
