"use client"

import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Head from "next/head" // Import Head for meta tags
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"
import { renderToStaticMarkup } from "react-dom/server"
import Link from "next/link"

// Related Articles Component
function RelatedArticles({ article }) {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    if (article?.relatedTags && article?.id) {
      fetchRelatedArticles()
    } else if (article?.id) {
      // Even if no tags, try to get featured articles as fallback
      fetchRelatedArticles()
    }
  }, [article])

  const fetchRelatedArticles = async () => {
    try {
      setLoading(true)
      const tags = article.relatedTags || ""
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles/related?tags=${encodeURIComponent(
          tags,
        )}&type=article&currentId=${article.id}`,
      )

      if (response.data) {
        setRelatedArticles(response.data.items || [])
        setIsFallback(response.data.isFallback || false)
      }
    } catch (error) {
      console.error("Error fetching related articles:", error)
      setRelatedArticles([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="mt-12 border-t pt-8">
        <h3 className="text-2xl font-bold text-[#3C3B6E] mb-6">Related Articles</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden animate-pulse">
              <div className="w-full h-48 bg-gray-200"></div>
              <div className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (relatedArticles.length === 0) {
    return null // Don't show section if no related articles
  }

  return (
    <section className="mt-12 border-t pt-8">
      <h3 className="text-2xl font-bold text-[#3C3B6E] mb-6">
        {isFallback ? "Suggested Articles" : "Related Articles"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedArticles.map((item) => (
          <Link
            key={item.id}
            href={item._type === "opinion" ? `/opinions/${item.slug}` : `/articles/${item.slug}`}
            className="block group"
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <img
                src={
                  getStrapiMedia(item._type === "opinion" ? item.featured_image : item.image) ||
                  "/placeholder.svg?height=200&width=300&query=article"
                }
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-2">
                  {item._type === "opinion" ? "Opinion" : "Article"} •{" "}
                  {new Date(item.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                <h4 className="font-bold text-[#3C3B6E] group-hover:text-[#B22234] transition-colors line-clamp-2">
                  {item.title}
                </h4>
                {item.quote && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{item.quote}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default function Article({ article, pageUrl }) {
  const router = useRouter()
  const { slug } = router.query // Get the dynamic slug from the URL

  // Construct the canonical URL for the current article
  const canonicalUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/articles/${slug}`
      : `https://yourwebsite.com/articles/${slug}` // Fallback for server-side rendering

  // If article is null (e.g., not found by getServerSideProps), render a not found state
  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found | Red, White and True News</title>
          <meta property="og:title" content="Article Not Found" />
          <meta property="og:description" content="The requested article could not be found." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:image" content="/placeholder.svg" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <Header />
        <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
          <section className="flex-1">
            <MainBanner />
            <div className="my-8 text-center">
              <h1 className="text-3xl font-bold text-[#3C3B6E] mb-4">Article Not Found</h1>
              <p className="text-lg text-gray-700">
                We couldn't find the article you're looking for. It might have been moved or deleted.
              </p>
            </div>
          </section>
          <Sidebar />
        </main>
        <Footer />
      </>
    )
  }

  const imageUrl = getStrapiMedia(article.image)
  const authorImageUrl = getStrapiMedia(article.author_image)

  const dateComponent = (
    <span className="font-medium">
      {new Date(article.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      })}
      {" - "}
    </span>
  )
  const datePrefixString = renderToStaticMarkup(dateComponent)

  return (
    <>
      <Head>
        <title>{`${article.title} | Red, White and True News`}</title>
        <meta property="og:title" content={article.ogTitle || article.title} />
        <meta property="og:description" content={article.ogDescription || article.quote || ""} />
        <meta property="og:image" content={getStrapiMedia(article.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Red, White and True News" />
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.ogTitle || article.title} />
        <meta name="twitter:description" content={article.ogDescription || article.quote || ""} />
        <meta name="twitter:image" content={getStrapiMedia(article.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta name="twitter:site" content="@RWTNews" />
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
            <figcaption className="text-sm text-gray-600 italic text-left mb-4">
              {article.image?.data?.attributes?.caption || ""}
            </figcaption>
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

            {/* Related Articles Section */}
            <RelatedArticles article={article} />
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}

// This function runs on the server for every request
export async function getServerSideProps(context) {
  const { slug } = context.params

  // Construct the full page URL for OG tags
  const protocol = context.req.headers["x-forwarded-proto"] || "http"
  const host = context.req.headers["x-forwarded-host"] || context.req.headers.host
  const pageUrl = `${protocol}://${host}${context.req.url}`

  try {
    // Fetch all necessary article data with proper populate parameters
    const articleRes = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${slug}&populate[image]=*&populate[author_image]=*&populate[category]=*&populate[secondary_category]=*&populate[rich_body][populate]=*&populate[ogImage]=*`,
    )

    const article = articleRes.data.data[0]?.attributes

    if (!article) {
      // If article not found, return props with null article to trigger not found UI
      return {
        props: {
          article: null,
          pageUrl: pageUrl, // Still provide pageUrl for the not found page's OG tags
        },
      }
    }

    // Add the ID to the article object for related articles
    const articleWithId = {
      ...article,
      id: articleRes.data.data[0].id,
    }

    return {
      props: {
        article: articleWithId,
        pageUrl: pageUrl,
      },
    }
  } catch (error) {
    console.error("Error fetching article in getServerSideProps:", error)
    // In case of an error during fetch, return null article to show not found UI
    return {
      props: {
        article: null,
        pageUrl: pageUrl,
      },
    }
  }
}
