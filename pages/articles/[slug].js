"use client"

import { useRouter } from "next/router"
import Head from "next/head" // Import Head for meta tags
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import DisqusComments from "../../components/DisqusComments"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"
import { renderToStaticMarkup } from "react-dom/server"
import axios from "axios"

export default function Article({ article, pageUrl }) {
  const router = useRouter()
  const { slug } = router.query // Get the dynamic slug from the URL

  const canonicalUrl = `https://rwtnews.com/articles/${slug}`

  // If article is null (e.g., not found by getServerSideProps), render a not found state
  if (!article) {
    return (
      <>
        <Head>
          <title>Article Not Found | Red, White and True News</title>
          <meta
            name="description"
            content="The requested article could not be found. Browse our latest conservative news and political analysis."
          />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content="Article Not Found" />
          <meta property="og:description" content="The requested article could not be found." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:image" content="https://rwtnews.com/images/core/og-image.jpg" />
          <meta property="og:site_name" content="Red, White and True News" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Article Not Found" />
          <meta name="twitter:description" content="The requested article could not be found." />
          <meta name="twitter:image" content="https://rwtnews.com/images/core/og-image.jpg" />
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

  const getMetaDescription = () => {
    if (article.ogDescription) return article.ogDescription
    if (article.quote) return article.quote
    // Extract text from rich_body for description
    const bodyText = article.rich_body
      ?.map((block) => {
        if (block.type === "paragraph" && block.children) {
          return block.children.map((child) => child.text).join(" ")
        }
        return ""
      })
      .join(" ")
      .substring(0, 160)
    return bodyText || `${article.title} - Conservative news and political analysis from Red, White and True News.`
  }

  const generateArticleSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      headline: article.title,
      description: getMetaDescription(),
      image: getStrapiMedia(article.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg",
      datePublished: new Date(article.date).toISOString(),
      dateModified: new Date(article.updatedAt || article.date).toISOString(),
      author: {
        "@type": "Person",
        name: article.author || "Red, White and True News",
        image: authorImageUrl || "https://rwtnews.com/images/staff/authors/placeholder-author.jpg",
      },
      publisher: {
        "@type": "Organization",
        name: "Red, White and True News",
        logo: {
          "@type": "ImageObject",
          url: "https://rwtnews.com/images/core/logo.png",
          width: 300,
          height: 60,
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": canonicalUrl,
      },
      url: canonicalUrl,
      articleSection: article.category?.data?.attributes?.name || "News",
      keywords: article.relatedTags || "",
      inLanguage: "en-US",
    }

    // Add word count if available
    if (article.rich_body) {
      const wordCount = article.rich_body
        .map((block) => {
          if (block.type === "paragraph" && block.children) {
            return block.children.map((child) => child.text).join(" ")
          }
          return ""
        })
        .join(" ")
        .split(" ")
        .filter((word) => word.length > 0).length

      if (wordCount > 0) {
        schema.wordCount = wordCount
      }
    }

    return schema
  }

  const generateBreadcrumbSchema = () => {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://rwtnews.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Articles",
          item: "https://rwtnews.com/articles",
        },
      ],
    }

    // Add category if available
    if (article.category?.data?.attributes?.name) {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: article.category.data.attributes.name,
        item: `https://rwtnews.com/categories/${article.category.data.attributes.slug || article.category.data.attributes.name.toLowerCase().replace(/\s+/g, "-")}`,
      })

      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: canonicalUrl,
      })
    } else {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: article.title,
        item: canonicalUrl,
      })
    }

    return breadcrumbSchema
  }

  return (
    <>
      <Head>
        <title>{`${article.title} | Red, White and True News`}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content={article.author || "Red, White and True News"} />
        <meta name="article:published_time" content={new Date(article.date).toISOString()} />
        <meta name="article:author" content={article.author || "Red, White and True News"} />
        <meta name="article:section" content={article.category?.data?.attributes?.name || "News"} />
        <meta property="og:title" content={article.ogTitle || article.title} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta
          property="og:image"
          content={getStrapiMedia(article.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg"}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Red, White and True News" />
        <meta property="article:published_time" content={new Date(article.date).toISOString()} />
        <meta property="article:author" content={article.author || "Red, White and True News"} />
        <meta property="article:section" content={article.category?.data?.attributes?.name || "News"} />
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.ogTitle || article.title} />
        <meta name="twitter:description" content={getMetaDescription()} />
        <meta
          name="twitter:image"
          content={getStrapiMedia(article.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg"}
        />
        <meta name="twitter:site" content="@RWTNews" />
        <meta name="twitter:creator" content="@RWTNews" />

        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateArticleSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateBreadcrumbSchema()),
          }}
        />
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
              <ShareButtons shareUrl={canonicalUrl} title={article.title} summary={article.quote} />
            )}

            {/* Comments Section */}
            <DisqusComments title={article.title} slug={article.slug} url={canonicalUrl} type="article" />
          </article>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}

export async function getServerSideProps({ params }) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?filters[slug][$eq]=${params.slug}&populate=*`,
    )

    const article = response.data.data[0] || null

    return {
      props: {
        article: article ? article.attributes : null,
        pageUrl: `https://rwtnews.com/articles/${params.slug}`,
      },
    }
  } catch (error) {
    console.error("Error fetching article:", error)
    return {
      props: {
        article: null,
        pageUrl: `https://rwtnews.com/articles/${params.slug}`,
      },
    }
  }
}
