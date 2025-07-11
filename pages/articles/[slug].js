"use client"

import Head from "next/head"
import { useRouter } from "next/router" // Kept
import { useState, useEffect } from "react" // Kept
import axios from "axios"
import { renderToStaticMarkup } from "react-dom/server"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"

// The component now receives initialMetadata from the server
export default function Article({ initialMetadata }) {
  const router = useRouter()
  const { slug } = router.query
  const [article, setArticle] = useState(null) // Your state logic remains

  // Your original useEffect for fetching the full article data remains untouched
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

  // The Head now uses the pre-fetched metadata from the server
  // This is what the crawler will see immediately.
  const head = (
    <Head>
      <title>{`${initialMetadata.title} | Red, White and True News`}</title>
      <meta property="og:title" content={initialMetadata.title} />
      <meta property="og:description" content={initialMetadata.description} />
      <meta property="og:image" content={initialMetadata.imageUrl} />
      <meta property="og:url" content={initialMetadata.pageUrl} />
      <meta property="og:type" content="article" />
      <meta name="twitter:card" content="summary_large_image" />
    </Head>
  )

  // Your loading state remains, for the user experience
  if (!article) {
    return (
      <>
        {head}
        <div>Loading...</div>
      </>
    )
  }

  // The rest of your component logic is identical
  const imageUrl = getStrapiMedia(article.image)
  const authorImageUrl = getStrapiMedia(article.author_image)
  const pageUrl = initialMetadata.pageUrl // Use the server-generated URL for consistency

  const dateComponent = (
    <span className="font-medium">
      {new Date(article.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      })}
      &nbsp;-&nbsp;
    </span>
  )
  const datePrefixString = renderToStaticMarkup(dateComponent)

  return (
    <>
      {head}
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
                src={authorImageUrl || "/images/staff/authors/placeholder-author.jpg"}
                alt={article.author}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-bold text-gray-600">{article.author || "Unknown"}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-4">
              <BlockRenderer blocks={article.rich_body} datePrefix={datePrefixString} />
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

// This function runs on the server, but ONLY fetches what's needed for the <Head>
export async function getServerSideProps(context) {
  const { slug } = context.params

  try {
    // We fetch only the fields needed for metadata to be fast
    const fields = ["title", "quote", "image"]
    const populate = ["image"]
    const articleRes = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&fields[0]=${fields[0]}&fields[1]=${fields[1]}&populate[0]=${populate[0]}`,
    )

    const article = articleRes.data.data[0]?.attributes
    if (!article) throw new Error("Article not found")

    const protocol = context.req.headers["x-forwarded-proto"] || "http"
    const host = context.req.headers["x-forwarded-host"] || context.req.headers.host
    const pageUrl = `${protocol}://${host}${context.req.url}`

    return {
      props: {
        initialMetadata: {
          title: article.title || "Article",
          description: article.quote || "",
          imageUrl: getStrapiMedia(article.image) || "",
          pageUrl: pageUrl,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching metadata in getServerSideProps:", error)
    return {
      props: {
        initialMetadata: {
          title: "Article Not Found",
          description: "",
          imageUrl: "",
          pageUrl: "",
        },
      },
    }
  }
}
