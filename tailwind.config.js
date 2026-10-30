/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        travel: "url('../src/assets/img/travel-img.jpg')",
      },
    },
  },
  plugins: [],
};
