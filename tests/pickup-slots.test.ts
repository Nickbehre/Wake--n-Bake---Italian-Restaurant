import { describe, it, expect } from 'vitest'
import { buildPickupSlots, parseHHMM, minutesToLabel, toMinutes } from '@/lib/utils/pickup-slots'

const OPEN = parseHHMM('08:00')
const CLOSE = parseHHMM('16:00')

describe('time helpers', () => {
  it('converts between labels and minutes', () => {
    expect(parseHHMM('08:30')).toBe(510)
    expect(minutesToLabel(510)).toBe('08:30')
    expect(minutesToLabel(toMinutes(9, 5))).toBe('09:05')
  })
})

describe('buildPickupSlots', () => {
  it('returns every 15-minute slot before opening time', () => {
    const slots = buildPickupSlots({ nowMinutes: parseHHMM('06:00'), openMinutes: OPEN, closeMinutes: CLOSE, maxPerSlot: 10 })
    expect(slots[0].time).toBe('08:00')
    expect(slots.at(-1)!.time).toBe('15:45')
    expect(slots).toHaveLength(32)
  })

  it('keeps a 15-minute preparation buffer', () => {
    const slots = buildPickupSlots({ nowMinutes: parseHHMM('12:00'), openMinutes: OPEN, closeMinutes: CLOSE, maxPerSlot: 10 })
    // 12:15 is exactly now + buffer → too soon
    expect(slots[0].time).toBe('12:30')
  })

  it('returns no slots after the last pickup time', () => {
    expect(buildPickupSlots({ nowMinutes: parseHHMM('15:40'), openMinutes: OPEN, closeMinutes: CLOSE, maxPerSlot: 10 })).toEqual([])
  })

  it('marks full slots as unavailable and reports remaining capacity', () => {
    const slots = buildPickupSlots({
      nowMinutes: parseHHMM('07:00'),
      openMinutes: OPEN,
      closeMinutes: parseHHMM('08:30'),
      maxPerSlot: 5,
      slotCounts: { '08:00': 5, '08:15': 3 },
    })
    expect(slots).toEqual([
      { time: '08:00', date: '08:00', available: false, remaining: 0 },
      { time: '08:15', date: '08:15', available: true, remaining: 2 },
    ])
  })

  it('never reports negative capacity when a slot is overbooked', () => {
    const [slot] = buildPickupSlots({ nowMinutes: 0, openMinutes: OPEN, closeMinutes: OPEN + 15, maxPerSlot: 2, slotCounts: { '08:00': 9 } })
    expect(slot.remaining).toBe(0)
  })
})
