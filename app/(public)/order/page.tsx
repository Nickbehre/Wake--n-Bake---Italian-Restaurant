'use client';

import { productCategories } from '@/lib/data/products';
import CategorySection from '@/components/order/CategorySection';
import OrderCartDrawer from '@/components/order/OrderCartDrawer';

export default function OrderPage() {
  return (
    <div className="min-h-screen bg-flour pt-36 md:pt-40 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 mt-4 md:mt-8">
          <h1 className="font-comodo text-5xl md:text-6xl mb-6 text-espresso">
            Order Online
          </h1>
          <p className="text-xl text-espresso/80 max-w-2xl mx-auto">
            Browse our menu and add items to your cart. Choose delivery via Thuisbezorgd
            or pick-up at our store.
          </p>
        </div>

        {/* Category Navigation */}
        <nav className="sticky top-24 z-30 bg-flour/95 backdrop-blur-sm py-4 mb-12 -mx-4 px-4 border-b border-espresso/10">
          <div className="flex flex-wrap justify-center gap-3">
            {productCategories.map((category) => (
              <a
                key={category.id}
                href={`#${category.id}`}
                className="px-4 py-2 bg-white shadow-sm font-montserrat font-semibold text-sm text-espresso hover:bg-crust hover:text-espresso transition-colors rounded-full"
              >
                {category.name}
              </a>
            ))}
          </div>
        </nav>

        {/* Menu Categories */}
        <div className="space-y-20">
          {productCategories.map((category) => (
            <CategorySection key={category.id} category={category} />
          ))}
        </div>

        {/* Info Note */}
        <div className="mt-20 p-8 bg-mortadella/20 rounded-lg text-center">
          <h3 className="font-montserrat font-bold text-xl mb-4 text-espresso">
            Allergen Information
          </h3>
          <p className="text-espresso/80 max-w-2xl mx-auto">
            Please inform our staff of any allergies or dietary requirements when
            placing your order. Full allergen information is available upon
            request.
          </p>
        </div>
      </div>

      {/* Cart Drawer */}
      <OrderCartDrawer />
    </div>
  );
}
