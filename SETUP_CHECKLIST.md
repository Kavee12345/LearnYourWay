# Learn Your Way Educational Suite - Setup Checklist

Print this checklist and mark off as you complete each step!

---

## ✅ PRE-SETUP CHECKLIST (5 minutes)

### System Requirements
- [ ] Windows 10+, macOS 10.13+, or Linux (Ubuntu 18.04+)
- [ ] 8GB RAM minimum (16GB recommended)
- [ ] 5GB free disk space
- [ ] Internet connection required
- [ ] Administrator/sudo access

### Software Prerequisites
- [ ] Node.js 16+ installed (`node --version`)
- [ ] npm 8+ installed (`npm --version`)
- [ ] PostgreSQL 12+ installed
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Git installed (`git --version`)
- [ ] VS Code or preferred editor

### External Accounts
- [ ] Google account for Gemini API
- [ ] Gemini API key obtained from https://makersuite.google.com

---

## ✅ SETUP CHECKLIST (30 minutes)

### Step 1: Project Initialization (2 min)
- [ ] Created `learn-your-way-suite` folder
- [ ] Navigated to project directory
- [ ] Ran `git init`
- [ ] Copied `.env.example` to `.env`

### Step 2: Environment Configuration (3 min)
- [ ] Opened `.env` file
- [ ] Added Gemini API key: `GEMINI_API_KEY=xxx`
- [ ] Added database URL: `DATABASE_URL=postgresql://...`
- [ ] Verified all environment variables set

### Step 3: Backend Installation (5 min)
- [ ] Navigated to `backend/` folder
- [ ] Ran `npm install`
- [ ] Verified `node_modules/` created
- [ ] Checked for installation errors

### Step 4: Frontend Installation (5 min)
- [ ] Navigated to `frontend/` folder
- [ ] Ran `npm install`
- [ ] Verified `node_modules/` created
- [ ] Checked for installation errors

### Step 5: Database Setup (5 min)
- [ ] PostgreSQL service running
- [ ] Created database: `learn_your_way`
- [ ] Ran `database/schema.sql`
- [ ] Verified tables created: `\dt` in psql
- [ ] Verified indexes created

### Step 6: Service Startup (5 min)
- [ ] **Terminal 1**: ChromaDB running (`chroma run --host localhost --port 8000`)
- [ ] **Terminal 2**: Backend server running (`npm run dev`)
- [ ] **Terminal 3**: Frontend server running (`npm run dev`)
- [ ] All services showing "ready" messages

---

## ✅ VERIFICATION CHECKLIST (10 minutes)

### Service Health Checks
- [ ] Backend accessible: `curl http://localhost:5000/api/health`
- [ ] ChromaDB responsive: `curl http://localhost:8000/api/v1/heartbeat`
- [ ] Frontend loads: Open http://localhost:3000 in browser
- [ ] No console errors in terminal
- [ ] No console errors in browser DevTools

### Database Verification
- [ ] Connect to database: `psql -U postgres -d learn_your_way`
- [ ] List tables: `\dt` shows 7 tables
- [ ] List indexes: `\di` shows proper indexes
- [ ] Check users table: `SELECT * FROM users;`
- [ ] Exit psql: `\q`

### API Verification
- [ ] GET /api/health returns 200 status
- [ ] No authentication errors (expected)
- [ ] Response time < 100ms
- [ ] CORS headers present (if checking from frontend)

---

## ✅ FIRST RUN CHECKLIST (15 minutes)

### Upload Test PDF
- [ ] Navigate to http://localhost:3000
- [ ] Click "Upload PDF" or similar
- [ ] Select a sample PDF (< 10MB)
- [ ] Enter lesson title (e.g., "Test Lesson")
- [ ] Click "Create Lesson" button
- [ ] See progress indicator
- [ ] Wait for processing (30-60 seconds)
- [ ] Success message appears
- [ ] Lesson ID received

### Verify Lesson Created
- [ ] Return to dashboard/home
- [ ] See lesson in list
- [ ] Click on lesson
- [ ] View lesson summary (2-3 paragraphs)
- [ ] See 3 visual concepts displayed
- [ ] All content visible

### Take Sample Quiz
- [ ] Click "Take Quiz" button
- [ ] See quiz questions appear (5 questions)
- [ ] Read first question carefully
- [ ] Select an answer
- [ ] Click "Next" button
- [ ] Progress bar updates
- [ ] Complete all 5 questions
- [ ] Submit quiz
- [ ] See score and feedback
- [ ] Verify difficulty adjustment

### Check Database
- [ ] Connect to PostgreSQL
- [ ] Query lessons: `SELECT * FROM lessons;`
- [ ] Query quizzes: `SELECT * FROM quizzes;`
- [ ] Verify data stored correctly
- [ ] Check quiz_scores table populated

---

## ✅ TROUBLESHOOTING CHECKLIST (As needed)

### Backend Issues
- [ ] Check port 5000 not in use: `lsof -i :5000`
- [ ] Verify `.env` exists and has correct values
- [ ] Check Node.js version: `node --version`
- [ ] Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- [ ] Check logs for specific error messages

