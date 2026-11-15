/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#070C16',
          card: '#111A2E',
          yellow: '#FFB800',
          orange: '#FF6B00',
          red: '#EF4444'
        }
      }
    },
  },
  plugins: [],
};
