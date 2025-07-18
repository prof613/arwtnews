"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import { renderToStaticMarkup } from "react-dom/server"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"

export default function Opinion({ initialMetadata }) {
  const router = useRouter()
  const { slug } = router.query
  const [opinion, setOpinion] = useState(null)

  useEffect(() => {
    if (slug) {
      async function fetchOpinion() {
        try {
          const opinionRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[slug][$eq]=${slug}&populate[rich_body][populate]=*&populate[featured_image]=*&populate[author]=*&populate[author_image]=*&populate[secondary_category]=*&populate[ogImage]=*&publicationState=live`,
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

  if (!opinion) {
    return (
      <>
        <Head>
          <title>{`${initialMetadata.title} | Red, White and True News`}</title>
          <meta property="og:title" content={initialMetadata.title} />
          <meta property="og:description" content={initialMetadata.description} />
          <meta property="og:image" content={initialMetadata.imageUrl} />
          <meta property="og:url" content={initialMetadata.pageUrl} />
          <meta property="og:type" content="article" />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <div>Loading...</div>
      </>
    )
  }

  const imageUrl = getStrapiMedia(opinion.featured_image)
  const authorImageUrl = getStrapiMedia(opinion.author_image)
  const pageUrl = initialMetadata.pageUrl

  const dateComponent = (
    <span className="font-medium">
      {new Date(opinion.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "America/Los_Angeles",
      })}
       - 
    </span>
  )
  const datePrefixString = renderToStaticMarkup(dateComponent)

  return (
    <>
      <Head>
        <title>{`${opinion.ogTitle || opinion.title} | Red, White and True News`}</title>
        <meta property="og:title" content={opinion.ogTitle || opinion.title} />
        <meta property="og:description" content={opinion.ogDescription || opinion.quote || ""} />
        <meta property="og:image" content={getStrapiMedia(opinion.ogImage) || getStrapiMedia(opinion.featured_image) || ""} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
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
  try {
    const fields = ["title", "quote", "featured_image", "ogTitle", "ogDescription", "ogImage"]
    const populate = ["featured_image", "ogImage"]
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?filters[slug][$eq]=${slug}&fields=${fields.join(",")}&populate=${populate.join(",")}&publicationState=live`,
    )
    const opinion = res.data.data[0]?.attributes
    if (!opinion) throw new Error("Opinion not found")
    const protocol = context.req.headers["x-forwarded-proto"] || "http"
    const host = context.req.headers["x-forwarded-host"] || context.req.headers.host
    const pageUrl = `https://www.redwhiteandtruenews.com/opinions/${slug}`
    return {
      props: {
        initialMetadata: {
          title: opinion.ogTitle || opinion.title || "Opinion",
          description: opinion.ogDescription || opinion.quote || "",
          imageUrl: getStrapiMedia(opinion.ogImage) || getStrapiMedia(opinion.featured_image) || "",
          pageUrl,
        },
      },
    }
  } catch (error) {
    console.error("Error fetching opinion metadata:", error)
    return {
      props: {
        initialMetadata: {
          title: "Opinion Not Found",
          description: "",
          imageUrl: "",
          pageUrl: "",
        },
      },
    }
  }
}