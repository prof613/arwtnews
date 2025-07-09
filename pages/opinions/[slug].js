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

export default function Opinion() {
  const router = useRouter()
  const { slug } = router.query
  const [opinion, setOpinion] = useState(null)

  useEffect(() => {
    if (slug) {
      async function fetchOpinion() {
        try {
          const opinionRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[slug][$eq]=${slug}&populate=*&publicationState=live`,
          )
          const opinionData = opinionRes.data.data[0]
          setOpinion(opinionData?.attributes || null)
        } catch (error) {
          console.error("Error fetching opinion:", error)
        }
      }
      fetchOpinion()
    }
  }, [slug])

  if (!opinion) return <div>Loading...</div>

  const imageUrl = opinion.image_path
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.image_path}`
    : opinion.featured_image?.data?.attributes?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.featured_image.data.attributes.url}`
      : null

  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

  // Get first paragraph text for date inline placement
  const firstParagraphText = getFirstParagraphText(opinion.rich_body)

  return (
    <>
      <Head>
        <title>{opinion.title} | Red, White and True News</title>
        <meta property="og:title" content={opinion.title} />
        <meta property="og:description" content={opinion.quote || ""} />
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
                alt={opinion.title}
                className="w-full max-h-[500px] object-contain rounded mb-4 bg-gray-100"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <p>No image available</p>
              </div>
            )}
            <p className="text-sm text-gray-600">
              Opinion
              {opinion.secondary_category?.data?.attributes?.name
                ? ` / ${opinion.secondary_category.data.attributes.name}`
                : ""}
            </p>
            <h1 className="text-3xl font-bold text-[#3C3B6E] mb-2">{opinion.title}</h1>
            {opinion.quote && (
              <p className="text-sm italic text-gray-500 mb-2 border-l-4 border-[#B22234] pl-2">{opinion.quote}</p>
            )}
            <hr className="border-[#3C3B6E] border-opacity-50 my-2" />
            <div className="flex items-center mb-4">
              <img
                src={
                  opinion.author_image?.data?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.author_image.data.attributes.url}`
                    : "/images/staff/authors/placeholder-author.jpg"
                }
                alt={opinion.author}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-bold text-gray-600">{opinion.author || "Unknown"}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-4">
              {/* Only show date inline if there's a first paragraph, otherwise show it separately */}
              {firstParagraphText ? (
                <BlockRenderer
                  blocks={opinion.rich_body}
                  datePrefix={
                    <span className="font-medium">
                      {new Date(opinion.date).toLocaleDateString("en-US", {
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
                      {new Date(opinion.date).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "America/Los_Angeles",
                      })}
                    </span>
                  </p>
                  <BlockRenderer blocks={opinion.rich_body} />
                </>
              )}
            </div>

            {opinion.enable_share_buttons && (
              <ShareButtons shareUrl={pageUrl} title={opinion.title} summary={opinion.quote} />
            )}
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
