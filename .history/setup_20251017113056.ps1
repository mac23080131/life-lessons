# 🚀 Life Lessons - Setup Script cho Windows
# Chạy trong PowerShell

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Life Lessons App - Quick Setup" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$ErrorActionPreference = "Stop"

# Kiểm tra Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Kiểm tra pnpm
Write-Host "`n✓ Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "  pnpm version: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ pnpm not found. Installing..." -ForegroundColor Yellow
    npm install -g pnpm
    Write-Host "  ✓ pnpm installed" -ForegroundColor Green
}

# Kiểm tra Docker
Write-Host "`n✓ Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "  Docker version: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Docker not found. Please install Docker Desktop." -ForegroundColor Red
    exit 1
}

# Cài dependencies
Write-Host "`n✓ Installing dependencies..." -ForegroundColor Yellow
pnpm install
Write-Host "  ✓ Dependencies installed" -ForegroundColor Green

# Generate Prisma Client
Write-Host "`n✓ Generating Prisma Client..." -ForegroundColor Yellow
npx prisma generate
Write-Host "  ✓ Prisma Client generated" -ForegroundColor Green

# Kiểm tra .env file
Write-Host "`n✓ Checking .env file..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "  Creating .env from .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "  ✓ .env created" -ForegroundColor Green
} else {
    Write-Host "  ✓ .env exists" -ForegroundColor Green
}

# Start Docker containers
Write-Host "`n✓ Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d
Start-Sleep -Seconds 5
Write-Host "  ✓ Docker containers started" -ForegroundColor Green

# Run migrations
Write-Host "`n✓ Running database migrations..." -ForegroundColor Yellow
npx prisma migrate dev --name init
Write-Host "  ✓ Migrations completed" -ForegroundColor Green

# Seed database
Write-Host "`n✓ Seeding database..." -ForegroundColor Yellow
npx ts-node scripts/seed.ts
Write-Host "  ✓ Database seeded with demo data" -ForegroundColor Green

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Setup completed successfully! 🎉" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Cyan

Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Start backend:  cd apps\api && pnpm start:dev" -ForegroundColor White
Write-Host "2. Start frontend: cd apps\web && pnpm dev" -ForegroundColor White
Write-Host "3. Open browser:   http://localhost:3000`n" -ForegroundColor White

Write-Host "Demo account:" -ForegroundColor Yellow
Write-Host "  Email: demo@lifelessons.app" -ForegroundColor White
Write-Host "  Password: Passw0rd!`n" -ForegroundColor White

Write-Host "Swagger API docs: http://localhost:3001/docs`n" -ForegroundColor Cyan
