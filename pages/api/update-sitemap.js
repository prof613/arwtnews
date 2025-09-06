export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify the webhook secret
  const authHeader = req.headers.authorization;
  const expectedToken = process.env.WEBHOOK_SECRET;
  if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Regenerate sitemap (simplified; adjust based on your setup)
    const { exec } = require('child_process');
    exec('npm run generate:sitemap', (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return res.status(500).json({ message: 'Sitemap regeneration failed' });
      }
      console.log('Sitemap regenerated successfully');
      res.status(200).json({ message: 'Sitemap updated' });
    });
  } catch (error) {
    console.error('Error in webhook handler:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}