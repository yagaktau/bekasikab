/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // 1. Forest Green: Navbar, heading, footer, tombol utama
        "forest-green": "#174D36",

        // 2. Sage Green: Hover, tombol sekunder, elemen dekoratif
        "sage-green": "#397A57",

        // 3. Mint Gray: Background section alternatif
        "mint-gray": "#E8EFEA",

        // 4. Off White: Background utama
        "off-white": "#F7F8F5",

        // 5. Charcoal: Teks paragraf dan informasi
        charcoal: "#343D38",

        // Alias semantik & kompatibilitas kelas lama
        "bekasi-green": {
          DEFAULT: "#174D36", // Tombol utama
          hover: "#397A57", // Hover & tombol sekunder
          light: "#E8EFEA", // Highlight / section alternatif
        },
        "gov-navy": {
          DEFAULT: "#174D36", // Navbar, heading, footer
          surface: "#397A57", // Elemen dekoratif / aksen permukaan
        },
        heading: {
          DEFAULT: "#174D36", // Heading utama
          dark: "#E8EFEA", // Heading di atas latar gelap
        },
        canvas: "#F7F8F5", // Background utama
        "section-alt": "#E8EFEA", // Background section alternatif
        "card-bg": "#F7F8F5", // Background kartu
        "card-border": "#E8EFEA", // Garis tepi kartu
        "body-text": "#343D38", // Teks paragraf dan informasi
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
