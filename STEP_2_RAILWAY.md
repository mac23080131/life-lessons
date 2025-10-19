# 🚂 Railway Deployment - Step by Step Guide

## ⚠️ BUILD ERRORS FIXED!

✅ **TypeScript errors đã được fix và push lên GitHub!**

Railway sẽ tự động rebuild trong vài phút.

Nếu đang deploy, đợi Railway detect changes và auto-redeploy.

---

## 📋 Checklist

- [x] Step 2.1: Create Railway Account
- [x] Step 2.2: Create New Project
- [x] Step 2.3: Add PostgreSQL Database
- [x] Step 2.4: Add Redis Cache
- [x] Step 2.5: Deploy API from GitHub
- [x] Step 2.6: Configure Environment Variables
- [x] Step 2.7: Generate Domain
- [x] Step 2.8: Test API Health ✅ API đang chạy!
- [x] Step 2.9: Run Database Migrations ✅ Đã chạy trong Dockerfile
- [ ] Step 2.10: Seed Initial Data (Optional - có thể tạo user qua API)

**🎉 API URL**: https://life-lessonsapi-production.up.railway.app
**📚 Swagger Docs**: https://life-lessonsapi-production.up.railway.app/docs

---

## Step 2.1: Create Railway Account ✅

### Actions:

1. **Mở browser** → https://railway.app
2. **Click "Login with GitHub"**
3. **Authorize Railway** khi GitHub hỏi
4. Railway sẽ redirect về dashboard

**✅ Done? Tick checkbox phía trên và tiếp tục Step 2.2**

---

## Step 2.2: Create New Project ✅

### Actions:

1. Trong Railway dashboard, **Click "New Project"**
2. Railway sẽ hiển thị nhiều options
3. **Chưa chọn gì** - đọc Step 2.3 trước!

**✅ Done? Tiếp tục Step 2.3**

---

## Step 2.3: Add PostgreSQL Database ⭐ QUAN TRỌNG

### Actions:

1. Trong project vừa tạo, **Click "+ New"**
2. Chọn **"Database"**
3. Chọn **"Add PostgreSQL"**
4. Railway tự động tạo database
5. **Đợi** cho đến khi thấy:
   - Status: ✅ Active (màu xanh)
   - Icon database hiển thị

### Verify:

- Click vào PostgreSQL service
- Tab "Connect" → thấy `DATABASE_URL`
- **Không cần copy** - sẽ dùng reference sau

**✅ Done? Database Active? Tiếp tục Step 2.4**

---

## Step 2.4: Add Redis Cache ⭐ QUAN TRỌNG

### Actions:

1. Trong cùng project, **Click "+ New"** lần nữa
2. Chọn **"Database"**
3. Chọn **"Add Redis"**
4. Railway tự động tạo Redis
5. **Đợi** status: ✅ Active

### Verify:

- Click vào Redis service
- Tab "Connect" → thấy `REDIS_URL`

**✅ Done? Redis Active? Tiếp tục Step 2.5**

---

## Step 2.5: Deploy API from GitHub ⭐ QUAN TRỌNG

### Actions:

1. **Click "+ New"** lần nữa
2. Chọn **"GitHub Repo"**
3. Tìm và chọn: **mac23080131/life-lessons**
4. Railway sẽ bắt đầu scan repository
5. Railway tự động phát hiện `apps/api/Dockerfile`
6. **Đợi** build complete (~3-5 phút)

### Troubleshooting:

**Nếu build fails:**
- Check logs để xem lỗi
- Thường do thiếu dependencies hoặc Dockerfile path sai

**Nếu không thấy Dockerfile:**
- Vào Settings của service
- Set "Dockerfile Path" = `apps/api/Dockerfile`
- Redeploy

**✅ Done? Build success? Tiếp tục Step 2.6**

---

## Step 2.6: Configure Environment Variables ⭐⭐⭐ RẤT QUAN TRỌNG

### Actions:

1. **Click vào API service** (không phải DB)
2. **Click tab "Variables"**
3. **Add từng variable** như bên dưới:

### Variable List (Copy-Paste từng dòng):

```bash
NODE_ENV=production
```
👆 Click "Add Variable" → Paste → Save

```bash
PORT=3001
```
👆 Add → Save

```bash
TZ=Asia/Bangkok
```
👆 Add → Save

### Database & Redis References (QUAN TRỌNG!):

**Cho DATABASE_URL:**
1. Click "New Variable"
2. Variable name: `DATABASE_URL`
3. **KHÔNG paste text** - Click **"Add Reference"**
4. Chọn service: **PostgreSQL**
5. Chọn variable: `DATABASE_URL`
6. Save

**Cho REDIS_URL:**
1. Click "New Variable"
2. Variable name: `REDIS_URL`
3. Click **"Add Reference"**
4. Chọn service: **Redis**
5. Chọn variable: `REDIS_URL`
6. Save

### Auth Variables:

