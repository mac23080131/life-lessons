# Quick Test Admin CKB API

Write-Host "🧪 Testing Admin CKB Endpoints..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001/api"

# Test 1: List Categories
Write-Host "1️⃣  GET /concepts/categories" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/categories" -Method GET
    Write-Host "   ✅ Success: Found $($response.Count) categories" -ForegroundColor Green
    $response | Select-Object -First 3 | ForEach-Object {
        Write-Host "      - $($_.name) ($($_.key)) - $($_._count.concepts) concepts" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: List Concepts
Write-Host "2️⃣  GET /concepts/search?limit=5" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/search?limit=5" -Method GET
    Write-Host "   ✅ Success: Found $($response.total) concepts (showing $($response.data.Count))" -ForegroundColor Green
    $response.data | ForEach-Object {
        Write-Host "      - $($_.title) [$($_.difficulty)]" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get specific concept
Write-Host "3️⃣  GET /concepts/search?slug=stress-management" -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/search?slug=stress-management" -Method GET
    if ($response.data.Count -gt 0) {
        $concept = $response.data[0]
        Write-Host "   ✅ Success: Found concept" -ForegroundColor Green
        Write-Host "      Title: $($concept.title)" -ForegroundColor Gray
        Write-Host "      Category: $($concept.category.name)" -ForegroundColor Gray
        Write-Host "      Views: $($concept.views)" -ForegroundColor Gray
    } else {
        Write-Host "   ⚠️  No concept found with slug 'stress-management'" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get category detail
Write-Host "4️⃣  GET /concepts/categories/:id (Mindfulness)" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/concepts/categories" -Method GET
    $mindfulness = $categories | Where-Object { $_.key -eq 'mindfulness' } | Select-Object -First 1
    
    if ($mindfulness) {
        $detail = Invoke-RestMethod -Uri "$baseUrl/concepts/categories/$($mindfulness.id)" -Method GET
        Write-Host "   ✅ Success: $($detail.name)" -ForegroundColor Green
        Write-Host "      Concepts: $($detail.concepts.Count)" -ForegroundColor Gray
        $detail.concepts | Select-Object -First 3 | ForEach-Object {
            Write-Host "        • $($_.title)" -ForegroundColor DarkGray
        }
    } else {
        Write-Host "   ⚠️  Mindfulness category not found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "   ❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 5: Check for token (optional - for CRUD)
Write-Host "5️⃣  Check Authentication" -ForegroundColor Yellow
$token = $null
try {
    # Try to read token from common locations
    if (Test-Path "$env:USERPROFILE\.lifelessons_token") {
        $token = Get-Content "$env:USERPROFILE\.lifelessons_token" -Raw
    }
    
    if ($token) {
        Write-Host "   ✅ Token found (for CRUD operations)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  No token found - Login required for CRUD" -ForegroundColor Yellow
        Write-Host "      Login at: http://localhost:3000" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ⚠️  Authentication check skipped" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "📊 Summary" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
try {
    $cats = Invoke-RestMethod -Uri "$baseUrl/concepts/categories" -Method GET
    $concepts = Invoke-RestMethod -Uri "$baseUrl/concepts/search?limit=1" -Method GET
    
    Write-Host "Categories: $($cats.Count)" -ForegroundColor White
    Write-Host "Concepts:   $($concepts.total)" -ForegroundColor White
    
    $withConcepts = $cats | Where-Object { $_._count.concepts -gt 0 }
    Write-Host "Active:     $($withConcepts.Count) categories with concepts" -ForegroundColor White
} catch {
    Write-Host "Unable to fetch summary" -ForegroundColor Red
}
Write-Host ""

Write-Host "✅ Test completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open http://localhost:3000/dashboard/admin/concepts" -ForegroundColor Gray
Write-Host "  2. Login with admin account" -ForegroundColor Gray
Write-Host "  3. Test CRUD operations in UI" -ForegroundColor Gray
