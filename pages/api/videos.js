// Server-side API endpoint to fetch videos
import axios from "axios"
import sgMail from "@sendgrid/mail"

// Channel configuration with individual API keys
const channelConfig = [
  {
    id: "UCXIJgqnII2ZOINSWNOGFThA",
    name: "Fox News",
    apiKey: process.env.YOUTUBE_API_KEY_FOX,
  },
  {
    id: "UCx6h-dWzJ5NpAlja1YsApdg",
    name: "Newsmax",
    apiKey: process.env.YOUTUBE_API_KEY_NEWSMAX,
  },
  {
    id: "UCHqC-yWZ1kri4YzwRSt6RGQ",
    name: "RSBN",
    apiKey: process.env.YOUTUBE_API_KEY_RSBN,
  },
  {
    id: "UCIveFvW-ARp_B_RckhweNJw",
    name: "Steven Crowder",
    apiKey: process.env.YOUTUBE_API_KEY_JUSTTHENEWS,
  },
  {
    id: "UCnQC_G5Xsjhp9fEJKuIcrSw",
    name: "Daily Wire",
    apiKey: process.env.YOUTUBE_API_KEY_DAILYWIRE,
  },
  {
    id: "UCNbIDJNNgaRrXOD7VllIMRQ",
    name: "OAN",
    apiKey: process.env.YOUTUBE_API_KEY_OAN,
  },
]

// In-memory cache for server
const videoCache = {
  data: null,
  timestamp: null,
  failures: {},
}

const CACHE_DURATION = 2 * 60 * 60 * 1000 // 2 hours

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// Send email alert via SendGrid
const sendAlert = async (subject, message) => {
  // DISABLE ALERTS IN DEVELOPMENT MODE
  if (process.env.NODE_ENV === "development") {
    console.log("🚫 Alert skipped (development mode):", subject)
    return
  }

  try {
    const msg = {
      to: "webcontact@redwhiteandtruenews.com",
      from: "webcontact@redwhiteandtruenews.com",
      subject: subject,
      text: message,
    }
    await sgMail.send(msg)
  } catch (error) {
    // Silently catch email sending errors
  }
}

// Fetch videos from all channels
const fetchAllVideos = async () => {
  const results = []
  const failures = []

  // Fetch from each channel individually
  const fetchPromises = channelConfig.map(async (channel) => {
    try {
      if (!channel.apiKey) {
        throw new Error("API key missing")
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search?key=${channel.apiKey}&channelId=${channel.id}&part=snippet&order=date&maxResults=1&type=video`,
      )

      if (response.data.items && response.data.items.length > 0) {
        const video = response.data.items[0]
        return {
          ...video,
          channelName: channel.name,
          success: true,
        }
      }
      return null
    } catch (error) {
      failures.push({
        channel: channel.name,
        error: error.message,
        timestamp: new Date().toISOString(),
      })

      // Track consecutive failures
      videoCache.failures[channel.name] = (videoCache.failures[channel.name] || 0) + 1

      return null
    }
  })

  const videoResults = await Promise.all(fetchPromises)
  const successfulVideos = videoResults.filter((video) => video !== null)

  // Alert logic
  if (failures.length >= 3) {
    await sendAlert(
      "Multiple Channel Failures",
      `${failures.length} channels are currently failing: ${failures.map((f) => f.channel).join(", ")}`,
    )
  }

  // Reset failure count for successful channels
  successfulVideos.forEach((video) => {
    if (video.channelName) {
      videoCache.failures[video.channelName] = 0
    }
  })

  return successfulVideos
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  try {
    const now = Date.now()

    // Check if cache is still valid
    if (videoCache.data && videoCache.timestamp && now - videoCache.timestamp < CACHE_DURATION) {
      return res.status(200).json({ videos: videoCache.data, cached: true })
    }

    const freshVideos = await fetchAllVideos()

    // Update cache
    videoCache.data = freshVideos
    videoCache.timestamp = now

    res.status(200).json({ videos: freshVideos, cached: false })
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch videos", error: error.message })
  }
}