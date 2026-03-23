/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // <--- Add this line to enable manual dark mode toggling!
  content:[
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Deep blue
        secondary: "#10B981", // Emerald green
        background: "#F3F4F6", // Light gray background
        darkBg: "#0f172a", // Slate-900 for dark mode background
        darkCard: "#1e293b", // Slate-800 for dark mode cards
      }
    },
  },
  plugins:[],
}