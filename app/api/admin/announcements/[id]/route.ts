export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const sql = getDb();
  const rows = await sql`UPDATE announcements SET title_uz=${b.title_uz||''},title_ru=${b.title_ru||''},title_en=${b.title_en||''},content_uz=${b.content_uz||''},content_ru=${b.content_ru||''},content_en=${b.content_en||''},is_published=${b.is_published??false} WHERE id=${params.id} RETURNING *`;
  return NextResponse.json(rows[0]);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  await sql`DELETE FROM announcements WHERE id=${params.id}`;
  return NextResponse.json({ success: true });
}
