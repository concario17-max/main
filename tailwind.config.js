/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1A1A1A",
        accent: {
          light: "#C5A059", // Champagne Gold
        },
        background: {
          light: "#F5F5F0", // Soft Hotel Beige
        },
        card: {
          light: "rgba(255, 255, 255, 0.4)",
        },
        border: {
          light: "rgba(197, 160, 89, 0.15)",
        }
      },
      fontFamily: {
        display: ["'Cinzel'", "'Noto Serif KR'", "serif"],
        body: ["'Inter'", "'Noto Sans KR'", "sans-serif"],
      },
      boxShadow: {
        'premium': '0 10px 40px -10px rgba(0,0,0,0.05), inset 0 0 0 1px rgba(255,255,255,0.1)',
        'premium-hover': '0 20px 40px -10px rgba(197, 160, 89, 0.15), inset 0 0 0 1px rgba(197, 160, 89, 0.2)',
      },
    },
  },
  plugins: [],
}
