import { DatabaseService } from '../../../database/database.service';
import { DB_FILE } from '../../../shared/constants/db-name.constant';

export class HistoryService extends DatabaseService {
  getMostPopularOriginalLanguageByUserUUID(userUUID: string): Promise<string | null> {
    const query = `
        SELECT originalLanguage
        FROM history
        WHERE userUUID = ?
        GROUP BY originalLanguage
        ORDER BY COUNT(originalLanguage) DESC
        LIMIT 1;
    `;

    return new Promise((resolve, reject) => {
      DatabaseService.db.get(query, [userUUID], (err, row: { originalLanguage: string } | undefined) => {
        if (err) {
          reject(err);
        } else {
          resolve(row ? row.originalLanguage : null);
        }
      });
    });
  }
}

export const historyService = new HistoryService(DB_FILE);