export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const {
    query = "",
    page = 1,
    pageSize = 15, // Changed from 10 to 15
    sortBy = "date_desc",
    searchType = "articles", // "articles" or "external"
    dateFrom,
    dateTo,
    author,
    category,
  } = req.query

  if (!query.trim()) {
    return res.status(400).json({ message: "Search query is required" })
  }

  try {
    const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL
    const searchTerm = encodeURIComponent(query.trim())

    const allResults = []

    if (searchType === "articles") {
      // Search articles only (includes both regular and opinion articles)
      const articlesUrl = `${baseUrl}/api/articles?filters[$or][0][title][$containsi]=${searchTerm}&filters[$or][1][rich_body][$containsi]=${searchTerm}&filters[$or][2][author][$containsi]=${searchTerm}&filters[$or][3][quote][$containsi]=${searchTerm}&filters[$or][4][category][name][$containsi]=${searchTerm}&filters[$or][5][secondary_category][name][$containsi]=${searchTerm}&populate=*`

      const articlesRes = await fetch(articlesUrl)

      let articlesData = { data: [] }

      if (articlesRes.ok) {
        try {
          articlesData = await articlesRes.json()
        } catch (e) {
          console.error("Articles JSON parse error:", e)
        }
      } else {
        console.error("Articles API error:", articlesRes.status, articlesRes.statusText)
      }

      // Process Articles (includes both regular and opinion articles)
      if (articlesData?.data && Array.isArray(articlesData.data)) {
        articlesData.data.forEach((item) => {
          if (item?.attributes) {
            const searchScore = calculateSearchScore(item.attributes, query, "article")
            // Determine if it's an opinion article based on category
            const isOpinion = item.attributes.category?.data?.attributes?.name?.toLowerCase() === "opinion"
            allResults.push({
              id: item.id,
              type: isOpinion ? "opinion" : "article",
              attributes: item.attributes,
              searchScore,
            })
          }
        })
      }
    } else if (searchType === "external") {
      // Search external articles only
      const externalUrl = `${baseUrl}/api/external-articles?filters[$or][0][title][$containsi]=${searchTerm}&filters[$or][1][quote][$containsi]=${searchTerm}&filters[$or][2][author][$containsi]=${searchTerm}&filters[$or][3][category][$containsi]=${searchTerm}&populate=*`

      const externalRes = await fetch(externalUrl)

      let externalData = { data: [] }

      if (externalRes.ok) {
        try {
          externalData = await externalRes.json()
        } catch (e) {
          console.error("External JSON parse error:", e)
        }
      }

      // Process External Articles
      if (externalData?.data && Array.isArray(externalData.data)) {
        externalData.data.forEach((item) => {
          if (item?.attributes) {
            const searchScore = calculateSearchScore(item.attributes, query, "external")
            allResults.push({
              id: item.id,
              type: "external",
              attributes: item.attributes,
              searchScore,
            })
          }
        })
      }
    }

    // Apply advanced filters
    const filteredResults = applyFilters(allResults, { dateFrom, dateTo, author, category, searchType })

    // Sort results
    const sortedResults = sortResults(filteredResults, sortBy, searchType)

    // Pagination
    const startIndex = (Number.parseInt(page) - 1) * Number.parseInt(pageSize)
    const endIndex = startIndex + Number.parseInt(pageSize)
    const paginatedResults = sortedResults.slice(startIndex, endIndex)
    const totalPages = Math.ceil(sortedResults.length / Number.parseInt(pageSize))

    res.status(200).json({
      results: paginatedResults,
      pagination: {
        page: Number.parseInt(page),
        pageSize: Number.parseInt(pageSize),
        total: sortedResults.length,
        totalPages,
      },
      query: {
        searchTerm: query,
        searchType,
        sortBy,
        filters: {
          dateFrom,
          dateTo,
          author,
          category,
        },
      },
    })
  } catch (error) {
    console.error("Search API error:", error)
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    })
  }
}

