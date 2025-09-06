const axios = require('axios');
const fs = require('fs').promises;

async function generateSitemap() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || 'https://your-strapi-app-url';
  const token = process.env.STRAPI_API_TOKEN;

  const fetchData = async (endpoint) => {
    const response = await axios.get(`${strapiUrl}${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  };

  const [articles, opinions] = await Promise.all([
    fetchData('/api/articles?populate=*'),
    fetchData('/api/opinions?populate=*'),
  ]);

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${articles
        .map((article) => `
        <url>
          <loc>https://rwtnews.com/articles/${article.attributes.slug}</loc>
          <lastmod>${new Date(article.attributes.updatedAt).toISOString()}</lastmod>
          <changefreq>hourly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      ${opinions
        .map((opinion) => `
        <url>
          <loc>https://rwtnews.com/opinions/${opinion.attributes.slug}</loc>
          <lastmod>${new Date(opinion.attributes.updatedAt).toISOString()}</lastmod>
          <changefreq>hourly</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
      <url>
        <loc>https://rwtnews.com/memes</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.6</priority>
      </url>
      <url>
        <loc>https://rwtnews.com/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://rwtnews.com/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://rwtnews.com/support</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://rwtnews.com/terms</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
      <url>
        <loc>https://rwtnews.com/privacy</loc>
        <changefreq>monthly</changefreq>
        <priority>0.5</priority>
      </url>
    </urlset>`;

  await fs.writeFile('public/sitemap.xml', sitemap);
}

generateSitemap().catch(console.error);