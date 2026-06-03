export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

/**
 * GET /api/db-setup
 * Creates missing tables (user_lesson_progress, certificates) if they don't exist.
 * Safe to call multiple times — uses IF NOT EXISTS.
 */
export async function GET() {
  try {
    const sql = getDb();

    await sql`
      CREATE TABLE IF NOT EXISTS user_lesson_progress (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        quiz_score INTEGER,
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, lesson_id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_progress_user_course
        ON user_lesson_progress (user_id, course_id)
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        certificate_number TEXT NOT NULL UNIQUE,
        full_name TEXT NOT NULL,
        issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      )
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_certificates_user
        ON certificates (user_id)
    `;

    return NextResponse.json({ ok: true, message: 'Tables created / already exist' });
  } catch (err) {
    console.error('[db-setup]', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
