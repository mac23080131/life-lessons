# Life Lessons App - Setup Script (PowerShell)
# Run this script to set up the development environment on Windows

Write-Host "🚀 Setting up Life Lessons App..." -ForegroundColor Blue

# Check Node.js
Write-Host "Checking Node.js..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js >= 20.0.0" -ForegroundColor Red
    exit 1
}

# Check pnpm
Write-Host "Checking pnpm..." -ForegroundColor Cyan
try {
    $pnpmVersion = pnpm --version
    Write-Host "✓ pnpm found: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "Installing pnpm..." -ForegroundColor Yellow
    npm install -g pnpm
}

# Check Docker
Write-Host "Checking Docker..." -ForegroundColor Cyan
try {
    docker --version | Out-Null
    Write-Host "✓ Docker found" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Docker not found. You'll need to manually set up PostgreSQL and Redis." -ForegroundColor Yellow
}

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Cyan
pnpm install

# Copy environment file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Cyan
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env created. Please update with your values." -ForegroundColor Green
}

# Start Docker services
Write-Host "`nStarting Docker services..." -ForegroundColor Cyan
docker-compose up -d

# Wait for PostgreSQL
Write-Host "Waiting for PostgreSQL to be ready..." -ForegroundColor Cyan
Start-Sleep -Seconds 5

# Generate Prisma client
Write-Host "`nGenerating Prisma client..." -ForegroundColor Cyan
Set-Location prisma
npx prisma generate
Set-Location ..

# Run migrations
Write-Host "`nRunning database migrations..." -ForegroundColor Cyan
Set-Location prisma
npx prisma migrate dev --name init
Set-Location ..

# Seed database
Write-Host "`nSeeding database..." -ForegroundColor Cyan
pnpm seed

Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  ✓ Life Lessons App setup complete!" -ForegroundColor Green
Write-Host "════════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "`nDemo credentials:"
Write-Host "  Email: demo@lifelessons.app"
Write-Host "  Password: Passw0rd!"
Write-Host "`nNext steps:"
Write-Host "  1. Run 'pnpm dev' to start all services"
Write-Host "  2. Visit http://localhost:3000 (Web UI)"
Write-Host "  3. Visit http://localhost:3001/docs (API Docs)"
Write-Host "`n════════════════════════════════════════════════════════" -ForegroundColor Green
