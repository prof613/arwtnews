/**
 * external-article service
 */

const { createCoreService } = require("@strapi/strapi").factories

module.exports = createCoreService("api::external-article.external-article")
