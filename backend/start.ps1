# Start the backend server

Write-Host "🚀 Starting Regalytics Backend Server..." -ForegroundColor Green

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start the development server
Write-Host "🔥 Starting development server on port 3001..." -ForegroundColor Cyan
npm run dev
