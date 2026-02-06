# Learn Your Way Educational Suite

> Convert textbooks into interactive AI-powered lessons with adaptive difficulty

## 🚀 Overview

Learn Your Way Educational Suite is a comprehensive platform that transforms educational PDFs into interactive lessons featuring:

- **AI-Generated Content**: Automatically creates summaries, visual concepts, and quizzes using Google Gemini 1.5 Pro
- **Adaptive Learning**: Adjusts difficulty based on user quiz performance
- **Vector-Powered Search**: Uses ChromaDB for semantic search through lesson content
- **Real-time Feedback**: Immediate quiz scoring with personalized recommendations

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Features](#features)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

## 🏃 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 5.7+
- npm or yarn

### 5-Minute Setup

**Automatic (Windows):**
```powershell
# Run the startup script
.\run.ps1
```

**Manual:**
```bash
# 1. Clone/Initialize project
cd learn-your-way-suite

# 2. Set up environment
# Edit .env with your MySQL credentials

# 3. Install dependencies & Setup database
node start-project.js

# OR manually:
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
node setup-db.js

# 4. Start services (in separate terminals)
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

**Access**: http://localhost:3000

For detailed setup, see [RUNNING_PROJECT.md](./RUNNING_PROJECT.md)

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                        │
│  Dashboard | Upload | Quiz | Statistics                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ HTTP/REST API
                     │
┌─────────────────────▼────────────────────────────────────────┐
│              Backend (Node.js/Express)                        │
├─────────────────────────────────────────────────────────────┤
│  Routes: /upload, /quiz, /lessons                           │
│  Controllers: PDF, Quiz, Lesson                             │
│  Services: Gemini, ChromaDB, Adaptive                       │
└────────┬──────────────────────┬──────────────────────┬───────┘
         │                      │                      │
    ┌────▼────┐         ┌──────▼──────┐        ┌──────▼──────┐
    │ MySQL    │         │ ChromaDB    │        │Gemini API   │
    │ Database │         │ (Vector DB) │        │(AI Engine)  │
    └──────────┘         └─────────────┘        └─────────────┘
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React 18, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, MySQL 5.7+ |
| **AI** | Google Gemini 1.5 Pro |
| **Vector DB** | ChromaDB |
| **File Processing** | pdf-parse |
| **Authentication** | JWT |

## ✨ Features

### 1. PDF to Lesson Conversion
- Automatic text extraction from PDFs
- Intelligent text chunking (500-word chunks)
- Support for up to 50MB files

### 2. AI-Powered Lesson Generation
- **Summary**: Comprehensive overview (2-3 paragraphs)
- **Visual Concepts**: 3 diagrams with explanations
- **Interactive Quiz**: 5 multiple-choice questions

### 3. Adaptive Learning System
- Performance-based difficulty adjustment
- Score tracking and analytics
- Personalized recommendations

### 4. Vector Embeddings & RAG
- Semantic search through lesson content
- Related content suggestions
- Context-aware responses

### 5. User Analytics
- Quiz performance tracking
- Difficulty progression
- Learning statistics dashboard

## 📦 Installation

### Step 1: Prerequisites

**Windows**:
```bash
# Install Node.js from https://nodejs.org
# Install PostgreSQL from https://www.postgresql.org/download/windows/
# Install Python from https://www.python.org/downloads/
```

**macOS**:
```bash
brew install node postgresql python3
```

**Linux** (Ubuntu/Debian):
```bash
sudo apt-get update
sudo apt-get install nodejs postgresql python3 npm
```

### Step 2: Clone Repository

```bash
git clone <repository-url>
cd learn-your-way-suite
```

### Step 3: Environment Setup

```bash
# Copy template
cp .env.example .env

# Edit with your values
nano .env
```

### Step 4: Database Setup

```bash
# Create database
createdb -U postgres learn_your_way

# Run schema
psql -U postgres -d learn_your_way -f database/schema.sql

# Verify (optional)
psql -U postgres -d learn_your_way -c "\dt"
```

### Step 5: Install Dependencies

```bash
# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 6: Start Services

**Terminal 1** - ChromaDB:
```bash
chroma run --host localhost --port 8000
```

**Terminal 2** - Backend:
```bash
cd backend
npm run dev
# Runs on http://localhost:5000
```

**Terminal 3** - Frontend:
```bash
cd frontend
npm run dev
# Runs on http://localhost:3000
```

## ⚙️ Configuration

### Environment Variables

**Required**:
```env
GEMINI_API_KEY=your_key_here        # From https://makersuite.google.com
DATABASE_URL=postgresql://user:pass@localhost/learn_your_way
```

**Optional**:
```env
BACKEND_PORT=5000
NODE_ENV=development
CHROMA_DB_HOST=localhost
CHROMA_DB_PORT=8000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:3000
```

### Get Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click "Create API key"
3. Copy the key
4. Add to `.env` as `GEMINI_API_KEY`

## 📚 API Documentation

### Upload Endpoint

**POST** `/api/upload`

Upload PDF and generate lesson.

```bash
curl -X POST http://localhost:5000/api/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "pdf=@textbook.pdf" \
  -F "title=Quantum Physics 101"
```

**Response**:
```json
{
  "success": true,
  "lessonId": 1,
  "quizId": 1,
  "title": "Quantum Physics 101",
  "difficulty": 1,
  "summary": "...",
  "visualConcepts": [...],
  "quiz": [...]
}
```

### Quiz Endpoints

**GET** `/api/quiz/:quizId`

Get quiz questions.

```bash
curl -X GET http://localhost:5000/api/quiz/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**POST** `/api/quiz/submit`

Submit quiz answers.

```bash
curl -X POST http://localhost:5000/api/quiz/submit \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quizId": 1,
    "answers": [0, 2, 1, 3, 2]
  }'
