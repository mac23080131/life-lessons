# 🔍 DEBUG: Community Feed Không Hiển Thị

## ❗ VẤN ĐỀ
**Community Feed không hiển thị bất kỳ bài học nào dù backend log cho thấy có 11 lessons PUBLIC_ANON**

## ✅ ĐÃ KIỂM TRA

### 1. Backend API ✅
- ✅ CommunityService.getPublicFeed() đang chạy
- ✅ Log show: **11 lessons PUBLIC_ANON** trong database
- ✅ API endpoint `/api/community/feed` được map đúng
- ✅ Response structure: `{ lessons: [...], total: 11 }`

### 2. Frontend Hooks ✅
- ✅ `usePublicFeed()` hook đúng cấu trúc
- ✅ Query key: `['community', 'feed', params]`
- ✅ API call: `communityApi.getPublicFeed(params)`

### 3. Frontend Component ✅
- ✅ `PublicFeed.tsx` kiểm tra `feedData?.lessons`
- ✅ Empty state được xử lý
- ✅ Loading state có spinner

## 🔍 NGUYÊN NHÂN CÓ THỂ

### 1. API Client Response Structure Mismatch
**Nghi ngờ:** API trả về `{ lessons: [...], total: 11 }` nhưng component expect structure khác

**Kiểm tra:**
```typescript
// apps/web/src/lib/api-client.ts
export const communityApi = {
  getPublicFeed: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get('/community/feed', { params });
    return response.data; // ← Check này có đúng không?
  },
}
```

**Expected response:**
```json
{
  "lessons": [...],
  "total": 11
}
```

**Component expects:**
```typescript
feedData?.lessons // Should be array
```

### 2. Không Có Lessons PUBLIC_ANON
**Nghi ngờ:** Dù backend log 11, nhưng thực tế database có thể trống

**Kiểm tra database:**
```sql
SELECT id, contentRaw, visibility, "userId", "createdAt" 
FROM "Lesson" 
WHERE visibility = 'PUBLIC_ANON' 
ORDER BY "createdAt" DESC 
LIMIT 5;
```

**Hoặc dùng Prisma Studio:**
- Mở: http://localhost:5555
- Table: `Lesson`
- Filter: `visibility = PUBLIC_ANON`
- Count: Phải có ít nhất vài records

### 3. Share API Không Update Visibility
**Nghi ngờ:** Khi user click "Share to Community", visibility không được update thành PUBLIC_ANON

**Kiểm tra:**
```typescript
// apps/api/src/lessons/lessons.service.ts
async shareToComm unity(lessonId: string, userId: string) {
  // Phải update visibility = 'PUBLIC_ANON'
  const lesson = await this.prisma.lesson.update({
    where: { id: lessonId },
    data: { visibility: 'PUBLIC_ANON' }, // ← Check này
  });
  return lesson;
}
```

### 4. Frontend CORS / Network Error
**Nghi ngờ:** Request bị block hoặc error không được log

**Kiểm tra browser console:**
- F12 → Network tab
- Filter: `feed`
- Check status: 200 OK?
- Check response: Có data không?

### 5. React Query Cache Issue
**Nghi ngờ:** Query bị cache với empty data

**Fix:**
```typescript
// In browser console:
queryClient.invalidateQueries({ queryKey: ['community', 'feed'] });
// Hoặc hard refresh: Ctrl+Shift+R
```

## 📋 CHECKLIST DEBUG

### Step 1: Verify Database
- [ ] Mở Prisma Studio: http://localhost:5555
- [ ] Check table `Lesson`
- [ ] Filter: `visibility = PUBLIC_ANON`
- [ ] Confirm: Có ít nhất 5-10 lessons
- [ ] Note: Nếu **TRỐNG** → **VẤN ĐỀ 1: Không có data**

### Step 2: Test API Directly
- [ ] Backend running: http://localhost:3001
- [ ] Test:
  ```powershell
  Invoke-RestMethod http://localhost:3001/api/community/feed
  ```
- [ ] Check response structure:
  ```json
  {
    "lessons": [...], // Phải có array
    "total": 11
  }
  ```
- [ ] Nếu lessons = [] → **VẤN ĐỀ 2: Backend query sai**
- [ ] Nếu error → **VẤN ĐỀ 3: Backend crash**

### Step 3: Check Frontend Network
- [ ] Open: http://localhost:3000/dashboard/community
- [ ] F12 → Network tab
- [ ] Look for: `feed` request
- [ ] Check status: **200 OK**?
- [ ] Check response JSON có lessons không?
- [ ] Nếu **404/500** → **VẤN ĐỀ 4: API endpoint sai**
- [ ] Nếu **CORS error** → **VẤN ĐỀ 5: CORS config**

### Step 4: Check Frontend Console
- [ ] F12 → Console tab
- [ ] Look for React Query errors
- [ ] Look for "feedData" log (add console.log nếu cần)
- [ ] Check: `feedData` có phải `undefined` không?
- [ ] Check: `feedData.lessons` có phải array không?

### Step 5: Verify Share Function
- [ ] Create một lesson mới
- [ ] Click "Share" button
- [ ] Select "Community"
- [ ] Check: Toast success?
- [ ] Refresh community feed
- [ ] Lesson có hiện không?
- [ ] Nếu **KHÔNG** → **VẤN ĐỀ 6: Share API không update visibility**

