# Start Life Lessons Development Servers

Write-Host "🚀 Starting Life Lessons Development Servers..." -ForegroundColor Green
Write-Host ""

# Start Backend API in new terminal
Write-Host "Starting Backend API (NestJS) on port 3001..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\apps\api' ; pnpm dev"

# Wait a bit
Start-Sleep -Seconds 2

# Start Frontend Web in new terminal
Write-Host "Starting Frontend Web (Next.js) on port 3000..." -ForegroundColor Cyan
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\apps\web' ; pnpm dev"

Write-Host ""
Write-Host "✅ Both services are starting in separate terminals!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "📍 Backend API: http://localhost:3001" -ForegroundColor Yellow
Write-Host "📍 Swagger Docs: http://localhost:3001/docs" -ForegroundColor Yellow
Write-Host ""
Write-Host "Demo Login:" -ForegroundColor Magenta
Write-Host "  Email: demo@lifelessons.app" -ForegroundColor White
Write-Host "  Password: Passw0rd!" -ForegroundColor White
