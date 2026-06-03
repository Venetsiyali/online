export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { lessonId: string } }) {
  const sql = getDb();
  const [lessonRows, quizRows] = await Promise.all([
    sql`SELECT * FROM lessons WHERE id=${params.lessonId} LIMIT 1`,
    sql`SELECT * FROM quiz_questions WHERE lesson_id=${params.lessonId} ORDER BY order_index ASC`,
  ]);
  if (lessonRows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ lesson: lessonRows[0], questions: quizRows });
}
