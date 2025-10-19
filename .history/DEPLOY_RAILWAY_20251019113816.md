# Railway Deployment Guide for Life Lessons Backend

## 🚂 Railway Setup Instructions

### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Authorize Railway to access your repository

### Step 2: Create New Project

#### A. Create PostgreSQL Database
1. Click **"New Project"**
2. Select **"Provision PostgreSQL"**
3. Railway will automatically create a database
4. Copy the `DATABASE_URL` from Variables tab

#### B. Create Redis Service
1. In your project, click **"+ New"**
2. Select **"Database"** → **"Add Redis"**
3. Railway will provision Redis
4. Copy the `REDIS_URL` from Variables tab

#### C. Deploy Backend API
1. Click **"+ New"** → **"GitHub Repo"**
2. Select your `life-lessons` repository
3. Railway will detect the Dockerfile

### Step 3: Configure Backend Service

#### Root Directory & Build Settings
```
Root Directory: /
Dockerfile Path: apps/api/Dockerfile
```

#### Environment Variables (Add in Variables tab)
```bash
# Node
NODE_ENV=production
PORT=3001

# Database (auto-filled by Railway if linked)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (auto-filled by Railway if linked)
REDIS_URL=${{Redis.REDIS_URL}}

# Auth - IMPORTANT: Generate strong secret!
JWT_SECRET=<paste-your-generated-secret-here>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS - Will update after Vercel deploy
ALLOWED_ORIGINS=https://your-vercel-app.vercel.app

# Optional
TZ=Asia/Bangkok
```

#### Generate JWT Secret (run locally):
```powershell
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Step 4: Link Services (Important!)

1. Click on **API service** settings
2. Go to **"Variables"** tab
3. Click **"+ Variable Reference"**
4. Add references:
   - `DATABASE_URL` → Link to PostgreSQL service
   - `REDIS_URL` → Link to Redis service

### Step 5: Deploy Settings

#### Build Command (auto-detected from Dockerfile)
```bash
docker build -f apps/api/Dockerfile .
```

#### Health Check Path
```
/health
```

#### Deployment Trigger
- Enable: **"Automatically deploy on push to main"**

### Step 6: Get API URL

After deployment succeeds:
1. Go to **Settings** → **"Networking"**
2. Click **"Generate Domain"**
3. Your API will be available at: `https://your-app-name.up.railway.app`
4. **Copy this URL** - you'll need it for Vercel frontend

### Step 7: Test API

```bash
# Test health endpoint
curl https://your-app-name.up.railway.app/health

# Should return: {"status":"ok"}
```

### Step 8: Run Database Seed (Optional)

1. Go to your API service
2. Click **"Deployments"** → latest deployment
3. Click **"View Logs"**
4. Or use Railway CLI:

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to project
railway link

# Run seed
railway run npm run seed
```

---

## 🔧 Troubleshooting

### Build fails with "Cannot find module"
- Check `pnpm-lock.yaml` is committed
- Verify Dockerfile paths are correct
- Check Railway build logs for errors

### Database connection error
- Verify `DATABASE_URL` is properly linked
- Check database service is running
- Ensure migrations ran successfully

### Prisma migration fails
- Check `CMD` in Dockerfile runs `prisma migrate deploy`
- View deployment logs for migration errors
- May need to run manually: `railway run npx prisma migrate deploy`

### CORS errors after deploy
- Update `ALLOWED_ORIGINS` in Railway variables
- Must include your Vercel domain
- Restart API service after changing variables

---

## 💰 Railway Pricing

- **Free tier**: $5 credit/month
- **Usage-based**: ~$0.000463/GB-hour for memory
- **Estimated cost**: $5-20/month depending on usage

**Pro tips:**
- Free tier is enough for development/low traffic
- Upgrade to Hobby plan ($5/month) for production
- Database backups included in paid plans

---

## 🔄 CI/CD (Auto Deploy)

Railway automatically deploys when you push to GitHub:

```bash
git add .
git commit -m "Update backend"
git push origin main
# Railway will auto-deploy!
```

---

## 📊 Monitor Deployment

1. **Logs**: Click service → Deployments → View Logs
2. **Metrics**: Check CPU, Memory, Network usage
3. **Health**: Enable health checks at `/health`

---

## ✅ Pre-Deploy Checklist

- [ ] `apps/api/Dockerfile` created
- [ ] Strong `JWT_SECRET` generated
- [ ] Railway project created
- [ ] PostgreSQL database provisioned
- [ ] Redis database provisioned
- [ ] Environment variables configured
- [ ] Services linked (DATABASE_URL, REDIS_URL)
- [ ] Domain generated
- [ ] Health check endpoint works

---

**Next Step**: After backend is live, copy the Railway URL and deploy frontend to Vercel! 🚀
