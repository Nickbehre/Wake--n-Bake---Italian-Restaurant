// ============================================
// PRODUCT DATA
// Two menus: Schiacciata Menu (made to order)
// and Wake n' Bake Menu (to go)
// ============================================

import type { Category, Product, ProductExtra } from '@/lib/types/order';
import type { LocationId } from '@/lib/data/locations';

// Shared extras available for coffee & cold drinks
const coffeeExtras: ProductExtra[] = [
  { id: 'extra-large', name: 'Large', price: 1.00, description: 'Upgrade your drink to large.' },
  { id: 'extra-oat-milk', name: 'Oat Milk', price: 0.50 },
  { id: 'extra-syrup', name: 'Syrups', price: 0.50, description: 'Vanilla, Caramel, or Hazelnut.' },
  { id: 'extra-whipped-cream', name: 'Whipped Cream', price: 0.50 },
  { id: 'extra-macchiato', name: 'Macchiato', price: 0.50 },
];

// ─────────────────────────────────────────────
// SCHIACCIATA MENU — Made Fresh to Order
// ─────────────────────────────────────────────

const veggieSchiacciata: Category = {
  id: 'veggie-schiacciata',
  name: 'Veggie Schiacciata',
  menu: 'schiacciata',
  availableAt: ['original'], // Xpress voert standaard alleen het to-go menu; verwijder dit om hier ook te tonen
  products: [
    {
      id: 'schiacciata-caprese',
      name: 'Caprese',
      description: 'Buffalo mozzarella, homemade basil pesto, tomatoes, salt & pepper, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'veggie-schiacciata',
      image: '/assets/menu/caprese.jpg',
    },
    {
      id: 'schiacciata-vegetariana',
      name: 'Vegetariana',
      description: 'Burrata cheese, sun-dried tomatoes, pistachio pesto, crumbled pistachios, fresh basil, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'veggie-schiacciata',
      image: '/assets/menu/Vegetariana.jpg',
    },
    {
      id: 'schiacciata-vegana',
      name: 'Vegana',
      description: 'Eggplant, roasted peppers, caramelised onions, artichokes, tomato creme, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'veggie-schiacciata',
      image: '/assets/menu/Vegana.jpg',
    },
    {
      id: 'schiacciata-regina',
      name: 'Regina',
      description: 'Buffalo mozzarella, roasted eggplant, roasted peppers, fresh basil, tomato creme, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'veggie-schiacciata',
    },
    {
      id: 'schiacciata-gialla',
      name: 'Gialla',
      description: 'Yellow tomatoes, burrata cheese, red peppers, balsamic glaze, rocket, origano, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'veggie-schiacciata',
    },
    {
      id: 'schiacciata-gorgo-noci',
      name: 'Gorgo & Noci',
      description: 'Sweet gorgonzola cheese, walnuts, honey, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'veggie-schiacciata',
    },
    {
      id: 'schiacciata-boscaiola',
      name: 'Boscaiola',
      description: 'Roasted potatoes, roasted peppers, caramelised onion, sweet gorgonzola, rocket.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'veggie-schiacciata',
    },
    {
      id: 'schiacciata-tartufina',
      name: 'Tartufina',
      description: 'Roasted eggplant, provolone, black truffle creme, rocket, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'veggie-schiacciata',
    },
  ],
};

