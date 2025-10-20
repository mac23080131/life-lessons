# 🚀 Quick Start - Vercel Deployment

## TL;DR - 5 bước nhanh

### 1. Vercel Account
- Vào https://vercel.com
- Login with GitHub

### 2. Import Project
- New Project → Import `mac23080131/life-lessons`
- **Root Directory**: `apps/web` ⭐

### 3. Environment Variable
```
NEXT_PUBLIC_API_BASE_URL=https://life-lessonsapi-production.up.railway.app
```

### 4. Deploy
- Click "Deploy"
- Đợi 2-4 phút

### 5. Update Railway CORS
Trong Railway API service → Variables → Edit `ALLOWED_ORIGINS`:
```
http://localhost:3000,https://YOUR-VERCEL-URL.vercel.app
```

---

## ✅ Done!

**Frontend**: https://YOUR-VERCEL-URL.vercel.app
**Backend**: https://life-lessonsapi-production.up.railway.app

---

**Full guide**: Xem `STEP_3_VERCEL.md` để có hướng dẫn chi tiết từng bước.
