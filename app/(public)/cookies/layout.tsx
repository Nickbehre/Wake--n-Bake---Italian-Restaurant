import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Cookiebeleid',
  description:
    "Welke cookies de website van Wake N' Bake Panificio gebruikt en hoe je je voorkeuren beheert.",
  path: '/cookies',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
