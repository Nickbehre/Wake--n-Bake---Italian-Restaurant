import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Bestelling ontvangen',
  description:
    'Bedankt voor je bestelling.',
  path: '/order-success',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
