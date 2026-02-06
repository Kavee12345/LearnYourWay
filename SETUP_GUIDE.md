# Learn Your Way Educational Suite - Complete Setup Guide

## Overview
This guide provides step-by-step instructions to build the Learn Your Way Educational Suite, an AI-powered platform that converts textbooks into interactive lessons.

---

## Part 1: Project Initialization

### Step 1.1: Create Project Directory Structure

```bash
# Create main project directory
mkdir learn-your-way-suite
cd learn-your-way-suite

# Create subdirectories
mkdir backend frontend database ai_services public

# Initialize git
git init
```

### Step 1.2: Create Environment Files

**Create `.env` file in project root:**
```
# Backend
BACKEND_PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/learn_your_way
MONGODB_URI=mongodb://localhost:27017/learn_your_way

# AWS S3 (if using cloud storage)
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET=learn-your-way-bucket
AWS_REGION=us-east-1

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# ChromaDB
CHROMA_DB_HOST=localhost
CHROMA_DB_PORT=8000

# JWT Authentication
JWT_SECRET=your_jwt_secret_key
```

---

## Part 2: Backend Setup (Node.js)

### Step 2.1: Initialize Node.js Project

```bash
cd backend
npm init -y
```

### Step 2.2: Install Core Dependencies

```bash
npm install express cors dotenv multer pdf-parse axios pg mongoose chromadb
npm install --save-dev nodemon
```

### Step 2.3: Create Backend Project Structure

```
backend/
├── server.js
├── .env
├── config/
│   ├── database.js
│   ├── gemini.js
│   └── chroma.js
├── routes/
│   ├── upload.js
│   ├── lessons.js
│   └── quiz.js
├── controllers/
│   ├── pdfController.js
│   ├── lessonController.js
│   └── quizController.js
├── middleware/
│   ├── auth.js
│   └── errorHandler.js
├── services/
│   ├── pdfService.js
│   ├── geminiService.js
│   └── chromaService.js
└── models/
    ├── User.js
    ├── Lesson.js
    └── QuizScore.js
```

### Step 2.4: Create Main Server File

**`backend/server.js`**
```javascript
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/upload', require('./routes/upload'));
app.use('/api/lessons', require('./routes/lessons'));
app.use('/api/quiz', require('./routes/quiz'));

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.BACKEND_PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2.5: Configure Database Connection

**`backend/config/database.js`**
```javascript
const pg = require('pg');
require('dotenv').config();

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

module.exports = pool;
```

---

## Part 3: Database Setup

### Step 3.1: Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run installer and follow prompts
- Note: username (default: postgres), password, and port

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 3.2: Create Database and Tables

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE learn_your_way;

# Connect to new database
\c learn_your_way
```

### Step 3.3: Create Database Schema

**`database/schema.sql`**
```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(100) NOT NULL,
  difficulty_level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lessons Table
CREATE TABLE lessons (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  source_pdf_name VARCHAR(255),
  lesson_content JSONB,
  summary TEXT,
  visual_concepts JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Table
CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id),
  questions JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz Scores Table (for adaptive learning)
CREATE TABLE quiz_scores (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id),
  quiz_id INT REFERENCES quizzes(id),
  score INT,
  correct_answers INT,
  total_questions INT,
  difficulty_level INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Document Embeddings Table (for RAG)
CREATE TABLE document_chunks (
  id SERIAL PRIMARY KEY,
  lesson_id INT REFERENCES lessons(id),
  chunk_text TEXT NOT NULL,
  embedding_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_lessons_user_id ON lessons(user_id);
CREATE INDEX idx_quiz_scores_user_id ON quiz_scores(user_id);
```

**Run the schema:**
```bash
psql -U postgres -d learn_your_way -f database/schema.sql
```

---

## Part 4: PDF Processing Setup

### Step 4.1: Create PDF Service

