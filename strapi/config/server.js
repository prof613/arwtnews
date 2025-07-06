module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('STRAPI_URL', 'http://localhost:1337'),
  admin: {
    path: '/admin',
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
  cors: {
    origin: [
      env('NEXTJS_CORS_ORIGIN', env('NEXTJS_URL', 'http://localhost:3000')),
      env('STRAPI_CORS_ORIGIN', env('STRAPI_URL', 'http://localhost:1337')),
    ],
  },
});