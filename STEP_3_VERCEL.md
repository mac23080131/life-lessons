# 🚀 Vercel Deployment - Step by Step Guide

## 📋 Checklist

- [ ] Step 3.1: Create Vercel Account
- [ ] Step 3.2: Import GitHub Repository
- [ ] Step 3.3: Configure Build Settings
- [ ] Step 3.4: Configure Environment Variables
- [ ] Step 3.5: Deploy Frontend
- [ ] Step 3.6: Get Vercel URL
- [ ] Step 3.7: Update Railway CORS
- [ ] Step 3.8: Test Full App

---

## Step 3.1: Create Vercel Account ⭐

### Actions:

1. **Mở browser** → https://vercel.com
2. **Click "Sign Up"** hoặc **"Start Deploying"**
3. **Choose "Continue with GitHub"**
4. **Authorize Vercel** khi GitHub hỏi
5. Vercel sẽ redirect về dashboard

**✅ Done? Continue to Step 3.2**

---

## Step 3.2: Import GitHub Repository ⭐⭐⭐

### Actions:

1. Trong Vercel dashboard, **Click "Add New..."** → **"Project"**
2. **Import Git Repository** section
3. Tìm repository: **mac23080131/life-lessons**
4. **Click "Import"**

### ⚠️ QUAN TRỌNG - Configure Project:

**Framework Preset**: Next.js (auto-detected) ✅

**Root Directory**: 
- Click **"Edit"** bên cạnh Root Directory
- Chọn **`apps/web`**
- Click **"Continue"**

**Build and Output Settings**:
- Build Command: `pnpm build` (auto-detected)
- Output Directory: `.next` (auto-detected)
- Install Command: `pnpm install` (auto-detected)

**✅ CHƯA CLICK "Deploy"** - đọc Step 3.3 trước!

---

## Step 3.3: Configure Build Settings ⭐⭐⭐

### Override Settings (nếu cần):

**Build Command**:
```bash
cd ../.. && pnpm install && cd apps/web && pnpm build
```

**Install Command**:
```bash
pnpm install
```

**Output Directory**:
```
.next
```

**Node.js Version**: 20.x (default OK)

**✅ Settings OK? Continue to Step 3.4**

---

## Step 3.4: Configure Environment Variables ⭐⭐⭐ RẤT QUAN TRỌNG

### Actions:

Trong phần **"Environment Variables"**, thêm biến sau:

**NEXT_PUBLIC_API_BASE_URL** (CRITICAL!):
```
https://life-lessonsapi-production.up.railway.app
```
👆 **COPY ĐÚNG Railway API URL của bạn!**

Click **"Add"** để thêm biến

### Verify:

Sau khi add, bạn phải thấy:
- [x] `NEXT_PUBLIC_API_BASE_URL` = `https://life-lessonsapi-production.up.railway.app`

**✅ Environment variable added? Continue to Step 3.5**

---

## Step 3.5: Deploy Frontend 🚀

### Actions:

1. **Review** tất cả settings:
   - Root Directory: `apps/web` ✅
   - Environment Variables: `NEXT_PUBLIC_API_BASE_URL` ✅
   - Build Command: OK ✅

2. **Click "Deploy"**

3. **Đợi** build complete (~2-4 phút)
   - Vercel sẽ hiển thị build logs
   - Bạn sẽ thấy progress bar

4. **Nếu build success**, Vercel sẽ hiển thị:
   - 🎉 **"Congratulations!"**
   - Preview URL
   - Production URL

### Troubleshooting:

**Nếu build fails:**
- Check logs để xem lỗi
- Thường do:
  - Root directory sai
  - Environment variable thiếu
  - Build command sai

**Common fixes:**
- Đảm bảo Root Directory = `apps/web`
- Đảm bảo `NEXT_PUBLIC_API_BASE_URL` đã set

**✅ Build success? Continue to Step 3.6**

---

## Step 3.6: Get Vercel URL ⭐⭐⭐

### Actions:

1. Sau khi deploy thành công, Vercel sẽ hiển thị:
   ```
   https://life-lessons-xxx.vercel.app
   ```

2. **COPY URL NÀY** → Lưu vào notepad!

3. **Click "Visit"** để xem app

### ⚠️ LƯU URL NÀY:

```
YOUR VERCEL URL: ___________________________________
```
👆 Viết vào đây hoặc notepad!

### Expected:

- Trang login/signup hiển thị
- UI load đúng
- **Có thể bị lỗi CORS** khi gọi API → Fix ở Step 3.7

