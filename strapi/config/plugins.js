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

  upload: {
    config: {
      provider: 'strapi-provider-upload-do',
      providerOptions: {
        key: env('DO_SPACE_ACCESS_KEY_ID'),
        secret: env('DO_SPACE_SECRET_ACCESS_KEY'),
        endpoint: env('DO_SPACE_ENDPOINT'),
        space: env('DO_SPACE_BUCKET'),
        directory: 'uploads',
        cdn: `https://rwtnews-media.nyc3.cdn.digitaloceanspaces.com`,
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