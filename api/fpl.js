// api/fpl.js  —  Vercel serverless function
// Proxies requests to the FPL API.
// The dashboard calls:  /api/fpl/entry/123/  or  /api/fpl/bootstrap-static/
// Vercel rewrites that to: /api/fpl?path=entry/123/

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // path may be a string or array depending on how Vercel passes catchall params
  let { path } = req.query;
  if (Array.isArray(path)) path = path.join('/');

  // Fallback: derive from the URL itself if query param missing
  if (!path) {
    const match = (req.url || '').match(/^\/api\/fpl\/(.+)/);
    path = match ? match[1] : null;
  }

  if (!path) {
    return res.status(400).json({ error: 'Missing path', url: req.url, query: req.query });
  }

  // Strip any leading slash
  path = path.replace(/^\/+/, '');

  const fplUrl = `https://fantasy.premierleague.com/api/${path}`;

  try {
    const response = await fetch(fplUrl, {
      headers: {
        'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept':          'application/json, text/plain, */*',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Referer':         'https://fantasy.premierleague.com/',
        'Origin':          'https://fantasy.premierleague.com',
        'sec-fetch-dest':  'empty',
        'sec-fetch-mode':  'cors',
        'sec-fetch-site':  'same-origin',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `FPL API returned ${response.status}`, fplUrl });
    }

    const data = await response.json();

    const isBootstrap = path.startsWith('bootstrap-static');
    res.setHeader('Cache-Control', isBootstrap ? 's-maxage=300, stale-while-revalidate=60' : 's-maxage=30');
    res.setHeader('Access-Control-Allow-Origin', '*');

    return res.status(200).json(data);
  } catch (err) {
    return res.status(502).json({ error: 'Failed to reach FPL API', detail: err.message, fplUrl });
  }
}
