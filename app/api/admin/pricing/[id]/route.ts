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
  const rows = await sql`UPDATE pricing_plans SET name_uz=${b.name_uz||''},name_ru=${b.name_ru||''},name_en=${b.name_en||''},price=${b.price||0},currency=${b.currency||'UZS'},features_uz=${b.features_uz||[]},features_ru=${b.features_ru||[]},features_en=${b.features_en||[]},is_popular=${b.is_popular??false},is_active=${b.is_active??true} WHERE id=${params.id} RETURNING *`;
  return NextResponse.json(rows[0]);
}
export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  await sql`DELETE FROM pricing_plans WHERE id=${params.id}`;
  return NextResponse.json({ success: true });
}
