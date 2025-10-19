# ✅ Testing Checklist - Life Lessons App

Checklist này giúp bạn verify toàn bộ features đang hoạt động đúng.

## 🔧 Setup Verification

### Pre-requisites
- [ ] Node.js 18+ installed (`node --version`)
- [ ] pnpm 8+ installed (`pnpm --version`)
- [ ] Docker Desktop running (`docker ps`)
- [ ] Git installed (optional)

### Installation
- [ ] Dependencies installed (`pnpm install`)
- [ ] Prisma Client generated (`npx prisma generate`)
- [ ] .env file exists (copy from .env.example)
- [ ] Docker containers running (`docker-compose ps`)
  - [ ] PostgreSQL container up (port 5432)
  - [ ] Redis container up (port 6379)
- [ ] Database migrated (`npx prisma migrate dev`)
- [ ] Demo data seeded (`npx ts-node scripts/seed.ts`)

### Servers Running
- [ ] Backend running on http://localhost:3001
  - [ ] Console shows "Nest application successfully started"
  - [ ] No errors in terminal
- [ ] Frontend running on http://localhost:3000
  - [ ] Console shows "Next.js compiled successfully"
  - [ ] No errors in terminal
- [ ] Swagger docs accessible at http://localhost:3001/docs

---

## 🧪 Functional Testing

### 1. Authentication Flow

#### Login
- [ ] Navigate to http://localhost:3000
- [ ] Click "Đăng nhập" or go to `/login`
- [ ] Enter demo credentials:
  - Email: `demo@lifelessons.app`
  - Password: `Passw0rd!`
- [ ] Click "Đăng nhập"
- [ ] ✅ Redirected to `/dashboard`
- [ ] ✅ See welcome message with user email

#### Signup
- [ ] Go to `/signup`
- [ ] Enter new user details:
  - Name: "Test User"
  - Email: "test@example.com"
  - Password: "Test1234!"
- [ ] Click "Đăng ký"
- [ ] ✅ Account created successfully
- [ ] ✅ Redirected to dashboard

#### Logout
- [ ] Click "Đăng xuất" button
- [ ] ✅ Redirected to login page
- [ ] ✅ Cannot access `/dashboard` without login

---

### 2. Dashboard

#### Quick Capture
- [ ] See "Ghi chép nhanh" card
- [ ] Enter lesson content: "Hôm nay tôi học được rằng..."
- [ ] Select domain: "Nội tâm"
- [ ] Set mood: 1 (positive)
- [ ] Set resonance: 2
- [ ] Click "Lưu bài học"
- [ ] ✅ Success message appears
- [ ] ✅ Form clears
- [ ] ✅ Total lessons count increases

#### Progress Display
- [ ] See progress ring with current/10000
- [ ] ✅ Shows correct lesson count (13 after adding one)
- [ ] ✅ Progress bar updates
- [ ] See streak counter
- [ ] See domain statistics cards

#### Navigation
- [ ] Click "Nhật ký" → navigates to `/journal`
- [ ] Click "Mục tiêu" → navigates to `/goals`
- [ ] Click "Cộng đồng" → navigates to `/community`
- [ ] Click "Cài đặt" → navigates to `/settings`

---

### 3. Journal

#### List View
- [ ] Navigate to `/journal`
- [ ] ✅ See list of lessons (12 from seed + newly created)
- [ ] Each card shows:
  - [ ] Domain chip (color coded)
  - [ ] Date created
  - [ ] Content preview (truncated)
  - [ ] Mood indicator
  - [ ] Resonance indicator

#### Filters
- [ ] Enter search text: "health"
- [ ] ✅ List filters to matching lessons
- [ ] Clear search, select domain: "Sức khỏe"
- [ ] ✅ List shows only Health lessons
- [ ] Reset filters
- [ ] ✅ Full list returns

#### Detail View
- [ ] Click "Chi tiết" on any lesson
- [ ] ✅ Navigates to `/journal/[id]`
- [ ] See full content
- [ ] See metadata (domain, mood, resonance, date)
- [ ] See gratitude section (if exists)

#### AI Analysis
- [ ] On detail page, click "🤖 Phân tích với AI"
- [ ] ✅ Loading state appears
- [ ] ✅ After ~1-2 seconds, see:
  - [ ] Blue box: "Tóm tắt AI"
  - [ ] Purple box: "Khái niệm chính" (chips)
  - [ ] Green box: "Câu hỏi tiếp theo"
