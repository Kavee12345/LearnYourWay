@echo off
REM Learn Your Way Educational Suite - Quick Start Script

setlocal enabledelayedexpansion

echo.
echo ====================================================
echo   Learn Your Way Educational Suite
echo   Quick Start Script
echo ====================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [INFO] Node.js found: & node --version

REM Install frontend dependencies
echo.
echo [STEP 1] Installing frontend dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)
cd ..

REM Setup database
echo.
echo [STEP 2] Setting up database...
call node setup-db.js
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to setup database
    echo [INFO] Make sure MySQL is running and credentials in .env are correct
    pause
    exit /b 1
)

REM Start services
echo.
echo [STEP 3] Starting services...
echo.
echo [INFO] Backend will start on http://localhost:5000
echo [INFO] Frontend will start on http://localhost:3000
echo.
echo Starting servers in 3 seconds...
timeout /t 3 /nobreak

REM Open new windows for each service
start "Backend Server" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo [SUCCESS] Servers started!
echo.
pause
