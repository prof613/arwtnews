/**
 * opinion router
 */

module.exports = {
  routes: [
    // Custom route for related opinions - MUST be placed before the default findOne route
    {
      method: "GET",
      path: "/opinions/related",
      handler: "opinion.findRelated",
      config: {
        policies: [],
        middlewares: [],
      },
      type: "content-api",
    },
    // Default routes for the opinion content type
    {
      method: "GET",
      path: "/opinions",
      handler: "opinion.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/opinions/:id",
      handler: "opinion.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "POST",
      path: "/opinions",
      handler: "opinion.create",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/opinions/:id",
      handler: "opinion.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/opinions/:id",
      handler: "opinion.delete",
      config: {
        policies: [],
      },
    },
  ],
}
