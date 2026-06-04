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
        crust: 'rgb(var(--c-crust) / <alpha-value>)',
        espresso: 'rgb(var(--c-espresso) / <alpha-value>)',
        flour: 'rgb(var(--c-flour) / <alpha-value>)',
        pistachio: 'rgb(var(--c-pistachio) / <alpha-value>)',
        tomato: 'rgb(var(--c-tomato) / <alpha-value>)',
        mortadella: 'rgb(var(--c-mortadella) / <alpha-value>)',
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
