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
        // 60-30-10 tokens (CSS variable driven, theme-switchable)
        canvas: "var(--color-dominant)",
        surface: {
          DEFAULT: "var(--color-surface)",
          alt: "var(--color-surface-alt)",
          50: "var(--color-surface)",
          100: "var(--color-surface-alt)",
          200: "var(--color-border)",
          300: "var(--color-border-strong)",
          400: "var(--color-ink-subtle)",
        },
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
        },
        ink: {
          DEFAULT: "var(--color-ink)",
          muted: "var(--color-ink-muted)",
          subtle: "var(--color-ink-subtle)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          soft: "var(--color-accent-soft)",
          contrast: "var(--color-accent-contrast)",
          // legacy aliases (mapped to theme accent for compatibility)
          indigo: "var(--color-accent)",
          indigoHover: "var(--color-accent-hover)",
          cyan: "var(--color-ink-muted)",
          emerald: "var(--color-success)",
        },
        success: {
          DEFAULT: "var(--color-success)",
          soft: "var(--color-success-soft)",
        },
        brand: {
          indigo: "var(--color-accent)",
          cyan: "var(--color-ink-muted)",
          emerald: "var(--color-success)",
          blue: "var(--color-accent)",
          violet: "var(--color-accent)",
          amber: "#D97706",
        },
        background: "var(--color-dominant)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "Plus Jakarta Sans", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      boxShadow: {
        "card": "none",
        "card-hover": "none",
        "glow": "none",
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
