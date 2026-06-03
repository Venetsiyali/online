export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const lessonId = searchParams.get('lesson_id');
  if (!lessonId) return NextResponse.json({ error: 'lesson_id required' }, { status: 400 });

  const sql = getDb();
  const rows = await sql`SELECT * FROM quiz_questions WHERE lesson_id=${lessonId} ORDER BY order_index ASC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const sql = getDb();

    const rows = await sql`
      INSERT INTO quiz_questions (
        lesson_id, question_uz, question_ru, question_en,
        options_uz, options_ru, options_en,
        correct_option, explanation_uz, explanation_ru, explanation_en, order_index
      ) VALUES (
        ${body.lesson_id},
        ${body.question_uz || ''},
        ${body.question_ru || ''},
        ${body.question_en || ''},
        ${JSON.stringify(body.options_uz || [])},
        ${JSON.stringify(body.options_ru || [])},
        ${JSON.stringify(body.options_en || [])},
        ${body.correct_option ?? 0},
        ${body.explanation_uz || ''},
        ${body.explanation_ru || ''},
        ${body.explanation_en || ''},
        ${body.order_index || 0}
      )
      RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
