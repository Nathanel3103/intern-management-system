/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'navy': '#1e3a8a',
        'navy-dark': '#1e40af',
        'light-blue': '#3b82f6',
        'light-blue-50': '#eff6ff',
        'light-blue-100': '#dbeafe',
      }
    },
  },
  plugins: [],
}
