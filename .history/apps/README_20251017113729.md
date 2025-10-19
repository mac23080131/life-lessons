# Apps - Life Lessons Monorepo

This directory contains all applications in the Life Lessons monorepo.

## 📁 Structure

```
apps/
├── api/          ✅ NestJS backend (complete)
├── web/          ✅ Next.js frontend (complete)
└── mobile/       ⏳ Expo mobile app (TODO)
```

## 🖥️ Backend API (`apps/api`)

**Framework**: NestJS 10 + Prisma + PostgreSQL

### Key Modules
- **auth/** - JWT authentication (signup/login/refresh)
- **users/** - User profile management
- **lessons/** - Core CRUD + search + AI analysis
- **goals/** - 10,000 lesson goal tracking + sprints
- **ai/** - Mock analysis service
- **analytics/** - Dashboard stats (streak, heatmap)
- **reminders/** - Notification system (scaffold)
- **groups/** - Community features (scaffold)
- **concepts/** - Knowledge base (scaffold)

### Development
```bash
cd apps/api
pnpm install
pnpm start:dev      # http://localhost:3001
```

### Testing
```bash
pnpm test           # Unit tests
pnpm test:e2e       # E2E tests
pnpm test:cov       # Coverage report
```

### Documentation
- Swagger: http://localhost:3001/docs
- See: `apps/api/README.md`

---

## 🌐 Web Frontend (`apps/web`)

**Framework**: Next.js 15 (App Router) + React 18

### Pages
- **(auth)/** - Login/Signup
- **dashboard/** - Main dashboard with Quick Capture
- **journal/** - Lesson list + detail with AI analysis
- **goals/** - Progress tracking + sprint visualization
- **community/** - Social features (scaffold)
- **settings/** - User settings (account, privacy, reminders, export)

### Development
```bash
cd apps/web
pnpm install
pnpm dev            # http://localhost:3000
```

### Build
```bash
pnpm build          # Production build
pnpm start          # Start production server
```

### Tech Stack
- **UI**: TailwindCSS + shadcn/ui (TODO)
- **State**: React Query + Zustand
- **API**: Axios with interceptors
- **Types**: TypeScript (shared with backend via Prisma)

---

## 📱 Mobile App (`apps/mobile`)

**Status**: ⏳ TODO (Phase 2)

**Framework**: React Native + Expo

### Planned Features
- Quick Capture with voice recording
- Offline-first with SQLite
- Push notifications
- Background sync
- Native sharing

### Setup (when ready)
```bash
cd apps
npx create-expo-app@latest mobile --template tabs
cd mobile
pnpm install
pnpm start
```

See: [`MOBILE_GUIDE.md`](../MOBILE_GUIDE.md) for detailed plan

---

## 🔗 Inter-App Communication

### Web → API
- REST API calls via Axios
- JWT bearer token authentication
- Base URL: `http://localhost:3001` (dev)

### Mobile → API
- Same REST endpoints as web
- Offline queue for sync
- Token stored in SecureStore

### Shared Types
```typescript
// Generated from Prisma schema
import { User, Lesson, Goal } from '@prisma/client';
```

---

## 🚀 Running All Apps

### Method 1: Individual Terminals
```bash
# Terminal 1: Backend
cd apps/api && pnpm start:dev

# Terminal 2: Web
cd apps/web && pnpm dev

# Terminal 3: Mobile (when ready)
cd apps/mobile && pnpm start
```

### Method 2: Concurrently (from root)
```bash
# TODO: Add to root package.json
pnpm dev
```

---

## 📊 Status Overview

| App | Status | Pages/Modules | Completion |
|-----|--------|---------------|------------|
| **api** | ✅ Working | 8 modules | 75% (3 scaffold) |
| **web** | ✅ Working | 7 pages | 100% MVP |
| **mobile** | ⏳ TODO | 0 screens | 0% |

---

## 🎯 MVP Acceptance Criteria

### Backend ✅
- [x] Authentication working
- [x] Lessons CRUD functional
- [x] AI analysis (mock)
- [x] Goals tracking
- [x] Analytics calculations
- [ ] Reminders (structure ready)
- [ ] Export endpoints

### Frontend ✅
- [x] Login/Signup flows
- [x] Dashboard with Quick Capture
- [x] Journal list + detail
- [x] AI analysis UI
- [x] Goals progress view
- [x] Settings pages
- [x] Dark mode support

### Mobile ⏳
- [ ] TBD (Phase 2)

---

## 🔧 Development Tips

### Hot Reload
- Backend: Auto-restart on file changes (NestJS)
- Web: Fast Refresh (Next.js)
- Mobile: Expo Go instant updates

### Debugging
- Backend: VSCode debugger attach to :9229
- Web: Chrome DevTools + React DevTools
- Mobile: React Native Debugger

### Database Changes
```bash
# 1. Edit prisma/schema.prisma
# 2. Generate migration
npx prisma migrate dev --name your_change

# 3. Regenerate client
npx prisma generate

# 4. Restart backend
cd apps/api && pnpm start:dev
```

---

## 📚 Documentation

- Root: `README.md` - Main documentation
- Backend: `apps/api/README.md` - API docs
- Frontend: `apps/web/README.md` - Web docs
- Mobile: `MOBILE_GUIDE.md` - Mobile plan

---

## 🆘 Troubleshooting

### "Cannot find module '@prisma/client'"
```bash
npx prisma generate
```

### Backend won't start
```bash
# Check database connection
docker-compose ps
# Restart if needed
docker-compose restart db
```

### Frontend build errors
```bash
# Clear Next.js cache
cd apps/web
rm -rf .next
pnpm dev
```

### Port conflicts
- Backend: Change `API_PORT` in `.env`
- Frontend: `pnpm dev -p 3002`

---

For detailed setup instructions, see [`QUICKSTART.md`](../QUICKSTART.md)