```

**Response**:
```json
{
  "success": true,
  "score": 4,
  "totalQuestions": 5,
  "percentage": "80.00",
  "newDifficulty": 2,
  "difficultyAdjustment": {
    "newDifficulty": 2,
    "scorePercentage": "80.00",
    "recommendation": "Increasing difficulty - Great job!"
  }
}
```

### Lessons Endpoints

**GET** `/api/upload/lessons/user/me`

Get all user lessons.

```bash
curl -X GET "http://localhost:5000/api/upload/lessons/user/me?limit=10&offset=0" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**GET** `/api/upload/lessons/:lessonId`

Get specific lesson.

```bash
curl -X GET http://localhost:5000/api/upload/lessons/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**DELETE** `/api/upload/lessons/:lessonId`

Delete lesson.

```bash
curl -X DELETE http://localhost:5000/api/upload/lessons/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

For more endpoints, see [SETUP_GUIDE.md](./SETUP_GUIDE.md#part-8-api-routes)

## 🐛 Troubleshooting

### Common Issues

#### 1. PostgreSQL Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:5432`

**Solution**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list               # macOS

# Start PostgreSQL
sudo systemctl start postgresql   # Linux
brew services start postgresql   # macOS
```

#### 2. ChromaDB Connection Error

**Error**: `Error: connect ECONNREFUSED 127.0.0.1:8000`

**Solution**:
```bash
# Make sure ChromaDB is running in another terminal
chroma run --host localhost --port 8000
```

#### 3. Gemini API Error

**Error**: `Error: 401 Unauthorized`

**Solution**:
- Verify `GEMINI_API_KEY` in `.env`
- Check API is enabled: https://makersuite.google.com
- Ensure no special characters in key

#### 4. PDF Upload Failed

**Error**: `MulterError: File too large`

**Solution**:
- Maximum file size is 50MB
- Compress or split your PDF

**Error**: `Could not extract text from PDF`

**Solution**:
- PDF might be scanned (image-based)
- Try a text-based PDF
- Some PDFs are encrypted

#### 5. Frontend Cannot Connect to Backend

**Error**: `CORS error` or connection refused

**Solution**:
```env
# In frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## 🚀 Deployment

### Deploy Backend to Render

1. Create account at [render.com](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set environment variables
5. Deploy

### Deploy Frontend to Vercel

1. Create account at [vercel.com](https://vercel.com)
2. Import Next.js project
3. Set `NEXT_PUBLIC_API_URL` to your backend URL
4. Deploy

### Database Migration

```bash
# Backup current database
pg_dump -U postgres learn_your_way > backup.sql

# Create new database on production server
psql -U postgres -f database/schema.sql
```

## 📊 Performance Optimization

### Database Indexes
Already configured for:
- User email lookups
- Lesson queries by user
- Quiz score history
- Document chunk retrieval

### Caching Strategy
- Lesson content cached on frontend
- Quiz results cached in Redis (optional)
- Vector embeddings cached in ChromaDB

### Load Optimization
- PDF chunking: 500-word optimal size
- Frontend lazy loading for lessons
- API response pagination

## 🤝 Contributing

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

## 📄 License

MIT License - see LICENSE file

## 📞 Support

- 📧 Email: support@learnyourway.com
- 📖 Documentation: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- 🐛 Issues: Use GitHub Issues

## 🗺️ Project Roadmap

- [ ] User authentication system
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Offline mode
- [ ] Advanced analytics
- [ ] Teacher dashboard
- [ ] Content marketplace
- [ ] Multi-language support

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- ChromaDB for vector embeddings
- PostgreSQL for reliable data storage
- Next.js for frontend framework

---

**Version**: 1.0.0  
**Last Updated**: February 2026

For more detailed information, please refer to the [complete setup guide](./SETUP_GUIDE.md) and [quick start guide](./QUICK_START.md).
