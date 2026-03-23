import sharedConfig from "../../packages/config/tailwind.config";

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [sharedConfig],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/**/*.{js,ts,jsx,tsx,mdx}", // for future shared UI package
  ],
  theme: {
    extend: {
      animation: {
        marquee: "marquee linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      boxShadow: {
        brutal: '0 25px 50px -12px rgba(34, 197, 94, 0.4)'
      }
    },
  },
  plugins: [],
};

export default config;