### Frontend Issues
- [ ] Check port 3000 not in use: `lsof -i :3000`
- [ ] Clear `.next` cache: `rm -rf .next`
- [ ] Reinstall dependencies: `rm -rf node_modules && npm install`
- [ ] Check `NEXT_PUBLIC_API_URL` in `.env.local`
- [ ] Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

### Database Issues
- [ ] Check PostgreSQL running: `sudo systemctl status postgresql`
- [ ] Verify database exists: `psql -l`
- [ ] Check connection string in `.env`
- [ ] Verify schema applied: `psql -c "\dt"` 
- [ ] Check for syntax errors in SQL

### ChromaDB Issues
- [ ] Verify Python installation: `python --version`
- [ ] Check port 8000 available: `lsof -i :8000`
- [ ] Reinstall ChromaDB: `pip install --upgrade chromadb`
- [ ] Check ChromaDB logs for errors
- [ ] Try different port if 8000 unavailable

### API Connection Issues
- [ ] Verify backend running: `curl localhost:5000/api/health`
- [ ] Check CORS headers: `curl -i localhost:5000/api/health`
- [ ] Verify URL in `.env.local`: `NEXT_PUBLIC_API_URL=http://localhost:5000/api`
- [ ] Check browser console for error messages
- [ ] Try postman/insomnia for API testing

---

## ✅ POST-SETUP CHECKLIST (Next steps)

### Code Understanding
- [ ] Read `README.md` (overview)
- [ ] Read `SETUP_GUIDE.md` (technical details)
- [ ] Read `DEVELOPMENT_ROADMAP.md` (future features)
- [ ] Explore source code structure

### Development Preparation
- [ ] Set up Git repository: `git init && git add . && git commit -m "initial"`
- [ ] Create `.gitignore` file
- [ ] Explore backend services
- [ ] Explore frontend components
- [ ] Understand API flow

### Next Features to Build (Phase 2)
- [ ] User authentication (login/register)
- [ ] User profile page
- [ ] Lesson dashboard
- [ ] Statistics tracking

### Performance Optimization (Optional)
- [ ] Enable database query logging
- [ ] Monitor response times
- [ ] Check frontend bundle size
- [ ] Identify bottlenecks
- [ ] Implement caching

---

## ✅ DEPLOYMENT CHECKLIST (Before going live)

### Security Review
- [ ] Remove all API keys from code
- [ ] Verify environment variables used
- [ ] Enable HTTPS/TLS
- [ ] Review CORS configuration
- [ ] Check input validation
- [ ] Verify SQL injection protection

### Database
- [ ] Backup production data
- [ ] Test data migration
- [ ] Verify indexes created
- [ ] Check for slow queries
- [ ] Set up monitoring

### Frontend
- [ ] Run production build: `npm run build`
- [ ] Test production build locally
- [ ] Minify CSS/JS
- [ ] Optimize images
- [ ] Set up CDN

### Backend
- [ ] Run tests
- [ ] Check error handling
- [ ] Verify logging
- [ ] Test rate limiting
- [ ] Check timeout values

### Infrastructure
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Set up alerts
- [ ] Test failover
- [ ] Document deployment process

---

## 🎯 QUICK REFERENCE

### Common Commands

**Backend**
```bash
cd backend
npm run dev              # Run development server
npm test               # Run tests
npm run build          # Build production
```

**Frontend**
```bash
cd frontend
npm run dev            # Run development server
npm run build          # Build production
npm run lint           # Lint code
```

**Database**
```bash
# Connect
psql -U postgres -d learn_your_way

# Common queries
\dt                    # List tables
\di                    # List indexes
SELECT * FROM users;   # View users
\q                     # Exit psql
```

**Services**
```bash
# ChromaDB
chroma run --host localhost --port 8000

# Health checks
curl http://localhost:3000        # Frontend
curl http://localhost:5000/api/health   # Backend
curl http://localhost:8000/api/v1/heartbeat  # ChromaDB
```

---

## 📝 NOTES SECTION

Use this space to track:
- Customizations made
- Issues encountered
- Decisions taken
- Performance notes

```
[Your notes here]
```

---

## ✅ COMPLETION CONFIRMATION

- [ ] All checklist items completed
- [ ] System running without errors
- [ ] Test PDF uploaded successfully
- [ ] Quiz completed successfully
- [ ] Ready for development

**Date Completed**: _______________

**Notes**: 
```
[Add any notes about setup process]
```

---

## 📞 QUICK HELP

**Can't start backend?**
→ Check `backend/server.js` is in correct folder
→ Verify `npm install` completed
→ Check `.env` has correct DATABASE_URL

**Can't upload PDF?**
→ Check backend running (`npm run dev`)
→ Verify `.env.local` has NEXT_PUBLIC_API_URL
→ Check browser console for errors

**Quiz not submitting?**
→ Verify all services running
→ Check database connection
→ Review browser console errors

**Need more help?**
→ See [QUICK_START.md](./QUICK_START.md#troubleshooting)
→ See [SETUP_GUIDE.md](./SETUP_GUIDE.md#troubleshooting)
→ See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

---

**Version**: 1.0.0  
**Last Updated**: February 6, 2026  
**Status**: Production Ready ✅

---

🎉 **Happy learning! You're all set up!**
