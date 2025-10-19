# End-to-End Testing Guide
## Life Lessons App - Complete User Journey

### Test Environment
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Database: PostgreSQL (port 15432)
- Redis: (port 16379)

---

## 🧪 Test Scenario 1: New User Journey

### 1.1 Sign Up (✓ To Test)
**URL:** http://localhost:3000/signup

**Steps:**
1. Navigate to signup page
2. Enter email: `testuser@lifelessons.app`
3. Enter password: `TestPass123!`
4. Enter name: `Test User`
5. Click "Đăng ký"

**Expected:**
- ✅ Toast: "Đăng ký thành công"
- ✅ Auto redirect to `/dashboard`
- ✅ Token stored in localStorage
- ✅ Welcome message shows user name

---

### 1.2 Create Goal (✓ To Test)
**URL:** http://localhost:3000/goals

**Steps:**
1. Navigate to Goals page
2. Click "Tạo mục tiêu ngay"

**Expected:**
- ✅ Toast: "Đang tạo mục tiêu..."
- ✅ Toast: "Mục tiêu 10,000 bài học đã được tạo! 🎉"
- ✅ Goal dashboard appears
- ✅ Progress shows 0/10,000
- ✅ Sprint #1 shows as "Đang chạy"

---

### 1.3 Quick Capture - Create First Lesson (✓ To Test)
**URL:** http://localhost:3000/dashboard

**Steps:**
1. Navigate to Dashboard
2. Enter in Quick Capture: "Hôm nay mình học được cách kiên nhẫn hơn khi đối mặt với thử thách"
3. Select Domain: "INNER"
4. Select Mood: +2 (😄)
5. Select Resonance: 3
6. Click "Save Lesson"

**Expected:**
- ✅ Toast: "Đang lưu bài học..."
- ✅ Toast: "Đã lưu bài học! 🎉"
- ✅ Form clears
- ✅ Recent Lessons updates
- ✅ Stats increment (totalLessons: 1)

---

### 1.4 Create Multiple Lessons (✓ To Test)
**Repeat 4 more times with different content:**

**Lesson 2:**
- Content: "Tập thể dục buổi sáng giúp mình tập trung cả ngày"
- Domain: HEALTH
- Mood: +1
- Resonance: 2

**Lesson 3:**
- Content: "Lắng nghe chủ động giúp cải thiện mối quan hệ với đồng nghiệp"
- Domain: RELATIONSHIP
- Mood: +1
- Resonance: 3

**Lesson 4:**
- Content: "Lập ngân sách chi tiết giúp kiểm soát chi tiêu tốt hơn"
- Domain: FINANCE
- Mood: 0
- Resonance: 2

**Lesson 5:**
- Content: "Thiền định 10 phút mỗi sáng giúp mình bình tĩnh hơn"
- Domain: INNER
- Mood: +2
- Resonance: 3

**Expected:**
- ✅ All 5 lessons created successfully
- ✅ Dashboard stats show: 5 total lessons
- ✅ Recent Lessons shows 5 entries

---

### 1.5 View Journal (✓ To Test)
**URL:** http://localhost:3000/journal

**Steps:**
1. Navigate to Journal page
2. Verify all 5 lessons display
3. Test filters:
   - Filter by domain "INNER" → 2 results
   - Clear filter → 5 results
   - Sort by "Resonance cao" → highest first
4. Test view toggle (Grid ↔ List)

**Expected:**
- ✅ 5 lessons displayed
- ✅ Filters work correctly
- ✅ Sort works correctly
- ✅ View toggle works
- ✅ Lesson cards show: domain badge, mood emoji, date, resonance

---

### 1.6 Edit Lesson (✓ To Test)
**Steps:**
1. In Journal, click on Lesson 1 card
2. Click "Chỉnh sửa" button
3. Edit content: Add " và học cách thở sâu khi căng thẳng"
4. Change mood from +2 to +1
5. Add tags: "patience, stress-management"
6. Add gratitude: "Biết ơn về thử thách hôm nay"
7. Click "Lưu thay đổi"

**Expected:**
- ✅ Edit mode activates
- ✅ All fields editable
- ✅ Toast: "Đang lưu..."
- ✅ Toast: "Đã lưu thay đổi"
- ✅ Returns to view mode
- ✅ Changes reflected immediately
- ✅ Tags displayed as chips
- ✅ Gratitude shown in yellow box

---

### 1.7 AI Analysis (✓ To Test)
**Steps:**
1. While viewing edited Lesson 1
2. Click "Phân tích bằng AI"
3. Wait for analysis

**Expected:**
- ✅ Button shows shimmer animation
- ✅ Toast: "AI đang phân tích bài học..."
- ✅ Loading panel with pulsing sparkle
- ✅ Toast: "Phân tích hoàn tất! 🎉"
- ✅ Results appear with animation:
  - Summary section (blue)
  - Concepts chips (purple) - 3 concepts
  - Next Question (green box)
- ✅ Concepts are hoverable
- ✅ All sections animated in sequence

---

### 1.8 Delete Lesson (✓ To Test)
**Steps:**
1. Go back to Journal
2. Hover over Lesson 2
3. Click Delete (trash icon)
4. Confirm in dialog

**Expected:**
- ✅ Confirm dialog appears
- ✅ Toast: "Đang xóa..."
- ✅ Toast: "Đã xóa bài học"
- ✅ Lesson removed from list
- ✅ Total count updates to 4
- ✅ Smooth exit animation

---

