/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#FAF6F0',
          100: '#F4EBD9',
          200: '#E6D2B1',
          300: '#D4B483',
          400: '#BA8D52',
          500: '#9C6D34',
          600: '#7F5324',
          700: '#613C17',
          800: '#482B0E',
          900: '#2E1906',
          950: '#1A0D03',
        },
        forest: {
          50: '#F2F9F5',
          100: '#E1F2E9',
          200: '#C2E5D2',
          300: '#94D0B1',
          400: '#5FB58A',
          500: '#389A6B',
          600: '#277D55',
          700: '#206345',
          800: '#1B4E38',
          900: '#163E2D',
          950: '#0C2319',
        },
        terracotta: {
          500: '#C25E3E',
          600: '#A7492A',
          700: '#8A371E',
        },
        warm: {
          50: '#FDFBF7',
          100: '#F7F3EB',
          200: '#EFE7DA',
          300: '#DDD2C0',
          400: '#C2B29A',
          500: '#A49177',
          600: '#7E6D56',
          700: '#5C4E3D',
          800: '#3D3328',
          900: '#211B15',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(46, 25, 6, 0.04)',
        'xs': '0 1px 3px 0 rgba(46, 25, 6, 0.06)',
        'warm-sm': '0 2px 8px -1px rgba(97, 60, 23, 0.08)',
        'warm-md': '0 8px 24px -4px rgba(97, 60, 23, 0.12)',
        'warm-lg': '0 16px 36px -6px rgba(97, 60, 23, 0.16)',
        'warm-xl': '0 24px 48px -12px rgba(46, 25, 6, 0.22)',
        'wood-glow': '0 0 25px rgba(186, 141, 82, 0.25)',
      }
    },
  },
  plugins: [],
}
