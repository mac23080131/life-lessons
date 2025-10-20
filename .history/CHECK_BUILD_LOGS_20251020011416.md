# 🔍 Next Steps: Check Build Logs

## Dockerfile CMD is CORRECT ✅

```dockerfile
CMD ["sh", "-c", "npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js"]
```

**But migrations still not running!**

---

## 🚨 URGENT ACTIONS

### 1. Check Railway BUILD Logs (Not Deploy Logs)

**Vấn đề có thể ở BUILD phase:**

1. **Railway Dashboard** → **@life-lessons/api**
2. **Click tab "Deployments"**
3. **Click vào deployment mới nhất** (7b6e4055 hoặc mới hơn)
4. **Click "View Logs"** hoặc tab **"Build Logs"** (NOT Deploy Logs)

**Tìm:**
- ❌ Prisma generation errors
- ❌ Migration failures during build
- ❌ Schema errors

---

### 2. Check DEPLOY Logs at Startup

**In current "Deploy Logs" (đang xem), scroll UP to top:**

Tìm dòng đầu tiên khi app start:
```bash
sh -c npx prisma migrate deploy --schema=/app/prisma/schema.prisma && node dist/main.js
```

**Expected to see:**
```
Environment variables loaded from .env
Prisma schema loaded from /app/prisma/schema.prisma
Datasource "db": PostgreSQL database "railway", schema "public"

Applying migration `20251017044345_init`
Applying migration `20251018130920_add_group_lessons`
...
✔ Applied 4 migrations
```

**If you see ERROR instead:**
- Copy error message
- Send to me

---

### 3. Manual Trigger (If migrations skipped)

**Possible: Migrations already applied but tables dropped/missing**

**Force rerun migrations:**

#### Option A: Redeploy with Fresh DB (DESTRUCTIVE)

1. Railway → PostgreSQL service → Settings
2. Scroll down → **"Delete Service"** (⚠️ WARNING: Loses all data)
3. Add PostgreSQL again
4. Update `DATABASE_URL` reference in API service
5. Redeploy API

#### Option B: Reset migrations (via Railway Shell if available)

If Railway provides shell access:
```bash
cd /app
npx prisma migrate reset --force
npx prisma migrate deploy
```

#### Option C: Manual SQL (Advanced)

Connect to Railway Postgres and run:
```sql
-- Check if tables exist
\dt

-- If no tables, manually create from schema
-- (Not recommended - better to fix migration)
```

---

### 4. Workaround: Add migrate to package.json scripts

**Ensure migration runs during build:**

File: `apps/api/package.json`

```json
{
  "scripts": {
    "prebuild": "prisma generate",
    "build": "nest build",
    "start:prod": "prisma migrate deploy && node dist/main.js"
  }
}
```

Then update Dockerfile CMD:
```dockerfile
CMD ["pnpm", "start:prod"]
```

---

## 🎯 WHAT TO DO NOW

### Immediate Action:

1. **Scroll UP** in current Railway Deploy Logs
2. **Find the FIRST lines** when app starts
3. **Look for**:
   ```
   npx prisma migrate deploy
   ```
4. **Check if**:
   - ✅ Migrations applied successfully
   - ❌ Migration error occurred
   - ❌ Command skipped entirely

5. **Screenshot or copy** those lines and send to me

---

### Alternative Quick Test:

**Delete PostgreSQL and recreate:**

1. Railway → Postgres → Settings → Delete (⚠️ loses data)
2. Add new PostgreSQL
3. Update DATABASE_URL reference
4. Redeploy API
5. Check if tables created

---

**Please check BUILD logs or scroll to top of DEPLOY logs!** 📋

Send me what you find at the start of the logs.
