import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Afrekenen',
  description:
    'Rond je bestelling af.',
  path: '/checkout',
  noindex: true,
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