// Calculate search score based on content type
function calculateSearchScore(attributes, query, type) {
  let searchScore = 1
  const lowerQuery = query.toLowerCase()
  const title = (attributes.title || "").toLowerCase()
  const author = (attributes.author || "").toLowerCase()

  // Title match gets highest score
  if (title.includes(lowerQuery)) searchScore += 10

  // Author match gets medium score
  if (author.includes(lowerQuery)) searchScore += 5

  if (type === "external") {
    // For external articles, check category and quote
    const category = (attributes.category || "").toLowerCase()
    const quote = (attributes.quote || "").toLowerCase()

    if (category.includes(lowerQuery)) searchScore += 3
    if (quote.includes(lowerQuery)) searchScore += 2
  } else {
    // For articles, also check category names
    const primaryCat = (attributes.category?.data?.attributes?.name || "").toLowerCase()
    const secondaryCat = (attributes.secondary_category?.data?.attributes?.name || "").toLowerCase()

    if (primaryCat.includes(lowerQuery)) searchScore += 4
    if (secondaryCat.includes(lowerQuery)) searchScore += 4

    // For articles, check tags if they exist (safe check for future tags)
    if (attributes.tags?.data && Array.isArray(attributes.tags.data)) {
      const tagMatch = attributes.tags.data.some(
        (tag) => tag?.attributes?.name && (tag.attributes.name || "").toLowerCase().includes(lowerQuery),
      )
      if (tagMatch) searchScore += 7
    }

    // Also check quote field for articles
    const quote = (attributes.quote || "").toLowerCase()
    if (quote.includes(lowerQuery)) searchScore += 3
  }

  return searchScore
}

// Apply filters based on search type
function applyFilters(results, { dateFrom, dateTo, author, category, searchType }) {
  let filteredResults = results

  // Date filter
  if (dateFrom || dateTo) {
    filteredResults = filteredResults.filter((item) => {
      // Both types use 'date' field
      const itemDate = new Date(item.attributes.date)

      if (dateFrom && itemDate < new Date(dateFrom)) return false
      if (dateTo && itemDate > new Date(dateTo)) return false
      return true
    })
  }

  // Author filter
  if (author) {
    filteredResults = filteredResults.filter((item) =>
      (item.attributes.author || "").toLowerCase().includes(author.toLowerCase()),
    )
  }

  // Category filter
  if (category && category !== "all") {
    filteredResults = filteredResults.filter((item) => {
      if (searchType === "external") {
        return (item.attributes.category || "").toLowerCase().includes(category.toLowerCase())
      } else {
        if (item.type === "opinion") {
          return category.toLowerCase() === "opinion"
        } else {
          const primaryCat = item.attributes.category?.data?.attributes?.name || ""
          const secondaryCat = item.attributes.secondary_category?.data?.attributes?.name || ""
          return (
            primaryCat.toLowerCase().includes(category.toLowerCase()) ||
            secondaryCat.toLowerCase().includes(category.toLowerCase())
          )
        }
      }
    })
  }

  return filteredResults
}

// Sort results based on search type
function sortResults(results, sortBy, searchType) {
  switch (sortBy) {
    case "relevance":
      return results.sort((a, b) => {
        if (b.searchScore !== a.searchScore) {
          return b.searchScore - a.searchScore
        }
        // Secondary sort by date
        const dateA = new Date(a.attributes.date || 0)
        const dateB = new Date(b.attributes.date || 0)
        return dateB - dateA
      })
    case "date_desc":
      return results.sort((a, b) => {
        const dateA = new Date(a.attributes.date || 0)
        const dateB = new Date(b.attributes.date || 0)
        return dateB - dateA
      })
    case "date_asc":
      return results.sort((a, b) => {
        const dateA = new Date(a.attributes.date || 0)
        const dateB = new Date(b.attributes.date || 0)
        return dateA - dateB
      })
    case "author_asc":
      return results.sort((a, b) => (a.attributes.author || "").localeCompare(b.attributes.author || ""))
    default:
      return results.sort((a, b) => {
        const dateA = new Date(a.attributes.date || 0)
        const dateB = new Date(b.attributes.date || 0)
        return dateB - dateA
      })
  }
}
