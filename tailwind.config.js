/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        ink: {
          DEFAULT: "#0f172a", // sleek modern slate-900
          900: "#0f172a",
          800: "#1e293b",
          700: "#334155",
          600: "#475569",
          500: "#64748b",
          400: "#94a3b8",
        },
        fog: {
          DEFAULT: "#f8fafc",
          card: "#ffffff",
          line: "#e2e8f0",
        },
        verified: {
          DEFAULT: "#10b981",
          soft: "#ecfdf5",
          border: "#a7f3d0",
        },
        risk: {
          DEFAULT: "#f43f5e",
          soft: "#fff1f2",
          border: "#fecdd3",
        },
        watch: {
          DEFAULT: "#f59e0b",
          soft: "#fffbeb",
          border: "#fde68a",
        },
        ccea: {
          DEFAULT: "#8b5cf6",
          soft: "#f5f3ff",
          border: "#ddd6fe",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        sky: "0 4px 20px -2px rgba(14, 165, 233, 0.08), 0 2px 6px -1px rgba(14, 165, 233, 0.04)",
        "sky-lg": "0 10px 30px -4px rgba(14, 165, 233, 0.12), 0 4px 10px -2px rgba(14, 165, 233, 0.06)",
        card: "0 1px 3px rgba(15, 23, 42, 0.04), 0 4px 14px -2px rgba(15, 23, 42, 0.06)",
        glow: "0 0 20px -4px rgba(14, 165, 233, 0.35)",
      },
      borderRadius: {
        card: "18px",
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};
