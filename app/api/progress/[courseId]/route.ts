export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/lib/db';
import { AUTH_SECRET } from '@/lib/auth-secret';

const empty = { completedIds: [], percent: 0, totalLessons: 0, completedCount: 0 };

const isUuid = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

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
}

export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const token = await getToken({ req, secret: AUTH_SECRET });
    if (!token) return NextResponse.json(empty);

    const userId = token.id as string | undefined;
    if (!userId || !isUuid(userId)) return NextResponse.json(empty);

    const sql = getDb();
    await ensureTable();

    const [progress, total] = await Promise.all([
      sql`
        SELECT lesson_id, quiz_score, completed_at
        FROM user_lesson_progress
        WHERE user_id = ${userId} AND course_id = ${params.courseId}
      `,
      sql`
        SELECT COUNT(*) AS count
        FROM lessons
        WHERE course_id = ${params.courseId} AND is_published = true
      `,
    ]);

    const completedIds = progress.map((p) => p.lesson_id as string);
    const totalLessons = Number(total[0]?.count ?? 0);
    const completedCount = completedIds.length;
    const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    return NextResponse.json({ completedIds, completedLessons: progress, totalLessons, completedCount, percent });
  } catch (err) {
    console.error('[GET /api/progress/:courseId]', err);
    return NextResponse.json(empty);
  }
}
