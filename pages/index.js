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
import { extractTextFromBlocks } from "../utils/blockHelpers"

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
    .replace(/'/g, "'")
    .replace(/"/g, '"')
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .split("#")[0] // Remove everything after first hashtag
    .trim()
}

export default function Home() {
  const [featuredArticles, setFeaturedArticles] = useState([])
  const [articles, setArticles] = useState([])
  const [externalLinks, setExternalLinks] = useState([])
  const [videos, setVideos] = useState([])
  const [modalVideo, setModalVideo] = useState(null)
  const [articlesError, setArticlesError] = useState(null)
  const [externalLinksError, setExternalLinksError] = useState(null)
  const [videosError, setVideosError] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    async function fetchData() {
      try {
        // Handle articles separately - ONLY ACTIVE articles for homepage
        try {
          const articleRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/articles?populate=*&sort[0]=date:desc&filters[publishedAt][$notNull]=true&filters[homepage_status][$eq]=active`,
            { signal: controller.signal },
          )
          const featuredArticlesList = articleRes.data.data.filter((a) => a.attributes.is_featured)
          const regularArticles = articleRes.data.data.filter((a) => !a.attributes.is_featured)
          setFeaturedArticles(featuredArticlesList.slice(0, 3))
          setArticles(regularArticles.slice(0, 6))
          setArticlesError(null)
        } catch (error) {
          if (error.name !== "AbortError") {
            setArticlesError("Failed to load articles. Please try again later.")
            setFeaturedArticles([])
            setArticles([])
          }
        }

        // Handle external articles separately with 1-year timeout and proper sorting
        try {
          const externalRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/external-articles?populate=*&sort[0]=createdAt:desc`,
            { signal: controller.signal },
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
          setExternalLinksError(null)
        } catch (error) {
          if (error.name !== "AbortError") {
            setExternalLinksError("Failed to load external articles. Please try again later.")
            setExternalLinks([])
          }
        }

        // Handle videos - now using server-side API
        try {
          const videoRes = await axios.get("/api/videos", { signal: controller.signal })
          setVideos(videoRes.data.videos || [])
          setVideosError(null)
        } catch (error) {
          if (error.name !== "AbortError") {
            setVideosError("Failed to load videos. Please try again later.")
            setVideos([])
          }
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setArticlesError("Failed to load articles. Please try again later.")
          setExternalLinksError("Failed to load external articles. Please try again later.")
          setVideosError("Failed to load videos. Please try again later.")
        }
      }
    }
    fetchData()
    return () => controller.abort() // Cleanup on unmount
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

  // Helper function to render individual featured article
  const renderFeaturedArticle = (article, isHero = false) => {
    const attrs = article.attributes
    return (
      <Link href={`/articles/${attrs.slug}`} key={article.id}>
        <div className={`bg-gray-100 p-4 rounded ${isHero ? "" : "h-full"}`}>
          {/* Featured Article Label */}
          <h4 className="text-center text-sm font-semibold text-[#B22234] mb-2 uppercase tracking-wide">
            Featured Article
          </h4>
          {/* Image container */}
          <div className={`flex justify-center mb-4 ${isHero ? "" : "mb-2"}`}>
            <img
              src={
                attrs.image_path
                  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${attrs.image_path}`
                  : attrs.image?.data?.attributes?.url
                    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${attrs.image.data.attributes.url}`
                    : "/images/core/placeholder.jpg"
              }
              alt={attrs.title}
              className={`w-full h-auto object-contain rounded ${
                isHero ? "md:w-4/5 max-h-96 sm:max-h-80 md:max-h-96 lg:max-h-[28rem]" : "max-h-48"
              }`}
            />
          </div>
          <h3
            className={`font-bold text-[#3C3B6E] ${isHero ? "text-2xl min-h-[4rem]" : "text-xl min-h-[3.5rem]"} leading-tight`}
          >
            {attrs.title}
          </h3>
          <p className="text-sm text-gray-600 font-bold min-h-[2.5rem] leading-tight">
            {new Date(attrs.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "America/Los_Angeles",
            })}
          </p>
          <p className="text-sm text-gray-600 font-bold">
            {(() => {
              const primaryCat = attrs.category?.data?.attributes?.name
              const secondaryCat = attrs.secondary_category?.data?.attributes?.name
              if (primaryCat && secondaryCat) {
                return `${primaryCat} - ${secondaryCat}`
              } else {
                return primaryCat || secondaryCat || "None"
              }
            })()} / {attrs.author || "Unknown"}
          </p>
          {attrs.quote && (
            <div className="italic text-gray-500 border-l-4 border-[#B22234] pl-2 mb-2">
              <p className={`leading-5 ${isHero ? "line-clamp-2 min-h-[2.5rem]" : "line-clamp-2 min-h-[2.5rem]"}`}>
                {attrs.quote}...{" "}
                <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
              </p>
            </div>
          )}
          <p className={`text-sm text-gray-500 whitespace-pre-line ${isHero ? "line-clamp-7" : "line-clamp-3"}`}>
            {extractTextFromBlocks(attrs.rich_body, isHero ? 300 : 150)}...{" "}
            <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
          </p>
        </div>
      </Link>
    )
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

          {/* Featured Articles Section */}
          <section className="my-8">
            <h2 className="text-3xl font-bold text-[#3C3B6E] text-center mb-4">Featured Articles</h2>

            {articlesError ? (
              <p className="text-center text-gray-500 py-8">{articlesError}</p>
            ) : featuredArticles.length > 0 ? (
              <div className="space-y-4">
                {/* Hero Featured Article */}
                {renderFeaturedArticle(featuredArticles[0], true)}

                {/* Row of 2 Featured Articles (if we have 2 or 3 total) */}
                {featuredArticles.length > 1 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredArticles.slice(1, 3).map((article) => renderFeaturedArticle(article, false))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No featured articles available.</p>
            )}
          </section>

          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center mb-4">The RIGHT News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articlesError ? (
              <p className="text-center text-gray-500 py-8">{articlesError}</p>
            ) : (
              articles.map((article) => (
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
                    <p className="text-sm text-gray-600 font-bold min-h-[2.5rem] leading-tight">
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
                    <h3 className="text-xl font-bold text-[#3C3B6E] min-h-[3.5rem] leading-tight">
                      {article.attributes.title}
                    </h3>
                    {article.attributes.quote && (
                      <p className="text-sm text-gray-500 italic mb-1 border-l-4 border-[#B22234] pl-2 line-clamp-2 min-h-[2.5rem] leading-5">
                        {article.attributes.quote}...{" "}
                        <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                      </p>
                    )}
                    <p className="text-sm text-gray-500 line-clamp-5 whitespace-pre-line">
                      {extractTextFromBlocks(article.attributes.rich_body, 200)}...{" "}
                      <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
                    </p>
                    <hr className="border-[#3C3B6E] border-opacity-50 mt-4" />
                  </div>
                </Link>
              ))
            )}
          </div>
          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">From the Web</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {externalLinksError ? (
              <p className="text-center text-gray-500 py-8">{externalLinksError}</p>
            ) : (
              externalLinks.map((link) => (
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
                      <p className="text-sm text-gray-500 italic border-l-4 border-[#B22234] pl-2 mb-2 min-h-[2.5rem] leading-5">
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
              ))
            )}
          </div>
          <h2 className="text-3xl font-bold text-[#3C3B6E] text-center my-4">Latest Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {videosError ? (
              <p className="text-center text-gray-500 py-8">{videosError}</p>
            ) : videos.length > 0 ? (
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