## 🛠️ FIX THEO TỪNG CASE

### Case 1: Database trống (Không có PUBLIC_ANON)
**Nguyên nhân:** Seed data chưa chạy hoặc share không work

**Fix:**
```typescript
// 1. Tạo script seed lessons public
// scripts/seed-public-lessons.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst();
  
  if (!user) {
    console.error('No user found');
    return;
  }

  const lessons = [
    {
      contentRaw: 'Hôm nay mình học được cách kiên nhẫn trong công việc',
      domain: 'INNER',
      visibility: 'PUBLIC_ANON',
      userId: user.id,
    },
    {
      contentRaw: 'Tập thể dục đều đặn giúp tinh thần thoải mái hơn',
      domain: 'HEALTH',
      visibility: 'PUBLIC_ANON',
      userId: user.id,
    },
    // ... thêm 8-10 lessons nữa
  ];

  for (const lesson of lessons) {
    await prisma.lesson.create({ data: lesson });
  }

  console.log(`✅ Created ${lessons.length} public lessons`);
}

main();
```

**Run:**
```powershell
npx ts-node scripts/seed-public-lessons.ts
```

### Case 2: API Response Structure Sai
**Nguyên nhân:** Backend trả về structure khác với expected

**Check:**
```typescript
// apps/api/src/community/community.controller.ts
@Get('feed')
async getPublicFeed(@Query('limit') limit?: number, @Query('offset') offset?: number) {
  const result = await this.communityService.getPublicFeed(limit, offset);
  console.log('📤 API Response:', JSON.stringify(result).substring(0, 200));
  return result; // ← Phải return { lessons: [...], total: X }
}
```

### Case 3: Share API Không Update
**Fix:**
```typescript
// apps/api/src/lessons/lessons.controller.ts
@Post(':id/share-to-community')
async shareToCommun ity(@Param('id') id: string, @Req() req) {
  console.log(`🔄 Sharing lesson ${id} to community`);
  
  const lesson = await this.prisma.lesson.update({
    where: { id },
    data: { visibility: 'PUBLIC_ANON' }, // ← Crucial
  });
  
  console.log(`✅ Updated lesson visibility to ${lesson.visibility}`);
  return lesson;
}
```

### Case 4: Frontend API Client Issue
**Fix:**
```typescript
// apps/web/src/lib/api-client.ts
export const communityApi = {
  getPublicFeed: async (params?: { limit?: number; offset?: number }) => {
    console.log('📡 Calling /community/feed with:', params);
    const response = await apiClient.get('/community/feed', { params });
    console.log('📥 Response:', response.data);
    return response.data; // { lessons: [...], total: X }
  },
}
```

### Case 5: Component Not Reading Data Correctly
**Fix:**
```typescript
// apps/web/src/components/community/PublicFeed.tsx
export function PublicFeed() {
  const { data: feedData, isLoading, error } = usePublicFeed({ limit: 20 });

  // DEBUG LOG
  console.log('🎨 PublicFeed render:', { feedData, isLoading, error });

  if (error) {
    console.error('❌ Feed error:', error);
    return <div>Error loading feed</div>;
  }

  // Check structure
  const lessons = feedData?.lessons || [];
  console.log(`📚 Rendering ${lessons.length} lessons`);

  if (lessons.length === 0) {
    return <div>No public lessons</div>;
  }

  return (
    <div>
      {lessons.map((lesson: any) => (
        <div key={lesson.id}>{lesson.contentRaw}</div>
      ))}
    </div>
  );
}
```

## 🎯 ACTION PLAN

1. **Start backend + frontend**
   ```powershell
   # Terminal 1:
   cd apps/api && pnpm dev
   
   # Terminal 2:
   cd apps/web && pnpm dev
   ```

2. **Check database**
   ```powershell
   npx prisma studio --port 5555
   # → http://localhost:5555
   # → Table: Lesson
   # → Count PUBLIC_ANON
   ```

3. **Test API**
   ```powershell
   Invoke-RestMethod http://localhost:3001/api/community/feed | ConvertTo-Json
   ```

4. **Check Frontend**
   - Open: http://localhost:3000/dashboard/community
   - F12 → Network → Filter: feed
   - F12 → Console → Look for logs

5. **If still empty:**
   - Add console.log in component
   - Add console.log in API client
   - Check React Query devtools

## 📊 EXPECTED FLOW

```
User → PublicFeed Component
  → usePublicFeed() hook
    → React Query fetch
      → communityApi.getPublicFeed()
        → axios.get('/api/community/feed')
          → Backend CommunityController.getPublicFeed()
            → CommunityService.getPublicFeed()
              → Prisma.lesson.findMany({ where: { visibility: 'PUBLIC_ANON' } })
                → Database query
                  → Return 11 lessons
              ← { lessons: [...], total: 11 }
            ← { lessons: [...], total: 11 }
          ← HTTP 200 { lessons: [...], total: 11 }
        ← response.data
      ← feedData = { lessons: [...], total: 11 }
    ← React Query cache
  ← feedData.lessons (array of 11 items)
→ Render 11 cards
```

---

**NEXT STEP: Kiểm tra từng bước theo checklist trên để tìm điểm break!**
