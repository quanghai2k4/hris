import db from './database.ts';

export const dbHelpers = {
  findUnique<T>(table: string, where: Record<string, any>): T | null {
    const keys = Object.keys(where);
    const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
    const values = keys.map(key => where[key]);
    
    const stmt = db.prepare(`SELECT * FROM ${table} WHERE ${whereClauses}`);
    return stmt.get(...values) as T | null;
  },

  findMany<T>(table: string, options: {
    where?: Record<string, any>;
    orderBy?: { [key: string]: 'asc' | 'desc' };
    take?: number;
  } = {}): T[] {
    let query = `SELECT * FROM ${table}`;
    const values: any[] = [];

    if (options.where) {
      const keys = Object.keys(options.where);
      const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${whereClauses}`;
      values.push(...keys.map(key => options.where![key]));
    }

    if (options.orderBy) {
      const orderKeys = Object.keys(options.orderBy);
      const orderClauses = orderKeys.map(key => `${key} ${options.orderBy![key].toUpperCase()}`).join(', ');
      query += ` ORDER BY ${orderClauses}`;
    }

    if (options.take) {
      query += ` LIMIT ${options.take}`;
    }

    const stmt = db.prepare(query);
    return stmt.all(...values) as T[];
  },

  count(table: string, where?: Record<string, any>): number {
    let query = `SELECT COUNT(*) as count FROM ${table}`;
    const values: any[] = [];

    if (where) {
      const keys = Object.keys(where);
      const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
      query += ` WHERE ${whereClauses}`;
      values.push(...keys.map(key => where[key]));
    }

    const stmt = db.prepare(query);
    const result = stmt.get(...values) as { count: number };
    return result.count;
  },

  create<T>(table: string, data: Record<string, any>): T {
    const keys = Object.keys(data);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => data[key]);

    const stmt = db.prepare(`
      INSERT INTO ${table} (${keys.join(', ')})
      VALUES (${placeholders})
    `);
    
    const result = stmt.run(...values);
    return { id: result.lastInsertRowid, ...data } as T;
  },

  update<T>(table: string, where: Record<string, any>, data: Record<string, any>): T | null {
    const dataKeys = Object.keys(data);
    const whereKeys = Object.keys(where);
    
    const setClauses = dataKeys.map(key => `${key} = ?`).join(', ');
    const whereClauses = whereKeys.map(key => `${key} = ?`).join(' AND ');
    
    const values = [...dataKeys.map(key => data[key]), ...whereKeys.map(key => where[key])];

    const stmt = db.prepare(`
      UPDATE ${table}
      SET ${setClauses}
      WHERE ${whereClauses}
    `);
    
    stmt.run(...values);
    return this.findUnique<T>(table, where);
  },

  delete(table: string, where: Record<string, any>): void {
    const keys = Object.keys(where);
    const whereClauses = keys.map(key => `${key} = ?`).join(' AND ');
    const values = keys.map(key => where[key]);

    const stmt = db.prepare(`DELETE FROM ${table} WHERE ${whereClauses}`);
    stmt.run(...values);
  },

  exec(query: string, params: any[] = []): any[] {
    const stmt = db.prepare(query);
    return stmt.all(...params) as any[];
  },

  run(query: string, params: any[] = []): void {
    const stmt = db.prepare(query);
    stmt.run(...params);
  }
};
