module.exports = ({ env }) => {
  // Debug logging to verify environment variables
  console.log("🔍 Upload Config Debug:")
  console.log("AWS_ACCESS_KEY_ID:", env("AWS_ACCESS_KEY_ID") ? "SET" : "MISSING")
  console.log("AWS_SECRET_ACCESS_KEY:", env("AWS_SECRET_ACCESS_KEY") ? "SET" : "MISSING")
  console.log("AWS_REGION:", env("AWS_REGION"))
  console.log("DO_SPACE_BUCKET:", env("DO_SPACE_BUCKET"))
  console.log("DO_SPACE_ENDPOINT:", env("DO_SPACE_ENDPOINT"))
  console.log("DO_SPACE_CDN:", env("DO_SPACE_CDN"))

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
      },
    },
  }
}
