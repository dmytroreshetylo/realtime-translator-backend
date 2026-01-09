import { DatabaseService } from '../../../database/database.service';

export class HistoryService extends DatabaseService {
  async getMostPopularOriginalLanguageByUserUUID(userUUID: string): Promise<string | null> {
    const query = `
        SELECT "originalLanguage"
        FROM "history"
        WHERE "userUUID" = $1
        GROUP BY "originalLanguage"
        ORDER BY COUNT("originalLanguage") DESC
        LIMIT 1;
    `;
    const result = await DatabaseService.pool.query(query, [userUUID]);
    return result.rows[0]?.originalLanguage || null;
  }
}

export const historyService = new HistoryService();
