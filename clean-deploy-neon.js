const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function executeSchema() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('Connected to Neon!');
    
    console.log('Dropping old tables to perform clean migration...');
    await client.query(`
      DROP TABLE IF EXISTS certificates CASCADE;
      DROP TABLE IF EXISTS user_lesson_progress CASCADE;
      DROP TABLE IF EXISTS quiz_questions CASCADE;
      DROP TABLE IF EXISTS lessons CASCADE;
      DROP TABLE IF EXISTS students CASCADE;
      DROP TABLE IF EXISTS announcements CASCADE;
      DROP TABLE IF EXISTS pricing_plans CASCADE;
      DROP TABLE IF EXISTS courses CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
    `);

    const schemaPath = path.join(__dirname, 'supabase', 'migrations', 'neon_schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing neon_schema.sql...');
    await client.query(sql);
    console.log('Neon schema executed successfully!');
    
    const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('All Tables Created:', res.rows.map(r => r.tablename));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
  }
}

executeSchema();
