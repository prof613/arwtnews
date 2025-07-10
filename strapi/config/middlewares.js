// File: config/middlewares.js
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000',
        'https://redwhiteandtruenews.com',
        'https://rwtnews-live-frontend-s7ibg.ondigitalocean.app',
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      keepHeaderOnError: true,
    },
  },
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        directives: {
          'default-src': ["'self'"],
          'img-src': ["'self'", 'data:', 'blob:', 'https://rwtnews-media.nyc3.cdn.digitaloceanspaces.com'],
          'script-src': ["'self'", "'unsafe-inline'"], // Required for Strapi admin
          'style-src': ["'self'", "'unsafe-inline'"], // Required for Strapi admin
          'connect-src': ["'self'", 'https://rwtnews-media.nyc3.cdn.digitaloceanspaces.com'],
        },
      },
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];