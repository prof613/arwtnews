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

/*
// Commented out custom image movement logic to restore Strapi default file management
async function moveImageToContentFolder(data, id) {
  if (!data.image || !data.image.id) {
    return
  }

  try {
    // Get the image details
    const imageId = data.image.id
    const image = await strapi.entityService.findOne("plugin::upload.file", imageId)

    if (!image) {
      return
    }

    // Get current date for folder structure
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")

    // Create the directory structure with articles subfolder
    const contentDir = path.join(process.cwd(), "public", "images", "content", "articles", String(year), month, day)

    if (!fs.existsSync(contentDir)) {
      fs.mkdirSync(contentDir, { recursive: true })
    }

    // Find the source file
    const possiblePaths = [
      path.join(process.cwd(), "public", "uploads", image.name),
      path.join(process.cwd(), "uploads", image.name),
      path.join(process.cwd(), "public", image.url),
      path.join(process.cwd(), "public", "uploads", image.name),
    ]

    let currentPath = null
    for (const possiblePath of possiblePaths) {
      if (fs.existsSync(possiblePath)) {
        currentPath = possiblePath
        break
      }
    }

    if (!currentPath || !fs.existsSync(currentPath)) {
      return
    }

    // Generate new filename
    const fileExtension = path.extname(image.name)
    const newFileName = `${id}-1${fileExtension}`
    const newFilePath = path.join(contentDir, newFileName)

    // Copy the file
    fs.copyFileSync(currentPath, newFilePath)

    // Update the database with new path
    const newImagePath = `/images/content/articles/${year}/${month}/${day}/${newFileName}`
    await strapi.entityService.update("api::article.article", id, {
      data: {
        image_path: newImagePath,
      },
    })
  } catch (error) {
    console.error("Error moving article image:", error)
  }
}
*/

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title);
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
      data.slug = generateSlug(data.title);
    }

    // Only set date if we're publishing
    if (data.publishedAt) {
      const existingEntry = await strapi.entityService.findOne("api::article.article", where.id);

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

    // Only process if being published, has image, and checkbox is unchecked
    if (result.publishedAt && result.image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
    */
  },

  async afterUpdate(event) {
    // Commented out to disable custom image movement
    /*
    const { result, params } = event;

    // Only process if being published, has image, and checkbox is unchecked
    if (params.data.publishedAt && result.image && !result.keep_image_in_assets) {
      await moveImageToContentFolder(result, result.id);
    }
    */
  },
};