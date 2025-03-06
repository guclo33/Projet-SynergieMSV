/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6F1E49",
        secondary: "#D7A5BE",
        background: "white",
        textColor: "#07000e",
      },
      backgroundImage: {
        'gray-radial': "radial-gradient(100% 100% at 100% 0, #b0b0b0 0%, #808080 100%)", // Gradient gris
      }
    },
  },
  plugins: [],
  corePlugins: {
    appearance: false, // Désactive `-webkit-appearance: button;`
  },
  safelist: [
    "btn-disabled",
  ],
};


