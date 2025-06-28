"use client"

// File: Footer.js
// Folder: /rwtnews/components

import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-[#3C3B6E] text-white p-6 text-center max-w-7xl mx-auto">
      <div>
        <div className="mb-4">
          <h3 className="text-lg mb-2">Who We Are</h3>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <Link href="/about" className="text-[#B22234] text-sm">
            More
          </Link>
        </div>
        <div className="mb-4">
          <h3 className="text-lg mb-2">Our Mission</h3>
          <p className="text-sm">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et
            dolore magna aliqua.
          </p>
          <Link href="/support" className="text-[#B22234] text-sm">
            More
          </Link>
        </div>
        <div className="flex justify-center gap-4 mb-4">
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
            href="mailto:contact@rwtnews.com"
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
        <div className="text-sm">
          <Link href="/terms" className="text-[#B22234] mx-2">
            Terms of Use
          </Link>
          <Link href="/privacy" className="text-[#B22234] mx-2">
            Privacy Policy
          </Link>
        </div>
        <p className="text-sm mt-4">© 2025 Red, White and True News LLC</p>
      </div>
    </footer>
  )
}
