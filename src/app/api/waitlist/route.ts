import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/db'

// ─── Ensure the table exists on first use ────────────────────────────────────
async function ensureTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id          SERIAL PRIMARY KEY,
      email       TEXT NOT NULL UNIQUE,
      ip_address  TEXT,
      user_agent  TEXT,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `)
}

// ─── Basic email validation ───────────────────────────────────────────────────
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
} 

// ─── POST /api/waitlist ───────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const email = (body?.email ?? '').trim().toLowerCase()

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email address is required.' },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    await ensureTable()

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ??
      request.headers.get('x-real-ip') ??
      'unknown'

    const userAgent = request.headers.get('user-agent') ?? 'unknown'

    await query(
      `INSERT INTO waitlist (email, ip_address, user_agent)
       VALUES ($1, $2, $3)`,
      [email, ip, userAgent]
    )

    return NextResponse.json(
      {
        success: true,
        message: "You're on the list. We'll be in touch.",
      },
      { status: 201 }
    )
  } catch (error: unknown) {
    // Postgres unique violation code
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code: string }).code === '23505'
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "You're already on our waitlist.",
        },
        { status: 409 }
      )
    }

    console.error('[waitlist] Unexpected error:', error)
    return NextResponse.json(
      {
        success: false,
        message: 'Something went wrong. Please try again shortly.',
      },
      { status: 500 }
    )
  }
}

// ─── GET /api/waitlist (admin count endpoint) ─────────────────────────────────
export async function GET() {
  try {
    await ensureTable()
    const rows = await query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM waitlist'
    )
    return NextResponse.json({ count: parseInt(rows[0].count, 10) })
  } catch (error) {
    console.error('[waitlist] GET error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
