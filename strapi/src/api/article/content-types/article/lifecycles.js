const fs = require("fs")
const path = require("path")
const strapi = require("@strapi/strapi")

// Function to generate canonical URL
function generateCanonicalUrl(slug) {
  const baseUrl = process.env.FRONTEND_URL || 'https://rwtnews.com'
  return `${baseUrl}/articles/${slug}`
}

// Function to extract plain text from rich_body dynamic zone
function extractTextFromRichBody(richBody) {
  if (!richBody || !Array.isArray(richBody)) return ""
  
  let extractedText = ""
  
  richBody.forEach((block) => {
    if (block.__component === "blocks.enhanced-text" && block.content) {
      // Your enhanced-text blocks have a 'content' field with children
      if (Array.isArray(block.content)) {
        block.content.forEach((contentItem) => {
          if (contentItem.children && Array.isArray(contentItem.children)) {
            contentItem.children.forEach((child) => {
              if (child.type === "text" && child.text) {
                extractedText += " " + child.text
              }
            })
          }
        })
      }
    }
  })
  
  return extractedText.trim()
}

// Function to generate searchable content
function generateSearchableContent(title, quote, richBody, author) {
  const richBodyText = extractTextFromRichBody(richBody)
  return `${title || ""} ${quote || ""} ${richBodyText} ${author || ""}`.trim()
}

