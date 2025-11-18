# Backend Server Startup Script

Write-Host "Starting Moments Backend Server..." -ForegroundColor Cyan

# Check if .env exists
if (-not (Test-Path ".env")) {
    Write-Host "WARNING: .env file not found!" -ForegroundColor Yellow
    Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host ""
    Write-Host "Please edit backend\.env and add your Firebase and Cloudinary credentials" -ForegroundColor Red
    Write-Host "Then run this script again" -ForegroundColor Red
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
}

Write-Host ""
Write-Host "Starting server on http://localhost:5000" -ForegroundColor Green
Write-Host ""

npm run dev
