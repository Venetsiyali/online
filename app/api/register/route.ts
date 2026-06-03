export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    const sql = getDb();

    // Check if email already exists
    const existing = await sql`SELECT id FROM users WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hash = await bcrypt.hash(password, 12);
    const rows = await sql`
      INSERT INTO users (email, full_name, password_hash)
      VALUES (${email}, ${full_name}, ${hash})
      RETURNING id, email, full_name, created_at
    `;

    return NextResponse.json({ user: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    console.error('Register error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