const beefFishSchiacciata: Category = {
  id: 'beef-fish-schiacciata',
  name: 'Beef & Fish Schiacciata',
  menu: 'schiacciata',
  availableAt: ['original'], // Xpress voert standaard alleen het to-go menu; verwijder dit om hier ook te tonen
  products: [
    {
      id: 'schiacciata-vitello-tonnato',
      name: 'Vitello Tonnato',
      description: 'Thinly sliced roastbeef, tuna sauce, capers, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'beef-fish-schiacciata',
      image: '/assets/menu/Vitello Tonnato.jpg',
    },
    {
      id: 'schiacciata-roastbeef-original',
      name: 'Roastbeef Original',
      description: 'Thinly sliced roastbeef, parmesan creme, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'beef-fish-schiacciata',
    },
    {
      id: 'schiacciata-roastbeef-cheesy',
      name: 'Roastbeef Cheesy',
      description: 'Thinly sliced roastbeef, sweet gorgonzola creme, caramelised red onions, rocket, EVO.',
      price: 15.00,
      hasSizes: true,
      priceRegular: 11.00,
      priceLarge: 15.00,
      categoryId: 'beef-fish-schiacciata',
    },
    {
      id: 'schiacciata-roastbeef-truffle',
      name: 'Roastbeef Truffle',
      description: 'Thinly sliced roastbeef, black truffle mayonnaise, provola, rocket, EVO.',
      price: 15.00,
      hasSizes: true,
      priceRegular: 11.00,
      priceLarge: 15.00,
      categoryId: 'beef-fish-schiacciata',
    },
    {
      id: 'schiacciata-bresaola-caprese',
      name: 'Bresaola Caprese',
      description: 'Bresaola, burrata stracciatella, homemade basil pesto, cherry tomatoes, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'beef-fish-schiacciata',
    },
    {
      id: 'schiacciata-bresaola-carpaccio',
      name: 'Bresaola Carpaccio',
      description: 'Bresaola, cherry tomatoes, parmesan creme, balsamic glaze, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'beef-fish-schiacciata',
      image: '/assets/menu/Carpaccio.jpg',
    },
    {
      id: 'schiacciata-bresaola-fresca',
      name: 'Bresaola Fresca',
      description: 'Bresaola, yellow tomatoes, shaved parmesan, roasted peppers, rocket, balsamic glaze, EVO.',
      price: 15.00,
      hasSizes: true,
      priceRegular: 11.00,
      priceLarge: 15.00,
      categoryId: 'beef-fish-schiacciata',
    },
    {
      id: 'schiacciata-tonno',
      name: 'Tonno',
      description: 'Sustainably sourced tuna, cherry tomatoes, caramelised onion, mayonnaise, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'beef-fish-schiacciata',
      image: '/assets/menu/tonno.jpg',
    },
    {
      id: 'schiacciata-tuna-melt',
      name: 'Tuna Melt',
      description: 'Sustainably sourced tuna, mozzarella, caramelised onion, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'beef-fish-schiacciata',
    },
  ],
};

const porkSchiacciata: Category = {
  id: 'pork-schiacciata',
  name: 'Pork Schiacciata',
  menu: 'schiacciata',
  availableAt: ['original'], // Xpress voert standaard alleen het to-go menu; verwijder dit om hier ook te tonen
  products: [
    {
      id: 'schiacciata-mortadella-original',
      name: 'Mortadella Original',
      description: 'Mortadella Bologna PGI, burrata stracciatella, pistachio pesto DOP, crumbled pistachios, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'pork-schiacciata',
      image: '/assets/menu/Mortadella.jpg',
    },
    {
      id: 'schiacciata-mortadella-parmigiana',
      name: 'Mortadella Parmigiana',
      description: 'Mortadella Bologna PGI, roasted eggplant, parmesan creme, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
      image: '/assets/menu/Mortadella Parmigiana.jpg',
    },
    {
      id: 'schiacciata-salame-etna',
      name: 'Salame Etna',
      description: 'Ventricina, caramelised onions, roasted peppers, sweet gorgonzola creme, rocket.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
      image: '/assets/menu/etna.jpg',
    },
    {
      id: 'schiacciata-salame-vesuvio',
      name: 'Salame Vesuvio',
      description: 'Ventricina, burrata stracciatella, roasted peppers, rocket, balsamic glaze.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
    },
    {
      id: 'schiacciata-prosciutto-san-daniele',
      name: 'Prosciutto San Daniele',
      description: 'Prosciutto San Daniele, parmesan creme, cherry tomatoes, rocket, balsamic glaze, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
      image: '/assets/menu/Prosciutto San Daniele.jpg',
    },
    {
      id: 'schiacciata-prosciutto-bufalina',
      name: 'Prosciutto Bufalina',
      description: 'Prosciutto San Daniele, buffalo mozzarella, roasted eggplant, parmesan, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
    },
    {
      id: 'schiacciata-prosciutto-tartufo',
      name: 'Prosciutto & Tartufo',
      description: 'Prosciutto San Daniele, seasonal black truffle, provola cheese, rocket, truffle EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
    },
    {
      id: 'schiacciata-speck-rustico',
      name: 'Speck Rustico',
      description: 'Cured spiced speck, roasted potatoes, roasted peppers, sweet gorgonzola creme, rocket.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
    },
    {
      id: 'schiacciata-speck-valtellina',
      name: 'Speck Valtellina',
      description: 'Cured spiced speck, provola, cherry tomatoes, rocket, EVO.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 12.00,
      categoryId: 'pork-schiacciata',
      image: '/assets/menu/Valtellina.jpg',
    },
    {
      id: 'schiacciata-porchetta-di-ariccia',
      name: 'Porchetta di Ariccia DOP',
      description: 'Roasted pork, burrata stracciatella, rocket, EVO.',
      price: 13.00,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 13.00,
      categoryId: 'pork-schiacciata',
    },
    {
      id: 'schiacciata-porchetta-pistacchiosa',
      name: 'Porchetta Pistacchiosa',
      description: 'Roasted pork, thinly sliced potatoes, caramelised red onions, pistachio mayonnaise, rocket, crumbled pistachios, EVO.',
      price: 15.00,
      hasSizes: true,
      priceRegular: 11.00,
      priceLarge: 15.00,
      categoryId: 'pork-schiacciata',
    },
  ],
};

