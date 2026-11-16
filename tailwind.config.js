/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        negro: 'var(--color-negro)',
        'gris-oscuro': 'var(--color-gris-oscuro)',
        borde: 'var(--color-borde)',
        blanco: 'var(--color-blanco)',
        'gris-azulado': 'var(--color-gris-azulado)',
        amarillo: 'var(--color-amarillo)',
        rojo: 'var(--color-rojo)',
        'rojo-oscuro': 'var(--color-rojo-oscuro)',
        azul: 'var(--color-azul)',
        verde: 'var(--color-verde)',
        violeta: 'var(--color-violeta)',
        naranja: 'var(--color-naranja)',
        brand: {
          dark: 'var(--color-negro)',
          card: 'var(--color-gris-oscuro)',
          yellow: 'var(--color-amarillo)',
          orange: 'var(--color-naranja)',
          red: 'var(--color-rojo)'
        }
      },
      fontFamily: {
        marca: ['"Lobster"', 'cursive'],
        titulo: ['"Newsreader"', 'Georgia', 'serif'],
        texto: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
