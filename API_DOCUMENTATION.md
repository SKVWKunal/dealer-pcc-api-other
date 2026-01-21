# API Documentation - One Aftersales Platform

## Base URL
```
Development: http://localhost:3000/api/v1
Production: https://api.oneaftersales.com/api/v1
```

---

## Authentication Endpoints

### POST /auth/login
Login for both dealer and manufacturer users.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "userType": "dealer" | "manufacturer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "master_technician",
      "dealerCode": "DLR001",
      "dealerName": "Sample Dealer",
      "modules": ["dealer_pcc", "workshop_survey"]
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### POST /auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGc..."
}
```

### POST /auth/logout
Logout current user.

**Headers:**
```
Authorization: Bearer {accessToken}
```

### POST /auth/forgot-password
Request password reset.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with token.

**Request Body:**
```json
{
  "token": "reset-token",
  "newPassword": "NewSecurePass123!"
}
```

---

## User Management Endpoints

### GET /users/me
Get current user profile.

**Headers:**
```
Authorization: Bearer {accessToken}
```

### PUT /users/me
Update current user profile.

**Request Body:**
```json
{
  "name": "Updated Name",
  "phone": "+91-9876543210"
}
```

### PUT /users/me/password
Change password.

**Request Body:**
```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

### GET /users
Get all users (Admin only).

**Query Parameters:**
- `page` (default: 1)
- `limit` (default: 20)
- `role` (optional filter)
- `dealerId` (optional filter)
- `search` (optional search)

