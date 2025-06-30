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
    provider: 'aws-s3',
    providerOptions: {
      accessKeyId: env('DO_SPACE_ACCESS_KEY_ID'),
      secretAccessKey: env('DO_SPACE_SECRET_ACCESS_KEY'),
      region: env('DO_SPACE_REGION'),
      bucket: env('DO_SPACE_BUCKET'),
      endpoint: env('DO_SPACE_ENDPOINT'),
      s3ForcePathStyle: true,
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