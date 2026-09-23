import { NextResponse } from 'next/server'

/**
 * Eenvoudige fixed-window rate limiter per IP.
 *
 * Draait in het geheugen van de serverless-instance, dus het is best-effort:
 * op Vercel deelt elke warme instance zijn eigen teller. Genoeg om bots die
 * honderden verzoeken achter elkaar sturen (spam, card testing) af te remmen
 * zonder externe dienst. Voor een harde, globale limiet: vervang de Map door
 * Upstash Redis of Vercel KV.
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()

export type RateLimitResult = { ok: true } | { ok: false; retryAfter: number }

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now()
): RateLimitResult {
  // Oude buckets opruimen zodat de Map niet onbeperkt groeit
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k)
  }

  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true }
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }

  bucket.count++
  return { ok: true }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return request.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * Geeft een 429-response terug als het IP de limiet overschrijdt, anders null.
 */
export function limitByIp(
  request: Request,
  scope: string,
  limit: number,
  windowMs: number
): NextResponse | null {
  const result = rateLimit(`${scope}:${getClientIp(request)}`, limit, windowMs)
  if (result.ok) return null
  return NextResponse.json(
    { error: 'Te veel verzoeken. Probeer het over een paar minuten opnieuw.' },
    { status: 429, headers: { 'Retry-After': String(result.retryAfter) } }
  )
}

// Alleen voor tests
export function _resetRateLimits() {
  buckets.clear()
}
