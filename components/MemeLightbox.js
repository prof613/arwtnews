"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ShareButtons from "./ShareButtons"
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export default function MemeLightbox({
  initialMemes,
  initialIndexOnPage,
  currentPage,
  totalPages,
  onClose,
  onMemeChange,
}) {
  // State for all memes loaded so far by the lightbox
  const [memes, setMemes] = useState(initialMemes)
  // The index of the currently viewed meme within the `memes` array
  const [currentIndex, setCurrentIndex] = useState(initialIndexOnPage)
  // Keep track of which pages have been fetched
  const [pagesLoaded, setPagesLoaded] = useState(new Set([currentPage]))
  // Loading state for fetching new pages
  const [isLoading, setIsLoading] = useState(false)

  // Effect to handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [memes, currentIndex, isLoading]) // Re-bind when state changes

  // When the index changes, notify the parent to update the URL slug and page
  useEffect(() => {
    const currentMeme = memes[currentIndex]
    if (currentMeme) {
      // Calculate which page the current meme index falls on
      const newPage = Math.floor(currentIndex / 10) + 1
      onMemeChange(currentMeme, newPage)
    }
  }, [currentIndex, memes])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
    // Note: fetching previous pages is a more complex feature,
    // so for now, we only navigate within the already loaded data.
  }

  const handleNext = async () => {
    if (isLoading) return

    // If we are at the last loaded meme...
    if (currentIndex === memes.length - 1) {
      const lastLoadedPage = Math.max(...pagesLoaded)

      // ...and if there are more pages to fetch
      if (lastLoadedPage < totalPages) {
        setIsLoading(true)
        const nextPageToFetch = lastLoadedPage + 1
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?populate=*&sort[0]=date:desc&pagination[page]=${nextPageToFetch}&pagination[pageSize]=10&filters[publishedAt][$notNull]=true`,
          )
          // Add the new memes to our state
          setMemes((prev) => [...prev, ...res.data.data])
          // Record that we've loaded this page
          setPagesLoaded((prev) => new Set(prev).add(nextPageToFetch))
          // Move to the next index
          setCurrentIndex((prev) => prev + 1)
        } catch (error) {
          console.error("Failed to load next page of memes", error)
        } finally {
          setIsLoading(false)
        }
      }
    } else {
      // Otherwise, just navigate to the next meme in the already loaded array
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const currentMeme = memes[currentIndex]
  if (!currentMeme) return null

  const memeImageUrl = currentMeme.attributes.image?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${currentMeme.attributes.image.data.attributes.url}`
    : "/images/core/placeholder.jpg"

  const memePageUrl =
    typeof window !== "undefined" ? `${window.location.origin}/memes/${currentMeme.attributes.slug}` : ""

  // Determine if the next button should be shown
  const hasMorePages = Math.max(...pagesLoaded) < totalPages
  const showNextButton = currentIndex < memes.length - 1 || (currentIndex === memes.length - 1 && hasMorePages)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-4 md:p-6 max-w-3xl w-full relative" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black z-10"
          aria-label="Close"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col items-center">
          <div className="relative w-full flex justify-center items-center min-h-[300px]">
            {isLoading && currentIndex === memes.length - 1 && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/50">
                <Loader2 size={48} className="animate-spin text-[#3C3B6E]" />
              </div>
            )}
            <img
              src={memeImageUrl || "/placeholder.svg"}
              alt={currentMeme.attributes.artist || "Meme"}
              className="max-w-full max-h-[60vh] object-contain rounded"
            />
          </div>

          <div className="text-center mt-4 w-full">
            <h3 className="text-xl font-bold text-[#3C3B6E]">{currentMeme.attributes.artist || "Unknown Artist"}</h3>
            <p className="text-sm text-gray-600">
              {new Date(currentMeme.attributes.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          {currentMeme.attributes.enable_share_buttons && (
            <ShareButtons
              shareUrl={memePageUrl}
              title={`Check out this meme by ${currentMeme.attributes.artist || "Unknown"}`}
            />
          )}
        </div>
      </div>

      {/* Previous Button */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePrev()
          }}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-black"
          aria-label="Previous meme"
        >
          <ChevronLeft size={32} />
        </button>
      )}

      {/* Next Button */}
      {showNextButton && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleNext()
          }}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white rounded-full p-2 text-black"
          aria-label="Next meme"
          disabled={isLoading}
        >
          {isLoading && currentIndex === memes.length - 1 ? (
            <Loader2 size={32} className="animate-spin" />
          ) : (
            <ChevronRight size={32} />
          )}
        </button>
      )}
    </div>
  )
}
