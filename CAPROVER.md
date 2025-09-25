# CapRover Deployment Guide

Panduan untuk deploy Chat Server ke CapRover.

## Files yang Diperlukan

✅ Sudah tersedia:
- `captain-definition` - Konfigurasi CapRover
- `Dockerfile` - Container build instructions  
- `start.sh` - Startup script dengan migration
- `.dockerignore` - Optimasi build

## Environment Variables di CapRover

Set environment variables berikut di CapRover dashboard:

### Required Variables:
```
DATABASE_URL=postgresql://postgres:72e731d037f53f07@178.128.49.224:5432/serverchat?schema=public
PORT=80
NODE_ENV=production
```

### Optional Variables:
```
REDIS_URL=redis://your-redis-host:6379
```

## Deployment Steps

### 1. Persiapkan Repository
```bash
git add .
git commit -m "Add CapRover deployment files"
git push origin main
```

### 2. Setup di CapRover Dashboard

1. **Create New App:**
   - App Name: `chatserver` (atau nama lain)
   - Choose deployment method: `Deploy from Github/Bitbucket/Gitlab`

2. **Connect Repository:**
   - Repository: `https://github.com/aswatji/serverchat`
   - Branch: `main`
   - Username: `aswatji`
   - Password/Token: `[your-github-token]`

3. **Set Environment Variables:**
   ```
   DATABASE_URL=postgresql://postgres:72e731d037f53f07@178.128.49.224:5432/serverchat?schema=public
   PORT=80
   NODE_ENV=production
   ```

4. **Deploy:**
   - Click "Force Build"
   - Monitor deployment logs

### 3. Verify Deployment

Setelah deployment sukses, test endpoints:

```bash
# Health check
curl https://chatserver.your-caprover-domain.com/

# API test
curl https://chatserver.your-caprover-domain.com/api/users
```

## Troubleshooting

### Common Issues:

1. **Database Migration Fails:**
   ```
   Solution: Check DATABASE_URL environment variable
   ```

2. **Port Issues:**
   ```
   Solution: Ensure PORT=80 in environment variables
   ```

3. **Build Timeout:**
   ```
   Solution: Increase build timeout in CapRover settings
   ```

4. **Prisma Client Error:**
   ```
   Solution: Check if prisma generate runs successfully in build logs
   ```

### Check Logs:

```bash
# Via CapRover dashboard
App → Monitoring → View Logs

# Via CLI
caprover logs --name chatserver
```

## Performance Settings

### Recommended CapRover Settings:

```json
{
  "instanceCount": 1,
  "captain-definition": {
    "schemaVersion": 2,
    "dockerfilePath": "./Dockerfile"
  },
  "containerHttpPort": 80,
  "notExposeAsWebApp": false,
  "customNginxConfig": "",
  "preDeployFunction": "",
  "serviceUpdateOverride": ""
}
```

### Resource Limits:

- **Memory:** 512MB minimum
- **CPU:** 0.5 cores minimum

## SSL & Domain

1. **Enable HTTPS:**
   - CapRover dashboard → Apps → [your-app] → HTTP Settings
   - Enable "HTTPS" 
   - Enable "Force HTTPS"

2. **Custom Domain:**
   - Add custom domain in CapRover
   - Update DNS settings
   - Enable SSL certificate

## Scaling

### Horizontal Scaling:
```bash
# Increase instance count in CapRover dashboard
instanceCount: 2
```

### Database Connection Pooling:
Update `DATABASE_URL` to include connection pooling:
```
DATABASE_URL="postgresql://postgres:72e731d037f53f07@178.128.49.224:5432/serverchat?schema=public&connection_limit=10&pool_timeout=20"
```

## Monitoring

### Health Checks:
- CapRover automatically monitors container health
- Custom health check endpoint: `/`
- WebSocket monitoring: Auto-enabled

### Logs:
- Application logs: Available in CapRover dashboard
- Database logs: Check external PostgreSQL server
- Access logs: Via CapRover nginx logs

## Backup Strategy

### Database Backup:
```bash
# Automated backup (set up cron job)
pg_dump -h 178.128.49.224 -U postgres -d serverchat > backup_$(date +%Y%m%d).sql
```

### Application Backup:
- Source code: Git repository
- Configuration: CapRover app config export
- Environment variables: Document securely

## Security

### Environment Variables:
- Never commit sensitive data to git
- Use CapRover's secret management
- Rotate database passwords regularly

### Network Security:
- Use HTTPS only in production
- Configure CORS properly
- Implement rate limiting

## Updates & Maintenance

### Code Updates:
```bash
# Push code changes
git push origin main

# Trigger rebuild in CapRover
# Or use webhook for auto-deployment
```

### Database Updates:
```bash
# Migration will run automatically on deployment via start.sh
# Or run manually via CapRover terminal:
npx prisma migrate deploy
```