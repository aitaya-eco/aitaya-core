// POST /api/waitlist  -> saves {email}
// GET  /api/waitlist  -> { count }
const { Pool } = require('pg')

let pool
function getPool () {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) throw new Error('DATABASE_URL is not set on this deployment.')
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 1,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 8000
    })
  }
  return pool
}

async function ensureTable () {
  await getPool().query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id          SERIAL PRIMARY KEY,
      email       TEXT NOT NULL UNIQUE,
      ip_address  TEXT,
      user_agent  TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      await ensureTable()
      const { rows } = await getPool().query('SELECT COUNT(*) AS count FROM waitlist')
      return res.status(200).json({ count: parseInt(rows[0].count, 10) })
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' })
    }

    let body = req.body
    if (typeof body === 'string') { try { body = JSON.parse(body) } catch (e) { body = {} } }
    const email = String((body && body.email) || '').trim().toLowerCase()

    if (!email) return res.status(400).json({ success: false, message: 'Email address is required.' })
    if (!isValidEmail(email)) return res.status(400).json({ success: false, message: 'Please enter a valid email address.' })

    await ensureTable()

    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || 'unknown'
    const ua = req.headers['user-agent'] || 'unknown'

    await getPool().query(
      'INSERT INTO waitlist (email, ip_address, user_agent) VALUES ($1, $2, $3)',
      [email, ip, ua]
    )
    return res.status(201).json({ success: true, message: "You're on the list." })
  } catch (error) {
    if (error && error.code === '23505') {
      return res.status(409).json({ success: false, message: "You're already on our waitlist." })
    }
    console.error('[waitlist]', error && error.message, error && error.code)
    return res.status(500).json({ success: false, message: 'Something went wrong. Please try again shortly.' })
  }
}
