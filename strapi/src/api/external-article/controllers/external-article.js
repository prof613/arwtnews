/**
 * external-article controller
 */

const { createCoreController } = require("@strapi/strapi").factories

module.exports = createCoreController("api::external-article.external-article", ({ strapi }) => ({
  // Use default find method - no custom logic needed for external articles
  async find(ctx) {
    const { data, meta } = await super.find(ctx)
    return { data, meta }
  },

  // Use default findOne method
  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx)
    return { data, meta }
  },

  // Use default create method
  async create(ctx) {
    const { data, meta } = await super.create(ctx)
    return { data, meta }
  },

  // Use default update method
  async update(ctx) {
    const { data, meta } = await super.update(ctx)
    return { data, meta }
  },

  // Use default delete method
  async delete(ctx) {
    const { data, meta } = await super.delete(ctx)
    return { data, meta }
  },
}))
