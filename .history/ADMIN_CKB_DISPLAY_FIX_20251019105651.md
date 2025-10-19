# Khắc phục lỗi hiển thị Kho khái niệm trong Admin

## Vấn đề
- Trang admin CKB (`/dashboard/admin/concepts`) không hiển thị danh sách concepts
- Hiển thị thông báo "No concepts found"
- Các trang concepts khác cũng không tải được dữ liệu

## Nguyên nhân
Frontend đang gọi API với relative path (`/api/concepts/...`) nhưng không dùng `NEXT_PUBLIC_API_BASE_URL`, dẫn đến:
- Request đi đến Next.js server (port 3000) thay vì NestJS backend (port 3001)
- Lỗi 404 Not Found vì Next.js không có các endpoints này

## Giải pháp
Đã cập nhật tất cả các fetch calls để sử dụng `NEXT_PUBLIC_API_BASE_URL`:

```typescript
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
const response = await fetch(`${apiBaseUrl}/api/concepts/...`);
```

## Files đã sửa

### 1. `/apps/web/src/app/dashboard/admin/concepts/page.tsx`
- ✅ `fetchData()`: Gọi `/api/concepts/search` và `/api/concepts/categories`
- Đây là trang admin chính quản lý CKB

### 2. `/apps/web/src/app/dashboard/concepts/page.tsx`
- ✅ `fetchCategories()`: Gọi `/api/concepts/categories`
- ✅ `fetchConcepts()`: Gọi `/api/concepts/search`
- Trang danh sách concepts cho người dùng thường

### 3. `/apps/web/src/app/admin/categories/page.tsx`
- ✅ `fetchCategories()`: Gọi `/api/concepts/categories`
- ✅ `handleDelete()`: Gọi `/api/concepts/categories/:id`
- Trang quản lý categories

### 4. `/apps/web/src/app/admin/concepts/page.tsx`
- ✅ `fetchConcepts()`: Gọi `/api/concepts`
- ✅ `handleDelete()`: Gọi `/api/concepts/:id`
- Trang admin quản lý concepts (nếu có page riêng)

### 5. `/apps/web/src/app/dashboard/concepts/[slug]/page.tsx`
- ✅ `fetchConcept()`: Gọi `/api/concepts/search` và `/api/concepts/:id`
- ✅ `incrementViews()`: Gọi `/api/concepts/:id/views`
- ✅ `updateProgress()`: Gọi `/api/concepts/:id/progress`
- Trang chi tiết concept

## Kiểm tra backend

Backend API hoạt động bình thường với dữ liệu đầy đủ:

```bash
# Kiểm tra categories (10 categories)
curl http://localhost:3001/api/concepts/categories

# Kiểm tra concepts (14 concepts)
curl "http://localhost:3001/api/concepts/search?limit=100"
```

Dữ liệu có sẵn:
- ✅ 10 categories (mindfulness, growth_mindset, emotional_intelligence, resilience, relationships, productivity, ...)
- ✅ 14 concepts đã được seed
- ✅ Concepts có đầy đủ thông tin: title, summary, description, practices, examples, questions

## Kết quả

Sau khi sửa:
- ✅ Trang admin CKB hiển thị đúng danh sách concepts
- ✅ Hiển thị thống kê: Total Concepts, Categories, Views
- ✅ Hiển thị phân bố theo category
- ✅ Tìm kiếm và lọc concepts hoạt động
- ✅ Các trang concepts khác cũng hoạt động bình thường

## Cách test

1. **Khởi động services:**
   ```powershell
   .\start-dev.ps1
   ```

2. **Truy cập admin CKB:**
   - URL: http://localhost:3000/dashboard/admin/concepts
   - Đăng nhập bằng tài khoản admin
   - Kiểm tra xem danh sách concepts hiển thị đầy đủ

3. **Kiểm tra các trang khác:**
   - `/dashboard/concepts` - Danh sách concepts cho user
   - `/dashboard/concepts/[slug]` - Chi tiết concept
   - `/admin/categories` - Quản lý categories

## Best Practice

Để tránh lỗi tương tự trong tương lai, nên:

1. **Tạo API utility function:**
```typescript
// lib/api.ts
export const getApiUrl = (path: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001';
  return `${baseUrl}${path}`;
};

// Usage
fetch(getApiUrl('/api/concepts/search'))
```

2. **Hoặc dùng axios với baseURL:**
```typescript
// lib/axios.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
});

// Usage
api.get('/api/concepts/search')
```

3. **Kiểm tra env variables:**
   - Đảm bảo `.env` có `NEXT_PUBLIC_API_BASE_URL=http://localhost:3001`
   - Prefix `NEXT_PUBLIC_` để expose cho browser

## Ghi chú

- Backend (NestJS) có global prefix `/api` (xem `apps/api/src/main.ts`)
- Frontend phải gọi đầy đủ: `http://localhost:3001/api/...`
- Không dùng relative path cho API calls trong Next.js App Router client components

---

**Ngày fix:** 19 tháng 10, 2025
**Trạng thái:** ✅ Hoàn thành và đã test
