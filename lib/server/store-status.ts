// Server-side check of de winkel bestellingen aanneemt.
// De frontend heeft dezelfde check (StoreStatusGate), maar die is te
// omzeilen — checkout-routes moeten dit zelf ook afdwingen.

import { createAdminClient } from '@/lib/supabase/admin'
import { formatInTimeZone } from 'date-fns-tz'

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

export interface StoreOpenState {
  open: boolean
  /** Klantgerichte melding (NL + EN) wanneer gesloten */
  message?: string
}

/** Pure beslislogica — apart zodat hij testbaar is zonder database. */
export function evaluateStoreOpenState(
  settings: Record<string, any>,
  now: Date = new Date()
): StoreOpenState {
  if (settings.store_paused?.value) {
    return {
      open: false,
      message:
        settings.store_paused?.message ||
        'De winkel is tijdelijk gesloten. / The store is temporarily closed.',
    }
  }

  const openingHours = settings.opening_hours
  if (openingHours) {
    const dayIndex = parseInt(formatInTimeZone(now, TIMEZONE, 'i')) % 7 // 1=ma..7=zo → 0=zo
    const dayKey = DAY_MAP[dayIndex]
    const today = openingHours[dayKey]

    if (!today || today.closed) {
      return {
        open: false,
        message: 'We zijn vandaag gesloten. / We are closed today.',
      }
    }

    const nowMinutes =
      parseInt(formatInTimeZone(now, TIMEZONE, 'H')) * 60 +
      parseInt(formatInTimeZone(now, TIMEZONE, 'm'))
    const [openH, openM] = String(today.open ?? '08:00').split(':').map(Number)
    const [closeH, closeM] = String(today.close ?? '16:00').split(':').map(Number)

    if (nowMinutes < openH * 60 + openM || nowMinutes >= closeH * 60 + closeM) {
      return {
        open: false,
        message: `We zijn nu gesloten (open ${today.open}–${today.close}). / We are currently closed (open ${today.open}–${today.close}).`,
      }
    }
  }

  return { open: true }
}

export async function isStoreAcceptingOrders(): Promise<StoreOpenState> {
  try {
    const supabase = createAdminClient()
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .in('key', ['store_paused', 'opening_hours'])

    const settings: Record<string, any> = {}
    settingsData?.forEach((row: any) => {
      settings[row.key] = row.value
    })

    return evaluateStoreOpenState(settings)
  } catch (error) {
    // Instellingen niet leesbaar (bv. lokaal zonder service key):
    // net als de frontend-gate fail-open — validatie verderop vangt de rest
    console.error('Store status check failed, allowing order:', error)
    return { open: true }
  }
}
