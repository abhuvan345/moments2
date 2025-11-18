# Frontend Server Startup Script

Write-Host "Starting Moments Frontend Server..." -ForegroundColor Cyan

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host "WARNING: .env.local file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env.local from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host ""
    Write-Host "Please edit frontend\.env.local and add your Firebase configuration" -ForegroundColor Red
    Write-Host "Then run this script again" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
}

Write-Host ""
Write-Host "Starting server on http://localhost:3000" -ForegroundColor Green
Write-Host ""

npm run dev
