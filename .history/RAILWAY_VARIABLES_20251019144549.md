# 🔑 Railway Environment Variables - Copy & Paste Ready

## 📋 Quick Copy List

**JWT Secret đã generate sẵn cho bạn:**
```
m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
```

---

## 🎯 Add these variables trong Railway Variables tab:

### 1. Basic Config (Paste từng dòng):

```
NODE_ENV=production
```

```
PORT=3001
```

```
TZ=Asia/Bangkok
```

---

### 2. Database References (KHÔNG paste text, dùng Add Reference):

**DATABASE_URL**:
- Click "New Variable"
- Name: `DATABASE_URL`
- Click "Add Reference"
- Service: PostgreSQL
- Variable: DATABASE_URL

**REDIS_URL**:
- Click "New Variable"
- Name: `REDIS_URL`
- Click "Add Reference"
- Service: Redis
- Variable: REDIS_URL

---

### 3. Auth Config (Paste):

```
JWT_SECRET=m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
```

```
JWT_EXPIRES_IN=15m
```

```
JWT_REFRESH_EXPIRES_IN=7d
```

---

### 4. CORS (Temporary - sẽ update sau):

```
ALLOWED_ORIGINS=http://localhost:3000
```

---

## ✅ Verification Checklist

Sau khi add xong, kiểm tra lại:

- [ ] NODE_ENV = production
- [ ] PORT = 3001
- [ ] TZ = Asia/Bangkok
- [ ] DATABASE_URL = Reference to Postgres
- [ ] REDIS_URL = Reference to Redis
- [ ] JWT_SECRET = m5qzNuM/yPfLBJY7wZ9hVaAMbFLO0fhOsCzN11eXo9g=
- [ ] JWT_EXPIRES_IN = 15m
- [ ] JWT_REFRESH_EXPIRES_IN = 7d
- [ ] ALLOWED_ORIGINS = http://localhost:3000

**Total: 9 variables**

---

## 🚀 After adding variables:

Railway sẽ **auto-redeploy** API service.

Đợi ~2-3 phút cho deployment complete.

Check Deployments tab → Status phải là "Success" ✅

---

**Back to**: [STEP_2_RAILWAY.md](./STEP_2_RAILWAY.md)
