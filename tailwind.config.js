/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        accent: {
          light: "#C5A059",
          dark: "#D4AF37",
        },
        background: {
          light: "#F0EBE0",
          dark: "#080808",
        },
        card: {
          light: "rgba(255, 255, 255, 0.6)",
          dark: "rgba(15, 15, 15, 0.6)",
        },
        border: {
          light: "rgba(197, 160, 89, 0.2)",
          dark: "rgba(212, 175, 55, 0.15)",
        }
      },
      fontFamily: {
        display: ["'Cinzel'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.1)',
        'premium-hover': '0 20px 40px -10px rgba(197, 160, 89, 0.15), inset 0 0 0 1px rgba(197, 160, 89, 0.2)',
        'premium-dark': '0 10px 40px -10px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.05)',
        'premium-hover-dark': '0 20px 40px -10px rgba(212, 175, 55, 0.15), inset 0 0 0 1px rgba(212, 175, 55, 0.1)',
      },
    },
  },
  plugins: [],
}
