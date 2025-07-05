/**
 * Generate smart page numbers for pagination
 * @param {number} currentPage - Current active page
 * @param {number} totalPages - Total number of pages
 * @param {boolean} isMobile - Whether to generate mobile-optimized pagination
 * @returns {Array} Array of page numbers and ellipsis
 */
export function generatePageNumbers(currentPage, totalPages, isMobile = false) {
  const pages = []
  const delta = isMobile ? 1 : 2 // Show fewer pages on mobile
  const range = delta + 1
  const rangeWithDots = delta + 4

  if (totalPages <= (isMobile ? 5 : 7)) {
    // Show all pages if total is small
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }

  if (currentPage <= range) {
    // Near the beginning
    for (let i = 1; i <= Math.min(rangeWithDots, totalPages); i++) {
      pages.push(i)
    }
    if (rangeWithDots < totalPages) {
      pages.push("...")
      // Add milestone pages
      if (!isMobile) {
        addMilestonePages(pages, rangeWithDots + 1, totalPages)
      }
      pages.push(totalPages)
    }
  } else if (currentPage >= totalPages - range) {
    // Near the end
    pages.push(1)
    if (!isMobile) {
      addMilestonePages(pages, 1, totalPages - rangeWithDots)
    }
    if (totalPages - rangeWithDots > 1) {
      pages.push("...")
    }
    for (let i = Math.max(totalPages - rangeWithDots, 1); i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // In the middle
    pages.push(1)
    if (!isMobile) {
      addMilestonePages(pages, 1, currentPage - delta - 1)
    }
    if (currentPage - delta > 2) {
      pages.push("...")
    }

    for (let i = Math.max(currentPage - delta, 1); i <= Math.min(currentPage + delta, totalPages); i++) {
      pages.push(i)
    }

    if (currentPage + delta < totalPages - 1) {
      pages.push("...")
    }
    if (!isMobile) {
      addMilestonePages(pages, currentPage + delta + 1, totalPages)
    }
    pages.push(totalPages)
  }

  return pages
}

/**
 * Add milestone pages (every 10th page) to pagination
 * @param {Array} pages - Current pages array
 * @param {number} start - Start range
 * @param {number} end - End range
 */
function addMilestonePages(pages, start, end) {
  const milestones = []

  // Find milestone pages (multiples of 10) in the range
  for (let i = Math.ceil(start / 10) * 10; i < end; i += 10) {
    if (i > start && i < end && !pages.includes(i)) {
      milestones.push(i)
    }
  }

  // Add up to 2 milestone pages to avoid clutter
  milestones.slice(0, 2).forEach((milestone) => {
    if (!pages.includes(milestone)) {
      pages.push(milestone)
    }
  })
}

/**
 * Get page number from URL query parameters
 * @param {Object} query - Next.js router query object
 * @param {string} param - URL parameter name (default: 'page')
 * @returns {number} Page number (defaults to 1)
 */
export function getPageFromQuery(query, param = "page") {
  const page = Number.parseInt(query[param]) || 1
  return Math.max(1, page) // Ensure page is at least 1
}
