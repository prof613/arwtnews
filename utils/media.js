export const getStrapiMedia = (media) => {
  if (!media) {
    return "/placeholder.svg" // Or some other default
  }

  const { url } = media?.data?.attributes || media || {}

  // Verify that the URL exists.
  if (!url) {
    return "/placeholder.svg"
  }

  // Return the full URL if the media is hosted on a CDN
  if (url.startsWith("http") || url.startsWith("//")) {
    return url
  }

  // Otherwise prepend the URL with the Strapi URL
  return `${process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337"}${url}`
}
