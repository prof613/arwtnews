"use client"

import Head from "next/head"
import { useState, useEffect } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"
import Link from "next/link"

// Related Articles Component
function RelatedArticles({ opinion }) {
  const [relatedArticles, setRelatedArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFallback, setIsFallback] = useState(false)

  useEffect(() => {
    if (opinion?.relatedTags && opinion?.id) {
      fetchRelatedArticles()
    } else if (opinion?.id) {
      // Even if no tags, try to get featured articles as fallback
      fetchRelatedArticles()
    }
  }, [opinion])

  const fetchRelatedArticles = async () => {
    try {
      setLoading(true)
      const tags = opinion.relatedTags || ""
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions/related?tags=${encodeURIComponent(
          tags,
        )}&type=opinion&currentId=${opinion.id}`,
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

// The component now receives the full opinion data from getServerSideProps
export default function Opinion({ opinion, pageUrl }) {
  // No need for useRouter or useState/useEffect for opinion data anymore

  if (!opinion) {
    return (
      <>
        <Head>
          <title>Opinion Not Found | Red, White and True News</title>
          <meta property="og:title" content="Opinion Not Found" />
          <meta property="og:description" content="The requested opinion piece could not be found." />
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
              <h1 className="text-3xl font-bold text-[#3C3B6E] mb-4">Opinion Not Found</h1>
              <p className="text-lg text-gray-700">
                We couldn't find the opinion piece you're looking for. It might have been moved or deleted.
              </p>
            </div>
          </section>
          <Sidebar />
        </main>
        <Footer />
      </>
    )
  }

  const imageUrl = getStrapiMedia(opinion.featured_image)
  const authorImageUrl = getStrapiMedia(opinion.author_image)

  // --- NEW DATE PREFIX LOGIC ---
  const dateComponent = (
    <span className="font-medium">
      {new Date(opinion.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      })}
      {" - "}
    </span>
  )
  const datePrefixString = renderToStaticMarkup(dateComponent)
  // --- END OF NEW LOGIC ---

  return (
    <>
      <Head>
        <title>{`${opinion.title} | Red, White and True News`}</title>
        <meta property="og:title" content={opinion.ogTitle || opinion.title} />
        <meta property="og:description" content={opinion.ogDescription || opinion.quote || ""} />
        <meta property="og:image" content={getStrapiMedia(opinion.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Red, White and True News" />
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={opinion.ogTitle || opinion.title} />
        <meta name="twitter:description" content={opinion.ogDescription || opinion.quote || ""} />
        <meta name="twitter:image" content={getStrapiMedia(opinion.ogImage) || imageUrl || "/placeholder.svg"} />
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
                alt={opinion.title}
                className="w-full max-h-[500px] object-contain rounded mb-4 bg-gray-100"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 rounded mb-4 flex items-center justify-center">
                <p>No image available</p>
              </div>
            )}
            <figcaption className="text-sm text-gray-600 italic text-left mb-4">
              {opinion.featured_image?.data?.attributes?.caption || ""}
            </figcaption>
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
                src={authorImageUrl || "/images/staff/authors/placeholder-author.jpg"}
                alt={opinion.author}
                className="w-12 h-12 rounded-full mr-2"
              />
              <div>
                <p className="text-sm font-bold text-gray-600">{opinion.author || "Unknown"}</p>
              </div>
            </div>
            <div className="text-gray-600 mb-4">
              <BlockRenderer blocks={opinion.rich_body} datePrefix={datePrefixString} />
            </div>

            {opinion.enable_share_buttons && (
              <ShareButtons shareUrl={pageUrl} title={opinion.title} summary={opinion.quote} />
            )}

            {/* Related Articles Section */}
            <RelatedArticles opinion={opinion} />
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps(context) {
  const { slug } = context.params

  const protocol = context.req.headers["x-forwarded-proto"] || "http"
  const host = context.req.headers["x-forwarded-host"] || context.req.headers.host
  const pageUrl = `${protocol}://${host}${context.req.url}`

  try {
    const opinionRes = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[slug][$eq]=${slug}&populate[featured_image]=*&populate[author_image]=*&populate[secondary_category]=*&populate[rich_body][populate]=*&populate[ogImage]=*&publicationState=live`,
    )
    const opinion = opinionRes.data.data[0]?.attributes

    if (!opinion) {
      return {
        props: {
          opinion: null,
          pageUrl: pageUrl,
        },
      }
    }

    // Add the ID to the opinion object for related articles
    const opinionWithId = {
      ...opinion,
      id: opinionRes.data.data[0].id,
    }

    return {
      props: {
        opinion: opinionWithId,
        pageUrl: pageUrl,
      },
    }
  } catch (error) {
    console.error("Error fetching opinion in getServerSideProps:", error)
    return {
      props: {
        opinion: null,
        pageUrl: pageUrl,
      },
    }
  }
}
