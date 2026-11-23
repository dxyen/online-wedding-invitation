/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Tokens port từ thiệp artifact thiep-cuoi-hien-dai (:root).
        cream: { DEFAULT: '#f9f1e6', dark: '#f2e6d2', deeper: '#f7ecdc' },
        paper: { DEFAULT: '#fffaf2', 2: '#faf1e3' },
        brown: { DEFAULT: '#6f4e37', light: '#8B6F47', dark: '#402d1c', mid: '#8a6a51', soft: '#A68A6B' },
        gold: { DEFAULT: '#c2a077', light: '#d9b98a', soft: '#e8d5b5' },
        tan: { DEFAULT: '#c2a077', soft: '#e8d5b5' },
        line: '#e6d7bf',
        ink: { DEFAULT: '#4c3a29', soft: '#8d7c6b' }
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
