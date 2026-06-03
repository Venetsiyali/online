import { neon } from '@neondatabase/serverless';

/**
 * Returns a Neon SQL query function.
 * Usage: const sql = getDb();
 *        const rows = await sql`SELECT * FROM courses WHERE id = ${id}`;
 */
export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  return neon(url);
}
