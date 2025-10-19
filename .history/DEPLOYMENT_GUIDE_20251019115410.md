# 🚀 Complete Deployment Guide: Vercel + Railway

## 📋 Overview

Triển khai **Life Lessons App** với:
- **Frontend**: Vercel (Next.js)
- **Backend**: Railway (NestJS)
- **Database**: Railway PostgreSQL
- **Cache**: Railway Redis

**Total time**: ~30 phút  
**Cost**: Miễn phí (free tier)

---

## ✅ Prerequisites

- [ ] GitHub account
- [ ] Railway account ([railway.app](https://railway.app))
- [ ] Vercel account ([vercel.com](https://vercel.com))
- [ ] Code pushed to GitHub repository

---

## 🎯 Step-by-Step Deployment

### Phase 1: Railway Backend (20 phút)

#### 1.1 Create Railway Project

```bash
1. Vào https://railway.app
2. Login with GitHub
3. Click "New Project"
```

#### 1.2 Add PostgreSQL

```bash
1. Click "New" → "Database" → "Add PostgreSQL"
2. Railway tự động tạo database
3. Click vào service → Tab "Connect"
4. Copy DATABASE_URL (dạng postgresql://...)
```

#### 1.3 Add Redis

```bash
1. Click "New" → "Database" → "Add Redis"
2. Railway tự động tạo Redis
3. Copy REDIS_URL (dạng redis://...)
```

#### 1.4 Deploy Backend API

```bash
1. Click "New" → "GitHub Repo"
2. Select "life-lessons" repository
3. Railway sẽ scan và phát hiện Dockerfile
```

#### 1.5 Configure Backend Service

**Settings Tab:**
```yaml
Service Name: lifelessons-api
Root Directory: /
Dockerfile Path: apps/api/Dockerfile
```

**Variables Tab** - Add these:

```bash
# Copy-paste toàn bộ vào Railway Variables:

NODE_ENV=production
PORT=3001
TZ=Asia/Bangkok

# Database (link từ PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (link từ Redis service)
REDIS_URL=${{Redis.REDIS_URL}}

# Auth - Generate strong secret!
JWT_SECRET=<PASTE_SECRET_HERE>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS - Sẽ update sau khi có Vercel URL
ALLOWED_ORIGINS=http://localhost:3000
```

**Generate JWT Secret** (chạy trong PowerShell local):
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copy output và paste vào `JWT_SECRET`

#### 1.6 Link Services (QUAN TRỌNG!)

```bash
1. Trong API service → Variables tab
2. Thay ${{Postgres.DATABASE_URL}} và ${{Redis.REDIS_URL}} 
   bằng "Variable Reference" (nút + Variable)
3. Select service tương ứng
```

#### 1.7 Generate Domain

```bash
1. API Service → Settings → Networking
2. Click "Generate Domain"
3. Copy URL: https://lifelessons-api-production-xxxx.up.railway.app
4. Save URL này - cần cho Vercel!
```

#### 1.8 Verify Deployment

```bash
# Test health endpoint
curl https://your-railway-url.up.railway.app/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

✅ **Railway Backend Done!**

---

### Phase 2: Vercel Frontend (10 phút)

#### 2.1 Import Project

```bash
1. Vào https://vercel.com
2. Login with GitHub
3. Click "Add New..." → "Project"
4. Select "life-lessons" repository
5. Click "Import"
```

#### 2.2 Configure Build Settings

```yaml
Framework Preset: Next.js
Root Directory: apps/web
Build Command: pnpm build (auto-detected)
Output Directory: .next (auto-detected)
Install Command: pnpm install
```

#### 2.3 Environment Variables

Click **"Environment Variables"**, add:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-railway-url.up.railway.app
```

**⚠️ Thay `your-railway-url` bằng Railway URL thật từ Phase 1.7!**

#### 2.4 Deploy

```bash
1. Click "Deploy"
2. Đợi 2-3 phút build
3. Success! 🎉
```

#### 2.5 Get Vercel URL

```bash
Vercel sẽ cho 2 URLs:
- Production: https://life-lessons-xxxx.vercel.app
- Git branch: https://life-lessons-git-main-xxxx.vercel.app

Copy cả 2 URLs!
```

✅ **Vercel Frontend Done!**

---

### Phase 3: Update CORS (5 phút)

#### 3.1 Update Railway CORS

```bash
1. Quay lại Railway → API Service
2. Variables tab
3. Tìm ALLOWED_ORIGINS
4. Update thành:

ALLOWED_ORIGINS=https://life-lessons-xxxx.vercel.app,https://life-lessons-git-main-xxxx.vercel.app

5. Click "Save" → Railway auto-redeploy
```

#### 3.2 Wait for Redeploy

```bash
Đợi ~2 phút Railway redeploy với CORS mới
```

---

### Phase 4: Seed Data & Test (5 phút)

#### 4.1 Run Database Seed

**Option A: Railway Dashboard**
```bash
1. API Service → Deployments tab
2. Click latest deployment → 3 dots
3. "View Logs" → check migrations ran
```

**Option B: Railway CLI** (khuyến nghị)
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Run seed
railway run npx ts-node scripts/seed.ts
```

#### 4.2 Test Full Flow

```bash
1. Mở https://life-lessons-xxxx.vercel.app
2. Click "Sign Up"
3. Tạo account: test@example.com / Password123!
4. Login thành công → Dashboard
5. Click "Quick Capture" → Tạo lesson
6. Nội dung: "Hôm nay học được Docker rất hay"
7. Click "Save" → Success!
8. Click "Analyze" → AI analysis xuất hiện
9. Check Network tab → No CORS errors ✅
```

---

## 🎉 Success Checklist

- [ ] Railway PostgreSQL running
- [ ] Railway Redis running
- [ ] Railway API deployed & healthy
- [ ] Vercel frontend deployed
- [ ] CORS configured correctly
- [ ] Can signup new user
- [ ] Can login
- [ ] Can create lesson
- [ ] AI analyze works
- [ ] Dashboard loads data
- [ ] No console errors

---

## 🐛 Troubleshooting

### "CORS error" in browser console

**Problem**: Frontend can't reach backend

**Solution**:
```bash
1. Check ALLOWED_ORIGINS in Railway has Vercel URL
2. Verify Vercel has correct NEXT_PUBLIC_API_BASE_URL
3. Redeploy both services
```

### "Database connection error"

**Problem**: Prisma can't connect to DB

**Solution**:
```bash
1. Railway → PostgreSQL service → Check status (running?)
2. API service → Variables → Verify DATABASE_URL linked correctly
3. View logs: Check for migration errors
```

### "Build failed" on Railway

**Problem**: Docker build error

**Solution**:
```bash
1. Check Dockerfile path: apps/api/Dockerfile
2. Verify pnpm-lock.yaml committed to git
3. View build logs for specific error
4. Try: Click "Redeploy" → "Clear cache and retry"
```

### "Build failed" on Vercel

**Problem**: Next.js build error

**Solution**:
```bash
1. Check Root Directory: apps/web
2. Verify all dependencies in package.json
3. Test build locally: cd apps/web && pnpm build
4. Check Vercel build logs for errors
```

### Migrations not running

**Problem**: Database empty

**Solution**:
```bash
# Manual migration via Railway CLI
railway link
railway run npx prisma migrate deploy

# Or check Dockerfile CMD runs migrations
CMD ["sh", "-c", "cd prisma && npx prisma migrate deploy && ..."]
```

---

## 💰 Cost Breakdown

| Service | Free Tier | Usage Estimate |
|---------|-----------|----------------|
| **Railway** | $5 credit/month | $5-10/month |
| - PostgreSQL | Included | ~100MB storage |
| - Redis | Included | ~10MB storage |
| - API | Included | ~500MB RAM |
| **Vercel** | 100GB bandwidth | Free (hobby) |
| **Total** | **$0-5/month** | Development/Low traffic |

**Tips:**
- Free tier đủ cho development + demo
- Production: Upgrade Railway to $5/month minimum

---

## 🔄 Auto-Deploy Workflow

### Cách deploy updates:

```bash
# 1. Make changes locally
git add .
git commit -m "Update feature X"

# 2. Push to GitHub
git push origin main

# 3. Wait ~3-5 minutes
# - Railway auto-detects push → rebuilds API
# - Vercel auto-detects push → rebuilds frontend

# 4. Done! Changes live
```

---

## 📊 Monitoring

### Railway Monitoring

```bash
1. Dashboard → Services → Click service
2. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Deployment history
   - Logs (real-time)
```

### Vercel Analytics

```bash
1. Project → Analytics tab
2. Enable: "Audiences" (free)
3. View:
   - Page views
   - Top pages
   - Real-time visitors
   - Web Vitals (LCP, FID, CLS)
```

---

## 🔒 Security Hardening

### Railway API

```bash
# Add these variables for production:

# Rate limiting (already in code)
THROTTLE_TTL=60
THROTTLE_LIMIT=100

# Helmet security headers (already in code)
# No additional config needed

# Database SSL (Railway auto-enables)
# Already secure by default
```

### Vercel Headers

Create `apps/web/next.config.js` (already has):
```javascript
async headers() {
  return [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    },
  ];
}
```

---

## 🎓 Next Steps

### Short-term
- [ ] Add custom domain (Vercel: $20/year)
- [ ] Setup monitoring alerts (Railway webhooks)
- [ ] Configure backups (Railway auto-backup in paid)
- [ ] Add error tracking (Sentry.io free tier)

### Mid-term
- [ ] Enable Vercel Analytics Pro ($20/month)
- [ ] Upgrade Railway to Hobby ($5/month)
- [ ] Setup staging environment (separate Railway project)
- [ ] Add CI/CD tests (GitHub Actions)

### Long-term
- [ ] CDN for uploads (Cloudinary/S3)
- [ ] Email service (SendGrid/Resend)
- [ ] Push notifications (OneSignal)
- [ ] Database replicas (Railway Pro)

---

## 📞 Support & Resources

### Railway
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel
- Docs: https://vercel.com/docs
- Discord: https://discord.gg/vercel
- Status: https://vercel-status.com

---

## ✨ Congratulations!

🎉 **Your Life Lessons App is now LIVE!**

**Share your app:**
- Production URL: `https://your-app.vercel.app`
- Backend API: `https://your-api.up.railway.app`
- API Docs: `https://your-api.up.railway.app/api/docs`

**Demo credentials** (if you seeded):
- Email: `demo@lifelessons.app`
- Password: `Passw0rd!`

---

**Need help?** Check detailed guides:
- Railway: [`DEPLOY_RAILWAY.md`](./DEPLOY_RAILWAY.md)
- Vercel: [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)