### POST /users
Create new user (Admin only).

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "name": "New User",
  "password": "TempPass123!",
  "role": "service_manager",
  "dealerId": "uuid",
  "modules": ["api_registration", "mt_meet"]
}
```

### PUT /users/:id
Update user (Admin only).

### DELETE /users/:id
Deactivate user (Admin only).

---

## Dealer PCC Endpoints

### POST /dealer-pcc
Create new PCC application.

**Request Body:**
```json
{
  "applicationDate": "2024-01-15",
  "criteriaData": {
    "salesVolume": 1200,
    "serviceCapacity": 50,
    "technicianCount": 15
  }
}
```

### GET /dealer-pcc
Get all PCC applications.

**Query Parameters:**
- `page`, `limit`
- `status` (draft, pending, approved, rejected)
- `dealerId` (for admin view)
- `fromDate`, `toDate`

### GET /dealer-pcc/:id
Get single PCC application.

### PUT /dealer-pcc/:id
Update PCC application.

### POST /dealer-pcc/:id/submit
Submit draft PCC application.

### POST /dealer-pcc/:id/review
Review PCC application (Admin only).

**Request Body:**
```json
{
  "status": "under_review" | "revision_requested" | "approved" | "rejected",
  "comments": "Review comments here"
}
```

### GET /dealer-pcc/dashboard/stats
Get PCC dashboard statistics.

---

## API Registration Endpoints

### POST /api-registration
Register employee for API event.

**Request Body:**
```json
{
  "employeeName": "John Technician",
  "employeeEmail": "john@dealer.com",
  "employeePhone": "+91-9876543210",
  "employeeDesignation": "Senior Technician",
  "eventName": "API Workshop 2024",
  "eventDate": "2024-02-15",
  "eventLocation": "Mumbai",
  "criteriaData": {}
}
```

### GET /api-registration
Get all registrations.

### GET /api-registration/:id
Get single registration.

### PUT /api-registration/:id
Update registration.

### DELETE /api-registration/:id
Cancel registration.

### GET /api-registration/dashboard/stats
Get registration statistics.

---

## MT Meet Endpoints

### POST /mt-meet
Register for MT Meet.

### GET /mt-meet
Get all registrations.

### GET /mt-meet/:id
Get single registration.

### PUT /mt-meet/:id
Update registration.

### DELETE /mt-meet/:id
Cancel registration.

### GET /mt-meet/dashboard/stats
Get MT Meet statistics.

---

## Survey Endpoints

### Workshop Survey

#### POST /surveys/workshop
Submit workshop survey.

**Request Body:**
```json
{
  "surveyPeriod": "Q1 2024",
  "responses": {
    "question1": "answer1",
    "question2": 5,
    "question3": ["option1", "option2"]
  }
}
```

#### GET /surveys/workshop
Get all workshop surveys.

#### GET /surveys/workshop/:id
Get single survey.

#### GET /surveys/workshop/dashboard/stats
Get survey statistics.

### Warranty Survey

#### POST /surveys/warranty
Submit warranty survey.

#### GET /surveys/warranty
Get all surveys.

### Technical Survey

#### POST /surveys/technical
Submit technical survey.

#### GET /surveys/technical
Get all surveys.

---

## Dealer Endpoints

### GET /dealers
Get all dealers.

**Query Parameters:**
- `page`, `limit`
- `status` (active, inactive, suspended)
- `brand` (Volkswagen, Skoda, Both)
- `search`

### GET /dealers/:id
Get single dealer.

### POST /dealers
Create new dealer (Admin only).

**Request Body:**
```json
{
  "dealerCode": "DLR001",
  "dealerName": "Premium Motors",
  "address": "123 Main Street",
  "city": "Mumbai",
  "state": "Maharashtra",
  "postalCode": "400001",
  "phone": "+91-22-12345678",
  "email": "info@premiummotors.com",
  "brand": "Volkswagen"
}
```

### PUT /dealers/:id
Update dealer.

### DELETE /dealers/:id
Deactivate dealer.

---

## Dashboard & Analytics Endpoints

### GET /dashboard/summary
Get overall dashboard summary.

**Response:**
```json
{
  "dealerPCC": {
    "total": 150,
    "pending": 20,
    "approved": 120,
    "rejected": 10
  },
  "apiRegistrations": {
    "total": 500,
    "upcoming": 50
  },
  "mtMeet": {
    "total": 300
  },
  "surveys": {
    "workshop": 200,
    "warranty": 180,
    "technical": 220
  }
}
```

### GET /dashboard/dealer/:dealerId
Get dealer-specific dashboard.

### GET /analytics/reports
Get various analytics reports.

**Query Parameters:**
- `type` (pcc, registration, survey)
- `fromDate`, `toDate`
- `dealerId`
- `format` (json, csv, pdf)

---

## Notification Endpoints

### GET /notifications
Get user notifications.

**Query Parameters:**
- `page`, `limit`
- `isRead` (true, false)

### PUT /notifications/:id/read
Mark notification as read.

### PUT /notifications/read-all
Mark all notifications as read.

---

## File Upload Endpoints

### POST /upload
Upload file.

**Form Data:**
```
file: [binary]
type: "document" | "image"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "uuid",
    "filename": "document.pdf",
    "url": "https://cdn.example.com/files/document.pdf",
    "size": 1024000
  }
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes:
- `UNAUTHORIZED` (401)
- `FORBIDDEN` (403)
- `NOT_FOUND` (404)
- `VALIDATION_ERROR` (422)
- `RATE_LIMIT_EXCEEDED` (429)
- `INTERNAL_ERROR` (500)

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Login endpoint: 5 requests per 15 minutes
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

---

## Pagination

List endpoints support pagination:

**Query Parameters:**
```
page=1
limit=20
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Testing with cURL

```bash
# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "dealer@example.com",
    "password": "password123",
    "userType": "dealer"
  }'

# Get user profile
curl -X GET http://localhost:3000/api/v1/users/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create PCC application
curl -X POST http://localhost:3000/api/v1/dealer-pcc \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "applicationDate": "2024-01-15",
    "criteriaData": {}
  }'
```

---

**Note:** This API documentation will be expanded as you provide specific requirements for each module's criteria and data structures.
