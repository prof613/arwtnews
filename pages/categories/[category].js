"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import MainBanner from "../../components/MainBanner"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import Link from "next/link"

// Function to format date properly (fix timezone issue)
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  return utcDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function Category() {
  const router = useRouter()
  const { category } = router.query
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (category) {
      async function fetchItems() {
        try {
          let endpoint
          let combinedItems = []

          if (category === "All") {
            // Fetch both articles and opinions for "All" category
            const [articlesRes, opinionsRes] = await Promise.all([
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10`,
              ),
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10`,
              ),
            ])

            // Combine and sort by date
            const articles = articlesRes.data.data.map((item) => ({ ...item, type: "article" }))
            const opinions = opinionsRes.data.data.map((item) => ({ ...item, type: "opinion" }))
            combinedItems = [...articles, ...opinions].sort(
              (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date),
            )

            // Calculate total pages (simplified - using articles pagination for now)
            setTotalPages(
              Math.max(articlesRes.data.meta.pagination.pageCount, opinionsRes.data.meta.pagination.pageCount),
            )
          } else if (category === "news-from-web") {
            // Get external articles - use SYSTEM DATE for sorting/filtering, MANUAL DATE for display
            const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/external-articles?populate=*`)

            // Filter articles within 1 year based on SYSTEM DATE and sort by SYSTEM DATE (newest first)
            const oneYearAgo = new Date()
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

            combinedItems = res.data.data
              .filter((item) => {
                const systemDate = new Date(item.attributes.createdAt) // Use system date for filtering
                return systemDate >= oneYearAgo
              })
              .map((item) => ({ ...item, type: "external" }))
              .sort((a, b) => {
                const systemDateA = new Date(a.attributes.createdAt) // Use system date for sorting
                const systemDateB = new Date(b.attributes.createdAt) // Use system date for sorting
                return systemDateB - systemDateA // Newest system date first
              })

            setTotalPages(1) // Only one page since we filter and don't paginate
          } else if (category === "Meme-Cartoons") {
            endpoint = "/api/memes?populate=*&sort[0]=date:desc"
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}${endpoint}&pagination[page]=${page}&pagination[pageSize]=10`,
            )
            combinedItems = res.data.data
            setTotalPages(res.data.meta.pagination.pageCount)
          } else {
            // Fetch both articles and opinions that match the category
            const [articlesRes, opinionsRes] = await Promise.all([
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[$or][0][category][name][$eq]=${category}&filters[$or][1][secondary_category][name][$eq]=${category}&populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10`,
              ),
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[secondary_category][name][$eq]=${category}&populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10`,
              ),
            ])

            // Combine and sort by date
            const articles = articlesRes.data.data.map((item) => ({ ...item, type: "article" }))
            const opinions = opinionsRes.data.data.map((item) => ({ ...item, type: "opinion" }))
            combinedItems = [...articles, ...opinions].sort(
              (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date),
            )

            // Calculate total pages (simplified - using articles pagination for now)
            setTotalPages(
              Math.max(articlesRes.data.meta.pagination.pageCount, opinionsRes.data.meta.pagination.pageCount),
            )
          }

          setItems(combinedItems)
        } catch (error) {
          console.error("Error fetching items:", error)
        }
      }
      fetchItems()
    }
  }, [category, page])

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      window.scrollTo(0, 0)
    }
  }

  const handleExternalLinkClick = (e, link) => {
    e.preventDefault()
    if (confirm("You're about to visit an external site. Continue?")) {
      window.open(link, "_blank")
    }
  }

  if (!items) return <p>Loading...</p>

  return (
    <>
      <Head>
        <title>{category} | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">
            {category === "All" ? "All Articles" : category === "news-from-web" ? "News from the Web" : category}{" "}
            Archives
          </h1>
          {items.length === 0 ? (
            <p>No items available.</p>
          ) : category === "news-from-web" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((item) => (
                <div key={item.id} className="p-4 border border-gray-200 rounded-lg">
                  <h3 className="text-xl font-bold text-[#3C3B6E] mb-2 hover:text-[#B22234]">
                    <a
                      href={item.attributes.link}
                      onClick={(e) => handleExternalLinkClick(e, item.attributes.link)}
                      className="cursor-pointer"
                    >
                      {item.attributes.title}
                    </a>
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {item.attributes.author || "Unknown"} / {item.attributes.category || "General"} /{" "}
                    {/* Display MANUAL DATE for user viewing */}
                    {item.attributes.date ? formatDate(item.attributes.date) : "No date"}
                  </p>
                  {item.attributes.quote && (
                    <p className="text-sm text-gray-500 mb-3 italic border-l-4 border-[#B22234] pl-2 line-clamp-2">
                      "{item.attributes.quote}"...{" "}
                      <a
                        href={item.attributes.link}
                        onClick={(e) => handleExternalLinkClick(e, item.attributes.link)}
                        className="text-[#B22234] hover:underline not-italic"
                      >
                        see more
                      </a>
                    </p>
                  )}
                  <div className="flex justify-between items-center text-sm">
                    <a
                      href={item.attributes.link}
                      onClick={(e) => handleExternalLinkClick(e, item.attributes.link)}
                      className="text-[#B22234] hover:underline font-medium"
                    >
                      Read Full Article →
                    </a>
                    <span className="text-gray-600">
                      Source:{" "}
                      <a
                        href={item.attributes.source_url}
                        onClick={(e) => handleExternalLinkClick(e, item.attributes.source_url)}
                        className="text-[#B22234] hover:underline"
                      >
                        {item.attributes.source}
                      </a>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : category === "Meme-Cartoons" ? (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="p-2">
                  <img
                    src={
                      item.attributes.image_path
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image_path}`
                        : item.attributes.image?.data?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image.data.attributes.url}`
                          : "/images/core/placeholder.jpg"
                    }
                    alt="Meme"
                    className="w-full h-auto rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    {item.attributes.artist || "Unknown"} /{" "}
                    {new Date(item.attributes.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={
                    item.type === "opinion" ? `/opinions/${item.attributes.slug}` : `/articles/${item.attributes.slug}`
                  }
                >
                  <div className="flex gap-6 p-2">
                    <div className="w-1/3">
                      <img
                        src={
                          item.type === "opinion"
                            ? item.attributes.image_path
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image_path}`
                              : item.attributes.featured_image?.data?.attributes?.url
                                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.featured_image.data.attributes.url}`
                                : "/images/core/placeholder.jpg"
                            : item.attributes.image_path
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image_path}`
                              : item.attributes.image?.data?.attributes?.url
                                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image.data.attributes.url}`
                                : "/images/core/placeholder.jpg"
                        }
                        alt={item.attributes.title}
                        className="w-full aspect-video object-cover rounded"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        {(() => {
                          const primaryCat = item.attributes.category?.data?.attributes?.name
                          const secondaryCat = item.attributes.secondary_category?.data?.attributes?.name

                          if (item.type === "opinion") {
                            // Opinion articles display logic (keep as fixed)
                            if (category === "All") {
                              return secondaryCat ? `Opinion - ${secondaryCat}` : "Opinion"
                            } else if (category === secondaryCat) {
                              return `${secondaryCat} - Opinion`
                            } else {
                              return secondaryCat ? `Opinion - ${secondaryCat}` : "Opinion"
                            }
                          } else {
                            // Standard articles display logic - show current category first
                            if (primaryCat && secondaryCat) {
                              if (category === "All") {
                                return `${primaryCat} - ${secondaryCat}`
                              } else if (category === primaryCat) {
                                return `${primaryCat} - ${secondaryCat}`
                              } else if (category === secondaryCat) {
                                return `${secondaryCat} - ${primaryCat}`
                              } else {
                                return `${primaryCat} - ${secondaryCat}`
                              }
                            } else {
                              return primaryCat || secondaryCat || "None"
                            }
                          }
                        })()} / {item.attributes.author || "Unknown"} /{" "}
                        {new Date(item.attributes.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "America/Los_Angeles",
                        })}
                      </p>
                      <h3 className="text-xl font-bold text-[#3C3B6E]">{item.attributes.title}</h3>
                      {item.attributes.quote && (
                        <p className="text-sm text-gray-500 italic mb-1 border-l-4 border-[#B22234] pl-2 line-clamp-2">
                          {item.attributes.quote}...{" "}
                          <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-5">
                        {(() => {
                          // Generate excerpt from content
                          if (item.type === "opinion") {
                            // For opinions, extract from rich_body (richtext field)
                            if (typeof item.attributes.rich_body === "string") {
                              const cleanText = item.attributes.rich_body.replace(/<[^>]*>/g, "")
                              const lines = cleanText.split("\n").filter((line) => line.trim().length > 0)
                              return lines.slice(0, 5).join(" ").substring(0, 200)
                            }
                          } else {
                            // For articles, extract from rich_body (blocks field)
                            if (Array.isArray(item.attributes.rich_body)) {
                              let excerpt = ""
                              let lineCount = 0

                              for (const block of item.attributes.rich_body) {
                                if (block.type === "paragraph" && block.children) {
                                  const text = block.children.map((child) => child.text).join("")
                                  excerpt += text + " "
                                  lineCount++
                                  if (lineCount >= 5) break
                                }
                              }

                              return excerpt.substring(0, 200).trim()
                            }
                          }
                          return ""
                        })()}... <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          {/* Only show pagination for categories other than news-from-web */}
          {category !== "news-from-web" && (
            <div className="text-center mt-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
              >
                Previous
              </button>
              <span className="mx-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
              >
                Next
              </button>
            </div>
          )}
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
