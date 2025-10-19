# E2E API Test Script
# Tests the complete user journey via API calls

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Life Lessons E2E API Test" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3001/api"
$testEmail = "e2etest_$(Get-Date -Format 'yyyyMMddHHmmss')@lifelessons.app"
$testPassword = "TestPass123!"
$testName = "E2E Test User"

$testResults = @{
    Passed = 0
    Failed = 0
    Tests = @()
}

function Test-Step {
    param(
        [string]$Name,
        [scriptblock]$Action
    )
    
    Write-Host "`n[TEST] $Name" -ForegroundColor Yellow
    try {
        & $Action
        Write-Host "[PASS] $Name" -ForegroundColor Green
        $testResults.Passed++
        $testResults.Tests += @{ Name = $Name; Status = "PASS" }
        return $true
    } catch {
        Write-Host "[FAIL] $Name" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        $testResults.Failed++
        $testResults.Tests += @{ Name = $Name; Status = "FAIL"; Error = $_.Exception.Message }
        return $false
    }
}

# Test 1: Signup
$token = $null
$userId = $null
$goalId = $null
$lessonIds = @()

Test-Step "1. User Signup" {
    $body = @{
        email = $testEmail
        password = $testPassword
        name = $testName
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/auth/signup" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    
    if ($response.StatusCode -ne 201) {
        throw "Expected 201, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    $script:token = $json.accessToken
    $script:userId = $json.user.id
    
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Token obtained: ${token.Substring(0, 20)}..." -ForegroundColor Gray
}

# Test 2: Login
Test-Step "2. User Login" {
    $body = @{
        email = $testEmail
        password = $testPassword
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.user.email -ne $testEmail) {
        throw "Email mismatch"
    }
    
    Write-Host "  Login successful for: $($json.user.email)" -ForegroundColor Gray
}

# Test 3: Create Goal
Test-Step "3. Create Goal (10,000 target)" {
    $body = @{
        target = 10000
        sprintSize = 100
        cadence = "daily"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/goals" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body $body -UseBasicParsing
    
    if ($response.StatusCode -ne 201) {
        throw "Expected 201, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    $script:goalId = $json.id
    
    if ($json.target -ne 10000) {
        throw "Target mismatch"
    }
    
    Write-Host "  Goal ID: $goalId" -ForegroundColor Gray
    Write-Host "  Target: $($json.target), Current: $($json.current)" -ForegroundColor Gray
}

# Test 4-8: Create 5 Lessons
$lessons = @(
    @{ content = "Today I learned to be more patient when facing challenges"; domain = "INNER"; mood = 2; resonance = 3 }
    @{ content = "Morning exercise helps me focus throughout the day"; domain = "HEALTH"; mood = 1; resonance = 2 }
    @{ content = "Active listening improves relationships with colleagues"; domain = "RELATIONSHIP"; mood = 1; resonance = 3 }
    @{ content = "Detailed budgeting helps control spending better"; domain = "FINANCE"; mood = 0; resonance = 2 }
    @{ content = "10 minutes of meditation each morning helps me stay calm"; domain = "INNER"; mood = 2; resonance = 3 }
)

for ($i = 0; $i -lt $lessons.Count; $i++) {
    $lessonNum = $i + 1
    Test-Step "$(3 + $lessonNum). Create Lesson $lessonNum" {
        $body = @{
            contentRaw = $lessons[$i].content
            domain = $lessons[$i].domain
            mood = $lessons[$i].mood
            resonance = $lessons[$i].resonance
            tags = @("e2e-test")
        } | ConvertTo-Json

        $response = Invoke-WebRequest -Uri "$baseUrl/lessons" -Method POST -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body $body -UseBasicParsing
        
        if ($response.StatusCode -ne 201) {
            throw "Expected 201, got $($response.StatusCode)"
        }

        $json = $response.Content | ConvertFrom-Json
        $script:lessonIds += $json.id
        
        Write-Host "  Lesson ID: $($json.id)" -ForegroundColor Gray
        Write-Host "  Domain: $($json.domain), Mood: $($json.mood)" -ForegroundColor Gray
    }
}

# Test 9: Get All Lessons
Test-Step "9. Get All Lessons" {
    $response = Invoke-WebRequest -Uri "$baseUrl/lessons" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.total -ne 5) {
        throw "Expected 5 lessons, got $($json.total)"
    }
    
    Write-Host "  Total lessons: $($json.total)" -ForegroundColor Gray
}

# Test 10: Get Single Lesson
Test-Step "10. Get Single Lesson" {
    $lessonId = $lessonIds[0]
    $response = Invoke-WebRequest -Uri "$baseUrl/lessons/$lessonId" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.id -ne $lessonId) {
        throw "Lesson ID mismatch"
    }
    
    Write-Host "  Lesson content: $($json.contentRaw.Substring(0, 50))..." -ForegroundColor Gray
}

# Test 11: Update Lesson
Test-Step "11. Update Lesson (add tags and gratitude)" {
    $lessonId = $lessonIds[0]
    $body = @{
        contentRaw = "Today I learned patience and deep breathing during stress"
        domain = "INNER"
        mood = 1
        resonance = 3
        tags = @("patience", "stress-management", "e2e-test")
        gratitude = "Grateful for today challenges"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri "$baseUrl/lessons/$lessonId" -Method PATCH -ContentType "application/json" -Headers @{Authorization="Bearer $token"} -Body $body -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.gratitude -ne "Grateful for today challenges") {
        throw "Gratitude update failed"
    }
    
    Write-Host "  Updated with gratitude and tags" -ForegroundColor Gray
}

# Test 12: AI Analysis
Test-Step "12. AI Analysis on Lesson" {
    $lessonId = $lessonIds[0]
    $response = Invoke-WebRequest -Uri "$baseUrl/ai/lessons/$lessonId/analyze" -Method POST -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if (-not $json.summary) {
        throw "No summary returned"
    }
    
    Write-Host "  Summary: $($json.summary)" -ForegroundColor Gray
    Write-Host "  Concepts: $($json.concepts -join ', ')" -ForegroundColor Gray
}

# Test 13: Get Analytics
Test-Step "13. Get Analytics Overview" {
    $response = Invoke-WebRequest -Uri "$baseUrl/analytics/overview" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.totalLessons -ne 5) {
        throw "Expected 5 lessons in analytics, got $($json.totalLessons)"
    }
    
    Write-Host "  Total: $($json.totalLessons), Streak: $($json.streak)" -ForegroundColor Gray
    Write-Host "  Domains: INNER=$($json.domainStats[0].count), HEALTH=$($json.domainStats[1].count)" -ForegroundColor Gray
}

# Test 14: Get Goal with Roadmap
Test-Step "14. Get Goal Roadmap" {
    $response = Invoke-WebRequest -Uri "$baseUrl/goals/$goalId/roadmap" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }

    $json = $response.Content | ConvertFrom-Json
    
    if ($json.totalSprints -ne 100) {
        throw "Expected 100 total sprints, got $($json.totalSprints)"
    }
    
    Write-Host "  Progress: $($json.progress)%" -ForegroundColor Gray
    Write-Host "  Current Sprint: #$($json.currentSprint.index), Done: $($json.currentSprint.done)/100" -ForegroundColor Gray
}

