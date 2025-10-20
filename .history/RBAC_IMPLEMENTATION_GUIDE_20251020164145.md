# 🛡️ RBAC System Implementation - Complete Guide

**Feature**: Role-Based Access Control với Admin / Moderator / User  
**Status**: ✅ Schema Ready | ⏳ Implementation In Progress  
**Priority**: HIGH - Core security feature  

---

## 📋 Implementation Checklist

### Phase 1: Database & Schema ✅ DONE
- [x] Updated Prisma schema với MODERATOR role
- [x] Added ban fields (isBanned, bannedAt, bannedReason, bannedBy)
- [x] Created AuditLog model
- [x] Created Report model  
- [x] Created UserCategory model
- [x] Generated migration SQL

### Phase 2: Core Services ✅ DONE
- [x] Created RolesGuard
- [x] Created @Roles() decorator
- [x] Created AuditLogService
- [x] Created AuditLogModule (Global)

### Phase 3: Admin API ⏳ IN PROGRESS
- [ ] Update AdminUsersService with full RBAC
- [ ] Update AdminUsersController
- [ ] Create ModeratorService
- [ ] Create ModeratorController
- [ ] Create ReportsService
- [ ] Create ReportsController

### Phase 4: Frontend ⏳ TODO
- [ ] Admin Dashboard UI
- [ ] User Management Table
- [ ] Role Change Modal
- [ ] Ban/Unban Modal
- [ ] Audit Log Viewer
- [ ] Moderation Queue UI

---

## 🎯 Roles & Permissions Matrix

| Feature | User | Moderator | Admin |
|---------|------|-----------|-------|
| **User Management** |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| View all users | ❌ | ✅ (limited) | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| Ban/unban users | ❌ | ✅ (non-admin) | ✅ |
| Delete users | ❌ | ❌ | ✅ |
| **Content Management** |
| Create lessons | ✅ | ✅ | ✅ |
| Edit own lessons | ✅ | ✅ | ✅ |
| Delete own lessons | ✅ | ✅ | ✅ |
| View all lessons | ❌ | ✅ | ✅ |
| Hide/delete others' lessons | ❌ | ✅ (public only) | ✅ |
| **Community** |
| Report content | ✅ | ✅ | ✅ |
| Review reports | ❌ | ✅ | ✅ |
| Resolve reports | ❌ | ✅ | ✅ |
| **CKB (Concept Knowledge Base)** |
| View concepts | ✅ | ✅ | ✅ |
| Create custom categories | ✅ | ✅ | ✅ |
| Import concepts | ❌ | ✅ | ✅ |
| Delete concepts | ❌ | ❌ | ✅ |
| **Audit Log** |
| View own actions | ✅ | ✅ | ✅ |
| View content audit | ❌ | ✅ | ✅ |
| View full system audit | ❌ | ❌ | ✅ |
| **System Config** |
| View settings | ❌ | ❌ | ✅ |
| Change settings | ❌ | ❌ | ✅ |

---

## 📁 Files Created

### Backend

```
apps/api/src/
├── common/
│   ├── decorators/
│   │   └── roles.decorator.ts          ✅ CREATED
│   └── guards/
│       └── roles.guard.ts               ✅ CREATED
├── audit-log/
│   ├── audit-log.module.ts             ✅ CREATED
│   └── audit-log.service.ts            ✅ CREATED
├── admin/
│   └── services/
│       └── admin-users.service.ts      📝 NEEDS UPDATE
└── moderation/                         ⏳ TODO
    ├── moderation.module.ts
    ├── moderation.service.ts
    ├── reports.service.ts
    └── controllers/
        ├── reports.controller.ts
        └── moderation.controller.ts

prisma/
└── migrations/
    └── 20251020_add_rbac_audit_reports/
        └── migration.sql               ✅ CREATED
```

---

## 🔧 Usage Examples

### 1. Protect Routes with Roles

