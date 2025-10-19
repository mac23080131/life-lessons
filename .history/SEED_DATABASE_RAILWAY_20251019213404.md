# 🌱 Seed Database trên Railway

## Vấn đề
Database chưa có demo user nên login fail với 500 Internal Server Error.

## Solution: Seed via Railway Shell

### Bước 1: Vào Railway Dashboard
1. Mở https://railway.app/dashboard
2. Click project: **sparkling-nourishment**
3. Click service: **life-lessons/api**

### Bước 2: Mở Railway Shell
1. Click tab **"Settings"**
2. Scroll down → phần **"Service"**
3. Click **"Deploy"** dropdown (hoặc tìm option **"Shell"** / **"Terminal"**)
4. Hoặc vào tab **"Deployments"** → Click deployment mới nhất → **"View Logs"** → tìm option **"Open Shell"**

### Bước 3: Run Seed Command

Trong Railway shell, chạy:

```bash
cd /app
pnpm ts-node scripts/seed.ts
```

Hoặc nếu không có pnpm:

```bash
cd /app
node scripts/seed.js
```

Hoặc chạy trực tiếp từ apps/api:

```bash
cd /app/apps/api
node dist/main.js --seed
```

### Expected Output:
```
🌱 Seeding database...
✅ Created demo user: demo@lifelessons.app
✅ Created 12 sample lessons
✅ Seeded 1000+ concepts
✅ Seed complete!
```

---

## Alternative: Seed từ Local (Railway CLI)

Nếu Railway shell không có, dùng Railway CLI từ local:

### Prerequisites:
```powershell
# Đã cài Railway CLI rồi
railway link  # Đã link rồi
```

### Run seed:
```powershell
# Option 1: Run via Railway env
railway run pnpm ts-node scripts/seed.ts

# Option 2: Connect to Railway Postgres trực tiếp
railway run pnpm prisma db seed
```

### Expected Error (KNOWN):
Nếu thấy lỗi:
```
Can't reach database server at `postgres.railway.internal:5432`
```

→ **Đây là do local không kết nối được internal network Railway.**

### Workaround:
1. Copy file `scripts/seed.ts` vào Railway service
2. Add command vào Dockerfile:
   ```dockerfile
   CMD ["sh", "-c", "npx ts-node /app/scripts/seed.ts && node dist/main.js"]
   ```
3. Redeploy Railway

---

## 🎯 Recommendation: Tạo user mới qua Signup

**NHANH NHẤT** là tạo user mới:

1. Vào https://life-lessons-web.vercel.app/signup
2. Đăng ký user mới
3. Login với user vừa tạo
4. Concepts sẽ được seed tự động khi cần (hoặc skip)

Sau đó có thể seed concepts sau nếu muốn.

---

**Bạn muốn cách nào?** 
1. Tạo user mới qua signup (1 phút) ✅ RECOMMEND
2. Seed từ Railway shell (3-5 phút)
3. Seed từ local Railway CLI (có thể fail)
