# Admin CKB - Complete CRUD Guide

## 🎉 Hoàn thành

Trang admin CKB giờ đã có đầy đủ chức năng **CRUD** (Create, Read, Update, Delete) cho cả **Concepts** và **Categories**.

---

## 📍 Truy cập Admin CKB

**URL:** http://localhost:3000/dashboard/admin/concepts

**Yêu cầu:** 
- Đăng nhập với tài khoản có role `ADMIN`
- Token JWT trong localStorage

---

## 🔧 Chức năng đã hoàn thiện

### ✅ 1. Quản lý Concepts

#### **View Concepts**
- ✅ Hiển thị danh sách tất cả concepts trong table
- ✅ Hiển thị: Title, Category, Difficulty, Views
- ✅ Tags hiển thị dưới mỗi concept
- ✅ Empty state khi không có concepts

#### **Create Concept**
**Cách 1:** Click nút "+ New Concept" ở góc trên phải  
**Cách 2:** Click "Add Concept" trong Quick Actions

**Form fields:**
- ✅ Key (unique ID) - **required**
- ✅ Slug (URL-friendly) - **required**
- ✅ Title (Vietnamese) - **required**
- ✅ Title (English) - **required**
- ✅ Summary (Vietnamese) - **required**
- ✅ Summary (English) - **required**
- ✅ Description (Vietnamese) - **required**
- ✅ Description (English) - **required**
- ✅ Category (dropdown) - **required**
- ✅ Difficulty (BEGINNER/INTERMEDIATE/ADVANCED)
- ✅ Tags (comma-separated)
- ✅ Keywords (comma-separated)
- ✅ Source (e.g., book name)
- ✅ AI Context (when to suggest)

**Validation:**
- Key phải unique
- Slug phải unique và URL-friendly
- Tất cả text fields bilingual (vi + en)

#### **Edit Concept**
- ✅ Click icon Edit (✏️) trong hàng concept
- ✅ Form tương tự Create, đã điền sẵn dữ liệu hiện tại
- ✅ Update API: `PUT /api/concepts/:id`

#### **Delete Concept**
- ✅ Click icon Delete (🗑️) trong hàng concept
- ✅ Hiển thị confirm dialog
- ✅ DELETE API: `DELETE /api/concepts/:id`

#### **View Concept Detail**
- ✅ Click icon Eye (👁️) để xem chi tiết
- ✅ Redirect đến: `/dashboard/concepts/[slug]`
- ✅ Hiển thị full content, practices, examples, questions

#### **Search Concepts**
- ✅ Search box: Tìm theo title (vi/en), tags
- ✅ Real-time filtering

---

### ✅ 2. Quản lý Categories

#### **View Categories**
- ✅ Hiển thị grid cards của tất cả categories
- ✅ Hiển thị: Icon, Name, Description, Concept count
- ✅ Color indicator
- ✅ Order number

#### **Create Category**
**Cách 1:** Click "Add Category" trong Categories section  
**Cách 2:** Click "Add Category" trong Quick Actions

**Form fields:**
- ✅ Key (unique ID) - **required**
- ✅ Name (Vietnamese) - **required**
- ✅ Name (English) - **required**
- ✅ Description
- ✅ Icon (emoji hoặc icon name)
- ✅ Color (hex color picker)
- ✅ Order (số thứ tự hiển thị)

**Default values:**
- Icon: 📚
- Color: #8B5CF6 (purple)
- Order: 0

#### **Edit Category**
- ✅ Click icon Edit (✏️) trong category card
- ✅ Form tương tự Create, đã điền sẵn dữ liệu
- ✅ Update API: `PUT /api/concepts/categories/:id`

#### **Delete Category**
- ✅ Click icon Delete (🗑️) trong category card
- ✅ Hiển thị confirm dialog
- ✅ **Validation:** Không cho phép xóa nếu category có concepts
- ✅ Error message: "Cannot delete category with X concepts. Please reassign or delete the concepts first."
- ✅ DELETE API: `DELETE /api/concepts/categories/:id`

---

## 📊 Thống kê Dashboard

### Stats Cards
- ✅ **Total Concepts** - Tổng số concepts
- ✅ **Categories** - Số lượng categories
- ✅ **Total Views** - Tổng lượt xem
- ✅ **Avg per Concept** - Trung bình view/concept

### Category Grid
- ✅ Hiển thị tất cả categories dạng cards
- ✅ Mỗi card: Icon, Name, Concept count, Color, Order
- ✅ Quick edit/delete từng category

---

## 🔐 API Endpoints (Backend)

### Concepts
```
GET    /api/concepts/search?limit=100        # List concepts
GET    /api/concepts/:id                     # Get concept detail
POST   /api/concepts                         # Create concept (ADMIN)
PUT    /api/concepts/:id                     # Update concept (ADMIN)
DELETE /api/concepts/:id                     # Delete concept (ADMIN)
```

### Categories
```
GET    /api/concepts/categories              # List all categories
GET    /api/concepts/categories/:id          # Get category with concepts
POST   /api/concepts/categories              # Create category (ADMIN)
PUT    /api/concepts/categories/:id          # Update category (ADMIN)
DELETE /api/concepts/categories/:id          # Delete category (ADMIN)
```

**Authentication:** 
- All CRUD endpoints require JWT token
- Role `ADMIN` required for Create/Update/Delete
- Token header: `Authorization: Bearer <token>`

---

## 🎨 UI/UX Features