// Keyword-extractor based tag generation helper
function generateTags(title, richBody) {
  const keywordExtractor = require("keyword-extractor")

  let fullText = title || ""

  // Extract text from rich_body dynamic zone
  if (richBody && Array.isArray(richBody)) {
    richBody.forEach((block) => {
      if (block.__component === "blocks.enhanced-text" && block.content) {
        if (Array.isArray(block.content)) {
          block.content.forEach((contentItem) => {
            if (contentItem.children && Array.isArray(contentItem.children)) {
              contentItem.children.forEach((child) => {
                if (child.type === "text" && child.text) {
                  fullText += " " + child.text
                }
              })
            }
          })
        }
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

// Helper function to generate unique slug (adapted from opinion lifecycles)
async function generateSlug(title, existingId = null) {
  let baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim("-") // Remove leading/trailing hyphens

  // If the baseSlug is empty after sanitization (e.g., title was just special characters),
  // provide a fallback to prevent an empty slug.
  if (!baseSlug) {
    baseSlug = "article" // Or some other default like 'untitled'
  }

  let slug = baseSlug
  let counter = 1

  // Check for existing slugs, excluding the current record if updating
  while (true) {
    const existing = await global.strapi.entityService.findMany("api::article.article", {
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
    })

    // If more than 6 regular articles, archive the oldest ones
    if (activeRegularArticles.length > 6) {
      const articlesToArchive = activeRegularArticles.slice(6)
      for (const article of articlesToArchive) {
        await global.strapi.entityService.update("api::article.article", article.id, {
          data: { homepage_status: "archived" },
        })
      }
    }

    // Handle featured limit (3 items across articles and opinions)
    const featuredArticles = await global.strapi.entityService.findMany("api::article.article", {
      filters: { publishedAt: { $notNull: true }, is_featured: true },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    })

    const featuredOpinions = await global.strapi.entityService.findMany("api::opinion.opinion", {
      filters: { publishedAt: { $notNull: true }, is_featured: true },
      sort: { date: "desc" },
      pagination: { limit: -1 },
    })

    const allFeatured = [
      ...featuredArticles.map((item) => ({ ...item, type: "article" })),
      ...featuredOpinions.map((item) => ({ ...item, type: "opinion" })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date))

    if (allFeatured.length > 3) {
      const itemsToUnfeature = allFeatured.slice(3)
      for (const item of itemsToUnfeature) {
        const collection = item.type === "article" ? "api::article.article" : "api::opinion.opinion"
        await global.strapi.entityService.update(collection, item.id, {
          data: {
            is_featured: false,
            ...(item.type === "article" ? { homepage_status: "active" } : {}),
          },
        })
      }
    }
  } catch (error) {
    console.error("Error managing homepage limits:", error)
  }
}

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params

    // Always generate slug from title if title is present, overriding any pre-filled value
    if (data.title) {
      data.slug = await generateSlug(data.title)
      // Auto-generate canonical URL based on slug if not already set
      if (!data.canonicalUrl) {
        data.canonicalUrl = generateCanonicalUrl(data.slug)
      }
    }

    // Generate searchable content from all text fields - but skip rich_body for now since it's not populated
    if (data.title || data.quote || data.author) {
      // For create, we'll populate searchableContent in afterCreate when components are saved
      data.searchableContent = `${data.title || ""} ${data.quote || ""} ${data.author || ""}`.trim()
    }

    // Generate tags from title and rich_body content
    if (data.title || data.rich_body) {
      data.relatedTags = generateTags(data.title, data.rich_body)
    }

    if (data.publishedAt) {
      data.date = new Date()
      data.homepage_status = "active"
    }
    if (data.category && typeof data.category === "string") {
      const category = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.category } } },
      })
      data.category = category.data.id
    }
    if (data.secondary_category && typeof data.secondary_category === "string") {
      const secondaryCategory = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.secondary_category } } },
      })
      data.secondary_category = secondaryCategory.data.id
    }
  },

  async beforeUpdate(event) {
    const { data, where } = event.params

    // Always generate slug from title if title is present, overriding any pre-filled value
    // and ensuring uniqueness for updates
    if (data.title) {
      data.slug = await generateSlug(data.title, where.id)
      // Auto-generate canonical URL based on new slug if not already set
      if (!data.canonicalUrl) {
        data.canonicalUrl = generateCanonicalUrl(data.slug)
      }
    }

    // Regenerate searchable content if any relevant field changed
    if (data.title !== undefined || data.quote !== undefined || data.rich_body !== undefined || data.author !== undefined) {
      // Get existing data with populated rich_body to merge with updates
      const existingEntry = await global.strapi.entityService.findOne("api::article.article", where.id, {
        populate: ["rich_body"],
      })

      const titleToUse = data.title !== undefined ? data.title : existingEntry.title
      const quoteToUse = data.quote !== undefined ? data.quote : existingEntry.quote
      const authorToUse = data.author !== undefined ? data.author : existingEntry.author
      
      // For rich_body, use the populated data from existing entry if rich_body wasn't changed
      // If rich_body was changed, the new data won't be populated yet, so we'll handle it in afterUpdate
      const richBodyToUse = data.rich_body !== undefined ? existingEntry.rich_body : existingEntry.rich_body

      data.searchableContent = generateSearchableContent(titleToUse, quoteToUse, richBodyToUse, authorToUse)
    }

    // Regenerate tags if title or rich_body changed
    if (data.title !== undefined || data.rich_body !== undefined) {
      // Get existing data to merge with updates
      const existingEntry = await global.strapi.entityService.findOne("api::article.article", where.id, {
        populate: ["rich_body"],
      })

      const titleToUse = data.title !== undefined ? data.title : existingEntry.title
      const richBodyToUse = existingEntry.rich_body // Use existing populated rich_body

      data.relatedTags = generateTags(titleToUse, richBodyToUse)
    }

    if (data.publishedAt) {
      const existingEntry = await global.strapi.entityService.findOne("api::article.article", where.id)
      if (!existingEntry.publishedAt) {
        data.date = new Date()
        data.homepage_status = "active"
      }
    }
    if (data.category && typeof data.category === "string") {
      const category = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.category } } },
      })
      data.category = category.data.id
    }
    if (data.secondary_category && typeof data.secondary_category === "string") {
      const secondaryCategory = await strapi.controller("api::category.category").createIfNotExists({
        request: { body: { data: { name: data.secondary_category } } },
      })
      data.secondary_category = secondaryCategory.data.id
    }
  },

  async afterCreate(event) {
    const { result } = event
    
    // Update searchableContent with rich_body text after components are saved
    if (result.rich_body && result.rich_body.length > 0) {
      try {
        const fullEntry = await global.strapi.entityService.findOne("api::article.article", result.id, {
          populate: ["rich_body"]
        })
        
        const searchableContent = generateSearchableContent(
          fullEntry.title, 
          fullEntry.quote, 
          fullEntry.rich_body, 
          fullEntry.author
        )
        
        const updatedTags = generateTags(fullEntry.title, fullEntry.rich_body)
        
        await global.strapi.entityService.update("api::article.article", result.id, {
          data: { 
            searchableContent,
            relatedTags: updatedTags
          }
        })
      } catch (error) {
        console.error("Error updating searchableContent in afterCreate:", error)
      }
    }
    
    if (result.publishedAt) {
      await manageHomepageLimits()
    }
  },

  async afterUpdate(event) {
    const { result, params } = event
    
    // Only update searchableContent if rich_body was specifically changed
    if (params.data.rich_body !== undefined) {
      try {
        const fullEntry = await global.strapi.entityService.findOne("api::article.article", result.id, {
          populate: ["rich_body"]
        })
        
        const searchableContent = generateSearchableContent(
          fullEntry.title, 
          fullEntry.quote, 
          fullEntry.rich_body, 
          fullEntry.author
        )
        
        const updatedTags = generateTags(fullEntry.title, fullEntry.rich_body)
        
        await global.strapi.entityService.update("api::article.article", result.id, {
          data: { 
            searchableContent,
            relatedTags: updatedTags
          }
        })
      } catch (error) {
        console.error("Error updating searchableContent in afterUpdate:", error)
      }
    }
    
    if (params.data.publishedAt || params.data.hasOwnProperty("is_featured")) {
      await manageHomepageLimits()
    }
  },
}