// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-") // Remove leading/trailing hyphens
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title)
    }

    // DON'T auto-set date - always use the manually input date
    // The date field should represent when the article was originally published on the source site

    // Check if we already have 10 published external articles
    if (data.publishedAt) {
      const existingArticles = await strapi.entityService.findMany("api::external-article.external-article", {
        filters: { publishedAt: { $notNull: true } },
        sort: { date: "asc" }, // Oldest first for deletion
        pagination: { limit: -1 }, // Get all
      })

      // If we have 10 or more, delete the oldest one
      if (existingArticles.length >= 10) {
        const oldestArticle = existingArticles[0]
        await strapi.entityService.delete("api::external-article.external-article", oldestArticle.id)
        console.log(`Deleted oldest external article: ${oldestArticle.title}`)
      }
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title)
    }

    // DON'T auto-set date - preserve the manually input date

    // Check if we're publishing and need to manage the 10-article limit
    if (data.publishedAt) {
      const existingEntry = await strapi.entityService.findOne("api::external-article.external-article", where.id)

      // If this wasn't published before, check the limit
      if (!existingEntry.publishedAt) {
        const existingArticles = await strapi.entityService.findMany("api::external-article.external-article", {
          filters: {
            publishedAt: { $notNull: true },
            id: { $ne: where.id }, // Exclude current article
          },
          sort: { date: "asc" }, // Oldest first for deletion
          pagination: { limit: -1 }, // Get all
        })

        // If we have 10 or more, delete the oldest one
        if (existingArticles.length >= 10) {
          const oldestArticle = existingArticles[0]
          await strapi.entityService.delete("api::external-article.external-article", oldestArticle.id)
          console.log(`Deleted oldest external article: ${oldestArticle.title}`)
        }
      }
    }
  },
}
