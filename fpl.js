// api/fpl.js  —  Vercel serverless function
// Proxies requests to the FPL API, adding the headers needed to avoid CORS/403 blocks.
// Called by the dashboard as:  /api/fpl?path=entry/123/history/

export default async function handler(req, res) {
  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { path } = req.query;
  if (!path) {
    return res.status(400).json({ error: 'Missing path parameter' });
  }

  // Sanitise — only allow alphanumeric, slashes, hyphens, underscores
  if (!/^[\w\-\/]+\/?$/.test(path)) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  const url = `https://fantasy.premierleague.com/api/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (compatible; FPL-Dashboard/2.0)',
        'Accept':          'application/json, */*',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Referer':         'https://fantasy.premierleague.com/',
        'Origin':          'https://fantasy.premierleague.com',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FPL API returned ${response.status}` });
    }

    const data = await response.json();

    // Cache responses — bootstrap rarely changes, other endpoints cache for 30s
    const isBootstrap = path.startsWith('bootstrap-static');
    res.setHeader('Cache-Control', isBootstrap ? 's-maxage=300' : 's-maxage=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (err) {
    console.error('FPL proxy error:', err);
    return res.status(502).json({ error: 'Failed to reach FPL API', detail: err.message });
  }
}
