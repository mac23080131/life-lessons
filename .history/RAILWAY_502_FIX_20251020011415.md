# 🔧 Railway 502 Bad Gateway - Critical Fixes

## Vấn đề phát hiện
1. **Port mismatch**: App đọc `API_PORT` nhưng Railway set `PORT` → app không listen đúng port
2. **CMD quá phức tạp**: Generate Prisma lại mỗi lần start → fail và crash
3. **Working directory sai**: CMD chạy từ `/app` thay vì `/app/apps/api`

## Fixes áp dụng

### 1. Fix PORT trong main.ts
```typescript
// Before: const port = Number(process.env.API_PORT || 3001);
// After:
const port = Number(process.env.PORT || process.env.API_PORT || 3001);
```
→ Railway inject `PORT`, app sẽ đọc đúng

### 2. Đơn giản hóa Dockerfile CMD
```dockerfile
# Before: CMD ["sh", "-c", "pnpm --filter api exec prisma generate && cd prisma && npx prisma migrate deploy && cd /app/apps/api && node dist/main.js"]
# After:
WORKDIR /app/apps/api
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```
→ Không cần generate lại Prisma Client (đã có từ builder), chỉ migrate và start

### 3. Copy đầy đủ Prisma Client từ builder
```dockerfile
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
```
→ Đảm bảo Prisma Client hoạt động ngay lập tức

## Verify sau khi Railway rebuild (3-5 phút)

### 1. Check Logs
Tìm các dòng sau trong Railway Logs:
```
✓ 🚀 Life Lessons API running on: http://0.0.0.0:3001
✓ 📚 Swagger docs available at: http://0.0.0.0:3001/docs
✓ 🌍 Environment: production
```

### 2. Test Health Endpoint
```bash
curl https://life-lessonsapi-production.up.railway.app/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-10-19T..."
}
```

### 3. Test Swagger
```
https://life-lessonsapi-production.up.railway.app/docs
```
Should load Swagger UI

## Nếu vẫn lỗi

### Check Railway Variables
Đảm bảo có đủ:
- `PORT` (Railway tự set, KHÔNG cần manual)
- `DATABASE_URL` (reference tới PostgreSQL)
- `REDIS_URL` (reference tới Redis)
- `JWT_SECRET`
- `NODE_ENV=production`
- `TZ=Asia/Bangkok`

### Check Deployment Status
1. Railway Dashboard → Service → Deployments tab
2. Xem build status: ✅ Success
3. Click vào deployment → Xem logs runtime

### Common Issues
- **"listen EADDRINUSE"**: Port đã được dùng → Railway tự handle, không xảy ra
- **"Cannot find module @prisma/client"**: Prisma Client chưa copy → đã fix trong Dockerfile
- **"ECONNREFUSED"**: Database chưa sẵn sàng → Đợi thêm 1-2 phút

---

**Status**: ✅ Critical fixes pushed (commit b419d6c)
**ETA**: Railway rebuild trong 3-5 phút
**Next**: Test endpoint sau khi deploy complete
