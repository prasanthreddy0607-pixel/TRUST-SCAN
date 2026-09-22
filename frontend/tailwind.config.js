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
        biscuit: {
          50: '#FDF7E4',
          100: '#FAEED1',
          200: '#EEDCB2',
          300: '#DCC391',
          400: '#C7A770',
          500: '#A87F52',
          600: '#8B6338',
          700: '#6E4A28',
          800: '#52351B',
          900: '#392210',
          950: '#241408',
        },
        royal: {
          50: '#FDF7E4',
          100: '#FAEED1',
          200: '#E4C39C',
          300: '#D39F67',
          400: '#C48443',
          500: '#A86B2F',
          600: '#8B5320',
          700: '#6B3E16',
          800: '#4C290E',
          900: '#331A08',
          950: '#1C110A',
        },
        brand: {
          brown: '#8B5320',
          amber: '#C88232',
          gold: '#D99443',
          biscuit: '#FAEED1',
          cream: '#FDF7E4',
          espresso: '#1C110A',
        },
        navy: {
          950: '#1C110A',
          900: '#281B12',
          850: '#382619',
          800: '#4A3324',
          700: '#5C3F2E',
          600: '#8B5320',
        },
        risk: {
          low: '#2E7D5E',    // Warm Jade
          medium: '#B87322', // Royal Amber
          high: '#C0392B',   // Warm Crimson
        },
        security: {
          accent: '#8B5320',
          cyan: '#A86B2F',
          gold: '#D99443',
          cream: '#FDF8F0',
        }
      },
      fontFamily: {
        sans: ['"Cutive Mono"', 'monospace'],
        body: ['"Cutive Mono"', 'monospace'],
        mono: ['"Cutive Mono"', 'monospace'],
        heading: ['"Anonymous Pro"', 'monospace'],
        button: ['"Anonymous Pro"', 'monospace']
      },
      fontSize: {
        '2xs': ['0.75rem', { lineHeight: '1.125rem' }],
        'xs': ['0.85rem', { lineHeight: '1.25rem' }],
        'sm': ['0.95rem', { lineHeight: '1.375rem' }],
        'base': ['1.05rem', { lineHeight: '1.5rem' }],
        'lg': ['1.18rem', { lineHeight: '1.75rem' }],
        'xl': ['1.3rem', { lineHeight: '1.875rem' }],
        '2xl': ['1.6rem', { lineHeight: '2.125rem' }],
        '3xl': ['1.95rem', { lineHeight: '2.4rem' }]
      }
    },
  },
  plugins: [],
}
