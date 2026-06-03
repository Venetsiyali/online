export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const sql = getDb();

    const rows = await sql`
      UPDATE quiz_questions SET
        question_uz=${body.question_uz || ''},
        question_ru=${body.question_ru || ''},
        question_en=${body.question_en || ''},
        options_uz=${JSON.stringify(body.options_uz || [])},
        options_ru=${JSON.stringify(body.options_ru || [])},
        options_en=${JSON.stringify(body.options_en || [])},
        correct_option=${body.correct_option ?? 0},
        explanation_uz=${body.explanation_uz || ''},
        explanation_ru=${body.explanation_ru || ''},
        explanation_en=${body.explanation_en || ''},
        order_index=${body.order_index || 0}
      WHERE id=${params.id}
      RETURNING *
    `;

    if (rows.length === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const sql = getDb();
  await sql`DELETE FROM quiz_questions WHERE id=${params.id}`;
  return NextResponse.json({ success: true });
}
