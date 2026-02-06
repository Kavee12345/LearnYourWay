# 🚀 START HERE - Quick Launch Guide

## Your Learn Your Way Educational Suite is Ready!

The complete backend, frontend, and database configuration has been set up. Follow these simple steps to run the project.

---

## ⚡ Fastest Way to Start (Recommended)

### Windows PowerShell (Recommended):
```powershell
.\run.ps1
```

### Windows Command Prompt:
```cmd
run.bat
```

### Node.js (Any Platform):
```bash
node start-project.js
```

These scripts will:
1. ✅ Install all dependencies (frontend)
2. ✅ Set up the MySQL database
3. ✅ Start both backend and frontend servers
4. ✅ Open them in new windows

---

## 🛠️ Manual Setup (If Scripts Don't Work)

### Step 1: Ensure MySQL is Running
```bash
# Windows: Check MySQL Service in Services.msc
# Or test: mysql -u root -p
# Password: Ikavi1920
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 3: Setup Database
```bash
node setup-db.js
```

Expected output:
```
✓ Connected to MySQL server
✓ Database 'learn_your_way' ready
✓ Schema applied successfully
```

### Step 4: Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Expected output:
```
╔════════════════════════════════════════════════╗
║   Learn Your Way Educational Suite - Backend  ║
║   Server running on port 5000                  ║
║   Environment: development                      ║
╚════════════════════════════════════════════════╝
```

### Step 5: Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Expected output:
```
▲ Next.js 14.0.0
- Local: http://localhost:3000
```

---

## 🌐 Access Your Application

| Component | URL | Purpose |
|-----------|-----|---------|
| Frontend | http://localhost:3000 | Main application UI |
| Backend API | http://localhost:5000 | REST API server |
| API Health | http://localhost:5000/api/health | Server status |

---

## 📋 Configuration Details

Your project uses:

```
Database:    MySQL (learn_your_way)
Backend:     Node.js + Express (Port 5000)
Frontend:    Next.js + React (Port 3000)
AI:          Google Gemini API
Auth:        JWT Tokens
```

### Environment Variables (.env)
- `DB_HOST`: localhost
- `DB_USER`: root
- `DB_PASSWORD`: Ikavi1920
- `BACKEND_PORT`: 5000
- `FRONTEND_URL`: http://localhost:3000
- `GEMINI_API_KEY`: AIzaSyCGuai-qH4zqKgPmoJLrNyo25HQSI8mMjA

---

## ❓ Common Issues & Solutions

### "Cannot find module"
```bash
# Solution: Install dependencies
cd backend && npm install && cd ..
cd frontend && npm install && cd ..
```

### "MySQL connection refused"
```bash
# MySQL is not running
# Windows: Start MySQL service in Services.msc
# Or: Check if port 3306 is in use
```

### "Port already in use"
```bash
# Backend port 5000 is taken
# Edit .env and change BACKEND_PORT to 5001
```

### "EACCES permission error"
```bash
# Try running with elevated privileges:
# Windows: Right-click Command Prompt → Run as Administrator
```

---

## 📚 Project Structure

```
Project/
├── backend/              # Node.js/Express server
├── frontend/             # Next.js/React app
├── database/
│   └── schema.sql       # Database structure
├── .env                 # Configuration file
├── setup-db.js          # Database initializer
├── run.ps1              # PowerShell launcher
├── run.bat              # Batch launcher
└── start-project.js     # Node.js launcher
```

---

## 🎯 What's Included

✅ **Backend**
- Express.js REST API
- MySQL database integration
- PDF processing
- Google Gemini AI integration
- JWT authentication
- Quiz generation and scoring

✅ **Frontend**
- Next.js 14 application
- React 18 components
- Tailwind CSS styling
- PDF upload interface
- Quiz interface
- Progress dashboard

✅ **Database**
- User management
- Lesson storage
- Quiz system
- Performance tracking
- Document chunking

✅ **Tools**
- Startup scripts (PowerShell, Batch, Node.js)
- Database setup automation
- Environment configuration
- API documentation

---

## 🔄 Development Workflow

### Make Changes
Edit files in `backend/` or `frontend/` directories

### Auto-Reload
Both servers watch for changes:
- Backend: nodemon (auto-restart)
- Frontend: Next.js hot reload

### Test API
```bash
# Test backend health
curl http://localhost:5000/api/health

# Response:
# {"status":"ok","timestamp":"2025-02-06T..."}
```

---

## 📖 Detailed Documentation

For more information, see:
- **[RUNNING_PROJECT.md](./RUNNING_PROJECT.md)** - Full running guide
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[README.md](./README.md)** - Project overview

---

## ✅ Checklist Before Running

- [ ] Node.js installed (check: `node --version`)
- [ ] MySQL installed and running
- [ ] MySQL password is `Ikavi1920` (or update in `.env`)
- [ ] Project files downloaded/cloned
- [ ] In project root directory

---

## 🎉 Ready to Go!

Run one of these commands:
```powershell
# PowerShell
.\run.ps1

# Command Prompt
run.bat

# Node.js
node start-project.js
```

Then open http://localhost:3000 in your browser!

---

## 💬 Questions?

Check the troubleshooting section in [RUNNING_PROJECT.md](./RUNNING_PROJECT.md) or review the error messages carefully - they usually tell you exactly what's wrong.

**Happy learning! 📚**