**`backend/services/pdfService.js`**
```javascript
const pdfParse = require('pdf-parse');
const fs = require('fs');

class PDFService {
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      
      return {
        text: data.text,
        pages: data.numpages,
        metadata: data.info
      };
    } catch (error) {
      throw new Error(`PDF parsing failed: ${error.message}`);
    }
  }

  async chunkPDFText(text, chunkSize = 500) {
    const words = text.split(' ');
    const chunks = [];
    let currentChunk = '';

    for (const word of words) {
      if ((currentChunk + word).length > chunkSize) {
        chunks.push(currentChunk.trim());
        currentChunk = word + ' ';
      } else {
        currentChunk += word + ' ';
      }
    }
    
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
  }
}

module.exports = new PDFService();
```

### Step 4.2: Create Upload Controller

**`backend/controllers/pdfController.js`**
```javascript
const pdfService = require('../services/pdfService');
const geminiService = require('../services/geminiService');
const chromaService = require('../services/chromaService');
const db = require('../config/database');

class PDFController {
  async uploadPDF(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Extract text from PDF
      const extractedData = await pdfService.extractTextFromPDF(req.file.path);

      // Chunk the text
      const chunks = await pdfService.chunkPDFText(extractedData.text);

      // Create lesson with Gemini AI
      const lessonContent = await geminiService.generateLesson(extractedData.text);

      // Store lesson in database
      const result = await db.query(
        'INSERT INTO lessons (user_id, title, source_pdf_name, lesson_content, summary) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [req.user.id, req.body.title, req.file.originalname, JSON.stringify(lessonContent), lessonContent.summary]
      );

      const lessonId = result.rows[0].id;

      // Store chunks in ChromaDB and link to lesson
      await chromaService.storeChunks(lessonId, chunks);

      // Store document embeddings in PostgreSQL
      for (const chunk of chunks) {
        await db.query(
          'INSERT INTO document_chunks (lesson_id, chunk_text) VALUES ($1, $2)',
          [lessonId, chunk]
        );
      }

      res.json({
        success: true,
        lessonId,
        lessonContent,
        message: 'PDF processed successfully'
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new PDFController();
```

---

## Part 5: AI Integration (Gemini API)

### Step 5.1: Install Gemini SDK

```bash
cd backend
npm install @google/generative-ai
```

### Step 5.2: Create Gemini Service

