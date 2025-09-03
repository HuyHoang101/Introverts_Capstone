/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./component/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        fontUnderline: '#e0d6c2',
        bgColor: '#121212',
        fontColor: '#B0B0B0',
        cardBg: '#2C2C2C'
      }
    },
  },
  plugins: [],
}

