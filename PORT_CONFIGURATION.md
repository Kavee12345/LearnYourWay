# Port Configuration Guide

## Overview
All ports are now centralized and configurable through environment variables. No need to hardcode ports!

## Configuration Files

### 1. **Backend Ports** (`.env` in backend directory)
```
BACKEND_PORT=5000        # Backend server port
```

### 2. **Frontend Ports** (`.env.local` in frontend directory)
```
NEXT_PUBLIC_API_URL=http://localhost:5000      # Backend API URL
NEXT_PUBLIC_API_TIMEOUT=60000                   # Request timeout (ms)
```

### 3. **Root Config** (`config.js` in project root)
- Master configuration file
- Used as reference for all ports
- Edit here to see all available ports at once

## How to Change Ports

### If Backend Port Changes (e.g., 5000 → 5002)

**Step 1: Update Backend .env**
```
BACKEND_PORT=5002
```

**Step 2: Update Frontend .env.local**
```
NEXT_PUBLIC_API_URL=http://localhost:5002
```

**Step 3: Restart Both Servers**
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

### If Frontend Port Changes (e.g., 3000 → 3001)
No changes needed! Frontend will automatically use the new port.

---

## Current Configuration

| Component | Port | URL |
|-----------|------|-----|
| **Backend** | 5000 | http://localhost:5000 |
| **Frontend** | 3000 | http://localhost:3000 |
| **API Timeout** | - | 60,000 ms (60 seconds) |
| **Database** | 3306 | MySQL on localhost |

---

## Environment Variables Reference

### Backend (.env)
```
BACKEND_PORT=5000              # Server port
NODE_ENV=development           # Environment
DB_HOST=localhost              # Database host
DB_PORT=3306                   # Database port
DB_USER=root                   # Database user
DB_PASSWORD=Ikavi1920          # Database password
DB_NAME=learn_your_way         # Database name
GEMINI_API_KEY=...             # Gemini API key
JWT_SECRET=...                 # JWT secret
FRONTEND_URL=http://localhost:3000  # Frontend URL for CORS
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000     # Backend API URL
NEXT_PUBLIC_API_TIMEOUT=60000                 # Request timeout
```

---

## Testing Port Configuration

### Test Backend
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","timestamp":"..."}`

### Test Frontend
```
http://localhost:3000
```
Should load the application

### Test API Connection
```
Go to http://localhost:3000/upload
Try uploading a PDF
Should communicate with http://localhost:5000
```

---

## Common Port Issues

### Port Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Change to Different Port
```
# Backend .env
BACKEND_PORT=5001

# Frontend .env.local
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## Production Deployment

For production, set environment variables:

### Backend
```bash
export BACKEND_PORT=8080
export DB_HOST=prod-db.example.com
export GEMINI_API_KEY=your_prod_key
```

### Frontend
```bash
export NEXT_PUBLIC_API_URL=https://api.example.com
export NEXT_PUBLIC_API_TIMEOUT=30000
```

---

## Summary

✅ All ports now use environment variables
✅ No hardcoded URLs in code
✅ Easy to change ports without editing code
✅ Config file documents all settings
✅ Same configuration works for dev and production
