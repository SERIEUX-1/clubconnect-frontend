/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14213D", // primary institutional navy — headers, primary text
          700: "#1C2E52",
          500: "#2C4270",
          300: "#7C8BAE",
        },
        fog: {
          DEFAULT: "#F2F4F7", // cool paper background — deliberately not warm cream
          card: "#FFFFFF",
          line: "#DCE1EA",
        },
        brass: {
          DEFAULT: "#C9A227", // seal / verification / awards accent
          dark: "#9C7D1B",
          soft: "#F3E7C2",
        },
        verified: {
          DEFAULT: "#1F7A5C",
          soft: "#DCEFE8",
        },
        risk: {
          DEFAULT: "#B33F2E",
          soft: "#F6E1DD",
        },
        watch: {
          DEFAULT: "#D98E04",
          soft: "#FBEACB",
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "perforation":
          "repeating-linear-gradient(to bottom, transparent 0 6px, #DCE1EA 6px 8px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20,33,61,0.06), 0 8px 24px -12px rgba(20,33,61,0.18)",
        stamp: "0 2px 6px rgba(201,162,39,0.35)",
      },
      borderRadius: {
        card: "14px",
      },
    },
  },
  plugins: [],
};
