/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#121212',
          secondary: '#1E1E1E',
          text: '#E0E0E0',
          accent: '#BB86FC',
          background: '#121212',
          surface: '#1E1E1E',
          error: '#CF6679'
        }
      },
      backgroundColor: {
        dark: {
          primary: '#121212',
          secondary: '#1E1E1E',
          accent: '#BB86FC'
        }
      },
      textColor: {
        dark: {
          text: '#E0E0E0',
          accent: '#BB86FC'
        }
      }
    },
  },
  plugins: [],
};