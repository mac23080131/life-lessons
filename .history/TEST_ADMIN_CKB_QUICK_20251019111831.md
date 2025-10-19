# ✅ Admin CKB - Quick Test Checklist

## 🎯 Kiểm tra nhanh 5 phút

### Bước 1: Khởi động services
```powershell
.\start-dev.ps1
```
⏳ Đợi ~30 giây cho services start

---

### Bước 2: Test Backend API ✅
```powershell
.\test-admin-ckb.ps1
```

**Expected:**
```
✅ 10 categories found
✅ 14 concepts found
✅ All endpoints working
```

---

### Bước 3: Đăng nhập Admin 🔐

1. Mở browser: http://localhost:3000
2. Login:
   - Email: `demo@lifelessons.app`
   - Password: `Passw0rd!`
3. ✅ Dashboard hiển thị

**⚠️ Nếu không có quyền Admin:**
```sql
-- Chạy trong database
UPDATE "User" SET role = 'ADMIN' WHERE email = 'demo@lifelessons.app';
```

---

### Bước 4: Truy cập Admin CKB 📊

**URL:** http://localhost:3000/dashboard/admin/concepts

**Checklist hiển thị:**
- [ ] Header "CKB Admin Dashboard"
- [ ] Button "+ New Concept" (góc trên phải)
- [ ] Stats cards (4 cards): Total Concepts, Categories, Views, Avg
- [ ] Categories section với grid cards
- [ ] Concepts table
- [ ] Search box
- [ ] Quick Actions (3 buttons)

**Expected numbers:**
- Total Concepts: **14**
- Categories: **10**
- Table: **14 rows**

---

### Bước 5: Test Create Concept ➕

1. Click "+ New Concept" hoặc "Add Concept"
2. ✅ Modal mở
3. Điền form:
   ```
   Key: test_concept
   Slug: test-concept
   Title (vi): Khái niệm Test
   Title (en): Test Concept
   Summary (vi): Đây là test
   Summary (en): This is a test
   Description (vi): Nội dung test
   Description (en): Test content
   Category: Chọn "Mindfulness"
   Difficulty: BEGINNER
   Tags: test, demo
   ```
4. Click "Save Concept"
5. ✅ Alert "Concept saved successfully!"
6. ✅ Table refresh, hiển thị 15 concepts

**Rollback (optional):**
- Click icon 🗑️ Delete
- Confirm
- ✅ Về lại 14 concepts

---

### Bước 6: Test Edit Concept ✏️

1. Tìm concept "Tỉnh thức hiện tại" trong table
2. Click icon ✏️ Edit
3. ✅ Modal mở với data đã điền sẵn
4. Sửa Summary (vi): "Cập nhật test"
5. Click "Save Concept"
6. ✅ Alert success
7. ✅ Table update

**Rollback:**
- Edit lại về nội dung cũ

---

### Bước 7: Test View Concept 👁️

1. Click icon 👁️ View ở bất kỳ concept nào
2. ✅ Navigate sang `/dashboard/concepts/[slug]`
3. ✅ Hiển thị full content
4. ✅ Practices section
5. ✅ Questions section
6. Back về Admin page

---

### Bước 8: Test Delete Concept 🗑️

1. Tạo concept test (như bước 5)
2. Click icon 🗑️ Delete
3. ✅ Confirm dialog hiển thị
4. Click "OK"
5. ✅ Alert "Concept deleted successfully!"
6. ✅ Concept biến mất khỏi table

---

### Bước 9: Test Create Category 📁

1. Scroll xuống "Categories" section
2. Click "Add Category"
3. ✅ Modal mở
4. Điền form:
   ```
   Key: test_category
   Name (vi): Danh mục Test
   Name (en): Test Category
   Description: Test description
   Icon: 🧪
   Color: #FF6B6B (hoặc chọn màu)
   Order: 99
   ```
5. Click "Save Category"
6. ✅ Alert success
7. ✅ Grid update với card mới

---

### Bước 10: Test Edit Category ✏️

1. Tìm category vừa tạo
2. Click icon ✏️ Edit
3. ✅ Modal mở với data
4. Sửa Name (vi): "Test Updated"
5. Click "Save Category"
6. ✅ Alert success
7. ✅ Card update

---

### Bước 11: Test Delete Category 🗑️

**Case 1: Category có concepts** (nên lỗi)
1. Thử delete "Mindfulness" (có 3 concepts)
2. Click 🗑️ Delete
3. ✅ Alert lỗi: "Cannot delete category with 3 concepts..."
4. ✅ Category không bị xóa

**Case 2: Category rỗng** (nên thành công)
1. Delete category test vừa tạo (không có concepts)
2. Click 🗑️ Delete
3. Confirm
4. ✅ Alert success
5. ✅ Card biến mất

---

### Bước 12: Test Search 🔍

1. Trong Search box, gõ: "stress"
2. ✅ Table filter, chỉ hiển thị "Quản lý căng thẳng"
3. Xóa search
4. ✅ Table hiển thị lại 14 concepts

---

### Bước 13: Test Dark Mode 🌙

1. Toggle dark mode (nếu có)
2. ✅ Background chuyển dark
3. ✅ Text chuyển light
4. ✅ Borders adjust
5. ✅ Modals dark

---

### Bước 14: Test Responsive 📱

1. Resize browser window
2. ✅ Desktop (>1280px): Full table
3. ✅ Tablet (768-1279px): Grid adjust
4. ✅ Mobile (<768px): Stack vertical

---

## 📊 Final Check

```powershell
# Test API lần cuối
.\test-admin-ckb.ps1
```

**Should see:**
```
✅ Categories: 10
✅ Concepts: 14
✅ Active: 7 categories with concepts
```

---

## ✅ Success Criteria

All checks passed:
- [x] Backend API working
- [x] Frontend page loads
- [x] Create concept works
- [x] Edit concept works
- [x] Delete concept works
- [x] View concept works
- [x] Create category works
- [x] Edit category works
- [x] Delete category validation works
- [x] Search works
- [x] Dark mode works
- [x] Responsive design works

---

## 🐛 Common Issues

### Issue: "No concepts found"
**Fix:** Check API connection
```powershell
curl http://localhost:3001/api/concepts/search
```

### Issue: "401 Unauthorized"
**Fix:** Login again, token expired

### Issue: "403 Forbidden"
**Fix:** Update user role to ADMIN
```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'demo@lifelessons.app';
```

### Issue: Modal không đóng
**Fix:** Click button X hoặc Cancel

---

## 🎉 All Done!

Nếu tất cả 14 bước pass → **Production Ready** ✅

**Time:** ~5 phút  
**Status:** 🎯 Hoàn thành
