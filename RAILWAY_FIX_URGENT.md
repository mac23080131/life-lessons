# ⚠️ URGENT: Railway API Crashed - Missing DATABASE_URL

## 🚨 Vấn đề

API service đã **build thành công** nhưng **crashed khi start** vì:

```
ERROR: Invalid value undefined for datasource "db" provided to PrismaClient constructor.
```

→ **Thiếu DATABASE_URL environment variable!**

---

## ✅ FIX NGAY (5 phút)

### Bước 1: Vào Railway Dashboard

```
1. Mở Railway project của bạn: sparkling-nourishment
2. Click vào service: @life-lessons/api
3. Click tab "Variables"
```

### Bước 2: Add DATABASE_URL (QUAN TRỌNG!)

**⚠️ KHÔNG paste text - phải dùng Reference:**

```
1. Click "+ New Variable"
2. Variable name: DATABASE_URL
3. Click "Add Reference" (nút bên phải)
4. Select service: Postgres
5. Select variable: DATABASE_URL
6. Click "Add"
```

### Bước 3: Add REDIS_URL

```
1. Click "+ New Variable"
2. Variable name: REDIS_URL
3. Click "Add Reference"
4. Select service: Redis
5. Select variable: REDIS_URL
6. Click "Add"
```

### Bước 4: Add Basic Variables

**Copy-paste từng dòng:**

```
NODE_ENV=production
```

```
PORT=3001
```

```
TZ=Asia/Bangkok
```

### Bước 5: Add Auth Variables

```
JWT_SECRET=m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
```

```
JWT_EXPIRES_IN=15m
```

```
JWT_REFRESH_EXPIRES_IN=7d
```

### Bước 6: Add CORS

```
ALLOWED_ORIGINS=http://localhost:3000
```

---

## 🔄 Sau khi add variables

Railway sẽ **tự động redeploy** (~1-2 phút).

### Kiểm tra:

```
1. Tab "Deployments" → Deployment mới nhất
2. Đợi status = "Active" ✅
3. Tab "Deploy Logs" → Không còn error
4. Thấy log: "Nest application successfully started"
```

---

## 📋 Checklist (phải có đủ 9 variables)

- [ ] DATABASE_URL (Reference → Postgres)
- [ ] REDIS_URL (Reference → Redis)
- [ ] NODE_ENV = production
- [ ] PORT = 3001
- [ ] TZ = Asia/Bangkok
- [ ] JWT_SECRET = m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
- [ ] JWT_EXPIRES_IN = 15m
- [ ] JWT_REFRESH_EXPIRES_IN = 7d
- [ ] ALLOWED_ORIGINS = http://localhost:3000

---

## 🎯 Expected Result

Khi deploy thành công, trong Deploy Logs sẽ thấy:

```
[Nest] INFO [NestApplication] Nest application successfully started
```

**Không còn error về PrismaClient constructor!**

---

## 💡 Tại sao lỗi?

Railway build Docker image thành công, nhưng khi **container start**, NestJS cần kết nối database.

Prisma Client đọc `DATABASE_URL` từ environment → Nếu không có → Crash ngay!

**Fix:** Add DATABASE_URL → Prisma connect thành công → API start OK ✅

---

**⏱️ Thời gian**: 3-5 phút add variables + 1-2 phút redeploy = **5-7 phút total**

**Báo tôi khi:** Variables đã add xong + API đang redeploy!
