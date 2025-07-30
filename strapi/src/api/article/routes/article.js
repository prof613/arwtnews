/**
 * article router
 */

module.exports = {
  routes: [
    // Custom route for related articles - MUST be placed before the default findOne route
    {
      method: "GET",
      path: "/articles/related",
      handler: "article.findRelated",
      config: {
        policies: [],
        middlewares: [],
      },
      type: "content-api",
    },
    // Default routes for the article content type
    {
      method: "GET",
      path: "/articles",
      handler: "article.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/articles/:id",
      handler: "article.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/articles",
      handler: "article.create",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/articles/:id",
      handler: "article.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/articles/:id",
      handler: "article.delete",
      config: {
        policies: [],
      },
    },
  ],
}
