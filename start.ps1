# Moments Application Startup Script
# This script starts both backend and frontend servers

Write-Host "Starting Moments Application..." -ForegroundColor Cyan
Write-Host ""

# Check if .env files exist
if (-not (Test-Path "backend\.env")) {
    Write-Host "ERROR: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please copy backend\.env.example to backend\.env and configure it" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path "frontend\.env.local")) {
    Write-Host "ERROR: frontend\.env.local file not found!" -ForegroundColor Red
    Write-Host "Please copy frontend\.env.example to frontend\.env.local and configure it" -ForegroundColor Yellow
    exit 1
}

# Function to start backend
$backendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\backend
    npm run dev
}

Write-Host "✓ Backend server starting on port 5000..." -ForegroundColor Green

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Function to start frontend
$frontendJob = Start-Job -ScriptBlock {
    Set-Location $using:PWD\frontend
    npm run dev
}

Write-Host "✓ Frontend server starting on port 3000..." -ForegroundColor Green
Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Gray
Write-Host ""

# Monitor jobs
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if jobs are still running
        if ($backendJob.State -ne "Running" -and $frontendJob.State -ne "Running") {
            Write-Host "Both servers have stopped" -ForegroundColor Red
            break
        }
    }
} finally {
    # Cleanup
    Write-Host ""
    Write-Host "Stopping servers..." -ForegroundColor Yellow
    Stop-Job -Job $backendJob, $frontendJob
    Remove-Job -Job $backendJob, $frontendJob
    Write-Host "Servers stopped" -ForegroundColor Green
}
