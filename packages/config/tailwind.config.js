/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
     "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ], // overridden by each app
  theme: {
                extend: {
                    colors: {
                        brand: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            300: '#86efac',
                            400: '#4ade80',
                            500: '#22c55e', // Green primary
                            600: '#16a34a',
                            900: '#14532d',
                            lime: '#d9f99d',
                            accent: '#6366f1', // Indigo secondary
                            dark: '#0f172a',
                        }
                    },
                    fontFamily: {
                        display: ['Clash Display', 'sans-serif'],
                        sans: ['Satoshi', 'sans-serif'],
                    },
                    backgroundImage: {
                        'grid-pattern': "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)",
                    },
                    boxShadow: {
                        'brutal': '4px 4px 0px 0px rgba(0,0,0,1)',
                        'brutal-sm': '2px 2px 0px 0px rgba(0,0,0,1)',
                        'brutal-lg': '8px 8px 0px 0px rgba(0,0,0,1)',
                    }
                }
            },
  plugins: [],
};