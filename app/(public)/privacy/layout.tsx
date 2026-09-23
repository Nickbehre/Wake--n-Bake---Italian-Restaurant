import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Privacybeleid',
  description:
    "Hoe Wake N' Bake Panificio omgaat met je persoonsgegevens bij bestellingen, contact en websitebezoek.",
  path: '/privacy',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
