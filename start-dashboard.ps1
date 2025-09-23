# Start Backend and Frontend Servers
# This script starts both the API server and React frontend

Write-Host "🚀 Starting UniswapV2 Sandwich Attack Detector Dashboard..." -ForegroundColor Green

# Start backend server in background
Write-Host "📡 Starting backend API server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; node server.js"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend server
Write-Host "🌐 Starting React frontend..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\frontend'; npm start"

Write-Host "✅ Both servers are starting up!" -ForegroundColor Green
Write-Host "📊 Backend API: http://localhost:3001" -ForegroundColor Cyan
Write-Host "🥪 Frontend Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "⏰ Please wait a moment for the React app to open in your browser..." -ForegroundColor Magenta