**✅ URL copied? Continue to Step 3.7**

---

## Step 3.7: Update Railway CORS ⭐⭐⭐ RẤT QUAN TRỌNG

### Actions:

1. **Quay lại Railway Dashboard**
2. **Click vào API service**
3. **Click tab "Variables"**
4. **Tìm variable `ALLOWED_ORIGINS`**
5. **Click "Edit"**
6. **Update value**:

**Trước**:
```
http://localhost:3000
```

**Sau** (thay YOUR_VERCEL_URL):
```
http://localhost:3000,https://YOUR_VERCEL_URL
```

**Ví dụ**:
```
http://localhost:3000,https://life-lessons-xyz.vercel.app
```

7. **Click "Save"**
8. **Đợi** Railway redeploy (~1-2 phút)

### Verify CORS:

```powershell
# Test từ browser hoặc Postman
curl https://YOUR_VERCEL_URL/api/auth/health
```

**✅ CORS updated? Continue to Step 3.8**

---

## Step 3.8: Test Full App 🎯

### Test Signup Flow:

1. **Mở Vercel URL** trong browser
2. **Click "Sign Up"** (hoặc trang đăng ký)
3. **Điền form**:
   - Email: `test@vercel.com`
   - Password: `Test1234!`
   - Name: `Vercel Test`
4. **Click "Sign Up"**
5. **Expect**: Redirect to dashboard hoặc login

### Test Login Flow:

1. **Click "Login"**
2. **Điền form**:
   - Email: `test@vercel.com`
   - Password: `Test1234!`
3. **Click "Login"**
4. **Expect**: Redirect to dashboard, thấy user name

### Test Dashboard:

1. **Xem Dashboard** hiển thị đúng
2. **Test Quick Capture** (nếu có)
3. **Test Navigation** giữa các trang

### Troubleshooting:

**Nếu lỗi "Network Error" hoặc "CORS":**
- Kiểm tra lại Railway `ALLOWED_ORIGINS`
- Đảm bảo có dấu `,` giữa các URL
- Redeploy Railway nếu cần

**Nếu lỗi "API not found":**
- Kiểm tra `NEXT_PUBLIC_API_BASE_URL` trong Vercel
- Redeploy Vercel

**Nếu UI lỗi:**
- Check browser console (F12)
- Gửi screenshot để debug

**✅ App hoạt động? STEP 3 COMPLETE! 🎉**

---

## 🎊 Step 3 Complete!

### You now have:

- ✅ Vercel account created
- ✅ Frontend deployed from GitHub
- ✅ Environment variables configured
- ✅ Production URL generated
- ✅ CORS configured correctly
- ✅ Full app tested (signup/login/dashboard)

### Your URLs:

**Frontend (Vercel)**:
```
https://your-vercel-url.vercel.app
```

**Backend (Railway)**:
```
https://life-lessonsapi-production.up.railway.app
```

**Swagger Docs**:
```
https://life-lessonsapi-production.up.railway.app/docs
```

---

## 🚀 Next Steps (Optional)

### 1. Custom Domain (Optional)

**Vercel**:
- Settings → Domains → Add custom domain
- Ví dụ: `app.lifelessons.com`

**Railway**:
- Settings → Networking → Custom Domain
- Ví dụ: `api.lifelessons.com`

### 2. Monitoring & Analytics

**Vercel**:
- Analytics tự động (free tier)
- Real-time logs

**Railway**:
- Observability tab
- Metrics & logs

### 3. Production Checklist

- [ ] Set up error tracking (Sentry)
- [ ] Configure backups (Railway Postgres)
- [ ] Set up monitoring alerts
- [ ] Update README với production URLs
- [ ] Test mobile responsive
- [ ] Performance audit (Lighthouse)

---

## 📞 Need Help?

**Vercel Support:**
- Dashboard: https://vercel.com/dashboard
- Docs: https://vercel.com/docs
- Discord: https://vercel.com/discord

**Common Issues:**

1. **Build failed** → Check Root Directory = `apps/web`
2. **API not working** → Check `NEXT_PUBLIC_API_BASE_URL`
3. **CORS error** → Update Railway `ALLOWED_ORIGINS`
4. **Slow load** → Check Vercel region (default auto)

---

**Current Progress**: 3/4 Steps Complete (75%) ⭐⭐⭐☆

**Final Step**: Step 4 - Testing & Optimization (Optional)
