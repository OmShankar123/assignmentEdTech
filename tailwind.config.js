/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'sans-regular': ['openSans_regular'],
        'sans-semibold': ['openSans_semiBold'],
        'sans-bold': ['openSans_bold'],
      },
    },
  },
  plugins: [],
};
