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

async function moveImageToContentFolder(data, id, contentType = "articles") {
  if (!data.image || !data.image.id) {
    return;
  }

  try {
    // Get image details
    const imageId = data.image.id;
    const image = await strapi.entityService.findOne("plugin::upload.file", imageId, {
      populate: { formats: true },
    });

    if (!image) {
      return;
    }

    // Get current date for folder structure
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    // Create directory structure
    const contentDir = path.join(process.cwd(), "public", "images", "content", contentType, String(year), month, day);
    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true });
    }

    // Prepare file moves
    const moves = [];
    const newFormats = {};
    const baseFileName = `${id}-1`;
    const newMainPath = `/images/content/${contentType}/${year}/${month}/${day}/${baseFileName}.jpg`;

    // Original file
    const originalPath = path.join(process.cwd(), "public", image.url.replace(/^\//, ""));
    const originalTarget = path.join(contentDir, `${baseFileName}.jpg`);
    if (fs.existsSync(originalPath) && !fs.existsSync(originalTarget)) {
      moves.push({ source: originalPath, target: originalTarget });
    }

    // Variants
    const variantPrefixes = ["large", "medium", "small", "thumbnail"];
    for (const prefix of variantPrefixes) {
      if (image.formats && image.formats[prefix]) {
        const variant = image.formats[prefix];
        const variantPath = path.join(process.cwd(), "public", variant.url.replace(/^\//, ""));
        const variantTarget = path.join(contentDir, `${baseFileName}_${prefix}.jpg`);
        if (fs.existsSync(variantPath) && !fs.existsSync(variantTarget)) {
          moves.push({ source: variantPath, target: variantTarget });
          newFormats[prefix] = {
            ...variant,
            name: `${baseFileName}_${prefix}.jpg`,
            url: `/images/content/${contentType}/${year}/${month}/${day}/${baseFileName}_${prefix}.jpg`,
            path: null, // Clear path as it's not needed
          };
        }
      }
    }

    // Execute moves
    for (const move of moves) {
      fs.renameSync(move.source, move.target);
    }

    // Update plugin::upload.file
    await strapi.entityService.update("plugin::upload.file", imageId, {
      data: {
        name: `${baseFileName}.jpg`,
        url: newMainPath,
        formats: newFormats,
      },
    });

    // Update content type with new image_path
    await strapi.entityService.update(`api::${contentType.slice(0, -1)}.${contentType.slice(0, -1)}`, id, {
      data: {
        image_path: newMainPath,
      },
    });
  } catch (error) {
    console.error(`Error moving ${contentType} image:`, error);
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Set date if published
    if (data.publishedAt) {
      data.date = new Date();
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
    }

    // Set date if publishing
    if (data.publishedAt) {
      const existingEntry = await strapi.entityService.findOne("api::article.article", where.id);
      if (!existingEntry.publishedAt) {
        data.date = new Date();
      }
    }
  },

  async afterCreate(event) {
    const { result } = event;

    // Process image if published and keep_image_in_assets is false
    if (result.publishedAt && result.image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
  },

  async afterUpdate(event) {
    const { result, params } = event;

    // Process image if published and keep_image_in_assets is false
    if (params.data.publishedAt && result.image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
  },
};