// ─────────────────────────────────────────────
// WAKE N' BAKE MENU — Ready to Go
// ─────────────────────────────────────────────

const calzoneCategory: Category = {
  id: 'calzone',
  name: 'Calzone',
  menu: 'togo',
  products: [
    {
      id: 'calzone-hot-salami',
      name: 'Calzone Hot Salami',
      description: 'Tomato sauce, mozzarella, hot salami, caramelised onions, peppers.',
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-ham-mushrooms',
      name: 'Calzone Ham & Mushrooms',
      description: 'Tomato sauce, mozzarella, ham, mushrooms.',
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-speck-potatoes',
      name: 'Calzone Speck & Potatoes',
      description: 'Tomato sauce, mozzarella, speck, potatoes.',
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-nduja-mushrooms',
      name: "Calzone N'duja & Mushrooms",
      description: "Tomato sauce, mozzarella, n'duja, mushrooms, black olives.",
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-parmigiana',
      name: 'Calzone Parmigiana',
      description: 'Tomato sauce, mozzarella, eggplants, grana padano, basil.',
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-veggie-deluxe',
      name: 'Calzone Veggie Deluxe',
      description: 'Tomato sauce, mozzarella, mushrooms, peppers, caramelised onions, black olives.',
      price: 9.00,
      categoryId: 'calzone',
    },
  ],
};

const schiacciataTogo: Category = {
  id: 'schiacciata-togo',
  name: 'Schiacciata (To Go)',
  menu: 'togo',
  products: [
    {
      id: 'togo-toscanina',
      name: 'Toscanina',
      description: 'Buffalo mozzarella, fresh tomatoes, basil, EVO.',
      price: 6.00,
      categoryId: 'schiacciata-togo',
    },
    {
      id: 'togo-hot-salami',
      name: 'Hot Salami',
      description: 'Hot salami, provolone, EVO.',
      price: 6.00,
      categoryId: 'schiacciata-togo',
    },
    {
      id: 'togo-speck-provola',
      name: 'Speck & Provola',
      description: 'Cured speck, provolone, EVO.',
      price: 6.00,
      categoryId: 'schiacciata-togo',
    },
    {
      id: 'togo-cotto-formaggio',
      name: 'Cotto & Formaggio',
      description: 'Ham, provolone, EVO.',
      price: 6.00,
      categoryId: 'schiacciata-togo',
    },
  ],
};

const pizzaAlTaglioCategory: Category = {
  id: 'pizza-al-taglio',
  name: 'Pizza Al Taglio',
  menu: 'togo',
  products: [
    {
      id: 'pizza-margherita',
      name: 'Margherita',
      description: 'Tomato sauce, mozzarella, EVO.',
      price: 5.00,
      categoryId: 'pizza-al-taglio',
    },
    {
      id: 'pizza-diavola',
      name: 'Diavola',
      description: 'Tomato sauce, mozzarella, hot salami.',
      price: 6.00,
      categoryId: 'pizza-al-taglio',
    },
    {
      id: 'pizza-cotto-funghi',
      name: 'Cotto & Funghi',
      description: 'Tomato sauce, mozzarella, ham, mushrooms, EVO.',
      price: 6.00,
      categoryId: 'pizza-al-taglio',
    },
    {
      id: 'pizza-veggie',
      name: 'Veggie',
      description: 'Tomato sauce, mozzarella, eggplant, sundried tomatoes, artichokes.',
      price: 6.00,
      categoryId: 'pizza-al-taglio',
    },
  ],
};

