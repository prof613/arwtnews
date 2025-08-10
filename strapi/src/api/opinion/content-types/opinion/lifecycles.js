const fs = require("fs")
const path = require("path")
const keywordExtractor = require("keyword-extractor")

// Function to generate canonical URL
function generateCanonicalUrl(slug) {
  const baseUrl = process.env.FRONTEND_URL || 'https://rwtnews.com'
  return `${baseUrl}/opinions/${slug}`
}

// Keyword-extractor based tag generation helper
function generateTags(title, richBody) {
  let fullText = title || ""

  // Extract text from rich_body dynamic zone
  if (richBody && Array.isArray(richBody)) {
    richBody.forEach((block) => {
      if (block.__component === "blocks.enhanced-text" && block.content) {
        block.content.forEach((contentItem) => {
          if (contentItem.children) {
            contentItem.children.forEach((child) => {
              if (child.text) {
                fullText += " " + child.text
              }
            })
          }
        })
      }
    })
  }

  if (!fullText.trim()) return ""

  // Use keyword-extractor for better quality tags
  const extractionResult = keywordExtractor.extract(fullText, {
    language: "english",
    remove_duplicates: true,
    return_changed_case: true,
    return_chained_words: true,
    return_max_ngrams: 2,
  })

  // Build the tags string while respecting the 255 character limit
  let tagsString = ""
  const maxLength = 250 // Leave some buffer under 255

  for (const tag of extractionResult) {
    const nextTag = tagsString ? `,${tag}` : tag
    if ((tagsString + nextTag).length <= maxLength) {
      tagsString += nextTag
    } else {
      break // Stop adding tags if we'd exceed the limit
    }
  }

  return tagsString
}

// Helper function to generate unique slug
async function generateSlug(title, existingId = null) {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-") // Remove leading/trailing hyphens

  let slug = baseSlug
  let counter = 1

  // Check for existing slugs, excluding the current record if updating
  while (true) {
    const existing = await global.strapi.entityService.findMany("api::opinion.opinion", {
      filters: { slug, ...(existingId ? { id: { $ne: existingId } } : {}) },
      pagination: { limit: 1 },
    })

    if (existing.length === 0) {
      return slug // Unique slug found
    }

    // Append suffix for duplicates
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params

    // Auto-generate slug if not provided
    if (data.title && !data.slug) {
      data.slug = await generateSlug(data.title)
    }

    // Auto-generate canonical URL if slug exists and canonical URL is not set
    if (data.slug && !data.canonicalUrl) {
      data.canonicalUrl = generateCanonicalUrl(data.slug)
    }

    // Generate tags from title and rich_body content
    if (data.title || data.rich_body) {
      data.relatedTags = generateTags(data.title, data.rich_body)
    }

    // If being published on creation, set the date
    if (data.publishedAt) {
      data.date = new Date()
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = await generateSlug(data.title, where.id)
    }

    // Auto-generate canonical URL if slug exists and canonical URL is not set
    if (data.slug && !data.canonicalUrl) {
      data.canonicalUrl = generateCanonicalUrl(data.slug)
    }

    // Regenerate tags if title or rich_body changed
    if (data.title !== undefined || data.rich_body !== undefined) {
      // Get existing data to merge with updates
      const existingEntry = await global.strapi.entityService.findOne("api::opinion.opinion", where.id, {
        populate: ["rich_body"],
      })

      const titleToUse = data.title !== undefined ? data.title : existingEntry.title
      const richBodyToUse = data.rich_body !== undefined ? data.rich_body : existingEntry.rich_body

      data.relatedTags = generateTags(titleToUse, richBodyToUse)
    }

    // Only set date if we're publishing
    if (data.publishedAt) {
      const existingEntry = await global.strapi.entityService.findOne("api::opinion.opinion", where.id)

      // If this entry wasn't published before, set the date
      if (!existingEntry.publishedAt) {
        data.date = new Date()
      }
    }
  },

  async afterCreate(event) {
    // Placeholder for future functionality
  },

  async afterUpdate(event) {
    // Placeholder for future functionality
  },
}