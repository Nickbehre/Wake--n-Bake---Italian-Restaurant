import { describe, it, expect } from 'vitest'
import { dutchDateString, dutchDayBounds } from '@/lib/utils/dutch-time'

describe('dutch-time', () => {
  it('uses the Amsterdam date just after midnight', () => {
    // 22:30 UTC on the 23rd is already 00:30 on the 24th in Amsterdam (CEST)
    expect(dutchDateString(new Date('2026-09-23T22:30:00Z'))).toBe('2026-09-24')
  })

  it('returns UTC bounds for an Amsterdam summer day', () => {
    expect(dutchDayBounds('2026-07-01')).toEqual({
      start: '2026-06-30T22:00:00.000Z',
      end: '2026-07-01T21:59:59.999Z',
    })
  })

  it('returns UTC bounds for an Amsterdam winter day', () => {
    expect(dutchDayBounds('2026-01-15')).toEqual({
      start: '2026-01-14T23:00:00.000Z',
      end: '2026-01-15T22:59:59.999Z',
    })
  })
})
