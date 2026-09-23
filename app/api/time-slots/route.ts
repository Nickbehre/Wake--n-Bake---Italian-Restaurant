import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getTimezoneOffset } from 'date-fns-tz'
import { buildPickupSlots, toMinutes } from '@/lib/utils/pickup-slots'
import { dutchDayBounds } from '@/lib/utils/dutch-time'

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

  // Get current Amsterdam time using timezone offset (avoids fake Date issues)
  const now = new Date()
  const offsetMs = getTimezoneOffset(TIMEZONE, now)
  const amsterdamMs = now.getTime() + offsetMs
  const amsterdamDate = new Date(amsterdamMs)
  const amsterdamHour = amsterdamDate.getUTCHours()
  const amsterdamMinute = amsterdamDate.getUTCMinutes()
  const dayNum = amsterdamDate.getUTCDay()
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
  // Amsterdamse dag (niet UTC), anders tellen bestellingen rond middernacht
  // bij de verkeerde dag
  const today = dutchDayBounds()
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('pickup_time, items')
    .gte('created_at', today.start)
    .lte('created_at', today.end)
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

  const slots = buildPickupSlots({
    nowMinutes: toMinutes(amsterdamHour, amsterdamMinute),
    openMinutes: toMinutes(openHour, openMinute),
    closeMinutes: toMinutes(closeHour, closeMinute),
    maxPerSlot,
    slotCounts,
  })

  return NextResponse.json({ slots, paused: false })
}
