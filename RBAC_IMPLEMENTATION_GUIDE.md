# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This document provides a comprehensive guide to the Role-Based Access Control (RBAC) system implemented in the Dealer Portal. The system supports multiple roles, dynamic features, and a manufacturer approval workflow.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Roles and Features](#roles-and-features)
3. [Database Schema](#database-schema)
4. [Configuration](#configuration)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Approval Workflow](#approval-workflow)
8. [API Endpoints](#api-endpoints)
9. [Example Usage](#example-usage)
10. [Security Considerations](#security-considerations)

---

## Architecture Overview

The RBAC system is built on the following principles:

- **Single Source of Truth**: Role-to-feature mappings are centralized in configuration files
- **Scalable Design**: Easy to add new roles and features without code changes
- **Multi-role Support**: Users can have multiple roles simultaneously
- **Approval-Based**: Dealer users must be approved by manufacturers before accessing the portal
- **Backend-Enforced**: All authorization checks are enforced on the backend
- **Dynamic Frontend**: UI dynamically renders features based on user's roles

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                         │
├─────────────────────────────────────────────────────────────┤
│  • Registration Pages                                       │
│  • Dynamic Dashboard with Feature Tiles                     │
│  • Admin Approval Interface                                 │
│  • Role-Based Form Fields                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       API Layer                             │
├─────────────────────────────────────────────────────────────┤
│  • Registration APIs                                        │
│  • Approval Workflow APIs                                   │
│  • User Profile & Features APIs                             │
│  • RBAC Middleware & Guards                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Database Layer                         │
├─────────────────────────────────────────────────────────────┤
│  • Users Table                                              │
│  • Roles Table                                              │
│  • Features Table                                           │
│  • Role-Feature Permissions                                 │
│  • User Roles (Many-to-Many)                                │
│  • Registration Requests                                    │
│  • Approval Status                                          │
└─────────────────────────────────────────────────────────────┘
```

---

## Roles and Features

### Available Roles

```typescript
DEALER_GM = 'dealer_gm'                    // Dealer General Manager
SERVICE_HEAD = 'service_head'              // Service Department Head
SERVICE_MANAGER = 'service_manager'        // Service Department Manager
MASTER_TECHNICIAN = 'master_technician'   // Master Level Technician
WARRANTY_MANAGER = 'warranty_manager'      // Warranty Department Manager
```

### Available Features

```typescript
API_REGISTRATION = 'api_registration'           // API Awareness Events
MT_MEET = 'mt_meet'                             // Master Technician Meetings
WORKSHOP_SURVEY = 'workshop_survey'             // Workshop Performance Surveys
WARRANTY_SURVEY = 'warranty_survey'             // Warranty Information
TECHNICAL_AWARENESS = 'technical_awareness'     // Technical Training
DATABASE = 'database'                           // Dealer Database Access
```

### Role-Feature Permission Matrix

| Role | API Reg | MT Meet | Workshop Survey | Warranty Survey | Technical Awareness | Database |
|------|---------|---------|-----------------|-----------------|---------------------|----------|
| Dealer GM | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Service Head | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Service Manager | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| Master Technician | ❌ | ✅ | ✅ | ❌ | ✅ | ✅ |
| Warranty Manager | ❌ | ❌ | ✅ | ✅ | ❌ | ✅ |

---

## Database Schema

### Key Tables

#### 1. roles

```sql
CREATE TABLE roles (
  id UUID PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,           -- 'dealer_gm', 'service_head', etc.
  description TEXT,
  display_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. features

```sql
CREATE TABLE features (
  id UUID PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,          -- 'api_registration', 'mt_meet', etc.
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  route_path VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 3. role_feature_permissions

```sql
CREATE TABLE role_feature_permissions (
  id UUID PRIMARY KEY,
  role_id UUID REFERENCES roles(id),
  feature_id UUID REFERENCES features(id),
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, feature_id)
);
```

#### 4. user_roles (Many-to-Many)

```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  UNIQUE(user_id, role_id)
);
```

#### 5. dealer_registration_requests

```sql
CREATE TABLE dealer_registration_requests (
  id UUID PRIMARY KEY,
  dealer_code VARCHAR(50) NOT NULL,
  dealer_name VARCHAR(255) NOT NULL,
  brand VARCHAR(50) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  requested_role VARCHAR(50) NOT NULL,
  additional_info JSONB,                     -- Role-specific data
  status VARCHAR(20) DEFAULT 'pending',      -- 'pending', 'approved', 'rejected'
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 6. user_approval_status

```sql
CREATE TABLE user_approval_status (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  registration_request_id UUID REFERENCES dealer_registration_requests(id),
  status VARCHAR(20) DEFAULT 'pending',      -- 'pending', 'approved', 'rejected'
  approval_date TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Configuration

### RBAC Configuration File

Location: `/backend/src/config/rbac.config.ts` and `/src/config/rbac.config.ts`

This is the **single source of truth** for roles, features, and permissions. Keep frontend and backend configs synchronized.

```typescript
// Define roles
export const ROLES = {
  DEALER_GM: 'dealer_gm',
  SERVICE_HEAD: 'service_head',
  // ... etc
};

// Define features
export const FEATURES = {
  API_REGISTRATION: 'api_registration',
  MT_MEET: 'mt_meet',
  // ... etc
};

// Map roles to features
export const ROLE_FEATURE_PERMISSIONS = {
  [ROLES.DEALER_GM]: [FEATURES.API_REGISTRATION],
  [ROLES.SERVICE_HEAD]: [FEATURES.API_REGISTRATION],
  // ... etc
};

// Define role-specific form fields
export const ROLE_SPECIFIC_FIELDS = {
  [ROLES.MASTER_TECHNICIAN]: {
    fields: ['technician_id', 'certification_level', 'specialization', 'experience_years'],
    description: 'Master Level Technician',
  },
  // ... etc
};
```

---

## Backend Implementation

### Middleware

#### Authentication Middleware

```typescript
// File: /backend/src/middleware/auth.middleware.ts
export const authenticate = (req, res, next) => {
  // Verify JWT token and attach user to request
  const token = req.headers.authorization?.substring(7);
  const decoded = verifyAccessToken(token);
  req.user = decoded;
  next();
};
```

#### RBAC Middleware

```typescript
// File: /backend/src/middleware/rbac.middleware.ts

// Check if user is approved
export const checkApprovalStatus = async (req, res, next) => {
  const approvalResult = await query(
    `SELECT status FROM user_approval_status WHERE user_id = $1`,
    [req.user.userId]
  );
  
  if (approvalResult.rows[0].status !== 'approved') {
    return res.status(403).json({ error: 'NOT_APPROVED' });
  }
  next();
};

// Check if user has required role
export const authorizeByRole = (allowedRoles) => {
  return async (req, res, next) => {
    const userRoles = await query(
      `SELECT r.name FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       WHERE ur.user_id = $1`,
      [req.user.userId]
    );
    
    if (!userRoles.some(r => allowedRoles.includes(r.name))) {
      return res.status(403).json({ error: 'FORBIDDEN' });
    }
    next();
  };
};

// Check if user has access to feature
export const authorizeByFeature = (featureSlugs) => {
  return async (req, res, next) => {
    // Query role_feature_permissions table
    // Verify user has at least one role with access to the feature
  };
};
```

### API Routes

#### Registration Routes

```typescript
// File: /backend/src/routes/registration.routes.ts

// POST /api/v1/auth/dealer/register
// Public endpoint - users submit registration requests

// GET /api/v1/auth/dealer/registration-status/:email
// Public endpoint - check registration/approval status

// POST /api/v1/auth/admin/registrations/:id/approve
// Protected endpoint - manufacturer approves registration

// POST /api/v1/auth/admin/registrations/:id/reject
// Protected endpoint - manufacturer rejects registration

// GET /api/v1/auth/admin/registrations/pending
// Protected endpoint - list pending registrations
```

#### User Profile & Features Routes

```typescript
// File: /backend/src/routes/rbac.routes.ts

// GET /api/v1/auth/user/profile
// Returns user data, roles, and accessible features

// GET /api/v1/auth/features
// Returns list of features accessible to user

// GET /api/v1/auth/features/:slug/access
// Check if user can access a specific feature
```

### Example: Protecting Routes with Middleware

```typescript
// Example 1: Protect API Registration route
router.post(
  '/api-registration',
  authenticate,
  checkApprovalStatus,
  authorizeByFeature(['api_registration']),
  async (req, res) => {
    // Handle API registration
  }
);

// Example 2: Admin-only endpoint
router.get(
  '/admin/registrations',
  authenticate,
  authorizeManufacturerAdmin,
  async (req, res) => {
    // List pending registrations
  }
);

// Example 3: Multiple role requirement
router.post(
  '/workshop-survey',
  authenticate,
  checkApprovalStatus,
  authorizeByRole(['master_technician', 'service_manager', 'warranty_manager']),
  async (req, res) => {
    // Handle workshop survey submission
  }
);
```

---

## Frontend Implementation

### Configuration

```typescript
// File: /src/config/rbac.config.ts
// Same structure as backend config
// Provides type-safe access to roles and features
```

### Components

#### Registration Page

```typescript
// File: /src/pages/DealerRegistrationPage.tsx
// Features:
// - Generic registration form
// - Role selection dropdown
// - Dynamic fields based on selected role
// - Form validation
// - Status tracking
```

#### Registration Status Page

```typescript
// File: /src/pages/RegistrationStatusPage.tsx
// Features:
// - Check registration status by email
// - Display approval/rejection status
// - Show rejection reason if applicable
// - Prompt for re-registration or login
```

#### Dashboard with Feature Tiles

```typescript
// File: /src/pages/DashboardPage.tsx
// Features:
// - Fetches user profile and accessible features
// - Displays feature tiles based on user roles
// - Shows user roles and dealer information
// - Shows approval status prominently
// - Permission badges on each tile (View, Create, Edit)
// - Responsive grid layout
```

#### Admin Approval Interface

```typescript
// File: /src/pages/AdminApprovalPage.tsx
// Features:
// - List pending registrations with pagination
// - View registration details
// - Approve with password setup and optional additional roles
// - Reject with required reason
// - Confirmation dialogs
// - Success/error notifications
```

### Context & Hooks

```typescript
// File: /src/contexts/AuthContext.tsx
// Provides:
// - user: Current logged-in user
// - login: Login function
// - logout: Logout function
// - isAuthenticated: Auth status

// Usage:
const { user, login, logout } = useAuth();
```

---

## Approval Workflow

### Step-by-Step Flow

```
1. Dealer User Registration
   ├─ User fills registration form
   ├─ Selects role and role-specific fields
   ├─ System creates registration request (status: pending)
   └─ User sees "Pending Approval" message

2. Status Check
   ├─ User can check registration status anytime
   ├─ System shows: Pending, Approved, or Rejected
   └─ If rejected, shows rejection reason

3. Manufacturer Review
   ├─ Admin views pending registrations
   ├─ Reviews user details
   └─ Approves or rejects

4. Approval Process
   ├─ Admin sets temporary password
   ├─ Can assign additional roles
   └─ System creates user account
      ├─ Creates user record
      ├─ Assigns requested role
      ├─ Assigns additional roles if specified
      └─ Sets approval status to 'approved'

5. User Login
   ├─ User logs in with email and password
   ├─ System checks approval status
   ├─ If approved: grants access
   ├─ If pending: shows "Under Review" message
   └─ If rejected: shows "Registration Rejected" message

6. Dashboard Access
   ├─ User sees dashboard with accessible features
   ├─ Features dynamically rendered based on roles
   └─ Permission badges shown for each feature
```

### Rejection Flow

```
1. Admin rejects registration with reason
   ├─ Reason stored in database
   └─ Registration status set to 'rejected'

2. User checks status
   ├─ Sees "Rejected" status
   ├─ Reads rejection reason
   └─ Option to re-register

3. User re-registers
   └─ Submission creates new registration request
```

---

## API Endpoints

### Authentication & Registration

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/dealer/register` | No | Submit dealer registration |
| GET | `/auth/dealer/registration-status/:email` | No | Check registration/approval status |
| POST | `/auth/login` | No | User login |
| POST | `/auth/refresh-token` | No | Refresh access token |

### User Profile & Features

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/user/profile` | Yes | Get user profile with roles and features |
| GET | `/auth/features` | Yes | Get accessible features |
| GET | `/auth/features/:slug/access` | Yes | Check feature access |

### Admin Approval Workflow

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/auth/admin/registrations` | Yes* | List registrations (with status filter) |
| GET | `/auth/admin/registrations/pending` | Yes* | List pending registrations |
| GET | `/auth/admin/registrations/:id` | Yes* | Get registration details |
| POST | `/auth/admin/registrations/:id/approve` | Yes* | Approve registration |
| POST | `/auth/admin/registrations/:id/reject` | Yes* | Reject registration |

*Auth required: Manufacturer admin only

### Request/Response Examples

#### Register Dealer User

**Request:**
```bash
POST /api/v1/auth/dealer/register
Content-Type: application/json

{
  "dealerCode": "VW001",
  "dealerName": "Premium Volkswagen",
  "userName": "John Doe",
  "email": "john@dealer.com",
  "mobileNumber": "9876543210",
  "selectedRole": "master_technician",
  "password": "SecurePass123",
  "additionalInfo": {
    "technician_id": "MT12345",
    "certification_level": "Level 3",
    "specialization": "Diagnostics",
    "experience_years": "8"
  }
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Registration request submitted successfully",
  "data": {
    "registrationId": "reg-123-uuid",
    "status": "pending",
    "submissionDate": "2026-01-26T10:30:00Z",
    "message": "Your registration is pending manufacturer approval..."
  }
}
```

#### Check Registration Status

**Request:**
```bash
GET /api/v1/auth/dealer/registration-status/john@dealer.com
```

**Response (Pending):**
```json
{
  "success": true,
  "data": {
    "stage": "registration",
    "status": "pending",
    "canLogin": false
  }
}
```

**Response (Approved):**
```json
{
  "success": true,
  "data": {
    "stage": "user",
    "approvalStatus": "approved",
    "isActive": true,
    "canLogin": true
  }
}
```

#### Get User Profile

**Request:**
```bash
GET /api/v1/auth/user/profile
Authorization: Bearer <access_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-123-uuid",
      "name": "John Doe",
      "email": "john@dealer.com",
      "dealerCode": "VW001",
      "dealerName": "Premium Volkswagen",
      "approvalStatus": "approved"
    },
    "roles": [
      {
        "id": "role-123-uuid",
        "name": "master_technician",
        "display_name": "Master Technician"
      }
    ],
    "features": [
      {
        "id": "feat-123-uuid",
        "slug": "mt_meet",
        "name": "MT Meet Registration",
        "description": "Register for Master Technician meetings",
        "routePath": "/modules/mt-meet",
        "permissions": {
          "canView": true,
          "canCreate": true,
          "canEdit": true
        }
      },
      // ... more features
    ]
  }
}
```

#### Approve Registration

**Request:**
```bash
POST /api/v1/auth/admin/registrations/reg-123-uuid/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "password": "TempPassword123",
  "additionalRoles": ["service_manager"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration approved successfully",
  "data": {
    "userId": "user-123-uuid",
    "email": "john@dealer.com",
    "userName": "John Doe",
    "role": "master_technician",
    "status": "approved"
  }
}
```

---

## Example Usage

### For Dealers

#### 1. Register as New User

```
1. Navigate to /dealer-register
2. Fill in dealer and personal information
3. Select role (e.g., Master Technician)
4. Fill in role-specific fields
5. Create password
6. Submit registration
7. See message: "Pending Approval"
```

#### 2. Check Registration Status

```
1. Navigate to /registration-status
2. Enter email address
3. System shows:
   - Pending: "Under Review (1-2 business days)"
   - Approved: "Ready to Login" button
   - Rejected: Reason displayed
```

#### 3. Access Dashboard

```
1. After approval, login with credentials
2. Dashboard shows accessible features based on role
3. Click feature tile to access
4. Permission badges show what you can do (View, Create, Edit)
```

### For Manufacturers

#### 1. Review Registrations

```
1. Navigate to /admin/approvals
2. View pending registration requests
3. Click "Details" to see complete information
4. Click "Approve" or "Reject"
```

#### 2. Approve Registration

```
1. Click "Approve" button
2. Enter temporary password
3. (Optional) Assign additional roles
4. Click "Approve Registration"
5. User can now log in
```

#### 3. Reject Registration

```
1. Click "Reject" button
2. Enter detailed rejection reason
3. Click "Reject Registration"
4. User sees reason on their status page
```

---

## Security Considerations

### 1. Password Security
- Passwords stored as bcrypt hashes
- Minimum 8 characters required
- Temporary passwords must be changed on first login
- Rate limiting on login attempts

### 2. Token Security
- JWT tokens with short expiration (typically 1 hour)
- Refresh tokens for obtaining new access tokens
- Tokens stored securely on frontend
- HTTPS only transmission

### 3. Authorization
- **Backend Enforced**: All permission checks on server
- **Defense in Depth**: Multiple middleware checks
  - Authentication check
  - Approval status check
  - Role-based authorization
  - Feature-based authorization
  - Action-based authorization

### 4. Audit Logging
- All approvals/rejections logged
- User actions tracked
- Admin activities recorded

### 5. Data Isolation
- Dealers see only their data
- Cross-dealer data access prevented
- Query-level filtering on dealer_id

### 6. API Security
- Rate limiting on all endpoints
- CORS properly configured
- CSRF protection enabled
- Input validation on all endpoints
- SQL injection prevention via parameterized queries

### 7. Approval Workflow Security
- Only manufacturer admins can approve/reject
- Approval status checked on every request
- Users cannot bypass approval via URL manipulation
- Rejected users cannot create new accounts with same email (validation)

---

## Extending the System

### Adding a New Role

1. **Update Database:**
   ```sql
   INSERT INTO roles (name, display_name, description)
   VALUES ('new_role', 'New Role Display', 'Description');
   ```

2. **Update Configuration:**
   ```typescript
   // backend/src/config/rbac.config.ts
   export const ROLES = {
     // ...
     NEW_ROLE: 'new_role',
   };

   export const ROLE_DISPLAY_NAMES = {
     // ...
     [ROLES.NEW_ROLE]: 'New Role Display',
   };

   export const ROLE_SPECIFIC_FIELDS = {
     // ...
     [ROLES.NEW_ROLE]: {
       fields: ['field1', 'field2'],
       description: 'New role description',
     },
   };
   ```

3. **Update Frontend Config:**
   ```typescript
   // src/config/rbac.config.ts
   // Same changes as backend
   ```

### Adding a New Feature

1. **Update Database:**
   ```sql
   INSERT INTO features (slug, name, description, icon, route_path, display_order)
   VALUES ('new_feature', 'New Feature', 'Description', 'Icon', '/route', 7);
   ```

2. **Update Configuration:**
   ```typescript
   export const FEATURES = {
     // ...
     NEW_FEATURE: 'new_feature',
   };

   export const FEATURE_CONFIG = {
     // ...
     [FEATURES.NEW_FEATURE]: {
       name: 'New Feature',
       description: 'Description',
       icon: 'Icon',
       route: '/route',
       displayOrder: 7,
     },
   };
   ```

3. **Assign to Roles:**
   ```typescript
   export const ROLE_FEATURE_PERMISSIONS = {
     // ...
     [ROLES.ROLE_NAME]: [
       // ... existing features
       FEATURES.NEW_FEATURE,
     ],
   };
   ```

---

## Troubleshooting

### User Cannot Login After Approval
- Check user_approval_status table for 'approved' status
- Verify user record exists and is_active = true
- Clear browser cache and try again
- Check JWT token expiration

### Features Not Showing on Dashboard
- Verify user has assigned roles
- Check role_feature_permissions table
- Confirm features are marked is_active = true
- Verify approvalStatus is 'approved'

### Admin Cannot Approve Registrations
- Verify user is manufacturer type
- Check authorization middleware
- Ensure user has manufacturer_admin role in database

---

## Summary

This RBAC system provides:
- ✅ Centralized permission management
- ✅ Flexible role and feature mapping
- ✅ Manufacturer approval workflow
- ✅ Multi-role user support
- ✅ Backend-enforced security
- ✅ Dynamic frontend rendering
- ✅ Scalable architecture
- ✅ Comprehensive audit trail

The system is production-ready and can be extended to support additional roles, features, and authorization requirements.
