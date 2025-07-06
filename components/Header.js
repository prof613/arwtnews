"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleCategories = () => setIsCategoriesOpen(!isCategoriesOpen);
  const toggleAbout = () => setIsAboutOpen(!isAboutOpen);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/categories?filters[publishedAt][$notNull]=true&_=${Date.now()}`
        );
        setCategories(res.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    fetchCategories();
  }, []);

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

          <div 
            className="flex-1 h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-gray-500 cursor-not-allowed opacity-50 relative group"
            title="Coming Soon"
          >
            <span>COMMUNITY</span>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Coming Soon
            </div>
          </div>

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
              onClick={toggleCategories}
              className="w-full h-full flex items-center justify-center text-lg font-medium border-r border-white/20 hover:bg-[#B22234] transition-colors duration-200"
            >
              CATEGORIES
            </button>
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isCategoriesOpen ? "block" : "hidden"} group-hover:block`}
            >
              <Link href="/categories/All" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsCategoriesOpen(false)}>
                All Articles
              </Link>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.attributes.name}`}
                  className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10"
                  onClick={() => setIsCategoriesOpen(false)}
                >
                  {category.attributes.name}
                </Link>
              ))}
              <Link href="/opinions" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsCategoriesOpen(false)}>
                Opinion
              </Link>
              <Link href="/categories/Meme-Cartoons" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsCategoriesOpen(false)}>
                Memes & Cartoons
              </Link>
              <Link href="/categories/news-from-web" className="block px-4 py-3 hover:bg-[#B22234" onClick={() => setIsCategoriesOpen(false)}>
                News from the Web
              </Link>
            </div>
          </div>

          <div className="relative flex-1 h-full group">
            <button
              onClick={toggleAbout}
              className="w-full h-full flex items-center justify-center text-lg font-medium hover:bg-[#B22234] transition-colors duration-200"
            >
              ABOUT
            </button>
            <div
              className={`absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg z-20 ${isAboutOpen ? "block" : "hidden"} group-hover:block`}
            >
              <Link href="/about" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsAboutOpen(false)}>
                About
              </Link>
              <Link href="/support" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsAboutOpen(false)}>
                Our Mission
              </Link>
              <Link href="/contact" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsAboutOpen(false)}>
                Contact
              </Link>
              <Link href="/terms" className="block px-4 py-3 hover:bg-[#B22234] border-b border-white/10" onClick={() => setIsAboutOpen(false)}>
                Terms of Use
              </Link>
              <Link href="/privacy" className="block px-4 py-3 hover:bg-[#B22234" onClick={() => setIsAboutOpen(false)}>
                Privacy Policy
              </Link>
            </div>
          </div>
        </nav>

        <nav
          className={`md:hidden absolute top-full left-0 w-full bg-[#3C3B6E] shadow-lg ${isMenuOpen ? "block" : "hidden"}`}
        >
          <Link href="/" className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20">
            HOME
          </Link>

          <Link
            href="/support"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
          >
            OUR MISSION
          </Link>

          <div 
            className="block px-6 py-4 hover:bg-gray-500 border-b border-white/20 cursor-not-allowed opacity-50 relative group"
            title="Coming Soon"
          >
            <span>COMMUNITY</span>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 px-2 py-1 bg-black text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
              Coming Soon
            </div>
          </div>

          <a
            href="https://ourconservativestore.com/?sld=95"
            target="_blank"
            rel="noopener noreferrer"
            className="block px-6 py-4 hover:bg-[#B22234] border-b border-white/20"
          >
            STORE
          </a>

          <div className="border-b border-white/20">
            <button onClick={toggleCategories} className="w-full text-left px-6 py-4 hover:bg-[#B22234]">
              CATEGORIES
            </button>
            {isCategoriesOpen && (
              <div className="bg-[#2A2952] pl-4">
                <Link href="/categories/All" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsCategoriesOpen(false)}>
                  All Articles
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.attributes.name}`}
                    className="block px-6 py-3 hover:bg-[#B22234] text-sm"
                    onClick={() => setIsCategoriesOpen(false)}
                  >
                    {category.attributes.name}
                  </Link>
                ))}
                <Link href="/opinions" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsCategoriesOpen(false)}>
                  Opinion
                </Link>
                <Link href="/categories/Meme-Cartoons" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsCategoriesOpen(false)}>
                  Memes & Cartoons
                </Link>
                <Link href="/categories/news-from-web" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsCategoriesOpen(false)}>
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
                <Link href="/about" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsAboutOpen(false)}>
                  About
                </Link>
                <Link href="/support" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsAboutOpen(false)}>
                  Our Mission
                </Link>
                <Link href="/contact" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsAboutOpen(false)}>
                  Contact
                </Link>
                <Link href="/terms" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsAboutOpen(false)}>
                  Terms of Use
                </Link>
                <Link href="/privacy" className="block px-6 py-3 hover:bg-[#B22234] text-sm" onClick={() => setIsAboutOpen(false)}>
                  Privacy Policy
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}