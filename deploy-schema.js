const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_Z0SdEq6gRThx@ep-autumn-dust-ag4lvh3i-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require';

async function executeSchema() {
  const client = new Client({
    connectionString,
  });

  try {
    await client.connect();
    console.log('Connected to Neon Database.');

    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    const sql = fs.readFileSync(schemaPath, 'utf8');

    console.log('Executing schema.sql...');
    await client.query(sql);
    console.log('Schema executed successfully!');
    
    // Verify tables
    const res = await client.query("SELECT tablename FROM pg_tables WHERE schemaname='public'");
    console.log('Created tables:', res.rows.map(r => r.tablename));

  } catch (err) {
    console.error('Error executing schema:', err);
  } finally {
    await client.end();
  }
}

executeSchema();
