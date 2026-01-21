# Deployment Guide - One Aftersales Platform

## Prerequisites

### System Requirements
- Node.js 18+ and npm 9+
- PostgreSQL 14+ database
- Redis 6+ (for sessions and caching)
- 2GB+ RAM
- 20GB+ disk space

### Development Tools
- Git
- Docker & Docker Compose (recommended)
- PM2 (for production process management)

---

## Quick Start with Docker

### 1. Clone Repository
```bash
git clone https://github.com/SKVWKunal/dealer-pcc-api-other.git
cd dealer-pcc-api-other
```

### 2. Create Environment File
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start with Docker Compose
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database (port 5432)
- Redis (port 6379)
- Backend API (port 3000)
- Frontend (port 8080)

---

## Manual Deployment

### Frontend Deployment

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Build for Production
```bash
npm run build
```

#### 3. Preview Build
```bash
npm run preview
```

#### 4. Deploy to Server
```bash
# Copy dist/ folder to your web server
scp -r dist/* user@server:/var/www/oneaftersales/

# Or use nginx to serve
nginx -c /etc/nginx/nginx.conf
```

### Backend Deployment

#### 1. Create Backend Project
```bash
mkdir backend
cd backend
npm init -y
```

#### 2. Install Dependencies
```bash
npm install express cors helmet express-rate-limit
npm install bcryptjs jsonwebtoken
npm install pg redis connect-redis express-session
npm install zod validator
npm install dotenv winston
npm install --save-dev typescript @types/node @types/express
npm install --save-dev ts-node nodemon
```

#### 3. Setup Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE oneaftersales;

# Run migrations
psql -U postgres -d oneaftersales -f database/schema.sql
```

#### 4. Start Backend
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

---

## Docker Configuration

### docker-compose.yml
```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: oneaftersales-db
    environment:
      POSTGRES_DB: oneaftersales
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: oneaftersales-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: oneaftersales-api
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/oneaftersales
      REDIS_URL: redis://redis:6379
    ports:
      - "3000:3000"
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    volumes:
      - ./backend:/app
      - /app/node_modules
      - ./uploads:/app/uploads

  # Frontend
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: oneaftersales-web
    ports:
      - "8080:80"
    depends_on:
      - backend
    restart: unless-stopped

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: oneaftersales-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - frontend
      - backend
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

### Frontend Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Backend Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/index.js"]
```

---

## Nginx Configuration

### nginx/nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:3000;
    }

    server {
        listen 80;
        server_name oneaftersales.com www.oneaftersales.com;

        # Redirect to HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name oneaftersales.com www.oneaftersales.com;

        ssl_certificate /etc/nginx/ssl/certificate.crt;
        ssl_certificate_key /etc/nginx/ssl/private.key;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

---

## Production Deployment with PM2

### ecosystem.config.js
```javascript
module.exports = {
  apps: [
    {
      name: 'oneaftersales-api',
      script: './dist/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    },
  ],
};
```

### PM2 Commands
```bash
# Start application
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# View logs
pm2 logs

# Restart
pm2 restart oneaftersales-api

# Stop
pm2 stop oneaftersales-api

# Auto-start on reboot
pm2 startup
pm2 save
```

---

## AWS Deployment

### Using EC2

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t3.medium or larger
   - Configure security groups (80, 443, 22)

2. **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

3. **Deploy Application**
```bash
# Clone repository
git clone https://github.com/SKVWKunal/dealer-pcc-api-other.git
cd dealer-pcc-api-other

# Setup environment
cp .env.example .env
nano .env

# Build and start
docker-compose up -d
```

### Using AWS RDS for PostgreSQL
```bash
# Update DATABASE_URL in .env
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/oneaftersales
```

### Using AWS ElastiCache for Redis
```bash
# Update REDIS_URL in .env
REDIS_URL=redis://your-elasticache-endpoint:6379
```

---

## SSL Certificate Setup

### Using Let's Encrypt (Free)
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d oneaftersales.com -d www.oneaftersales.com

# Auto-renewal
sudo certbot renew --dry-run
```

---

## Backup Strategy

### Database Backup Script
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="oneaftersales"

# Create backup
pg_dump -U postgres $DB_NAME | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

### Setup Cron Job
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

## Monitoring & Logging

### Setup Log Rotation
```bash
# /etc/logrotate.d/oneaftersales
/var/log/oneaftersales/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

### Health Check Endpoint
```typescript
// Add to backend
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
```

---

## Troubleshooting

### Check Logs
```bash
# Backend logs
pm2 logs oneaftersales-api

# Nginx logs
tail -f /var/log/nginx/error.log

# PostgreSQL logs
tail -f /var/log/postgresql/postgresql-15-main.log

# Docker logs
docker-compose logs -f
```

### Common Issues

**Database Connection Error**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -U postgres -d oneaftersales -c "SELECT 1;"
```

**Port Already in Use**
```bash
# Find process using port
sudo lsof -i :3000

# Kill process
kill -9 <PID>
```

---

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Super admin user created
- [ ] SSL certificate installed
- [ ] Firewall rules configured
- [ ] Backup cron job setup
- [ ] Log rotation configured
- [ ] PM2 startup script enabled
- [ ] Health check endpoint tested
- [ ] Rate limiting verified
- [ ] CORS configuration tested
- [ ] Error monitoring setup
- [ ] Performance monitoring enabled

---

## Support

For deployment issues, please contact:
- Email: support@oneaftersales.com
- GitHub Issues: https://github.com/SKVWKunal/dealer-pcc-api-other/issues
