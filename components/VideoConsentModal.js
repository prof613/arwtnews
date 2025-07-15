"use client"

import { useState } from "react"

export default function VideoConsentModal({ isOpen, onClose, onAccept }) {
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const [youtubeChecked, setYoutubeChecked] = useState(false)

  const handleAccept = () => {
    if (privacyChecked && youtubeChecked) {
      onAccept()
    }
  }

  const canAccept = privacyChecked && youtubeChecked

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#3C3B6E] mb-2">Video Content Agreement</h2>
          <p className="text-gray-600">
            Before accessing our video content, please review and agree to the following terms:
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Privacy Policy Agreement */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="privacy-checkbox"
                checked={privacyChecked}
                onChange={(e) => setPrivacyChecked(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#B22234] focus:ring-[#B22234] border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="privacy-checkbox" className="text-sm font-medium text-gray-900 cursor-pointer">
                  I agree to the Privacy Policy
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  I have read and agree to Red, White and True News'{" "}
                  <a
                    href="/privacy"
                    target="_blank"
                    className="text-[#B22234] hover:underline font-medium"
                    rel="noreferrer"
                  >
                    Privacy Policy
                  </a>
                  , which explains how we collect, use, and protect your information when using our video features.
                </p>
              </div>
            </div>
          </div>

          {/* YouTube Terms Agreement */}
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="youtube-checkbox"
                checked={youtubeChecked}
                onChange={(e) => setYoutubeChecked(e.target.checked)}
                className="mt-1 h-4 w-4 text-[#B22234] focus:ring-[#B22234] border-gray-300 rounded"
              />
              <div className="flex-1">
                <label htmlFor="youtube-checkbox" className="text-sm font-medium text-gray-900 cursor-pointer">
                  I acknowledge YouTube's Terms of Service
                </label>
                <p className="text-sm text-gray-600 mt-1">
                  By using our video features, I agree to be bound by{" "}
                  <a
                    href="https://www.youtube.com/t/terms"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B22234] hover:underline font-medium"
                  >
                    YouTube's Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="http://www.google.com/policies/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B22234] hover:underline font-medium"
                  >
                    Google's Privacy Policy
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">About Our Video Service</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Our video content is powered by YouTube API Services</li>
              <li>• Videos are embedded from official news channel sources</li>
              <li>• Your viewing activity may be subject to YouTube's data collection policies</li>
              <li>
                • You can revoke data access permissions at{" "}
                <a
                  href="https://security.google.com/settings/security/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B22234] hover:underline"
                >
                  Google Security Settings
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAccept}
            disabled={!canAccept}
            className={`px-6 py-2 rounded font-medium transition-colors ${
              canAccept ? "bg-[#B22234] text-white hover:bg-red-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Accept & Continue
          </button>
        </div>
      </div>
    </div>
  )
}
