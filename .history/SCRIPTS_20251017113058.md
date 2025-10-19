# 🚀 Quick Start Scripts

Chọn script phù hợp với hệ điều hành của bạn.

## Windows (PowerShell)

```powershell
# Chạy setup script
.\setup.ps1

# Hoặc chạy từng bước:
pnpm install
npx prisma generate
docker-compose up -d
npx prisma migrate dev
npx ts-node scripts/seed.ts
```

## macOS / Linux (Bash)

```bash
# Cấp quyền thực thi
chmod +x setup.sh

# Chạy setup script
./setup.sh

# Hoặc chạy từng bước:
pnpm install
npx prisma generate
docker-compose up -d
npx prisma migrate dev
npx ts-node scripts/seed.ts
```

## Start Development Servers

### Backend (Terminal 1)
```powershell
cd apps/api
pnpm start:dev
```

### Frontend (Terminal 2)
```powershell
cd apps/web
pnpm dev
```

## Access Application

- **Web App**: http://localhost:3000
- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/docs
- **Prisma Studio**: `npx prisma studio` (http://localhost:5555)

## Demo Account

```
Email: demo@lifelessons.app
Password: Passw0rd!
```

## Troubleshooting

### Dependencies errors
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
pnpm install
npx prisma generate
```

### Database connection errors
```powershell
# Restart Docker containers
docker-compose down
docker-compose up -d

# Wait 10 seconds then retry
Start-Sleep -Seconds 10
npx prisma migrate dev
```

### Port already in use
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Or change port in apps/web/package.json
"dev": "next dev -p 3002"
```

## Environment Variables

File `.env` được tạo tự động từ `.env.example`. 

**Important variables:**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/lifelessons"
JWT_SECRET="change_me_in_production"
NEXT_PUBLIC_API_BASE_URL="http://localhost:3001"
```

## Docker Services

```powershell
# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (reset database)
docker-compose down -v
```

## Database Management

```powershell
# Open Prisma Studio
npx prisma studio

# Create new migration
npx prisma migrate dev --name your_migration_name

# Reset database (warning: deletes all data)
npx prisma migrate reset

# Re-seed
npx ts-node scripts/seed.ts
```

## Build for Production

```powershell
# Build backend
cd apps/api
pnpm build

# Build frontend
cd apps/web
pnpm build

# Start production
pnpm start
```

## Useful Commands

```powershell
# Format code
pnpm format

# Lint
pnpm lint

# Type check
pnpm type-check

# Run tests
pnpm test
```

---

Need help? Check [`QUICKSTART.md`](./QUICKSTART.md) for detailed guide.
