import Head from "next/head"
import { renderToStaticMarkup } from "react-dom/server"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import BlockRenderer from "../../components/BlockRenderer"
import { getStrapiMedia } from "../../utils/media"

// The component now receives the full article data from getServerSideProps
export default function Article({ article, pageUrl }) {
  // No need for useRouter or useState/useEffect for article data anymore

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
          <meta property="og:image" content="/placeholder.svg" /> {/* Fallback image */}
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
       - 
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
        <meta property="og:site_name" content="Red, White and True News" /> {/* Add site name for consistency */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.ogTitle || article.title} />
        <meta name="twitter:description" content={article.ogDescription || article.quote || ""} />
        <meta name="twitter:image" content={getStrapiMedia(article.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta name="twitter:site" content="@RWTNews" /> {/* Add twitter site for consistency */}
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

    return {
      props: {
        article: article,
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
