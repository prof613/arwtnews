"use client"

import Link from "next/link"
import { useState } from "react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen)
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen)

  return (
    <header className="bg-[#3C3B6E] text-white sticky top-0 z-50 shadow-md max-w-7xl mx-auto">
      <div className="flex justify-end items-center h-16">
        {/* Mobile menu toggle */}
        <div className="md:hidden absolute left-4 top-1/2 transform -translate-y-1/2">
          <button onClick={toggleMenu} className="flex flex-col space-y-1">
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
            <span className="w-6 h-0.5 bg-white"></span>
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex w-4/5 justify-between items-center h-full">
          <Link
            href="/"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            HOME
          </Link>

          <div className="relative flex-1 h-full group">
            <button
              onClick={toggleCategories}
              className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
            >
              CATEGORIES
            </button>
            {/* Categories Dropdown */}
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isCategoriesOpen ? "block" : "hidden"} group-hover:block`}
            >
              <Link href="/categories/All" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                All Articles
              </Link>
              <Link href="/categories/Politics" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                Politics
              </Link>
              <Link href="/categories/Economy" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                Economy
              </Link>
              <Link href="/categories/US News" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                US News
              </Link>
              <Link
                href="/categories/World News"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
              >
                World News
              </Link>
              <Link href="/opinions" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                Opinion
              </Link>
              <Link
                href="/categories/Meme-Cartoons"
                className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
              >
                Memes & Cartoons
              </Link>
              <Link href="/categories/news-from-web" className="block px-4 py-3 hover:bg-[#B22234]">
                News from the Web
              </Link>
            </div>
          </div>

          <div className="relative flex-1 h-full group">
            <button
              onClick={toggleAbout}
              className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
            >
              ABOUT
            </button>
            {/* About Dropdown */}
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isAboutOpen ? "block" : "hidden"} group-hover:block`}
            >
              <Link href="/about" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                About
              </Link>
              <Link href="/support" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                Our Mission
              </Link>
              <Link href="/terms" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10">
                Terms of Use
              </Link>
              <Link href="/privacy" className="block px-4 py-3 hover:bg-[#B22234]">
                Privacy Policy
              </Link>
            </div>
          </div>

          <Link
            href="/support"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            OUR MISSION
          </Link>

          <a
            href="https://redwhiteandtruegear.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
          >
            STORE
          </a>

          <Link
            href="#"
            className="flex-1 h-full flex items-center justify-center text-lg font-medium hover:bg-[#B22234] transition-colors duration-200 opacity-75"
          >
            COMMUNITY
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <nav
          className={`md:hidden absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg ${isMenuOpen ? "block" : "hidden"}`}
        >
          <Link href="/" className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20">
            HOME
          </Link>

          <div className="border-b border-white/20">
            <button onClick={toggleCategories} className="w-full text-left px-6 py-4 hover:bg-[#B22234]">
              CATEGORIES
            </button>
            {isCategoriesOpen && (
              <div className="bg-[#2A2952] pl-4">
                <Link href="/categories/All" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  All Articles
                </Link>
                <Link href="/categories/Politics" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Politics
                </Link>
                <Link href="/categories/Economy" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Economy
                </Link>
                <Link href="/categories/US News" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  US News
                </Link>
                <Link href="/categories/World News" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  World News
                </Link>
                <Link href="/opinions" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Opinion
                </Link>
                <Link href="/categories/Meme-Cartoons" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Memes & Cartoons
                </Link>
                <Link href="/categories/news-from-web" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  News from the Web
                </Link>
              </div>
            )}
          </div>

          <div className="border-b border-white/20">
            <button onClick={toggleAbout} className="w-full text-left px-6 py-4 hover:bg-[#B22234]">
              ABOUT
            </button>
            {isAboutOpen && (
              <div className="bg-[#2A2952] pl-4">
                <Link href="/about" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  About
                </Link>
                <Link href="/support" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Our Mission
                </Link>
                <Link href="/terms" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Terms of Use
                </Link>
                <Link href="/privacy" className="block px-6 py-3 hover:bg-[#B22234] text-sm">
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>

          <Link href="/support" className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20">
            OUR MISSION
          </Link>
          <a
            href="https://redwhiteandtruegear.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
          >
            STORE
          </a>
          <Link href="#" className="block px-6 py-4 hover:bg-[#B22234] opacity-75">
            COMMUNITY
          </Link>
        </nav>
      </div>
    </header>
  )
}
