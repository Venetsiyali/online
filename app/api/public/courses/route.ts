export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// Public endpoint — no auth required
// Returns only published courses (minimal fields for nav)
export async function GET() {
  try {
    const sql = getDb();
    const rows = await sql`
      SELECT id, title_uz, title_ru, title_en, category, youtube_url, thumbnail_url, is_free
      FROM courses
      WHERE is_published = true
      ORDER BY created_at ASC
    `;
    return NextResponse.json(rows);
  } catch (err) {
    console.error('[public/courses] error:', err);
    return NextResponse.json([], { status: 200 });
  }
}
