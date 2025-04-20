module.exports = {
  darkMode: 'class', // tambahkan ini untuk aktifkan dark mode via class
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ff69b4",
        secondary: "#fce4ec",
        navy: "#1b2a49",         // tambahan buat gradasi light
        teal: "#3c9d9b",
        sky: "#7ec8e3",
        beige: "#f5f5dc",
        black: "#000000",        // untuk dark mode
        green: {
          900: "#004d40",        // warna hijau gelap (dark mode)
        },
        blue: {
          900: "#0d47a1",        // warna biru gelap (dark mode)
        },
      },
    },
  },
  plugins: [],
};
