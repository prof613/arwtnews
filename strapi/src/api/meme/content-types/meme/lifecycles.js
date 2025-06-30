const fs = require("fs");
const path = require("path");

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

    // Create the directory structure with memes subfolder
    const contentDir = path.join(process.cwd(), "public", "images", "content", "memes", String(year), month, day)

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

    // Generate new filename (just ID, no -1 for memes)
    const fileExtension = path.extname(image.name)
    const newFileName = `${id}${fileExtension}`
    const newFilePath = path.join(contentDir, newFileName)

    // Copy the file
    fs.copyFileSync(currentPath, newFilePath)

    // Update the database with new path
    const newImagePath = `/images/content/memes/${year}/${month}/${day}/${newFileName}`
    await strapi.entityService.update("api::meme.meme", id, {
      data: {
        image_path: newImagePath,
      },
    })
  } catch (error) {
    console.error("Error moving meme image:", error)
  }
}
*/

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    // If being published on creation, set the date
    if (data.publishedAt) {
      data.date = new Date();
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params;

    // Only set date if we're publishing
    if (data.publishedAt) {
      const existingEntry = await strapi.entityService.findOne("api::meme.meme", where.id);

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