**JWT_SECRET** (CRITICAL!):
```bash
JWT_SECRET=m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
```
👆 **COPY DÃY NÀY CHÍNH XÁC** - Đã generate sẵn cho bạn!

```bash
JWT_EXPIRES_IN=15m
```
👆 Add → Save

```bash
JWT_REFRESH_EXPIRES_IN=7d
```
👆 Add → Save

### CORS (Temporary):

```bash
ALLOWED_ORIGINS=http://localhost:3000
```
👆 Add → Save (sẽ update sau khi có Vercel URL)

### Verify:

Sau khi add xong, bạn phải có **9 variables**:
- [x] NODE_ENV
- [x] PORT
- [x] TZ
- [x] DATABASE_URL (reference)
- [x] REDIS_URL (reference)
- [x] JWT_SECRET
- [x] JWT_EXPIRES_IN
- [x] JWT_REFRESH_EXPIRES_IN
- [x] ALLOWED_ORIGINS

**⚠️ Railway sẽ auto-redeploy sau khi save variables!**

**✅ Done? 9 variables added? Tiếp tục Step 2.7**

---

## Step 2.7: Generate Domain ⭐ QUAN TRỌNG

### Actions:

1. Vẫn trong **API service**
2. Click tab **"Settings"**
3. Scroll xuống phần **"Networking"**
4. Click **"Generate Domain"**
5. Railway sẽ tạo URL dạng:
   ```
   https://life-lessons-production-xxxx.up.railway.app
   ```
   life-lessonsapi-production.up.railway.app
6. **COPY URL NÀY** → Lưu vào notepad!

### ⚠️ LƯU URL NÀY:

```
YOUR RAILWAY API URL: ___________________________________
```
👆 Viết vào đây hoặc notepad!

**✅ Done? URL copied? Tiếp tục Step 2.8**

---

## Step 2.8: Test API Health ✅

### Actions:

**Option A - Browser:**
1. Mở browser
2. Paste URL: `https://your-railway-url.up.railway.app/api/health`
3. Phải thấy: `{"status":"ok",...}`

**Option B - PowerShell:**
```powershell
# Thay your-url bằng Railway URL của bạn
curl https://your-railway-url.up.railway.app/api/health
```

### Expected Response:

```json
{
  "status": "ok",
  "timestamp": "2025-10-19T..."
}
```

### Troubleshooting:

**Nếu 404 hoặc 502:**
- Service chưa start xong → Đợi 1-2 phút
- Check Deployments tab → Xem logs

**Nếu 500 Internal Error:**
- Database connection issue
- Check Variables → DATABASE_URL referenced đúng chưa

**✅ Done? Health check OK? Tiếp tục Step 2.9**

---

## Step 2.9: Run Database Migrations ⭐ QUAN TRỌNG

### Prerequisites:

**Install Railway CLI** (chạy local):
```powershell
npm install -g @railway/cli
```

### Actions:

```powershell
# 1. Login to Railway
railway login
# Browser sẽ mở → Click "Authorize"

# 2. Link to your project
railway link
# Chọn project: life-lessons

# 3. Run migrations
railway run npx prisma migrate deploy

# Expect: "Applied XX migrations"
```

### Troubleshooting:

**Nếu "No migrations found":**
- Migrations đã chạy rồi (từ Dockerfile CMD)
- Check trong Postgres có tables chưa:
  ```powershell
  railway connect Postgres
  \dt
  ```

**✅ Done? Migrations applied? Tiếp tục Step 2.10**

---

## Step 2.10: Seed Initial Data 🌱

### Actions:

```powershell
# Seed demo user + concepts
railway run npx ts-node scripts/seed.ts

# Expect: "✓ Seeded..."
```

### Verify:

```powershell
# Test login với demo account
curl -X POST https://your-railway-url.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"demo@lifelessons.app\",\"password\":\"Passw0rd!\"}"

# Expect: {"access_token":"..."}
```

**✅ Done? Seed successful? STEP 2 COMPLETE! 🎉**

---

## 🎊 Step 2 Complete!

### You now have:

- ✅ Railway Project created
- ✅ PostgreSQL database running
- ✅ Redis cache running
- ✅ Backend API deployed
- ✅ Environment variables configured
- ✅ Domain generated
- ✅ Health check passing
- ✅ Database migrated
- ✅ Demo data seeded

### Your API URL:

```
https://your-railway-url.up.railway.app
```

### Next Step:

**👉 Continue to Step 3: Deploy Frontend to Vercel**

File: `STEP_3_VERCEL.md`

---

## 📞 Need Help?

**Common Issues:**

1. **Build failed** → Check Dockerfile path in Settings
2. **Database connection error** → Verify DATABASE_URL reference
3. **CORS error** → Will fix in Step 4 after Vercel deploy
4. **Migrations fail** → Check Postgres service is Active

**Railway Support:**
- Dashboard: https://railway.app/dashboard
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

---

**Current Progress**: 2/4 Steps Complete (50%) ⭐⭐☆☆
