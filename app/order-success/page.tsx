'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'
import { useCart } from '@/lib/context/CartContext'

export default function OrderSuccessPage() {
  const router = useRouter()
  const { orderData, clearOrderData } = useCart()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if no order data
  useEffect(() => {
    if (isMounted && !orderData) {
      router.push('/menu')
    }
  }, [isMounted, orderData, router])

  if (!isMounted || !orderData) {
    return (
      <div className="min-h-screen bg-flour flex items-center justify-center">
        <div className="animate-pulse text-espresso/50">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-espresso py-8 md:py-16 flex items-center justify-center">
      <div className="container-custom max-w-lg">
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="w-20 h-20 bg-pistachio rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        {/* Receipt Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          {/* Receipt styling - torn paper effect */}
          <div className="bg-white shadow-2xl">
            {/* Perforated top edge */}
            <div className="h-4 bg-white flex justify-around items-center">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-espresso rounded-full opacity-20" />
              ))}
            </div>

            {/* Receipt Content */}
            <div className="px-6 md:px-10 py-8">
              {/* Header */}
              <div className="text-center border-b-2 border-dashed border-espresso/20 pb-6">
                <h1 className="font-oswald text-3xl font-bold text-espresso uppercase tracking-wider">
                  Wake N&apos; Bake
                </h1>
                <p className="font-lato text-espresso/60 text-sm mt-1">Panificio Italiano</p>
                <p className="font-lato text-espresso/60 text-sm">Vijzelstraat 93h, Amsterdam</p>
              </div>

              {/* Order Number */}
              <div className="text-center py-6 border-b-2 border-dashed border-espresso/20">
                <p className="font-lato text-espresso/60 text-sm uppercase tracking-wide">Order Number</p>
                <p className="font-oswald text-4xl font-bold text-tomato mt-1">
                  #{orderData.orderNumber}
                </p>
              </div>

              {/* BIG Pickup Time */}
              <div className="py-8 border-b-2 border-dashed border-espresso/20">
                <div className="bg-crust/10 p-6 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-6 h-6 text-crust" />
                    <span className="font-lato text-espresso/60 uppercase tracking-wide text-sm">
                      Pickup Time
                    </span>
                  </div>
                  <p className="font-oswald text-4xl md:text-5xl font-bold text-espresso tracking-wide">
                    {orderData.pickupTime}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="py-6 border-b-2 border-dashed border-espresso/20">
                <h3 className="font-oswald text-lg font-bold text-espresso uppercase tracking-wide mb-4">
                  Order Details
                </h3>
                <div className="space-y-3">
                  {orderData.items.map((item) => (
                    <div key={item.id} className="flex justify-between font-lato">
                      <span className="text-espresso">
                        <span className="font-semibold">{item.quantity}x</span> {item.name}
                      </span>
                      <span className="font-oswald font-semibold text-espresso">
                        {item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="py-6 border-b-2 border-dashed border-espresso/20">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-xl text-espresso uppercase tracking-wide">
                    Total Paid
                  </span>
                  <span className="font-oswald text-3xl font-bold text-crust">
                    €{orderData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Info */}
              <div className="py-6 border-b-2 border-dashed border-espresso/20">
                <h3 className="font-oswald text-lg font-bold text-espresso uppercase tracking-wide mb-4">
                  Customer
                </h3>
                <div className="font-lato text-espresso/80 space-y-1">
                  <p>{orderData.customer.name}</p>
                  <p>{orderData.customer.email}</p>
                  <p>{orderData.customer.phone}</p>
                </div>
              </div>

              {/* Location */}
              <div className="py-6 border-b-2 border-dashed border-espresso/20">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-tomato flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-lato font-semibold text-espresso">Collection Point</p>
                    <p className="font-lato text-espresso/70 text-sm">
                      Vijzelstraat 93h<br />
                      1017 HH Amsterdam
                    </p>
                  </div>
                </div>
              </div>

              {/* Instruction */}
              <div className="py-6 text-center">
                <div className="bg-tomato/10 p-4 border-2 border-tomato">
                  <p className="font-oswald text-tomato uppercase tracking-wide font-bold">
                    Show this receipt at the counter<br />to collect your food
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center text-espresso/40 text-xs font-lato pt-4">
                <p>Thank you for your order!</p>
                <p className="mt-1">www.wakenbakepanificio.nl</p>
              </div>
            </div>

            {/* Perforated bottom edge */}
            <div className="h-4 bg-white flex justify-around items-center">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="w-2 h-2 bg-espresso rounded-full opacity-20" />
              ))}
            </div>
          </div>

          {/* Zigzag bottom edge */}
          <svg
            className="w-full h-4 text-white"
            preserveAspectRatio="none"
            viewBox="0 0 100 10"
          >
            <polygon
              fill="currentColor"
              points="0,0 5,10 10,0 15,10 20,0 25,10 30,0 35,10 40,0 45,10 50,0 55,10 60,0 65,10 70,0 75,10 80,0 85,10 90,0 95,10 100,0 100,10 0,10"
            />
          </svg>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 space-y-4"
        >
          <Link
            href="/menu"
            onClick={() => clearOrderData()}
            className="block w-full bg-crust text-espresso text-center py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-crust/90 transition-colors"
          >
            Order More
          </Link>

          <Link
            href="/"
            onClick={() => clearOrderData()}
            className="block w-full border-2 border-white/30 text-white text-center py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
