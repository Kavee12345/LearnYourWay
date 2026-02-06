# Running the Learn Your Way Educational Suite

This guide explains how to start and run the Learn Your Way Educational Suite project.

## Prerequisites

Before running the project, ensure you have:

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **MySQL Server** (v5.7 or higher) - [Download](https://www.mysql.com/downloads/)
3. All dependencies installed (see Installation section)

## Configuration

The project uses environment variables for configuration. The main `.env` file in the root directory contains:

```
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=Ikavi1920
DB_NAME=learn_your_way

# Backend
BACKEND_PORT=5000

# Frontend
FRONTEND_URL=http://localhost:3000

# APIs
GEMINI_API_KEY=AIzaSyCGuai-qH4zqKgPmoJLrNyo25HQSI8mMjA
```

## Installation

### 1. Automatic Setup (Recommended for Windows)

**Option A: Using PowerShell Script**
```powershell
# Open PowerShell as Administrator and run:
.\run.ps1
```

**Option B: Using Batch Script**
```cmd
# Open Command Prompt and run:
run.bat
```

**Option C: Using Node.js Script**
```bash
node start-project.js
```

### 2. Manual Setup

**Step 1: Install Backend Dependencies**
```bash
cd backend
npm install
cd ..
```

**Step 2: Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

**Step 3: Setup Database**
```bash
node setup-db.js
```

This will:
- Connect to MySQL using credentials in `.env`
- Create the `learn_your_way` database
- Create all required tables and indexes

**Step 4: Start the Backend Server**
```bash
cd backend
npm run dev
```
The backend will be available at `http://localhost:5000`

**Step 5: Start the Frontend Server** (in a new terminal)
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:3000`

## Troubleshooting

### MySQL Connection Issues
- **Error**: "connect ECONNREFUSED 127.0.0.1:3306"
  - **Solution**: Ensure MySQL server is running
  - Windows: Check Services (services.msc) for MySQL service
  - Command: `mysql -u root -p` (should prompt for password)

### Database Credentials
- **Error**: "Access denied for user 'root'"
  - **Solution**: Update `.env` file with correct MySQL credentials
  - Default password in project: `Ikavi1920`
  - Update `DB_PASSWORD` if different

### Missing Dependencies
- **Error**: "Cannot find module 'mysql2'"
  - **Solution**: Run `npm install` in the project root and backend directory

### Port Already in Use
- **Error**: "listen EADDRINUSE: address already in use :::5000"
  - **Solution**: 
    - Change `BACKEND_PORT` in `.env`
    - Or kill process using that port (Windows): `netstat -ano | findstr :5000`

## Project Structure

```
├── backend/                    # Node.js/Express backend
│   ├── routes/                 # API routes
│   ├── controllers/            # Request handlers
│   ├── models/                 # Database models
│   ├── services/               # Business logic
│   ├── middleware/             # Express middleware
│   └── server.js               # Main server file
├── frontend/                   # Next.js/React frontend
│   ├── pages/                  # Route pages
│   ├── components/             # React components
│   └── services/               # API client services
├── database/                   # Database files
│   └── schema.sql              # Database schema
├── .env                        # Environment configuration
├── setup-db.js                 # Database initialization script
└── run.ps1/run.bat            # Quick start scripts
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### PDF Upload
- `POST /api/upload` - Upload and process PDF files

### Quiz
- `GET /api/quiz` - Get quiz questions
- `POST /api/quiz/submit` - Submit quiz answers

## Development

### Backend Development
```bash
cd backend
npm run dev           # Start with nodemon (auto-reload)
npm start             # Start production build
npm test              # Run tests
```

### Frontend Development
```bash
cd frontend
npm run dev           # Start development server
npm run build         # Create production build
npm start             # Start production server
npm run lint          # Run ESLint
```

## Features

- 📚 PDF Upload and Processing
- 🤖 AI-Powered Content Generation (Gemini)
- 📊 Interactive Quizzes
- 🎯 Adaptive Learning Difficulty
- 💾 MySQL Database
- 🔐 JWT Authentication (JWT_SECRET in .env)
- 📈 Progress Tracking

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review `.env` configuration
3. Check MySQL connection status
4. Review console logs for detailed errors

## License

MIT
