# Test Plan: Export & Share Features

## 🎯 Objectives
Test newly implemented Export and Share features to validate:
1. Export endpoint returns correct formats (JSON, CSV, Markdown)
2. Share link generation works
3. Public share view displays anonymized lessons
4. End-to-end user flows work as expected

---

## 🧪 Test Cases

### 1. Export Feature

#### Test 1.1: Export JSON
**Steps:**
1. Login as demo@lifelessons.app / Passw0rd!
2. GET http://localhost:3001/api/export?format=json
   - Headers: `Authorization: Bearer <access_token>`
3. Verify response structure:
   ```json
   {
     "lessons": [...],
     "goals": [...],
     "totalLessons": number,
     "exportedAt": "ISO date"
   }
   ```

**Expected:**
- ✅ 200 OK status
- ✅ Valid JSON structure
- ✅ Contains demo user's 12 seed lessons
- ✅ Goals data included

---

#### Test 1.2: Export CSV
**Steps:**
1. GET http://localhost:3001/api/export?format=csv
   - Headers: `Authorization: Bearer <access_token>`
2. Verify CSV format:
   - Header row: `id,content,domain,tags,mood,resonance,createdAt`
   - Data rows contain demo lessons

**Expected:**
- ✅ 200 OK status
- ✅ Content-Type: text/csv
- ✅ Valid CSV with 12+ data rows
- ✅ No syntax errors (commas, quotes escaped)

---

#### Test 1.3: Export Markdown
**Steps:**
1. GET http://localhost:3001/api/export?format=markdown
   - Headers: `Authorization: Bearer <access_token>`
2. Verify Markdown structure:
   - `# Life Lessons Export` header
   - `## Lessons` section
   - Each lesson formatted with ### title, metadata, content

**Expected:**
- ✅ 200 OK status
- ✅ Content-Type: text/markdown
- ✅ Valid Markdown syntax
- ✅ Readable format with all lesson details

---

#### Test 1.4: Export Unauthorized
**Steps:**
1. GET http://localhost:3001/api/export?format=json
   - No Authorization header

**Expected:**
- ✅ 401 Unauthorized
- ✅ Error message about missing/invalid token

---

### 2. Share Feature Backend

#### Test 2.1: Create Share Link
**Steps:**
1. Login as demo user
2. Create new lesson or pick existing one (get lesson ID)
3. POST http://localhost:3001/api/lessons/:id/share
   - Headers: `Authorization: Bearer <access_token>`
4. Verify response contains shareToken

**Expected:**
- ✅ 200 OK
- ✅ Response: `{ shareToken: "unique_uuid", shareUrl: "..." }`
- ✅ Lesson visibility updated to LINK
- ✅ shareToken saved to database

---

#### Test 2.2: View Shared Lesson (Valid Token)
**Steps:**
1. GET http://localhost:3001/api/lessons/shared/:shareToken
   - No auth required (public endpoint)
2. Verify anonymized response

**Expected:**
- ✅ 200 OK
- ✅ Response contains:
  - `content`, `domain`, `tags`, `mood`, `resonance`, `createdAt`
  - `summary`, `aiConcepts` (if analyzed)
  - `isAnonymous: true`
- ✅ Response does NOT contain:
  - `userId`, `user.name`, `user.email`

---

#### Test 2.3: View Shared Lesson (Invalid Token)
**Steps:**
1. GET http://localhost:3001/api/lessons/shared/invalid-token-123

**Expected:**
- ✅ 404 Not Found
- ✅ Error: "Lesson not found or not shared"

---

#### Test 2.4: View Shared Lesson (Private Lesson)
**Steps:**
1. Create lesson with visibility=PRIVATE
2. Try GET /api/lessons/shared/:token (even if token exists)

**Expected:**
- ✅ 404 Not Found (or appropriate error)
- ✅ Private lessons not accessible via share endpoint

---

### 3. Share Feature Frontend

#### Test 3.1: Share Page Displays Lesson
**Steps:**
1. Get valid shareToken from test 2.1
2. Open http://localhost:3000/share/:shareToken in browser
3. Verify page renders correctly

