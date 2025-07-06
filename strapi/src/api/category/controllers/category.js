'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::category.category', ({ strapi }) => ({
  async createIfNotExists(ctx) {
    const { name } = ctx.request.body.data;
    if (!name) {
      return ctx.badRequest('Category name is required');
    }

    // Check if category exists
    const existingCategory = await strapi
      .query('api::category.category')
      .findOne({ where: { name } });

    if (existingCategory) {
      return ctx.send({ data: existingCategory });
    }

    // Create new category
    const newCategory = await strapi.service('api::category.category').create({
      data: {
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-'), // Ensure slug is generated
        publishedAt: new Date(), // Publish immediately
      },
    });

    return ctx.send({ data: newCategory });
  },
}));