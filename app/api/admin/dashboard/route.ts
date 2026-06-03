export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const sql = getDb();
  const [c,s,a,p] = await Promise.all([
    sql`SELECT COUNT(*) FROM courses`,
    sql`SELECT COUNT(*) FROM students`,
    sql`SELECT COUNT(*) FROM announcements WHERE is_published=true`,
    sql`SELECT COUNT(*) FROM pricing_plans WHERE is_active=true`,
  ]);
  return NextResponse.json({ courses:Number(c[0].count), students:Number(s[0].count), announcements:Number(a[0].count), pricing:Number(p[0].count) });
}
