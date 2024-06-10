/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
        wenkai: ["LXGW WenKai Mono TC", "monospace"],
      },
      colors: {
        primary: "#FA9D33",
        secondary: "#ceedff",
        tertiary: "#ACD188",
        quaternary: "#FF6a53",
      },
    },
  },
  plugins: [],
};
