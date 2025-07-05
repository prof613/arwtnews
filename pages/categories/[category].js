"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import MainBanner from "../../components/MainBanner"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import AdvancedPagination from "../../components/AdvancedPagination"
import { getPageFromQuery } from "../../utils/paginationHelpers"
import Link from "next/link"
import MemeLightbox from "../../components/MemeLightbox"

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
  const { category, slug } = router.query
  const [items, setItems] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedMemeIndex, setSelectedMemeIndex] = useState(null)

  useEffect(() => {
    const newPage = getPageFromQuery(router.query)
    setPage(newPage)
  }, [router.query])

  useEffect(() => {
    if (category) {
      async function fetchItems() {
        try {
          let combinedItems = []
          let fetchedTotalPages = 1

          if (category === "Meme-Cartoons") {
            const res = await axios.get(
              `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10&filters[publishedAt][$notNull]=true`,
            )
            combinedItems = res.data.data
            fetchedTotalPages = res.data.meta.pagination.pageCount
          } else if (category === "All") {
            const [articlesRes, opinionsRes] = await Promise.all([
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*&sort[0]=date:desc&pagination[pageSize]=50&filters[publishedAt][$notNull]=true&filters[homepage_status][$eq]=archived`,
              ),
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?populate=*&sort[0]=date:desc&pagination[pageSize]=50&filters[publishedAt][$notNull]=true`,
              ),
            ])
            const articles = articlesRes.data.data.map((item) => ({ ...item, type: "article" }))
            const opinions = opinionsRes.data.data.map((item) => ({ ...item, type: "opinion" }))
            const allItems = [...articles, ...opinions].sort(
              (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date),
            )
            const startIndex = (page - 1) * 10
            const endIndex = startIndex + 10
            combinedItems = allItems.slice(startIndex, endIndex)
            fetchedTotalPages = Math.ceil(allItems.length / 10)
          } else if (category === "news-from-web") {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/external-articles?populate=*`)
            const oneYearAgo = new Date()
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
            const allExternalItems = res.data.data
              .filter((item) => new Date(item.attributes.createdAt) >= oneYearAgo)
              .map((item) => ({ ...item, type: "external" }))
              .sort((a, b) => new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt))
            const startIndex = (page - 1) * 20
            const endIndex = startIndex + 20
            combinedItems = allExternalItems.slice(startIndex, endIndex)
            fetchedTotalPages = Math.ceil(allExternalItems.length / 20)
          } else {
            const [articlesRes, opinionsRes] = await Promise.all([
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[$or][0][category][name][$eq]=${category}&filters[$or][1][secondary_category][name][$eq]=${category}&filters[homepage_status][$eq]=archived&filters[publishedAt][$notNull]=true&populate=*&sort[0]=date:desc&pagination[pageSize]=50`,
              ),
              axios.get(
                `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[secondary_category][name][$eq]=${category}&filters[publishedAt][$notNull]=true&populate=*&sort[0]=date:desc&pagination[pageSize]=50`,
              ),
            ])
            const articles = articlesRes.data.data.map((item) => ({ ...item, type: "article" }))
            const opinions = opinionsRes.data.data.map((item) => ({ ...item, type: "opinion" }))
            const allItems = [...articles, ...opinions].sort(
              (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date),
            )
            const startIndex = (page - 1) * 10
            const endIndex = startIndex + 10
            combinedItems = allItems.slice(startIndex, endIndex)
            fetchedTotalPages = Math.ceil(allItems.length / 10)
          }
          setItems(combinedItems)
          setTotalPages(fetchedTotalPages)
        } catch (error) {
          console.error("Error fetching items:", error)
        }
      }
      fetchItems()
    }
  }, [category, page])

  // Effect to open lightbox if slug is present in URL
  useEffect(() => {
    if (category === "Meme-Cartoons" && slug && items.length > 0) {
      const initialIndex = items.findIndex((item) => item.attributes.slug === slug)
      if (initialIndex !== -1) {
        setSelectedMemeIndex(initialIndex)
        setLightboxOpen(true)
      }
    }
  }, [slug, items, category])

  const openLightbox = (indexOnPage) => {
    const meme = items[indexOnPage]
    if (meme && meme.attributes.slug) {
      setSelectedMemeIndex(indexOnPage)
      setLightboxOpen(true)
      router.push(`/categories/Meme-Cartoons?page=${page}&slug=${meme.attributes.slug}`, undefined, { shallow: true })
    }
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
    router.push(`/categories/Meme-Cartoons?page=${page}`, undefined, { shallow: true })
  }

  // Called by the lightbox when the meme changes to update the URL
  const handleMemeChange = (meme, newPage) => {
    // Use the newPage from the lightbox to keep the URL's page query param in sync
    router.push(`/categories/Meme-Cartoons?page=${newPage}&slug=${meme.attributes.slug}`, undefined, {
      shallow: true,
    })
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/categories/${category}?page=${newPage}`)
      window.scrollTo(0, 0)
    }
  }

  const handleExternalLinkClick = (e, link) => {
    e.preventDefault()
    if (confirm("You're about to visit an external site. Continue?")) {
      window.open(link, "_blank")
    }
  }

  const renderContent = () => {
    if (items.length === 0) return <p>No items available.</p>

    if (category === "Meme-Cartoons") {
      return (
        <div className="flex flex-col gap-8">
          {items.map((item, index) => (
            <div key={item.id} className="p-2 text-center">
              <button onClick={() => openLightbox(index)} className="w-full">
                <img
                  src={
                    item.attributes.image?.data?.attributes?.url
                      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.attributes.image.data.attributes.url}`
                      : "/images/core/placeholder.jpg"
                  }
                  alt={item.attributes.artist || "Meme"}
                  className="w-full h-auto rounded mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </button>
              <h3 className="text-lg font-bold text-[#3C3B6E] mt-2">{item.attributes.artist || "Unknown"}</h3>
              <p className="text-sm text-gray-600">
                {new Date(item.attributes.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )
    }

    if (category === "news-from-web") {
      return (
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
      )
    }

    // Default renderer for articles and opinions
    return (
      <div className="flex flex-col gap-4">
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.type === "opinion" ? `/opinions/${item.attributes.slug}` : `/articles/${item.attributes.slug}`}
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
                  className="w-full h-auto md:h-32 object-contain rounded bg-gray-50"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  {(() => {
                    const primaryCat = item.attributes.category?.data?.attributes?.name
                    const secondaryCat = item.attributes.secondary_category?.data?.attributes?.name
                    if (item.type === "opinion") {
                      return secondaryCat ? `Opinion - ${secondaryCat}` : "Opinion"
                    }
                    return primaryCat || secondaryCat || "None"
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
                    if (item.type === "opinion") {
                      if (typeof item.attributes.rich_body === "string") {
                        const cleanText = item.attributes.rich_body.replace(/<[^>]*>/g, "")
                        return cleanText.substring(0, 200)
                      }
                    } else if (Array.isArray(item.attributes.rich_body)) {
                      let excerpt = ""
                      for (const block of item.attributes.rich_body) {
                        if (block.type === "paragraph" && block.children) {
                          excerpt += block.children.map((child) => child.text).join("") + " "
                          if (excerpt.length > 200) break
                        }
                      }
                      return excerpt.substring(0, 200).trim()
                    }
                    return ""
                  })()}... <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{String(category || "Category").split(",")[0]} | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">
            {category === "All" ? "All Articles" : category === "news-from-web" ? "News from the Web" : category}{" "}
            Archives
          </h1>

          {renderContent()}

          <AdvancedPagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
        <Sidebar />
      </main>

      {lightboxOpen && category === "Meme-Cartoons" && (
        <MemeLightbox
          initialMemes={items}
          initialIndexOnPage={selectedMemeIndex}
          currentPage={page}
          totalPages={totalPages}
          onClose={closeLightbox}
          onMemeChange={handleMemeChange}
        />
      )}
      <Footer />
    </>
  )
}
