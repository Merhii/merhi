import type { Config } from "tailwindcss";

const config: Config = {
  corePlugins: {
    preflight: false
  },
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        portfolio: {
          bg: "var(--bg)",
          card: "var(--card)",
          text: "var(--text)",
          muted: "var(--muted)",
          accent: "var(--accent)",
          secondary: "var(--secondary)",
          green: "var(--green)"
        }
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif"
        ],
        mono: [
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace"
        ]
      }
    }
  },
  plugins: []
};

export default config;
