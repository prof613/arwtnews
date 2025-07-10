"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import ShareButtons from "./ShareButtons" // Ensure this is imported
import { X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"

export default function MemeLightbox({
  initialMemes,
  initialIndexOnPage,
  currentPage,
  totalPages,
  onClose,
  onMemeChange,
}) {
  const [memes, setMemes] = useState(initialMemes)
  const [currentIndex, setCurrentIndex] = useState(initialIndexOnPage)
  const [pagesLoaded, setPagesLoaded] = useState(new Set([currentPage]))
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "ArrowLeft") handlePrev()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [memes, currentIndex, isLoading])

  useEffect(() => {
    const currentMeme = memes[currentIndex]
    if (currentMeme) {
      const newPage = Math.floor(currentIndex / 10) + 1
      onMemeChange(currentMeme, newPage)
    }
  }, [currentIndex, memes])

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
    }
  }

  const handleNext = async () => {
    if (isLoading) return

    if (currentIndex === memes.length - 1) {
      const lastLoadedPage = Math.max(...pagesLoaded)
      if (lastLoadedPage < totalPages) {
        setIsLoading(true)
        const nextPageToFetch = lastLoadedPage + 1
        try {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?populate=*&sort[0]=date:desc&pagination[page]=${nextPageToFetch}&pagination[pageSize]=10&filters[publishedAt][$notNull]=true`,
          )
          setMemes((prev) => [...prev, ...res.data.data])
          setPagesLoaded((prev) => new Set(prev).add(nextPageToFetch))
          setCurrentIndex((prev) => prev + 1)
        } catch (error) {
          console.error("Failed to load next page of memes", error)
        } finally {
          setIsLoading(false)
        }
      }
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const currentMeme = memes[currentIndex]
  if (!currentMeme) return null

  const memeImageUrl = currentMeme.attributes.image?.data?.attributes?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${currentMeme.attributes.image.data.attributes.url}`
    : "/images/core/placeholder.jpg"

  // This creates a "permanent" URL for the specific meme, which is best for sharing
  const memePageUrl =
    typeof window !== "undefined" ? `${window.location.origin}/memes/${currentMeme.attributes.slug}` : ""

  const hasMorePages = Math.max(...pagesLoaded) < totalPages
  const showNextButton = currentIndex < memes.length - 1 || (currentIndex === memes.length - 1 && hasMorePages)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-lg p-4 md:p-6 max-w-3xl w-full relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
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

          {/* Conditionally render ShareButtons based on the Strapi field */}
          {currentMeme.attributes.enable_share_buttons && (
            <ShareButtons
              shareUrl={memePageUrl}
              title={`Check out this meme by ${currentMeme.attributes.artist || "Unknown"}`}
            />
          )}
        </div>
      </div>

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
