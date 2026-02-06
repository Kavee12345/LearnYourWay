const db = require('../config/database');

/**
 * User Model
 */
class User {
  static async findById(id) {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async create(email, hashedPassword, username) {
    const result = await db.query(
      'INSERT INTO users (email, password, username) VALUES ($1, $2, $3) RETURNING *',
      [email, hashedPassword, username]
    );
    return result.rows[0];
  }

  static async updateDifficulty(userId, difficultyLevel) {
    const result = await db.query(
      'UPDATE users SET difficulty_level = $1 WHERE id = $2 RETURNING *',
      [difficultyLevel, userId]
    );
    return result.rows[0];
  }

  static async getAllUsers() {
    const result = await db.query('SELECT id, email, username, difficulty_level, created_at FROM users');
    return result.rows;
  }
}

module.exports = User;
