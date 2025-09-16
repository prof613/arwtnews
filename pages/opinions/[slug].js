"use client"

import Head from "next/head"
import { renderToStaticMarkup } from "react-dom/server"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import DisqusComments from "../../components/DisqusComments"
import BlockRenderer from "../../components/BlockRenderer"
import RelatedArticles from "../../components/RelatedArticles" // Added import for RelatedArticles
import { getStrapiMedia } from "../../utils/media"

// The component now receives the full opinion data from getServerSideProps
export default function Opinion({ opinion, pageUrl }) {
  // No need for useRouter or useState/useEffect for opinion data anymore

  const canonicalUrl = opinion ? `https://rwtnews.com/opinions/${opinion.slug}` : pageUrl

  if (!opinion) {
    return (
      <>
        <Head>
          <title>Opinion Not Found | Red, White and True News</title>
          <meta
            name="description"
            content="The requested opinion piece could not be found. Browse our latest conservative commentary and political analysis."
          />
          <meta name="robots" content="noindex, follow" />
          <link rel="canonical" href={canonicalUrl} />
          <meta property="og:title" content="Opinion Not Found" />
          <meta property="og:description" content="The requested opinion piece could not be found." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content={pageUrl} />
          <meta property="og:image" content="https://rwtnews.com/images/core/og-image.jpg" />
          <meta property="og:site_name" content="Red, White and True News" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="Opinion Not Found" />
          <meta name="twitter:description" content="The requested opinion piece could not be found." />
          <meta name="twitter:image" content="https://rwtnews.com/images/core/og-image.jpg" />
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

  const getMetaDescription = () => {
    if (opinion.ogDescription) return opinion.ogDescription
    if (opinion.quote) return opinion.quote
    // Extract text from rich_body for description
    const bodyText = opinion.rich_body
      ?.map((block) => {
        if (block.type === "paragraph" && block.children) {
          return block.children.map((child) => child.text).join(" ")
        }
        return ""
      })
      .join(" ")
      .substring(0, 160)
    return bodyText || `${opinion.title} - Conservative opinion and political commentary from Red, White and True News.`
  }

  const generateOpinionSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "OpinionNewsArticle",
      headline: opinion.title,
      description: getMetaDescription(),
      image: getStrapiMedia(opinion.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg",
      datePublished: new Date(opinion.date).toISOString(),
      dateModified: new Date(opinion.updatedAt || opinion.date).toISOString(),
      author: {
        "@type": "Person",
        name: opinion.author || "Red, White and True News",
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
      articleSection: "Opinion",
      keywords: opinion.relatedTags || "",
      inLanguage: "en-US",
      genre: "opinion",
    }

    // Add word count if available
    if (opinion.rich_body) {
      const wordCount = opinion.rich_body
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
          name: "Opinions",
          item: "https://rwtnews.com/opinions",
        },
      ],
    }

    // Add secondary category if available
    if (opinion.secondary_category?.data?.attributes?.name) {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: opinion.secondary_category.data.attributes.name,
        item: `https://rwtnews.com/categories/${opinion.secondary_category.data.attributes.slug || opinion.secondary_category.data.attributes.name.toLowerCase().replace(/\s+/g, "-")}`,
      })

      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 4,
        name: opinion.title,
        item: canonicalUrl,
      })
    } else {
      breadcrumbSchema.itemListElement.push({
        "@type": "ListItem",
        position: 3,
        name: opinion.title,
        item: canonicalUrl,
      })
    }

    return breadcrumbSchema
  }

  return (
    <>
      <Head>
        <title>{`${opinion.title} | Red, White and True News`}</title>
        <meta name="description" content={getMetaDescription()} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={canonicalUrl} />
        <meta name="author" content={opinion.author || "Red, White and True News"} />
        <meta name="article:published_time" content={new Date(opinion.date).toISOString()} />
        <meta name="article:author" content={opinion.author || "Red, White and True News"} />
        <meta name="article:section" content="Opinion" />
        <meta property="og:title" content={opinion.ogTitle || opinion.title} />
        <meta property="og:description" content={getMetaDescription()} />
        <meta
          property="og:image"
          content={getStrapiMedia(opinion.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg"}
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Red, White and True News" />
        <meta property="article:published_time" content={new Date(opinion.date).toISOString()} />
        <meta property="article:author" content={opinion.author || "Red, White and True News"} />
        <meta property="article:section" content="Opinion" />
        <meta property="fb:app_id" content={process.env.NEXT_PUBLIC_FACEBOOK_APP_ID} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={opinion.ogTitle || opinion.title} />
        <meta name="twitter:description" content={getMetaDescription()} />
        <meta
          name="twitter:image"
          content={getStrapiMedia(opinion.ogImage) || imageUrl || "https://rwtnews.com/images/core/og-image.jpg"}
        />
        <meta name="twitter:site" content="@RWTNews" />
        <meta name="twitter:creator" content="@RWTNews" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOpinionSchema()),
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
              <ShareButtons shareUrl={canonicalUrl} title={opinion.title} summary={opinion.quote} />
            )}

            {/* Comments Section */}
            <DisqusComments title={opinion.title} slug={opinion.slug} url={canonicalUrl} type="opinion" />

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
