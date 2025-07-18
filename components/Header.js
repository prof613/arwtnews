"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axios from "axios"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const [categories, setCategories] = useState([])
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }
  // Modified toggle functions to close the other menu
  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen)
    setIsAboutOpen(false) // Close About menu when Categories is toggled
  }
  const toggleAbout = () => {
    setIsAboutOpen(!isAboutOpen)
    setIsCategoriesOpen(false) // Close Categories menu when About is toggled
  }

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?filters[publishedAt][$notNull]=true&_=${Date.now()}`,
        )
        setCategories(res.data.data)
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Close all menus on route change
  useEffect(() => {
    const handleRouteChange = () => {
      setIsMenuOpen(false)
      setIsCategoriesOpen(false)
      setIsAboutOpen(false)
    }

    // Listen for both complete and start of route changes to handle shallow routing
    router.events.on("routeChangeStart", handleRouteChange)
    router.events.on("routeChangeComplete", handleRouteChange)

    // Cleanup listeners on unmount
    return () => {
      router.events.off("routeChangeStart", handleRouteChange)
      router.events.off("routeChangeComplete", handleRouteChange)
    }
  }, [router.events])

  return (
    <header className="bg-[#3C3B6E] text-white sticky top-0 z-50 shadow-md max-w-7xl mx-auto">
      <div className="flex justify-end items-center h-16">
        <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2">
          <button onClick={toggleMenu} className="flex flex-col space-y-1">
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        <nav className="hidden md:flex w-4/5 justify-start items-center h-full space-x-0">
          <Link
            href="/"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            HOME
          </Link>

          <Link
            href="/support"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            OUR MISSION
          </Link>

          {/* Community Button - Updated */}
          <a
            href="https://www.facebook.com/groups/208502877036930"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            COMMUNITY
          </a>

          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            STORE
          </a>

          <div className="relative flex-1 h-full group">
            <button
              onClick={() => {
                toggleCategories()
                setIsMenuOpen(false) // Ensure mobile menu closes if open
              }}
              className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
            >
              CATEGORIES
            </button>
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isCategoriesOpen ? "block" : "hidden"}`}
            >
              <Link
                href="/categories/All"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsCategoriesOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.attributes.name}`}
                  className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  {category.attributes.name}
                </Link>
              ))}
              <Link
                href="/opinions"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsCategoriesOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Opinion
              </Link>
              <Link
                href="/categories/Meme-Cartoons"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsCategoriesOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Memes & Cartoons
              </Link>
              <Link
                href="/categories/news-from-web"
                className="block px-4 py-3 hover:bg-[#B22234]"
                onClick={() => {
                  setIsCategoriesOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                News from the Web
              </Link>
            </div>
          </div>

          <div className="relative flex-1 h-full group">
            <button
              onClick={() => {
                toggleAbout()
                setIsMenuOpen(false) // Ensure mobile menu closes if open
              }}
              className="w-full h-full flex items-center justify-center text-lg font-medium hover:bg-[#B22234] transition-colors duration-200"
            >
              ABOUT
            </button>
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isAboutOpen ? "block" : "hidden"}`}
            >
              <Link
                href="/about"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsAboutOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                About
              </Link>
              <Link
                href="/support"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsAboutOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Our Mission
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsAboutOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Contact
              </Link>
              <Link
                href="/terms"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                onClick={() => {
                  setIsAboutOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Terms of Use
              </Link>
              <Link
                href="/privacy"
                className="block px-4 py-3 hover:bg-[#B22234]"
                onClick={() => {
                  setIsAboutOpen(false)
                  setIsMenuOpen(false)
                }}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </nav>

        <nav
          className={`md:hidden absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg ${isMenuOpen ? "block" : "hidden"}`}
        >
          <Link
            href="/"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
            onClick={() => {
              setIsMenuOpen(false)
            }}
          >
            HOME
          </Link>

          <Link
            href="/support"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
            onClick={() => {
              setIsMenuOpen(false)
            }}
          >
            OUR MISSION
          </Link>

          {/* Community Button (Mobile) - Updated */}
          <a
            href="https://www.facebook.com/groups/208502877036930"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
            onClick={() => {
              setIsMenuOpen(false)
            }}
          >
            COMMUNITY
          </a>

          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
            onClick={() => {
              setIsMenuOpen(false)
            }}
          >
            STORE
          </a>

          <div className="border-b border-white/20">
            <button
              onClick={() => {
                toggleCategories()
                setIsMenuOpen(true) // Keep mobile menu open to show submenu
              }}
              className="w-full text-left px-6 py-4 hover:bg-[#B22234]"
            >
              CATEGORIES
            </button>
            {isCategoriesOpen && (
              <div className="bg-[#2A2952] pl-4">
                <Link
                  href="/categories/All"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  All Articles
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.attributes.name}`}
                    className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    {category.attributes.name}
                  </Link>
                ))}
                <Link
                  href="/opinions"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Opinion
                </Link>
                <Link
                  href="/categories/Meme-Cartoons"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Memes & Cartoons
                </Link>
                <Link
                  href="/categories/news-from-web"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  News from the Web
                </Link>
              </div>
            )}
          </div>

          <div className="border-b border-white/20">
            <button
              onClick={() => {
                toggleAbout()
                setIsMenuOpen(true) // Keep mobile menu open to show submenu
              }}
              className="w-full text-left px-6 py-4 hover:bg-[#B22234]"
            >
              ABOUT
            </button>
            {isAboutOpen && (
              <div className="bg-[#2A2952] pl-4">
                <Link
                  href="/about"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  About
                </Link>
                <Link
                  href="/support"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Our Mission
                </Link>
                <Link
                  href="/contact"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Contact
                </Link>
                <Link
                  href="/terms"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy"
                  className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}
