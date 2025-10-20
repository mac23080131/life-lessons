# 🚀 Railway Deployment - Final Fix Guide

## 📋 Commit: `951d0cf` - Force Railway Use Dockerfile CMD

### 🔍 Vấn đề đã xác định:

1. ❌ **Migrations không chạy**: Railway phát hiện `pnpm start` trong package.json → bỏ qua Dockerfile CMD
2. ❌ **Database trống**: Không có tables vì migrations không execute
3. ❌ **Redis localhost**: Biến `REDIS_URL` chưa được set đúng

---

## ✅ Giải pháp đã áp dụng:

### 1. Tạo `apps/api/railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "apps/api/Dockerfile"
  },
  "deploy": {
    "startCommand": null,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

**Tác dụng:**
- Force Railway dùng Dockerfile builder (không phải Nixpacks)
- Set `startCommand: null` → dùng CMD trong Dockerfile
- Config restart policy khi có lỗi

### 2. Cập nhật Dockerfile comment
Thêm comment rõ ràng về cách Railway sẽ sử dụng CMD.

---

## 📝 Các bước tiếp theo (BẮT BUỘC):

### Step 1: Đợi Railway Rebuild (2-3 phút)
1. Mở **Railway Dashboard** → Project `life-lessonsapi`
2. Vào tab **Deployments**
3. Xem deployment mới (commit `951d0cf`) đang build
4. **QUAN TRỌNG**: Đợi cho đến khi status = **ACTIVE**

### Step 2: Kiểm tra Deploy Logs
Sau khi deployment ACTIVE, click vào → **View Logs** → tìm:

**✅ Dấu hiệu thành công:**
```
Prisma schema loaded from /app/prisma/schema.prisma
Datasource "db": PostgreSQL database "railway"

4 migrations found in prisma/migrations
Applying migration `20251017044345_init`
Applying migration `20251018130920_add_group_lessons`
Applying migration `20251018150549_add_groups_challenges`
Applying migration `20251018161808_add_ckb_models`

The following migrations have been applied:
migrations/
  └─ 20251017044345_init/
  └─ 20251018130920_add_group_lessons/
  └─ 20251018150549_add_groups_challenges/
  └─ 20251018161808_add_ckb_models/

✅ Database migrations have been applied successfully.
🚀 Life Lessons API running on: http://0.0.0.0:3001
```

**❌ Nếu vẫn thấy:**
```
No migration found in prisma/migrations
No pending migrations to apply.
```
→ Railway vẫn dùng package.json start script → cần config Railway project settings (xem Step 4)

### Step 3: Fix REDIS_URL (CRITICAL - Làm song song với Step 2)

Trong khi đợi deployment, fix Redis ngay:

1. **Railway Dashboard** → Project `life-lessonsapi`
2. Tab **Variables**
3. Tìm biến `REDIS_URL`:
   - Nếu có giá trị text `redis://127.0.0.1:16379` hoặc tương tự → **DELETE** nó
   - Click **+ New Variable** → chọn **Add Reference**
   - Select: `Redis` service → variable `REDIS_URL`
   - Save

4. Tương tự kiểm tra `DATABASE_URL`:
   - Phải có icon 🔗 (reference)
   - Nếu là plain text → delete và tạo reference đến `PostgreSQL` service

**Kết quả mong đợi:**
```
DATABASE_URL = 🔗 PostgreSQL.DATABASE_URL
REDIS_URL = 🔗 Redis.REDIS_URL
```

### Step 4: Nếu migrations vẫn không chạy

**Nguyên nhân:** Railway chưa detect `railway.json` file.

**Giải pháp:**

#### Option A: Config Railway Service Settings (Web UI)
1. Railway Dashboard → Service `life-lessonsapi`
2. Tab **Settings**
3. Scroll xuống **Build**:
   - **Builder:** chọn `Dockerfile` (thay vì `Nixpacks`)
   - **Dockerfile Path:** nhập `apps/api/Dockerfile`
4. Scroll xuống **Deploy**:
   - **Start Command:** để trống hoặc xoá hết
5. Click **Save Changes** → sẽ trigger rebuild tự động

#### Option B: Chạy Migrations Thủ Công (Temporary)
Nếu cần khẩn cấp:

1. Railway Dashboard → Service `PostgreSQL`
2. Tab **Data**
3. Click **Connect** → copy connection string
4. Trong VSCode terminal local:

```bash
# Set DATABASE_URL từ Railway
$env:DATABASE_URL = "postgresql://postgres:xxx@xxx.railway.app:5432/railway"

# Chạy migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

**Hoặc dùng Railway CLI:**
```bash
railway link
railway run npx prisma migrate deploy --schema=./prisma/schema.prisma
```

---

## 🧪 Testing sau khi fix:

### Test 1: Kiểm tra Health Endpoint
```bash
curl https://life-lessonsapi-production.up.railway.app/
```
**Expected:** Status 200, không có Redis errors trong logs

### Test 2: Kiểm tra Database Tables
Railway Dashboard → PostgreSQL service → Data tab → SQL Query:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```
**Expected:** Thấy tables: `users`, `lessons`, `goals`, `sprints`, `reminders`, `concepts`, etc.

### Test 3: Test Signup API
```bash
curl -X POST https://life-lessonsapi-production.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@lifelessons.app",
    "password": "Test123456!",
    "name": "Test User"
  }'
```
**Expected:** Status 201, user object trả về (không phải 500 error)

### Test 4: Test Frontend Login
1. Mở https://life-lessons-web.vercel.app
2. Click "Sign Up"
3. Điền form và submit
4. **Expected:** Redirect to dashboard (không còn 500 error)

---

## 📊 Timeline dự kiến:

- **T+0**: Push commit `951d0cf` ✅ (DONE)
- **T+2 min**: Railway rebuild complete → Check logs
- **T+3 min**: Fix REDIS_URL reference → Auto redeploy
- **T+5 min**: Verify migrations applied + test APIs
- **T+6 min**: Test full signup flow từ Vercel → Railway

---

## 🔧 Troubleshooting:

### Vấn đề: "railway.json not detected"
**Giải pháp:** File phải ở đúng root của service:
```
apps/api/
  ├── railway.json    ← Đây
  ├── Dockerfile
  ├── package.json
  └── src/
```

### Vấn đề: "Migrations still not running"
**Giải pháp:**
1. Verify Dockerfile copy prisma folder:
   ```dockerfile
   COPY prisma ./prisma  # Line 15
   ```
2. Check Docker build context in Railway settings → phải là `/` (root) không phải `/apps/api`
3. Manually set in Railway Service Settings: Builder = Dockerfile

### Vấn đề: "Redis errors persist after fixing REDIS_URL"
**Giải pháp:**
1. Verify Redis service đang chạy: Railway → Redis → Status = Active
2. Check connection from API logs: không nên thấy `127.0.0.1:16379`
3. Nếu cần, restart API service: Settings → Restart

---

## ✅ Success Criteria:

- [ ] Railway deployment logs hiển thị "Applying migration" messages
- [ ] PostgreSQL Data tab có đủ tables (10+ tables)
- [ ] Deploy logs **KHÔNG** có Redis connection errors
- [ ] Health endpoint trả về 200
- [ ] Signup API trả về 201 với user object
- [ ] Frontend signup flow hoạt động end-to-end

---

## 📞 Next Actions:

1. **IMMEDIATELY**: Kiểm tra Railway deployment status
2. **WITHIN 2 MIN**: Fix REDIS_URL reference (nếu chưa)
3. **WITHIN 5 MIN**: Verify migrations applied via logs
4. **WITHIN 10 MIN**: Test full signup flow
5. **IF BLOCKED**: Apply Option B (manual migration) và báo lại

---

**Commit ID:** `951d0cf`  
**Files Changed:**
- ✅ `apps/api/railway.json` (created)
- ✅ `apps/api/Dockerfile` (updated comment)

**Estimated Fix Time:** 5-10 minutes (including Railway rebuild)
