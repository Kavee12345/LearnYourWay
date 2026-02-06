const db = require('../config/database');
const adaptiveService = require('../services/adaptiveService');
const geminiService = require('../services/geminiService');

/**
 * Quiz Controller - Handles quiz submission and scoring
 */
class QuizController {
  /**
   * Get quiz for a lesson
   */
  async getQuiz(req, res) {
    try {
      const result = await db.query(
        'SELECT * FROM quizzes WHERE id = $1',
        [req.params.quizId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const quiz = result.rows[0];
      
      res.json({
        id: quiz.id,
        lessonId: quiz.lesson_id,
        difficulty: quiz.difficulty_level,
        questions: JSON.parse(quiz.questions)
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Submit quiz answers and get score
   */
  async submitQuiz(req, res) {
    try {
      const { quizId, answers } = req.body;

      if (!quizId || !answers) {
        return res.status(400).json({ error: 'Quiz ID and answers are required' });
      }

      // Get quiz
      const quizResult = await db.query(
        'SELECT * FROM quizzes WHERE id = $1',
        [quizId]
      );

      if (quizResult.rows.length === 0) {
        return res.status(404).json({ error: 'Quiz not found' });
      }

      const quiz = quizResult.rows[0];
      const questions = JSON.parse(quiz.questions);

      // Calculate score
      let score = 0;
      const detailedResults = [];

      for (let i = 0; i < questions.length; i++) {
        const isCorrect = answers[i] === questions[i].correct_answer;
        if (isCorrect) score++;

        detailedResults.push({
          questionIndex: i,
          question: questions[i].question,
          userAnswer: answers[i],
          correctAnswer: questions[i].correct_answer,
          isCorrect,
          options: questions[i].options
        });
      }

      // Record score
      const scoreRecord = await adaptiveService.recordQuizScore(
        req.user.id,
        quizId,
        score,
        questions.length,
        quiz.difficulty_level
      );

      // Get difficulty adjustment
      const difficultyAdjustment = await geminiService.adjustDifficultyAndRegenerateQuiz(
        score,
        questions.length,
        quiz.difficulty_level
      );

      res.json({
        success: true,
        score,
        totalQuestions: questions.length,
        percentage: (score / questions.length * 100).toFixed(2),
        newDifficulty: scoreRecord.newDifficulty,
        difficultyAdjustment,
        detailedResults
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get user's quiz statistics
   */
  async getUserStatistics(req, res) {
    try {
      const statistics = await adaptiveService.getUserStatistics(req.user.id);

      res.json({
        success: true,
        statistics
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get quiz history for user
   */
  async getQuizHistory(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);
      const offset = parseInt(req.query.offset) || 0;

      const result = await db.query(
        `SELECT 
           qs.id,
           qs.quiz_id,
           qs.score,
           qs.total_questions,
           qs.difficulty_level,
           qs.completed_at,
           l.title as lesson_title
         FROM quiz_scores qs
         JOIN quizzes q ON qs.quiz_id = q.id
         JOIN lessons l ON q.lesson_id = l.id
         WHERE qs.user_id = $1
         ORDER BY qs.completed_at DESC
         LIMIT $2 OFFSET $3`,
        [req.user.id, limit, offset]
      );

      const countResult = await db.query(
        'SELECT COUNT(*) FROM quiz_scores WHERE user_id = $1',
        [req.user.id]
      );

      res.json({
        quizzes: result.rows.map(row => ({
          ...row,
          percentage: (row.score / row.total_questions * 100).toFixed(2)
        })),
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new QuizController();
