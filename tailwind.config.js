/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        negro: '#050b1a',
        'gris-oscuro': '#0a1428',
        borde: '#1b2a4a',
        blanco: '#f4f7ff',
        'gris-azulado': '#9aa8c4',
        amarillo: '#ffc72c',
        rojo: '#f2384f',
        'rojo-oscuro': '#521719',
        azul: '#3b82f6',
        verde: '#22c58b',
        violeta: '#a78bfa',
        naranja: '#f59e0b',
        brand: {
          dark: '#050b1a',
          card: '#0a1428',
          yellow: '#ffc72c',
          orange: '#f59e0b',
          red: '#f2384f'
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
