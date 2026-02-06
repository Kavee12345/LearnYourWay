const db = require('../config/database');

/**
 * Adaptive Learning Service - Handles user difficulty progression
 */
class AdaptiveService {
  /**
   * Calculate appropriate difficulty level based on user's quiz history
   * @param {number} userId - User ID
   * @returns {Promise<number>} - Recommended difficulty level (1-5)
   */
  async calculateUserDifficulty(userId) {
    try {
      // Get last 5 quiz scores
      const result = await db.query(
        `SELECT score, total_questions, difficulty_level 
         FROM quiz_scores 
         WHERE user_id = $1 
         ORDER BY completed_at DESC 
         LIMIT 5`,
        [userId]
      );

      if (result.rows.length === 0) {
        return 1; // Start with beginner level
      }

      const scores = result.rows;
      const avgScore = scores.reduce((sum, s) => sum + (s.score / s.total_questions), 0) / scores.length;
      const currentDifficulty = scores[0].difficulty_level;

      // Adaptive logic
      if (avgScore >= 0.85) {
        return Math.min(currentDifficulty + 1, 5);
      } else if (avgScore <= 0.50) {
        return Math.max(currentDifficulty - 1, 1);
      }

      return currentDifficulty;
    } catch (error) {
      console.error('Error calculating user difficulty:', error);
      throw new Error(`Difficulty calculation error: ${error.message}`);
    }
  }

  /**
   * Record a quiz score and update user difficulty
   * @param {number} userId - User ID
   * @param {number} quizId - Quiz ID
   * @param {number} score - Number of correct answers
   * @param {number} totalQuestions - Total questions in quiz
   * @param {number} difficultyLevel - Difficulty of the quiz
   * @returns {Promise<Object>} - Score record and new difficulty
   */
  async recordQuizScore(userId, quizId, score, totalQuestions, difficultyLevel) {
    try {
      const result = await db.query(
        `INSERT INTO quiz_scores 
         (user_id, quiz_id, score, correct_answers, total_questions, difficulty_level) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING *`,
        [userId, quizId, score, score, totalQuestions, difficultyLevel]
      );

      // Calculate and update user's overall difficulty level
      const newDifficulty = await this.calculateUserDifficulty(userId);
      await db.query(
        'UPDATE users SET difficulty_level = $1 WHERE id = $2',
        [newDifficulty, userId]
      );

      return {
        scoreRecord: result.rows[0],
        newDifficulty,
        scorePercentage: (score / totalQuestions * 100).toFixed(2)
      };
    } catch (error) {
      throw new Error(`Score recording error: ${error.message}`);
    }
  }

  /**
   * Get user's learning statistics
   * @param {number} userId - User ID
   * @returns {Promise<Object>} - Statistics including average score, attempts, etc.
   */
  async getUserStatistics(userId) {
    try {
      const quizzesResult = await db.query(
        `SELECT 
           COUNT(*) as total_quizzes,
           AVG(score::float / total_questions * 100) as avg_score_percentage,
           MAX(score::float / total_questions * 100) as best_score_percentage,
           MIN(score::float / total_questions * 100) as worst_score_percentage
         FROM quiz_scores 
         WHERE user_id = $1`,
        [userId]
      );

      const difficultyBreakdownResult = await db.query(
        `SELECT 
           difficulty_level,
           COUNT(*) as attempts,
           AVG(score::float / total_questions * 100) as avg_score_percentage
         FROM quiz_scores 
         WHERE user_id = $1 
         GROUP BY difficulty_level 
         ORDER BY difficulty_level`,
        [userId]
      );

      return {
        totalQuizzes: parseInt(quizzesResult.rows[0]?.total_quizzes || 0),
        averageScorePercentage: parseFloat(quizzesResult.rows[0]?.avg_score_percentage || 0).toFixed(2),
        bestScorePercentage: parseFloat(quizzesResult.rows[0]?.best_score_percentage || 0).toFixed(2),
        worstScorePercentage: parseFloat(quizzesResult.rows[0]?.worst_score_percentage || 0).toFixed(2),
        difficultyBreakdown: difficultyBreakdownResult.rows.map(row => ({
          difficulty: row.difficulty_level,
          attempts: row.attempts,
          averageScore: parseFloat(row.avg_score_percentage).toFixed(2)
        }))
      };
    } catch (error) {
      throw new Error(`Error fetching user statistics: ${error.message}`);
    }
  }

  /**
   * Get recommended next lesson difficulty
   * @param {number} userId - User ID
   * @returns {Promise<number>} - Recommended difficulty for next lesson
   */
  async getRecommendedDifficulty(userId) {
    try {
      const userResult = await db.query(
        'SELECT difficulty_level FROM users WHERE id = $1',
        [userId]
      );

      if (userResult.rows.length === 0) {
        return 1;
      }

      return userResult.rows[0].difficulty_level;
    } catch (error) {
      throw new Error(`Error getting recommended difficulty: ${error.message}`);
    }
  }
}

module.exports = new AdaptiveService();
