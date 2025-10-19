# 🚨 URGENT: Fix CORS Error

## Vấn đề
Frontend Vercel không thể gọi API Railway vì CORS policy block.

## URL của bạn
- Frontend: https://life-lessons-web.vercel.app
- Backend: https://life-lessonsapi-production.up.railway.app

## Fix ngay (2 phút):

### Bước 1: Vào Railway Dashboard
1. Mở https://railway.app/dashboard
2. Click vào project: **sparkling-nourishment**
3. Click vào service: **life-lessons/api** (API service)

### Bước 2: Update ALLOWED_ORIGINS
1. Click tab **"Variables"**
2. Tìm variable: **`ALLOWED_ORIGINS`**
3. Click **"Edit"** (icon bút chì)
4. **Thay value cũ**:
   ```
   http://localhost:3000
   ```
   
   **Bằng value mới**:
   ```
   http://localhost:3000,https://life-lessons-web.vercel.app
   ```
   
5. Click **"Save"** hoặc **"Update"**

### Bước 3: Đợi Redeploy
- Railway sẽ tự động redeploy (~1-2 phút)
- Xem tab "Deployments" để theo dõi

### Bước 4: Test lại
- Đợi deployment complete (status ✅)
- Quay lại https://life-lessons-web.vercel.app/login
- F5 refresh page
- Thử login lại với:
  - Email: demo@lifelessons.app
  - Password: Passw0rd!

---

## ⚠️ LƯU Ý

**QUAN TRỌNG**: 
- Phải có dấu **phẩy** (`,`) giữa các URL
- **KHÔNG có space** sau dấu phẩy
- URL phải đúng: `https://life-lessons-web.vercel.app` (không có `/` cuối)

**Correct**:
```
http://localhost:3000,https://life-lessons-web.vercel.app
```

**Wrong**:
```
http://localhost:3000, https://life-lessons-web.vercel.app  ❌ (có space)
http://localhost:3000https://life-lessons-web.vercel.app     ❌ (thiếu dấu phẩy)
```

---

## 🎯 After Fix

Login sẽ hoạt động và bạn sẽ thấy:
- ✅ Không còn CORS error
- ✅ API call thành công (200 OK)
- ✅ Redirect về dashboard
- ✅ Thấy user name

---

**Làm xong báo mình nhé!** 🚀
