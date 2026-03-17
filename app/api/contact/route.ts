import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const { name, email, phone, subject, message } = await request.json()

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: 'Please fill in all required fields' }, { status: 400 })
  }

  const admin = createAdminClient()

  const { error } = await admin.from('contact_requests').insert({
    name,
    email,
    phone: phone || null,
    subject,
    message,
  })

  if (error) {
    console.error('Error saving contact request:', error)
    return NextResponse.json({ error: 'Could not save message' }, { status: 500 })
  }

  // Create notification for admin
  await admin.from('notifications').insert({
    type: subject === 'catering' ? 'catering_request' : 'contact_request',
    title: subject === 'catering' ? `Catering request - ${name}` : `Contact message - ${name}`,
    message: message.substring(0, 200),
  })

  return NextResponse.json({ success: true })
}
