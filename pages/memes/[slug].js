import Head from "next/head"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import { ExternalLink } from "lucide-react"
import { getStrapiMedia } from "../../utils/media" // Ensure getStrapiMedia is imported

// The component now receives the full meme data from getServerSideProps
export default function MemePage({ meme, pageUrl }) {
  // No need for useRouter or useState/useEffect for meme data anymore

  if (!meme) {
    return (
      <>
        <Head>
          <title>Meme Not Found | Red, White and True News</title>
          <meta property="og:title" content="Meme Not Found" />
          <meta property="og:description" content="The requested meme could not be found." />
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
              <h1 className="text-3xl font-bold text-[#3C3B6E] mb-4">Meme Not Found</h1>
              <p className="text-lg text-gray-700">
                We couldn't find the meme you're looking for. It might have been moved or deleted.
              </p>
            </div>
          </section>
          <Sidebar />
        </main>
        <Footer />
      </>
    )
  }

  // Use getStrapiMedia for image URL
  const imageUrl = getStrapiMedia(meme.image)

  // Fix potential title issues by ensuring artist is always a string
  const getPageTitle = () => {
    const artistName = Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown"
    return `Meme by ${artistName} | Red, White and True News`
  }

  const renderArtistLinks = () => {
    const link1 = meme.artist_link_1
    const link1Label = meme.artist_link_1_label || "Website"
    const link2 = meme.artist_link_2
    const link2Label = meme.artist_link_2_label || "Social Media"

    // Only show if at least one link exists
    if (!link1 && !link2) return null

    return (
      <div className="mt-4">
        <p className="text-base text-gray-600 mb-3">Visit this artist at the links below:</p>
        <div className="flex flex-wrap gap-3 justify-center">
          {link1 && (
            <a
              href={link1}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#B22234] text-white rounded-md hover:bg-[#8B1A2B] transition-colors w-36 justify-center"
            >
              <ExternalLink size={16} />
              {link1Label}
            </a>
          )}
          {link2 && (
            <a
              href={link2}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 bg-[#B22234] text-white rounded-md hover:bg-[#8B1A2B] transition-colors w-36 justify-center"
            >
              <ExternalLink size={16} />
              {link2Label}
            </a>
          )}
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{getPageTitle()}</title>
        <meta
          property="og:title"
          content={meme.ogTitle || `Meme by ${Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown"}`}
        />
        <meta property="og:description" content={meme.ogDescription || meme.description || ""} />
        <meta property="og:image" content={getStrapiMedia(meme.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" /> {/* Memes are often treated as articles for OG */}
        <meta property="og:site_name" content="Red, White and True News" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={meme.ogTitle || `Meme by ${Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown"}`}
        />
        <meta name="twitter:description" content={meme.ogDescription || meme.description || ""} />
        <meta name="twitter:image" content={getStrapiMedia(meme.ogImage) || imageUrl || "/placeholder.svg"} />
        <meta name="twitter:site" content="@RWTNews" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <div className="my-8 flex flex-col items-center">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Meme"}
              className="max-w-full w-full md:max-w-2xl h-auto rounded-lg mb-4"
            />
            <div className="text-center max-w-2xl">
              <h1 className="text-3xl font-bold text-[#3C3B6E]">
                {Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown Artist"}
              </h1>
              <p className="text-lg text-gray-600 mb-3">
                {new Date(meme.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              {meme.description && <p className="text-lg text-gray-700 italic mb-4 px-4">{meme.description}</p>}
              {renderArtistLinks()}
            </div>
            {meme.enable_share_buttons && (
              <div className="mt-6">
                <ShareButtons
                  shareUrl={pageUrl}
                  title={`Check out this meme by ${Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown"}`}
                />
              </div>
            )}
          </div>
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
    const memeRes = await axios.get(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?filters[slug][$eq]=${slug}&populate[image]=*&populate[ogImage]=*`,
    )
    const meme = memeRes.data.data[0]?.attributes

    if (!meme) {
      return {
        props: {
          meme: null,
          pageUrl: pageUrl,
        },
      }
    }

    return {
      props: {
        meme: meme,
        pageUrl: pageUrl,
      },
    }
  } catch (error) {
    console.error("Error fetching meme in getServerSideProps:", error)
    return {
      props: {
        meme: null,
        pageUrl: pageUrl,
      },
    }
  }
}
