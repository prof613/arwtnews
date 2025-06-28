// File: tailwind.config.js
// Folder: /rwtnews

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  './pages/**/*.{js,ts,jsx,tsx}',
  './components/**/*.{js,ts,jsx,tsx}',
  './app/**/*.{js,ts,jsx,tsx}',
  './src/**/*.{js,ts,jsx,tsx}',
  './*.{js,ts,jsx,tsx}',
],
  theme: {
    extend: {
      colors: {
        'rwt-blue': '#3C3B6E',
        'rwt-red': '#B22234',
      },
    },
  },
  plugins: [],
}