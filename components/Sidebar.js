"use client"

// File: Sidebar.js
// Folder: /rwtnews/components

import Link from "next/link"
import { useState, useEffect } from "react"
import axios from "axios"

export default function Sidebar() {
  const [memes, setMemes] = useState([])
  const [opinions, setOpinions] = useState([])
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function fetchSidebarContent() {
      try {
        const [memeRes, opinionRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/memes?pagination[limit]=2&populate=*&sort[0]=date:desc`),
          axios.get(
            `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/opinions?pagination[page]=1&pagination[pageSize]=2&populate=*&sort[0]=date:desc`,
          ),
        ])

        // Memes are already sorted by the API call
        setMemes(memeRes.data.data)

        // Sort opinions by date (newest first)
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
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/subscriptions`, {
        data: { email, createdAt: new Date().toISOString() },
      })
      alert("Subscribed successfully!")
      setEmail("")
    } catch (error) {
      console.error("Error subscribing:", error)
      alert("Failed to subscribe.")
    }
  }

  return (
    <aside className="w-full md:w-1/4 order-2 md:order-none">
      <div className="bg-gray-100 p-4 rounded mb-4">
        <form className="flex flex-col gap-2">
          <input type="text" placeholder="Search articles, authors..." className="p-2 border rounded" />
          <button type="submit" className="bg-[#B22234] text-white p-2 rounded">
            Search
          </button>
        </form>
      </div>
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
                  src={
                    meme.attributes.image_path
                      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${meme.attributes.image_path}`
                      : meme.attributes.image?.data?.attributes?.url
                        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${meme.attributes.image.data.attributes.url}`
                        : "/images/core/placeholder.jpg"
                  }
                  alt="Meme"
                  className="w-full h-auto rounded"
                />
              </div>
            </Link>
          </div>
        ))}
      </div>
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
              {(opinion.attributes.image_path || opinion.attributes.featured_image?.data?.attributes?.url) && (
                <div
                  className="w-full bg-gray-200 rounded mb-2 flex items-center justify-center"
                  style={{ minHeight: "120px" }}
                >
                  <img
                    src={
  opinion.attributes.image_path
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.attributes.image_path}`
    : opinion.attributes.featured_image?.data?.attributes?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${opinion.attributes.featured_image.data.attributes.url}`
      : "/images/core/placeholder.jpg"
}
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
<p className="text-sm text-gray-500 line-clamp-5">
  {(() => {
    // Generate excerpt from rich_body content for opinions
    if (typeof opinion.attributes.rich_body === 'string') {
      const cleanText = opinion.attributes.rich_body.replace(/<[^>]*>/g, '');
      const lines = cleanText.split('\n').filter(line => line.trim().length > 0);
      return lines.slice(0, 5).join(' ').substring(0, 100);
    }
    return '';
  })()}...{" "}
  <span className="text-[#B22234] cursor-pointer hover:underline">see more</span>
</p>
            </Link>
          </div>
        ))}
      </div>
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
          />
          <button type="submit" className="bg-[#B22234] text-white p-2 rounded">
            Subscribe
          </button>
        </form>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Shop</h3>
        <a
          href="https://redwhiteandtruegear.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center bg-[#B22234] text-white p-2 rounded mb-2 hover:bg-[#8B1A1A]"
        >
          <img src="/images/core/store-icon.png" alt="Store" className="w-6 h-6 mr-2" /> Get RWT Gear
        </a>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <a href="https://StopTDS.com" target="_blank" rel="noopener noreferrer">
          <img src="/images/core/stoptdslogo1.png" alt="Stop TDS" className="w-full h-auto rounded" />
        </a>
        <p className="text-sm text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua.
        </p>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Connect</h3>
        <div className="flex justify-between">
          <a
            href="https://www.facebook.com/RedWhiteandTrueNews/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (confirm("You're leaving to visit Facebook. Continue?")) window.open(e.target.href, "_blank")
            }}
          >
            <img src="/images/core/facebook-icon-square.png" alt="Facebook" className="w-12 h-12" />
          </a>
          <a
            href="https://x.com/RWTNews"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (confirm("You're leaving to visit X. Continue?")) window.open(e.target.href, "_blank")
            }}
          >
            <img src="/images/core/x-icon-square.png" alt="X" className="w-12 h-12" />
          </a>
          <a
            href="https://www.youtube.com/@RWTNews"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (confirm("You're leaving to visit YouTube. Continue?")) window.open(e.target.href, "_blank")
            }}
          >
            <img src="/images/core/youtube-icon-square.png" alt="YouTube" className="w-12 h-12" />
          </a>
          <a
            href="mailto:webpagecontact@redwhiteandtruenews.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault()
              if (confirm("You're opening an email form. Continue?")) window.location.href = e.target.href
            }}
          >
            <img src="/images/core/email-icon.png" alt="Email" className="w-12 h-12" />
          </a>
        </div>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">About RWTNews</h3>
        <Link href="/about" className="text-[#B22234] text-sm">
          Learn More About Red, White and True News
        </Link>
      </div>
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h3 className="text-lg font-bold text-[#3C3B6E] mb-2">Support Our Mission</h3>
        <h4 className="text-md text-[#3C3B6E] mb-2">Our Mission</h4>
        <p className="text-sm text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod...
        </p>
        <Link href="/support" className="text-[#B22234] text-sm">
          See More
        </Link>
        <a
          href="https://www.gofundme.com/f/support-red-white-and-true-news-mission"
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-[#B22234] text-white p-2 rounded mt-2 hover:bg-[#8B1A1A] text-center"
        >
          Donate
        </a>
      </div>
      <div className="bg-gray-100 p-4 rounded">
        <div id="ad-slot-1" className="mb-4"></div>
        <div id="ad-slot-2" className="mb-4"></div>
        <div id="ad-slot-3"></div>
      </div>
    </aside>
  )
}