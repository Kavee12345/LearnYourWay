# Learn Your Way Educational Suite - Quick Start Guide

## Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Python 3.8+ (for ChromaDB)
- Git

## Step 1: Clone/Initialize Project

```bash
cd learn-your-way-suite
git init
```

## Step 2: Set Up Environment Variables

Copy the template and configure:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
- Database credentials
- Gemini API key (get from https://makersuite.google.com)
- Other service configurations

## Step 3: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 4: Set Up PostgreSQL

### Windows (pgAdmin GUI):
1. Open pgAdmin
2. Create new database: `learn_your_way`
3. Open query tool
4. Copy contents of `database/schema.sql`
5. Execute query

### Command Line:
```bash
psql -U postgres
CREATE DATABASE learn_your_way;
\c learn_your_way
```

Then run schema:
```bash
psql -U postgres -d learn_your_way -f database/schema.sql
```

## Step 5: Set Up ChromaDB

### Install ChromaDB:
```bash
pip install chromadb
```

### Start ChromaDB Server:
```bash
chroma run --host localhost --port 8000
```

This will run in the foreground. Keep this terminal open or run in background.

## Step 6: Start Backend Server

```bash
cd backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════╗
║   Learn Your Way Educational Suite - Backend  ║
║   Server running on port 5000                 ║
╚════════════════════════════════════════════════╝
```

## Step 7: Set Up Frontend

```bash
# Create frontend if not exists
npx create-next-app@latest frontend --typescript --tailwind --eslint

# Install dependencies
cd frontend
npm install axios zustand next-auth
```

### Create `.env.local` in frontend:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Step 8: Start Frontend

```bash
cd frontend
npm run dev
```

Access at: http://localhost:3000

## Testing the Flow

### 1. Access Application
- Open http://localhost:3000
- You should see the dashboard

### 2. Upload a PDF
- Go to Upload section
- Select a PDF textbook
- Enter lesson title
- Click "Create Lesson"

### 3. View Generated Lesson
- System generates:
  - Summary
  - 3 Visual Concepts
  - 5-Question Quiz

### 4. Take Quiz
- Answer all questions
- System calculates score
- Difficulty adjusts based on performance

## Troubleshooting

### 1. PostgreSQL Connection Failed
```
Error: connect ECONNREFUSED
```
**Solution:** 
- Check PostgreSQL is running
- Verify DATABASE_URL in .env
- Run: `psql -U postgres -c "SELECT 1"`

### 2. ChromaDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:8000
```
**Solution:**
- Ensure ChromaDB server is running: `chroma run --host localhost --port 8000`
- Check if port 8000 is available

### 3. Gemini API Error
```
Error: 401 Unauthorized
```
**Solution:**
- Verify GEMINI_API_KEY in .env
- Get key from https://makersuite.google.com
- Check API quotas

### 4. File Upload Failed
```
MulterError: File too large
```
**Solution:**
- PDF must be under 50MB
- Check file size before uploading

### 5. PDF Parsing Error
```
Error: Could not extract text from PDF
```
**Solution:**
- PDF might be image-based (scanned)
- PDF might be encrypted
- Try with another PDF file

## Project Structure

```
learn-your-way-suite/
├── backend/                    # Node.js/Express server
│   ├── server.js              # Main server file
│   ├── config/                # Configuration files
│   ├── controllers/           # Request handlers
│   ├── services/              # Business logic
│   ├── models/                # Database models
│   ├── middleware/            # Express middleware
│   ├── routes/                # API routes
│   └── package.json           # Dependencies
├── frontend/                  # Next.js application
│   ├── app/                   # Next.js app directory
│   ├── components/            # React components
│   ├── services/              # API services
│   └── package.json           # Dependencies
├── database/
│   └── schema.sql             # PostgreSQL schema
├── uploads/                   # Temporary PDF uploads
├── .env.example               # Environment template
└── SETUP_GUIDE.md            # Full setup documentation
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| BACKEND_PORT | Server port | 5000 |
| DATABASE_URL | PostgreSQL connection | postgresql://user:pass@localhost:5432/db |
| GEMINI_API_KEY | Google Gemini API key | ai-abc123... |
| CHROMA_DB_HOST | ChromaDB server host | localhost |
| CHROMA_DB_PORT | ChromaDB server port | 8000 |
| JWT_SECRET | JWT signing secret | your_secret_key |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |

## API Endpoints

### Upload & Lessons
- `POST /api/upload` - Upload PDF and create lesson
- `GET /api/upload/lessons/me` - Get user's lessons
- `GET /api/upload/lessons/:lessonId` - Get specific lesson
- `DELETE /api/upload/lessons/:lessonId` - Delete lesson

### Quiz
- `GET /api/quiz/:quizId` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/statistics/user` - Get user statistics
- `GET /api/quiz/history/user` - Get quiz history

## Performance Tips

1. **Database Indexes**: Already created in schema for fast queries
2. **PDF Chunking**: 500-word chunks for optimal Gemini processing
3. **Caching**: Consider adding Redis for lesson caching
4. **CDN**: Deploy frontend on Vercel, backend on Render or AWS

## Next Steps After Setup

1. **Authentication**: Implement login/signup
2. **AWS S3**: Use for permanent PDF storage
3. **Email Notifications**: Send quiz results via email
4. **Mobile App**: Build React Native version
5. **Analytics**: Track user progress and learning patterns
6. **Deployment**: Deploy to production servers

## Support & Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [ChromaDB Documentation](https://docs.trychroma.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT

---

**Last Updated**: February 2026
