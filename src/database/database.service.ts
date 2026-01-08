import * as sqlite3 from 'sqlite3';
import { PaginatedResult } from '../shared/models/paginated-result.model';
import { DbFilters } from '../shared/models/db-filters.model';
import { config } from '../config/config';

export class DatabaseService {
  static db: sqlite3.Database;

  constructor() {
    DatabaseService.db = new sqlite3.Database(`./${ config.dbFile }`, (err) => {
      if (err) {
        console.error('Невдале зʼєднання', err);
      }
    });
  }

  getPaginatedList<T>(
    tableName: string,
    from: number,
    to: number,
    filters?: DbFilters
  ): Promise<PaginatedResult<T>> {
    const limit = to - from + 1;
    const offset = from;

    const safeTable = this.escapeIdentifier(tableName);
    const { where, values } = this.buildWhereClause(filters);

    const dataQuery = `
        SELECT *
        FROM ${safeTable}
                 ${where}
            LIMIT ? OFFSET ?;
    `;

    const countQuery = `
    SELECT COUNT(*) as totalCount
    FROM ${safeTable}
    ${where};
  `;

    return new Promise((resolve, reject) => {
      DatabaseService.db.get(countQuery, values, (err, countRow) => {
        if (err) {
          reject(err);
          return;
        }

        DatabaseService.db.all(
          dataQuery,
          [...values, limit, offset],
          (err, rows) => {
            if (err) {
              reject(err);
              return;
            }

            resolve({
              items: rows as T[],
              totalCount: (countRow as { totalCount: number }).totalCount
            });
          }
        );
      });
    });
  }

  addItem<T extends object>(
    tableName: string,
    item: Omit<T, 'id'>
  ): Promise<boolean> {
    const keys = Object.keys(item);
    const values = Object.values(item);

    if (keys.length === 0) {
      return Promise.reject(new Error('Елемент пустий'));
    }

    const placeholders = keys.map(() => '?').join(', ');

    const query = `
        INSERT INTO ${ this.escapeIdentifier(tableName) }
            (${ keys.map(this.escapeIdentifier).join(', ') })
        VALUES (${ placeholders });
    `;

    return new Promise((resolve, reject) => {
      DatabaseService.db.run(query, values, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(true);
        }
      });
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      DatabaseService.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  // Security from sql injection
  private escapeIdentifier(identifier: string): string {
    if (!/^[a-zA-Z0-9_]+$/.test(identifier)) {
      throw new Error(`Недопустимий ідентифікатор: ${ identifier }`);
    }
    return `"${ identifier }"`;
  }

  private buildWhereClause(
    filters?: DbFilters
  ): { where: string; values: Array<string | number> } {
    if (!filters || Object.keys(filters).length === 0) {
      return { where: '', values: [] };
    }

    const conditions: string[] = [];
    const values: Array<string | number> = [];

    for (const [key, value] of Object.entries(filters)) {
      const safeKey = this.escapeIdentifier(key);
      conditions.push(`${safeKey} = ?`);
      values.push(value);
    }

    return {
      where: `WHERE ${conditions.join(' AND ')}`,
      values
    };
  }

}
