"use client"

import Head from "next/head"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import axios from "axios"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Footer from "../../components/Footer"
import MainBanner from "../../components/MainBanner"
import ShareButtons from "../../components/ShareButtons"
import { ExternalLink } from "lucide-react"

export default function MemePage() {
  const router = useRouter()
  const { slug } = router.query
  const [meme, setMeme] = useState(null)

  useEffect(() => {
    if (slug) {
      async function fetchMeme() {
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?filters[slug][$eq]=${slug}&populate=*`,
          )
          const memeData = res.data.data[0]
          setMeme(memeData?.attributes || null)
        } catch (error) {
          console.error("Error fetching meme:", error)
        }
      }
      fetchMeme()
    }
  }, [slug])

  if (!meme) return <div>Loading...</div>

  const imageUrl = meme.image?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${meme.image.data.attributes.url}`
    : "/images/core/placeholder.jpg"

  const pageUrl = typeof window !== "undefined" ? window.location.href : ""

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
          content={`Meme by ${Array.isArray(meme.artist) ? meme.artist[0] : meme.artist || "Unknown"}`}
        />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
        {meme.description && <meta property="og:description" content={meme.description} />}
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
