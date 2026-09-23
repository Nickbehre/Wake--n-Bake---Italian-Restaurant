// Pure afhaaltijd-logica voor /api/time-slots, apart zodat hij zonder
// database of klok te testen is. Alle tijden in minuten sinds middernacht
// (Amsterdamse tijd).

export const SLOT_INTERVAL_MINUTES = 15
export const PREP_BUFFER_MINUTES = 15

export interface PickupSlot {
  time: string
  date: string
  available: boolean
  remaining: number
}

export function toMinutes(h: number, m: number): number {
  return h * 60 + m
}

export function minutesToLabel(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/** "08:30" → 510 */
export function parseHHMM(value: string): number {
  const [h, m] = value.split(':').map(Number)
  return toMinutes(h, m || 0)
}

export function buildPickupSlots({
  nowMinutes,
  openMinutes,
  closeMinutes,
  maxPerSlot,
  slotCounts = {},
}: {
  nowMinutes: number
  openMinutes: number
  closeMinutes: number
  maxPerSlot: number
  /** Aantal al bestelde items per slot-label ("12:15") */
  slotCounts?: Record<string, number>
}): PickupSlot[] {
  const minimumPickupMinutes = nowMinutes + PREP_BUFFER_MINUTES
  const slots: PickupSlot[] = []

  for (let slotMin = openMinutes; slotMin < closeMinutes; slotMin += SLOT_INTERVAL_MINUTES) {
    if (slotMin <= minimumPickupMinutes) continue
    const label = minutesToLabel(slotMin)
    const remaining = Math.max(0, maxPerSlot - (slotCounts[label] || 0))
    slots.push({ time: label, date: label, available: remaining > 0, remaining })
  }

  return slots
}
