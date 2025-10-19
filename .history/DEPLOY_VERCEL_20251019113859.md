# Vercel Deployment Guide for Life Lessons Frontend

## 🔷 Vercel Setup Instructions

### Step 1: Prepare Next.js for Production

#### Update `next.config.js` for standalone output:

Already configured in `apps/web/next.config.js`:
```javascript
output: 'standalone'
```

### Step 2: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Authorize Vercel to access your repositories

### Step 3: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import your `life-lessons` repository
3. Vercel will auto-detect Next.js

### Step 4: Configure Project Settings

#### Framework Preset
```
Next.js
```

#### Root Directory
```
apps/web
```

#### Build Command (optional - Vercel auto-detects)
```bash
cd apps/web && pnpm install && pnpm build
```

#### Output Directory (auto-detected)
```
.next
```

#### Install Command
```bash
pnpm install
```

### Step 5: Environment Variables

Add these in **Project Settings** → **Environment Variables**:

#### Production Variables
```bash
# API Backend URL (from Railway)
NEXT_PUBLIC_API_BASE_URL=https://your-railway-app.up.railway.app

# Optional: Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_SENTRY_DSN=
```

**⚠️ IMPORTANT**: Replace `your-railway-app.up.railway.app` with your actual Railway API URL!

### Step 6: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~2-3 minutes)
3. Vercel will give you URLs:
   - Production: `https://your-app.vercel.app`
   - Preview: `https://your-app-git-branch.vercel.app`

### Step 7: Update Railway CORS

Now that you have Vercel URL, go back to Railway:

1. Open your **API service** on Railway
2. Go to **Variables** tab
3. Update `ALLOWED_ORIGINS`:
```bash
ALLOWED_ORIGINS=https://your-app.vercel.app,https://your-app-git-main.vercel.app
```
4. Click **"Save"** - Railway will auto-redeploy

### Step 8: Configure Custom Domain (Optional)

#### Add Custom Domain
1. Go to Vercel Project **Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `lifelessons.com`
4. Vercel will provide DNS records

#### DNS Configuration
Add these records to your domain provider:

**For Apex domain** (`lifelessons.com`):
```
A Record
Name: @
Value: 76.76.21.21
```

**For www subdomain** (`www.lifelessons.com`):
```
CNAME Record
Name: www
Value: cname.vercel-dns.com
```

#### Update Railway CORS again
```bash
ALLOWED_ORIGINS=https://lifelessons.com,https://www.lifelessons.com,https://your-app.vercel.app
```

### Step 9: Test Deployment

```bash
# Open in browser
https://your-app.vercel.app

# Test API connection
# Open browser console and check Network tab
# Should see requests to your Railway API URL
```

---

## 🔧 Vercel Configuration Files

### `vercel.json` (Optional - for advanced config)

Create at project root if needed:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "apps/web/$1"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_BASE_URL": "@api-base-url"
  },
  "github": {
    "silent": true
  }
}
```

---

## 🚀 Deployment Features

### Automatic Deployments

- **Production**: Auto-deploy on push to `main` branch
- **Preview**: Auto-deploy for every PR/branch
- **Rollback**: One-click rollback to previous deployment

### Preview Deployments

Every branch/PR gets its own URL:
```
https://your-app-git-feature-branch.vercel.app
```

Perfect for testing before merge!

### Analytics (Built-in)

Vercel provides:
- Web Vitals (LCP, FID, CLS)
- Real User Monitoring
- Edge network metrics

Enable in: **Project Settings** → **Analytics**

---

## 🐛 Troubleshooting

### Build fails: "Cannot find module"

Check `pnpm-workspace.yaml` is correct:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

### API calls fail with CORS error

1. Verify `NEXT_PUBLIC_API_BASE_URL` in Vercel
2. Check `ALLOWED_ORIGINS` in Railway includes Vercel URL
3. Test API directly: `curl https://your-railway-app.up.railway.app/health`

### Environment variable not updating

1. Update variable in Vercel dashboard
2. Go to **Deployments** tab
3. Click **"Redeploy"** on latest deployment
4. Check "Use existing build cache" is OFF

### 404 on page refresh (routing issue)

This shouldn't happen with Next.js App Router, but if it does:
- Verify `output: 'standalone'` in `next.config.js`
- Check Vercel detected Next.js framework correctly

### Build timeout

Increase timeout in `vercel.json`:
```json
{
  "builds": [
    {
      "src": "apps/web/package.json",
      "use": "@vercel/next",
      "config": {
        "maxLambdaSize": "50mb"
      }
    }
  ]
}
```

---

## 💰 Vercel Pricing

- **Hobby (Free)**: 
  - 100GB bandwidth/month
  - Unlimited sites
  - Automatic HTTPS
  - Perfect for personal projects

- **Pro ($20/month)**:
  - 1TB bandwidth
  - Password protection
  - Analytics
  - More build minutes

---

## 🔄 CI/CD Workflow

### Automatic Flow:

```mermaid
Push to GitHub
  ↓
Vercel detects change
  ↓
Builds Next.js app
  ↓
Deploys to Edge Network
  ↓
Live in ~2 minutes!
```

### Manual Deploy:

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from local
cd apps/web
vercel --prod

# Or just push to git
git push origin main
```

---

## 📊 Monitor Deployment

### Check Deployment Status
1. Go to **Deployments** tab
2. Click on latest deployment
3. View:
   - Build logs
   - Function logs
   - Performance metrics

### Enable Logging
```javascript
// apps/web/middleware.ts (if needed)
export function middleware(request) {
  console.log('Request:', request.url);
  return NextResponse.next();
}
```

View logs in: Vercel Dashboard → Functions → Select function → Logs

---

## ✅ Pre-Deploy Checklist

- [ ] `next.config.js` has `output: 'standalone'`
- [ ] Railway API is deployed and healthy
- [ ] Railway API URL copied
- [ ] Vercel project created
- [ ] Root directory set to `apps/web`
- [ ] `NEXT_PUBLIC_API_BASE_URL` configured
- [ ] First deployment successful
- [ ] Railway CORS updated with Vercel URL
- [ ] Test signup/login flow
- [ ] Test create lesson
- [ ] Test AI analyze endpoint

---

## 🎉 Success Criteria

After deployment, you should be able to:

1. ✅ Access frontend at `https://your-app.vercel.app`
2. ✅ Signup new account
3. ✅ Login successfully
4. ✅ Create a new lesson
5. ✅ Analyze lesson (AI endpoint works)
6. ✅ View dashboard with data
7. ✅ Upload avatar in settings
8. ✅ No CORS errors in browser console

---

## 🚀 Advanced: GitHub Actions (Optional)

For additional CI/CD control, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: apps/web
```

---

**Congratulations! Your app is now live! 🎊**

Share your URL: `https://your-app.vercel.app`