- [ ] Navigate back to list
- [ ] ✅ Lesson card now shows AI summary

#### Delete
- [ ] On list view, click "Xóa" on a lesson
- [ ] ✅ Confirmation dialog appears
- [ ] Confirm deletion
- [ ] ✅ Lesson removed from list
- [ ] ✅ Total count decreases

---

### 4. Goals

#### View Progress
- [ ] Navigate to `/goals`
- [ ] ✅ See large progress number (current/10,000)
- [ ] ✅ See percentage completed
- [ ] ✅ Progress bar visualization
- [ ] See three stat cards:
  - [ ] Sprint còn lại
  - [ ] Bài học/sprint (100)
  - [ ] Nhịp độ (Hàng ngày)

#### Current Sprint
- [ ] See "Sprint hiện tại #1" section
- [ ] ✅ Shows progress (done/target)
- [ ] ✅ Green progress bar
- [ ] Shows start and end dates

#### Sprint History
- [ ] Scroll to "Lịch sử Sprint"
- [ ] ✅ See Sprint #1 with current progress
- [ ] (If multiple sprints) See historical sprints

#### Create Goal (if none exists)
- [ ] If no goal, see "Tạo mục tiêu"
- [ ] Click "Tạo mục tiêu"
- [ ] ✅ Goal created with:
  - Target: 10,000
  - Sprint size: 100
  - Current: (lesson count)
- [ ] ✅ First sprint auto-created

---

### 5. Community (Scaffold)

- [ ] Navigate to `/community`
- [ ] ✅ Page loads without errors
- [ ] See three sections:
  - [ ] Feed ẩn danh (TODO placeholder)
  - [ ] Nhóm của bạn (empty state)
  - [ ] Thử thách (3 challenge cards)
- [ ] ✅ All UI elements render correctly

---

### 6. Settings

#### Account Tab
- [ ] Navigate to `/settings`
- [ ] Default tab: "Tài khoản"
- [ ] ✅ Email field shows current email (disabled)
- [ ] ✅ Name field shows current name (editable)
- [ ] ✅ Locale dropdown (vi/en)
- [ ] ✅ Timezone dropdown
- [ ] Change name to "Updated Name"
- [ ] Click "Lưu thay đổi"
- [ ] ✅ (Note: Save not wired yet, but UI works)

#### Privacy Tab
- [ ] Click "Riêng tư" tab
- [ ] ✅ See privacy default dropdown
- [ ] ✅ Warning message about public mode
- [ ] Change value and verify dropdown works

#### Reminders Tab
- [ ] Click "Nhắc nhở" tab
- [ ] ✅ See example reminder card (if seeded)
- [ ] ✅ "Thêm nhắc nhở" button exists
- [ ] ✅ Delete button works (UI only)

#### Export Tab
- [ ] Click "Xuất dữ liệu" tab
- [ ] ✅ See three export options:
  - [ ] 📄 Markdown
  - [ ] 📊 CSV
  - [ ] 🗃️ JSON
- [ ] Click each button
- [ ] ✅ (Note: Download not implemented yet, but UI works)

---

## 🔗 API Testing (via Swagger)

### Access Swagger
- [ ] Open http://localhost:3001/docs
- [ ] ✅ Swagger UI loads
- [ ] ✅ See all endpoint groups:
  - Auth, Users, Lessons, Goals, AI, Analytics

### Test Auth Endpoints
- [ ] Expand "auth" section
- [ ] Try POST `/auth/login`:
  ```json
  {
    "email": "demo@lifelessons.app",
    "password": "Passw0rd!"
  }
  ```
- [ ] ✅ Returns 200 with access_token
- [ ] Copy access_token

### Test Authenticated Endpoints
- [ ] Click "Authorize" button (top right)
- [ ] Enter: `Bearer {your_access_token}`
- [ ] Click "Authorize"
- [ ] Try GET `/me`
- [ ] ✅ Returns user profile
- [ ] Try GET `/lessons`
- [ ] ✅ Returns lessons array

### Test AI Endpoint
- [ ] Get a lesson ID from `/lessons` response
- [ ] Try POST `/ai/lessons/{id}/analyze`
- [ ] ✅ Returns analysis object with:
  - summary
  - concepts[]
  - nextQuestion

---

## 🗄️ Database Verification

### Prisma Studio
- [ ] Run `npx prisma studio`
- [ ] ✅ Opens at http://localhost:5555
- [ ] Browse tables:
  - [ ] User: See demo user + test users
  - [ ] Lesson: See all lessons (12+ seed data)
  - [ ] Goal: See goal record
  - [ ] Sprint: See sprint records
  - [ ] ConceptCategory: See 4 categories
  - [ ] Concept: See sample concepts

