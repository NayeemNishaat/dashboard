/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      opensans: ["Open Sans", "sans-serif"],
    },
    extend: {
      colors: {
        "brand-gray": "#CCCCCC",
        "brand-gray-500": "#555555",
        "brand-gray-50": "#F3F3F2",
        "brand-yellow": "#FAB800",
      },
      screens: {
        xxl: "1600px",
      },
    },
  },
  plugins: [],
};
