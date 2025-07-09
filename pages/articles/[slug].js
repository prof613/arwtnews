"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getFirstParagraphText } from "../../utils/blockHelpers"

export default function Article() {
  const router = useRouter()
  const { slug } = router.query
  const [article, setArticle] = useState(null)

  useEffect(() => {
    if (slug) {
      async function fetchArticle() {
        try {
          const articleRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate=*`,
          )
          const articleData = articleRes.data.data[0]
          setArticle(articleData?.attributes || null)
        } catch (error) {
          console.error("Error fetching article:", error)
        }
      }
      fetchArticle()
    }
  }, [slug])

  if (!article) return <div>Loading...</div>




// Add this line right here:
console.log("Article rich_body:", article.rich_body)




  const imageUrl = article.image_path
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.image_path}`
    : article.image?.data?.attributes?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.image.data.attributes.url}`
      : null

  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

  // Get first paragraph text for date inline placement
  const firstParagraphText = getFirstParagraphText(article.rich_body)

  return (
    <>
      <Head>
        <title>{article.title} | Red, White and True News</title>
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.quote || ""} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <article className="my-8">
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full max-h-[500px] object-contain rounded mb-4 bg-gray-100"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <p>No image available</p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              {article.category?.data?.attributes?.name || "None"} /{" "}
              {article.secondary_category?.data?.attributes?.name || ""}
            </p>
            <h1 className="text-3xl font-bold text-[#3C3B6E] mb-2">{article.title}</h1>
            {article.quote && (
              <p className="text-sm italic text-gray-500 mb-2 border-l-4 border-[#B22234] pl-2">{article.quote}</p>
            )}
            <hr className="border-[#3C3B6E] border-opacity-50 my-2" />
            <div className="flex items-center mb-4">
              <img
                src={
                  article.author_image?.data?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.author_image.data.attributes.url}`
                    : "/images/staff/authors/placeholder-author.jpg"
                }
                alt={article.author}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-bold text-gray-600">{article.author || "Unknown"}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-4">
              {/* Only show date inline if there's a first paragraph, otherwise show it separately */}
              {firstParagraphText ? (
                <BlockRenderer
                  blocks={article.rich_body}
                  datePrefix={
                    <span className="font-medium">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}{" "}
                      -{" "}
                    </span>
                  }
                />
              ) : (
                <>
                  <p className="mb-4">
                    <span className="font-medium">
                      {new Date(article.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}
                    </span>
                  </p>
                  <BlockRenderer blocks={article.rich_body} />
                </>
              )}
            </div>

            {article.enable_share_buttons && (
              <ShareButtons shareUrl={pageUrl} title={article.title} summary={article.quote} />
            )}
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
