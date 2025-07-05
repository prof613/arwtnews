"use client"

import { useState } from "react"
import axios from "axios"
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, FacebookIcon, LinkedinIcon } from "react-share"
import { X, Mail, Loader2 } from "lucide-react"

export default function ShareButtons({ shareUrl, title, summary = "" }) {
  const url = shareUrl || (typeof window !== "undefined" ? window.location.href : "")
  const [emailState, setEmailState] = useState({
    isSending: false,
    message: "",
  })

  const handleEmailShare = async () => {
    const recipientEmail = window.prompt("Please enter the recipient's email address:")
    if (!recipientEmail) return

    if (!/\S+@\S+\.\S+/.test(recipientEmail)) {
      window.alert("Please enter a valid email address.")
      return
    }

    // Ask for the sender's name
    const senderName = window.prompt("Please enter your name (optional):")

    setEmailState({ isSending: true, message: "Sending..." })

    try {
      await axios.post("/api/share-via-email", {
        to: recipientEmail,
        from: "webcontact@redwhiteandtruenews.com", // Your verified sender email
        subject: `Check out this article: ${title}`,
        url: url,
        title: title,
        senderName: senderName, // Pass the sender's name to the API
      })
      setEmailState({ isSending: false, message: "Email Sent!" })
    } catch (error) {
      console.error("Failed to send email:", error)
      setEmailState({ isSending: false, message: "Failed to send." })
    }

    setTimeout(() => setEmailState({ isSending: false, message: "" }), 4000)
  }

  return (
    <div className="my-4 p-4 border-t border-b border-gray-200">
      <h4 className="text-lg font-semibold text-gray-800 mb-3 text-center">Share This</h4>
      <div className="flex justify-center items-center gap-4">
        <FacebookShareButton url={url} quote={title}>
          <FacebookIcon size={40} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <X className="text-white" size={22} />
          </div>
        </TwitterShareButton>

        <LinkedinShareButton url={url} title={title} summary={summary}>
          <LinkedinIcon size={40} round />
        </LinkedinShareButton>

        <div className="relative">
          <button
            onClick={handleEmailShare}
            disabled={emailState.isSending}
            className="w-10 h-10 rounded-full bg-[#777] flex items-center justify-center cursor-pointer hover:bg-[#555] disabled:cursor-not-allowed"
            aria-label="Share by email"
          >
            {emailState.isSending ? (
              <Loader2 className="text-white animate-spin" size={22} />
            ) : (
              <Mail className="text-white" size={22} />
            )}
          </button>
          {emailState.message && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 text-xs bg-gray-800 text-white px-2 py-1 rounded">
              {emailState.message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
