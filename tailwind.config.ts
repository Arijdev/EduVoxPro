import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 60% Dominant Colors: Crisp, modern light canvas
        background: "#F8FAFC",   // Slate-50 main body background
        surface: {
          DEFAULT: "#FFFFFF",    // Pure white card/container backgrounds
          50: "#FFFFFF",
          100: "#F1F5F9",        // Slate-100: secondary section backgrounds
          200: "#E2E8F0",        // Slate-200: borders & structural lines
          300: "#CBD5E1",        // Slate-300: subtle divider lines
          400: "#94A3B8",        // Slate-400: placeholder / muted
        },
        // 10% Accent Colors: Electric Indigo, Sky & Emerald
        accent: {
          indigo: "#4F46E5",     // Primary CTAs & active highlights
          indigoHover: "#4338CA",
          cyan: "#0284C7",       // Interactive links & secondary highlights
          emerald: "#059669",    // Free badges & success states
        },
        brand: {
          indigo: "#4F46E5",
          cyan: "#0284C7",
          emerald: "#059669",
          blue: "#2563EB",
          violet: "#7C3AED",
          amber: "#D97706",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        "card": "0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)",
        "card-hover": "0 10px 25px -5px rgba(79, 70, 229, 0.10), 0 8px 10px -6px rgba(79, 70, 229, 0.05)",
        "glow": "0 4px 20px -2px rgba(79, 70, 229, 0.15)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