```typescript
// Admin-only endpoint
@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminUsersController {
  
  @Get()
  @Roles(UserRole.ADMIN)
  async getUsers() {
    return this.adminUsersService.getUsers();
  }

  @Patch(':id/role')
  @Roles(UserRole.ADMIN)
  async changeRole(@Param('id') id: string, @Body() dto: ChangeRoleDto) {
    return this.adminUsersService.changeRole(id, dto.role, req.user.id);
  }
}
```

### 2. Moderator + Admin Access

```typescript
// Both moderators and admins can access
@Controller('moderation/reports')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReportsController {
  
  @Get()
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async getReports() {
    return this.reportsService.getPendingReports();
  }

  @Post(':id/resolve')
  @Roles(UserRole.MODERATOR, UserRole.ADMIN)
  async resolveReport(@Param('id') id: string, @Body() dto: ResolveReportDto) {
    return this.reportsService.resolveReport(id, req.user.id, dto);
  }
}
```

### 3. Audit Logging

```typescript
// In service methods
async banUser(userId: string, adminId: string, reason: string) {
  // ... ban logic ...
  
  // Automatically log action
  await this.auditLog.log({
    userId: adminId,
    action: 'user.ban',
    entityType: 'User',
    entityId: userId,
    metadata: {
      reason,
      targetEmail: user.email,
    },
  });
}
```

### 4. Check User Role in Service

```typescript
// Custom logic based on role
async getLessons(userId: string, userRole: UserRole) {
  if (userRole === UserRole.ADMIN) {
    // Admins see all lessons
    return this.prisma.lesson.findMany();
  } else if (userRole === UserRole.MODERATOR) {
    // Moderators see public + flagged lessons
    return this.prisma.lesson.findMany({
      where: {
        OR: [
          { visibility: 'PUBLIC_ANON' },
          { reportsReceived: { some: {} } },
        ],
      },
    });
  } else {
    // Users only see own lessons
    return this.prisma.lesson.findMany({ where: { userId } });
  }
}
```

---

## 🚀 Next Steps to Complete Implementation

### Step 1: Update Admin Module

```bash
# Files to modify:
apps/api/src/admin/admin.module.ts  # Add AuditLogModule import
apps/api/src/admin/services/admin-users.service.ts  # Add RBAC methods
apps/api/src/admin/controllers/admin-users.controller.ts  # Add endpoints
```

### Step 2: Create Moderation Module

```bash
# Create new files:
nest g module moderation
nest g service moderation/reports
nest g controller moderation/reports
nest g service moderation/moderation
nest g controller moderation/moderation
```

### Step 3: Update App Module

```typescript
// apps/api/src/app.module.ts
@Module({
  imports: [
    // ... existing modules ...
    AuditLogModule,  // Add this (global)
    // ModerationModule will be added when created
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,  // Apply globally (optional)
    },
  ],
})
export class AppModule {}
```

### Step 4: Apply Migration

```bash
# When Railway deploys (or local):
prisma migrate deploy
# OR
prisma db push
```

---

## 📊 API Endpoints (To Be Implemented)

### Admin Endpoints

```
GET    /api/admin/users                    # List users with filters
GET    /api/admin/users/stats              # User statistics
GET    /api/admin/users/:id                # Get user details
PATCH  /api/admin/users/:id/role           # Change user role
POST   /api/admin/users/:id/ban            # Ban user
POST   /api/admin/users/:id/unban          # Unban user
DELETE /api/admin/users/:id                # Delete user
GET    /api/admin/users/:id/audit          # Get user audit logs

GET    /api/admin/audit                    # System audit logs
GET    /api/admin/audit/entity/:type/:id   # Entity-specific logs
```

### Moderation Endpoints

```
GET    /api/moderation/reports              # Pending reports
GET    /api/moderation/reports/:id          # Report details
POST   /api/moderation/reports/:id/resolve  # Resolve report
POST   /api/moderation/reports/:id/dismiss  # Dismiss report

GET    /api/moderation/content/flagged      # Flagged content
POST   /api/moderation/content/:id/hide     # Hide content
POST   /api/moderation/content/:id/delete   # Delete content
```

### User Endpoints (New)

