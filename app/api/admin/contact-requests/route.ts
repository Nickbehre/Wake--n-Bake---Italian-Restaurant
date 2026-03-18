import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const searchParams = request.nextUrl.searchParams
  const subject = searchParams.get('subject')

  const admin = createAdminClient()
  let query = admin
    .from('contact_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (subject) {
    query = query.eq('subject', subject)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching contact requests:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }

  return NextResponse.json({ requests: data })
}

export async function PATCH(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { id, status } = await request.json()

  const admin = createAdminClient()
  const { error } = await admin
    .from('contact_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
