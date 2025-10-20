# 🚨 DEBUG: 500 Internal Server Error

## Vấn đề hiện tại
- Login: 500 Internal Server Error
- Signup: 500 Internal Server Error
- CORS: ✅ Fixed

## Nguyên nhân có thể:
1. ❌ Database migration chưa chạy đầy đủ
2. ❌ Prisma Client không connect được database
3. ❌ Code lỗi trong auth controller
4. ❌ Environment variables thiếu

---

## 🔍 DEBUG STEPS

### Step 1: Check Railway Logs (QUAN TRỌNG)

1. **Vào Railway Dashboard**
2. **Click service: life-lessons/api**
3. **Click tab "Logs"** (bên cạnh Deployments)
4. **Filter**: Last 15 minutes
5. **Tìm errors** liên quan đến:
   - `POST /api/auth/login`
   - `POST /api/auth/signup`
   - `Prisma`
   - `Database`
   - `Error`

### Expected errors to look for:

**A. Prisma error:**
```
PrismaClientInitializationError: Can't reach database
PrismaClientKnownRequestError: Table does not exist
```
→ Migration chưa chạy hoặc fail

**B. Auth error:**
```
Error: JWT_SECRET is required
Error: User not found
```
→ Env variable issue

**C. Database connection:**
```
ECONNREFUSED
Can't connect to database
```
→ DATABASE_URL sai

---

### Step 2: Re-run Migrations (If needed)

Nếu thấy lỗi migration, vào Railway:

1. Tab **"Settings"**
2. Tìm phần **"Deploy Command"** hoặc **"Start Command"**
3. Verify có dòng:
   ```
   npx prisma migrate deploy && node dist/main.js
   ```

4. Hoặc trigger manual redeploy:
   - Tab "Deployments"
   - Click "Redeploy"

---

### Step 3: Check Environment Variables

Verify trong Railway Variables tab:
- [ ] `DATABASE_URL` (reference)
- [ ] `REDIS_URL` (reference)
- [ ] `JWT_SECRET` (có giá trị)
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`

---

### Step 4: Manual Test via Railway Shell

Nếu có Railway shell access:

```bash
# Check Prisma
cd /app
npx prisma migrate status

# Test database connection
npx prisma db pull

# Run migrations
npx prisma migrate deploy
```

---

## 🎯 NEXT ACTIONS

**Bạn cần làm:**

1. **Vào Railway Logs** và tìm error message
2. **Chụp màn hình** Railway Logs (filter: POST /api/auth)
3. **Gửi cho mình** để debug chính xác

**Hoặc:**

Copy **5-10 dòng log error** từ Railway và paste vào chat.

---

## 🔧 Quick Fixes (If you can identify)

### Fix 1: Missing JWT_SECRET
Railway Variables → Verify `JWT_SECRET` có giá trị

### Fix 2: Migration not run
Redeploy service → Check CMD có `prisma migrate deploy`

### Fix 3: Database not connected
Check `DATABASE_URL` reference đúng PostgreSQL service

---

**Hãy check Railway logs và báo kết quả!** 🔍