### 1.9 Check Analytics (✓ To Test)
**URL:** http://localhost:3000/dashboard

**Steps:**
1. Return to Dashboard
2. Verify stats cards:
   - Total Lessons
   - This Week
   - Streak
   - Resonance Average
   - Domain breakdown
3. Check Recent Lessons section

**Expected:**
- ✅ Total Lessons: 4
- ✅ This Week: 4
- ✅ Streak: 1 day (if same day) or 0
- ✅ Resonance avg calculated correctly
- ✅ Domain stats show counts
- ✅ Recent 5 lessons displayed

---

### 1.10 Check Goal Progress (✓ To Test)
**URL:** http://localhost:3000/goals

**Steps:**
1. Navigate to Goals page
2. Verify progress updates

**Expected:**
- ✅ Current: 4 lessons (after delete)
- ✅ Progress: 0.04% (4/10,000)
- ✅ Sprint #1: 4/100
- ✅ Progress ring animates
- ✅ Sprint bar shows 4% fill
- ✅ Stats cards accurate

---

### 1.11 Logout & Login (✓ To Test)
**Steps:**
1. Click user avatar/menu
2. Click "Đăng xuất"
3. Redirected to login
4. Login with same credentials

**Expected:**
- ✅ Logout clears localStorage
- ✅ Redirects to `/login`
- ✅ Login successful
- ✅ Redirects to `/dashboard`
- ✅ All data persists
- ✅ 4 lessons still there

---

## 🧪 Test Scenario 2: Error Handling

### 2.1 Invalid Login (✓ To Test)
**Steps:**
1. Go to login
2. Enter wrong password
3. Click Login

**Expected:**
- ✅ Toast: Error message
- ✅ Form stays on page
- ✅ No redirect

### 2.2 Empty Quick Capture (✓ To Test)
**Steps:**
1. Dashboard Quick Capture
2. Click Save without entering text

**Expected:**
- ✅ Toast: "Vui lòng nhập nội dung bài học"
- ✅ No API call

### 2.3 Network Error Simulation (✓ To Test)
**Steps:**
1. Stop backend server
2. Try to create lesson
3. Restart backend

**Expected:**
- ✅ Toast: Network error
- ✅ Graceful error handling
- ✅ No crash

---

## 🧪 Test Scenario 3: Performance & UX

### 3.1 Loading States (✓ To Test)
**Verify all loading states work:**
- ✅ Dashboard: Skeleton loaders
- ✅ Journal: Grid skeleton
- ✅ Goals: Spinner while loading
- ✅ Edit page: Loader when fetching lesson
- ✅ AI Analysis: Pulsing animation

### 3.2 Animations (✓ To Test)
**Verify smooth animations:**
- ✅ Page transitions
- ✅ Toast notifications slide in/out
- ✅ Progress ring animates
- ✅ AI results stagger in
- ✅ Lesson cards fade in
- ✅ Hover effects on cards

### 3.3 Responsive Design (✓ To Test)
**Test breakpoints:**
- ✅ Desktop (1920px): 3-column layouts work
- ✅ Tablet (768px): 2-column layouts
- ✅ Mobile (375px): 1-column, stacked

---

## 🧪 Test Scenario 4: Edge Cases

### 4.1 Very Long Content (✓ To Test)
**Steps:**
1. Create lesson with 2000+ characters
2. Verify truncation in journal
3. Verify "Xem thêm" works

### 4.2 Special Characters (✓ To Test)
**Steps:**
1. Create lesson with emojis: "🎉 🚀 ✨"
2. Create lesson with Vietnamese: "Đặng, Nguyễn, Trần"
3. Verify display correctly

### 4.3 Multiple Tabs (✓ To Test)
**Steps:**
1. Open 2 browser tabs
2. Create lesson in tab 1
3. Check if tab 2 updates (should on next action due to query invalidation)

---

## 📊 Test Results Checklist

### Core Functionality
- [ ] User can signup
- [ ] User can login/logout
- [ ] User can create lessons
- [ ] User can view journal
- [ ] User can edit lessons
- [ ] User can delete lessons
- [ ] AI analysis works
- [ ] Goals tracking works
- [ ] Analytics updates correctly

### UI/UX
- [ ] All toasts appear correctly
- [ ] All animations smooth
- [ ] Loading states show
- [ ] Error states handled
- [ ] Responsive on all devices
- [ ] Dark mode works (if implemented)

### Data Integrity
- [ ] Lesson count accurate
- [ ] Goal progress accurate
- [ ] Stats calculations correct
- [ ] Data persists after logout
- [ ] No data loss on errors

---

## 🐛 Known Issues (To Fix)

1. **Goal.current not syncing automatically**
   - Issue: When goal created, current = 0 even if lessons exist
   - Workaround: Backend should sync on goal creation
   - Priority: Medium

2. **Token expiration handling**
   - Issue: Need to test refresh token flow
   - Priority: High

3. **Real-time updates**
   - Issue: Multiple tabs don't sync immediately
   - Enhancement: Consider websockets
   - Priority: Low

---

## 🚀 Next Steps After E2E Testing

1. **Fix any bugs found**
2. **Add Playwright automated tests**
3. **Performance optimization**
4. **Deploy to staging**
5. **User acceptance testing**
6. **Production deployment**

---

## 📝 Test Notes

**Date:** October 18, 2025
**Tester:** 
**Environment:** Local Development
**Browser:** Chrome/Edge/Firefox
**Status:** ⏳ Pending
