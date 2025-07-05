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

  return (
    <>
      <Head>
        <title>Meme by {meme.artist || "Unknown"} | Red, White and True News</title>
        <meta property="og:title" content={`Meme by ${meme.artist || "Unknown"}`} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="article" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="flex-1">
          <MainBanner />
          <div className="my-8 flex flex-col items-center">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={meme.artist || "Meme"}
              className="max-w-full w-full md:max-w-2xl h-auto rounded-lg mb-4"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-[#3C3B6E]">{meme.artist || "Unknown Artist"}</h1>
              <p className="text-md text-gray-600">
                {new Date(meme.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            {meme.enable_share_buttons && (
              <ShareButtons shareUrl={pageUrl} title={`Check out this meme by ${meme.artist || "Unknown"}`} />
            )}
          </div>
        </section>
        <Sidebar />
      </main>
      <Footer />
    </>
  )
}
