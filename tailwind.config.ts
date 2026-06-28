import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#FAF7F2",
          2: "#F0EBE3",
          card: "#ffffff",
          dark: "#141210",
          "dark-2": "#1E1B18",
          "dark-card": "#1E1B18",
        },
        fg: {
          DEFAULT: "#1A1613",
          2: "#5C534A",
          3: "#9A918A",
          dark: "#F0EBE3",
          "dark-2": "#A89E95",
          "dark-3": "#6B6158",
        },
        accent: {
          amber: "#E8943A",
          "amber-bright": "#F0A54E",
          coral: "#E85D4A",
          "coral-bright": "#F06E5C",
          terra: "#C45A3C",
          "terra-bright": "#D4694F",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      borderRadius: {
        card: "20px",
        pill: "50px",
      },
      letterSpacing: {
        display: "-0.04em",
        tight: "-0.03em",
      },
      animation: {
        "bounce-slow": "bounce-slow 2.5s infinite",
        "fade-in": "fade-in 0.3s ease",
        "slide-down": "slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "menu-drop": "menu-drop 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "menu-drop": {
          from: { opacity: "0", transform: "translateY(-10px) scale(0.96)" },
          to: { opacity: "1", transform: "translateY(0) scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
