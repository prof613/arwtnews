export const getStrapiMedia = (media) => {
  if (!media) {
    return "/placeholder.svg" // Or some other default
  }

  const { url } = media?.data?.attributes || media || {}

  // Verify that the URL exists.
  if (!url) {
    return "/placeholder.svg"
  }

  // Return the full URL if the media is hosted on a CDN (DO Spaces/S3)
  if (url.startsWith("http") || url.startsWith("//")) {
    return url
  }

  // For local development only - use Strapi URL for relative paths
  if (process.env.NODE_ENV === "development") {
    return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`
  }

  // In production with DO Spaces, this shouldn't happen, but fallback to CDN
  return `${process.env.NEXT_PUBLIC_DO_SPACE_CDN || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`
}
