/**
 * opinion controller
 */

const { createCoreController } = require("@strapi/strapi").factories

module.exports = createCoreController("api::opinion.opinion", ({ strapi }) => ({
  async findRelated(ctx) {
    try {
      const { tags, type, currentId } = ctx.query

      if (!tags || !type || !currentId) {
        return ctx.badRequest("Missing required parameters: tags, type, and currentId")
      }

      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase())
      const minMatches = Math.max(1, Math.min(2, Math.floor(tagArray.length / 3)))

      // Build OR conditions for each tag
      const tagFilters = tagArray.map((tag) => ({
        relatedTags: { $containsi: tag },
      }))

      // Query both opinions and articles (cross-reference)
      const [opinions, articles] = await Promise.all([
        strapi.entityService.findMany("api::opinion.opinion", {
          filters: {
            $and: [
              { id: { $ne: Number.parseInt(currentId) } },
              { publishedAt: { $notNull: true } },
              { $or: tagFilters },
            ],
          },
          populate: ["featured_image", "secondary_category"],
          sort: [{ date: "desc" }],
          limit: 15,
        }),
        strapi.entityService.findMany("api::article.article", {
          filters: {
            $and: [
              { id: { $ne: Number.parseInt(currentId) } },
              { publishedAt: { $notNull: true } },
              { $or: tagFilters },
            ],
          },
          populate: ["image", "category", "secondary_category"],
          sort: [{ date: "desc" }],
          limit: 15,
        }),
      ])

      // Combine and score
      const combined = [
        ...opinions.map((o) => ({
          ...o,
          _type: "opinion",
          matchCount: countMatches(o.relatedTags, tagArray),
        })),
        ...articles.map((a) => ({
          ...a,
          _type: "article",
          matchCount: countMatches(a.relatedTags, tagArray),
        })),
      ].filter((item) => item.matchCount >= minMatches)

      // Sort by match count desc, then date desc
      combined.sort((a, b) => {
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount
        }
        return new Date(b.date) - new Date(a.date)
      })

      const relatedItems = combined.slice(0, 3)

      // If we don't have 3 related items, get featured articles as fallback
      if (relatedItems.length < 3) {
        const featuredOpinions = await strapi.entityService.findMany("api::opinion.opinion", {
          filters: {
            $and: [
              { id: { $ne: Number.parseInt(currentId) } },
              { publishedAt: { $notNull: true } },
              { is_featured: true },
            ],
          },
          populate: ["featured_image", "secondary_category"],
          sort: [{ date: "desc" }],
          limit: 3,
        })

        const featuredArticles = await strapi.entityService.findMany("api::article.article", {
          filters: {
            $and: [
              { id: { $ne: Number.parseInt(currentId) } },
              { publishedAt: { $notNull: true } },
              { is_featured: true },
            ],
          },
          populate: ["image", "category", "secondary_category"],
          sort: [{ date: "desc" }],
          limit: 3,
        })

        const allFeatured = [
          ...featuredOpinions.map((o) => ({ ...o, _type: "opinion", isFallback: true })),
          ...featuredArticles.map((a) => ({ ...a, _type: "article", isFallback: true })),
        ]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 3 - relatedItems.length)

        return {
          items: [...relatedItems, ...allFeatured],
          isFallback: relatedItems.length === 0,
        }
      }

      return {
        items: relatedItems,
        isFallback: false,
      }
    } catch (error) {
      strapi.log.error("Error in findRelated:", error)
      return ctx.internalServerError("Failed to fetch related articles")
    }
  },
}))

function countMatches(tagsString, tagArray) {
  if (!tagsString) return 0
  const itemTags = tagsString.split(",").map((t) => t.trim().toLowerCase())
  return itemTags.filter((t) => tagArray.some((searchTag) => t.includes(searchTag) || searchTag.includes(t))).length
}
