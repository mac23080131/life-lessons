# 🔧 Railway Prisma Database Connection Fix

## Vấn đề
Railway báo lỗi: `Invalid value undefined for datasource "db" provided to PrismaClient constructor`

## Nguyên nhân
- `ARG` trong Dockerfile chỉ available ở build-time
- Prisma Client cần `DATABASE_URL` ở **runtime** (khi app start)
- Railway inject env variables vào runtime, không phải build-time

## Giải pháp đã áp dụng

### 1. Generate Prisma Client với placeholder URL trong build
```dockerfile
RUN DATABASE_URL="postgresql://placeholder:placeholder@placeholder:5432/placeholder" pnpm --filter api exec prisma generate
```

### 2. Regenerate Prisma Client với DATABASE_URL thật từ Railway khi start
```dockerfile
CMD ["sh", "-c", "pnpm --filter api exec prisma generate && cd prisma && npx prisma migrate deploy && cd /app/apps/api && node dist/main.js"]
```

## Cách hoạt động
1. **Build-time**: Generate Prisma Client với placeholder URL (để build không fail)
2. **Runtime**: Railway inject `DATABASE_URL` thật → Regenerate Prisma Client → Migrate → Start app

## Verify
Sau khi Railway rebuild (3-5 phút):
1. Vào tab "Logs" trên Railway
2. Tìm dòng: `Prisma schema loaded from prisma/schema.prisma`
3. Không thấy lỗi "Invalid value undefined"
4. Thấy `Nest application successfully started`

## Test API
```bash
curl https://life-lessonsapi-production.up.railway.app/health
```

Expected:
```json
{"status":"ok","timestamp":"..."}
```

## Tài liệu tham khảo
- [Prisma + Docker best practices](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-railway)
- [Railway env variables](https://docs.railway.app/deploy/variables)

---

**Status**: ✅ Fixed & Pushed (commit 9cd0f05)
**Next**: Đợi Railway auto-rebuild → Test /health endpoint
