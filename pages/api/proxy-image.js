export default async function handler(req, res) {
  const { url } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  if (!url) {
    return res.status(400).json({ message: 'URL parameter is required' });
  }

  try {
    // Validate that the URL is from the expected domain
    const allowedDomains = ['sajedabackend.etherstaging.xyz'];
    const urlObj = new URL(url);

    if (!allowedDomains.includes(urlObj.hostname)) {
      return res.status(400).json({ message: 'Domain not allowed' });
    }

    // Fetch the image from the external URL
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: 'Failed to fetch image' });
    }

    // Get the image data
    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/png';

    // Set appropriate headers
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 24 hours
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Send the image data
    res.status(200).send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
