import { pageMetadata } from '@/lib/seo'

// De pagina zelf is een client component; metadata moet uit een server-bestand komen.
export const metadata = pageMetadata({
  title: 'Contact & catering',
  description:
    "Neem contact op met Wake N' Bake Panificio in Amsterdam (Vijzelstraat 93h en Xpress aan de Heisteeg). Vragen, catering of groepsbestellingen? Stuur ons een bericht.",
  path: '/contact',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
