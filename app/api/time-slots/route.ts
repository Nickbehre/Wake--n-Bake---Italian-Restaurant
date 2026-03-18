import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { addMinutes, isBefore, isAfter, format } from 'date-fns'
import { toZonedTime } from 'date-fns-tz'

const SLOT_INTERVAL_MINUTES = 15
const PREP_BUFFER_MINUTES = 15
const TIMEZONE = 'Europe/Amsterdam'

const DAY_MAP: Record<number, string> = {
  0: 'sunday',
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
}

export async function GET() {
  const supabase = createAdminClient()

  // Fetch settings
  const { data: settingsData } = await supabase.from('settings').select('*')

  const settings: Record<string, any> = {}
  settingsData?.forEach((row: any) => {
    settings[row.key] = row.value
  })

  const maxPerSlot = settings.max_sandwiches_per_slot?.value || 10
  const maxPerDay = settings.max_sandwiches_per_day?.value || 0 // 0 = unlimited
  const openingHours = settings.opening_hours || null
  const storePaused = settings.store_paused?.value || false

  // If store is paused, return empty
  if (storePaused) {
    return NextResponse.json({
      slots: [],
      paused: true,
      message: settings.store_paused?.message || 'The store is temporarily closed',
    })
  }

  // Get current time in Amsterdam timezone
  const nowUtc = new Date()
  const nowAmsterdam = toZonedTime(nowUtc, TIMEZONE)

  // Determine store hours for today (based on Amsterdam day)
  const dayNum = nowAmsterdam.getDay()
  const dayKey = DAY_MAP[dayNum]

  let openHour: number, openMinute: number, closeHour: number, closeMinute: number

  if (openingHours && openingHours[dayKey]) {
    const dayConfig = openingHours[dayKey]
    if (dayConfig.closed) {
      return NextResponse.json({ slots: [], paused: false, message: 'Closed today' })
    }
    const [oh, om] = dayConfig.open.split(':').map(Number)
    const [ch, cm] = dayConfig.close.split(':').map(Number)
    openHour = oh; openMinute = om; closeHour = ch; closeMinute = cm
  } else {
    // Fallback defaults
    if (dayNum === 0) {
      return NextResponse.json({ slots: [], paused: false, message: 'Closed today' })
    }
    if (dayNum === 6) {
      openHour = 9; openMinute = 0; closeHour = 17; closeMinute = 0
    } else {
      openHour = 8; openMinute = 0; closeHour = 16; closeMinute = 0
    }
  }

  // Fetch today's orders to check capacity
  const todayStr = format(nowAmsterdam, 'yyyy-MM-dd')
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('pickup_time, items')
    .gte('created_at', `${todayStr}T00:00:00.000Z`)
    .lte('created_at', `${todayStr}T23:59:59.999Z`)
    .not('status', 'eq', 'cancelled')

  // Count items per time slot and total for the day
  const slotCounts: Record<string, number> = {}
  let totalDayCount = 0
  todayOrders?.forEach((order: any) => {
    const time = order.pickup_time
    const itemCount = Array.isArray(order.items)
      ? order.items.reduce((sum: number, i: any) => sum + (i.quantity || 1), 0)
      : 0
    totalDayCount += itemCount
    if (time) {
      slotCounts[time] = (slotCounts[time] || 0) + itemCount
    }
  })

  // If daily max is reached, return empty
  if (maxPerDay > 0 && totalDayCount >= maxPerDay) {
    return NextResponse.json({
      slots: [],
      paused: false,
      message: 'The maximum number of orders for today has been reached',
    })
  }

  // Generate slots using Amsterdam local time
  const todayAmsterdamStart = new Date(nowAmsterdam)
  todayAmsterdamStart.setHours(0, 0, 0, 0)

  const slots: Array<{ time: string; date: string; available: boolean; remaining: number }> = []

  let currentSlot = new Date(todayAmsterdamStart)
  currentSlot.setHours(openHour, openMinute, 0, 0)

  const closingTime = new Date(todayAmsterdamStart)
  closingTime.setHours(closeHour, closeMinute, 0, 0)

  const minimumPickupTime = addMinutes(nowAmsterdam, PREP_BUFFER_MINUTES)

  while (isBefore(currentSlot, closingTime)) {
    if (isAfter(currentSlot, minimumPickupTime)) {
      const label = format(currentSlot, 'HH:mm')
      const used = slotCounts[label] || 0
      const remaining = Math.max(0, maxPerSlot - used)

      slots.push({
        time: label,
        date: currentSlot.toISOString(),
        available: remaining > 0,
        remaining,
      })
    }

    currentSlot = addMinutes(currentSlot, SLOT_INTERVAL_MINUTES)
  }

  return NextResponse.json({ slots, paused: false })
}
