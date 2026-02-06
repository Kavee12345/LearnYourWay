const express = require('express');
const multer = require('multer');
const { authMiddleware } = require('../middleware/auth');
const pdfController = require('../controllers/pdfController');

const router = express.Router();

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

/**
 * POST /api/upload
 * Upload a PDF file and generate a lesson
 * Required: PDF file, lesson title
 */
router.post('/', authMiddleware, upload.single('pdf'), pdfController.uploadPDF);

/**
 * GET /api/lessons/:lessonId
 * Get a specific lesson details
 */
router.get('/lessons/:lessonId', authMiddleware, pdfController.getLesson);

/**
 * GET /api/lessons/user/:userId
 * Get all lessons for a user
 * Query params: limit, offset
 */
router.get('/lessons/user/me', authMiddleware, pdfController.getUserLessons);

/**
 * DELETE /api/lessons/:lessonId
 * Delete a lesson
 */
router.delete('/lessons/:lessonId', authMiddleware, pdfController.deleteLesson);

module.exports = router;