const drinksCategory: Category = {
  id: 'drinks',
  name: 'Drinks',
  menu: 'togo',
  products: [
    {
      id: 'water',
      name: 'Water',
      description: '',
      price: 2.50,
      categoryId: 'drinks',
    },
    {
      id: 'coca-cola',
      name: 'Coca Cola',
      description: 'Regular or Zero.',
      price: 2.50,
      categoryId: 'drinks',
    },
    {
      id: 'san-pellegrino',
      name: 'San Pellegrino',
      description: 'Soft Drinks 33cl: Limonata, Chinotto, Aranciata, Aranciata Rossa.',
      price: 3.00,
      categoryId: 'drinks',
    },
    {
      id: 'estathe-ice-tea',
      name: 'Estathé Ice Tea',
      description: 'Lemon or Peach.',
      price: 3.50,
      categoryId: 'drinks',
    },
    {
      id: 'yoga-juice',
      name: 'Yoga Juice',
      description: 'ACE, Ananas, or Peach & Mango.',
      price: 2.50,
      categoryId: 'drinks',
    },
    {
      id: 'ichnusa',
      name: 'Ichnusa',
      description: 'Beer from Sardinia.',
      price: 4.00,
      categoryId: 'drinks',
    },
    {
      id: 'cocktail',
      name: 'Cocktail',
      description: 'Aperol Spritz, Gin Gin Mule, or Paloma.',
      price: 7.00,
      categoryId: 'drinks',
    },
  ],
};

