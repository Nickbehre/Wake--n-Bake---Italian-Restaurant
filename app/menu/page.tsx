import { Metadata } from 'next'
import MenuCategory from '@/components/menu/MenuCategory'
import MenuPDFButton from '@/components/menu/MenuPDFButton'
import { menuData } from '@/lib/data/menu'

export const metadata: Metadata = {
  title: "Menu | Wake N' Bake Panificio",
  description:
    'Ontdek ons menu met verse focaccia, schiacciata, Italiaanse broodjes en specialiteiten.',
}

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-flour pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-montserrat font-bold text-5xl md:text-6xl mb-6 text-espresso">
            ONS MENU
          </h1>
          <p className="text-xl text-espresso/80 max-w-2xl mx-auto mb-8">
            Alle producten worden dagelijks vers voor je gemaakt met authentieke
            Italiaanse ingrediënten.
          </p>
          <MenuPDFButton />
        </div>

        {/* Category Navigation */}
        <nav className="flex flex-wrap justify-center gap-4 mb-16">
          {menuData.categories.map((category) => (
            <a
              key={category.id}
              href={`#${category.id}`}
              className="px-6 py-2 bg-white shadow-md font-montserrat font-semibold text-espresso hover:bg-crust hover:text-espresso transition-colors"
            >
              {category.name}
            </a>
          ))}
        </nav>

        {/* Menu Categories */}
        <div className="space-y-20">
          {menuData.categories.map((category) => (
            <MenuCategory key={category.id} category={category} />
          ))}
        </div>

        {/* Allergen Info */}
        <div className="mt-20 p-8 bg-mortadella/20 text-center">
          <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
            Allergeneninformatie
          </h3>
          <p className="text-espresso/80 max-w-2xl mx-auto">
            Heb je een allergie of dieetwens? Laat het ons weten! We bereiden
            onze producten met zorg, maar er kan kruisbesmetting optreden in
            onze keuken.
          </p>
        </div>
      </div>
    </div>
  )
}
