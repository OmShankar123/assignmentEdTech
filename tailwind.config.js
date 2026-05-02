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
        star: '#FBBF24',
        success: '#10b981',
        error: '#ef4444',
        gray100: '#f3f4f6',
        gray200: '#e5e7eb',
        primaryLight: '#eff6ff',
        successLight: '#f0fdf4',
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
