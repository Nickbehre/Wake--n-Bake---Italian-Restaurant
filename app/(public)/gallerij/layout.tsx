import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Galerij',
  description:
    "Foto's van onze vers gebakken schiacciata, focaccia en de winkels van Wake N' Bake Panificio in Amsterdam.",
  path: '/gallerij',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
