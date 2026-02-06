const mysql = require('mysql2/promise');
require('dotenv').config();

/**
 * MySQL Connection Pool wrapper
 * - Accepts Postgres-style $1, $2 placeholders and converts them to ? for mysql2
 * - Emulates simple `RETURNING` behavior by running a follow-up SELECT when possible
 */

const connectionString = process.env.DATABASE_URL ||
  `mysql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

const pool = mysql.createPool({
  uri: connectionString,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  namedPlaceholders: false
});

async function query(originalSql, params = []) {
  try {
    // Convert $1, $2 style placeholders to ? for mysql2
    const convertedSql = originalSql.replace(/\$\d+/g, '?');

    // Detect RETURNING clause
    const returningMatch = /RETURNING\s+([*\w, ]+)/i.exec(originalSql);
    const insertMatch = /INSERT\s+INTO\s+`?"?([a-zA-Z0-9_]+)`?"?/i.exec(originalSql);
    const updateMatch = /UPDATE\s+`?"?([a-zA-Z0-9_]+)`?"?/i.exec(originalSql);

    const conn = pool;

    const [resultOrRows] = await conn.execute(convertedSql, params);

    // If SELECT, mysql2 returns rows array
    if (Array.isArray(resultOrRows)) {
      return { rows: resultOrRows };
    }

    // resultOrRows is OkPacket for INSERT/UPDATE/DELETE
    const ok = resultOrRows;

    if (returningMatch) {
      const returningCols = returningMatch[1].trim();
      const tableName = (insertMatch && insertMatch[1]) || (updateMatch && updateMatch[1]);

      // If we have an insertId, fetch the inserted row
      if (ok.insertId && tableName) {
        const [rows] = await conn.execute(`SELECT * FROM \`${tableName}\` WHERE id = ? LIMIT 1`, [ok.insertId]);
        return { rows };
      }

      // If query had WHERE id = $n, try to extract id param index
      const whereIdMatch = /WHERE\s+id\s*=\s*\$(\d+)/i.exec(originalSql);
      if (whereIdMatch && tableName) {
        const idx = parseInt(whereIdMatch[1], 10) - 1;
        const idVal = params[idx];
        if (idVal !== undefined) {
          const [rows] = await conn.execute(`SELECT * FROM \`${tableName}\` WHERE id = ? LIMIT 1`, [idVal]);
          return { rows };
        }
      }
    }

    // Default response for non-select: return metadata-like rows array
    return { rows: [{ insertId: ok.insertId || null, affectedRows: ok.affectedRows || 0 }] };
  } catch (err) {
    console.error('Database query error:', err);
    throw err;
  }
}

module.exports = { query, pool };
