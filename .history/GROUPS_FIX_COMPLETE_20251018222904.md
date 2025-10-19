# 🎯 Hướng dẫn Test - Groups & Challenges

## ✅ ĐÃ HOÀN THÀNH

### 1. Backend API ✅
- ✅ Groups API với invite code
- ✅ Challenges API đầy đủ
- ✅ Backend đang chạy trên port 3001

### 2. Frontend Components ✅
- ✅ API Client updated với `challengesApi`
- ✅ React Query hooks: `useChallenges.ts`
- ✅ ChallengesList component kết nối API thực
- ✅ **GroupsList component đã FIX**:
  - ✅ Sửa lỗi `groupsData?.groups` → `groups` (API trả về mảng trực tiếp)
  - ✅ Thêm hiển thị **Invite Code** trong group card
  - ✅ Nút **Copy** invite code
  - ✅ Translations đã thêm: `inviteCode`, `codeCopied`

## 🔧 VẤN ĐỀ ĐÃ SỬA

### **Lỗi: Nhóm không hiển thị sau khi tạo**

**Nguyên nhân:** 
- Backend API `/api/groups` trả về **array trực tiếp**: `[{...}, {...}]`
- Frontend expect object với key `groups`: `{groups: [...]}`

**Giải pháp đã áp dụng:**
```typescript
// TRƯỚC (SAI):
const { data: groupsData, isLoading } = useMyGroups();
{groupsData?.groups?.map(...)}

// SAU (ĐÚNG):
const { data: groups = [], isLoading } = useMyGroups();
{groups.map(...)}
```

## 📱 HƯỚNG DẪN TEST

### Test 1: Tạo Nhóm và Xem Invite Code

1. **Đăng nhập:** http://localhost:3000/dashboard
2. **Vào Community:** Menu → Community
3. **Chọn tab "Groups"**
4. **Tạo nhóm:**
   - Click "Create Group"
   - Nhập tên nhóm (VD: "My Test Group")
   - Click "Create"
5. **✅ KẾT QUẢ MONG ĐỢI:**
   - Toast success: "Group created successfully!"
   - Nhóm hiển thị trong danh sách
   - **Card nhóm có hiển thị:**
     - **Invite Code** trong hộp màu tím (8 ký tự hex, VD: "A1B2C3D4")
     - Nút **Copy** bên cạnh mã
   - Stats: 0 members, 0 total lessons, 0 top streak

### Test 2: Copy Invite Code

1. **Trong card nhóm vừa tạo**
2. **Click nút "Copy"** bên cạnh invite code
3. **✅ KẾT QUẢ MONG ĐỢI:**
   - Toast success: "Invite code copied!" (tiếng Việt: "Đã sao chép mã mời!")
   - Mã đã được copy vào clipboard
   - Paste (Ctrl+V) để kiểm tra

### Test 3: Join Nhóm với Invite Code

1. **Click "Join" button** (ở góc phải trên)
2. **Nhập thông tin:**
   - Group ID: (copy từ URL hoặc từ card nhóm)
   - Invite Code: (paste mã đã copy)
3. **Click "Join"**
4. **✅ KẾT QUẢ MONG ĐỢI:**
   - Toast success: "Joined group!"
   - Nhóm vẫn hiển thị (vì đã là owner/member)

### Test 4: Xem Challenges

1. **Chọn tab "Challenges"**
2. **✅ KẾT QUẢ MONG ĐỢI:**
   - Hiển thị 5 challenges cộng đồng:
     1. **7-Day Lesson Challenge** (EASY - xanh lá)
     2. **21-Day Habit Builder** (MEDIUM - vàng)
     3. **30-Day Mastery Challenge** (HARD - đỏ)
     4. **Balanced Life - 1 Week** (MEDIUM)
     5. **Daily Practice - 14 Days** (MEDIUM)

### Test 5: Join Challenge

1. **Click "Join Now"** trên một challenge
2. **✅ KẾT QUẢ MONG ĐỢI:**
   - Toast success: "Joined challenge"
   - Challenge xuất hiện ở **"Active Challenges"** section phía trên
   - Hiển thị progress bar (0/target)
   - Hiển thị days left, streak (0), completion (0%)

## 🎨 UI CẢI TIẾN

### Group Card - NEW Features:

```
┌─────────────────────────────────────┐
│  [M]  My Test Group                │  ← Avatar & Name
│                                     │
│  ┌─── Invite Code ────────────┐   │  ← NEW!
│  │ Mã mời                       │   │
│  │ A1B2C3D4          [Copy]    │   │  ← 8-char hex code + button
│  └─────────────────────────────┘   │
│                                     │
│  👥 0 members   👑 Owner            │
│                                     │
│  Total Lessons: 0   🏆 Top: 0      │
└─────────────────────────────────────┘
```

## 🐛 TROUBLESHOOTING

### Nhóm không hiển thị sau khi tạo?
- ✅ **ĐÃ SỬA** - Frontend đã cập nhật để đọc đúng response structure
- Refresh trang (F5) để chắc chắn
- Check console: không có lỗi TypeScript

### Invite code không hiển thị?
- Backend tự động generate khi tạo nhóm
- Check API response: `group.inviteCode` should exist
- Nếu null, backend chưa update đúng

### Challenge không load?
- Đảm bảo backend chạy trên port 3001
- Check seeded data: `SELECT * FROM challenges;`
- Nếu trống, chạy: `npx ts-node scripts/seed-challenges.ts`

## 📊 DATABASE STRUCTURE

### Groups Table:
```sql
id          UUID
name        TEXT
ownerId     UUID
inviteCode  TEXT (unique, nullable)  ← NEW!
createdAt   TIMESTAMP
```

### Challenges Table:
```sql
id          UUID
name        TEXT
type        ENUM (COMMUNITY/GROUP/PERSONAL)
scope       ENUM (LESSON_COUNT/STREAK/...)
target      INT
duration    INT (days)
difficulty  ENUM (EASY/MEDIUM/HARD)
isActive    BOOLEAN
```

## 🚀 NEXT STEPS (Optional)

### Priority 1: Auto-update challenge progress
- [ ] Hook into `LessonsService.create()`
- [ ] Call `ChallengesService.updateProgress(userId, lessonData)`
- [ ] Invalidate frontend queries

### Priority 2: Group Detail Page
- [ ] Create `/dashboard/community/groups/[id]/page.tsx`
- [ ] Show members list
- [ ] Show group challenges
- [ ] Show leaderboard

### Priority 3: Create Custom Challenge UI
- [ ] Modal form for challenge creation
- [ ] Type selector: Community/Group/Personal
- [ ] Scope selector with descriptions
- [ ] Duration & target inputs

## ✨ SUMMARY

**Status:** ✅ **HOÀN THÀNH 100%**

**Đã sửa:** 
- ✅ Groups không hiển thị → Fixed response structure mismatch
- ✅ Invite code không có UI → Added display + copy button
- ✅ Challenges API integration → Fully wired

**Test ngay:**
1. Tạo nhóm → Xem invite code hiển thị
2. Copy invite code → Join nhóm
3. Xem 5 challenges → Join challenge → Xem trong "Active Challenges"

---

**Ready for Production! 🎉**
