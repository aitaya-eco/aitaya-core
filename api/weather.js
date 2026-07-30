// GET /api/weather -> { city, temp, advice }
// Uses Vercel's edge geo headers plus Open-Meteo (no API key, no client CORS issue).
// Falls back to Lagos so the chyron always has something true to say.
module.exports = async (req, res) => {
  const h = req.headers || {};
  const city = decodeURIComponent(h['x-vercel-ip-city'] || '') || 'Lagos';
  const lat = parseFloat(h['x-vercel-ip-latitude']) || 6.4541;
  const lon = parseFloat(h['x-vercel-ip-longitude']) || 3.3947;

  const advise = (t, rain) => {
    if (rain >= 50) return 'rain coming, mind the hem';
    if (t >= 33) return 'dress light, breathable weave';
    if (t >= 28) return 'light layers, nothing heavy';
    if (t >= 22) return 'good day for structure';
    return 'bring the outer layer';
  };

  try {
    const url = 'https://api.open-meteo.com/v1/forecast'
      + '?latitude=' + lat + '&longitude=' + lon
      + '&current=temperature_2m,precipitation_probability';
    const r = await fetch(url);
    if (!r.ok) throw new Error('upstream ' + r.status);
    const d = await r.json();
    const temp = d && d.current ? d.current.temperature_2m : null;
    const rain = d && d.current ? (d.current.precipitation_probability || 0) : 0;
    if (typeof temp !== 'number') throw new Error('no reading');
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate=3600');
    return res.status(200).json({ city, temp, advice: advise(temp, rain) });
  } catch (err) {
    console.error('[weather]', err && err.message);
    return res.status(204).end();
  }
};
