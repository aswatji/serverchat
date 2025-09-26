# CapRover Deployment Guide - Updated (No Prisma)

Panduan untuk deploy Chat Server ke CapRover tanpa Prisma.

## Files yang Diperlukan

✅ Sudah tersedia:

- `captain-definition` - Konfigurasi CapRover
- `Dockerfile` - Container build instructions (simplified)
- `.dockerignore` - Optimasi build
- `database-schema.sql` - Manual database setup

## Environment Variables di CapRover

Set environment variables berikut di CapRover dashboard:

### Required Variables:

```
DATABASE_URL=postgresql://username:password@host:port/database
PORT=80
NODE_ENV=production
```

### Optional Variables:

```
CORS_ORIGIN=*
```

## Setup Database Manual

Sebelum deployment, setup database schema terlebih dahulu:

```bash
# Connect ke PostgreSQL database dan jalankan:
psql -d your_database -f database-schema.sql
```

## Deployment Steps

1. **Setup Database Schema**
   - Jalankan `database-schema.sql` di PostgreSQL database Anda

2. **Set Environment Variables di CapRover**
   - `DATABASE_URL`: Connection string PostgreSQL Anda
   - `PORT`: 80 (default untuk CapRover)
   - `NODE_ENV`: production

3. **Deploy via Git atau Tar**
   - Push ke repository atau upload tar file
   - CapRover akan otomatis build dengan Dockerfile

## Troubleshooting

### 1. Database Connection Error:
```
Solution: Pastikan DATABASE_URL benar dan database dapat diakses dari container
```

### 2. Port Binding Error:
```
Solution: PORT sudah otomatis di-set ke 80 di Dockerfile
```

### 3. Missing Tables Error:
```
Solution: Pastikan database-schema.sql sudah dijalankan di database
```

## Benefits Tanpa Prisma

✅ **Build lebih cepat** - Tidak perlu generate Prisma client  
✅ **Image lebih kecil** - Tidak ada Prisma binaries  
✅ **Deployment lebih stabil** - Tidak ada masalah OpenSSL compatibility  
✅ **Debug lebih mudah** - SQL queries langsung terlihat  

## Captain Definition

File `captain-definition`:

```json
{
  "schemaVersion": 2,
  "dockerfilePath": "./Dockerfile"
}
```

## Dockerfile Summary

- Base: `node:18-slim`
- Dependencies: `pg`, `socket.io`, `express`
- Port: 80
- Command: `node index.js`

Deployment sekarang jauh lebih simple dan reliable!