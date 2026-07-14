import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyAdmin } from '@/lib/auth/admin'

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}
// Vercel serverless request-limiet is ~4,5 MB; client verkleint al vóór upload
const MAX_BYTES = 4 * 1024 * 1024

/** POST — multipart upload naar de publieke menu-images bucket, geeft URL terug */
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if (auth.error) return auth.error

  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const ext = ALLOWED_TYPES[file.type]
  if (!ext) {
    return NextResponse.json(
      { error: 'Only JPEG, PNG or WebP images are allowed' },
      { status: 400 }
    )
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: 'Image too large (max 4 MB)' }, { status: 400 })
  }

  const productId = (formData.get('productId') as string | null)?.replace(/[^a-z0-9-]/gi, '') || 'product'
  const path = `products/${productId}-${Date.now()}.${ext}`

  const admin = createAdminClient()
  const { error } = await admin.storage
    .from('menu-images')
    .upload(path, Buffer.from(await file.arrayBuffer()), {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }

  const { data } = admin.storage.from('menu-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
