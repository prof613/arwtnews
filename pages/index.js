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

// Clean video titles - remove HTML entities and hashtags
const cleanTitle = (title) => {
  if (!title) return "Video Unavailable"

  return title
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .split("#")[0] // Remove everything after first hashtag
    .trim()
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
        // Handle articles separately - ONLY ACTIVE articles for homepage
        try {
          const articleRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*&sort[0]=date:desc&filters[publishedAt][$notNull]=true&filters[homepage_status][$eq]=active`,
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
              return dateB - dateA
            })
            .slice(0, 10)

          setExternalLinks(filteredAndSorted)
        } catch (error) {
          console.error("Error fetching external articles:", error)
          setExternalLinks([])
        }

        // Handle videos - now using server-side API
        try {
          console.log("Fetching videos from server API...")
          const videoRes = await axios.get("/api/videos")
          setVideos(videoRes.data.videos || [])
          console.log(`Loaded ${videoRes.data.videos?.length || 0} videos (cached: ${videoRes.data.cached})`)
        } catch (error) {
          console.error("Error fetching videos:", error)
          setVideos([])
        }
      } catch (error) {
        console.error("Error in fetchData:", error)
      }
    }
    fetchData()
  }, [])

  const openVideoModal = (videoUrl) => setModalVideo(videoUrl)
  const closeVideoModal = () => setModalVideo(null)

  // Fullscreen functionality
  const toggleFullscreen = () => {
    const iframe = document.querySelector("#video-modal-iframe")
    if (iframe) {
      if (iframe.requestFullscreen) {
        iframe.requestFullscreen()
      } else if (iframe.webkitRequestFullscreen) {
        iframe.webkitRequestFullscreen()
      } else if (iframe.msRequestFullscreen) {
        iframe.msRequestFullscreen()
      }
    }
  }

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
                  {/* Updated image container with 80% width and centered */}
                  <div className="flex justify-center mb-4">
                    <img
                      src={
                        featuredArticle.image_path
                          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featuredArticle.image_path}`
                          : featuredArticle.image?.data?.attributes?.url
                            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${featuredArticle.image.data.attributes.url}`
                            : "/images/core/placeholder.jpg"
                      }
                      alt={featuredArticle.title}
                      className="w-full md:w-4/5 h-auto object-contain rounded max-h-96 sm:max-h-80 md:max-h-96 lg:max-h-[28rem]"
                    />
                  </div>
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
                        <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-7">
                    {(() => {
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
                    })()}... <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
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
                  <img
                    src={
                      article.attributes.image_path
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.attributes.image_path}`
                        : article.attributes.image?.data?.attributes?.url
                          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${article.attributes.image.data.attributes.url}`
                          : "/images/core/placeholder.jpg"
                    }
                    alt={article.attributes.title}
                    className="w-full h-auto md:h-48 object-contain rounded mb-2 bg-gray-50"
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
                      <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                    </p>
                  )}
                  <p className="text-sm text-gray-500 line-clamp-5">
                    {(() => {
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
                    })()}... <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                  </p>
                  <hr className="border-[#3C3B6E] border-opacity-50 mt-4" />
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
            {videos.length > 0 ? (
              videos.map((video, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-50 rounded transition-colors"
                  onClick={() => openVideoModal(`https://www.youtube.com/embed/${video.id?.videoId}`)}
                >
                  <img
                    src={video.snippet?.thumbnails?.medium?.url || "/images/core/placeholder.jpg"}
                    alt={cleanTitle(video.snippet?.title)}
                    className="w-full aspect-video object-cover rounded mb-2" // Standard 16:9 video ratio
                  />
                  <h3 className="text-md font-semibold text-[#3C3B6E] mb-1 line-clamp-2">
                    {cleanTitle(video.snippet?.title)}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {video.channelName} •{" "}
                    {new Date(video.snippet?.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                    {video.snippet?.description?.substring(0, 100)}...
                  </p>
                  <button className="text-[#B22234] font-bold text-sm hover:underline">Watch Now</button>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-8">
                <p>Loading videos...</p>
              </div>
            )}
          </div>
        </section>
        <Sidebar />
      </main>

      {/* ENHANCED VIDEO MODAL WITH FULLSCREEN */}
      {modalVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4"
          onClick={closeVideoModal}
        >
          <div
            className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#3C3B6E]">Video Player</h3>
              <div className="flex gap-2">
                <button
                  onClick={toggleFullscreen}
                  className="text-gray-500 hover:text-[#B22234] text-xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Fullscreen"
                  title="Fullscreen"
                >
                  ⛶
                </button>
                <button
                  onClick={closeVideoModal}
                  className="text-gray-500 hover:text-[#B22234] text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close video"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Video Container */}
            <div className="relative bg-black">
              <iframe
                id="video-modal-iframe"
                src={`${modalVideo}?autoplay=1`}
                className="w-full h-[60vh] md:h-[70vh]"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Video Player"
              />
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Click outside the video, press × to close, or ⛶ for fullscreen</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}
