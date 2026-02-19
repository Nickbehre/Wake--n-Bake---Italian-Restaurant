// ============================================
// PRODUCT DATA
// Two menus: Schiacciata Menu (made to order)
// and Wake n' Bake Menu (to go)
// ============================================

import type { Category, Product, ProductExtra } from '@/lib/types/order';

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

const schiacciataCategoryMadeToOrder: Category = {
  id: 'our-signature-schiacciata',
  name: 'Our Signature Schiacciata',
  menu: 'schiacciata',
  products: [
    {
      id: 'schiacciata-caprese',
      name: 'Schiacciata Caprese',
      description: 'Fiordilatte homemade pesto, tomatoes and evo. Made fresh to order. Vegetarisch',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/caprese.jpg',
    },
    {
      id: 'schiacciata-vegetariana',
      name: 'Schiacciata Vegetariana',
      description: 'Burrata, sun dried tomatoes, crumbled pistachios, fresh basil and evo. Made fresh to order. Vegetarisch en Bevat Noten',
      price: 10.50,
      hasSizes: true,
      priceRegular: 7.50,
      priceLarge: 10.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Vegetariana.jpg',
    },
    {
      id: 'schiacciata-mortadella',
      name: 'Schiacciata Mortadella',
      description: 'Burrata mortadella, pistachio pesto, crumbled pistachios and evo. Made fresh to order. Bevat Noten',
      price: 12.50,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 12.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Mortadella.jpg',
    },
    {
      id: 'schiacciata-etna',
      name: 'Schiacciata Etna',
      description: 'Sweet Gorgonzola creme, calabrese hot salami, caramelised onions, roasted peppers, rocket and spicy evo. Made fresh to order. Pittig',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/etna.jpg',
    },
    {
      id: 'schiacciata-porchetta',
      name: 'Schiacciata Porchetta',
      description: 'Cheese, porchetta di ariccia dop, thin potatoes and caramelised onion. Made fresh to order.',
      price: 12.50,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 12.50,
      categoryId: 'our-signature-schiacciata',
    },
    {
      id: 'schiacciata-valtellina',
      name: 'Schiacciata Valtellina',
      description: 'Cured spiced speck, provola, cherry tomatoes, rocket and evo. Made fresh to order.',
      price: 10.50,
      hasSizes: true,
      priceRegular: 7.50,
      priceLarge: 10.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Valtellina.jpg',
    },
    {
      id: 'schiacciata-san-daniele',
      name: 'Schiacciata San Daniele',
      description: 'Prosciutto di San Daniele, fior di latte, cherry tomatoes, fresh basil and evo. Made fresh to order.',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Prosciutto San Daniele.jpg',
    },
    {
      id: 'schiacciata-vitello-tonnato',
      name: 'Schiacciata Vitello Tonnato',
      description: 'Thinly sliced beef, tuna sauce, capers and rocket. Made fresh to order.',
      price: 12.50,
      hasSizes: true,
      priceRegular: 9.00,
      priceLarge: 12.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Vitello Tonnato.jpg',
    },
    {
      id: 'schiacciata-parmigiana',
      name: 'Schiacciata Parmigiana',
      description: 'Mortadella, roasted eggplant, grana padano creme, rocket and evo. Made fresh to order.',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Mortadella Parmigiana.jpg',
    },
    {
      id: 'schiacciata-bresaola',
      name: 'Schiacciata Bresaola',
      description: 'Bresaola Della valtellina, cherry tomatoes, rocket, shaved Parmesan, balsamic glaze and evo. Made fresh to order.',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Carpaccio.jpg',
    },
    {
      id: 'schiacciata-vegana',
      name: 'Schiacciata Vegana',
      description: 'Eggplant roasted peppers, caramelised red onions, artichokes, zucchini, almond and basil creme, rocket and evo. Made fresh to order. Vegan en Bevat Noten',
      price: 11.50,
      hasSizes: true,
      priceRegular: 8.00,
      priceLarge: 11.50,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/Vegana.jpg',
    },
    {
      id: 'schiacciata-tonno',
      name: 'Schiacciata Tonno',
      description: 'Sustainably sourced tuna, cherry tomatoes, red onions, mayonnaise, mixed salad and evo. Made fresh to order.',
      price: 12.00,
      hasSizes: true,
      priceRegular: 8.50,
      priceLarge: 12.00,
      categoryId: 'our-signature-schiacciata',
      image: '/assets/menu/tonno.jpg',
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
      description: 'Tomato sauce, mozzarella, hot salami, caramelised onions, peppers. Pittig',
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
      description: "Tomato sauce, mozzarella, n'duja, mushrooms, black olives. Pittig",
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-parmigiana',
      name: 'Calzone Parmigiana',
      description: 'Tomato sauce, mozzarella, eggplants, grana padano, basil. Vegetarisch',
      price: 9.00,
      categoryId: 'calzone',
    },
    {
      id: 'calzone-veggie-deluxe',
      name: 'Calzone Veggie Deluxe',
      description: 'Tomato sauce, mozzarella, mushrooms, peppers, caramelised onions, black olives. Vegetarisch',
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
      description: 'Buffalo mozzarella, fresh tomatoes, basil, EVO. Vegetarisch',
      price: 6.00,
      categoryId: 'schiacciata-togo',
    },
    {
      id: 'togo-hot-salami',
      name: 'Hot Salami',
      description: 'Hot salami, provolone, EVO. Pittig',
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
      description: 'Tomato sauce, mozzarella, EVO. Vegetarisch',
      price: 5.00,
      categoryId: 'pizza-al-taglio',
    },
    {
      id: 'pizza-diavola',
      name: 'Diavola',
      description: 'Tomato sauce, mozzarella, hot salami. Pittig',
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
      description: 'Tomato sauce, mozzarella, eggplant, sundried tomatoes, artichokes. Vegetarisch',
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
      name: 'Estath\u00E9 Ice Tea',
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
      name: 'Tiramis\u00F9',
      description: 'Espresso-infused ladyfingers layered with silky mascarpone and cocoa.',
      price: 5.00,
      categoryId: 'dolci',
    },
    {
      id: 'pistachio-tiramisu',
      name: 'Pistachio Tiramis\u00F9',
      description: 'Tiramis\u00F9 classico with cappuccino-dipped ladyfingers and mascarpone cream with Sicilian pistachio paste. Bevat Noten',
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
      description: 'A trio of crisp tartlettes layered with pistachio mascarpone cream and pistachio cream, finished with pistachio crumble. Bevat Noten',
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
// ALSO AVAILABLE
// ─────────────────────────────────────────────

const wakeNBakeDeals: Category = {
  id: 'wake-n-bake-deals',
  name: "Wake N' Bake DEALS",
  products: [
    {
      id: 'couples-deal',
      name: 'Couples Deal',
      description: 'Choose 2 Signature Schiacciata, 2 Drinks and dessert.',
      price: 27.50,
      categoryId: 'wake-n-bake-deals',
    },
    {
      id: 'pizza-box-share-deal',
      name: 'Pizza Box Share Deal',
      description: 'Pick 4 pizza flavours, pay 3!',
      price: 25.00,
      categoryId: 'wake-n-bake-deals',
    },
  ],
};

const biscottiCategory: Category = {
  id: 'biscotti',
  name: 'Biscotti',
  products: [
    {
      id: 'galletti',
      name: 'Galletti',
      description: '350 g Mulino Bianco Galletti 350g Biscotti Con Latte Fresco. Shortbread biscuits with high-quality fresh milk.',
      price: 4.00,
      categoryId: 'biscotti',
    },
    {
      id: 'tarallucci',
      name: 'Tarallucci',
      description: '350 g Mulino Bianco Tarallucci Shortbread Biscuits 350g - Made with Fresh Eggs',
      price: 4.00,
      categoryId: 'biscotti',
    },
    {
      id: 'macine',
      name: 'Macine',
      description: '350 g Mulino Bianco Macine: Classic Biscuits with Fresh Cream - 350g',
      price: 4.00,
      categoryId: 'biscotti',
    },
    {
      id: 'cuor-di-mela',
      name: 'Cuor di Mela',
      description: '250 g A Soft Heart of Apple in Every Bite',
      price: 5.00,
      categoryId: 'biscotti',
    },
    {
      id: 'abbracci',
      name: 'Abbracci',
      description: "350 g Mulino Bianco Abbracci Cacao and Cream Cookies. Experience the Warmth of Abbracci: Mulino Bianco's Biscuits of Hugs",
      price: 5.00,
      categoryId: 'biscotti',
    },
    {
      id: 'nascondini',
      name: 'Nascondini',
      description: "330 g Mulino Bianco's Nascondini are shortbread cookies with chocolate. A delicious pastry ideal for dipping, that hides a delicious chocolate to bite.",
      price: 5.00,
      categoryId: 'biscotti',
    },
    {
      id: 'baiocchi-nocciola',
      name: 'Mulino Bianco Baiocchi con Crema alla Nocciola e Cacao',
      description: '260 g Italian Biscuits filled with a Hazelnut & Chocolate cream filling',
      price: 6.00,
      categoryId: 'biscotti',
    },
    {
      id: 'baiocchi-pistacchio',
      name: 'Mulino Bianco Baiocchi Pistacchio',
      description: '168 g Mulino Bianco Baiocchi Pistachio Cream Biscuits. Pistachio Delight in a Perfectly Portable Size',
      price: 6.00,
      categoryId: 'biscotti',
    },
    {
      id: 'pan-di-stelle',
      name: 'Pan di Stelle',
      description: '350 g Mulino Bianco - Il Biscotto Chocolate Cacao',
      price: 5.00,
      categoryId: 'biscotti',
    },
    {
      id: 'gocciole',
      name: 'Gocciole',
      description: 'Pavesi Gocciole - Chocolate Chip Cookies Biscotti',
      price: 6.00,
      categoryId: 'biscotti',
    },
    {
      id: 'loacker-napolitaner',
      name: 'Loacker Classic Napolitaner',
      description: 'Three crispy wafers and two layers of delicious Napolitaner cream filling with exquisite Italian hazelnuts make this Classic Napolitaner an absolute best-seller.',
      price: 5.00,
      categoryId: 'biscotti',
    },
    {
      id: 'loacker-vanilla',
      name: 'Loacker Classic Vanilla',
      description: 'The fragrance of two generous layers of delicate cream filling made with exquisite vanilla pods between three layers of crispy wafer will guarantee truly exquisite moments of pleasure.',
      price: 5.00,
      categoryId: 'biscotti',
    },
  ],
};

const italianPantry: Category = {
  id: 'italian-pantry',
  name: 'Italian Pantry',
  products: [
    {
      id: 'gusto-etna-pistachio-cream',
      name: 'Gusto Etna Sweet Pistachio Cream',
      description: '190 g Rich and creamy, this decadent pistachio spread is perfect on our fresh focaccia, croissants, or simply by the spoonful.',
      price: 8.50,
      categoryId: 'italian-pantry',
    },
    {
      id: 'trucillo-coffee-beans-1kg',
      name: 'Trucillo Coffee Beans 1Kg',
      description: 'Trucillo Coffee Beans \u2013 Miscela Bar (1kg) \u2013 A premium Italian espresso blend crafted for barista-quality results. Rich aroma, full body, and a smooth, balanced taste in every cup.',
      price: 35.00,
      categoryId: 'italian-pantry',
    },
    {
      id: 'basso-evoo',
      name: 'Basso Extra Virgin Olive Oil',
      description: 'Basso Extra Virgin Olive Oil (1L) \u2013 High-quality Italian EVOO with a smooth, balanced flavor. Ideal for dressing, cooking, and everyday Mediterranean dishes.',
      price: 15.00,
      categoryId: 'italian-pantry',
    },
    {
      id: 'basso-chili-evoo',
      name: 'Basso Chili EVOO',
      description: 'Basso Chili-Infused EVOO \u2013 Extra virgin olive oil with a spicy kick of chili. Perfect for drizzling over pizza, pasta, grilled meats, or anything that needs a bold, flavorful heat.',
      price: 10.00,
      categoryId: 'italian-pantry',
    },
    {
      id: 'di-martino-pasta-giftbox',
      name: 'Di Martino Pasta Set Giftbox',
      description: 'Di Martino Pasta Gift Box \u2013 A premium selection of authentic Italian pasta beautifully packaged for gifting. Made with 100% durum wheat and bronze-drawn for perfect texture.',
      price: 55.00,
      categoryId: 'italian-pantry',
    },
    {
      id: 'ciobar-classico',
      name: 'Ciobar Classico',
      description: 'Ciobar \u2013 Italian Hot Chocolate. Iconic Italian drinking chocolate, thick, rich, and intensely chocolatey.',
      price: 6.50,
      categoryId: 'italian-pantry',
    },
    {
      id: 'trucillo-cremoso-ground-coffee',
      name: 'Trucillo Cremoso Ground Coffee 250g',
      description: 'Premium Italian ground coffee by Trucillo, crafted for a smooth, full-bodied espresso with a rich crema.',
      price: 8.50,
      categoryId: 'italian-pantry',
    },
    {
      id: 'trucillo-moka-ground-coffee',
      name: 'Trucillo Moka Ground Coffee',
      description: 'Authentic Italian ground coffee by Trucillo, expertly blended for moka pot. Rich and full-bodied with smooth crema.',
      price: 8.50,
      categoryId: 'italian-pantry',
    },
  ],
};

const pastaCategory: Category = {
  id: 'pasta',
  name: 'Pasta',
  products: [
    {
      id: 'malloreddus-gnocchetti-sardi',
      name: 'Malloreddus Gnocchetti Sardi',
      description: 'Traditional Sardinian pasta made from durum wheat, shaped into small ridged shells that perfectly hold sauce.',
      price: 6.00,
      categoryId: 'pasta',
    },
    {
      id: 'fregola-tostata',
      name: 'Fregola Tostata',
      description: 'Traditional Sardinian toasted pasta made from semolina, rolled into small pearls and gently oven-roasted for a nutty, rich flavor.',
      price: 6.00,
      categoryId: 'pasta',
    },
    {
      id: 'mezzi-rigatoni-di-martino',
      name: 'Mezzi Rigatoni Di Martino',
      description: 'Premium Italian pasta from Gragnano, crafted by Di Martino using 100% Italian durum wheat and bronze dies.',
      price: 5.00,
      categoryId: 'pasta',
    },
    {
      id: 'rigatoni-di-martino',
      name: 'Rigatoni Di Martino',
      description: 'Authentic pasta from Gragnano by Di Martino, made with 100% Italian durum wheat and bronze-cut.',
      price: 5.00,
      categoryId: 'pasta',
    },
    {
      id: 'penne-mezzani-rigate-di-martino',
      name: 'Penne Mezzani Rigate Di Martino',
      description: 'Classic Italian pasta from Gragnano by Di Martino, made with 100% Italian durum wheat and bronze-cut.',
      price: 5.00,
      categoryId: 'pasta',
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
  schiacciataCategoryMadeToOrder,
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
 * Additional categories (not part of either core menu)
 */
export const additionalCategories: Category[] = [
  wakeNBakeDeals,
  biscottiCategory,
  italianPantry,
  pastaCategory,
];

/**
 * All products organized by category (flat list for compatibility)
 */
export const productCategories: Category[] = [
  ...schiacciataMenuCategories,
  ...togoMenuCategories,
  ...additionalCategories,
];

/**
 * Get all products as a flat array
 */
export function getAllProducts(): Product[] {
  return productCategories.flatMap((category) => category.products);
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
