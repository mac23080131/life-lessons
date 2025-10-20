# ⚡ Quick Action Checklist - UPDATED

## 🔥 Latest Fix: Commit `910ea0f` (Redis Connection)

### ✅ What was fixed:
- **Root Cause**: Code hardcoded `REDIS_HOST`/`REDIS_PORT` (không tồn tại trên Railway)
- **Solution**: Parse `REDIS_URL` environment variable từ Railway
- **Method**: Dùng `{ connection: { url: redisUrl } }` cho BullMQ/ioredis

---

## 🎯 DO THIS NOW (5 minutes):

### ☐ Step 1: Wait for Railway Rebuild (3-4 min)
- [ ] Open: https://railway.app → `life-lessonsapi` → Deployments
- [ ] Wait for commit `910ea0f` status = **ACTIVE**
- [ ] Click deployment → **View Logs**

### ☐ Step 2: Verify Debug Log (CRITICAL!)
Look for this line in logs:
```
[BullMQ] Using REDIS_URL from environment  ← MUST SEE THIS!
```

**❌ If you see instead:**
```
[BullMQ] Using REDIS_HOST/PORT (fallback to localhost)  ← BAD!
```
→ Go to Step 6 (Troubleshooting)

### ☐ Step 3: Check for ECONNREFUSED Errors
After app starts, scroll through logs:
- [ ] **NO** `Error: connect ECONNREFUSED 127.0.0.1:16379`
- [ ] **NO** `Error: connect ECONNREFUSED 127.0.0.1:6379`
- [ ] See: `🚀 Life Lessons API running on: http://0.0.0.0:3001`

### ☐ Step 4: Verify App Running (1 min)
```bash
curl https://life-lessonsapi-production.up.railway.app/
```
- [ ] Response: Status 200 (not 502)

### ☐ Step 5: Check Database Tables (2 min)
Railway → `PostgreSQL` → Data tab → Query:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```
- [ ] **MUST SEE**: users, lessons, goals, sprints, reminders, concepts, etc.

---

## 🚨 Step 6: Troubleshooting (If Still Errors)

### If logs show "Using REDIS_HOST/PORT (fallback to localhost)":

**Problem**: `REDIS_URL` variable not injected into container.

**Fix:**
1. Railway → `life-lessonsapi` → **Variables** tab
2. Find `REDIS_URL` variable
3. **Check**: Must have 🔗 icon (Reference)
4. **If plain text**:
   - Delete it
   - Click **+ New Variable** → **Add Reference**
   - Select: `Redis` service → `REDIS_URL`
   - Save (will auto-redeploy)

### ☐ Step 6: Test API (1 min)
Open browser or use curl:
```bash
curl https://life-lessonsapi-production.up.railway.app/
```
- [ ] Response: Status 200 (not 502)

### ☐ Step 7: Test Signup (2 min)
```bash
curl -X POST https://life-lessonsapi-production.up.railway.app/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","name":"Test"}'
```
- [ ] Response: Status 201 with user object (not 500)

### ☐ Step 8: Test Frontend (2 min)
- [ ] Open: https://life-lessons-web.vercel.app
- [ ] Click "Sign Up"
- [ ] Fill form: email, password, name
- [ ] Submit
- [ ] **MUST**: Redirect to dashboard (not error page)

---

## 🚨 If Migrations Still Don't Run:

### Emergency Fix - Railway Service Settings:
1. Railway → `life-lessonsapi` → **Settings** tab
2. Scroll to **Build** section:
   - Builder: change to `Dockerfile`
   - Dockerfile Path: `apps/api/Dockerfile`
3. Scroll to **Deploy** section:
   - Start Command: **DELETE** all text (leave empty)
4. Click **Deploy** tab → **Redeploy** manually

---

## 📊 Progress Tracker:

**Current Time:** _____________

- [ ] T+0 min: Started monitoring
- [ ] T+2 min: Deployment active
- [ ] T+3 min: REDIS_URL fixed, redeploying
- [ ] T+5 min: Logs clean (no Redis errors)
- [ ] T+6 min: Database tables verified
- [ ] T+7 min: API health check passed
- [ ] T+8 min: Signup API working
- [ ] T+10 min: **✅ COMPLETE** - Full signup flow works!

---

## ✅ Success = All Green:
- ✅ Migrations applied (4 migrations in logs)
- ✅ No Redis connection errors
- ✅ Database has all tables
- ✅ API returns 200
- ✅ Signup returns 201
- ✅ Frontend signup works end-to-end

---

**Next:** Once all green, run seed script to populate demo data.
