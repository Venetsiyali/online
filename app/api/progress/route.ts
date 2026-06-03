export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/lib/db';
import { AUTH_SECRET } from '@/lib/auth-secret';

async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS user_lesson_progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL,
      lesson_id UUID NOT NULL,
      course_id UUID NOT NULL,
      quiz_score INTEGER,
      completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, lesson_id)
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS idx_progress_user_course
      ON user_lesson_progress (user_id, course_id)
  `;
}

const isUuid = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const userId = token.id as string | undefined;
    if (!userId || !isUuid(userId)) {
      // admin or invalid id — skip silently
      return NextResponse.json({ success: true, skipped: true });
    }

    const body = await req.json();
    const { lesson_id, course_id, quiz_score } = body;
    if (!lesson_id || !course_id) {
      return NextResponse.json({ error: 'lesson_id and course_id required' }, { status: 400 });
    }

    const sql = getDb();
    await ensureTable();

    await sql`
      INSERT INTO user_lesson_progress (user_id, lesson_id, course_id, quiz_score)
      VALUES (${userId}, ${lesson_id}, ${course_id}, ${quiz_score ?? null})
      ON CONFLICT (user_id, lesson_id)
      DO UPDATE SET quiz_score = ${quiz_score ?? null}, completed_at = NOW()
    `;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[POST /api/progress]', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
