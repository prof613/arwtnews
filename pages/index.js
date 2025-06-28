"use client"

// File: index.js
// Folder: /rwtnews/pages

import Head from "next/head"
import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"
import MainBanner from "../components/MainBanner"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import Footer from "../components/Footer"

// Function to format date properly (fix timezone issue)
const formatDate = (dateString) => {
  const date = new Date(dateString)
  const utcDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
  return utcDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default function Home() {
  const [featuredArticle, setFeaturedArticle] = useState(null)
  const [articles, setArticles] = useState([])
  const [externalLinks, setExternalLinks] = useState([])
  const [videos, setVideos] = useState([])
  const [modalVideo, setModalVideo] = useState(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const channelIds = [
          "UUXIJgqnII2ZOINSWNOGFThA",
          "UUHqC-yWZ1kri4YzwRSt6RGQ",
          "UUDiPds0v60wueil5B8w3fPQ",
          "UUx6h-dWzJ5NpAlja1YsApdg",
        ]

        // Handle articles separately
        try {
          const articleRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*&sort[0]=date:desc`,
          )
          const featuredArticles = articleRes.data.data.filter((a) => a.attributes.is_featured)
          const regularArticles = articleRes.data.data.filter((a) => !a.attributes.is_featured)
          setFeaturedArticle(featuredArticles[0]?.attributes || null)
          setArticles(regularArticles.slice(0, 6))
        } catch (error) {
          console.error("Error fetching articles:", error)
        }

        // Handle external articles separately with 1-year timeout and proper sorting
        try {
          const externalRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/external-articles?populate=*&sort[0]=createdAt:desc`,
          )

          // Filter articles within 1 year and sort by manual date (newest first)
          const oneYearAgo = new Date()
          oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)

          const filteredAndSorted = externalRes.data.data
            .filter((article) => {
              const articleDate = new Date(article.attributes.date)
              return articleDate >= oneYearAgo
            })
            .sort((a, b) => {
              const dateA = new Date(a.attributes.date)
              const dateB = new Date(b.attributes.date)
              return dateB - dateA // Newest first
            })
            .slice(0, 10) // Limit to 10 articles

          setExternalLinks(filteredAndSorted)
        } catch (error) {
          console.error("Error fetching external articles:", error)
          setExternalLinks([])
        }

        // Handle videos separately
        try {
          const videoRes = await axios.get(
            `https://www.googleapis.com/youtube/v3/search?key=${
              process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
            }&channelId=${channelIds.join(",")}&part=snippet&order=date&maxResults=6`,
          )
          setVideos(videoRes.data.items || [])
        } catch (error) {
          console.error("Error fetching videos:", error)
          setVideos(
            new Array(6).fill({
              snippet: {
                title: "Video Unavailable",
                thumbnails: { medium: { url: "/images/core/placeholder.jpg" } },
              },
            }),
          )
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
      }
    }
    fetchData()
  }, [])

  const openVideoModal = (videoUrl) => setModalVideo(videoUrl)
  const closeVideoModal = () => setModalVideo(null)

  return (
    <>
      <Head>
        <title>Red, White and True News</title>
        <link rel="icon" href="/images/core/rwtn_favicon.jpg" />
      </Head>
      <Header />
      <main className="max-w-7xl mx-auto p-4 flex flex-col md:flex-row gap-4 bg-white">
        <section className="w-full md:w-3/4">
          <MainBanner />
          <section className="my-8">
            <h2 className="text-3xl font-bold text-[#3C3B6E] text-center mb-4">Featured Article</h2>
            {featuredArticle ? (
              <Link href={`/articles/${featuredArticle.slug}`}>
                <div className="bg-gray-100 p-4 rounded">
                  <img
                    src={
                      featuredArticle.image_path
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featuredArticle.image_path}`
                        : featuredArticle.image?.data?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featuredArticle.image.data.attributes.url}`
                          : "/images/core/placeholder.jpg"
                    }
                    alt={featuredArticle.title}
                    className="w-full aspect-video object-cover rounded mb-2"
                  />
                  <h3 className="text-2xl font-bold text-[#3C3B6E]">{featuredArticle.title}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(featuredArticle.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                  </p>
                  <p className="text-sm text-gray-600 font-bold">
                    {(() => {
                      const primaryCat = featuredArticle.category?.data?.attributes?.name
                      const secondaryCat = featuredArticle.secondary_category?.data?.attributes?.name
                      if (primaryCat && secondaryCat) {
                        return `${primaryCat} - ${secondaryCat}`
                      } else {
                        return primaryCat || secondaryCat || "None"
                      }
                    })()} / {featuredArticle.author || "Unknown"}
                  </p>
                  {featuredArticle.quote && (
                    <div className="italic text-gray-500 border-l-4 border-[#B22234] pl-2 mb-2">
                      <p className="line-clamp-2">
                        {featuredArticle.quote}...{" "}
                        <Link href={`/articles/${featuredArticle.slug}`}>
                          <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                        </Link>
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-7">
                    {(() => {
                      // Generate excerpt from rich_body content
                      if (Array.isArray(featuredArticle.rich_body)) {
                        let excerpt = ""
                        let lineCount = 0

                        for (const block of featuredArticle.rich_body) {
                          if (block.type === "paragraph" && block.children) {
                            const text = block.children.map((child) => child.text).join("")
                            excerpt += text + " "
                            lineCount++
                            if (lineCount >= 5) break
                          }
                        }

                        return excerpt.substring(0, 300).trim()
                      }
                      return ""
                    })()}...{" "}
                    <Link href={`/articles/${featuredArticle.slug}`}>
                      <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                    </Link>
                  </p>
                </div>
              </Link>
            ) : (
              <p>No featured article available.</p>
            )}
          </section>
          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center mb-4">The RIGHT News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.attributes.slug}`}>
                <div className="border-l-4 border-[#B22234] p-4">
                  <hr className="border-[#3C3B6E] border-opacity-50 mb-2" />
                  <img
                    src={
                      article.attributes.image_path
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.attributes.image_path}`
                        : article.attributes.image?.data?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.attributes.image.data.attributes.url}`
                          : "/images/core/placeholder.jpg"
                    }
                    alt={article.attributes.title}
                    className="w-full aspect-video object-cover rounded mb-2"
                  />
                  <p className="text-sm text-gray-600">
                    {(() => {
                      const primaryCat = article.attributes.category?.data?.attributes?.name
                      const secondaryCat = article.attributes.secondary_category?.data?.attributes?.name
                      if (primaryCat && secondaryCat) {
                        return `${primaryCat} - ${secondaryCat}`
                      } else {
                        return primaryCat || secondaryCat || "None"
                      }
                    })()} / {article.attributes.author || "Unknown"} /{" "}
                    {new Date(article.attributes.date).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "America/Los_Angeles",
                    })}
                  </p>
                  <h3 className="text-xl font-bold text-[#3C3B6E]">{article.attributes.title}</h3>
                  {article.attributes.quote && (
                    <p className="text-sm text-gray-500 italic mb-1 border-l-4 border-[#B22234] pl-2 line-clamp-2">
                      {article.attributes.quote}...{" "}
                      <Link href={`/articles/${article.attributes.slug}`}>
                        <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                      </Link>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-5">
                    {(() => {
                      // Generate excerpt from rich_body content
                      if (Array.isArray(article.attributes.rich_body)) {
                        let excerpt = ""
                        let lineCount = 0

                        for (const block of article.attributes.rich_body) {
                          if (block.type === "paragraph" && block.children) {
                            const text = block.children.map((child) => child.text).join("")
                            excerpt += text + " "
                            lineCount++
                            if (lineCount >= 5) break
                          }
                        }

                        return excerpt.substring(0, 200).trim()
                      }
                      return ""
                    })()}...{" "}
                    <Link href={`/articles/${article.attributes.slug}`}>
                      <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                    </Link>
                  </p>
                </div>
              </Link>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">From the Web</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalLinks.map((link) => (
              <a
                key={link.id}
                href={link.attributes.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault()
                  if (confirm("You're about to visit an external site. Continue?"))
                    window.open(link.attributes.link, "_blank")
                }}
              >
                <div className="p-2">
                  <h3 className="text-xl font-bold text-[#3C3B6E]">{link.attributes.title}</h3>
                  {link.attributes.quote && (
                    <p className="text-sm text-gray-500 italic border-l-4 border-[#B22234] pl-2 mb-2">
                      {link.attributes.quote.substring(0, 100)}...
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {link.attributes.category || "None"} / {link.attributes.author || "Unknown"} /{" "}
                    {formatDate(link.attributes.date)}
                  </p>
                  <p className="text-sm text-[#B22234]">
                    Read full article at {new URL(link.attributes.link).hostname}
                  </p>
                </div>
              </a>
            ))}
          </div>
          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Latest Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="p-2">
                <img
                  src={
                    video.snippet?.thumbnails?.medium?.url ||
                    "/images/core/placeholder.jpg" ||
                    "/placeholder.svg" ||
                    "/placeholder.svg"
                  }
                  alt={video.snippet?.title}
                  className="w-full h-24 object-cover rounded mb-2"
                />
                <h3 className="text-md text-[#3C3B6E]">{video.snippet?.title || "Video Unavailable"}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(video.snippet?.publishedAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "America/Los_Angeles",
                  })}
                </p>
                <p className="text-sm text-gray-500">{video.snippet?.description?.substring(0, 100)}...</p>
                <button
                  onClick={() => openVideoModal(`https://www.youtube.com/embed/${video.id?.videoId}`)}
                  className="text-[#B22234] font-bold"
                >
                  Watch Now
                </button>
              </div>
            ))}
          </div>
        </section>
        <Sidebar />
      </main>
      {modalVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-3/4 max-w-4xl rounded p-4">
            <button onClick={closeVideoModal} className="text-[#3C3B6E] text-2xl float-right">
              ×
            </button>
            <iframe src={modalVideo} className="w-full h-96 rounded" frameBorder="0" allowFullScreen></iframe>
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}
