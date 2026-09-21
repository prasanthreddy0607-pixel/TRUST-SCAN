/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          gold: '#E5CB90',
          cream: '#FFF3C8',
          teal: '#34A99D',
          ocean: '#458393',
        },
        navy: {
          950: '#0c1218',
          900: '#121b24',
          850: '#192633',
          800: '#233445',
          700: '#32475c',
          600: '#458393',
        },
        risk: {
          low: '#34A99D',    // Teal
          medium: '#d9b86c', // Soft Gold
          high: '#e11d48',   // Rose
        },
        security: {
          accent: '#34A99D',
          cyan: '#458393',
          gold: '#E5CB90',
          cream: '#FFF3C8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'monospace']
      }
    },
  },
  plugins: [],
}
