/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        travel: "url('../src/assets/img/travel-img.jpg')",
      },
    },
  },
  plugins: [],
};
