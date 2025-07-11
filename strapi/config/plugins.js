module.exports = ({ env }) => {
  // More detailed debug logging
  console.log("🔍 ALL Environment Variables:")
  console.log("NODE_ENV:", process.env.NODE_ENV)
  console.log("AWS_ACCESS_KEY_ID exists:", !!process.env.AWS_ACCESS_KEY_ID)
  console.log("AWS_SECRET_ACCESS_KEY exists:", !!process.env.AWS_SECRET_ACCESS_KEY)
  console.log("AWS_REGION:", process.env.AWS_REGION)
  console.log("DO_SPACE_BUCKET:", process.env.DO_SPACE_BUCKET)
  console.log("DO_SPACE_ENDPOINT:", process.env.DO_SPACE_ENDPOINT)
  console.log("DO_SPACE_CDN:", process.env.DO_SPACE_CDN)

  return {
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
        provider: "aws-s3",
        providerOptions: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          region: process.env.AWS_REGION,
          bucket: process.env.DO_SPACE_BUCKET,
          endpoint: process.env.DO_SPACE_ENDPOINT,
          baseUrl: process.env.DO_SPACE_CDN,
          s3ForcePathStyle: true,
          params: {
            ACL: "public-read",
            Bucket: process.env.DO_SPACE_BUCKET,
          },
        },
      },
    },
  }
}
