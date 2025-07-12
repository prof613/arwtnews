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
})
