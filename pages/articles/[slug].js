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

  // If it's already a string, return it
  if (typeof content === "string") return content

  // If it's an array of blocks
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

  // Fallback for unexpected formats
  return "Content format not supported"
}

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
console.log('Full article data:', articleRes.data.data[0]);
console.log('Article attributes:', articleRes.data.data[0]?.attributes);
console.log('Image path value:', articleRes.data.data[0]?.attributes?.image_path);
setArticle(articleData?.attributes || null)

          setArticle(articleData?.attributes || null)
        } catch (error) {
          console.error("Error fetching article:", error)
        }
      }
      fetchArticle()
    }
  }, [slug])

  if (!article) return <div>Loading...</div>

  const imageUrl = article.image_path
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.image_path}`
    : article.image?.data?.attributes?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.image.data.attributes.url}`
      : null

  return (
    <>
      <Head>
        <title>{article.title} | Red, White and True News</title>
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <article className="my-8">
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full aspect-video object-cover rounded mb-4"
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
              <div className="prose max-w-none">
                <p className="mb-4">
                  <span className="font-medium">
                    {new Date(article.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}{" "}
                    -{" "}
                  </span>
                  {/* Extract first paragraph from rich_body and display inline */}
                  {(() => {
                    if (Array.isArray(article.rich_body) && article.rich_body.length > 0) {
                      const firstBlock = article.rich_body[0]
                      if (firstBlock.type === "paragraph" && firstBlock.children) {
                        return firstBlock.children.map((child, index) => <span key={index}>{child.text}</span>)
                      }
                    }
                    return "Content continues..."
                  })()}
                </p>
                {/* Render remaining content blocks */}
                {Array.isArray(article.rich_body) &&
                  article.rich_body.slice(1).map((block, index) => {
                    if (block.type === "paragraph") {
                      return (
                        <p key={index + 1} className="mb-4">
                          {block.children?.map((child, childIndex) => (
                            <span key={childIndex}>{child.text}</span>
                          ))}
                        </p>
                      )
                    }
                    if (block.type === "heading") {
                      const HeadingTag = `h${block.level || 2}`
                      return (
                        <HeadingTag key={index + 1} className="font-bold mb-2">
                          {block.children?.map((child, childIndex) => (
                            <span key={childIndex}>{child.text}</span>
                          ))}
                        </HeadingTag>
                      )
                    }
                    return null
                  })}
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
