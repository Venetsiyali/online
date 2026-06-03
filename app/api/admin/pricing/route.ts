export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  const rows = await sql`SELECT * FROM pricing_plans ORDER BY price`;
  return NextResponse.json(rows);
}
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const b = await req.json();
  const sql = getDb();
  const rows = await sql`INSERT INTO pricing_plans (name_uz,name_ru,name_en,price,currency,features_uz,features_ru,features_en,is_popular,is_active) VALUES (${b.name_uz||''},${b.name_ru||''},${b.name_en||''},${b.price||0},${b.currency||'UZS'},${b.features_uz||[]},${b.features_ru||[]},${b.features_en||[]},${b.is_popular??false},${b.is_active??true}) RETURNING *`;
  return NextResponse.json(rows[0], { status: 201 });
}
