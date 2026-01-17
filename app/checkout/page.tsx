'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  User,
  Clock,
  CreditCard,
  Check,
  ShoppingBag,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useCart, type CustomerInfo } from '@/lib/context/CartContext'

// Steps configuration
const steps = [
  { id: 1, title: 'Your Details', icon: User },
  { id: 2, title: 'Pickup Time', icon: Clock },
  { id: 3, title: 'Payment', icon: CreditCard },
]

// Generate time slots for a given day
function generateTimeSlots(openingHour: number, closingHour: number): string[] {
  const slots: string[] = []
  for (let hour = openingHour; hour < closingHour; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const startHour = hour.toString().padStart(2, '0')
      const startMin = minute.toString().padStart(2, '0')
      const endMinute = (minute + 15) % 60
      const endHour = minute + 15 >= 60 ? hour + 1 : hour
      const endHourStr = endHour.toString().padStart(2, '0')
      const endMinStr = endMinute.toString().padStart(2, '0')
      slots.push(`${startHour}:${startMin} - ${endHourStr}:${endMinStr}`)
    }
  }
  return slots
}

// Filter slots to only show future times
function filterFutureSlots(slots: string[]): string[] {
  const now = new Date()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()

  return slots.filter((slot) => {
    const [startTime] = slot.split(' - ')
    const [hour, minute] = startTime.split(':').map(Number)
    // Add 15 minutes buffer to allow for preparation
    if (hour > currentHour) return true
    if (hour === currentHour && minute > currentMinute + 15) return true
    return false
  })
}

