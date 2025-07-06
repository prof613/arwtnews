const fs = require("fs");
const path = require("path");

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
      pagination: { limit: -1 }, // Get all to count properly
    });

    // If we have more than 6 regular articles, archive the oldest ones
    if (activeRegularArticles.length > 6) {
      const articlesToArchive = activeRegularArticles.slice(6); // Keep first 6, archive the rest

      for (const article of articlesToArchive) {
        await global.strapi.entityService.update("api::article.article", article.id, {
          data: { homepage_status: "archived" },
        });
        console.log(`Archived article from homepage: ${article.title}`);
      }
    }

    // Handle featured article limit (only one featured at a time)
    const featuredArticles = await global.strapi.entityService.findMany("api::article.article", {
      filters: {
        publishedAt: { $notNull: true },
        is_featured: true,
      },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    });

    // If more than one featured article, unfeatured older ones and archive them
    if (featuredArticles.length > 1) {
      const articlesToUnfeatured = featuredArticles.slice(1); // Keep first (newest), unfeatured the rest

      for (const article of articlesToUnfeatured) {
        await global.strapi.entityService.update("api::article.article", article.id, {
          data: {
            is_featured: false,
            homepage_status: "active", // Move to regular articles area
          },
        });
        console.log(`Unfeatured and moved to regular articles: ${article.title}`);
      }

      // After moving ex-featured to regular, check if we exceed 6 regular articles
      await manageHomepageLimits(); // Recursive call to handle the new regular article
    }
  } catch (error) {
    console.error("Error managing homepage limits:", error);
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    // If being published on creation, set the date and default to active
    if (data.publishedAt) {
      data.date = new Date();
      data.homepage_status = "active"; // New articles start on homepage
    }

    // Handle primary category
    if (data.category && typeof data.category === 'string') {
      const category = await strapi
        .controller('api::category.category')
        .createIfNotExists({
          request: { body: { data: { name: data.category } } },
        });
      data.category = category.data.id; // Replace string with category ID
    }

    // Handle secondary category
    if (data.secondary_category && typeof data.secondary_category === 'string') {
      const secondaryCategory = await strapi
        .controller('api::category.category')
        .createIfNotExists({
          request: { body: { data: { name: data.secondary_category } } },
        });
      data.secondary_category = secondaryCategory.data.id; // Replace string with category ID
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Only set date if we're publishing for the first time
    if (data.publishedAt) {
      const existingEntry = await global.strapi.entityService.findOne("api::article.article", where.id);

      // If this entry wasn't published before, set the date and make active
      if (!existingEntry.publishedAt) {
        data.date = new Date();
        data.homepage_status = "active";
      }
    }

    // Handle primary category
    if (data.category && typeof data.category === 'string') {
      const category = await strapi
        .controller('api::category.category')
        .createIfNotExists({
          request: { body: { data: { name: data.category } } },
        });
      data.category = category.data.id; // Replace string with category ID
    }

    // Handle secondary category
    if (data.secondary_category && typeof data.secondary_category === 'string') {
      const secondaryCategory = await strapi
        .controller('api::category.category')
        .createIfNotExists({
          request: { body: { data: { name: data.secondary_category } } },
        });
      data.secondary_category = secondaryCategory.data.id; // Replace string with category ID
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Only manage limits if article was published
    if (result.publishedAt) {
      await manageHomepageLimits();
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Only manage limits if article was published or featured status changed
    if (params.data.publishedAt || params.data.hasOwnProperty("is_featured")) {
      await manageHomepageLimits();
    }
  },
};