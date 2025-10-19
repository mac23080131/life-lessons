# 🚨 CRITICAL: Database Tables Not Found

## Vấn đề
```
The table `public.users` does not exist in the current database.
```

**Migrations chưa chạy hoặc fail!** Database không có tables.

---

## ✅ FIX: Force Run Migrations

### Option 1: Verify Dockerfile CMD (RECOMMENDED)

Dockerfile CMD phải có `prisma migrate deploy`:

1. **Check file `apps/api/Dockerfile`** (line cuối):
   ```dockerfile
   CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
   ```

2. **Nếu sai hoặc thiếu**, sửa lại CMD

3. **Redeploy Railway**

---

### Option 2: Manual Run via Railway Shell (QUICK FIX)

**Nếu Railway có Shell/Terminal access:**

1. **Vào Railway Dashboard**
2. **Click service: @life-lessons/api**
3. **Settings** → **Deploy**  hoặc tìm **"Shell"** option
4. **Chạy command**:

```bash
cd /app
npx prisma migrate deploy --schema=/app/prisma/schema.prisma
```

Expected output:
```
✔ Applying migration `20251017044345_init`
✔ Applying migration `20251018130920_add_group_lessons`
✔ Applying migration `20251018150549_add_groups_challenges`
✔ Applying migration `20251018161808_add_ckb_models`
✔ Applied 4 migrations
```

---

### Option 3: Add Railway Deploy Hook

Nếu Railway có deploy hooks:

1. **Railway Dashboard** → **Service Settings**
2. **Deploy Hooks** hoặc **Build Command**
3. **Add Command**:
   ```bash
   npx prisma migrate deploy
   ```
4. **Redeploy**

---

### Option 4: Temporary - Run from Local (Last Resort)

**Kết nối từ local qua Railway:**

```powershell
# Get DATABASE_URL from Railway
railway link
railway variables

# Copy DATABASE_URL value
# Set locally
$env:DATABASE_URL="postgresql://..."

# Run migration
pnpm prisma migrate deploy
```

**NOTE**: Có thể bị block vì Railway Postgres chỉ cho internal access.

---

## 🎯 Verify Dockerfile CMD

Hãy kiểm tra file `apps/api/Dockerfile` dòng cuối:

**Current (if wrong)**:
```dockerfile
CMD ["node", "dist/main.js"]
```

**Should be**:
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```

---

## 🔍 DEBUG: Why migrations didn't run?

### Possible reasons:

1. **Dockerfile CMD không có migrate**
   - Fix: Update CMD

2. **Migrate command fail during deploy**
   - Check Railway build logs
   - Look for Prisma errors

3. **DATABASE_URL không available lúc build**
   - Should be OK (đã reference)

4. **Prisma schema path wrong**
   - Verify: `/app/prisma/schema.prisma` exists

---

## 📋 ACTION PLAN

### Step 1: Check Dockerfile
```powershell
# Local
cat apps/api/Dockerfile | Select-String -Pattern "CMD"
```

Expected:
```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```

### Step 2: If wrong - Fix it

Sửa file `apps/api/Dockerfile` dòng cuối.

### Step 3: Commit & Push
```powershell
git add apps/api/Dockerfile
git commit -m "fix: ensure prisma migrate runs before app start"
git push
```

### Step 4: Railway Auto Redeploy
Đợi Railway rebuild (~2-3 phút)

### Step 5: Verify Logs
Check Railway logs:
- ✅ "Applied X migrations"
- ✅ "🚀 Life Lessons API running"
- ❌ No "table does not exist"

---

## 🚀 Quick Check

**Xem Dockerfile CMD hiện tại là gì?**

Nếu KHÔNG có `prisma migrate deploy` → **MUST FIX**

Báo cho mình nội dung CMD line cuối của Dockerfile! 📋
