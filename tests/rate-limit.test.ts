import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimit, getClientIp, limitByIp, _resetRateLimits } from '@/lib/server/rate-limit'

beforeEach(() => _resetRateLimits())

describe('rateLimit', () => {
  it('allows requests up to the limit, then blocks until the window resets', () => {
    const t = 1_000_000
    expect(rateLimit('k', 2, 60_000, t)).toEqual({ ok: true })
    expect(rateLimit('k', 2, 60_000, t + 1)).toEqual({ ok: true })
    expect(rateLimit('k', 2, 60_000, t + 2)).toEqual({ ok: false, retryAfter: 60 })
    expect(rateLimit('k', 2, 60_000, t + 60_000)).toEqual({ ok: true })
  })

  it('tracks keys independently', () => {
    expect(rateLimit('a', 1, 1000).ok).toBe(true)
    expect(rateLimit('b', 1, 1000).ok).toBe(true)
    expect(rateLimit('a', 1, 1000).ok).toBe(false)
  })
})

describe('getClientIp / limitByIp', () => {
  const req = (ip: string) => new Request('http://x', { headers: { 'x-forwarded-for': `${ip}, 10.0.0.1` } })

  it('takes the first x-forwarded-for address', () => {
    expect(getClientIp(req('1.2.3.4'))).toBe('1.2.3.4')
  })

  it('returns a 429 with Retry-After once the limit is hit', () => {
    expect(limitByIp(req('5.6.7.8'), 'test', 1, 60_000)).toBeNull()
    const res = limitByIp(req('5.6.7.8'), 'test', 1, 60_000)
    expect(res?.status).toBe(429)
    expect(res?.headers.get('Retry-After')).toBe('60')
  })
})