### Modals
- ✅ **Concept Modal** - Full-width modal với scroll
- ✅ **Category Modal** - Smaller modal
- ✅ Sticky header với close button
- ✅ Dark mode support
- ✅ Form validation
- ✅ Cancel/Save buttons

### Responsive Design
- ✅ Desktop: Full table view
- ✅ Tablet: 2-column grid cho categories
- ✅ Mobile: 1-column stack

### Dark Mode
- ✅ Tất cả components support dark mode
- ✅ Auto detect từ system preference
- ✅ Border, background, text colors adapt

### Loading States
- ✅ Initial page load: Spinner với "Loading..."
- ✅ Table empty state: Icon + "No concepts found"

### Notifications
- ✅ Success: Browser alert (có thể thay bằng toast)
- ✅ Error: Alert với error message
- ✅ Confirmation: Confirm dialog trước khi delete

---

## 🧪 Testing Checklist

### Create Operations
- [ ] Tạo concept mới với đầy đủ thông tin
- [ ] Tạo concept với tags và keywords
- [ ] Tạo category mới với icon và color
- [ ] Validate required fields
- [ ] Check unique key/slug

### Read Operations
- [ ] Load danh sách concepts
- [ ] Load danh sách categories
- [ ] View concept detail
- [ ] Search concepts
- [ ] Filter by category (trong page khác)

### Update Operations
- [ ] Edit concept - update title
- [ ] Edit concept - change category
- [ ] Edit concept - update tags
- [ ] Edit category - change name
- [ ] Edit category - update color/icon

### Delete Operations
- [ ] Delete concept (có confirm)
- [ ] Delete category rỗng (không có concepts)
- [ ] Thử delete category có concepts (phải lỗi)
- [ ] Cancel delete khi click Cancel trong confirm

### UI/UX
- [ ] Modal open/close mượt mà
- [ ] Dark mode toggle hoạt động
- [ ] Responsive trên mobile
- [ ] Search real-time
- [ ] Icons hiển thị đúng

---

## 🐛 Known Issues & Solutions

### Issue 1: Token expired
**Triệu chứng:** API trả về 401 Unauthorized  
**Giải pháp:** Đăng nhập lại để refresh token

### Issue 2: Role không phải ADMIN
**Triệu chứng:** API trả về 403 Forbidden  
**Giải pháp:** 
```sql
-- Update user role in database
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### Issue 3: Category có concepts không xóa được
**Triệu chứng:** Error "Cannot delete category..."  
**Giải pháp:** 
1. Reassign concepts sang category khác
2. Hoặc xóa hết concepts trong category trước

### Issue 4: Modal không đóng
**Triệu chứng:** Click outside modal không đóng  
**Giải pháp:** Click nút X hoặc Cancel button

---

## 🚀 Future Enhancements

### Short-term (v1.1)
- [ ] Toast notifications thay vì alert
- [ ] Bulk delete concepts
- [ ] Drag & drop reorder categories
- [ ] Image upload cho concepts
- [ ] Rich text editor cho description
- [ ] Keyboard shortcuts (Ctrl+S to save)

### Mid-term (v1.2)
- [ ] Concept preview before save
- [ ] Duplicate concept feature
- [ ] Export concepts to JSON/CSV
- [ ] Import concepts from file
- [ ] Version history
- [ ] Concept templates

### Long-term (v2.0)
- [ ] AI-assisted concept generation
- [ ] Multilingual support (thêm ngôn ngữ)
- [ ] Concept relationships graph view
- [ ] Analytics: Top viewed, engagement
- [ ] Collaborative editing
- [ ] Comment system

---

## 📝 Code Structure

```
apps/web/src/app/dashboard/admin/concepts/
├── page.tsx                 # Main admin page
│   ├── AdminConceptsPage    # Main component
│   ├── ConceptModal         # Create/Edit concept modal
│   └── CategoryModal        # Create/Edit category modal
```

**Key functions:**
- `fetchData()` - Load concepts & categories
- `handleViewConcept()` - Navigate to detail
- `handleEditConcept()` - Open edit modal
- `handleDeleteConcept()` - Delete with confirm
- `handleSaveConcept()` - Create or update
- `handleEditCategory()` - Open category modal
- `handleDeleteCategory()` - Delete category
- `handleSaveCategory()` - Create or update category

---

## 🎓 Best Practices

### 1. Always validate input
```typescript
if (!formData.key || !formData.title) {
  alert('Required fields missing');
  return;
}
```

### 2. Use TypeScript types
```typescript
interface ConceptFormData {
  key: string;
  title: string;
  // ...
}
```

### 3. Handle errors gracefully
```typescript
try {
  const response = await fetch(...);
  if (!response.ok) {
    const error = await response.json();
    alert(`Error: ${error.message}`);
  }
} catch (error) {
  console.error('Failed:', error);
  alert('Network error');
}
```

### 4. Confirm before delete
```typescript
if (!confirm('Are you sure?')) return;
```

### 5. Refetch after mutations
```typescript
await handleSaveConcept(data);
await fetchData(); // Refresh list
```

---

## 📞 Support

**Issues?** Check:
1. Browser console (F12) for errors
2. Network tab for failed requests
3. Backend logs (`pnpm --filter api logs`)
4. Database state

**Contact:** Dev team for admin access

---

**Last Updated:** 19/10/2025  
**Version:** 1.0  
**Status:** ✅ Production Ready
