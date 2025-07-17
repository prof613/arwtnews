const fs = require("fs");
const path = require("path");

// Helper function to generate unique slug
async function generateSlug(title, existingId = null) {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-"); // Remove leading/trailing hyphens

  let slug = baseSlug;
  let counter = 1;

  // Check for existing slugs, excluding the current record if updating
  while (true) {
    const existing = await global.strapi.entityService.findMany("api::opinion.opinion", {
      filters: { slug, ...(existingId ? { id: { $ne: existingId } } : {}) },
      pagination: { limit: 1 },
    });

    if (existing.length === 0) {
      return slug; // Unique slug found
    }

    // Append suffix for duplicates
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = await generateSlug(data.title);
    }

    // If being published on creation, set the date
    if (data.publishedAt) {
      data.date = new Date();
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = await generateSlug(data.title, where.id);
    }

    // Only set date if we're publishing
    if (data.publishedAt) {
      const existingEntry = await strapi.entityService.findOne("api::opinion.opinion", where.id);

      // If this entry wasn't published before, set the date
      if (!existingEntry.publishedAt) {
        data.date = new Date();
      }
    }
  },

  async afterCreate(event) {
    // Commented out to disable custom image movement
    /*
    const { result } = event;
    if (result.publishedAt && result.featured_image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
    */
  },

  async afterUpdate(event) {
    // Commented out to disable custom image movement
    /*
    const { result, params } = event;
    if (params.data.publishedAt && result.featured_image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
    */
  },
};