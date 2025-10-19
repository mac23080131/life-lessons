# Railway Deployment Checklist ✅

## Commit mới nhất: `9241699` 
**Message:** "fix: Add correct prisma schema path for monorepo build"

---

## ⏳ Bước 1: Chờ Build Success (2-3 phút)

Vào Railway Dashboard → `life-lessonsapi` service → **Deployments** tab

### Logs cần thấy:
```
✓ pnpm install completed
✓ prisma generate --schema=../../prisma/schema.prisma  ← QUAN TRỌNG!
✓ Generating Prisma Client
✓ nest build
✓ webpack compiled successfully
```

**Nếu thấy:**
- ❌ "Could not find Prisma Schema" → Schema path sai (đã fix ở commit này)
- ✅ "webpack compiled successfully" → Build thành công! Chuyển bước 2

---

## ⏳ Bước 2: Fix REDIS_URL (ngay sau build success)

### Trong Railway Dashboard:

1. Click vào service **life-lessonsapi**
2. Tab **Variables**
3. Tìm `REDIS_URL`
4. Click icon **🗑️ Delete** bên phải
5. Click **+ New Variable**
6. Click **Add Reference** (KHÔNG nhập plain text!)
7. Chọn:
   - Service: **Redis**
   - Variable: **REDIS_URL**
8. Click **Add**
9. Railway sẽ tự động redeploy

---

## ⏳ Bước 3: Verify DATABASE_URL

Trong cùng tab **Variables**:

1. Tìm `DATABASE_URL`
2. Kiểm tra nó có icon **🔗** (reference) hay không
3. Nếu KHÔNG có icon 🔗:
   - Delete variable
   - Add Reference → PostgreSQL → DATABASE_URL
   - Railway tự động redeploy

---

## ⏳ Bước 4: Xem Deploy Logs (sau khi redeploy từ bước 2/3)

Tab **Deployments** → Click deployment mới nhất → **Deploy Logs**

### Logs thành công:
```
✅ "Environment: production"
✅ "Applying migration `20251017044345_init`"         ← Migrations chạy!
✅ "Applying migration `20251018130920_add_group_lessons`"
✅ "Applying migration `20251018150549_add_groups_challenges`"
✅ "Applying migration `20251018161808_add_ckb_models`"
✅ "🚀 Life Lessons API running on: http://0.0.0.0:3001"
✅ "📚 Swagger docs available at: http://0.0.0.0:3001/docs"
✅ "Nest application successfully started"
```

### ❌ KHÔNG còn thấy:
```
❌ "ECONNREFUSED 127.0.0.1:16379"  ← Redis error
❌ "table public.users does not exist"  ← DB error
```

---

## ⏳ Bước 5: Verify Database có Tables

1. Railway Dashboard → Click service **Postgres**
2. Tab **Database**
3. Tab **Data**
4. Kiểm tra: Phải thấy tables:
   - ✅ `User`
   - ✅ `Lesson`
   - ✅ `Goal`
   - ✅ `Sprint`
   - ✅ `Concept`
   - ✅ `ConceptCategory`
   - ✅ etc.

**Nếu vẫn "You have no tables":**
- Có thể migrations chưa chạy
- Check Deploy Logs xem có dòng "Applying migration..."

---

## ⏳ Bước 6: Test API Endpoints

Mở trình duyệt, test:

### Health Check:
```
https://life-lessonsapi-production.up.railway.app/
```
Mong đợi: JSON response

### Swagger Docs:
```
https://life-lessonsapi-production.up.railway.app/docs
```
Mong đợi: Swagger UI hiển thị tất cả endpoints

### Test Signup:
```bash
curl -X POST https://life-lessonsapi-production.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test1234!","name":"Test User"}'
```

Mong đợi: 
- ✅ 201 Created với user object
- ❌ KHÔNG còn 500 Internal Server Error

---

## ⏳ Bước 7: Test Frontend Login

1. Mở https://life-lessons-web.vercel.app
2. Click **Sign Up** hoặc **Login**
3. Nhập email/password
4. Click Submit

Mong đợi:
- ✅ Redirect vào Dashboard
- ❌ KHÔNG còn "Failed to login" error

---

## 📊 Tổng kết Status

### Đã Fix ✅
- [x] CORS configuration
- [x] Dockerfile CMD với migrations
- [x] Build script với prisma generate
- [x] Prisma schema path trong monorepo

### Đang Chờ ⏳
- [ ] Build thành công (bước 1)
- [ ] REDIS_URL fix (bước 2)
- [ ] DATABASE_URL verify (bước 3)
- [ ] Migrations chạy (bước 4)
- [ ] Tables tạo ra (bước 5)
- [ ] API hoạt động (bước 6)
- [ ] Frontend login thành công (bước 7)

---

## ⚠️ Troubleshooting

### Nếu Build vẫn Fail:
1. Check logs Railway có error gì
2. Verify file `prisma/schema.prisma` tồn tại trong repo
3. Thử local: `pnpm --filter @life-lessons/api build`

### Nếu Migrations không chạy:
1. Check DATABASE_URL có đúng reference không
2. Xem Deploy Logs có dòng "prisma migrate deploy"
3. Có thể cần manual run: Railway CLI hoặc connect trực tiếp

### Nếu Redis vẫn lỗi:
1. Verify REDIS_URL là reference (có icon 🔗)
2. Check Redis service đang chạy (green ✓)
3. Xem connection string format đúng không

---

**Bắt đầu từ Bước 1:** Mở Railway Dashboard và check Build Logs ngay! ⏰
