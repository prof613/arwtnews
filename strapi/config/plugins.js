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
    provider: env('UPLOAD_PROVIDER', 'local'), // Default to local
    providerOptions: env('UPLOAD_PROVIDER') === 'aws-s3' ? {
      accessKeyId: env('AWS_ACCESS_KEY_ID'),
      secretAccessKey: env('AWS_SECRET_ACCESS_KEY'),
      region: env('AWS_REGION'),
      bucket: env('DO_SPACE_BUCKET'),
      endpoint: env('DO_SPACE_ENDPOINT'),
      baseUrl: env('DO_SPACE_CDN'),
      s3ForcePathStyle: true,
      params: {
        ACL: 'public-read',
        Bucket: env('DO_SPACE_BUCKET'),
      },
    } : {}, // Empty object for local provider
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