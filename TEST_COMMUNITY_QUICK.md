# ✅ Quick Test - Community Share Feature

## Test Ngay (5 phút)

### ✨ Test 1: Share Lesson
```
1. Mở browser: http://localhost:3000
2. Login vào app
3. Vào /dashboard/journal
4. Hover vào một lesson card
5. Click nút Share (màu xanh) 🔵
6. Tab "Cộng đồng" → Click "Chia sẻ lên Cộng đồng"
7. ✅ Thấy toast: "Đã chia sẻ lên cộng đồng"
```

### 🌐 Test 2: View in Community
```
1. Click menu "Cộng đồng" (Community)
2. Tab "Feed" sẽ active
3. ✅ Thấy lesson vừa share xuất hiện
4. ✅ Avatar = "?"
5. ✅ Name = "Người dùng ẩn danh"
```

### ❤️ Test 3: React
```
1. Trong community feed
2. Click nút "Thank you" ❤️
3. ✅ Button chuyển màu hồng
4. ✅ Count tăng lên
5. Click lại → ✅ Toggle off
```

---

## 🐛 Nếu Không Thấy Lesson

### Check Backend
```powershell
# Test API endpoint
Invoke-WebRequest http://localhost:3001/api/community/feed -UseBasicParsing | ConvertFrom-Json
```

**Expect:** Trả về list lessons với `visibility: "PUBLIC_ANON"`

### Check Database
```sql
-- Nếu có prisma studio
pnpm prisma studio

-- Check trong table Lesson:
-- visibility column = PUBLIC_ANON
```

### Force Refresh
```
1. Ctrl + Shift + R (hard refresh)
2. Open DevTools → Network tab
3. Click "Community" lại
4. Check: GET /api/community/feed → Status 200
```

---

## 📸 Screenshot Checklist

Khi test, check các điểm sau:

### ShareModal
- [ ] 3 tabs hiển thị: Cộng đồng, Nhóm, Mạng xã hội
- [ ] Tab "Cộng đồng" có Globe icon
- [ ] Có warning màu vàng: ⚠️ "ẩn danh"
- [ ] Button "Chia sẻ lên Cộng đồng" màu gradient purple-pink

### Community Feed
- [ ] Menu "Cộng đồng" có trong header
- [ ] Feed hiển thị lessons
- [ ] Mỗi card có:
  - [ ] Avatar "?" trong vòng tròn gradient
  - [ ] "Người dùng ẩn danh"
  - [ ] Time "X phút trước"
  - [ ] Domain badge (🧠/💪/❤️/💰)
  - [ ] Content
  - [ ] Tags (#...)
  - [ ] Buttons: ❤️ Thank you, 🚩 Report

---

## 🎬 Demo Flow

### Scenario: Share một insight học được hôm nay

1. **Tạo lesson mới:**
   ```
   Dashboard → Quick Capture:
   "Hôm nay mình học được rằng việc viết nhật ký 
   giúp tư duy rõ ràng hơn rất nhiều."
   
   Domain: INNER
   Mood: 😊 (+1)
   Resonance: 2
   Tags: growth, reflection
   
   → Save
   ```

2. **Share lên Community:**
   ```
   Card vừa tạo → Hover → Share button
   Modal mở → Tab "Cộng đồng"
   Click "Chia sẻ lên Cộng đồng"
   ✅ Toast success
   ```

3. **Xem trong Community:**
   ```
   Menu → Cộng đồng
   ✅ Lesson xuất hiện đầu danh sách
   ✅ Hiển thị ẩn danh
   ```

4. **Tương tác:**
   ```
   Logout và Login bằng user khác
   Vào Community → Click "Thank you"
   ✅ Reaction được ghi nhận
   ```

---

## 🔍 Debug Commands

### Backend logs
```powershell
# Nếu chạy trong terminal riêng, check logs
# Tìm dòng:
# POST /api/lessons/xxx/share-to-community 200
# GET /api/community/feed 200
```

### Frontend console
```javascript
// Open DevTools console
localStorage.getItem('auth_token')  // Check có token không?

// Network tab:
// Filter: "community"
// Check request/response
```

### Database query
```sql
-- Check lessons đã shared
SELECT id, contentRaw, visibility, createdAt 
FROM "Lesson" 
WHERE visibility = 'PUBLIC_ANON'
ORDER BY createdAt DESC
LIMIT 10;
```

---

## ✅ Success Criteria

Tất cả phải PASS:
- [x] Menu hiển thị "Cộng đồng"
- [x] Share button hoạt động
- [x] ShareModal tab "Cộng đồng" hoạt động
- [x] Share thành công → Toast hiển thị
- [x] Community feed hiển thị lesson
- [x] Lesson hiển thị ẩn danh (?)
- [x] Thank you button hoạt động (toggle)
- [x] Visibility trong DB = PUBLIC_ANON

---

**Test by:** [Your Name]  
**Date:** October 18, 2025  
**Status:** ⬜ Not tested | ✅ Passed | ❌ Failed