**`backend/services/geminiService.js`**
```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

class GeminiService {
  async generateLesson(textContent, difficultyLevel = 1) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      const prompt = `Convert this educational text into a structured 3-part interactive lesson. 
      Difficulty Level: ${difficultyLevel} (1=beginner, 5=advanced)
      
      Requirements:
      1. Create a comprehensive summary (2-3 paragraphs)
      2. Generate 3 visual concepts with descriptions
      3. Create a 5-question quiz with multiple choice options
      
      Format the response as JSON with keys: summary, visual_concepts (array with title/description), quiz (array of questions with options and correct_answer)
      
      Text to convert:
      ${textContent}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      return JSON.parse(responseText);
    } catch (error) {
      throw new Error(`Gemini API error: ${error.message}`);
    }
  }

  async adjustDifficultyAndRegenerateQuiz(userScore, totalQuestions, currentDifficulty) {
    try {
      const scorePercentage = (userScore / totalQuestions) * 100;

      // Adjust difficulty based on performance
      let newDifficulty = currentDifficulty;
      if (scorePercentage >= 80) {
        newDifficulty = Math.min(currentDifficulty + 1, 5);
      } else if (scorePercentage < 50) {
        newDifficulty = Math.max(currentDifficulty - 1, 1);
      }

      return {
        newDifficulty,
        scorePercentage,
        recommendation: scorePercentage >= 80 ? 'Increasing difficulty' : scorePercentage < 50 ? 'Decreasing difficulty' : 'Maintaining difficulty'
      };
    } catch (error) {
      throw new Error(`Difficulty adjustment error: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();
```

---

## Part 6: Vector Database (ChromaDB) Setup

### Step 6.1: Install ChromaDB

```bash
pip install chromadb
```

### Step 6.2: Start ChromaDB Server

```bash
chroma run --host localhost --port 8000
```

### Step 6.3: Create Chroma Service

**`backend/services/chromaService.js`**
```javascript
const axios = require('axios');
require('dotenv').config();

const CHROMA_API = `http://${process.env.CHROMA_DB_HOST}:${process.env.CHROMA_DB_PORT}/api/v1`;

class ChromaService {
  async storeChunks(lessonId, chunks) {
    try {
      // Create or get collection
      const collectionName = `lesson_${lessonId}`;
      
      // Prepare documents for storage
      const documents = chunks.map((chunk, index) => ({
        id: `${lessonId}_${index}`,
        content: chunk,
        metadata: { lesson_id: lessonId }
      }));

      // Store in ChromaDB
      await axios.post(`${CHROMA_API}/collections`, {
        name: collectionName,
        metadata: { lesson_id: lessonId }
      }).catch(err => {
        // Collection might already exist
        console.log('Collection exists or error:', err.message);
      });

      // Add documents
      for (const doc of documents) {
        await axios.post(`${CHROMA_API}/collections/${collectionName}/add`, {
          ids: [doc.id],
          embeddings: null, // Chroma will auto-generate embeddings
          documents: [doc.content],
          metadatas: [doc.metadata]
        });
      }

      console.log(`Stored ${chunks.length} chunks for lesson ${lessonId}`);
    } catch (error) {
      throw new Error(`ChromaDB storage error: ${error.message}`);
    }
  }

  async retrieveRelevantChunks(query, lessonId, topK = 5) {
    try {
      const collectionName = `lesson_${lessonId}`;
      
      const response = await axios.post(
        `${CHROMA_API}/collections/${collectionName}/query`,
        {
          query_texts: [query],
          n_results: topK
        }
      );

      return response.data.documents[0] || [];
    } catch (error) {
      throw new Error(`ChromaDB retrieval error: ${error.message}`);
    }
  }
}

module.exports = new ChromaService();
```

---

## Part 7: Adaptive Learning Logic

### Step 7.1: Create Adaptive Difficulty Script

**`backend/services/adaptiveService.js`**
```javascript
const db = require('../config/database');
const geminiService = require('./geminiService');

class AdaptiveService {
  async calculateUserDifficulty(userId) {
    try {
      // Get last 5 quiz scores
      const result = await db.query(
        'SELECT score, total_questions, difficulty_level FROM quiz_scores WHERE user_id = $1 ORDER BY completed_at DESC LIMIT 5',
        [userId]
      );

      if (result.rows.length === 0) {
        return 1; // Start with beginner level
      }

      const scores = result.rows;
      const avgScore = scores.reduce((sum, s) => sum + (s.score / s.total_questions), 0) / scores.length;

      // Determine appropriate difficulty
      if (avgScore >= 0.85) return Math.min(scores[0].difficulty_level + 1, 5);
      if (avgScore <= 0.50) return Math.max(scores[0].difficulty_level - 1, 1);
      return scores[0].difficulty_level;
    } catch (error) {
      throw new Error(`Difficulty calculation error: ${error.message}`);
    }
  }

  async recordQuizScore(userId, quizId, score, totalQuestions, difficultyLevel) {
    try {
      const result = await db.query(
        'INSERT INTO quiz_scores (user_id, quiz_id, score, correct_answers, total_questions, difficulty_level) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userId, quizId, score, score, totalQuestions, difficultyLevel]
      );

      // Update user's overall difficulty level
      const newDifficulty = await this.calculateUserDifficulty(userId);
      await db.query('UPDATE users SET difficulty_level = $1 WHERE id = $2', [newDifficulty, userId]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`Score recording error: ${error.message}`);
    }
  }
}

module.exports = new AdaptiveService();
```

---

## Part 8: API Routes

### Step 8.1: Create Upload Route

**`backend/routes/upload.js`**
```javascript
const express = require('express');
const multer = require('multer');
const pdfController = require('../controllers/pdfController');
const auth = require('../middleware/auth');

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/', auth, upload.single('pdf'), pdfController.uploadPDF);

module.exports = router;
```

### Step 8.2: Create Lessons Route

**`backend/routes/lessons.js`**
```javascript
const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const chromaService = require('../services/chromaService');

const router = express.Router();

router.get('/:lessonId', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM lessons WHERE id = $1 AND user_id = $2',
      [req.params.lessonId, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/user/:userId', auth, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, created_at FROM lessons WHERE user_id = $1 ORDER BY created_at DESC',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### Step 8.3: Create Quiz Route

**`backend/routes/quiz.js`**
```javascript
const express = require('express');
const db = require('../config/database');
const auth = require('../middleware/auth');
const adaptiveService = require('../services/adaptiveService');

const router = express.Router();

router.post('/submit', auth, async (req, res) => {
  try {
    const { quizId, score, totalQuestions } = req.body;

    const difficultyLevel = await adaptiveService.calculateUserDifficulty(req.user.id);
    
    const result = await adaptiveService.recordQuizScore(
      req.user.id,
      quizId,
      score,
      totalQuestions,
      difficultyLevel
    );

    res.json({
      success: true,
      score,
      totalQuestions,
      percentage: (score / totalQuestions * 100).toFixed(2),
      newDifficulty: result.difficulty_level
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## Part 9: Frontend Setup (Next.js)

### Step 9.1: Create Next.js Project

```bash
npx create-next-app@latest frontend --typescript --tailwind
cd frontend
```

### Step 9.2: Install Dependencies

```bash
npm install axios zustand next-auth axios-interceptor
```

### Step 9.3: Project Structure

```
frontend/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   └── [lessonId]/
│   │       └── page.tsx
│   ├── upload/
│   │   └── page.tsx
│   └── quiz/
│       └── [quizId]/
│           └── page.tsx
├── components/
│   ├── LessonCard.tsx
│   ├── PDFUploader.tsx
│   ├── QuizComponent.tsx
│   ├── VisualConcept.tsx
│   └── LessonSummary.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   ├── api.ts
│   └── lessonService.ts
└── lib/
    └── store.ts
```

### Step 9.4: Create API Service

**`frontend/services/api.ts`**
```typescript
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadPDF = (file: File, title: string) => {
  const formData = new FormData();
  formData.append('pdf', file);
  formData.append('title', title);

  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getLesson = (lessonId: string) => {
  return api.get(`/lessons/${lessonId}`);
};

export const getUserLessons = () => {
  return api.get('/lessons/user/me');
};

export const submitQuiz = (quizId: string, score: number, totalQuestions: number) => {
  return api.post('/quiz/submit', { quizId, score, totalQuestions });
};

export default api;
```

### Step 9.5: Create Lesson Component

**`frontend/components/LessonCard.tsx`**
```typescript
import React from 'react';
import Link from 'next/link';

interface LessonCardProps {
  id: string;
  title: string;
  createdAt: string;
  summary: string;
}

export const LessonCard: React.FC<LessonCardProps> = ({
  id,
  title,
  createdAt,
  summary,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">
        {new Date(createdAt).toLocaleDateString()}
      </p>
      <p className="text-gray-700 mb-4 line-clamp-2">{summary}</p>
      <Link href={`/dashboard/${id}`}>
        <a className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          View Lesson
        </a>
      </Link>
    </div>
  );
};
```

### Step 9.6: Create PDF Uploader Component

**`frontend/components/PDFUploader.tsx`**
```typescript
import React, { useState } from 'react';
import { uploadPDF } from '@/services/api';

export const PDFUploader: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !title) {
      setMessage('Please select a file and enter a title');
      return;
    }

    setLoading(true);
    try {
      const response = await uploadPDF(file, title);
      setMessage(`Success! Lesson created with ID: ${response.data.lessonId}`);
      setFile(null);
      setTitle('');
    } catch (error: any) {
      setMessage(`Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Lesson Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Enter lesson title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Upload PDF</label>
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded">
          {message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Create Lesson'}
      </button>
    </form>
  );
};
```

### Step 9.7: Create Quiz Component

**`frontend/components/QuizComponent.tsx`**
```typescript
import React, { useState } from 'react';
import { submitQuiz } from '@/services/api';

interface Question {
  question: string;
  options: string[];
  correct_answer: number;
}

interface QuizComponentProps {
  quizId: string;
  questions: Question[];
  onComplete?: (score: number) => void;
}

export const QuizComponent: React.FC<QuizComponentProps> = ({
  quizId,
  questions,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correct_answer;
    if (isCorrect) setScore(score + 1);

    if (currentQuestion === questions.length - 1) {
      const finalScore = isCorrect ? score + 1 : score;
      
      try {
        await submitQuiz(quizId, finalScore, questions.length);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }

      setSubmitted(true);
      onComplete?.(finalScore);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  if (submitted) {
    const percentage = ((score / questions.length) * 100).toFixed(2);
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Score: {score}/{questions.length} ({percentage}%)
        </p>
        <button className="bg-blue-500 text-white px-6 py-2 rounded">
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
            }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestion + 1} of {questions.length}
        </p>
      </div>

      <h3 className="text-xl font-bold mb-4">{questions[currentQuestion].question}</h3>

      <div className="space-y-3 mb-6">
        {questions[currentQuestion].options.map((option, index) => (
          <label key={index} className="flex items-center p-3 border rounded cursor-pointer hover:bg-blue-50">
            <input
              type="radio"
              name="answer"
              checked={selectedAnswer === index}
              onChange={() => setSelectedAnswer(index)}
              className="mr-3"
            />
            {option}
          </label>
        ))}
      </div>

      <button
        onClick={handleAnswer}
        disabled={selectedAnswer === null}
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
      </button>
    </div>
  );
};
```

---

## Part 10: Running the Application

### Step 10.1: Start Backend Server

```bash
cd backend
npm run dev
```

### Step 10.2: Start Frontend

```bash
cd frontend
npm run dev
```

### Step 10.3: Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api

---

## Part 11: Environment Configuration Summary

Create `.env.local` in frontend directory:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

## Part 12: Testing the Flow

1. **Upload PDF:**
   - Navigate to http://localhost:3000/upload
   - Select a textbook PDF
   - Enter a lesson title
   - Click "Create Lesson"

2. **View Generated Lesson:**
   - System generates summary, visual concepts, and quiz
   - Content is displayed on the lesson page

3. **Complete Quiz:**
   - Answer all quiz questions
   - System calculates score
   - Adaptive difficulty updates based on performance

4. **Track Progress:**
   - View all lessons on dashboard
   - Check quiz scores and difficulty progression

---

## Troubleshooting

### Common Issues:

1. **PDF Parsing Error**
   - Ensure pdf-parse is installed: `npm install pdf-parse`
   - Check PDF file is not encrypted

2. **Gemini API Error**
   - Verify API key in .env
   - Check API quotas at https://makersuite.google.com

3. **ChromaDB Connection Failed**
   - Ensure ChromaDB server is running: `chroma run --host localhost --port 8000`

4. **PostgreSQL Connection Error**
   - Verify DATABASE_URL is correct
   - Ensure PostgreSQL server is running

---

## Next Steps

- Implement JWT authentication for secure API endpoints
- Add AWS S3 integration for file uploads
- Deploy to production (AWS, Vercel, etc.)
- Add email notifications
- Implement user profiles and settings
