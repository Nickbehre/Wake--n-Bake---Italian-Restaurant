import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

// Vervangt het statische public/sitemap.xml: lastModified is de build-datum,
// dus Google ziet na elke deploy een actuele sitemap.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const pages: { path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly'; priority: number }[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1.0 },
    { path: '/?loc=express', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/menu', changeFrequency: 'weekly', priority: 0.9 },
    { path: '/order', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/contact', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/over-ons', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/gallerij', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
    { path: '/cookies', changeFrequency: 'yearly', priority: 0.3 },
  ]
  return pages.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
