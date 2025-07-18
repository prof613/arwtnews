"use client"

import Link from "next/link"

export default function Footer() {
  const handleExternalLink = (url, siteName) => {
    if (confirm(`You're leaving to visit ${siteName}. Continue?`)) {
      window.open(url, "_blank")
    }
  }

  return (
    <footer className="bg-[#3C3B6E] text-white max-w-7xl mx-auto">
      {/* Main Footer Content */}
      <div className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - About & Mission */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-3 text-white">Who We Are</h3>
              <p className="text-sm leading-relaxed mb-3">
                Red, White and True News is the unyielding voice of conservative truth, delivering hard-hitting news and commentary that upholds the core of American values.
              </p>
              <Link href="/about" className="text-[#B22234] text-sm font-semibold hover:underline">
                Learn More →
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3 text-white">Our Mission</h3>
              <p className="text-sm leading-relaxed mb-3">
                Red, White and True News is dedicated to delivering honest, hard-hitting journalism that upholds traditional American values. 
              </p>
              <Link href="/support" className="text-[#B22234] text-sm font-semibold hover:underline">
                Support Us →
              </Link>
            </div>
          </div>

          {/* Center Column - Social & Contact - FIXED */}
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4 text-white">Connect With Us</h3>
            <div className="flex justify-center gap-4 mb-6">
              <button
                onClick={() => handleExternalLink("https://www.facebook.com/RedWhiteandTrueNews/", "Facebook")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img src="/images/core/facebook-icon-square.png" alt="Facebook" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handleExternalLink("https://x.com/RWTNews", "X")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img src="/images/core/x-icon-square.png" alt="X" className="w-12 h-12" />
              </button>
              <button
                onClick={() => handleExternalLink("https://www.youtube.com/@RWTNews", "YouTube")}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img src="/images/core/youtube-icon-square.png" alt="YouTube" className="w-12 h-12" />
              </button>
              <Link href="/contact" className="hover:opacity-80 transition-opacity">
                <img src="/images/core/email-icon.png" alt="Email" className="w-12 h-12" />
              </Link>
            </div>
            <p className="text-sm">
              <span className="font-semibold">Stay Connected</span>
              <br />
              Follow us for the latest news and updates
            </p>
          </div>

          {/* Right Column - Navigation & Info */}
          <div className="text-center md:text-right">
            <h3 className="text-xl font-bold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2 mb-6">
              <div>
                <Link href="/about" className="text-white hover:text-[#B22234] text-sm font-medium block">
                  About Us
                </Link>
              </div>
              <div>
                <Link href="/support" className="text-white hover:text-[#B22234] text-sm font-medium block">
                  Support Our Mission
                </Link>
              </div>
              <div>
                <Link href="/contact" className="text-white hover:text-[#B22234] text-sm font-medium block">
                  Contact
                </Link>
              </div>
              <div>
                <a
                  href="https://ourconservativestore.com/?sld=95"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#B22234] text-sm font-medium block"
                >
                  Shop Our Conservative Store
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Legal & Copyright */}
      <div className="border-t border-white/20 px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <Link href="/terms" className="text-[#B22234] text-sm font-medium hover:underline">
              Terms of Use
            </Link>
            <Link href="/privacy" className="text-[#B22234] text-sm font-medium hover:underline">
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm font-medium">© 2025 RWT News LLC</p>
        </div>
      </div>
    </footer>
  )
}
