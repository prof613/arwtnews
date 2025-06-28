// File: server.js
// Folder: /rwtnews/strapi/config

module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS', ['default-key1', 'default-key2']),
  },
});