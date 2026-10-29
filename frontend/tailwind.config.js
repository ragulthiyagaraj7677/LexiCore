/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          900: '#0B132B',
          800: '#1C2541',
          700: '#3A506B',
          600: '#4F6D7A',
          gold: '#C5A880',
          'gold-light': '#E5D4B8',
          accent: '#00C49F',
          danger: '#E63946',
          warning: '#F4A261',
        }
      },
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

