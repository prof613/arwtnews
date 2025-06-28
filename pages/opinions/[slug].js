"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"

// Function to render rich text content
function renderRichText(content) {
  if (!content) return "No content available"

  if (typeof content === "string") return content

  if (Array.isArray(content)) {
    return content.map((block, index) => {
      if (block.type === "paragraph") {
        return (
          <p key={index} className="mb-4">
            {block.children?.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </p>
        )
      }
      if (block.type === "heading") {
        const HeadingTag = `h${block.level || 2}`
        return (
          <HeadingTag key={index} className="font-bold mb-2">
            {block.children?.map((child, childIndex) => (
              <span key={childIndex}>{child.text}</span>
            ))}
          </HeadingTag>
        )
      }
      return null
    })
  }

  return "Content format not supported"
}

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

          console.log("Slug:", slug)
          console.log("Individual Opinion API Response:", opinionRes.data)
          console.log("Opinion Data:", opinionData)
          console.log("Opinion Attributes:", opinionData?.attributes)

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

  return (
    <>
      <Head>
        <title>{opinion.title} | Red, White and True News</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <article className="my-8">
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={opinion.title}
                className="w-full aspect-video object-cover rounded mb-4"
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
              <div className="prose max-w-none">
                <p className="mb-4">
                  <span className="font-medium">
                    {new Date(opinion.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}{" "}
                    -{" "}
                  </span>
                  {/* Extract first paragraph from rich_body and display inline */}
                  {(() => {
                    if (typeof opinion.rich_body === "string") {
                      // For richtext field, take first sentence/paragraph
                      const firstParagraph = opinion.rich_body.split("\n")[0] || opinion.rich_body.substring(0, 200)
                      return firstParagraph
                    }
                    return "Content continues..."
                  })()}
                </p>
                {/* Render remaining content */}
                <div dangerouslySetInnerHTML={{ __html: opinion.rich_body }} />
              </div>
            </div>
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
