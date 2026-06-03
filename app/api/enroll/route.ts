export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { full_name, phone, email, course_id, user_id } = await req.json();
    if (!full_name?.trim() || !phone?.trim() || !course_id) {
      return NextResponse.json({ error: 'full_name, phone, and course_id are required' }, { status: 400 });
    }
    const sql = getDb();
    const course = await sql`SELECT id FROM courses WHERE id=${course_id} AND is_published=true LIMIT 1`;
    if (course.length === 0) return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    const rows = await sql`
      INSERT INTO students (full_name, phone, email, course_id, user_id)
      VALUES (${full_name.trim()}, ${phone.trim()}, ${email?.trim()||null}, ${course_id}, ${user_id||null})
      RETURNING *
    `;
    return NextResponse.json({ success: true, student: rows[0] }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Error' }, { status: 500 });
  }
}
