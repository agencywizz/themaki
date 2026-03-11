import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#0A0A0A",
        "bg-surface": "#1A1A1A",
        accent: "#F97316",
        "accent-light": "#FDBA74",
        "text-primary": "#F5F5F5",
        "text-secondary": "#A3A3A3",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        brand: ["var(--font-outfit)", "sans-serif"],
      },
      keyframes: {
        "slide-in": {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-in": "slide-in 0.3s ease-out",
      },
    },
  },
  plugins: [],
};
export default config;
