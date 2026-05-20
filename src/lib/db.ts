import { Pool } from 'pg'

// Singleton pool for Next.js (avoids exhausting connections in dev with hot reload)
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined
}

function createPool(): Pool {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL environment variable is not set. ' +
        'Please add it to your .env.local file.\n' +
        'Example: DATABASE_URL=postgresql://user:password@localhost:5432/attire'
    )
  }

  return new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
    max: 1,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  })
}

export function getPool(): Pool {
  if (process.env.NODE_ENV === 'development') {
    // In dev, reuse across hot reloads
    if (!global._pgPool) {
      global._pgPool = createPool()
    }
    return global._pgPool
  }

  // In production, create a single module-level pool
  return createPool()
}

export async function query<T extends object = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool()
  const result = await pool.query<T>(text, params)
  return result.rows
}
