# 🐛 Debug Migrations Still Not Working

**Status**: Database vẫn chỉ có `_prisma_migrations` table  
**Issue**: Migrations không apply mặc dù đã fix Dockerfile  
**Next Steps**: Debug và force manual migration  

---

## 🔍 Current Situation

### Database State
```
✅ _prisma_migrations (Prisma's internal tracking table)
❌ No other tables (users, lessons, goals, etc.)
```

This means:
- ✅ Prisma CAN connect to database
- ✅ Prisma migration table was created
- ❌ But actual migrations didn't run

---

## 🎯 Possible Causes

### 1. Migrations Still Not in Docker Image
Despite the fix, Railway build might not have picked up the change.

### 2. Migrations Failed Silently
Migrations might be there but failing during `prisma migrate deploy`.

### 3. Path Resolution Issue
The `--schema=../../prisma/schema.prisma` path might be wrong in container.

### 4. Railway Build Cache
Railway might be using cached layers that don't include migrations.

---

## 🔧 Debug Steps

### Step 1: Check Latest Railway Logs

Go to Railway → service → Deployments → Latest deployment → Logs

Look for these specific lines:

```bash
# What we need to see:
✅ Prisma schema loaded from ../../prisma/schema.prisma
✅ 6 migrations found in prisma/migrations        ← CRITICAL!
✅ Applying migration `20251017044345_init`

# What indicates problem:
❌ No migration found in prisma/migrations
❌ ERROR: Migration failed
❌ Error: P3009 - Migration failed to apply
```

**Action**: Copy the FULL startup logs and share them.

---

### Step 2: Verify Build Picked Up Changes

Check Railway deployment:
- Deployment should show commit `dca9640`
- Build time should be recent (within last 10 min)
- Status should be "Success" not "Failed"

---

### Step 3: Force Manual Migration (If Needed)

If migrations are in image but not running automatically, we can force them:

#### Option A: SSH into Railway Container
```bash
# Install Railway CLI (if not installed)
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# SSH into container
railway run bash

# Once inside, check if migrations exist:
ls -la /app/prisma/migrations/
# Should show: 6 migration folders

# Manually run migrations:
cd /app
pnpm --filter api exec prisma migrate deploy --schema=../../prisma/schema.prisma
```

#### Option B: Use Railway Run Command
```bash
# From local terminal
railway run pnpm --filter api exec prisma migrate deploy --schema=../../prisma/schema.prisma
```

---

### Step 4: Alternative Fix - Use Absolute Path

If path resolution is the issue, we can try absolute path:

**Update apps/api/package.json**:
```json
{
  "scripts": {
    "start": "prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"
  }
}
```

**Update Dockerfile** to ensure prisma is at `/app/prisma`:
```dockerfile
# Already should be correct, but verify:
COPY prisma /app/prisma
```

---

### Step 5: Nuclear Option - Prisma Push

If migrate continues to fail, we can use `prisma db push` instead:

**Create new start script**:
```json
{
  "scripts": {
    "start": "prisma db push --schema=../../prisma/schema.prisma --accept-data-loss && node dist/main.js"
  }
}
```

This will:
- Create all tables based on schema
- Skip migration files entirely
- WARNING: Not recommended for production, but works as emergency fix

---

## 🚨 Immediate Action Plan

### Priority 1: Get Railway Logs
```
1. Go to Railway Dashboard
2. Click on API service
3. Click "Deployments" tab
4. Click latest deployment
5. Click "View Logs"
6. Copy startup logs (especially lines about Prisma/migrations)
```

### Priority 2: Check if Migrations in Container
```bash
# Install Railway CLI if needed
npm install -g @railway/cli

# Login and link
railway login
railway link

# Check migrations exist
railway run ls -la /app/prisma/migrations/

# Expected output:
# 20251017044345_init/
# 20251018130920_add_group_lessons/
# ... (6 folders total)
```

### Priority 3: Force Migration
```bash
# If migrations exist in container:
railway run pnpm --filter api exec prisma migrate deploy --schema=/app/prisma/schema.prisma

# Watch output for errors
```

---

## 📊 Verification Commands

After any fix attempt, verify with:

```sql
-- In Railway Postgres Data tab
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Should return 18 tables, not just 1
```

---

## 🔄 Alternative: Reset and Resync

If all else fails, we can:

1. **Delete _prisma_migrations table**:
```sql
DROP TABLE IF EXISTS "_prisma_migrations";
```

2. **Use prisma db push** (one-time):
```bash
railway run pnpm --filter api exec prisma db push --schema=/app/prisma/schema.prisma --accept-data-loss
```

3. **Then mark migrations as applied**:
```bash
railway run pnpm --filter api exec prisma migrate resolve --applied 20251017044345_init --schema=/app/prisma/schema.prisma
# Repeat for all 6 migrations
```

---

## 📝 Next Message

Please provide:

1. ✅ Railway deployment logs (especially Prisma startup lines)
2. ✅ Confirmation that deployment commit is `dca9640`
3. ✅ Result of: `railway run ls -la /app/prisma/migrations/`

This will tell us exactly what's wrong!

---

**Created**: 2025-10-20 01:45 UTC  
**Status**: ⏳ Awaiting logs to debug
