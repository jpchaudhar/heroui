/******** Tailwind Config ********/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          teal: {
            50: '#e6fffb',
            100: '#b3fff3',
            200: '#80ffee',
            300: '#4df5e3',
            400: '#22d3c7',
            500: '#14b8a6',
            600: '#0ea49a',
            700: '#0c8a84',
            800: '#0b6f6b',
            900: '#0a5b57'
          },
          blue: {
            900: '#0b1736',
            800: '#10234e',
            700: '#153063'
          },
          gray: {
            50: '#f1f5f9',
            100: '#e2e8f0',
            200: '#cbd5e1',
            300: '#94a3b8',
            400: '#64748b',
            500: '#475569'
          }
        }
      },
      boxShadow: {
        card: '0 6px 20px rgba(16, 35, 78, 0.12)'
      }
    },
  },
  plugins: [],
};