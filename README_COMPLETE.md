# One Aftersales Platform - Complete Application

## 🚀 Project Overview

A comprehensive dealer service management platform for Volkswagen/Skoda with role-based access control, supporting multiple modules for dealer and manufacturer operations.

## ✨ Features Implemented

### Authentication & Authorization
- ✅ Role-based access control (RBAC)
- ✅ Separate logins for dealer and manufacturer users
- ✅ JWT-based authentication (ready for backend integration)
- ✅ Protected routes with module-level permissions
- ✅ Session management

### User Roles
1. **Super Admin** - Full system access
2. **Manufacturer Admin** - All modules access
3. **Master Technician** - Dealer PCC, Surveys
4. **Service Manager** - API Registration, MT Meet, Surveys
5. **Service Head** - API Registration, MT Meet, Surveys
6. **Warranty Manager** - All surveys

### Modules

#### 1. Dealer PCC
- **Dealer Access**: Master Technician only
- **Manufacturer Access**: Admin (review, edit, approve)
- **Features**:
  - Create PCC applications
  - Individual dashboard with submission statistics
  - Status tracking (draft, pending, approved, rejected)

#### 2. API Registration
- **Dealer Access**: Service Manager/Service Head
- **Manufacturer Access**: Admin
- **Features**:
  - Register employees for API events
  - Track registrations
  - Event management

#### 3. MT Meet (Master Technician Meet)
- **Dealer Access**: Service Manager/Service Head
- **Manufacturer Access**: Admin
- **Features**:
  - Register for technician meetings
  - Attendance tracking
  - Statistics dashboard

#### 4. Workshop System Survey
- **Dealer Access**: Warranty Manager, Master Technician, Service Manager
- **Manufacturer Access**: Admin
- **Features**:
  - Submit survey responses
  - View submission history
  - Analytics dashboard

#### 5. Warranty Survey
- **Dealer Access**: Warranty Manager, Master Technician, Service Manager
- **Manufacturer Access**: Admin
- **Features**:
  - Warranty feedback submission
  - Response tracking
  - Analytics

#### 6. Technical Awareness Survey
- **Dealer Access**: Warranty Manager, Master Technician, Service Manager
- **Manufacturer Access**: Admin
- **Features**:
  - Technical knowledge assessment
  - Progress tracking
  - Performance analytics

## 🏗️ Tech Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.21** - Build tool
- **React Router 6.30.1** - Routing
- **TanStack Query 5.83.0** - Data fetching
- **Tailwind CSS 3.4.17** - Styling
- **Shadcn UI** - Component library
- **Zod** - Validation

### Backend (Ready for Implementation)
- Node.js + Express
- PostgreSQL - Database
- Redis - Session management
- JWT - Authentication
- Bcrypt - Password hashing

## 📁 Project Structure

```
dealer-pcc-api-other/
├── src/
│   ├── components/
│   │   ├── ui/               # Shadcn UI components
│   │   ├── ProtectedRoute.tsx
│   │   └── theme-provider.tsx
│   ├── contexts/
│   │   └── AuthContext.tsx   # Authentication state
│   ├── pages/
│   │   ├── modules/          # Module-specific pages
│   │   │   ├── DealerPCCPage.tsx
│   │   │   ├── APIRegistrationPage.tsx
│   │   │   ├── MTMeetPage.tsx
│   │   │   ├── WorkshopSurveyPage.tsx
│   │   │   ├── WarrantySurveyPage.tsx
│   │   │   └── TechnicalSurveyPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── UnauthorizedPage.tsx
│   ├── types/
│   │   └── auth.ts           # Type definitions
│   ├── lib/
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── vw-logo.svg
├── database/
│   └── (SQL schema files)
├── API_DOCUMENTATION.md
├── DATABASE_SCHEMA.md
├── SECURITY_GUIDE.md
├── DEPLOYMENT_GUIDE.md
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
└── .env.example
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/SKVWKunal/dealer-pcc-api-other.git
cd dealer-pcc-api-other

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit http://localhost:8080

### Test Credentials

**Dealer Login:**
- Email: any email
- Password: any password
- Type: Dealer

**Manufacturer Login:**
- Email: any email
- Password: any password
- Type: Manufacturer

*(Currently using mock authentication - implement real API as per API_DOCUMENTATION.md)*

## 🔐 Security Features

- JWT-based authentication
- Role-based access control (RBAC)
- Module-level permissions
- Protected routes
- Input validation with Zod
- XSS protection
- CSRF protection (ready for backend)
- Rate limiting (ready for backend)
- Audit logging (database ready)
- Session management

See [SECURITY_GUIDE.md](SECURITY_GUIDE.md) for detailed security implementation.

## 🗄️ Database

Complete PostgreSQL schema provided with:
- 13 core tables
- User management
- Role-based access
- Module tracking
- Audit logs
- Session management

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for full schema.

## 📡 API Endpoints

Comprehensive REST API documentation covering:
- Authentication
- User management
- All module CRUD operations
- Dashboard & analytics
- File uploads
- Notifications

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for full API reference.

## 🚢 Deployment

Multiple deployment options:

### Docker Compose (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for:
- AWS EC2 deployment
- Docker deployment
- PM2 process management
- Nginx configuration
- SSL setup
- Backup strategies

## 📊 Module Access Matrix

| Role | Dealer PCC | API Reg | MT Meet | Workshop | Warranty | Technical |
|------|-----------|---------|---------|----------|----------|-----------|
| Super Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manufacturer Admin | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Master Technician | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Service Manager | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Service Head | ❌ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Warranty Manager | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |

## 🛠️ Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npx tsc --noEmit

# Linting
npm run lint

# Run with Docker
docker-compose up -d
```

## 📝 Next Steps

### Backend Implementation
1. Create Express server with TypeScript
2. Implement authentication endpoints
3. Setup PostgreSQL with provided schema
4. Implement Redis session management
5. Create CRUD APIs for each module
6. Add file upload functionality
7. Implement email notifications
8. Setup monitoring and logging

### Module Enhancements
1. Define specific criteria for each module (awaiting requirements)
2. Create forms for data entry
3. Implement approval workflows
4. Add reporting and analytics
5. Create export functionality (PDF, CSV)
6. Add email notifications

## 🔒 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing key
- `REDIS_URL` - Redis connection
- `SMTP_*` - Email configuration

## 🤝 Contributing

This is a private repository. For questions or issues:
- Email: support@oneaftersales.com
- Internal issue tracker

## 📄 License

Proprietary - Volkswagen/Skoda Internal Use Only

## 👤 Author

**Kunal (SKVWKunal)**
- GitHub: [@SKVWKunal](https://github.com/SKVWKunal)
- Repository: [dealer-pcc-api-other](https://github.com/SKVWKunal/dealer-pcc-api-other)

## 📞 Support

For detailed module requirements and criteria definition, please provide:
1. Specific fields for PCC criteria
2. API registration requirements
3. Survey question structures
4. Approval workflow details
5. Dashboard metric specifications

---

**Status**: ✅ Frontend Complete | ⏳ Backend Ready for Implementation | 📋 Awaiting Module Requirements

**Version**: 1.0.0  
**Last Updated**: January 2026
