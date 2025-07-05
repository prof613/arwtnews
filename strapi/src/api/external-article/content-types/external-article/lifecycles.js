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

    // REMOVED: Auto-deletion logic - let frontend handle 1-year filtering instead
    // This prevents unexpected data loss and allows for better control
  },

  async beforeUpdate(event) {
    const { data, where } = event.params

    // Auto-generate slug if title changed but slug is empty
    if (data.title && !data.slug) {
      data.slug = generateSlug(data.title)
    }

    // DON'T auto-set date - preserve the manually input date

    // REMOVED: Auto-deletion logic on update
    // Frontend will handle 1-year filtering for display purposes
  },
}
