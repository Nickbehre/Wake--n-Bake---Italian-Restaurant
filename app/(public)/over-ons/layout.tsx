import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Over ons — ons verhaal',
  description:
    "Drie Italiaanse vrienden, één droom: de authentieke smaken van Italië naar Amsterdam brengen. Elke ochtend vers deeg, met bloem en ingrediënten rechtstreeks uit Italië.",
  path: '/over-ons',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
