import { Pool } from 'pg';
import { config } from '../config/config';
import { PaginatedResult } from '../shared/models/paginated-result.model';
import { DbFilters } from '../shared/models/db-filters.model';

export class DatabaseService {
  private static pool: Pool;

  constructor() {
    if (!DatabaseService.pool) {
      DatabaseService.pool = new Pool(config.db);
    }
  }

  async getPaginatedList<T>(
    tableName: string,
    from: number,
    to: number,
    filters?: DbFilters
  ): Promise<PaginatedResult<T>> {
    const limit = to - from + 1;
    const offset = from;

    const { where, values } = this.buildWhereClause(filters);
    const dataQuery = `
        SELECT *
        FROM "${tableName}"
        ${where}
        LIMIT $${values.length + 1} OFFSET $${values.length + 2};
    `;
    const countQuery = `
        SELECT COUNT(*) as "totalCount"
        FROM "${tableName}"
        ${where};
    `;

    const client = await DatabaseService.pool.connect();
    try {
      const countResult = await client.query(countQuery, values);
      const dataResult = await client.query(dataQuery, [...values, limit, offset]);

      return {
        items: dataResult.rows as T[],
        totalCount: Number(countResult.rows[0].totalCount),
      };
    } finally {
      client.release();
    }
  }

  async addItem<T extends object>(
    tableName: string,
    item: Omit<T, 'id'>
  ): Promise<boolean> {
    const keys = Object.keys(item);
    const values = Object.values(item);

    if (keys.length === 0) {
      throw new Error('Елемент пустий');
    }

    const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
    const query = `
        INSERT INTO "${tableName}" (${keys.map(key => `"${key}"`).join(', ')})
        VALUES (${placeholders});
    `;

    const client = await DatabaseService.pool.connect();
    try {
      await client.query(query, values);
      return true;
    } finally {
      client.release();
    }
  }

  async close(): Promise<void> {
    await DatabaseService.pool.end();
  }

  private buildWhereClause(
    filters?: DbFilters
  ): { where: string; values: Array<string | number> } {
    if (!filters || Object.keys(filters).length === 0) {
      return { where: '', values: [] };
    }

    const conditions: string[] = [];
    const values: Array<string | number> = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(filters)) {
      conditions.push(`"${key}" = $${paramIndex++}`);
      values.push(value);
    }

    return {
      where: `WHERE ${conditions.join(' AND ')}`,
      values,
    };
  }
}
