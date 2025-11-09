"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/router"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
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

  const categories = [
    "US News",
    "World News",
    "Politics",
    "In the Courts",
    "Immigration",
    "Economy",
    "Science and Technology",
    "Health",
  ]

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
    <div className="sticky top-0 z-50">
      <div className="hidden lg:flex bg-[#002868] text-white h-12 items-center justify-center">
        <div className="flex h-full w-full max-w-7xl">
          <Link
            href="/"
            className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            HOME
          </Link>
          <Link
            href="/ourmission"
            className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            OUR MISSION
          </Link>
          <Link
            href="/community"
            className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            COMMUNITY
          </Link>
          <Link
            href="https://rwtnews.myspreadshop.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            STORE
          </Link>
          <Link
            href="/support"
            className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            SUPPORT
          </Link>
          <div className="relative w-full h-full border-r border-white/20">
            <button
              onClick={() => {
                toggleCategories()
                setIsMenuOpen(false)
              }}
              className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
            >
              CATEGORIES
            </button>
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#002868] shadow-lg z-50">
                <Link
                  href="/categories/All"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  All Articles
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/categories/${category}`}
                    className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    {category}
                  </Link>
                ))}
                <Link
                  href="/categories/Opinion"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Opinion
                </Link>
                <Link
                  href="/categories/news-from-web"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  News from the Web
                </Link>
                <Link
                  href="/categories/Meme-Cartoons"
                  className="block px-6 py-3 hover:bg-[#B22234]"
                  onClick={() => {
                    setIsCategoriesOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Memes & Cartoons
                </Link>
              </div>
            )}
          </div>
          <div className="relative w-full h-full">
            <button
              onClick={() => {
                toggleAbout()
                setIsMenuOpen(false)
              }}
              className="w-full h-full flex items-center justify-center text-lg font-medium hover:bg-[#B22234] transition-colors duration-200"
            >
              ABOUT
            </button>
            {isAboutOpen && (
              <div className="absolute top-full left-0 w-64 bg-[#002868] shadow-lg z-50">
                <Link
                  href="/about"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  About
                </Link>
                <Link
                  href="/ourmission"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Our Mission
                </Link>
                <Link
                  href="/contact"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Contact
                </Link>
                <Link
                  href="/terms"
                  className="block px-6 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => {
                    setIsAboutOpen(false)
                    setIsMenuOpen(false)
                  }}
                >
                  Terms of Use
                </Link>
                <Link
                  href="/privacy"
                  className="block px-6 py-3 hover:bg-[#B22234]"
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
        </div>
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden bg-[#002868] text-white">
        <div className="flex items-center justify-start px-6 py-4">
          <button onClick={toggleMenu} className="flex flex-col space-y-1">
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>
        {isMenuOpen && (
          <div className="bg-[#001a4d] max-h-[calc(100vh-56px)] overflow-y-auto">
            <Link
              href="/"
              className="block px-6 py-4 hover:bg-[#B22234] border-t border-white/10"
              onClick={() => {
                setIsMenuOpen(false)
              }}
            >
              HOME
            </Link>
            <Link
              href="/ourmission"
              className="block px-6 py-4 hover:bg-[#B22234] border-t border-white/10"
              onClick={() => {
                setIsMenuOpen(false)
              }}
            >
              OUR MISSION
            </Link>
            <Link
              href="/community"
              className="block px-6 py-4 hover:bg-[#B22234] border-t border-white/10"
              onClick={() => {
                setIsMenuOpen(false)
              }}
            >
              COMMUNITY
            </Link>
            <Link
              href="https://rwtnews.myspreadshop.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-6 py-4 hover:bg-[#B22234] border-t border-white/10"
              onClick={() => {
                setIsMenuOpen(false)
              }}
            >
              STORE
            </Link>
            <Link
              href="/support"
              className="block px-6 py-4 hover:bg-[#B22234] border-t border-white/10"
              onClick={() => {
                setIsMenuOpen(false)
              }}
            >
              SUPPORT
            </Link>
            <div className="border-t border-white/10">
              <button
                onClick={() => {
                  toggleCategories()
                  setIsMenuOpen(true)
                }}
                className="w-full text-left px-6 py-4 hover:bg-[#B22234]"
              >
                CATEGORIES
              </button>
              {isCategoriesOpen && (
                <div className="bg-[#001a4d] pl-4">
                  <Link
                    href="/categories/All"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    All Articles
                  </Link>
                  {categories.map((category) => (
                    <Link
                      key={category}
                      href={`/categories/${category}`}
                      className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                      onClick={() => {
                        setIsCategoriesOpen(false)
                        setIsMenuOpen(false)
                      }}
                    >
                      {category}
                    </Link>
                  ))}
                  <Link
                    href="/categories/Opinion"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Opinion
                  </Link>
                  <Link
                    href="/categories/news-from-web"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    News from the Web
                  </Link>
                  <Link
                    href="/categories/Meme-Cartoons"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsCategoriesOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Memes & Cartoons
                  </Link>
                </div>
              )}
            </div>
            <div className="border-t border-white/10">
              <button
                onClick={() => {
                  toggleAbout()
                  setIsMenuOpen(true)
                }}
                className="w-full text-left px-6 py-4 hover:bg-[#B22234]"
              >
                ABOUT
              </button>
              {isAboutOpen && (
                <div className="bg-[#001a4d] pl-4">
                  <Link
                    href="/about"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    About
                  </Link>
                  <Link
                    href="/ourmission"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Our Mission
                  </Link>
                  <Link
                    href="/contact"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Contact
                  </Link>
                  <Link
                    href="/terms"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
                    onClick={() => {
                      setIsAboutOpen(false)
                      setIsMenuOpen(false)
                    }}
                  >
                    Terms of Use
                  </Link>
                  <Link
                    href="/privacy"
                    className="block px-6 py-3 hover:bg-[#B22234] border-t border-white/10"
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
          </div>
        )}
      </div>
    </div>
  )
}