// Generate random order number
function generateOrderNumber(): string {
  const num = Math.floor(1000 + Math.random() * 9000)
  return `WNB-${num}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart, setOrderData } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Form state
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
  })
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('')
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  // Generate available time slots (10:00 - 18:00)
  const allTimeSlots = useMemo(() => generateTimeSlots(10, 18), [])
  const availableTimeSlots = useMemo(() => filterFutureSlots(allTimeSlots), [allTimeSlots])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Redirect if cart is empty
  useEffect(() => {
    if (isMounted && items.length === 0) {
      router.push('/menu')
    }
  }, [isMounted, items.length, router])

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-flour flex items-center justify-center">
        <div className="animate-pulse text-espresso/50">Loading...</div>
      </div>
    )
  }

  if (items.length === 0) {
    return null
  }

  // Validation
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {}

    if (!customerInfo.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!customerInfo.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      errors.email = 'Please enter a valid email'
    }

    if (!customerInfo.phone.trim()) {
      errors.phone = 'Phone number is required'
    } else if (!/^[+]?[\d\s-]{8,}$/.test(customerInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateStep2 = (): boolean => {
    if (!selectedTimeSlot) {
      setFormErrors({ timeSlot: 'Please select a pickup time' })
      return false
    }
    setFormErrors({})
    return true
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateStep1()) return
    if (currentStep === 2 && !validateStep2()) return
    setCurrentStep((prev) => Math.min(prev + 1, 3))
  }

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate order data
    const orderNumber = generateOrderNumber()
    const orderData = {
      items: [...items],
      total: totalPrice,
      customer: customerInfo,
      pickupTime: selectedTimeSlot,
      orderNumber,
    }

    // Save order data and clear cart
    setOrderData(orderData)
    clearCart()

    // Redirect to success page
    router.push('/order-success')
  }

  return (
    <div className="min-h-screen bg-flour py-8 md:py-16">
      <div className="container-custom max-w-4xl">
        {/* Back to Menu Link */}
        <Link
          href="/menu"
          className="inline-flex items-center gap-2 text-espresso/70 hover:text-tomato transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-lato">Back to Menu</span>
        </Link>

        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-oswald text-4xl md:text-5xl font-bold text-espresso uppercase tracking-wide mb-2">
            Checkout
          </h1>
          <p className="font-lato text-espresso/70">Click & Collect</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 md:gap-8 mb-12">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isCompleted = currentStep > step.id

            return (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <motion.div
                    animate={{
                      backgroundColor: isCompleted ? '#CE2029' : isActive ? '#CE2029' : '#F9F7F2',
                      borderColor: isCompleted || isActive ? '#CE2029' : '#D4A056',
                    }}
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center"
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" />
                    ) : (
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-crust'}`} />
                    )}
                  </motion.div>
                  <span className={`font-lato text-sm mt-2 hidden md:block ${isActive ? 'text-tomato font-semibold' : 'text-espresso/60'}`}>
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 md:w-24 h-0.5 mx-2 ${currentStep > step.id ? 'bg-tomato' : 'bg-crust/30'}`} />
                )}
              </div>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Form Area */}
          <div className="md:col-span-2">
            <AnimatePresence mode="wait">
              {/* Step 1: Customer Details */}
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 md:p-8 shadow-lg"
                >
                  <h2 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-6">
                    Your Details
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-lato font-semibold text-espresso mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                        className={`w-full px-4 py-3 border-2 font-lato focus:outline-none focus:border-tomato transition-colors ${
                          formErrors.name ? 'border-tomato' : 'border-espresso/20'
                        }`}
                        placeholder="John Doe"
                      />
                      {formErrors.name && (
                        <p className="text-tomato text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato font-semibold text-espresso mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className={`w-full px-4 py-3 border-2 font-lato focus:outline-none focus:border-tomato transition-colors ${
                          formErrors.email ? 'border-tomato' : 'border-espresso/20'
                        }`}
                        placeholder="john@example.com"
                      />
                      {formErrors.email && (
                        <p className="text-tomato text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-lato font-semibold text-espresso mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className={`w-full px-4 py-3 border-2 font-lato focus:outline-none focus:border-tomato transition-colors ${
                          formErrors.phone ? 'border-tomato' : 'border-espresso/20'
                        }`}
                        placeholder="+31 6 1234 5678"
                      />
                      {formErrors.phone && (
                        <p className="text-tomato text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleNext}
                    className="mt-8 w-full bg-tomato text-white py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors"
                  >
                    Continue to Pickup Time
                  </button>
                </motion.div>
              )}

              {/* Step 2: Pickup Time */}
              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 md:p-8 shadow-lg"
                >
                  <h2 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-2">
                    Select Pickup Time
                  </h2>
                  <p className="font-lato text-espresso/60 mb-6">
                    Choose a 15-minute window to collect your order
                  </p>

                  {availableTimeSlots.length === 0 ? (
                    <div className="text-center py-12">
                      <Clock className="w-16 h-16 text-espresso/30 mx-auto mb-4" />
                      <p className="font-lato text-espresso/60">
                        Sorry, no pickup slots available for today.
                      </p>
                      <p className="font-lato text-sm text-espresso/40 mt-2">
                        Please try again tomorrow between 10:00 - 18:00
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {availableTimeSlots.map((slot) => (
                          <motion.button
                            key={slot}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              setSelectedTimeSlot(slot)
                              setFormErrors({})
                            }}
                            className={`p-4 border-2 font-oswald font-semibold transition-all ${
                              selectedTimeSlot === slot
                                ? 'border-tomato bg-tomato text-white'
                                : 'border-espresso/20 hover:border-crust text-espresso'
                            }`}
                          >
                            {slot}
                          </motion.button>
                        ))}
                      </div>

                      {formErrors.timeSlot && (
                        <p className="text-tomato text-sm mt-4 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {formErrors.timeSlot}
                        </p>
                      )}
                    </>
                  )}

                  <div className="flex gap-4 mt-8">
                    <button
                      onClick={handleBack}
                      className="flex-1 border-2 border-espresso/20 text-espresso py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:border-espresso/40 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={availableTimeSlots.length === 0}
                      className="flex-1 bg-tomato text-white py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue to Payment
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white p-6 md:p-8 shadow-lg"
                >
                  <h2 className="font-oswald text-2xl font-bold text-espresso uppercase tracking-wide mb-6">
                    Payment
                  </h2>

                  {/* Order Summary */}
                  <div className="bg-flour p-6 mb-6">
                    <h3 className="font-oswald text-lg font-bold text-espresso uppercase tracking-wide mb-4">
                      Order Summary
                    </h3>

                    <div className="space-y-3 mb-4">
                      {items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                          <span className="font-lato text-espresso">
                            {item.quantity}x {item.name}
                          </span>
                          <span className="font-oswald text-espresso font-semibold">
                            {item.price}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-espresso/20 pt-4 flex justify-between">
                      <span className="font-oswald text-lg text-espresso uppercase">Total</span>
                      <span className="font-oswald text-2xl text-crust font-bold">
                        €{totalPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Pickup Info */}
                  <div className="bg-crust/10 p-4 mb-6 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-crust" />
                    <div>
                      <p className="font-lato text-sm text-espresso/60">Pickup Time</p>
                      <p className="font-oswald text-lg font-bold text-espresso">{selectedTimeSlot}</p>
                    </div>
                  </div>

                  {/* Mock Payment Notice */}
                  <div className="bg-pistachio/20 p-4 mb-6 border-l-4 border-pistachio">
                    <p className="font-lato text-sm text-espresso">
                      <strong>Demo Mode:</strong> This is a prototype. No actual payment will be processed.
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={handleBack}
                      disabled={isProcessing}
                      className="flex-1 border-2 border-espresso/20 text-espresso py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:border-espresso/40 transition-colors disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing}
                      className="flex-1 bg-tomato text-white py-4 font-oswald text-lg font-bold uppercase tracking-wide hover:bg-tomato/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        'Pay & Place Order'
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 shadow-lg sticky top-24">
              <h3 className="font-oswald text-lg font-bold text-espresso uppercase tracking-wide mb-4 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                Your Order
              </h3>

              <div className="space-y-4 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-tomato text-white w-5 h-5 flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-lato font-semibold text-espresso text-sm truncate">
                        {item.name}
                      </h4>
                      <p className="font-oswald text-crust font-bold">
                        {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-espresso/10 mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-oswald text-espresso uppercase">Total</span>
                  <span className="font-oswald text-2xl text-crust font-bold">
                    €{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
