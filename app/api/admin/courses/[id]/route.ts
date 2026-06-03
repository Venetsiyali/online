export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';
import { extractYouTubeId } from '@/lib/youtube';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  if (body.youtube_url) {
    const videoId = extractYouTubeId(body.youtube_url);
    if (videoId) body.youtube_url = videoId;
  }

  const sql = getDb();
  const rows = await sql`
    UPDATE courses SET
      title_uz = ${body.title_uz || ''},
      title_ru = ${body.title_ru || ''},
      title_en = ${body.title_en || ''},
      description_uz = ${body.description_uz || ''},
      description_ru = ${body.description_ru || ''},
      description_en = ${body.description_en || ''},
      youtube_url = ${body.youtube_url || ''},
      thumbnail_url = ${body.thumbnail_url || null},
      category = ${body.category || null},
      is_free = ${body.is_free ?? true},
      is_published = ${body.is_published ?? false}
    WHERE id = ${params.id}
    RETURNING *
  `;
  if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(rows[0]);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = getDb();
  await sql`DELETE FROM courses WHERE id = ${params.id}`;
  return NextResponse.json({ success: true });
}
