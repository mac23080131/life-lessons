# 🚨 Railway Prisma Client - Root Cause Fix

## Vấn đề gốc rễ
**"Invalid value undefined for datasource 'db'"** xảy ra vì:
1. Prisma Client được generate ở build-time với placeholder URL
2. Ở runtime, Prisma Client **không tự động reconnect** với DATABASE_URL mới từ Railway
3. Alpine Linux binary target thiếu → Prisma Client không chạy được trên node:20-alpine

## Solutions đã áp dụng

### 1. Thêm binaryTargets cho Alpine Linux
```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "linux-musl-openssl-3.0.x"]
}
```
→ Đảm bảo Prisma Client hoạt động trên Alpine Linux trong Docker

### 2. Regenerate Prisma Client trong production stage
```dockerfile
# Generate with dummy URL in builder (for build)
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm --filter api exec prisma generate

# In production stage, regenerate with Railway DATABASE_URL (via ARG)
ARG DATABASE_URL
RUN if [ -n "$DATABASE_URL" ]; then \
      pnpm --filter api exec prisma generate; \
    else \
      DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm --filter api exec prisma generate; \
    fi
```
→ Prisma Client được generate với connection string thật từ Railway

### 3. CMD đơn giản - chỉ migrate và start
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```
→ Không cần generate runtime nữa, đã generate đủ trong build

## Railway Configuration Required

### Build-time ARG
Railway cần pass `DATABASE_URL` vào build process:
1. Vào Railway Dashboard → API Service → Settings
2. Scroll down to "Build" section
3. Click "Add Build Argument"
4. Name: `DATABASE_URL`
5. Value: **Reference** to PostgreSQL service → `DATABASE_URL`
6. Save

**⚠️ Đây là bước QUAN TRỌNG nhất!** Railway mặc định chỉ inject env vào runtime, không vào build-time.

## Verify

### Check build logs
Tìm dòng:
```
Generating Prisma Client with Railway DATABASE_URL
✔ Generated Prisma Client
```

### Check runtime logs
Tìm dòng:
```
🚀 Life Lessons API running on: http://0.0.0.0:3001
```

### Test endpoint
```bash
curl https://life-lessonsapi-production.up.railway.app/api/health
```

Expected:
```json
{"status":"ok","timestamp":"..."}
```

## Nếu vẫn lỗi

### Option A: Thử regenerate runtime (fallback)
Sửa CMD:
```dockerfile
CMD ["sh", "-c", "pnpm --filter api exec prisma generate && npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```

### Option B: Check Railway Build Arguments
- Đảm bảo `DATABASE_URL` được pass vào build (Build Arguments, không phải Variables)
- Rebuild service

### Option C: Check PostgreSQL status
- PostgreSQL service phải ✅ Active
- DATABASE_URL reference phải đúng

---

**Status**: ✅ Pushed (commit 514cf5d)
**Critical**: Cần set Railway Build Argument `DATABASE_URL` = Reference to PostgreSQL
**ETA**: 3-5 phút rebuild
