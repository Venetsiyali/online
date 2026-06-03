export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const courseId = searchParams.get('course_id');

  const sql = getDb();
  const rows = courseId
    ? await sql`SELECT * FROM lessons WHERE course_id=${courseId} ORDER BY order_index ASC`
    : await sql`SELECT * FROM lessons ORDER BY order_index ASC`;

  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const sql = getDb();

    const rows = await sql`
      INSERT INTO lessons (course_id, title_uz, title_ru, title_en, content_uz, content_ru, content_en,
        video_url, duration_minutes, order_index, is_published)
      VALUES (
        ${body.course_id},
        ${body.title_uz || ''},
        ${body.title_ru || ''},
        ${body.title_en || ''},
        ${body.content_uz || ''},
        ${body.content_ru || ''},
        ${body.content_en || ''},
        ${body.video_url || null},
        ${body.duration_minutes || 0},
        ${body.order_index || 0},
        ${body.is_published ?? false}
      )
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
