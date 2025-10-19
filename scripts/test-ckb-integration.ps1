# CKB Integration Test Script

Write-Host "🧪 Starting CKB Integration Tests..." -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"
$testsPassed = 0
$testsFailed = 0

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    Write-Host "Testing: $Name" -NoNewline
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-WebRequest @params
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host " ✅ PASS" -ForegroundColor Green
            $script:testsPassed++
            return $true
        } else {
            Write-Host " ❌ FAIL (Status: $($response.StatusCode))" -ForegroundColor Red
            $script:testsFailed++
            return $false
        }
    } catch {
        Write-Host " ❌ FAIL (Error: $($_.Exception.Message))" -ForegroundColor Red
        $script:testsFailed++
        return $false
    }
}

Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST SUITE 1: Concept Categories" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Test-Endpoint -Name "GET /concepts/categories" -Url "$baseUrl/concepts/categories"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST SUITE 2: Concept Search & Retrieval" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Test-Endpoint -Name "GET /concepts/search (no params)" -Url "$baseUrl/concepts/search"
Test-Endpoint -Name "GET /concepts/search?q=growth" -Url "$baseUrl/concepts/search?q=growth"
Test-Endpoint -Name "GET /concepts/search?q=mindfulness" -Url "$baseUrl/concepts/search?q=mindfulness"
Test-Endpoint -Name "GET /concepts/search?difficulty=BEGINNER" -Url "$baseUrl/concepts/search?difficulty=BEGINNER"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST SUITE 3: Performance Tests" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Measuring search response time..." -NoNewline
$startTime = Get-Date
$response = Invoke-WebRequest -Uri "$baseUrl/concepts/search?q=stress" -UseBasicParsing
$endTime = Get-Date
$duration = ($endTime - $startTime).TotalMilliseconds

if ($duration -lt 300) {
    Write-Host " ✅ $([math]::Round($duration, 0))ms (Target: <300ms)" -ForegroundColor Green
    $script:testsPassed++
} else {
    Write-Host " ⚠️  $([math]::Round($duration, 0))ms (Slow! Target: <300ms)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST SUITE 4: Data Validation" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Validating concept structure..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/search?limit=1" -UseBasicParsing
    $concept = $response.data[0]
    
    $requiredFields = @('id', 'key', 'slug', 'title', 'titleEn', 'summary', 'summaryEn', 'categoryId', 'difficulty')
    $valid = $true
    
    foreach ($field in $requiredFields) {
        if (-not $concept.PSObject.Properties[$field]) {
            Write-Host " ❌ Missing field: $field" -ForegroundColor Red
            $valid = $false
            break
        }
    }
    
    if ($valid) {
        Write-Host " ✅ All required fields present" -ForegroundColor Green
        $script:testsPassed++
    } else {
        $script:testsFailed++
    }
} catch {
    Write-Host " ❌ Failed to validate structure" -ForegroundColor Red
    $script:testsFailed++
}

Write-Host ""
Write-Host "Validating bilingual content..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/search?limit=5" -UseBasicParsing
    $allBilingual = $true
    
    foreach ($concept in $response.data) {
        if (-not $concept.title -or -not $concept.titleEn -or 
            -not $concept.summary -or -not $concept.summaryEn) {
            $allBilingual = $false
            break
        }
    }
    
    if ($allBilingual) {
        Write-Host " ✅ All concepts have bilingual content" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host " ❌ Some concepts missing translations" -ForegroundColor Red
        $script:testsFailed++
    }
} catch {
    Write-Host " ❌ Failed to validate bilingual content" -ForegroundColor Red
    $script:testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST SUITE 5: Content Quality" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""

Write-Host "Checking concept count..." -NoNewline
try {
    $response = Invoke-RestMethod -Uri "$baseUrl/concepts/search?limit=100" -UseBasicParsing
    $count = $response.data.Count
    
    if ($count -ge 14) {
        Write-Host " ✅ $count concepts found (Expected: ≥14)" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host " ❌ Only $count concepts (Expected: ≥14)" -ForegroundColor Red
        $script:testsFailed++
    }
} catch {
    Write-Host " ❌ Failed to count concepts" -ForegroundColor Red
    $script:testsFailed++
}

Write-Host ""
Write-Host "Checking category distribution..." -NoNewline
try {
    $categories = Invoke-RestMethod -Uri "$baseUrl/concepts/categories" -UseBasicParsing
    
    if ($categories.Count -ge 10) {
        Write-Host " ✅ $($categories.Count) categories (Expected: ≥10)" -ForegroundColor Green
        $script:testsPassed++
    } else {
        Write-Host " ❌ Only $($categories.Count) categories" -ForegroundColor Red
        $script:testsFailed++
    }
} catch {
    Write-Host " ❌ Failed to check categories" -ForegroundColor Red
    $script:testsFailed++
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host "  TEST RESULTS" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Tests Passed:  $testsPassed" -ForegroundColor Green
Write-Host "  Tests Failed:  $testsFailed" -ForegroundColor $(if ($testsFailed -eq 0) { "Green" } else { "Red" })
Write-Host "  Total Tests:   $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host ""

$successRate = if (($testsPassed + $testsFailed) -gt 0) {
    [math]::Round(($testsPassed / ($testsPassed + $testsFailed)) * 100, 1)
} else {
    0
}

Write-Host "  Success Rate:  $successRate%" -ForegroundColor $(if ($successRate -ge 90) { "Green" } elseif ($successRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""

if ($testsFailed -eq 0) {
    Write-Host "✅ ALL TESTS PASSED!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  SOME TESTS FAILED" -ForegroundColor Yellow
    exit 1
}
