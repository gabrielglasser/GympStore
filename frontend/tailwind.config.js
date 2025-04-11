/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#E31937',
        'primary-dark': '#C41730',
        secondary: '#FFD700',
        'text-primary': '#111111',
        'text-secondary': '#666666',
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}