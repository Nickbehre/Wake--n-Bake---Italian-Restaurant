import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        crust: '#D4A056',
        espresso: '#2C2C2C',
        flour: '#F9F7F2',
        pistachio: '#93C572',
        tomato: '#CE2029',
        mortadella: '#EFBDBD',
      },
      fontFamily: {
        montserrat: ['var(--font-montserrat)', 'sans-serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        oswald: ['var(--font-oswald)', 'sans-serif'],
        comodo: ['"Comodo Stamp"', 'cursive'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
