/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "bekasi-green": {
          DEFAULT: "#006837",
          hover: "#060706",
          light: "#E6F4EA",
        },
        "bekasi-gold": {
          DEFAULT: "#E2A812",
          hover: "#C5920D",
          light: "#FEF3C7",
        },
        "bekasi-blue": {
          DEFAULT: "#0284C7",
          dark: "#0369A1",
        },
        "gov-navy": {
          DEFAULT: "#0F172A",
          surface: "#1E293B",
        },
        heading: {
          DEFAULT: "#1b1b1c",
          dark: "#81f5e2",
        },
        // Warna Netral UI
        canvas: "#F8FAFC",
        "card-bg": "#FFFFFF",
        "card-border": "#E2E8F0",
      },
      fontSize: {
        12: ["12px", { lineHeight: "1.5" }],
        14: ["14px", { lineHeight: "1.5" }],
        16: ["16px", { lineHeight: "1.5" }],
        20: ["20px", { lineHeight: "1.4" }],
        24: ["24px", { lineHeight: "1.3" }],
        28: ["28px", { lineHeight: "1.3" }],
        32: ["32px", { lineHeight: "1.2" }],
        34: ["34px", { lineHeight: "1.2" }],
        40: ["40px", { lineHeight: "1.2" }],
        48: ["48px", { lineHeight: "1.1" }],
        64: ["64px", { lineHeight: "1.1" }],
        96: ["96px", { lineHeight: "1.0" }],
      },
    },
  },
  plugins: [],
};
