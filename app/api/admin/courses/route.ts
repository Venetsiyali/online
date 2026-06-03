export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { extractYouTubeId } from '@/lib/youtube';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = getDb();
  const rows = await sql`SELECT * FROM courses ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    if (body.youtube_url) {
      const videoId = extractYouTubeId(body.youtube_url);
      if (videoId) body.youtube_url = videoId;
    }

    const sql = getDb();
    const rows = await sql`
      INSERT INTO courses (
        title_uz, title_ru, title_en,
        description_uz, description_ru, description_en,
        youtube_url, thumbnail_url, category, is_free, is_published
      ) VALUES (
        ${body.title_uz || ''}, ${body.title_ru || ''}, ${body.title_en || ''},
        ${body.description_uz || ''}, ${body.description_ru || ''}, ${body.description_en || ''},
        ${body.youtube_url || ''}, ${body.thumbnail_url || null},
        ${body.category || null}, ${body.is_free ?? true}, ${body.is_published ?? false}
      ) RETURNING *
    `;
    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    console.error('Course create error:', err);
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
