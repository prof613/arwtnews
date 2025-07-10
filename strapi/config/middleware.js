module.exports = [
  'strapi::errors',
  {
    name: 'strapi::cors',
    config: {
      origin: [
        'http://localhost:3000', 
        'https://redwhiteandtruenews.com',
        'https://rwtnews-live-frontend-s7ibg.ondigitalocean.app'
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
        useDefaults: true,
        directives: {
          'img-src': ["'self'", 'data:', 'blob:', 'https:', 'https://rwtnews-media.nyc3.digitaloceanspaces.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:', 'https://rwtnews-media.nyc3.digitaloceanspaces.com'],
          upgradeInsecureRequests: null,
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