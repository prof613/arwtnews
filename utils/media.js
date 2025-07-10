/**
 * Returns the full URL for a Strapi media asset.
 * @param {object} mediaObject - The media object from the Strapi API.
 * @returns {string|null} The full URL of the media or null if not available.
 */
export function getStrapiMedia(mediaObject) {
  if (!mediaObject?.data?.attributes?.url) {
    return null
  }

  const { url } = mediaObject.data.attributes

  // If the URL is already absolute, return it as is.
  if (url.startsWith("http") || url.startsWith("//")) {
    return url
  }

  // Otherwise, prepend the Strapi URL.
  return `${process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337"}${url}`
}
