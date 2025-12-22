/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#EE1C47',
        secondary: '#FF823A',
        dark: '#09153D',
        graytext: '#676C7B',
      },
    },
  },
  plugins: [],
}
