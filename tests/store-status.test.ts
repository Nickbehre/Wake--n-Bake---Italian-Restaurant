import { describe, it, expect, vi } from 'vitest'

// store-status importeert de Supabase admin-client; voor de pure logica niet nodig
vi.mock('@/lib/supabase/admin', () => ({ createAdminClient: vi.fn() }))

import { evaluateStoreOpenState } from '@/lib/server/store-status'

const weekHours = {
  monday: { open: '08:00', close: '16:00' },
  tuesday: { open: '08:00', close: '16:00' },
  wednesday: { open: '08:00', close: '16:00' },
  thursday: { open: '08:00', close: '16:00' },
  friday: { open: '08:00', close: '16:00' },
  saturday: { open: '09:00', close: '17:00' },
  sunday: { closed: true },
}

// Woensdag 23 september 2026; Amsterdam = UTC+2 (zomertijd)
const amsterdam = (hhmm: string, day = '2026-09-23') => new Date(`${day}T${hhmm}:00+02:00`)

describe('evaluateStoreOpenState', () => {
  it('is open during opening hours (Amsterdam time)', () => {
    expect(evaluateStoreOpenState({ opening_hours: weekHours }, amsterdam('12:00'))).toEqual({ open: true })
  })

  it('is closed before opening and from closing time on', () => {
    expect(evaluateStoreOpenState({ opening_hours: weekHours }, amsterdam('07:59')).open).toBe(false)
    expect(evaluateStoreOpenState({ opening_hours: weekHours }, amsterdam('16:00')).open).toBe(false)
  })

  it('uses Amsterdam time, not UTC', () => {
    // 06:30 UTC = 08:30 in Amsterdam → open
    expect(evaluateStoreOpenState({ opening_hours: weekHours }, new Date('2026-09-23T06:30:00Z')).open).toBe(true)
  })

  it('respects days marked as closed', () => {
    const sunday = amsterdam('12:00', '2026-09-27')
    expect(evaluateStoreOpenState({ opening_hours: weekHours }, sunday)).toMatchObject({ open: false })
  })

  it('is closed when the store is paused, with the custom message', () => {
    const state = evaluateStoreOpenState(
      { opening_hours: weekHours, store_paused: { value: true, message: 'Even pauze' } },
      amsterdam('12:00')
    )
    expect(state).toEqual({ open: false, message: 'Even pauze' })
  })

  it('stays open when no opening hours are configured', () => {
    expect(evaluateStoreOpenState({}, amsterdam('03:00')).open).toBe(true)
  })
})
