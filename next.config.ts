import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // webp-only halves the transformations vs avif+webp (Vercel Hobby quota);
    // sources are now small, so the bandwidth gain from avif is negligible.
    formats: ['image/webp'],
    // Only the qualities actually requested (default 75 + hero's 90); drops unused 100.
    qualities: [75, 90],
    // Cache optimized images ~31 days so they aren't re-transformed on every miss.
    // NB: when replacing an image, use a new filename (or ?v=) so the cache busts.
    minimumCacheTTL: 2678400,
    // Fewer breakpoints = fewer generated variants per image (no 4K needed here).
    deviceSizes: [640, 828, 1080, 1920, 2048],
    imageSizes: [64, 128, 256, 384],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
