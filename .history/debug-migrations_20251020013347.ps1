# Railway Migration Debug & Fix Script
# Run this to diagnose and fix migration issues

Write-Host "🔍 Railway Migration Diagnostic Tool" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if Railway CLI is installed
Write-Host "Step 1: Checking Railway CLI..." -ForegroundColor Yellow
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue

if (-not $railwayInstalled) {
    Write-Host "❌ Railway CLI not found. Installing..." -ForegroundColor Red
    npm install -g @railway/cli
    Write-Host "✅ Railway CLI installed" -ForegroundColor Green
} else {
    Write-Host "✅ Railway CLI found" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Checking Railway authentication..." -ForegroundColor Yellow
Write-Host "If browser opens, please login to Railway" -ForegroundColor Gray

# Try to check if logged in (this might prompt login)
railway whoami 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "Please login to Railway:" -ForegroundColor Yellow
    railway login
}

Write-Host ""
Write-Host "Step 3: Linking to project..." -ForegroundColor Yellow
Write-Host "Please select your project from the list" -ForegroundColor Gray
railway link

Write-Host ""
Write-Host "Step 4: Checking if migrations exist in container..." -ForegroundColor Yellow
Write-Host "Running: railway run ls -la /app/prisma/migrations/" -ForegroundColor Gray
Write-Host ""

$migrationsCheck = railway run ls -la /app/prisma/migrations/ 2>&1

if ($migrationsCheck -match "20251017044345_init") {
    Write-Host "✅ Migrations FOUND in container!" -ForegroundColor Green
    Write-Host $migrationsCheck
    Write-Host ""
    
    Write-Host "Step 5: Attempting to run migrations manually..." -ForegroundColor Yellow
    Write-Host "Running: prisma migrate deploy" -ForegroundColor Gray
    Write-Host ""
    
    railway run "cd /app && pnpm --filter api exec prisma migrate deploy --schema=../../prisma/schema.prisma"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Migrations applied successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Please check Railway Postgres Data tab - you should now see 18 tables" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "❌ Migration failed. Trying alternative path..." -ForegroundColor Red
        Write-Host "Running: prisma migrate deploy with absolute path" -ForegroundColor Gray
        
        railway run "cd /app && pnpm --filter api exec prisma migrate deploy --schema=/app/prisma/schema.prisma"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Migrations applied with absolute path!" -ForegroundColor Green
        } else {
            Write-Host ""
            Write-Host "❌ Still failing. Trying prisma db push (emergency fix)..." -ForegroundColor Red
            
            railway run "cd /app && pnpm --filter api exec prisma db push --schema=/app/prisma/schema.prisma --accept-data-loss"
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host ""
                Write-Host "✅ Database schema pushed successfully!" -ForegroundColor Green
                Write-Host "⚠️  Note: This bypassed migrations. You may want to mark them as applied." -ForegroundColor Yellow
            }
        }
    }
    
} else {
    Write-Host "❌ Migrations NOT FOUND in container!" -ForegroundColor Red
    Write-Host "This means the Dockerfile fix didn't work." -ForegroundColor Red
    Write-Host ""
    Write-Host "Container contents:" -ForegroundColor Gray
    Write-Host $migrationsCheck
    Write-Host ""
    Write-Host "Recommended actions:" -ForegroundColor Yellow
    Write-Host "1. Force Railway to rebuild (clear cache)" -ForegroundColor White
    Write-Host "2. Check Dockerfile COPY command" -ForegroundColor White
    Write-Host "3. Verify build context includes prisma folder" -ForegroundColor White
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Diagnostic complete. Check Railway Postgres Data tab to verify tables." -ForegroundColor Cyan
Write-Host ""
Write-Host "Expected tables (18 total):" -ForegroundColor Gray
Write-Host "  - _prisma_migrations" -ForegroundColor White
Write-Host "  - users" -ForegroundColor White
Write-Host "  - lessons" -ForegroundColor White
Write-Host "  - goals" -ForegroundColor White
Write-Host "  - sprints" -ForegroundColor White
Write-Host "  - reminders" -ForegroundColor White
Write-Host "  - groups" -ForegroundColor White
Write-Host "  - memberships" -ForegroundColor White
Write-Host "  - challenges" -ForegroundColor White
Write-Host "  - challenge_participations" -ForegroundColor White
Write-Host "  - concepts" -ForegroundColor White
Write-Host "  - concept_categories" -ForegroundColor White
Write-Host "  - concept_examples" -ForegroundColor White
Write-Host "  - concept_practices" -ForegroundColor White
Write-Host "  - concept_questions" -ForegroundColor White
Write-Host "  - concept_relations" -ForegroundColor White
Write-Host "  - concept_progress" -ForegroundColor White
Write-Host "  - reactions" -ForegroundColor White