**Expected:**
- ✅ Page loads without errors
- ✅ Lesson content displayed
- ✅ Domain, tags, mood, resonance chips shown
- ✅ AI summary shown (if exists)
- ✅ AI concepts chips shown (if exist)
- ✅ "Try Life Lessons" CTA visible
- ✅ No user personal info visible

---

#### Test 3.2: Share Page - Invalid Token
**Steps:**
1. Open http://localhost:3000/share/invalid-token-999

**Expected:**
- ✅ Page shows error state
- ✅ Message: "Lesson Not Found"
- ✅ "Try Life Lessons" button still shown

---

#### Test 3.3: Share Page - Dark Mode
**Steps:**
1. Toggle system dark mode
2. View shared lesson page

**Expected:**
- ✅ Dark mode styles apply correctly
- ✅ Text readable on dark background
- ✅ No contrast issues

---

### 4. End-to-End User Flows

#### Flow 4.1: Complete Share Flow
**Steps:**
1. Login to web app (http://localhost:3000)
2. Navigate to /journal
3. Click on a lesson to edit
4. Click "Share" button
5. Copy share link
6. Open link in incognito window
7. Verify lesson displays correctly

**Expected:**
- ✅ Share button works
- ✅ Link copied to clipboard
- ✅ Shared view displays in incognito
- ✅ Anonymous (no user info)

---

#### Flow 4.2: Complete Export Flow
**Steps:**
1. Login to web app
2. Navigate to /settings
3. Click "Export" tab
4. Click "Export JSON" button
5. Download file
6. Verify file contents

**Expected:**
- ✅ Export button triggers download
- ✅ File downloads successfully
- ✅ File contains valid JSON with lessons
- ✅ Same flow works for CSV and Markdown

---

## 📋 Test Results

### Test Execution Log

| Test ID | Test Name | Status | Notes |
|---------|-----------|--------|-------|
| 1.1 | Export JSON | ⏳ Pending | |
| 1.2 | Export CSV | ⏳ Pending | |
| 1.3 | Export Markdown | ⏳ Pending | |
| 1.4 | Export Unauthorized | ⏳ Pending | |
| 2.1 | Create Share Link | ⏳ Pending | |
| 2.2 | View Shared (Valid) | ⏳ Pending | |
| 2.3 | View Shared (Invalid) | ⏳ Pending | |
| 2.4 | View Shared (Private) | ⏳ Pending | |
| 3.1 | Share Page Display | ⏳ Pending | |
| 3.2 | Share Page Error | ⏳ Pending | |
| 3.3 | Share Page Dark Mode | ⏳ Pending | |
| 4.1 | E2E Share Flow | ⏳ Pending | |
| 4.2 | E2E Export Flow | ⏳ Pending | |

---

## 🐛 Issues Found

_To be populated during testing_

---

## ✅ Acceptance Criteria

### Export Feature
- [ ] All 3 formats (JSON, CSV, MD) work correctly
- [ ] Unauthorized requests return 401
- [ ] Export includes all user lessons + goals
- [ ] Export is downloadable from frontend

### Share Feature
- [ ] Share link generation creates unique token
- [ ] Public view displays anonymized lesson
- [ ] Invalid tokens show error page
- [ ] Private lessons not accessible via share
- [ ] Frontend page renders correctly
- [ ] Dark mode works

### Overall
- [ ] No console errors in browser
- [ ] No server errors in backend logs
- [ ] API responses under 500ms (local)
- [ ] UI responsive on mobile/tablet/desktop

---

## 🚀 Next Steps After Testing

1. **If tests pass:**
   - Update PROGRESS_REPORT.md (78% → 85%+)
   - Document API in Swagger
   - Create user documentation for Export/Share features

2. **If issues found:**
   - Log issues in test results table
   - Fix critical bugs
   - Re-run failed tests

3. **Priority 2 work:**
   - Implement reminder jobs (BullMQ)
   - Add basic tests (e2e with supertest)
   - Polish Dashboard UI components
