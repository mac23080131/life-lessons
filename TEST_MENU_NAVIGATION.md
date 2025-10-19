# 🧪 Test Script - Menu & Navigation Updates

## Mục đích
Kiểm tra các cải tiến về menu navigation, dropdown, và share button.

---

## ✅ Test Cases

### 1. Desktop Menu Dropdown
**Steps:**
1. Mở app trên desktop (width ≥ 768px)
2. Hover chuột vào "Journal" trong menu
3. **Expected:** Dropdown hiện với 2 items:
   - Tất cả bài học
   - Bài học mới
4. Click vào "Tất cả bài học"
5. **Expected:** Navigate tới `/dashboard/journal`

**Status:** [ ]

---

### 2. Community Menu (New Feature)
**Steps:**
1. Hover vào "Cộng đồng/Community" trong menu
2. **Expected:** Dropdown hiện với 3 items:
   - Bảng tin
   - Nhóm  
   - Thử thách
3. Click vào mỗi item
4. **Expected:** Navigate tới:
   - `/dashboard/community`
   - `/dashboard/community/groups`
   - `/dashboard/community/challenges`

**Status:** [ ]

---

### 3. Mobile Menu
**Steps:**
1. Resize browser về mobile width (<768px)
2. Click vào hamburger menu (☰)
3. **Expected:** Menu mở ra
4. Click vào "Journal"
5. **Expected:** 
   - Sub-items hiện ra phía dưới
   - Có indent để phân biệt
6. Click vào "Tất cả bài học"
7. **Expected:** 
   - Navigate tới page đúng
   - Menu tự động đóng

**Status:** [ ]

---

### 4. Lesson Card - Share Button (Desktop)
**Steps:**
1. Vào trang `/dashboard/journal`
2. **Before hover:** Share button không nhìn thấy (opacity-0)
3. Hover chuột vào một lesson card
4. **Expected:** 3 nút hiện ra:
   - 🔵 Share (xanh)
   - 🟣 Edit (tím)
   - 🔴 Delete (đỏ)
5. Click vào nút Share
6. **Expected:** Share modal mở ra

**Status:** [ ]

---

### 5. Lesson Card - Share Button (Mobile)
**Steps:**
1. Resize về mobile width
2. Vào trang `/dashboard/journal`
3. **Expected:** 3 nút (Share, Edit, Delete) **luôn hiển thị** (không cần hover)
4. Scroll qua các cards
5. **Expected:** Tất cả đều hiển thị nút

**Status:** [ ]

---

### 6. Lesson Detail Navigation
**Steps:**
1. Vào trang journal
2. Click vào một lesson card
3. **Expected:** Navigate tới `/dashboard/journal/[id]`
4. **Kiểm tra:** 
   - ❌ Không có nút "Quay lại" đơn lẻ ở đầu trang
   - ✅ Menu đầy đủ vẫn hiển thị ở header
5. Click vào "Goals" trong menu
6. **Expected:** Navigate tới `/dashboard/goals` (không bị stuck)

**Status:** [ ]

---

### 7. Active State Highlighting
**Steps:**
1. Vào `/dashboard/journal`
2. **Expected:** Menu item "Journal" có background purple
3. Hover vào "Journal"
4. **Expected:** Dropdown mở, item "Tất cả bài học" có màu khác
5. Click vào một lesson
6. **Expected:** URL = `/dashboard/journal/[id]`, menu "Journal" vẫn active

**Status:** [ ]

---

### 8. Create New Lesson Flow
**Steps:**
1. Click vào "Journal" → "Bài học mới"
2. **Expected:** Navigate tới `/dashboard/journal/new`
3. **Expected:** Auto redirect về `/dashboard`
4. **Expected:** Focus vào Quick Capture form

**Status:** [ ]

---

### 9. Keyboard Navigation (Accessibility)
**Steps:**
1. Press `Tab` để navigate qua menu items
2. **Expected:** Focus ring hiển thị rõ
3. Press `Enter` khi focus vào một menu item có dropdown
4. **Expected:** Dropdown mở (hoặc navigate nếu không có dropdown)

**Status:** [ ] (Future enhancement)

---

### 10. Multi-level Navigation
**Steps:**
1. Bắt đầu tại `/dashboard`
2. Click "Journal" → "Tất cả bài học"
3. Click vào một lesson
4. Click "Community" trong menu
5. Click "Goals" trong menu
6. **Expected:** Tất cả navigation đều smooth, không reload toàn trang

**Status:** [ ]

---

## 🐛 Bug Reports

### Found Issues:
1. [ ] None yet

---

## 📊 Performance Checks

### Dropdown Animation
- [ ] Smooth transition (no jank)
- [ ] No delay >100ms

### Share Button Hover
- [ ] Transition smooth
- [ ] No layout shift

### Mobile Menu
- [ ] Opens/closes smoothly
- [ ] No scroll issues

---

## 🌐 Browser Compatibility

Test trên:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari (nếu có)
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## ✍️ Notes

Ghi chú các vấn đề hoặc cải tiến:
- 
- 
- 

---

**Tester:**  
**Date:**  
**Environment:** Dev/Staging/Prod
