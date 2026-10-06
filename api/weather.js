// GET /api/weather                         -> best guess from the visitor's network (IP)
// GET /api/weather?lat=..&lon=..&city=..&cc=..  -> precise, from the browser's own location
// GET /api/weather?q=Abuja                 -> by place name, for anyone who types their city
// Returns { city, country, lat, lon, temp, advice, source }.
//
// The IP answer is personal, so it must never be cached at the edge: an edge cache keyed only
// on the URL would hand one visitor's city to everyone after them (that is how Abuja visitors
// were told they were in Port Harcourt). Precise and searched answers carry their location in
// the URL, so those can be shared safely.
const WEATHER = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE = 'https://geocoding-api.open-meteo.com/v1/search';

const clean = (s, max) => String(s || '').replace(/[^\p{L}\p{M}\s.'’,-]/gu, '').trim().slice(0, max);
const num = (v, lo, hi) => { const n = parseFloat(v); return Number.isFinite(n) && n >= lo && n <= hi ? n : null; };

const advise = (t, rain) => {
  if (rain >= 50) return 'rain coming, mind the hem';
  if (t >= 33) return 'dress light, breathable weave';
  if (t >= 28) return 'light layers, nothing heavy';
  if (t >= 22) return 'good day for structure';
  if (t >= 12) return 'bring the outer layer';
  return 'wrap up, layers on layers';
};

module.exports = async (req, res) => {
  const h = req.headers || {};
  const url = new URL(req.url, 'http://x');
  const q = Object.fromEntries(url.searchParams);
  let city, country = '', lat, lon, source;

  try {
    if (q.lat != null && q.lon != null) {
      lat = num(q.lat, -90, 90); lon = num(q.lon, -180, 180);
      if (lat === null || lon === null) return res.status(400).json({ error: 'bad_coordinates' });
      lat = Math.round(lat * 100) / 100; lon = Math.round(lon * 100) / 100;   // about 1 km, enough for weather
      city = clean(q.city, 60) || 'your area';
      country = clean(q.cc, 2).toUpperCase();
      source = 'gps';
    } else if (q.q) {
      const name = clean(q.q, 60);
      if (name.length < 2) return res.status(400).json({ error: 'bad_query' });
      const g = await fetch(GEOCODE + '?count=1&language=en&format=json&name=' + encodeURIComponent(name));
      const gd = g.ok ? await g.json() : null;
      const hit = gd && gd.results && gd.results[0];
      if (!hit) return res.status(404).json({ error: 'not_found' });
      lat = hit.latitude; lon = hit.longitude; city = hit.name; country = (hit.country_code || '').toUpperCase();
      source = 'search';
    } else {
      const raw = h['x-vercel-ip-city'];
      if (!raw) return res.status(204).end();            // no honest guess, say nothing
      city = decodeURIComponent(raw);
      country = String(h['x-vercel-ip-country'] || '').toUpperCase();
      lat = num(h['x-vercel-ip-latitude'], -90, 90); lon = num(h['x-vercel-ip-longitude'], -180, 180);
      if (lat === null || lon === null) return res.status(204).end();
      source = 'ip';
    }

    const r = await fetch(WEATHER + '?latitude=' + lat + '&longitude=' + lon
      + '&current=temperature_2m,precipitation_probability');
    if (!r.ok) throw new Error('upstream ' + r.status);
    const d = await r.json();
    const temp = d && d.current ? d.current.temperature_2m : null;
    const rain = d && d.current ? (d.current.precipitation_probability || 0) : 0;
    if (typeof temp !== 'number') throw new Error('no reading');

    if (source === 'ip') {
      res.setHeader('Cache-Control', 'private, no-store');
      res.setHeader('CDN-Cache-Control', 'no-store');
      res.setHeader('Vercel-CDN-Cache-Control', 'no-store');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=900, stale-while-revalidate=1800');
    }
    return res.status(200).json({ city, country, lat, lon, temp, advice: advise(temp, rain), source });
  } catch (err) {
    console.error('[weather]', err && err.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(204).end();
  }
};