### Data Integrity
- [ ] Check User table:
  - [ ] Passwords are hashed (not plain text)
  - [ ] Email is unique
- [ ] Check Lesson table:
  - [ ] All lessons have userId foreign key
  - [ ] Domain enum values correct (INNER, HEALTH, etc.)
  - [ ] Timestamps populated
- [ ] Check Goal → Sprint relation:
  - [ ] Sprint has goalId foreign key
  - [ ] Sprint index starts at 1

---

## 🎨 UI/UX Testing

### Responsive Design
- [ ] Resize browser window:
  - [ ] Desktop (>1280px): 2-column layouts work
  - [ ] Tablet (768-1279px): Adapts gracefully
  - [ ] Mobile (<768px): Stacks vertically
- [ ] All text readable at different sizes
- [ ] Buttons remain clickable

### Dark Mode
- [ ] System dark mode on:
  - [ ] ✅ App switches to dark theme
  - [ ] ✅ All text readable (good contrast)
  - [ ] ✅ Cards have dark backgrounds
- [ ] Switch to light mode:
  - [ ] ✅ App switches to light theme

### Loading States
- [ ] Observe loading states:
  - [ ] Login button shows "Đang đăng nhập..."
  - [ ] Quick capture shows "Đang lưu..."
  - [ ] AI analyze shows "Đang phân tích..."
  - [ ] Journal page shows "Đang tải..."

### Error Handling
- [ ] Try login with wrong password:
  - [ ] ✅ Error message appears
- [ ] Create lesson with empty content:
  - [ ] ✅ Validation prevents submission
- [ ] Disconnect internet, try action:
  - [ ] ✅ Network error shown

---

## 🔍 Console Checks

### Browser Console (F12)
- [ ] No red errors in Console tab
- [ ] No 404 errors for resources
- [ ] React Query devtools accessible (if enabled)

### Backend Console
- [ ] Backend terminal shows:
  - [ ] Request logs for each API call
  - [ ] No unhandled exceptions
  - [ ] JWT auth guard working (401 on unauthorized)

### Docker Logs
- [ ] Run `docker-compose logs -f`
- [ ] PostgreSQL logs show connections
- [ ] Redis logs show no errors

---

## ✅ Final Checklist

### Core Functionality
- [ ] Can create account
- [ ] Can login/logout
- [ ] Can create lessons
- [ ] Can view lesson list
- [ ] Can analyze lessons with AI
- [ ] Can view goals progress
- [ ] Can navigate all pages
- [ ] All forms validate input

### Performance
- [ ] Pages load in < 2s (local)
- [ ] AI analysis returns in < 2s
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling on lists

### Data Persistence
- [ ] Created lessons persist after page refresh
- [ ] Login session persists (JWT stored)
- [ ] Goal progress updates correctly
- [ ] Filters state resets on navigation

---

## 🐛 Known Issues (Expected)

These are TODO items, not bugs:

- [ ] Export buttons don't download files yet (endpoints TODO)
- [ ] Share link generation not implemented
- [ ] Reminder notifications not sent (BullMQ TODO)
- [ ] Groups features are scaffold only
- [ ] Concepts module not fully wired
- [ ] Some settings save buttons don't persist (TODO)
- [ ] Voice capture not implemented
- [ ] File attachments not implemented

---

## 📊 Testing Results

**Date**: ________________

**Tester**: ________________

**Overall Status**: 
- [ ] All critical features working ✅
- [ ] Minor issues found (list below)
- [ ] Major issues found (escalate)

**Notes**:
```
(Add any observations, bugs found, or suggestions)
```

---

## 🎯 Success Criteria

For MVP to be considered complete, minimum requirements:

- ✅ 5/7 acceptance criteria met (see SUMMARY.md)
- ✅ No critical bugs in core flow
- ✅ Authentication working
- ✅ Lesson CRUD working
- ✅ AI mock analysis working
- ✅ Goals tracking working
- ✅ Dashboard displays correctly

**Expected Result**: 95%+ of checklist items pass ✅

---

Need help with any failing tests? Check:
- [`QUICKSTART.md`](./QUICKSTART.md) - Setup troubleshooting
- [`README.md`](./README.md) - Full documentation
- Backend logs in terminal
- Browser DevTools Console/Network
