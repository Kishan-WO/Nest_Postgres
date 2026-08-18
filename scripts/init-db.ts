import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function runSqlFiles() {
  console.log('🚀 Running SQL scripts...');

  const sqlFiles = ['create_users.sql'];

  try {
    for (const fileName of sqlFiles) {
      const filePath = path.join(__dirname, fileName);

      if (!fs.existsSync(filePath)) {
        console.warn(`⚠️  File not found: ${fileName}, skipping...`);
        continue;
      }

      console.log(`📜 Executing ${fileName}...`);
      const sql = fs.readFileSync(filePath, 'utf8');

      if (sql.trim()) {
        await pool.query(sql);
        console.log(`✅ Successfully executed ${fileName}`);
      } else {
        console.log(`ℹ️  File ${fileName} is empty, skipping.`);
      }
    }
  } catch (error) {
    console.error('❌ Error executing SQL files:', error);
  } finally {
    await pool.end();
  }
}

runSqlFiles();
