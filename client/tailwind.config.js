/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#c55c5c',    // Class Measures Red/Coral
        secondary: '#f4c842',   // Class Measures Golden Yellow
        dark: '#1e1e3c',       // Class Measures Dark Navy
        light: '#f8fafc',      // Light background
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}
