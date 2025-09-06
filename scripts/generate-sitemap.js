require('dotenv').config(); // Load environment variables from .env
const axios = require('axios');
const fs = require('fs').promises;

async function generateSitemap() {
  const isLocal = process.env.NODE_ENV === 'development';
  const strapiUrl = isLocal ? 'http://localhost:1337' : process.env.NEXT_PUBLIC_STRAPI_URL || 'https://rwtnews-live-backend-waaoz.ondigitalocean.app';
  const token = process.env.STRAPI_API_TOKEN;

  if (isLocal) {
    console.log('Local environment detected, skipping API calls. Creating empty sitemap for testing.');
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url><loc>https://rwtnews.com/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
      </urlset>`;
    await fs.writeFile('public/sitemap.xml', sitemap);
    return;
  }

  if (!token) {
    console.error('STRAPI_API_TOKEN is not set in environment variables.');
    process.exit(1);
  }

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
          <changefreq>daily</changefreq>
          <priority>0.7</priority>
        </url>
      `).join('')}
      <url>
        <loc>https://rwtnews.com/memes</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
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