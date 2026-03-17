import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
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
  // Verify auth
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
