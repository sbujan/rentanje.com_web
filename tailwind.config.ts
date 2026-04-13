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
          audio: "#6366F1",
          events: "#F05554",
          grill: "#F97316",
          camp: "#22C55E",
          tools: "#EAB308",
          other: "#8B5CF6",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
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
