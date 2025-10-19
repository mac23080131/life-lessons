# 🔧 Complete Fix - Recreate PostgreSQL & Fix Redis

## Plan: Fix cả Database và Redis cùng lúc

---

## STEP 1: Remove & Recreate PostgreSQL (2 phút)

### 1.1 Remove old PostgreSQL

1. **Railway Dashboard** → Click **PostgreSQL** service (Postgres box)
2. **Tab "Settings"**
3. **Scroll down** to bottom
4. **Click "Remove Service"** (red button)
5. **Confirm** deletion
6. **Đợi** service bị xóa (~10 seconds)

### 1.2 Add new PostgreSQL

1. **Click "+ New"** (trong project)
2. **Select "Database"**
3. **Select "Add PostgreSQL"**
4. **Đợi** deploy complete (~30 seconds)
5. **Verify** status = ✅ Active (green)

---

## STEP 2: Fix BOTH Redis & Database References (3 phút)

### 2.1 Go to API Service Variables

1. **Click @life-lessons/api** service
2. **Tab "Variables"**

### 2.2 Update DATABASE_URL

1. **Find** `DATABASE_URL` variable
2. **Click "Edit"** (pencil icon)
3. **Click "Add Reference"**
4. **Select service**: **PostgreSQL** (NEW one)
5. **Select variable**: **`DATABASE_URL`**
6. **Save**

### 2.3 Fix REDIS_URL (IF NOT REFERENCE)

1. **Find** `REDIS_URL` variable
2. **Check**: Is it a **Reference** (link icon) or **plain text**?

**If plain text (redis://localhost...):**
- **Delete** this variable
- **Click "New Variable"**
- Name: `REDIS_URL`
- **Click "Add Reference"** (NOT plain text!)
- **Select service**: **Redis**
- **Select variable**: **`REDIS_URL`**
- **Save**

**If already Reference**: ✅ OK, skip

### 2.4 Verify All Variables

Checklist - Must have ALL as References:
- [x] `DATABASE_URL` → Reference to **PostgreSQL** (NEW)
- [x] `REDIS_URL` → Reference to **Redis**
- [x] `JWT_SECRET` → Has value (text OK)
- [x] `NODE_ENV=production` → Text OK
- [x] `PORT=3001` → Text OK
- [x] `ALLOWED_ORIGINS` → Has Vercel URL
- [x] `TZ=Asia/Bangkok` → Text OK

---

## STEP 3: Redeploy API (1 phút)

1. **Still in API service**
2. **Tab "Deployments"**
3. **Click "Redeploy"** button (top right hoặc trên deployment)
4. **Confirm** redeploy
5. **Đợi** build + deploy (~2-3 phút)

---

## STEP 4: Watch Logs for Success (2 phút)

### 4.1 While deploying

1. **Tab "Logs"** or **"Deploy Logs"**
2. **Wait and watch for**:

**Expected to see (in order):**

```
sh -c npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js

Environment variables loaded from .env
Prisma schema loaded from /app/prisma/schema.prisma
Datasource "db": PostgreSQL database "railway", schema "public"

Applying migration `20251017044345_init`
Applying migration `20251018130920_add_group_lessons`  
Applying migration `20251018150549_add_groups_challenges`
Applying migration `20251018161808_add_ckb_models`

✔ Applied 4 migrations in 2.5s

[Nest] LOG [NestFactory] Starting Nest application...
[Nest] LOG [InstanceLoader] AppModule dependencies initialized
[Nest] LOG [InstanceLoader] PrismaModule dependencies initialized
🚀 Life Lessons API running on: http://0.0.0.0:3001
📚 Swagger docs available at: http://0.0.0.0:3001/docs
🌍 Environment: production
```

### 4.2 Check for errors

**Should NOT see:**
- ❌ `ECONNREFUSED 127.0.0.1:16379` (Redis)
- ❌ `table does not exist` (Database)
- ❌ Any ERROR or exception

**If you still see errors** → Screenshot and send to me

---

## STEP 5: Test Login (1 phút)

### 5.1 Signup new user (since DB is fresh)

1. **Open** https://life-lessons-web.vercel.app/signup
2. **Fill form**:
   - Email: `test@production.com`
   - Password: `Test1234!`
   - Name: `Production User`
3. **Click "Đăng ký"**

**Expected:**
- ✅ 200 OK
- ✅ Redirect to dashboard or login
- ✅ No errors

### 5.2 Login

1. **Go to** https://life-lessons-web.vercel.app/login
2. **Use** credentials above
3. **Click "Đăng nhập"**

**Expected:**
- ✅ 200 OK
- ✅ Redirect to dashboard
- ✅ See your name
- ✅ App works!

---

## 🎉 Success Criteria

After all steps:
- ✅ No more Redis ECONNREFUSED errors
- ✅ No more "table does not exist" errors
- ✅ Migrations applied successfully
- ✅ App running healthy
- ✅ Can signup new user
- ✅ Can login
- ✅ Dashboard loads

---

## ⚠️ If Still Fails

### Scenario A: Redis still localhost

**Check Redis service is Active:**
- Railway → Redis service → Should be ✅ Active
- If not → Add new Redis service
- Update REDIS_URL reference

### Scenario B: Migrations fail

**Check DATABASE_URL:**
- Must be reference to NEW PostgreSQL
- Not old one

**Check Prisma schema path:**
- Should be `/app/prisma/schema.prisma`

### Scenario C: Other errors

**Send me:**
- Screenshot of logs after redeploy
- First 20 lines of deploy logs
- Any ERROR messages

---

## 📋 Quick Summary

```
1. Delete old PostgreSQL → Add new PostgreSQL
2. Update DATABASE_URL reference (API → new PostgreSQL)
3. Verify REDIS_URL is reference (not plain text)
4. Redeploy API
5. Watch logs for migration success
6. Test signup/login
```

**Estimated time**: 10-15 minutes total

**Ready to start?** 🚀

Follow Step 1 and report back after each step!
