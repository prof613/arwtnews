"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"
import AdvancedPagination from "../components/AdvancedPagination"
import { getPageFromQuery } from "../utils/paginationHelpers"
import Link from "next/link"

export default function SearchAllArticles() {
  const router = useRouter()
  const { query: urlQuery } = router.query

  // State for the *submitted* search term, derived from the URL
  const [searchQuery, setSearchQuery] = useState(urlQuery || "")
  // State for the live value in the input field
  const [inputValue, setInputValue] = useState(urlQuery || "")

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(() => getPageFromQuery(router.query))
  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  // Advanced search state
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [authorFilter, setAuthorFilter] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [sortBy, setSortBy] = useState("relevance")

  // Recent searches
  const [recentSearches, setRecentSearches] = useState([])

  // Load recent searches on mount
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Effect to perform the search when the committed query, page, or filters change
  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults([])
        setTotalPages(1)
        setTotalResults(0)
        return
      }

      setLoading(true)
      try {
        const params = new URLSearchParams({
          query: searchQuery,
          searchType: "articles",
          page: page.toString(),
          pageSize: "15",
        })

        // Add advanced search parameters
        if (dateFrom) params.append("dateFrom", dateFrom)
        if (dateTo) params.append("dateTo", dateTo)
        if (authorFilter) params.append("author", authorFilter)
        if (categoryFilter && categoryFilter !== "all") params.append("category", categoryFilter)
        if (sortBy) params.append("sortBy", sortBy)

        const response = await axios.get(`/api/search?${params.toString()}`)

        setResults(response.data.results)
        setTotalPages(response.data.pagination.totalPages)
        setTotalResults(response.data.pagination.total)
      } catch (error) {
        console.error("Error performing search:", error)
        setResults([])
        setTotalPages(1)
        setTotalResults(0)
      } finally {
        setLoading(false)
      }
    }

    // Only run search if there is a query
    if (searchQuery) {
      performSearch()
    } else {
      // Clear results if there is no query
      setResults([])
      setTotalPages(1)
      setTotalResults(0)
    }
  }, [searchQuery, page, dateFrom, dateTo, authorFilter, categoryFilter, sortBy])

  // Effect to sync component state with URL changes (e.g., back/forward buttons)
  useEffect(() => {
    const currentQuery = router.query.query || ""
    const currentPage = getPageFromQuery(router.query)

    setSearchQuery(currentQuery)
    setInputValue(currentQuery)
    setPage(currentPage)
  }, [router.query])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      router.push(`/search-all-articles?query=${encodeURIComponent(searchQuery)}&page=${newPage}`)
      window.scrollTo(0, 0)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const trimmedQuery = inputValue.trim()
    if (trimmedQuery) {
      // Save to recent searches
      const updated = [trimmedQuery, ...recentSearches.filter((s) => s !== trimmedQuery)].slice(0, 5)
      setRecentSearches(updated)
      localStorage.setItem("recentSearches", JSON.stringify(updated))

      // Navigate to the new search URL, which will trigger the search effect
      router.push(`/search-all-articles?query=${encodeURIComponent(trimmedQuery)}`)
    }
  }

  const clearAdvancedFilters = () => {
    setDateFrom("")
    setDateTo("")
    setAuthorFilter("")
    setCategoryFilter("")
    setSortBy("relevance")
  }

  const highlightText = (text, query) => {
    if (!query.trim() || !text) return text

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  return (
    <>
      <Head>
        <title>{`${searchQuery ? `Search Results for "${searchQuery}"` : "Search Our Articles"} | Red, White and True News`}</title>
        <meta name="description" content="The RIGHT News For America" />
        <meta property="og:title" content="Red, White and True News" />
        <meta property="og:description" content="The RIGHT News For America" />
        <meta property="og:image" content="images\core\og-image.jpg" />
        <meta property="og:url" content="RWTNews.com" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Red, White and True News" />
        <meta name="twitter:description" content="The RIGHT News For America" />
        <meta name="twitter:image" content="images\core\og-image.jpg" />
        <meta name="twitter:url" content="RWTNews.com" />
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />

          {/* Search Header */}
          <div className="my-6">
            <h1 className="text-4xl font-bold text-[#3C3B6E] text-center mb-4">
              {searchQuery ? `Search Results for "${searchQuery}"` : "Search Our Articles"}
            </h1>

            {/* Search Type Info */}
            <div className="mb-4">
              <div className="flex justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <span className="text-[#3C3B6E] font-medium text-lg">Searching: Our Articles & Opinions</span>
                  <div className="text-sm text-gray-600 mt-1">
                    <Link href="/search-web-articles" className="text-[#B22234] hover:underline font-bold">
                      Switch to Web Archive Search →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Basic Search Form */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Search our articles, authors, tags..."
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B22234] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="bg-[#B22234] text-white px-6 py-3 rounded-lg hover:bg-[#8B1A1A] disabled:opacity-50"
                  disabled={!inputValue.trim() || loading}
                >
                  {loading ? "Searching..." : "Search"}
                </button>
              </div>
            </form>

            {/* Advanced Search Toggle */}
            <div className="mb-4">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-[#B22234] hover:underline font-medium"
              >
                {showAdvanced ? "Hide" : "Show"} Advanced Search Options
              </button>
            </div>

            {/* Advanced Search Options */}
            {showAdvanced && (
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="text-lg font-semibold text-[#3C3B6E] mb-3">Advanced Search</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Date Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B22234]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B22234]"
                    />
                  </div>

                  {/* Author Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <input
                      type="text"
                      value={authorFilter}
                      onChange={(e) => setAuthorFilter(e.target.value)}
                      placeholder="Filter by author..."
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B22234]"
                    />
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#B22234]"
                    >
                      <option value="">All Categories</option>
                      <option value="politics">Politics</option>
                      <option value="news">News</option>
                      <option value="opinion">Opinion</option>
                      <option value="economy">Economy</option>
                      <option value="world">World</option>
                      <option value="culture">Culture</option>
                    </select>
                  </div>
                </div>

                {/* Sort Options */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "relevance", label: "Relevance" },
                      { value: "date_desc", label: "Newest First" },
                      { value: "date_asc", label: "Oldest First" },
                      { value: "author_asc", label: "Author A-Z" },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`px-3 py-1 rounded text-sm ${
                          sortBy === option.value
                            ? "bg-[#B22234] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <div className="mt-4">
                  <button onClick={clearAdvancedFilters} className="text-[#B22234] hover:underline text-sm">
                    Clear All Filters
                  </button>
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && !searchQuery && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches:</h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInputValue(search)
                        router.push(`/search-all-articles?query=${encodeURIComponent(search)}`)
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Summary */}
            {searchQuery && (
              <div className="mb-4 text-sm text-gray-600">
                {loading ? (
                  <p>Searching our articles...</p>
                ) : (
                  <p>
                    {totalResults > 0
                      ? `Found ${totalResults} result${totalResults !== 1 ? "s" : ""} for "${searchQuery}" in our articles`
                      : `No results found for "${searchQuery}" in our articles`}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search Results */}
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#B22234]"></div>
              <p className="text-gray-600 mt-2">Searching...</p>
            </div>
          ) : results.length === 0 && searchQuery ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No results found for "{searchQuery}"</p>
              <div className="text-sm text-gray-500">
                <p>Try:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Checking your spelling</li>
                  <li>Using different keywords</li>
                  <li>Using more general terms</li>
                  <li>
                    <Link href="/search-web-articles" className="text-[#B22234] hover:underline">
                      Searching our web archive instead
                    </Link>
                  </li>
                  <li>Removing advanced filters</li>
                </ul>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="flex flex-col gap-6">
              {results.map((item) => (
                <div
                  key={`${item.type}-${item.id}`}
                  className="border-l-4 border-[#B22234] p-4 bg-gray-50 rounded-r-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => {
                    const url =
                      item.type === "opinion"
                        ? `/opinions/${item.attributes.slug}`
                        : `/articles/${item.attributes.slug}`
                    router.push(url)
                  }}
                >
                  <div className="flex gap-4">
                    <div className="w-1/4 flex-shrink-0">
                      <img
                        src={
                          item.type === "opinion"
                            ? item.attributes.image_path
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image_path}`
                              : item.attributes.featured_image?.data?.attributes?.formats?.small?.url ||
                                item.attributes.featured_image?.data?.attributes?.url
                                ? (item.attributes.featured_image.data.attributes.formats?.small?.url ||
                                   item.attributes.featured_image.data.attributes.url).startsWith('http')
                                  ? (item.attributes.featured_image.data.attributes.formats?.small?.url ||
                                     item.attributes.featured_image.data.attributes.url)
                                  : `${process.env.NEXT_PUBLIC_STRAPI_URL}${
                                      item.attributes.featured_image.data.attributes.formats?.small?.url ||
                                      item.attributes.featured_image.data.attributes.url
                                    }`
                                : "/images/core/placeholder.jpg"
                            : item.attributes.image_path
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image_path}`
                              : item.attributes.image?.data?.attributes?.formats?.small?.url ||
                                item.attributes.image?.data?.attributes?.url
                                ? (item.attributes.image.data.attributes.formats?.small?.url ||
                                   item.attributes.image.data.attributes.url).startsWith('http')
                                  ? (item.attributes.image.data.attributes.formats?.small?.url ||
                                     item.attributes.image.data.attributes.url)
                                  : `${process.env.NEXT_PUBLIC_STRAPI_URL}${
                                      item.attributes.image.data.attributes.formats?.small?.url ||
                                      item.attributes.image.data.attributes.url
                                    }`
                                : "/images/core/placeholder.jpg"
                        }
                        alt={
                          item.type === "opinion"
                            ? item.attributes.featured_image?.data?.attributes?.alternativeText || item.attributes.title
                            : item.attributes.image?.data?.attributes?.alternativeText || item.attributes.title
                        }
                        className="w-full h-auto md:h-24 object-contain rounded bg-gray-50"
                      />
                    </div>

                    <div className="flex-1">
                      {/* Title */}
                      <Link
                        href={
                          item.type === "opinion"
                            ? `/opinions/${item.attributes.slug}`
                            : `/articles/${item.attributes.slug}`
                        }
                      >
                        <h3 className="text-xl font-bold text-[#3C3B6E] hover:text-[#B22234] cursor-pointer mb-2">
                          {highlightText(item.attributes.title, searchQuery)}
                        </h3>
                      </Link>

                      {/* Metadata */}
                      <p className="text-sm text-gray-600 mb-2">
                        {(() => {
                          let categoryText = ""
                          if (item.type === "opinion") {
                            categoryText = "Opinion"
                          } else {
                            const primaryCat = item.attributes.category?.data?.attributes?.name
                            const secondaryCat = item.attributes.secondary_category?.data?.attributes?.name
                            if (primaryCat && secondaryCat) {
                              categoryText = `${primaryCat} - ${secondaryCat}`
                            } else {
                              categoryText = primaryCat || secondaryCat || "General"
                            }
                          }

                          const authorText = item.attributes.author || "Unknown"
                          const displayDate = item.attributes.date

                          return (
                            <>
                              {highlightText(categoryText, searchQuery)} / {highlightText(authorText, searchQuery)} /{" "}
                              {new Date(displayDate).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                                timeZone: "America/Los_Angeles",
                              })}
                            </>
                          )
                        })()}
                      </p>

                      {/* Tags */}
                      {item.attributes.tags?.data && item.attributes.tags.data.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {item.attributes.tags.data.slice(0, 5).map((tag) => (
                            <span
                              key={tag.id}
                              className="inline-block bg-[#B22234] text-white text-xs px-2 py-1 rounded-full"
                            >
                              {highlightText(tag.attributes.name, searchQuery)}
                            </span>
                          ))}
                          {item.attributes.tags.data.length > 5 && (
                            <span className="text-xs text-gray-500">+{item.attributes.tags.data.length - 5} more</span>
                          )}
                        </div>
                      )}

                      {/* Quote */}
                      {item.attributes.quote && (
                        <blockquote className="text-sm text-gray-500 italic mb-2 border-l-4 border-[#B22234] pl-2">
                          {highlightText(item.attributes.quote.substring(0, 150), searchQuery)}
                          {item.attributes.quote.length > 150 && "..."}
                        </blockquote>
                      )}

                      {/* Content Preview */}
                      <p className="text-sm text-gray-500 mb-2">
                        {(() => {
                          let preview = ""
                          if (item.type === "opinion") {
                            if (typeof item.attributes.rich_body === "string") {
                              const cleanText = item.attributes.rich_body.replace(/<[^>]*>/g, "")
                              preview = cleanText.substring(0, 200)
                            }
                          } else {
                            if (Array.isArray(item.attributes.rich_body)) {
                              let excerpt = ""
                              for (const block of item.attributes.rich_body) {
                                if (block.type === "paragraph" && block.children) {
                                  const text = block.children.map((child) => child.text).join("")
                                  excerpt += text + " "
                                  if (excerpt.length > 200) break
                                }
                              }
                              preview = excerpt.substring(0, 200)
                            }
                          }
                          return highlightText(preview, searchQuery)
                        })()}...
                      </p>

                      {/* Action Link */}
                      <Link
                        href={
                          item.type === "opinion"
                            ? `/opinions/${item.attributes.slug}`
                            : `/articles/${item.attributes.slug}`
                        }
                        className="text-[#B22234] hover:underline font-medium text-sm"
                      >
                        Read Full Article →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <AdvancedPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          )}
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}