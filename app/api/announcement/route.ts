import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export const dynamic = 'force-dynamic'

/**
 * GET /api/announcement — publieke route voor de aankondigingsbanner.
 * Leest alleen de 'announcement'-key uit settings (geen auth nodig; de
 * settings-tabel zelf is niet publiek leesbaar, dus via de server-client).
 */
export async function GET() {
  try {
    const admin = createAdminClient()
    const { data } = await admin
      .from('settings')
      .select('value')
      .eq('key', 'announcement')
      .maybeSingle()

    const value = data?.value ?? { enabled: false }
    return NextResponse.json({ announcement: value })
  } catch (error) {
    // Zonder service key (bv. lokaal) geen banner — geen harde fout
    return NextResponse.json({ announcement: { enabled: false } })
  }
}
