// File: api.js
// Folder: /rwtnews/strapi/config

module.exports = ({ env }) => ({
  rest: {
    defaultLimit: 25,
    maxLimit: 10000,
    withCount: true,
  },
})
