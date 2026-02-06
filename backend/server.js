const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ==================== MIDDLEWARE ====================

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// PDF Upload Routes (Demo)
app.use('/api/upload', require('./routes/upload-demo'));

// Quiz Routes (Demo)
app.use('/api/quiz', require('./routes/quiz-demo'));

// ==================== ERROR HANDLER ====================

app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 50MB' });
    }
    return res.status(400).json({ error: err.message });
  }

  // File type errors
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: err.message });
  }

  res.status(500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// ==================== 404 HANDLER ====================

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ==================== START SERVER ====================

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════╗
║   Learn Your Way Educational Suite - Backend  ║
║   Server running on port ${PORT}                  ║
║   Environment: ${process.env.NODE_ENV}          ║
╚════════════════════════════════════════════════╝
  `);

  // Check critical services
  checkServices();
});

/**
 * Check critical services
 */
async function checkServices() {
  try {
    const geminiService = require('./services/geminiService');
    const apiValid = await geminiService.validateAPIKey();
    console.log(`Gemini API: ${apiValid ? '✓ Valid' : '✗ Invalid'}`);
  } catch (err) {
    console.warn('⚠ Gemini API validation warning:', err.message);
  }
}

module.exports = app;