# Test 15: Delete Lesson
Test-Step "15. Delete Lesson" {
    $lessonId = $lessonIds[1]
    $response = Invoke-WebRequest -Uri "$baseUrl/lessons/$lessonId" -Method DELETE -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    if ($response.StatusCode -ne 200) {
        throw "Expected 200, got $($response.StatusCode)"
    }
    
    Write-Host "  Lesson deleted: $lessonId" -ForegroundColor Gray
}

# Test 16: Verify Deletion
Test-Step "16. Verify Lesson Count After Delete" {
    $response = Invoke-WebRequest -Uri "$baseUrl/lessons" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    
    if ($json.total -ne 4) {
        throw "Expected 4 lessons after delete, got $($json.total)"
    }
    
    Write-Host "  Remaining lessons: $($json.total)" -ForegroundColor Gray
}

# Test 17: Filter Lessons by Domain
Test-Step "17. Filter Lessons by Domain (INNER)" {
    $response = Invoke-WebRequest -Uri "$baseUrl/lessons?domain=INNER" -Method GET -Headers @{Authorization="Bearer $token"} -UseBasicParsing
    
    $json = $response.Content | ConvertFrom-Json
    
    $innerCount = ($json.lessons | Where-Object { $_.domain -eq "INNER" }).Count
    
    if ($innerCount -ne $json.lessons.Count) {
        throw "Filter failed: got non-INNER lessons"
    }
    
    Write-Host "  INNER lessons: $innerCount" -ForegroundColor Gray
}

# Summary
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($testResults.Passed + $testResults.Failed)" -ForegroundColor White
Write-Host "Passed: $($testResults.Passed)" -ForegroundColor Green
Write-Host "Failed: $($testResults.Failed)" -ForegroundColor Red

if ($testResults.Failed -eq 0) {
    Write-Host "`n✅ All tests passed!" -ForegroundColor Green
    Write-Host "`n🎉 E2E API testing completed successfully!" -ForegroundColor Cyan
    Write-Host "`nTest user created:" -ForegroundColor Yellow
    Write-Host "  Email: $testEmail" -ForegroundColor Gray
    Write-Host "  User ID: $userId" -ForegroundColor Gray
    Write-Host "  Goal ID: $goalId" -ForegroundColor Gray
    Write-Host "  Lessons: $($lessonIds.Count) created (1 deleted, 4 remaining)" -ForegroundColor Gray
} else {
    Write-Host "`n❌ Some tests failed. Review errors above." -ForegroundColor Red
    
    Write-Host "`nFailed Tests:" -ForegroundColor Red
    $testResults.Tests | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
        Write-Host "    Error: $($_.Error)" -ForegroundColor Gray
    }
}

Write-Host "`n================================`n" -ForegroundColor Cyan
