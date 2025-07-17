const fs = require("fs");
const path = require("path");
const strapi = require("@strapi/strapi");

// Helper function to generate slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-"); // Remove leading/trailing hyphens
}

// Function to manage homepage limits
async function manageHomepageLimits() {
  try {
    // Get all active articles (excluding featured)
    const activeRegularArticles = await global.strapi.entityService.findMany("api::article.article", {
      filters: {
        publishedAt: { $notNull: true },
        homepage_status: "active",
        is_featured: false,
      },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    });

    // If more than 6 regular articles, archive the oldest ones
    if (activeRegularArticles.length > 6) {
      const articlesToArchive = activeRegularArticles.slice(6);
      for (const article of articlesToArchive) {
        await global.strapi.entityService.update("api::article.article", article.id, {
          data: { homepage_status: "archived" },
        });
        console.log(`Archived article from homepage: ${article.title}`);
      }
    }

    // Handle featured limit (3 items across articles and opinions)
    const featuredArticles = await global.strapi.entityService.findMany("api::article.article", {
      filters: { publishedAt: { $notNull: true }, is_featured: true },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    });

    const featuredOpinions = await global.strapi.entityService.findMany("api::opinion.opinion", {
      filters: { publishedAt: { $notNull: true }, is_featured: true },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    });

    const allFeatured = [
      ...featuredArticles.map(item => ({ ...item, type: "article" })),
      ...featuredOpinions.map(item => ({ ...item, type: "opinion" }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (allFeatured.length > 3) {
      const itemsToUnfeature = allFeatured.slice(3);
      for (const item of itemsToUnfeature) {
        const collection = item.type === "article" ? "api::article.article" : "api::opinion.opinion";
        await global.strapi.entityService.update(collection, item.id, {
          data: {
            is_featured: false,
            ...(item.type === "article" ? { homepage_status: "active" } : {}),
          },
        });
        console.log(`Unfeatured ${item.type}: ${item.title}`);
      }
    }
  } catch (error) {
    console.error("Error managing homepage limits:", error);
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }
    if (data.publishedAt) {
      data.date = new Date();
      data.homepage_status = "active";
    }
    if (data.category && typeof data.category === "string") {
      const category = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.category } } },
      });
      data.category = category.data.id;
    }
    if (data.secondary_category && typeof data.secondary_category === "string") {
      const secondaryCategory = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.secondary_category } } },
      });
      data.secondary_category = secondaryCategory.data.id;
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }
    if (data.publishedAt) {
      const existingEntry = await global.strapi.entityService.findOne("api::article.article", where.id);
      if (!existingEntry.publishedAt) {
        data.date = new Date();
        data.homepage_status = "active";
      }
    }
    if (data.category && typeof data.category === "string") {
      const category = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.category } } },
      });
      data.category = category.data.id;
    }
    if (data.secondary_category && typeof data.secondary_category === "string") {
      const secondaryCategory = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.secondary_category } } },
      });
      data.secondary_category = secondaryCategory.data.id;
    }
  },

  async afterCreate(event) {
    const { result } = event;
    if (result.publishedAt) {
      await manageHomepageLimits();
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;
    if (params.data.publishedAt || params.data.hasOwnProperty("is_featured")) {
      await manageHomepageLimits();
    }
  },
};