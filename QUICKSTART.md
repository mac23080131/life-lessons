# 🚀 Quick Start Guide - Life Lessons App

## Tình trạng hiện tại

✅ **Đã hoàn thành:**
- Cấu trúc monorepo (pnpm workspace)
- Prisma schema đầy đủ (User, Lesson, Goal, Sprint, Reminder, CKB models)
- NestJS backend structure (Auth, Users modules)
- Docker Compose setup (PostgreSQL + Redis)
- Seed script với demo data
- README đầy đủ
- Environment variables

🔨 **Cần hoàn thiện:**
- Cài đặt dependencies
- Tạo remaining backend modules (Lessons, Goals, AI, Analytics, etc.)
- Tạo Next.js frontend
- Tạo Expo mobile scaffold

## Các bước tiếp theo

### Bước 1: Cài đặt dependencies

```powershell
# Từ thư mục gốc
cd "C:\Users\htvgi\Documents\DEV PJ\Life Lessons"

# Cài đặt pnpm nếu chưa có
npm install -g pnpm

# Cài đặt dependencies
pnpm install

# Cài đặt dependencies cho backend
cd apps\api
pnpm install
cd ..\..
```

### Bước 2: Setup database

```powershell
# Start Docker (PostgreSQL + Redis)
docker-compose up -d

# Chờ 5-10 giây cho database khởi động

# Tạo Prisma client
cd prisma
npx prisma generate

# Chạy migration
npx prisma migrate dev --name init

cd ..
```

### Bước 3: Seed demo data

```powershell
# Chạy seed script
pnpm seed
```

Demo user sẽ được tạo:
- Email: `demo@lifelessons.app`
- Password: `Passw0rd!`

### Bước 4: Tạo các modules backend còn lại

Tôi sẽ tạo template cho các modules còn thiếu. Bạn có thể chạy từng command sau:

#### 4a. Lessons Module

```powershell
# File structure đã có, cần tạo implementation
```

#### 4b. Goals Module, AI Module, Analytics Module

(Tương tự)

### Bước 5: Tạo Next.js frontend

```powershell
# Tạo Next.js app
cd apps
npx create-next-app@latest web --typescript --tailwind --eslint --app --src-dir --no-import-alias

cd web
pnpm add @tanstack/react-query axios zustand zod date-fns
pnpm add -D @types/node

cd ..\..
```

### Bước 6: Chạy development

```powershell
# Terminal 1: Backend API
cd apps\api
pnpm dev

# Terminal 2: Frontend
cd apps\web
pnpm dev
```

Truy cập:
- Frontend: http://localhost:3000
- API: http://localhost:3001
- Swagger Docs: http://localhost:3001/docs
- Prisma Studio: `npx prisma studio` (trong thư mục prisma)

## Lỗi thường gặp

### 1. "Cannot find module '@nestjs/...'"

**Giải pháp:** Chưa cài dependencies. Chạy:
```powershell
cd apps\api
pnpm install
```

### 2. "Cannot find module '@prisma/client'"

**Giải pháp:** Chưa generate Prisma client. Chạy:
```powershell
cd prisma
npx prisma generate
```

### 3. Docker không khởi động được

**Giải pháp:** 
- Kiểm tra Docker Desktop đang chạy
- Hoặc cài PostgreSQL + Redis manually

### 4. Port đã được sử dụng

**Giải pháp:** Đổi port trong `.env`:
```
API_PORT=3002
```

## Kiểm tra setup thành công

✅ **Backend:**
```powershell
curl http://localhost:3001/api/health
# hoặc
Invoke-WebRequest http://localhost:3001/docs
```

✅ **Database:**
```powershell
cd prisma
npx prisma studio
# Mở http://localhost:5555
```

✅ **Seed data:**
- Kiểm tra trong Prisma Studio có user `demo@lifelessons.app`
- Có 12 lessons
- Có 1 goal với target 10,000

## Tài liệu tham khảo

- [NestJS Docs](https://docs.nestjs.com/)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Next.js Docs](https://nextjs.org/docs)
- [pnpm Workspace](https://pnpm.io/workspaces)

## Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Node.js version >= 20
2. pnpm đã cài đặt
3. Docker Desktop đang chạy
4. File `.env` đã được tạo và cấu hình đúng
5. Dependencies đã được cài đặt cho cả root và apps/api

---

**Tiếp theo:** Tôi sẽ tạo các backend modules còn lại và Next.js frontend structure.
