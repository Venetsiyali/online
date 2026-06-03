export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  const rows = await sql`SELECT * FROM announcements ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const sql = getDb();
  const rows = await sql`INSERT INTO announcements (title_uz,title_ru,title_en,content_uz,content_ru,content_en,is_published) VALUES (${b.title_uz||''},${b.title_ru||''},${b.title_en||''},${b.content_uz||''},${b.content_ru||''},${b.content_en||''},${b.is_published??false}) RETURNING *`;
  return NextResponse.json(rows[0], { status: 201 });
}
