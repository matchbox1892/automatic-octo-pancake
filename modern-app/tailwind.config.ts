import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx,yaml,yml,json}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5fbff",
          100: "#e1f3ff",
          200: "#b9e0ff",
          300: "#89c7ff",
          400: "#58a8ff",
          500: "#2d83ff",
          600: "#1763db",
          700: "#124ebb",
          800: "#144097",
          900: "#133673"
        }
      }
    }
  },
  plugins: []
};

export default config;
