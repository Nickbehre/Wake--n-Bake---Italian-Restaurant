export interface MenuItem {
  id: string
  name: string
  description: string
  price: string
  tags: string[]
  allergens: string[]
  image: string
}

export interface MenuCategory {
  id: string
  name: string
  description: string
  items: MenuItem[]
}

export interface MenuData {
  categories: MenuCategory[]
}

export const menuData: MenuData = {
  categories: [
    {
      id: 'focaccia',
      name: 'Focaccia & Schiacciata',
      description: 'Onze signature gerechten',
      items: [
        {
          id: 'focaccia-mortadella',
          name: 'Focaccia Mortadella e Pistacchio',
          description:
            'Knapperige focaccia met romige mortadella, pistachepesto en burrata',
          price: '€12.50',
          tags: ['populair', 'nieuw'],
          allergens: ['gluten', 'melk', 'noten'],
          image: '/assets/menu/focaccia-mortadella.webp',
        },
        {
          id: 'schiacciata-prosciutto',
          name: 'Schiacciata Prosciutto Crudo',
          description:
            'Verse schiacciata met Italiaanse prosciutto, rucola, Parmezaan en balsamico',
          price: '€11.50',
          tags: ["chef's keuze"],
          allergens: ['gluten', 'melk'],
          image: '/assets/menu/schiacciata-prosciutto.webp',
        },
        {
          id: 'focaccia-vegetariana',
          name: 'Focaccia Vegetariana',
          description: 'Gegrilde groenten, verse mozzarella, basilicum pesto',
          price: '€10.50',
          tags: ['vegetarisch'],
          allergens: ['gluten', 'melk'],
          image: '/assets/menu/focaccia-veg.webp',
        },
        {
          id: 'schiacciata-tonno',
          name: 'Schiacciata Tonno',
          description:
            'Verse tonijn, zongedroogde tomaten, kappertjes en olijven',
          price: '€11.00',
          tags: [],
          allergens: ['gluten', 'vis'],
          image: '/assets/menu/schiacciata-tonno.webp',
        },
      ],
    },
    {
      id: 'ontbijt',
      name: 'Ontbijt',
      description: 'Start je dag Italiaans',
      items: [
        {
          id: 'cornetto-nutella',
          name: 'Cornetto con Nutella',
          description: 'Verse Italiaanse croissant gevuld met Nutella',
          price: '€3.50',
          tags: [],
          allergens: ['gluten', 'melk', 'noten'],
          image: '/assets/menu/cornetto.webp',
        },
        {
          id: 'cornetto-crema',
          name: 'Cornetto con Crema',
          description: 'Verse croissant gevuld met romige banketbakkersroom',
          price: '€3.50',
          tags: [],
          allergens: ['gluten', 'melk', 'ei'],
          image: '/assets/menu/cornetto-crema.webp',
        },
        {
          id: 'cappuccino-cornetto',
          name: 'Cappuccino + Cornetto',
          description: 'De perfecte Italiaanse ochtend combinatie',
          price: '€6.00',
          tags: ['deal'],
          allergens: ['gluten', 'melk', 'noten'],
          image: '/assets/menu/cappuccino-cornetto.webp',
        },
      ],
    },
    {
      id: 'lunch',
      name: 'Lunch Specials',
      description: 'Perfect voor de lunchpauze',
      items: [
        {
          id: 'panino-porchetta',
          name: 'Panino Porchetta',
          description:
            'Slow-cooked Italiaanse porchetta met salie en knoflook',
          price: '€9.50',
          tags: [],
          allergens: ['gluten'],
          image: '/assets/menu/panino-porchetta.webp',
        },
        {
          id: 'insalata-caprese',
          name: 'Insalata Caprese',
          description:
            'Buffelmozzarella, rijpe tomaten, basilicum, extra vergine olijfolie',
          price: '€8.50',
          tags: ['vegetarisch', 'glutenvrij'],
          allergens: ['melk'],
          image: '/assets/menu/caprese.webp',
        },
        {
          id: 'piadina-prosciutto',
          name: 'Piadina Prosciutto e Stracchino',
          description: 'Gevulde Italiaanse flatbread met ham en zachte kaas',
          price: '€10.00',
          tags: [],
          allergens: ['gluten', 'melk'],
          image: '/assets/menu/piadina.webp',
        },
      ],
    },
    {
      id: 'dranken',
      name: 'Dranken',
      description: 'Authentieke Italiaanse koffie en meer',
      items: [
        {
          id: 'espresso',
          name: 'Espresso',
          description: 'Perfecte Italiaanse espresso',
          price: '€2.50',
          tags: [],
          allergens: [],
          image: '/assets/menu/espresso.webp',
        },
        {
          id: 'cappuccino',
          name: 'Cappuccino',
          description: 'Rijke espresso met gestoomde melk',
          price: '€3.50',
          tags: [],
          allergens: ['melk'],
          image: '/assets/menu/cappuccino.webp',
        },
        {
          id: 'latte-macchiato',
          name: 'Latte Macchiato',
          description: 'Gestoomde melk met een vleugje espresso',
          price: '€4.00',
          tags: [],
          allergens: ['melk'],
          image: '/assets/menu/latte.webp',
        },
        {
          id: 'aranciata',
          name: 'Aranciata San Pellegrino',
          description: 'Klassieke Italiaanse sinaasappellimonade',
          price: '€3.00',
          tags: [],
          allergens: [],
          image: '/assets/menu/aranciata.webp',
        },
        {
          id: 'limonata',
          name: 'Limonata San Pellegrino',
          description: 'Verfrissende Italiaanse citroenlimonade',
          price: '€3.00',
          tags: [],
          allergens: [],
          image: '/assets/menu/limonata.webp',
        },
      ],
    },
    {
      id: 'dolci',
      name: 'Dolci',
      description: 'Zoete Italiaanse lekkernijen',
      items: [
        {
          id: 'tiramisu',
          name: 'Tiramisù',
          description: 'Klassiek Italiaans dessert met mascarpone en espresso',
          price: '€5.50',
          tags: ['favoriet'],
          allergens: ['gluten', 'melk', 'ei'],
          image: '/assets/menu/tiramisu.webp',
        },
        {
          id: 'cannolo',
          name: 'Cannolo Siciliano',
          description: 'Krokant buisje gevuld met ricotta en pistache',
          price: '€4.50',
          tags: [],
          allergens: ['gluten', 'melk', 'noten'],
          image: '/assets/menu/cannolo.webp',
        },
        {
          id: 'panna-cotta',
          name: 'Panna Cotta',
          description: 'Romige Italiaanse pudding met rood fruit',
          price: '€5.00',
          tags: ['glutenvrij'],
          allergens: ['melk'],
          image: '/assets/menu/panna-cotta.webp',
        },
      ],
    },
  ],
}
