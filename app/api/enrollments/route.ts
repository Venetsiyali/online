export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDb } from '@/lib/db';

const SECRET = process.env.NEXTAUTH_SECRET || 'online_academy_secret_2024';

const isUuid = (v: unknown) =>
  typeof v === 'string' &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) return NextResponse.json({ enrollments: [] });

    const userId = token.id as string | undefined;
    if (!userId || !isUuid(userId)) return NextResponse.json({ enrollments: [] });

    const sql = getDb();
    const rows = await sql`
      SELECT s.id, s.enrolled_at, s.course_id,
             c.id as c_id, c.title_uz, c.title_ru, c.title_en,
             c.thumbnail_url, c.category, c.is_free
      FROM students s
      JOIN courses c ON s.course_id = c.id
      WHERE s.user_id = ${userId}
      ORDER BY s.enrolled_at DESC
    `;

    const enrollments = rows.map((r) => ({
      id: r.id,
      enrolled_at: r.enrolled_at,
      courses: {
        id: r.c_id,
        title_uz: r.title_uz,
        title_ru: r.title_ru,
        title_en: r.title_en,
        thumbnail_url: r.thumbnail_url,
        category: r.category,
        is_free: r.is_free,
      },
    }));

    return NextResponse.json({ enrollments });
  } catch (err) {
    console.error('[GET /api/enrollments]', err);
    return NextResponse.json({ enrollments: [] });
  }
}