```
GET    /api/users/me/categories             # User's custom categories
POST   /api/users/me/categories             # Create category
PUT    /api/users/me/categories/:id         # Update category
DELETE /api/users/me/categories/:id         # Delete category

POST   /api/reports                         # Report content/user
GET    /api/reports/my                      # User's submitted reports
```

---

## 🎨 Frontend Components (To Be Created)

### Admin Dashboard

```
apps/web/src/app/(dashboard)/admin/
├── page.tsx                    # Admin dashboard overview
├── users/
│   ├── page.tsx               # Users list with filters
│   ├── [id]/
│   │   └── page.tsx          # User detail + actions
│   └── components/
│       ├── UserTable.tsx
│       ├── BanUserModal.tsx
│       └── ChangeRoleModal.tsx
├── audit/
│   ├── page.tsx               # Audit log viewer
│   └── components/
│       └── AuditLogTable.tsx
└── moderation/
    ├── page.tsx               # Moderation queue
    └── components/
        ├── ReportCard.tsx
        └── ResolveModal.tsx
```

### UI Components Needed

```typescript
// BanUserModal.tsx
interface Props {
  user: User;
  onBan: (reason: string) => Promise<void>;
}

// ChangeRoleModal.tsx
interface Props {
  user: User;
  currentRole: UserRole;
  onChangeRole: (newRole: UserRole, reason?: string) => Promise<void>;
}

// AuditLogTable.tsx
interface Props {
  logs: AuditLog[];
  filter: {
    action?: string;
    entityType?: string;
    from?: Date;
    to?: Date;
  };
}
```

---

## 🔒 Security Considerations

### 1. Prevent Self-Actions
```typescript
// Don't allow admin to change own role or ban themselves
if (userId === adminId) {
  throw new BadRequestException('Cannot perform this action on yourself');
}
```

### 2. Protect Super Admin
```typescript
// Special "super admin" email that cannot be modified
const SUPER_ADMIN_EMAIL = 'admin@lifelessons.app';

if (user.email === SUPER_ADMIN_EMAIL) {
  throw new ForbiddenException('Cannot modify super admin');
}
```

### 3. Audit Everything
```typescript
// All admin/moderator actions MUST be logged
await this.auditLog.log({
  userId,
  action,
  entityType,
  entityId,
  metadata,
  ipAddress: req.ip,
  userAgent: req.headers['user-agent'],
});
```

### 4. Rate Limiting
```typescript
// Apply stricter rate limits to admin endpoints
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 10, ttl: 60000 } })  // 10 requests per minute
@Controller('admin')
```

---

## 📖 Migration Guide

### For Existing Users

When migration runs:
- All existing users remain as `USER` role
- No functionality changes for existing users
- Admin must manually promote first admin user

### Create First Admin

```sql
-- Manually promote first admin (run in Railway Postgres console)
UPDATE users 
SET role = 'ADMIN' 
WHERE email = 'your-admin@email.com';
```

Or via API (temporary setup endpoint):

```typescript
// apps/api/src/auth/auth.controller.ts
// REMOVE THIS AFTER FIRST ADMIN IS CREATED!
@Post('setup-admin')
async setupAdmin(@Body() dto: { email: string; password: string }) {
  const adminCount = await this.prisma.user.count({ 
    where: { role: UserRole.ADMIN } 
  });
  
  if (adminCount > 0) {
    throw new ForbiddenException('Admin already exists');
  }
  
  // Create first admin...
}
```

---

## ✅ Testing Checklist

- [ ] Admin can view all users
- [ ] Admin can change user roles
- [ ] Admin can ban/unban users
- [ ] Admin cannot ban other admins
- [ ] Moderator can view flagged content
- [ ] Moderator can resolve reports
- [ ] Moderator cannot change roles
- [ ] User cannot access admin endpoints
- [ ] Banned user cannot login
- [ ] All admin actions logged to audit
- [ ] Audit log shows user details
- [ ] Frontend displays role badges
- [ ] Role changes reflect immediately

---

**Status**: 40% Complete  
**Next Action**: Complete AdminUsersService implementation  
**Blocked By**: Need to deploy migration first (waiting for Docker Hub recovery)  
**ETA**: 2-3 hours after Railway is working
