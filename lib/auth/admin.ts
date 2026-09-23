import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Allowed admin emails - only these users can access admin API routes.
// Configure via ADMIN_EMAILS (comma-separated) so staff can be added or
// removed without a code change; falls back to the original list.
const DEFAULT_ADMIN_EMAILS = [
  'info@wakenbake.nl',
  'ruben@wakenbake.nl',
  'nickbehre@gmail.com',
]

export function getAdminEmails(): string[] {
  const fromEnv = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
  return fromEnv.length > 0 ? fromEnv : DEFAULT_ADMIN_EMAILS
}

/**
 * Verify the current user is an authenticated admin.
 * Returns the user if authorized, or a NextResponse error if not.
 */
export async function verifyAdmin(): Promise<
  { user: { id: string; email: string }; error?: never } |
  { user?: never; error: NextResponse }
> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || !user.email) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  if (!getAdminEmails().includes(user.email.toLowerCase())) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user: { id: user.id, email: user.email } }
}
