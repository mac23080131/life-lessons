# 🌐 Hướng Dẫn Share Bài Học Lên Community

## 📋 Tổng Quan

Đã cập nhật và đơn giản hóa:
1. ✅ **Menu phẳng** - Bỏ dropdown sub-menu
2. ✅ **Community Feed hoàn chỉnh** - Hiển thị bài học PUBLIC_ANON
3. ✅ **Share integration** - Tích hợp đầy đủ

---

## 🔄 Cách Share Bài Học Lên Community

### Bước 1: Mở ShareModal
Có 3 cách mở Share Modal:
1. **Từ Lesson Card:**
   - Hover vào card (desktop) hoặc luôn thấy (mobile)
   - Click nút **Share** (màu xanh dương)

2. **Từ Lesson Detail Page:**
   - Vào chi tiết bài học `/dashboard/journal/[id]`
   - Click nút **Chia sẻ** ở header

3. **Từ Dashboard:**
   - Quick capture form
   - Click share sau khi tạo lesson

### Bước 2: Chọn Tab "Cộng đồng"
ShareModal có 3 tabs:
- **Cộng đồng** (Globe icon) - Share công khai ẩn danh
- **Nhóm** (Users icon) - Share vào group riêng
- **Mạng xã hội** (Share icon) - Share ra Facebook/Twitter/LinkedIn

### Bước 3: Confirm Share
- Đọc cảnh báo: ⚠️ "Bài học sẽ được chia sẻ ẩn danh"
- Click **"Chia sẻ lên Cộng đồng"**
- Hệ thống sẽ:
  1. Update `visibility` từ `PRIVATE` → `PUBLIC_ANON`
  2. Toast notification: "Đã chia sẻ lên cộng đồng"
  3. Modal tự động đóng
  4. Invalidate cache để refresh data

### Bước 4: Xem trong Community Feed
- Navigate tới `/dashboard/community`
- Tab "Feed" sẽ hiển thị bài học vừa share
- Bài học hiển thị với:
  - Avatar ẩn danh (?)
  - "Người dùng ẩn danh"
  - Nội dung summary (nếu có) hoặc raw content
  - Domain badge
  - Tags và AI concepts
  - Nút "Thank you" và "Report"

---

## 🔧 Technical Flow

### Frontend (Share Action)
```typescript
// apps/web/src/lib/hooks/useShare.ts
useShareLesson('community')
  → POST /lessons/${lessonId}/share-to-community
  → Invalidate queries: ['community', 'feed'], ['lessons']
```

### Backend (API Endpoint)
```typescript
// apps/api/src/lessons/lessons.controller.ts
@Post(':id/share-to-community')
shareToCommunity(@Param('id') id: string, @Req() req)
  → Check ownership
  → Update visibility → PUBLIC_ANON
  → Return updated lesson
```

### Database Update
```sql
UPDATE "Lesson" 
SET visibility = 'PUBLIC_ANON'
WHERE id = ?
```

### Frontend (Community Feed)
```typescript
// apps/web/src/components/community/PublicFeed.tsx
usePublicFeed()
  → GET /community/feed
  → Filter: visibility = PUBLIC_ANON
  → OrderBy: createdAt DESC
  → Display in feed
```

---

## 🎨 UI States

### ShareModal - Community Tab
```
┌─────────────────────────────────────────┐
│ 🌐 Chia sẻ bài học                      │
├─────────────────────────────────────────┤
│ [Cộng đồng] [Nhóm] [Mạng xã hội]        │
├─────────────────────────────────────────┤
│ Chia sẻ bài học này lên cộng đồng       │
│ để mọi người có thể học hỏi.            │
│                                          │
│ ⚠️ Bài học sẽ được chia sẻ ẩn danh,    │
│    thông tin cá nhân sẽ được ẩn         │
│                                          │
│ [Chia sẻ lên Cộng đồng] ← Click này     │
└─────────────────────────────────────────┘
```

### Community Feed
```
┌──────────────────────────────────────────┐
│ ? Người dùng ẩn danh                     │
│   Chia sẻ 5 phút trước                   │
│                            [🧠 Nội tâm]  │
├──────────────────────────────────────────┤
│ Hôm nay mình học được...                 │
│                                          │
│ #growth #mindfulness                     │
├──────────────────────────────────────────┤
│ [❤️ Thank you (3)] [🚩 Report]          │
└──────────────────────────────────────────┘
```

---

## 🧪 Testing Steps

### Test 1: Share và Verify
1. Vào `/dashboard/journal`
2. Tạo hoặc chọn một lesson
3. Click Share button
4. Tab "Cộng đồng" → Click "Chia sẻ"
5. ✅ Toast: "Đã chia sẻ lên cộng đồng"
6. Navigate tới `/dashboard/community`
7. ✅ Lesson xuất hiện trong feed

