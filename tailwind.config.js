/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#0a7ea4',
        secondary: '#687076',
        borderColor: '#e1e4e8',
        background: '#ffffff',
      },
      fontFamily: {
        'sans-regular': ['openSans_regular'],
        'sans-semibold': ['openSans_semiBold'],
        'sans-bold': ['openSans_bold'],
      },
    },
  },
  plugins: [],
};