const coffeeHotCategory: Category = {
  id: 'coffee-hot',
  name: 'Coffee',
  menu: 'togo',
  products: [
    {
      id: 'espresso',
      name: 'Espresso / Ristretto',
      description: '',
      price: 2.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'doppio',
      name: 'Doppio',
      description: '',
      price: 3.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'americano',
      name: 'Americano',
      description: '',
      price: 3.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'cappuccino',
      name: 'Cappuccino',
      description: '',
      price: 3.50,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'latte-macchiato',
      name: 'Latte Macchiato',
      description: '',
      price: 3.50,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'flat-white',
      name: 'Flat White',
      description: '',
      price: 4.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'chai-latte',
      name: 'Chai Latte',
      description: '',
      price: 4.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
    {
      id: 'hot-chocolate',
      name: 'Hot Chocolate',
      description: '',
      price: 4.00,
      categoryId: 'coffee-hot',
      availableExtras: coffeeExtras,
    },
  ],
};

const coldDrinksCategory: Category = {
  id: 'cold-drinks',
  name: 'Cold Drinks',
  menu: 'togo',
  products: [
    {
      id: 'iced-latte',
      name: 'Iced Latte',
      description: '',
      price: 4.50,
      categoryId: 'cold-drinks',
      availableExtras: coffeeExtras,
    },
    {
      id: 'iced-americano',
      name: 'Iced Americano',
      description: '',
      price: 3.50,
      categoryId: 'cold-drinks',
      availableExtras: coffeeExtras,
    },
    {
      id: 'milkshake',
      name: 'Milkshake',
      description: 'Nutella, Vanilla, Caramel, Black Cherry, or Pistachio.',
      price: 7.00,
      categoryId: 'cold-drinks',
      availableExtras: coffeeExtras,
    },
  ],
};

const coffeeExtrasCategory: Category = {
  id: 'coffee-extras',
  name: 'Extras',
  menu: 'togo',
  products: [
    {
      id: 'extra-large',
      name: 'Large',
      description: 'Upgrade your drink to large.',
      price: 1.00,
      categoryId: 'coffee-extras',
    },
    {
      id: 'extra-oat-milk',
      name: 'Oat Milk',
      description: '',
      price: 0.50,
      categoryId: 'coffee-extras',
    },
    {
      id: 'extra-syrup',
      name: 'Syrups',
      description: 'Vanilla, Caramel, or Hazelnut.',
      price: 0.50,
      categoryId: 'coffee-extras',
    },
    {
      id: 'extra-whipped-cream',
      name: 'Whipped Cream',
      description: '',
      price: 0.50,
      categoryId: 'coffee-extras',
    },
    {
      id: 'extra-macchiato',
      name: 'Macchiato',
      description: '',
      price: 0.50,
      categoryId: 'coffee-extras',
    },
  ],
};

const dolciCategory: Category = {
  id: 'dolci',
  name: 'Dolci',
  menu: 'togo',
  products: [
    {
      id: 'tiramisu',
      name: 'Tiramisù',
      description: 'Espresso-infused ladyfingers layered with silky mascarpone and cocoa.',
      price: 5.00,
      categoryId: 'dolci',
    },
    {
      id: 'pistachio-tiramisu',
      name: 'Pistachio Tiramisù',
      description: 'Tiramisù classico with cappuccino-dipped ladyfingers and mascarpone cream with Sicilian pistachio paste.',
      price: 7.00,
      categoryId: 'dolci',
    },
    {
      id: 'cannoli',
      name: 'Cannoli',
      description: 'Golden, crunchy cannoli shells filled with sweet ricotta cream. Dipped in chocolate or crushed pistachios.',
      price: 3.00,
      categoryId: 'dolci',
    },
    {
      id: 'pistachio-tarts',
      name: 'Pistachio Tarts',
      description: 'A trio of crisp tartlettes layered with pistachio mascarpone cream and pistachio cream, finished with pistachio crumble.',
      price: 5.00,
      categoryId: 'dolci',
    },
    {
      id: 'cornetto',
      name: 'Cornetto',
      description: 'Freshly baked cornetti.',
      price: 2.50,
      categoryId: 'dolci',
    },
    {
      id: 'cornetto-ripieno',
      name: 'Cornetto Ripieno',
      description: 'Freshly baked cornetti filled with your choice of Nutella, Pistachio cream, or Apricot jam.',
      price: 3.50,
      categoryId: 'dolci',
    },
    {
      id: 'sfogliatella',
      name: 'Sfogliatella',
      description: 'Hand-crafted Neapolitan pastry with crisp, buttery layers embracing a smooth ricotta filling infused with bright citrus notes.',
      price: 3.50,
      categoryId: 'dolci',
    },
    {
      id: 'bombolone',
      name: 'Bombolone',
      description: 'Traditional bombolone. Soft, golden dough filled with classic vanilla crema and dusted with sugar.',
      price: 3.50,
      categoryId: 'dolci',
    },
  ],
};

// ─────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────

/**
 * Schiacciata Menu categories (made to order)
 */
export const schiacciataMenuCategories: Category[] = [
  veggieSchiacciata,
  beefFishSchiacciata,
  porkSchiacciata,
];

/**
 * Wake n' Bake Menu categories (to go)
 */
export const togoMenuCategories: Category[] = [
  calzoneCategory,
  schiacciataTogo,
  pizzaAlTaglioCategory,
  drinksCategory,
  coffeeHotCategory,
  coldDrinksCategory,
  dolciCategory,
];

/**
 * All products organized by category (flat list for compatibility)
 */
export const productCategories: Category[] = [
  ...schiacciataMenuCategories,
  ...togoMenuCategories,
];

/**
 * Get all products as a flat array
 */
export function getAllProducts(): Product[] {
  return productCategories.flatMap((category) => category.products);
}

/**
 * Filter menu categories for a specific location (DISPLAY ONLY — the API/cart/
 * payment layers keep using the full arrays for price validation).
 * A category or product without `availableAt` is shown at every location.
 * Categories left with no visible products are dropped.
 */
export function getMenuForLocation(
  categories: Category[],
  locationId: LocationId
): Category[] {
  return categories
    .filter((cat) => !cat.availableAt || cat.availableAt.includes(locationId))
    .map((cat) => ({
      ...cat,
      products: cat.products.filter(
        (p) => !p.availableAt || p.availableAt.includes(locationId)
      ),
    }))
    .filter((cat) => cat.products.length > 0);
}

/**
 * Get a product by ID
 */
export function getProductById(id: string): Product | undefined {
  return getAllProducts().find((product) => product.id === id);
}

/**
 * Get a category by ID
 */
export function getCategoryById(id: string): Category | undefined {
  return productCategories.find((category) => category.id === id);
}

/**
 * Get products by category ID
 */
export function getProductsByCategoryId(categoryId: string): Product[] {
  const category = getCategoryById(categoryId);
  return category ? category.products : [];
}

/**
 * Search products by name
 */
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return getAllProducts().filter(
    (product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.description.toLowerCase().includes(lowerQuery)
  );
}
