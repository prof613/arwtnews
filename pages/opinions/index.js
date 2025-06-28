"use client"

import Head from "next/head"
import { useState } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import Link from "next/link"

export default function OpinionsArchive({ opinions, page = 1, totalPages = 1 }) {
  const [currentPage, setCurrentPage] = useState(page)

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      // In a real implementation, you'd refetch data here
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
      <main className="max-w-7xl mx-auto p-4 flex gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <h1 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Opinion Archives</h1>
          {opinions.length === 0 ? (
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
                        className="w-full aspect-video object-cover rounded"
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
    if (typeof opinion.attributes.rich_body === 'string') {
      const cleanText = opinion.attributes.rich_body.replace(/<[^>]*>/g, '');
      const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
      return lines.slice(0, 5).join(' ').substring(0, 200);
    }
    return '';
  })()}...{" "}
  <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
            >
              Previous
            </button>
            <span className="mx-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#3C3B6E] text-white rounded disabled:bg-gray-300 hover:bg-[#B22234]"
            >
              Next
            </button>
          </div>
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
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?populate=*&sort[0]=date:desc&pagination[page]=1&pagination[pageSize]=10`,
    )

    return {
      props: {
        opinions: opinionsRes.data.data || [],
        page: opinionsRes.data.meta?.pagination?.page || 1,
        totalPages: opinionsRes.data.meta?.pagination?.pageCount || 1,
      },
      revalidate: 60,
    }
  } catch (error) {
    console.error("Error fetching opinions:", error)
    return {
      props: {
        opinions: [],
        page: 1,
        totalPages: 1,
      },
    }
  }
}