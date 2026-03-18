import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'

export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const admin = createAdminClient()
  const { data, error } = await admin.from('settings').select('*')

  if (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
  }

  // Convert array to key-value object
  const settings: Record<string, any> = {}
  data?.forEach((row: any) => {
    settings[row.key] = row.value
  })

  return NextResponse.json({ settings })
}

export async function PUT(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const { key, value } = await request.json()

  if (!key || value === undefined) {
    return NextResponse.json({ error: 'Key and value are required' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from('settings')
    .upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    })

  if (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
