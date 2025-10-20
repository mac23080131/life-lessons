# ⚡ Quick Action Checklist

## 🎯 Commit `951d0cf` Deployed - DO THIS NOW:

### ☐ Step 1: Monitor Railway Deployment (2 min)
- [ ] Open: https://railway.app → `life-lessonsapi` → Deployments
- [ ] Wait for commit `951d0cf` status = **ACTIVE**
- [ ] Click deployment → View Logs
- [ ] **LOOK FOR**: `Applying migration` messages (4 migrations)

### ☐ Step 2: Fix REDIS_URL (1 min) - DO WHILE WAITING
- [ ] Railway → `life-lessonsapi` → Variables tab
- [ ] Find `REDIS_URL` variable
- [ ] If value = text (e.g., `redis://127...`) → DELETE it
- [ ] Click **+ New Variable** → **Add Reference**
- [ ] Select: `Redis` service → `REDIS_URL` variable
- [ ] Click Save (will trigger auto-redeploy)

### ☐ Step 3: Verify DATABASE_URL (30 sec)
- [ ] Same Variables tab
- [ ] Check `DATABASE_URL` has 🔗 icon (reference)
- [ ] If plain text → delete and recreate as Reference to PostgreSQL

### ☐ Step 4: Check Deployment Logs (1 min)
After Step 2 redeploy completes:
- [ ] View Logs → should see **NO** Redis errors
- [ ] Confirm: `🚀 Life Lessons API running on: http://0.0.0.0:3001`
- [ ] Confirm: No `ECONNREFUSED 127.0.0.1:16379` errors

### ☐ Step 5: Verify Database (2 min)
- [ ] Railway → `PostgreSQL` → Data tab
- [ ] Click "Query" button
- [ ] Run: `SELECT tablename FROM pg_tables WHERE schemaname = 'public';`
- [ ] **MUST SEE**: users, lessons, goals, sprints, reminders, concepts, etc.

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
