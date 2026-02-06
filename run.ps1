# Learn Your Way Educational Suite - PowerShell Launcher

$ErrorActionPreference = "Stop"

Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  Learn Your Way Educational Suite              ║" -ForegroundColor Cyan
Write-Host "║  Project Launcher                              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Verify Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js $nodeVersion found" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install it from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Get project root
$projectRoot = Split-Path -Parent $MyInvocation.MyCommandPath
$backendDir = Join-Path $projectRoot "backend"
$frontendDir = Join-Path $projectRoot "frontend"

# Step 1: Install frontend dependencies
Write-Host "`n[STEP 1/3] Installing frontend dependencies..." -ForegroundColor Yellow
Push-Location $frontendDir
try {
    npm install
    if ($LASTEXITCODE -ne 0) { throw "npm install failed" }
} catch {
    Write-Host "✗ Failed to install frontend dependencies" -ForegroundColor Red
    exit 1
}
Pop-Location
Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green

# Step 2: Setup database
Write-Host "`n[STEP 2/3] Setting up database..." -ForegroundColor Yellow
Push-Location $projectRoot
try {
    node setup-db.js
    if ($LASTEXITCODE -ne 0) { throw "Database setup failed" }
} catch {
    Write-Host "✗ Database setup failed" -ForegroundColor Red
    Write-Host "Make sure MySQL is running and credentials in .env are correct" -ForegroundColor Yellow
    exit 1
}
Pop-Location
Write-Host "✓ Database setup completed" -ForegroundColor Green

# Step 3: Start services
Write-Host "`n[STEP 3/3] Starting services..." -ForegroundColor Yellow
Write-Host "`n📍 Services will be available at:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Cyan

Write-Host "`n⏳ Starting servers in 2 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Start backend
Write-Host "`n🚀 Starting backend server..." -ForegroundColor Green
$backendProcess = Start-Process -WindowStyle Normal -PassThru -FilePath "cmd" -ArgumentList "/k cd `"$backendDir`" && npm run dev"

# Start frontend
Start-Sleep -Seconds 1
Write-Host "🚀 Starting frontend server..." -ForegroundColor Green
$frontendProcess = Start-Process -WindowStyle Normal -PassThru -FilePath "cmd" -ArgumentList "/k cd `"$frontendDir`" && npm run dev"

Write-Host "`n✨ Both servers started in new windows" -ForegroundColor Green
Write-Host "📌 To stop the servers, close the respective windows or press Ctrl+C" -ForegroundColor Yellow

# Keep script running
Write-Host "`nℹ️  Main launcher will close in 30 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 30
