"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"
import { extractTextFromBlocks } from "../utils/blockHelpers"
import { getStrapiMedia } from "../utils/media" // Import the new helper

export default function Sidebar() {
  const router = useRouter()
  const [memes, setMemes] = useState([])
  const [opinions, setOpinions] = useState([])
  const [email, setEmail] = useState("")
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("articles")

  useEffect(() => {
    async function fetchSidebarContent() {
      try {
        const [memeRes, opinionRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?pagination[limit]=2&populate=*&sort[0]=date:desc`),
          axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?pagination[page]=1&pagination[pageSize]=2&populate=*&sort[0]=date:desc`,
          ),
        ])
        setMemes(memeRes.data.data)
        const sortedOpinions = opinionRes.data.data.sort(
          (a, b) => new Date(b.attributes.date) - new Date(a.attributes.date),
        )
        setOpinions(sortedOpinions)
      } catch (error) {
        console.error("Error fetching sidebar content:", error)
      }
    }
    fetchSidebarContent()
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setIsSubscribing(true)
    try {
      const response = await axios.post("/api/subscribe", {
        email: email,
      })
      if (response.data.success) {
        alert("Subscribed successfully!")
        setEmail("")
      } else {
        alert("Failed to subscribe: " + response.data.message)
      }
    } catch (error) {
      console.error("Error subscribing:", error)
      alert("Failed to subscribe. Please try again.")
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Store recent search in localStorage
      const recentSearches = JSON.parse(localStorage.getItem("recentSearches") || "[]")
      const updatedSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)
      localStorage.setItem("recentSearches", JSON.stringify(updatedSearches))
      // Navigate to appropriate search page based on type
      const searchPage = searchType === "articles" ? "/search-all-articles" : "/search-web-articles"
      router.push(`${searchPage}?query=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const handleExternalLink = (url, siteName) => {
    if (confirm(`You're leaving to visit ${siteName}. Continue?`)) {
      window.open(url, "_blank")
    }
  }

  return (
    <aside className="w-full md:w-1/4 order-2 md:order-none">
      {/* Search Section */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <form onSubmit={handleSearch} className="flex flex-col gap-2">
          {/* Search Type Toggle - Stacked vertically */}
          <div className="flex flex-col gap-2 mb-2">
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="sidebarSearchType"
                value="articles"
                checked={searchType === "articles"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              <span className="text-[#3C3B6E]">Our Articles</span>
            </label>
            <label className="flex items-center cursor-pointer text-sm">
              <input
                type="radio"
                name="sidebarSearchType"
                value="external"
                checked={searchType === "external"}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              <span className="text-[#3C3B6E]">Our Archive of News from the Web</span>
            </label>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchType === "articles" ? "Search our articles..." : "Search our web archive..."}
            className="p-2 border rounded"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-[#B22234] text-white p-2 rounded hover:bg-[#8B1A1A] transition-colors"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => {
                const searchPage = searchType === "articles" ? "/search-all-articles" : "/search-web-articles"
                router.push(searchPage)
              }}
              className="bg-gray-600 text-white px-3 py-2 rounded hover:bg-gray-700 transition-colors text-sm"
              title="Advanced Search"
            >
              Advanced
            </button>
          </div>
        </form>
      </div>
      {/* Ad Slot 1 - Top under search */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <a
          href="https://ourconservativestore.com/product/trump-fight-never-surrender-mug-iconic-patriotic-trump-coffee-mug/?sld=95"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img
            src="https://ourconservativestore.com/wp-content/uploads/2024/09/3598280471593076194_2048-300x300.jpeg"
            alt="Trump Fight Never Surrender Mug"
            className="w-full h-auto rounded"
          />
        </a>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Get your "Fight!" mug at
          <br />
          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B22234] hover:underline font-medium"
          >
            Our Conservative Store
          </a>
        </p>
      </div>
      {/* Opinion Section - MOVED UP */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">
          <Link href="/opinions" className="hover:text-[#B22234]">
            Opinion
          </Link>
        </h3>
        {opinions.map((opinion) => (
          <div key={opinion.id} className="mb-2">
            <Link href={`/opinions/${opinion.attributes.slug}`}>
              <h4 className="text-md font-bold text-[#3C3B6E] hover:text-[#B22234]">{opinion.attributes.title}</h4>
              <p className="text-sm text-gray-600">
                {new Date(opinion.attributes.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  timeZone: "America/Los_Angeles",
                })}
              </p>
              {getStrapiMedia(opinion.attributes.featured_image) && (
                <div
                  className="w-full bg-gray-200 rounded mb-2 flex items-center justify-center"
                  style={{ minHeight: "120px" }}
                >
                  <img
                    src={getStrapiMedia(opinion.attributes.featured_image) || "/images/core/placeholder.jpg"}
                    alt={opinion.attributes.title}
                    className="max-w-full max-h-32 object-contain rounded"
                  />
                </div>
              )}
              {opinion.attributes.quote && (
                <blockquote className="text-sm text-gray-500 italic mb-1 border-l-4 border-[#B22234] pl-2 line-clamp-2">
                  {opinion.attributes.quote}...{" "}
                  <span className="text-[#B22234] cursor-pointer hover:underline not-italic">see more</span>
                </blockquote>
              )}
              <p className="text-sm text-gray-500 line-clamp-5 whitespace-pre-line">
                {extractTextFromBlocks(opinion.attributes.rich_body, 100)}...{" "}
                <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
              </p>
            </Link>
          </div>
        ))}
      </div>
      {/* Memes Section - MOVED DOWN */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">
          <Link href="/categories/Meme-Cartoons" className="hover:text-[#B22234]">
            Memes & Cartoons
          </Link>
        </h3>
        {memes.map((meme) => (
          <div key={meme.id} className="mb-2">
            <Link href="/categories/Meme-Cartoons">
              <div className="cursor-pointer hover:opacity-80">
                <p className="text-sm text-gray-600 mb-1">
                  {meme.attributes.artist || "Unknown"} /{" "}
                  {new Date(meme.attributes.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                    timeZone: "America/Los_Angeles",
                  })}
                </p>
                <img
                  src={getStrapiMedia(meme.attributes.image) || "/images/core/placeholder.jpg"}
                  alt="Meme"
                  className="w-full h-auto rounded"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
      {/* Ad Slot 2 - Below memes, above subscribe */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <a
          href="https://ourconservativestore.com/product/anti-liberal-mug-liberal-tears-white-ceramic-mug/?sld=95"
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:opacity-80 transition-opacity"
        >
          <img
            src="https://ourconservativestore.com/wp-content/uploads/2024/08/2828935763882788651_2048-300x300.jpeg"
            alt="Anti Liberal Mug - Liberal Tears"
            className="w-full h-auto rounded"
          />
        </a>
        <p className="text-sm text-gray-600 mt-2 text-center">
          Get your "Liberal Tears" mug at
          <br />
          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B22234] hover:underline font-medium"
          >
            Our Conservative Store
          </a>
        </p>
      </div>
      {/* Newsletter Subscription - UNCHANGED */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Subscribe to Our Newsletter</h3>
        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-2 border rounded"
            required
            disabled={isSubscribing}
          />
          <button
            type="submit"
            className="bg-[#B22234] text-white p-2 rounded disabled:opacity-50"
            disabled={isSubscribing}
          >
            {isSubscribing ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
      {/* Shop Section */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Shop</h3>
        <a
          href="https://ourconservativestore.com/?sld=95"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-[#B22234] text-white p-2 rounded mb-2 hover:bg-[#8B1A1A]"
        >
          <img src="/images/core/store-icon.png" alt="Store" className="w-6 h-6 mr-2" /> Our Conservative Store
        </a>
      </div>
      {/* Stop TDS Section */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <a href="https://StopTDS.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/core/stoptdslogo1.png" alt="Stop TDS" className="w-full h-auto rounded" />
        </a>
        <p className="text-sm text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
      </div>
      {/* Connect Section - FIXED */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Connect</h3>
        <div className="flex justify-between">
          <button
            onClick={() => handleExternalLink("https://www.facebook.com/RedWhiteandTrueNews/", "Facebook")}
            className="cursor-pointer"
          >
            <img src="/images/core/facebook-icon-square.png" alt="Facebook" className="w-12 h-12" />
          </button>
          <button onClick={() => handleExternalLink("https://x.com/RWTNews", "X")} className="cursor-pointer">
            <img src="/images/core/x-icon-square.png" alt="X" className="w-12 h-12" />
          </button>
          <button
            onClick={() => handleExternalLink("https://www.youtube.com/@RWTNews", "YouTube")}
            className="cursor-pointer"
          >
            <img src="/images/core/youtube-icon-square.png" alt="YouTube" className="w-12 h-12" />
          </button>
          <Link href="/contact">
            <img src="/images/core/email-icon.png" alt="Email" className="w-12 h-12 cursor-pointer hover:opacity-80" />
          </Link>
        </div>
      </div>
      {/* About Section */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">About RWTNews</h3>
        <Link href="/about" className="text-[#B22234] text-sm">
          Learn More About Red, White and True News
        </Link>
      </div>
      {/* Support Section */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Support Our Mission</h3>
        <h4 className="text-md text-[#3C3B6E] mb-2">Our Mission</h4>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
        <Link href="/support" className="text-[#B22234] text-sm">
          See More
        </Link>
        <a
          href="https://www.gofundme.com/f/support-red-white-and-true-news-mission"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#B22234] text-white p-2 rounded mt-2 hover:bg-[#8B1A2B] text-center"
        >
          Donate
        </a>
      </div>
      {/* Ad Slot 3 - Very bottom */}
      <div className="bg-gray-100 p-4 rounded mb-4">
        <a
          href="https://ourconservativestore.com/?sld=95"
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="origin"
          className="block hover:opacity-80 transition-opacity"
        >
          <img
            src="https://ourconservativestore.com/wp-content/uploads/2024/07/Medium-Rectangle-300x250-product-highlights-maga.png"
            alt="Our Conservative Store - Product Highlights"
            className="w-full h-auto rounded"
          />
        </a>
        <p className="text-sm text-gray-600 mt-2 text-center">
          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#B22234] hover:underline font-medium"
          >
            Visit Our Conservative Store
          </a>
        </p>
      </div>
    </aside>
  )
}
