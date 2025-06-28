// File: app.js
// Folder: /rwtnews/strapi/src/admin

export default {
  config: {
    locales: ['en'],
    theme: {
      colors: {
        primary100: '#f6f6f9',
        primary600: '#3C3B6E',
        primary700: '#2e2c5a',
        danger700: '#B22234',
      },
    },
  },
  bootstrap() {
    // No custom bootstrap logic needed for admin panel
  },
};