/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Class Measures Brand Colors
        primary: '#c55c5c',    // Coral red from your logo
        secondary: '#f4c842',   // Golden yellow from your logo
        dark: '#1e1e3c',       // Dark navy from your logo
        light: '#f8fafc',      // Light background
      },
      borderWidth: {
        '3': '3px',
      }
    },
  },
  plugins: [],
}