const db = require('../config/database');

/**
 * Lesson Model
 */
class Lesson {
  static async findById(id, userId = null) {
    let query = 'SELECT * FROM lessons WHERE id = $1';
    const params = [id];

    if (userId) {
      query += ' AND user_id = $2';
      params.push(userId);
    }

    const result = await db.query(query, params);
    return result.rows[0];
  }

  static async findByUserId(userId, limit = 10, offset = 0) {
    const result = await db.query(
      'SELECT id, title, source_pdf_name, created_at FROM lessons WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [userId, limit, offset]
    );
    return result.rows;
  }

  static async create(userId, title, sourcePdfName, lessonContent, summary, visualConcepts) {
    const result = await db.query(
      `INSERT INTO lessons (user_id, title, source_pdf_name, lesson_content, summary, visual_concepts) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [userId, title, sourcePdfName, JSON.stringify(lessonContent), summary, JSON.stringify(visualConcepts)]
    );
    return result.rows[0];
  }

  static async update(id, updateData) {
    const setClause = Object.keys(updateData)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const values = [id, ...Object.values(updateData)];

    const result = await db.query(
      `UPDATE lessons SET ${setClause} WHERE id = $1 RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async deleteById(id) {
    const result = await db.query('DELETE FROM lessons WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  }

  static async countByUserId(userId) {
    const result = await db.query('SELECT COUNT(*) FROM lessons WHERE user_id = $1', [userId]);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Lesson;
