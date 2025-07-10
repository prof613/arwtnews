/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost', 'rwtnews-media.nyc3.cdn.digitaloceanspaces.com'],
  },
}

module.exports = nextConfig