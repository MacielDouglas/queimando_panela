/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        noto: ["Noto Serif", "serif"],
        oswald: ["Oswald", "sans-serif"],
      },
      colors: {
        primary: "#FA9D33",
        secondary: "#ceedff",
        tertiary: "#ACD188",
        quaternary: "#FF6a53",
      },
      backgroundImage: {
        pattern: "url('/src/assets/bg_food 1.svg')",
        cozinhando: "url('/src/assets/cozinhando.jpg')",
      },
    },
  },
  plugins: [],
};
