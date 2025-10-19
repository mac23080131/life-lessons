# 🚀 Quick Deploy to Vercel + Railway

## ⚡ Triển khai nhanh trong 15 phút

### Bước 1: Push code lên GitHub (đã xong!)

```bash
# Code đã được commit và ready!
```

### Bước 2: Railway Backend (5 phút)

1. **Vào https://railway.app** → Login with GitHub
2. **New Project** → Add PostgreSQL + Redis
3. **New** → GitHub Repo → Chọn repo này
4. **Variables** → Thêm:
   ```
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   REDIS_URL=${{Redis.REDIS_URL}}
   JWT_SECRET=<chạy: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))">
   ALLOWED_ORIGINS=http://localhost:3000
   ```
5. **Generate Domain** → Copy URL (vd: `https://xxx.up.railway.app`)

### Bước 3: Vercel Frontend (5 phút)

1. **Vào https://vercel.com** → Login with GitHub
2. **Import Project** → Chọn repo này
3. **Root Directory**: `apps/web`
4. **Environment Variables**:
   ```
   NEXT_PUBLIC_API_BASE_URL=<Railway URL từ bước 2>
   ```
5. **Deploy** → Đợi 2-3 phút

### Bước 4: Update CORS (2 phút)

1. Quay lại **Railway** → API service → Variables
2. Update `ALLOWED_ORIGINS`:
   ```
   ALLOWED_ORIGINS=https://your-vercel-app.vercel.app
   ```
3. Save → Auto redeploy

### Bước 5: Seed Data (3 phút)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login và link
railway login
railway link

# Seed database
railway run npx ts-node scripts/seed.ts
```

---

## ✅ Xong! Test ngay

- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-app.up.railway.app/api/docs`
- **Demo account**: `demo@lifelessons.app` / `Passw0rd!`

---

## 📚 Chi tiết hơn?

- Railway: [`DEPLOY_RAILWAY.md`](./DEPLOY_RAILWAY.md)
- Vercel: [`DEPLOY_VERCEL.md`](./DEPLOY_VERCEL.md)
- Toàn bộ: [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md)
- Commands: [`RAILWAY_COMMANDS.md`](./RAILWAY_COMMANDS.md)

---

## 🆘 Lỗi?

**CORS error**: Kiểm tra `ALLOWED_ORIGINS` trong Railway có Vercel URL chưa

**Build failed**: Xem logs → Thường là thiếu environment variable

**Database empty**: Chạy `railway run npx prisma migrate deploy`

---

**Cost**: Miễn phí (Railway $5 credit/tháng + Vercel free tier)
