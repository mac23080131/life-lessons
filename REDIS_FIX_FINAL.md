# 🔧 Redis Connection Fix - Commit `910ea0f`

## 📝 Tóm tắt vấn đề & Giải pháp:

### ❌ Vấn đề:
Code cũ không parse đúng `REDIS_URL` từ Railway → fallback về `localhost:6379` → ECONNREFUSED

### ✅ Giải pháp (theo hướng dẫn Railway):
Sử dụng **biến môi trường `REDIS_URL`** do Railway cung cấp thay vì hardcode localhost.

---

## 🔄 Thay đổi code (Commit `910ea0f`):

### File: `apps/api/src/reminder-jobs/reminder-jobs.module.ts`

**❌ Trước:**
```typescript
connection: {
  host: configService.get('REDIS_HOST', 'localhost'),  // ← Sai!
  port: configService.get('REDIS_PORT', 16379),
}
```

**✅ Sau:**
```typescript
const redisUrl = configService.get('REDIS_URL');

// Nếu có REDIS_URL (Railway/production)
if (redisUrl) {
  console.log('[BullMQ] Using REDIS_URL from environment');
  return {
    connection: {
      url: redisUrl,  // ← Đúng! BullMQ/ioredis dùng property 'url'
    },
  };
}

// Fallback cho local development
console.log('[BullMQ] Using REDIS_HOST/PORT (fallback to localhost)');
return {
  connection: {
    host: configService.get('REDIS_HOST', 'localhost'),
    port: parseInt(configService.get('REDIS_PORT', '6379'), 10),
  },
};
```

---

## 🎯 Cải tiến mới (so với commit `c401ce8`):

1. ✅ **Explicit `url` property**: BullMQ/ioredis yêu cầu `{ url: '...' }` không phải trực tiếp string
2. ✅ **Debug logs**: Console.log để verify connection string được dùng khi deploy
3. ✅ **Port parsing**: `parseInt()` để đảm bảo port là number
4. ✅ **Tuân theo doc Railway**: Dùng `process.env.REDIS_URL` như hướng dẫn

---

## 🔍 Verify khi Railway deploy xong:

### Step 1: Kiểm tra Build Logs (3-4 phút)
Railway Dashboard → `life-lessonsapi` → Deployments → Commit `910ea0f` → View Logs

**Tìm dòng này:**
```
[BullMQ] Using REDIS_URL from environment  ← PHẢI THẤY dòng này!
```

**KHÔNG được thấy:**
```
[BullMQ] Using REDIS_HOST/PORT (fallback to localhost)  ← Nếu thấy = lỗi!
```

### Step 2: Kiểm tra Runtime Logs
Sau khi app start, logs sẽ hiển thị:

**✅ Thành công:**
```
[BullMQ] Using REDIS_URL from environment
🚀 Life Lessons API running on: http://0.0.0.0:3001
🕐 Checking reminders...
```

**❌ KHÔNG còn thấy:**
```
Error: connect ECONNREFUSED 127.0.0.1:16379
Error: connect ECONNREFUSED 127.0.0.1:6379
```

### Step 3: Test Redis Connection
Khi app chạy, Redis queue sẽ hoạt động:
- Không có lỗi ECONNREFUSED
- Reminder cron job chạy mỗi 5 phút
- BullMQ dashboard (nếu có) hiển thị jobs

---

## 🚨 Troubleshooting:

### Nếu vẫn thấy "Using REDIS_HOST/PORT (fallback to localhost)":

**Nguyên nhân:** Biến `REDIS_URL` không được inject vào container.

**Giải pháp:**

1. **Verify Railway Variables:**
   - Railway Dashboard → `life-lessonsapi` → Variables
   - `REDIS_URL` **PHẢI** có icon 🔗 (Reference)
   - Click vào → phải thấy: `Redis.REDIS_URL`

2. **Nếu không có Reference:**
   - Delete biến `REDIS_URL` cũ (nếu là plain text)
   - Click **+ New Variable** → **Add Reference**
   - Select: `Redis` service → variable `REDIS_URL`
   - Save → Railway sẽ redeploy tự động

### Nếu vẫn có lỗi ECONNREFUSED sau khi fix:

**Kiểm tra Redis service status:**
1. Railway Dashboard → Redis service
2. Status phải là: **Active** (green)
3. Nếu **Sleeping** hoặc **Error** → Restart service

**Kiểm tra network:**
- API service và Redis service phải trong **cùng Railway project**
- Railway tự động tạo internal network giữa các services

---

## 📊 Expected Timeline:

- **T+0 (Now)**: Commit `910ea0f` pushed ✅
- **T+2 min**: Railway detect commit → start build
- **T+4 min**: Build complete → deploying
- **T+5 min**: Deploy active
- **T+6 min**: Check logs → **"Using REDIS_URL from environment"** ✅
- **T+7 min**: No ECONNREFUSED errors ✅

---

## ✅ Success Criteria:

- [ ] Deploy logs show: `[BullMQ] Using REDIS_URL from environment`
- [ ] App starts successfully without Redis connection errors
- [ ] No `ECONNREFUSED 127.0.0.1:*` errors in logs
- [ ] Reminder cron job runs every 5 minutes
- [ ] API health endpoint returns 200

---

## 🔗 Reference:

**Railway Redis Documentation:**
- Biến tự động: `REDIS_URL`, `REDIS_PRIVATE_URL`
- Format: `redis://default:<password>@<host>:<port>`
- Internal network: `*.railway.internal`

**BullMQ/ioredis Connection Options:**
```typescript
// Option 1: Connection string (recommended)
{ connection: { url: 'redis://...' } }

// Option 2: Separate config
{ connection: { host: '...', port: 6379, password: '...' } }
```

---

## 📞 Next Steps:

1. **Đợi 5 phút** cho Railway rebuild
2. **Check logs** theo Step 1-2 ở trên
3. **Nếu thấy debug log đúng** + không có lỗi → ✅ **XONG!**
4. **Nếu vẫn lỗi** → Verify Railway Variables (bước troubleshooting)

---

**Commit:** `910ea0f`  
**Files Changed:** `apps/api/src/reminder-jobs/reminder-jobs.module.ts`  
**ETA:** 5-7 minutes

Bạn hãy đợi Railway rebuild xong rồi check logs nhé! Lần này chắc chắn sẽ fix được! 🚀
