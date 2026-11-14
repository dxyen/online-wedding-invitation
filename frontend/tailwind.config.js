/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: '#FAF6F0', dark: '#F5EEE3', deeper: '#EDE3D3' },
        brown: { DEFAULT: '#6B4F3A', light: '#8B6F47', dark: '#4A3428', soft: '#A68A6B' },
        gold: { DEFAULT: '#C9A227', light: '#D4AF37', soft: '#E6C87A' }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        hand: ['"Dancing Script"', 'cursive'],
        sans: ['"Be Vietnam Pro"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
