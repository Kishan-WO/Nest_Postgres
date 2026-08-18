import { Pool } from 'pg';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function deleteDb() {
  console.log('🗑️  Dropping all tables from database...');

  try {
    await pool.query(`
      DROP TABLE IF EXISTS users, files CASCADE;
    `);
    console.log('✅ Successfully dropped all tables.');
  } catch (error) {
    console.error('❌ Error dropping tables:', error);
  } finally {
    await pool.end();
  }
}

deleteDb();
