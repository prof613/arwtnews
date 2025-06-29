// File: server.js
// Folder: /rwtnews/strapi/config

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL', 'http://localhost:1337'),
  admin: {
    path: '/admin',
  },
  app: {
    keys: env.array('APP_KEYS', ['default-key1', 'default-key2']),
  },
});