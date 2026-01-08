import { DB_FILE } from '../shared/constants/db-name.constant';
import * as sqlite3 from 'sqlite3';

function serializeDb(dbFile: string): void {
  const path = `./${dbFile}`;

  const db = new sqlite3.Database(path, (err) => {
    if (err) {
      console.error('Помилка відкриття бази даних', err);
      throw err;
    }
  });

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userUUID TEXT NOT NULL,
        originalText TEXT NOT NULL,
        translatedText TEXT NOT NULL,
        originalLanguage TEXT NOT NULL,
        translatedLanguage TEXT NOT NULL,
        date INTEGER NOT NULL
      );
    `, () => {
      db.close();
    });

  });
}

serializeDb(DB_FILE);