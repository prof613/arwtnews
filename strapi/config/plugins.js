module.exports = ({ env }) => ({
  "users-permissions": {
    enabled: true,
    config: {
      jwtSecret: env("JWT_SECRET"),
    },
  },
  i18n: {
    enabled: true,
  },
  upload: {
    config: {
      provider: env("UPLOAD_PROVIDER", "local"), // Use env variable, default to local
      ...(env("UPLOAD_PROVIDER") === "aws-s3" && {
        providerOptions: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_SECRET_ACCESS_KEY"),
          region: env("AWS_REGION"),
          bucket: env("DO_SPACE_BUCKET"),
          endpoint: env("DO_SPACE_ENDPOINT"),
          baseUrl: env("DO_SPACE_CDN"),
          s3ForcePathStyle: true,
          params: {
            ACL: "public-read",
            Bucket: env("DO_SPACE_BUCKET"),
          },
        },
      }),
    },
  },
  'sitemap': {
    enabled: true,
    config: {
      autoGenerate: true, // Automatically generate sitemap on content changes
      outDir: './public', // Output to public directory for web access
      sitemapFileName: 'sitemap.xml',
      hostname: 'https://rwtnews.com', // Live domain for Digital Ocean
      contentTypes: ['article', 'opinion', 'meme'], // Include relevant content types
      exclude: ['under-construction'], // Exclude specific pages if needed
      lastmod: 'updatedAt', // Use updatedAt field for lastmod
    },
  },
})