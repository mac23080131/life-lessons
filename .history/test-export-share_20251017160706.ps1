# Test Export & Share Features

Write-Host "=== Life Lessons - Export & Share Test ===" -ForegroundColor Cyan

# 1. Login
Write-Host "`n[1/6] Logging in..." -ForegroundColor Yellow
$loginBody = '{"email":"demo@lifelessons.app","password":"Passw0rd!"}'
try {
    $loginResult = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" `
        -Method POST `
        -Body $loginBody `
        -ContentType "application/json"
    $token = $loginResult.accessToken
    Write-Host "✓ Login successful" -ForegroundColor Green
    Write-Host "  User: $($loginResult.user.email)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

$headers = @{ Authorization = "Bearer $token" }

# 2. Get lessons
Write-Host "`n[2/6] Fetching lessons..." -ForegroundColor Yellow
try {
    $lessonsResult = Invoke-RestMethod -Uri "http://localhost:3001/api/lessons" -Headers $headers
    $lessonCount = $lessonsResult.lessons.Count
    Write-Host "✓ Found $lessonCount lessons" -ForegroundColor Green
    if ($lessonCount -eq 0) {
        Write-Host "⚠ No lessons found - skipping share test" -ForegroundColor Yellow
    } else {
        $firstLesson = $lessonsResult.lessons[0]
        Write-Host "  First lesson ID: $($firstLesson.id)" -ForegroundColor Gray
    }
} catch {
    Write-Host "✗ Failed to fetch lessons: $_" -ForegroundColor Red
    exit 1
}

# 3. Test Export JSON
Write-Host "`n[3/6] Testing Export JSON..." -ForegroundColor Yellow
try {
    $exportJson = Invoke-RestMethod -Uri "http://localhost:3001/api/export?format=json" -Headers $headers
    Write-Host "✓ Export JSON successful" -ForegroundColor Green
    Write-Host "  Total lessons: $($exportJson.totalLessons)" -ForegroundColor Gray
    Write-Host "  Exported at: $($exportJson.exportedAt)" -ForegroundColor Gray
} catch {
    Write-Host "✗ Export JSON failed: $_" -ForegroundColor Red
}

# 4. Test Export CSV
Write-Host "`n[4/6] Testing Export CSV..." -ForegroundColor Yellow
try {
    $exportCsv = Invoke-RestMethod -Uri "http://localhost:3001/api/export?format=csv" -Headers $headers
    $lines = ($exportCsv -split "`n").Count
    Write-Host "✓ Export CSV successful" -ForegroundColor Green
    Write-Host "  Lines: $lines" -ForegroundColor Gray
} catch {
    Write-Host "✗ Export CSV failed: $_" -ForegroundColor Red
}

# 5. Test Export Markdown
Write-Host "`n[5/6] Testing Export Markdown..." -ForegroundColor Yellow
try {
    $exportMd = Invoke-RestMethod -Uri "http://localhost:3001/api/export?format=markdown" -Headers $headers
    $chars = $exportMd.Length
    Write-Host "✓ Export Markdown successful" -ForegroundColor Green
    Write-Host "  Characters: $chars" -ForegroundColor Gray
} catch {
    Write-Host "✗ Export Markdown failed: $_" -ForegroundColor Red
}

# 6. Test Share Feature
if ($lessonCount -gt 0) {
    Write-Host "`n[6/6] Testing Share Feature..." -ForegroundColor Yellow
    try {
        # Create share link
        $shareResult = Invoke-RestMethod -Uri "http://localhost:3001/api/lessons/$($firstLesson.id)/share" `
            -Method POST `
            -Headers $headers
        $shareToken = $shareResult.shareToken
        Write-Host "✓ Share link created" -ForegroundColor Green
        Write-Host "  Token: $shareToken" -ForegroundColor Gray
        
        # View shared lesson (public endpoint)
        $sharedLesson = Invoke-RestMethod -Uri "http://localhost:3001/api/lessons/shared/$shareToken"
        Write-Host "✓ Shared lesson accessible" -ForegroundColor Green
        Write-Host "  Domain: $($sharedLesson.domain)" -ForegroundColor Gray
        Write-Host "  Is Anonymous: $($sharedLesson.isAnonymous)" -ForegroundColor Gray
        
        # Check anonymization
        if ($sharedLesson.PSObject.Properties.Name -contains "userId" -or 
            $sharedLesson.PSObject.Properties.Name -contains "user") {
            Write-Host "⚠ WARNING: User info not fully anonymized!" -ForegroundColor Red
        } else {
            Write-Host "✓ User info properly anonymized" -ForegroundColor Green
        }
        
        Write-Host "`n📎 Share URL: http://localhost:3000/share/$shareToken" -ForegroundColor Cyan
    } catch {
        Write-Host "✗ Share feature failed: $_" -ForegroundColor Red
    }
} else {
    Write-Host "`n[6/6] Skipped (no lessons)" -ForegroundColor Yellow
}

Write-Host "`n=== Test Complete ===" -ForegroundColor Cyan
