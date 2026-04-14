import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          primary: "#F05554",
          dark: "#C93F3E",
          light: "#FDE8E8",
          accent1: "#FFB347",
          accent2: "#4ECDC4",
          accent3: "#A78BFA",
          darkBg: "#1A1A2E",
          text: "#2D2D2D",
          muted: "#6B7280",
        },
        category: {
          audio:  "#01D2D6",
          events: "#FF6B6B",
          grill:  "#FF8E6C",
          camp:   "#6EE7B7",
          tools:  "#FFD166",
          other:  "#BCA7F0",
        },
      },
      fontFamily: {
        display: ["var(--font-open-sans)", "sans-serif"],
        sans:    ["var(--font-open-sans)", "sans-serif"],
        mono:    ["var(--font-open-sans)", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "20px",
        xl: "32px",
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,0.07)",
      },
    },
  },
  plugins: [typography],
};
export default config;
