import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Online bestellen',
  description:
    "Bestel je schiacciata online en haal hem op bij Wake N' Bake Panificio in Amsterdam, zonder wachtrij.",
  path: '/order',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
