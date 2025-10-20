# 🚨 FIX: Redis Connection Error

## Vấn đề
```
Error: connect ECONNREFUSED 127.0.0.1:16379
```

API đang cố kết nối Redis localhost thay vì Railway Redis.

## Nguyên nhân
- `REDIS_URL` không được set đúng
- Hoặc code đang dùng hardcoded localhost
- Hoặc REDIS_URL bị override

---

## ✅ FIX STEPS

### Step 1: Check REDIS_URL trong Railway

1. **Vào Railway Dashboard**
2. **Click service: @life-lessons/api**
3. **Tab "Variables"**
4. **Tìm `REDIS_URL`**

### Verify:
- [ ] `REDIS_URL` phải là **Reference** (không phải plain text)
- [ ] Reference tới **Redis service**
- [ ] Variable name chính xác: `REDIS_URL` (không phải `REDIS`)

### Nếu sai hoặc thiếu:

**Xóa** variable `REDIS_URL` cũ (nếu có)

**Tạo mới**:
1. Click "New Variable"
2. Variable name: `REDIS_URL`
3. **KHÔNG nhập text** - Click **"Add Reference"**
4. Chọn service: **Redis**
5. Chọn variable: **`REDIS_URL`**
6. Save

---

### Step 2: Check Code (Optional - Nếu Step 1 không fix)

Có thể code đang dùng fallback localhost. Kiểm tra:

**File: `apps/api/src/app.module.ts` hoặc Redis config**

Đảm bảo:
```typescript
// Good
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Make sure REDIS_URL is set in Railway
```

---

### Step 3: Redeploy

Sau khi update REDIS_URL:
1. Railway sẽ tự động redeploy
2. Hoặc manual: Tab "Deployments" → "Redeploy"
3. Đợi 1-2 phút

---

### Step 4: Verify Logs

Sau khi redeploy, check logs:
- **Không còn** `ECONNREFUSED 127.0.0.1:16379`
- **Thấy** `Connected to Redis` hoặc không có Redis error

---

## 🎯 Expected Result

Sau fix:
- ✅ Redis connect thành công
- ✅ Login/Signup hoạt động
- ✅ No more 500 errors

---

## Alternative: Disable Redis Temporarily (Not recommended)

Nếu muốn test nhanh without Redis:

### Option A: Comment Redis in code
File `apps/api/src/app.module.ts`:
```typescript
// Comment out Redis/Bull module imports
// BullModule.forRoot({ ... })
```

### Option B: Set REDIS_URL to empty
Railway Variables → `REDIS_URL` = `redis://localhost:6379`

**But this will break reminders/jobs features.**

---

**Recommended: Fix REDIS_URL reference properly!**

Làm Step 1 → Redeploy → Test lại! 🚀
