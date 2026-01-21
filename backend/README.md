# One Aftersales Backend API

Complete Express.js + TypeScript backend for the One Aftersales platform.

## Installation

```bash
cd backend
npm install
```

## Environment Setup

Create `.env` file in the backend directory:

```bash
cp ../.env.example .env
```

Update database credentials and other settings.

## Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE oneaftersales;

# Run schema
psql -U postgres -d oneaftersales -f database/schema.sql

# Run seed data
psql -U postgres -d oneaftersales -f database/seed.sql
```

## Development

```bash
npm run dev
```

API will be available at `http://localhost:3000/api/v1`

## Production Build

```bash
npm run build
npm start
```

## API Endpoints

See `/API_DOCUMENTATION.md` for complete API reference.

### Test Credentials

```
Super Admin:
  Email: superadmin@oneaftersales.com
  Password: Admin@123

Manufacturer Admin:
  Email: admin@volkswagen.com
  Password: Admin@123

Master Technician:
  Email: mt@dealer1.com
  Password: Dealer@123

Service Manager:
  Email: sm@dealer1.com
  Password: Dealer@123
```

## Health Check

```bash
curl http://localhost:3000/health
```

## Features

✅ JWT Authentication
✅ Role-based access control
✅ Module-level permissions
✅ Rate limiting
✅ Session management
✅ Audit logging
✅ Error handling
✅ PostgreSQL integration
✅ Redis sessions
✅ TypeScript
