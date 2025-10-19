# CKB Quick Reference

## 🚀 Quick Commands

```bash
# Seed database
pnpm ts-node scripts/seed.ts

# Start API
cd apps/api && pnpm dev

# Test API
.\test-ckb-api.ps1

# Build API
cd apps/api && pnpm build

# Generate Prisma Client
pnpm prisma generate

# View DB
pnpm prisma studio
```

## 📡 Key Endpoints

```
Public:
  GET  /concepts/categories
  GET  /concepts/search?q=...&difficulty=...
  GET  /concepts/:id

Admin:
  POST /concepts (create)
  POST /concepts/bulk-import (import many)
  
User:
  POST /concepts/:id/progress (track learning)
```

## 📚 Documentation

- **Plan:** CKB_IMPLEMENTATION_PLAN.md
- **Complete:** CKB_IMPLEMENTATION_COMPLETE.md
- **Guide:** CKB_USER_GUIDE.md
- **Summary:** CKB_SUMMARY_REPORT.md
- **This:** CKB_QUICK_REFERENCE.md

## 🎯 What's Done

✅ Database (10 models)
✅ API (25+ endpoints)
✅ Seed (5 concepts)
✅ Docs (4 files)
✅ Tests (1 script)

## 🔜 What's Next

❌ Frontend components
❌ AI integration
❌ More concepts (50+)
❌ Vector search
❌ Mobile app
