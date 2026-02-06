const express = require('express');
const { authMiddleware } = require('../middleware/auth');
const quizController = require('../controllers/quizController');

const router = express.Router();

/**
 * GET /api/quiz/:quizId
 * Get quiz questions for a specific quiz
 */
router.get('/:quizId', authMiddleware, quizController.getQuiz);

/**
 * POST /api/quiz/submit
 * Submit quiz answers and get score
 * Body: { quizId, answers: [] }
 */
router.post('/submit', authMiddleware, quizController.submitQuiz);

/**
 * GET /api/quiz/statistics
 * Get user's quiz statistics
 */
router.get('/statistics/user', authMiddleware, quizController.getUserStatistics);

/**
 * GET /api/quiz/history
 * Get user's quiz history
 * Query params: limit, offset
 */
router.get('/history/user', authMiddleware, quizController.getQuizHistory);

module.exports = router;
