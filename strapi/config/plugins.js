module.exports = ({ env }) => ({
  'users-permissions': {
    enabled: true,
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },

  'i18n': {
    enabled: true,
  },

  // Configure DigitalOcean Spaces for file uploads
  upload: {
    config: {
      provider: 'strapi-provider-upload-do',
      providerOptions: {
        key: env('DO_SPACE_KEY'),
        secret: env('DO_SPACE_SECRET'),
        endpoint: env('DO_SPACE_ENDPOINT'), // e.g., sfo3.digitaloceanspaces.com
        space: env('DO_SPACE_BUCKET'), // e.g., your-space-name
        cdn: env('DO_SPACE_CDN', ''), // Optional CDN URL
      },
      actionOptions: {
        upload: {
          ACL: 'public-read',
        },
        delete: {},
      },
    },
  },

  // email: {
  //   enabled: true,
  //   config: {
  //     provider: 'sendgrid',
  //     providerOptions: {
  //       apiKey: env('SENDGRID_API_KEY'),
  //     },
  //     settings: {
  //       defaultFrom: 'webpagecontact@redwhiteandtruenews.com',
  //       defaultReplyTo: 'webpagecontact@redwhiteandtruenews.com',
  //     },
  //   },
  // },
});