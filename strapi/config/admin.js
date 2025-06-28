// File: admin.js
// Folder: /rwtnews/strapi/config

module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'Ra7cEpkHn+DcCNTOHk3XXA'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'pqo4dNXf3fTrr/RN2QAEnA'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'pqo4dNXf3fTrr/RN2QAEnA'),
    },
  },
});