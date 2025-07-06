module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/categories/create-if-not-exists',
      handler: 'category.createIfNotExists',
      config: { policies: [] },
    },
  ],
};