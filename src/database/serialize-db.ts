import { Pool } from 'pg';
import { config } from '../config/config';

const pool = new Pool({ connectionString: config.dbURL });

const createHistoryTable = `
    CREATE TABLE IF NOT EXISTS "history"
    (
        id
        SERIAL
        PRIMARY
        KEY,
        "userUUID"
        VARCHAR
(
    255
) NOT NULL,
    "originalText" TEXT NOT NULL,
    "translatedText" TEXT NOT NULL,
    "originalLanguage" VARCHAR
(
    10
) NOT NULL,
    "translatedLanguage" VARCHAR
(
    10
) NOT NULL,
    date TIMESTAMP NOT NULL
    );
`;

async function serializeDb() {
  const client = await pool.connect();
  try {
    await client.query(createHistoryTable);
    console.log('Таблиця "history" успішно створена.');
  } catch (err) {
    console.error('Помилка при створенні таблиці "history":', err);
  } finally {
    client.release();
    await pool.end();
  }
}

serializeDb();
