#!/usr/bin/env node
/**
 * Run with:  node scripts/migrate.js
 * or:        npm run db:migrate
 *
 * Requires DATABASE_URL in environment (or .env.local via dotenv).
 */

// Optional: load .env.local if present
try {
  require('dotenv').config({ path: '.env.local' })
} catch {
  // dotenv not installed — that's fine; DATABASE_URL should be set externally
}

const { Pool } = require('pg')

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  })

  console.log('🔌 Connecting to Postgres…')

  const client = await pool.connect()

  try {
    console.log('📦 Running migrations…')

    await client.query(`
      CREATE TABLE IF NOT EXISTS waitlist (
        id          SERIAL PRIMARY KEY,
        email       TEXT NOT NULL UNIQUE,
        ip_address  TEXT,
        user_agent  TEXT,
        created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS waitlist_email_idx ON waitlist (email);
    `)

    await client.query(`
      CREATE INDEX IF NOT EXISTS waitlist_created_at_idx ON waitlist (created_at DESC);
    `)

    console.log('✅ Migration complete.')
  } finally {
    client.release()
    await pool.end()
  }
}

migrate().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
