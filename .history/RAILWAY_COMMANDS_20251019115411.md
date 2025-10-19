# Railway Deployment Commands Quick Reference

## 🚀 One-Time Setup

```powershell
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Link to your project (run in project root)
railway link

# Verify connection
railway status
```

---

## 📦 Database Operations

```powershell
# Run Prisma migrations
railway run npx prisma migrate deploy

# Generate Prisma Client
railway run npx prisma generate

# Seed database
railway run npx ts-node scripts/seed.ts

# Seed concepts (CKB)
railway run npx ts-node scripts/seed-concepts.ts

# Open Prisma Studio (view data)
railway run npx prisma studio
```

---

## 🔧 Service Management

```powershell
# View service status
railway status

# View real-time logs
railway logs

# View logs for specific service
railway logs --service=lifelessons-api

# Restart service
railway restart

# Open Railway dashboard
railway open
```

---

## 🗄️ Database Management

```powershell
# Connect to PostgreSQL shell
railway connect Postgres

# Backup database
railway run pg_dump $DATABASE_URL > backup_$(Get-Date -Format "yyyyMMdd").sql

# Restore database
Get-Content backup.sql | railway run psql $DATABASE_URL

# Reset database (⚠️ CAREFUL!)
railway run npx prisma migrate reset --force
```

---

## 🐛 Debugging

```powershell
# Run any command in Railway environment
railway run <your-command>

# Example: Check Node version
railway run node --version

# Example: Check environment variables
railway run printenv

# Example: Test database connection
railway run npx prisma db push --accept-data-loss

# SSH into service (if available)
railway shell
```

---

## 📊 Environment Variables

```powershell
# List all variables
railway variables

# Add variable
railway variables set KEY=VALUE

# Add multiple variables from file
railway variables set --from-file .env.production

# Delete variable
railway variables delete KEY
```

---

## 🚀 Deployment

```powershell
# Trigger manual deployment
railway up

# Deploy specific service
railway up --service=lifelessons-api

# View deployment status
railway status
```

---

## 🔍 Health Check

```powershell
# Test API endpoint
curl https://your-app.up.railway.app/api/health

# Test with authentication
$token = "your-jwt-token"
curl -H "Authorization: Bearer $token" https://your-app.up.railway.app/api/me

# Load test (simple)
for ($i=1; $i -le 100; $i++) { 
  curl https://your-app.up.railway.app/api/health 
}
```

---

## 📝 Common Tasks

### Initial Deployment
```powershell
# 1. Login and link
railway login
railway link

# 2. Run migrations
railway run npx prisma migrate deploy

# 3. Seed data
railway run npx ts-node scripts/seed.ts

# 4. Verify
curl https://your-app.up.railway.app/api/health
```

### Update Deployment
```powershell
# 1. Push code to GitHub
git add .
git commit -m "Update feature"
git push origin main

# 2. Railway auto-deploys
# Check logs:
railway logs

# 3. If migrations needed:
railway run npx prisma migrate deploy
```

### Rollback
```powershell
# 1. Go to Railway dashboard
railway open

# 2. Deployments tab → Click previous deployment
# 3. Click "Redeploy"

# Or use git:
git revert HEAD
git push origin main
```

---

## 🎯 Production Checklist

```powershell
# Run before going live:

# 1. Check environment variables
railway variables

# 2. Verify database connection
railway run npx prisma db push --accept-data-loss

# 3. Run migrations
railway run npx prisma migrate deploy

# 4. Seed initial data
railway run npx ts-node scripts/seed.ts

# 5. Test health endpoint
curl https://your-app.up.railway.app/api/health

# 6. Test Swagger docs
# Open: https://your-app.up.railway.app/api/docs

# 7. Check logs for errors
railway logs --since 10m
```

---

## 🔐 Security Commands

```powershell
# Rotate JWT secret (⚠️ logs out all users)
$newSecret = node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
railway variables set JWT_SECRET=$newSecret

# Update CORS for new domain
railway variables set ALLOWED_ORIGINS=https://newdomain.com,https://www.newdomain.com

# Enable production mode
railway variables set NODE_ENV=production
```

---

## 📈 Monitoring

```powershell
# Tail logs (keep terminal open)
railway logs --follow

# Filter logs by level
railway logs | Select-String "ERROR"
railway logs | Select-String "WARN"

# Export logs to file
railway logs --since 24h > logs_$(Get-Date -Format "yyyyMMdd").txt
```

---

## 🛠️ Troubleshooting

### Service not starting
```powershell
# Check recent logs
railway logs --since 5m

# Verify environment
railway run printenv | Select-String "DATABASE"

# Test manually
railway run node apps/api/dist/main.js
```

### Database connection issues
```powershell
# Verify DATABASE_URL
railway variables | Select-String "DATABASE"

# Test connection
railway run npx prisma db pull

# Reset connection
railway restart
```

### Migration errors
```powershell
# View migration status
railway run npx prisma migrate status

# Force sync schema (⚠️ can lose data)
railway run npx prisma db push --accept-data-loss

# Resolve migration conflicts
railway run npx prisma migrate resolve --applied <migration-name>
```

---

## 🔄 CI/CD Integration

### GitHub Actions (optional)
```yaml
# .github/workflows/deploy-railway.yml
name: Deploy to Railway
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Install Railway CLI
        run: npm install -g @railway/cli
      
      - name: Deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          railway up --detach
          railway run npx prisma migrate deploy
```

Get `RAILWAY_TOKEN`:
```powershell
railway login --browserless
# Copy token to GitHub Secrets
```

---

## 📚 Helpful Aliases (add to PowerShell profile)

```powershell
# Edit: notepad $PROFILE

# Add these functions:
function rl { railway logs --follow }
function rs { railway status }
function rr { railway restart }
function rd { railway run npx prisma migrate deploy }
function rseed { railway run npx ts-node scripts/seed.ts }
```

Then use:
```powershell
rl    # View logs
rs    # Check status
rr    # Restart
rd    # Deploy migrations
rseed # Seed data
```

---

## 🆘 Emergency Commands

```powershell
# Service down? Force restart
railway restart --force

# Database corrupted? Restore from backup
Get-Content backup.sql | railway run psql $DATABASE_URL

# Reset everything (⚠️ NUCLEAR OPTION)
railway run npx prisma migrate reset --force
railway run npx ts-node scripts/seed.ts

# Check Railway status
curl https://status.railway.app/api/v2/status.json
```

---

## 📞 Get Help

```powershell
# Railway CLI help
railway --help
railway <command> --help

# Check version
railway --version

# Update CLI
npm update -g @railway/cli
```

---

**Pro Tips:**
- Always test commands with `railway run` before scripting
- Use `railway logs --follow` during deployments
- Keep backups before major migrations
- Set up alerts via Railway webhooks
