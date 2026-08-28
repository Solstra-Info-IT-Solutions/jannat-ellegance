import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        maroon: {
          50: '#fff0f3',
          100: '#ffe1e6',
          150: '#ffd3dc',
          200: '#ffc7d1',
          250: '#ffb5c2',
          300: '#ffa1b2',
          350: '#ff8ea3',
          400: '#ff6b87',
          450: '#fc5274',
          500: '#f93a62',
          600: '#e31b4b',
          650: '#ce153f',
          700: '#b80c36',
          800: '#8c092a',
          850: '#720821',
          900: '#610720',
          950: '#4a0e17',
        },
        pink: {
          650: '#cf1454',
          850: '#811035',
        },
        gray: {
          450: '#8a8f98',
        },
        green: {
          150: '#dcfce7',
        },
        red: {
          650: '#c51d3d',
        },
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(74, 14, 23, 0.1)',
        'luxury-hover': '0 30px 60px -20px rgba(74, 14, 23, 0.15)',
      }
    },
  },
  plugins: [],
};
export default config;
