# Test CKB API Endpoints
# Run this after starting the API: pnpm dev (in apps/api)

$BASE_URL = "http://localhost:3001"

Write-Host "🧪 Testing Concept Knowledge Base API..." -ForegroundColor Cyan
Write-Host ""

# 1. Test Categories
Write-Host "1️⃣ GET /concepts/categories" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$BASE_URL/concepts/categories" -Method Get
    Write-Host "✅ Found $($categories.Count) categories" -ForegroundColor Green
    $categories | Select-Object -First 2 | ForEach-Object {
        Write-Host "   - $($_.name) ($($_.nameEn)) - $($_.icon)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 2. Test Search
Write-Host "2️⃣ GET /concepts/search?q=growth" -ForegroundColor Yellow
try {
    $search = Invoke-RestMethod -Uri "$BASE_URL/concepts/search?q=growth&limit=3" -Method Get
    Write-Host "✅ Found $($search.total) concepts" -ForegroundColor Green
    $search.data | ForEach-Object {
        Write-Host "   - $($_.title) ($($_.difficulty))" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 3. Test Get Category Detail
Write-Host "3️⃣ GET /concepts/categories/:id" -ForegroundColor Yellow
try {
    $categories = Invoke-RestMethod -Uri "$BASE_URL/concepts/categories" -Method Get
    if ($categories.Count -gt 0) {
        $categoryId = $categories[0].id
        $category = Invoke-RestMethod -Uri "$BASE_URL/concepts/categories/$categoryId" -Method Get
        Write-Host "✅ Category: $($category.name)" -ForegroundColor Green
        Write-Host "   Concepts: $($category.concepts.Count)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 4. Test Get Concept Detail
Write-Host "4️⃣ GET /concepts/:id" -ForegroundColor Yellow
try {
    $search = Invoke-RestMethod -Uri "$BASE_URL/concepts/search?limit=1" -Method Get
    if ($search.data.Count -gt 0) {
        $conceptId = $search.data[0].id
        $concept = Invoke-RestMethod -Uri "$BASE_URL/concepts/$conceptId" -Method Get
        Write-Host "✅ Concept: $($concept.title)" -ForegroundColor Green
        Write-Host "   Practices: $($concept.practices.Count)" -ForegroundColor Gray
        Write-Host "   Examples: $($concept.examples.Count)" -ForegroundColor Gray
        Write-Host "   Questions: $($concept.questions.Count)" -ForegroundColor Gray
        Write-Host "   Views: $($concept.views)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# 5. Test Search with Filters
Write-Host "5️⃣ GET /concepts/search with filters" -ForegroundColor Yellow
try {
    $search = Invoke-RestMethod -Uri "$BASE_URL/concepts/search?difficulty=BEGINNER&limit=3" -Method Get
    Write-Host "✅ BEGINNER concepts: $($search.total)" -ForegroundColor Green
    
    $search = Invoke-RestMethod -Uri "$BASE_URL/concepts/search?difficulty=INTERMEDIATE&limit=3" -Method Get
    Write-Host "✅ INTERMEDIATE concepts: $($search.total)" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

Write-Host "🎉 CKB API Testing Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📚 API Documentation: $BASE_URL/docs" -ForegroundColor Yellow
Write-Host ""
