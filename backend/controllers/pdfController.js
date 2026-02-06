const pdfService = require('../services/pdfService');
const geminiService = require('../services/geminiService');
const chromaService = require('../services/chromaService');
const adaptiveService = require('../services/adaptiveService');
const Lesson = require('../models/Lesson');
const db = require('../config/database');
const fs = require('fs');
const path = require('path');

/**
 * PDF Controller - Handles PDF uploads and lesson generation
 */
class PDFController {
  /**
   * Upload and process PDF
   */
  async uploadPDF(req, res) {
    let filePath = null;
    
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      if (!req.body.title) {
        return res.status(400).json({ error: 'Lesson title is required' });
      }

      filePath = req.file.path;

      // Step 1: Extract text from PDF
      console.log('Extracting text from PDF...');
      const extractedData = await pdfService.extractTextFromPDF(filePath);

      if (!extractedData.text) {
        return res.status(400).json({ error: 'Could not extract text from PDF' });
      }

      // Step 2: Chunk the text
      console.log('Chunking text...');
      const chunks = await pdfService.chunkPDFText(extractedData.text, 500);

      // Step 3: Get user's recommended difficulty
      console.log('Calculating user difficulty...');
      const userDifficulty = await adaptiveService.getRecommendedDifficulty(req.user.id);

      // Step 4: Generate lesson using Gemini
      console.log('Generating lesson with Gemini API...');
      const lessonContent = await geminiService.generateLesson(extractedData.text, userDifficulty);

      // Step 5: Store lesson in database
      console.log('Storing lesson in database...');
      const lesson = await Lesson.create(
        req.user.id,
        req.body.title,
        req.file.originalname,
        lessonContent,
        lessonContent.summary,
        lessonContent.visual_concepts
      );

      // Step 6: Create quiz entry
      const quizResult = await db.query(
        'INSERT INTO quizzes (lesson_id, questions, difficulty_level) VALUES ($1, $2, $3) RETURNING id',
        [lesson.id, JSON.stringify(lessonContent.quiz), userDifficulty]
      );

      // Step 7: Store chunks in ChromaDB
      console.log('Storing document chunks in ChromaDB...');
      await chromaService.storeChunks(lesson.id, chunks);

      // Step 8: Store document embeddings in PostgreSQL
      console.log('Storing document embeddings...');
      for (const chunk of chunks) {
        await db.query(
          'INSERT INTO document_chunks (lesson_id, chunk_text) VALUES ($1, $2)',
          [lesson.id, chunk]
        );
      }

      res.status(201).json({
        success: true,
        lessonId: lesson.id,
        quizId: quizResult.rows[0].id,
        title: lesson.title,
        difficulty: userDifficulty,
        summary: lessonContent.summary,
        visualConcepts: lessonContent.visual_concepts,
        quiz: lessonContent.quiz,
        message: 'PDF processed successfully and lesson created'
      });
    } catch (error) {
      console.error('PDF upload error:', error);
      res.status(500).json({ error: error.message });
    } finally {
      // Clean up uploaded file
      if (filePath && fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.warn('Could not delete uploaded file:', err.message);
        }
      }
    }
  }

  /**
   * Get lesson details
   */
  async getLesson(req, res) {
    try {
      const lesson = await Lesson.findById(req.params.lessonId, req.user.id);

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      res.json({
        id: lesson.id,
        title: lesson.title,
        sourcePdfName: lesson.source_pdf_name,
        summary: lesson.summary,
        visualConcepts: JSON.parse(lesson.visual_concepts),
        createdAt: lesson.created_at
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get all lessons for user
   */
  async getUserLessons(req, res) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 10, 50);
      const offset = parseInt(req.query.offset) || 0;

      const lessons = await Lesson.findByUserId(req.user.id, limit, offset);
      const count = await Lesson.countByUserId(req.user.id);

      res.json({
        lessons,
        total: count,
        limit,
        offset
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Delete a lesson
   */
  async deleteLesson(req, res) {
    try {
      const lesson = await Lesson.findById(req.params.lessonId, req.user.id);

      if (!lesson) {
        return res.status(404).json({ error: 'Lesson not found' });
      }

      // Delete from ChromaDB
      await chromaService.deleteCollection(lesson.id);

      // Delete from database
      await Lesson.deleteById(lesson.id);

      res.json({ success: true, message: 'Lesson deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PDFController();
