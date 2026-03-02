/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [], // overridden by each app
  theme: {
    extend: {
      // ← Add your shared design system here
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};