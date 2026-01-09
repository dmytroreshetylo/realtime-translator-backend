import { DB_FILE } from '../shared/constants/db-name.constant';
import * as sqlite3 from 'sqlite3';
import * as path from 'path';
import * as fs from 'fs';

function serializeDb(dbFile: string): void {
  const fullPath = path.resolve(process.cwd(), dbFile);

  const dirName = path.dirname(fullPath);
  if (!fs.existsSync(dirName)) {
    fs.mkdirSync(dirName, { recursive: true });
  }

  const db = new sqlite3.Database(fullPath, (err) => {
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