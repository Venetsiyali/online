export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const sql = getDb();
  const [courseRows, lessonRows] = await Promise.all([
    sql`SELECT * FROM courses WHERE id=${params.id} AND is_published=true LIMIT 1`,
    sql`SELECT * FROM lessons WHERE course_id=${params.id} AND is_published=true ORDER BY order_index ASC`,
  ]);
  if (courseRows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ course: courseRows[0], lessons: lessonRows });
}
