// Shared brand scale keeps the existing wood/forest utilities consistent across pages.
const brand = {
  50: '#FDF2EF',
  100: '#F9E1DB',
  200: '#F0BFB5',
  300: '#E49587',
  400: '#D66D5E',
  500: '#C54D42',
  600: '#B43835',
  700: '#962B2B',
  800: '#79252A',
  900: '#562127',
  950: '#34151B',
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand,
        wood: brand,
        forest: brand,
        terracotta: {
          500: '#C54D42',
          600: '#B43835',
          700: '#962B2B',
        },
        warm: {
          50: '#FAF7F2',
          100: '#F3EDE5',
          200: '#E6DCD0',
          300: '#D5C6B7',
          400: '#AD9888',
          500: '#806B60',
          600: '#6F5D53',
          700: '#57483F',
          800: '#3B312D',
          900: '#2C2522',
          950: '#1D1816',
        },
        amber: {
          50: '#FCF7ED',
          100: '#F7ECD3',
          200: '#EFDAAA',
          300: '#E3C17F',
          400: '#D6A555',
          500: '#C58D43',
          600: '#A66B2F',
          700: '#865027',
          800: '#6F4126',
          900: '#5D3724',
          950: '#351D11',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(52, 21, 27, 0.04)',
        'xs': '0 1px 3px 0 rgba(52, 21, 27, 0.06)',
        'warm-sm': '0 2px 8px -1px rgba(86, 33, 39, 0.08)',
        'warm-md': '0 8px 24px -4px rgba(86, 33, 39, 0.12)',
        'warm-lg': '0 16px 36px -6px rgba(86, 33, 39, 0.16)',
        'warm-xl': '0 24px 48px -12px rgba(52, 21, 27, 0.22)',
        'wood-glow': '0 0 25px rgba(180, 56, 53, 0.18)',
      }
    },
  },
  plugins: [],
}
