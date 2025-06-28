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