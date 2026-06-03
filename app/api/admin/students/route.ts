export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit');

  const sql = getDb();
  const rows = limit
    ? await sql`
        SELECT s.id, s.full_name, s.phone, s.email, s.enrolled_at,
               c.title_uz, c.title_ru, c.title_en
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        ORDER BY s.enrolled_at DESC
        LIMIT ${Number(limit)}
      `
    : await sql`
        SELECT s.id, s.full_name, s.phone, s.email, s.enrolled_at,
               c.title_uz, c.title_ru, c.title_en
        FROM students s
        LEFT JOIN courses c ON s.course_id = c.id
        ORDER BY s.enrolled_at DESC
      `;

  // Nest course titles under `courses` to match Student type
  const students = rows.map((r) => ({
    id: r.id,
    full_name: r.full_name,
    phone: r.phone,
    email: r.email,
    enrolled_at: r.enrolled_at,
    courses: r.title_en
      ? { title_uz: r.title_uz, title_ru: r.title_ru, title_en: r.title_en }
      : null,
  }));

  return NextResponse.json({ students });
}