### Test 2: Anonymous Display
1. Check trong community feed
2. ✅ Avatar = "?"
3. ✅ Name = "Người dùng ẩn danh"
4. ✅ Content hiển thị (summary hoặc raw)
5. ✅ Domain badge + tags hiển thị

### Test 3: React & Report
1. Trong community feed
2. Click "Thank you" button
3. ✅ Button turns pink, count increases
4. Click again → ✅ Toggle off
5. Click "Report" → ✅ Confirmation toast

---

## 🔐 Privacy & Security

### Dữ liệu được hiển thị:
- ✅ Content (raw hoặc summary)
- ✅ Domain
- ✅ Tags
- ✅ AI Concepts
- ✅ Mood (emoji)
- ✅ Resonance score
- ✅ Created date

### Dữ liệu được ẨN:
- ❌ User ID (không hiển thị)
- ❌ User Name
- ❌ User Email
- ❌ User Avatar
- ❌ Gratitude notes (nếu có thông tin cá nhân)
- ❌ Attachments

### Backend Filter:
```typescript
// apps/api/src/community/community.service.ts
select: {
  id: true,
  contentRaw: true,
  contentSummary: true,
  domain: true,
  tags: true,
  mood: true,
  resonance: true,
  aiConcepts: true,
  createdAt: true,
  reactions: { ... },
  // userId: NOT included
  // user: NOT included
}
```

---

## 🚨 Troubleshooting

### Vấn đề: Không thấy lesson trong Community Feed

**Nguyên nhân có thể:**
1. ❌ Lesson chưa được share (visibility ≠ PUBLIC_ANON)
2. ❌ Backend chưa update database
3. ❌ Cache chưa được invalidate
4. ❌ API endpoint bị lỗi

**Giải pháp:**
1. ✅ Check database: `SELECT visibility FROM "Lesson" WHERE id = ?`
2. ✅ Check console network tab: POST `/lessons/${id}/share-to-community` → 200
3. ✅ Hard refresh page: `Ctrl+Shift+R`
4. ✅ Check backend logs

### Vấn đề: Share button không hoạt động

**Check:**
1. ✅ ShareModal có import đúng không?
2. ✅ useShareLesson hook có errors không?
3. ✅ Auth token còn valid không?
4. ✅ Backend API endpoint có chạy không?

**Test API manually:**
```bash
curl -X POST http://localhost:3001/api/lessons/LESSON_ID/share-to-community \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📊 Database Schema

### Lesson Table
```prisma
model Lesson {
  id           String   @id @default(uuid())
  userId       String
  contentRaw   String
  visibility   Privacy  @default(PRIVATE)  ← Đây là field quan trọng
  // ...
}

enum Privacy {
  PRIVATE        ← Default
  GROUP          ← Share với group
  LINK           ← Share via link
  PUBLIC_ANON    ← Share lên Community Feed ⭐
}
```

---

## 📝 API Documentation

### POST /lessons/:id/share-to-community
**Auth:** Required (JWT Bearer)

**Request:**
```
POST /api/lessons/abc123/share-to-community
Authorization: Bearer eyJhbGc...
```

**Response (200):**
```json
{
  "success": true,
  "message": "Lesson shared to community feed",
  "lesson": {
    "id": "abc123",
    "visibility": "PUBLIC_ANON",
    "updatedAt": "2025-10-18T..."
  }
}
```

**Errors:**
- `403 Forbidden` - Không phải owner của lesson
- `404 Not Found` - Lesson không tồn tại
- `401 Unauthorized` - Token không hợp lệ

---

### GET /community/feed
**Auth:** Optional (public endpoint, nhưng reactions cần auth)

**Query Params:**
- `limit` (number, default: 20)
- `offset` (number, default: 0)

**Response:**
```json
{
  "lessons": [
    {
      "id": "...",
      "contentRaw": "...",
      "contentSummary": "...",
      "domain": "INNER",
      "tags": ["growth"],
      "mood": 1,
      "resonance": 2,
      "aiConcepts": ["mindfulness"],
      "createdAt": "2025-10-18T...",
      "reactions": [
        { "id": "...", "type": "thank_you", "userId": "..." }
      ]
    }
  ],
  "total": 42
}
```

---

## 🎯 Next Steps

### Enhancements:
1. **Content Moderation** - Auto-detect và blur nội dung nhạy cảm
2. **Report System** - Store reports trong database
3. **Trending Algorithm** - Sort by reactions + recency
4. **User Karma** - Track contributions
5. **Comment System** - Thêm comment vào PUBLIC_ANON lessons
6. **Notification** - Notify khi có reactions
7. **Analytics** - Track engagement metrics

---

**Updated:** October 18, 2025  
**Version:** 1.1.0  
**Status:** ✅ Fully Functional
