"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import AdvancedPagination from "../../components/AdvancedPagination"
import { getPageFromQuery } from "../../utils/paginationHelpers"
import Link from "next/link"

export default function OpinionsArchive({ initialOpinions, initialPage, initialTotalPages }) {
  const router = useRouter()
  const [opinions, setOpinions] = useState(initialOpinions)
  const [currentPage, setCurrentPage] = useState(() => getPageFromQuery(router.query) || initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)

  // Update page when URL changes
  useEffect(() => {
    const newPage = getPageFromQuery(router.query) || 1
    if (newPage !== currentPage) {
      setCurrentPage(newPage)
      fetchOpinions(newPage)
    }
  }, [router.query])

  const fetchOpinions = async (page) => {
    setLoading(true)
    try {
      const opinionsRes = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?populate=*&sort[0]=date:desc&pagination[page]=${page}&pagination[pageSize]=10&filters[publishedAt][$notNull]=true`,
      )

      setOpinions(opinionsRes.data.data || [])
      setTotalPages(opinionsRes.data.meta?.pagination?.pageCount || 1)
    } catch (error) {
      console.error("Error fetching opinions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      setCurrentPage(newPage)
      fetchOpinions(newPage)
      window.scrollTo(0, 0)
    }
  }

  return (
    <>
      <Head>
        <title>Opinion Archive | Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Opinion Archives</h1>

          {loading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading opinions...</p>
            </div>
          ) : opinions.length === 0 ? (
            <p>No opinions available.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {opinions.map((opinion) => (
                <Link key={opinion.id} href={`/opinions/${opinion.attributes.slug}`}>
                  <div className="flex gap-6 p-2">
                    <div className="w-1/3">
                      <img
                        src={
                          opinion.attributes.image_path
                            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.attributes.image_path}`
                            : opinion.attributes.featured_image?.data?.attributes?.url
                              ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.attributes.featured_image.data.attributes.url}`
                              : "/images/core/placeholder.jpg"
                        }
                        alt={opinion.attributes.title}
                        className="w-full h-auto md:h-32 object-contain rounded bg-gray-50"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">
                        Opinion
                        {opinion.attributes.secondary_category?.data?.attributes?.name
                          ? ` - ${opinion.attributes.secondary_category.data.attributes.name}`
                          : ""}{" "}
                        / {opinion.attributes.author || "Unknown"} /{" "}
                        {new Date(opinion.attributes.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                          timeZone: "America/Los_Angeles",
                        })}
                      </p>
                      <h3 className="text-xl font-bold text-[#3C3B6E]">{opinion.attributes.title}</h3>
                      {opinion.attributes.quote && (
                        <p className="text-sm text-gray-500 italic mb-1 border-l-4 border-[#B22234] pl-2 line-clamp-2">
                          {opinion.attributes.quote}...{" "}
                          <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                        </p>
                      )}
                      <p className="text-sm text-gray-500 line-clamp-5">
                        {(() => {
                          // Generate excerpt from rich_body content for opinions
                          if (typeof opinion.attributes.rich_body === "string") {
                            const cleanText = opinion.attributes.rich_body.replace(/<[^>]*>/g, "")
                            const lines = cleanText.split("\n").filter((line) => line.trim().length > 0)
                            return lines.slice(0, 5).join(" ").substring(0, 200)
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

          {/* Advanced Pagination Component */}
          <AdvancedPagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}

export async function getStaticProps() {
  try {
    const opinionsRes = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?populate=*&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=10&filters[publishedAt][$notNull]=true`,
    )

    return {
      props: {
        initialOpinions: opinionsRes.data.data || [],
        initialPage: opinionsRes.data.meta?.pagination?.page || 1,
        initialTotalPages: opinionsRes.data.meta?.pagination?.pageCount || 1,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching opinions:", error)
    return {
      props: {
        initialOpinions: [],
        initialPage: 1,
        initialTotalPages: 1,
      },
    }
  }
}
