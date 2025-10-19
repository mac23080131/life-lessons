# Hướng dẫn Test Admin CKB

## 1. Đảm bảo services đang chạy

```powershell
# Kiểm tra backend (NestJS)
curl http://localhost:3001/api/concepts/categories

# Kiểm tra frontend (Next.js)
curl http://localhost:3000
```

Nếu chưa chạy:
```powershell
.\start-dev.ps1
```

## 2. Đăng nhập với tài khoản Demo

- URL: http://localhost:3000
- Email: `demo@lifelessons.app`
- Password: `Passw0rd!`

## 3. Truy cập Admin CKB

Có 2 cách:

### Cách 1: Từ menu
1. Click vào menu (≡) ở góc trên bên trái
2. Chọn "Cài đặt" (Settings)
3. Trong sidebar, tìm phần "Admin" (nếu user có quyền admin)
4. Click "Kho khái niệm" hoặc "CKB Studio"

### Cách 2: Trực tiếp URL
- Truy cập: http://localhost:3000/dashboard/admin/concepts

## 4. Kiểm tra trang Admin CKB

Trang này phải hiển thị:

### Header
- ✅ Tiêu đề: "CKB Admin Dashboard"
- ✅ Mô tả: "Manage concepts, practices, and questions"
- ✅ Nút "+ New Concept" (màu tím)

### Stats Cards (4 cards ngang)
- ✅ **Total Concepts**: 14
- ✅ **Categories**: 10
- ✅ **Total Views**: Số lượt xem
- ✅ **Avg per Concept**: Trung bình view/concept

### Category Distribution
- ✅ Biểu đồ thanh ngang hiển thị số lượng concepts theo từng category
- ✅ Các categories: Mindfulness, Growth Mindset, Emotional Intelligence, Resilience, Relationships, Productivity

### Concepts Table
- ✅ Cột: CONCEPT | CATEGORY | DIFFICULTY | VIEWS | ACTIONS
- ✅ Hiển thị danh sách 14 concepts
- ✅ Mỗi concept có:
  - Title (tiếng Việt)
  - Title EN (tiếng Anh)
  - Category badge
  - Difficulty chip (BEGINNER/INTERMEDIATE)
  - View count
  - Actions: Edit, Delete

### Search & Filter
- ✅ Search box: Tìm kiếm theo tên concept
- ✅ Filter theo Category
- ✅ Filter theo Difficulty

### Quick Actions (3 cards ở dưới)
- ✅ Add Concept - Tạo concept mới
- ✅ Add Category - Tạo category mới
- ✅ Bulk Import - Import từ file

## 5. Danh sách 14 Concepts hiện có

1. **Stress Management** (Quản lý căng thẳng) - Resilience - BEGINNER
2. **Healthy Boundaries** (Ranh giới lành mạnh) - Relationships - INTERMEDIATE
3. **Deep Work** (Làm việc sâu) - Productivity - INTERMEDIATE
4. **Empathy** (Đồng cảm) - Emotional Intelligence - INTERMEDIATE
5. **Self-Awareness** (Tự nhận thức) - Emotional Intelligence - INTERMEDIATE
6. **Embracing Challenges** (Đón nhận thử thách) - Growth Mindset - INTERMEDIATE
7. **Non-Judgmental Observation** (Quan sát không phán xét) - Mindfulness - INTERMEDIATE
8. **Present Moment Awareness** (Tỉnh thức hiện tại) - Mindfulness - BEGINNER
9. **Active Listening** (Lắng nghe tích cực) - Relationships - INTERMEDIATE
10. **Cognitive Reframing** (Tái khung nhận thức) - Emotional Intelligence - INTERMEDIATE
11. **Emotional Regulation** - Emotional Intelligence
12. **Growth vs Fixed Mindset** - Growth Mindset
13. **Breathing Exercises** - Mindfulness
14. **Gratitude Practice** - Inner Development

## 6. Test các chức năng

### Search
1. Nhập "stress" vào search box
2. ✅ Chỉ hiển thị "Stress Management"

### Filter by Category
1. Chọn category "Mindfulness"
2. ✅ Hiển thị 3 concepts: Present Moment Awareness, Non-Judgmental Observation, Breathing Exercises

### Filter by Difficulty
1. Chọn "BEGINNER"
2. ✅ Hiển thị 2 concepts: Stress Management, Present Moment Awareness

### View Concept Detail
1. Click vào một concept (ví dụ "Stress Management")
2. ✅ Mở trang detail với đầy đủ thông tin:
   - Title, Summary, Description
   - Practices (2 practices)
   - Questions (2 questions)
   - Examples (nếu có)

## 7. Các trang liên quan khác

### User Concepts Page
- URL: http://localhost:3000/dashboard/concepts
- ✅ Hiển thị grid cards của tất cả concepts
- ✅ Filter theo category tabs
- ✅ Difficulty badges

### Concept Detail Page
- URL: http://localhost:3000/dashboard/concepts/[slug]
- Ví dụ: `/dashboard/concepts/stress-management`
- ✅ Hiển thị full content
- ✅ Practices section
- ✅ Questions section
- ✅ Progress tracking

### Admin Categories
- URL: http://localhost:3000/admin/categories
- ✅ Danh sách 10 categories
- ✅ Chỉnh sửa, xóa categories

## 8. Troubleshooting

### Nếu không thấy concepts:

1. **Kiểm tra console log:**
   ```
   F12 > Console tab
   ```
   Xem có lỗi fetch không

2. **Kiểm tra Network tab:**
   ```
   F12 > Network tab > XHR
   ```
   - Tìm request đến `/api/concepts/search`
   - Status phải là 200 OK
   - Response phải có data array với 14 items

3. **Kiểm tra env:**
   ```powershell
   # File: .env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:3001
   ```

4. **Restart Next.js nếu thay đổi env:**
   ```powershell
   # Trong terminal web
   Ctrl+C
   pnpm dev
   ```

### Nếu không có quyền admin:

User `demo@lifelessons.app` mặc định không có role ADMIN. Cần:

1. **Cập nhật role trong database:**
   ```sql
   -- Connect to Postgres
   docker exec -it life-lessons-db-1 psql -U postgres -d lifelessons
   
   -- Update user role
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'demo@lifelessons.app';
   ```

2. **Hoặc tạo user admin mới:**
   ```powershell
   # Chạy seed script với admin user
   pnpm --filter api prisma:seed
   ```

## 9. Expected Result

Sau khi hoàn thành fix:
- ✅ Admin CKB page load thành công
- ✅ Hiển thị 14 concepts
- ✅ Search và filter hoạt động
- ✅ Stats cards hiển thị đúng số liệu
- ✅ Category distribution chart hiển thị
- ✅ Có thể view chi tiết từng concept

---

**Updated:** 19/10/2025
**Status:** ✅ Fixed and tested
