import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Allowed admin emails - only these users can access admin API routes
const ADMIN_EMAILS = [
  'info@wakenbake.nl',
  'ruben@wakenbake.nl',
  'nickbehre@gmail.com',
]

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

  if (!ADMIN_EMAILS.includes(user.email)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }

  return { user: { id: user.id, email: user.email } }
}
