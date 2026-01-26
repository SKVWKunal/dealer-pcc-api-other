# RBAC Implementation Checklist

## Database Setup

- [ ] Run RBAC schema migration: `psql -f backend/database/rbac-schema.sql`
- [ ] Verify tables created:
  - [ ] `roles`
  - [ ] `features`
  - [ ] `role_feature_permissions`
  - [ ] `user_roles`
  - [ ] `dealer_registration_requests`
  - [ ] `user_approval_status`
- [ ] Seed initial roles and features
- [ ] Test database connections

## Backend Implementation

### Files Created/Modified
- [ ] `/backend/src/config/rbac.config.ts` - RBAC configuration
- [ ] `/backend/src/middleware/rbac.middleware.ts` - RBAC middleware
- [ ] `/backend/src/routes/registration.routes.ts` - Registration & approval APIs
- [ ] `/backend/src/routes/rbac.routes.ts` - User profile & features APIs
- [ ] `/backend/src/index.ts` - Updated with new routes

### Route Registration
- [ ] Verify routes in `index.ts`:
  - [ ] `/api/v1/auth/dealer/register` - Registration
  - [ ] `/api/v1/auth/dealer/registration-status` - Status check
  - [ ] `/api/v1/auth/admin/registrations` - Admin list
  - [ ] `/api/v1/auth/admin/registrations/:id/approve` - Approve
  - [ ] `/api/v1/auth/admin/registrations/:id/reject` - Reject
  - [ ] `/api/v1/auth/user/profile` - User profile
  - [ ] `/api/v1/auth/features` - Features list

### Middleware Integration
- [ ] `authenticate` middleware applied to protected routes
- [ ] `checkApprovalStatus` applied to dealer endpoints
- [ ] `authorizeByRole` applied to role-restricted endpoints
- [ ] `authorizeByFeature` applied to feature-specific endpoints
- [ ] `authorizeManufacturerAdmin` applied to admin endpoints

### Testing Backend APIs
- [ ] Test dealer registration endpoint
- [ ] Test registration status check
- [ ] Test admin approval workflow
- [ ] Test user profile endpoint
- [ ] Test features list endpoint
- [ ] Test approval status enforcement
- [ ] Test role-based access

## Frontend Implementation

### Configuration
- [ ] `/src/config/rbac.config.ts` created - Frontend RBAC config
- [ ] Verify config matches backend config

### Pages Created/Modified
- [ ] `/src/pages/DealerRegistrationPage.tsx` - Dealer registration form
  - [ ] Role selection dropdown
  - [ ] Dynamic role-specific fields
  - [ ] Form validation
  - [ ] API integration
  
- [ ] `/src/pages/RegistrationStatusPage.tsx` - Status check page
  - [ ] Email input
  - [ ] Status display
  - [ ] Rejection reason display
  - [ ] Approval action buttons
  
- [ ] `/src/pages/DashboardPage.tsx` - Dashboard with feature tiles
  - [ ] User profile card
  - [ ] Role display
  - [ ] Approval status display
  - [ ] Feature tiles with permissions
  - [ ] API integration for profile fetch
  
- [ ] `/src/pages/AdminApprovalPage.tsx` - Admin approval interface
  - [ ] Pending registrations list
  - [ ] Registration details modal
  - [ ] Approval modal with password setup
  - [ ] Rejection modal with reason
  - [ ] Admin-only access check

### Routing
- [ ] Update routing to include new pages:
  ```typescript
  <Route path="/dealer-register" element={<DealerRegistrationPage />} />
  <Route path="/registration-status" element={<RegistrationStatusPage />} />
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/admin/approvals" element={<AdminApprovalPage />} />
  ```

### Testing Frontend
- [ ] Test dealer registration form
- [ ] Test role-specific fields population
- [ ] Test registration status check
- [ ] Test dashboard loading
- [ ] Test feature tile rendering based on roles
- [ ] Test admin approval interface
- [ ] Test responsive design on mobile/tablet

## Integration Testing

### End-to-End Flow
- [ ] **Registration Flow:**
  1. [ ] Dealer registers with role
  2. [ ] Registration saved with status 'pending'
  3. [ ] User sees pending message
  4. [ ] User can check status

- [ ] **Approval Flow:**
  1. [ ] Admin sees pending registration
  2. [ ] Admin approves with password
  3. [ ] User account created
  4. [ ] User roles assigned
  5. [ ] Approval status set to 'approved'

- [ ] **Login & Access Flow:**
  1. [ ] Approved user can login
  2. [ ] User sees dashboard
  3. [ ] Features rendered based on roles
  4. [ ] Permission badges visible
  5. [ ] Unapproved users cannot access

- [ ] **Rejection Flow:**
  1. [ ] Admin rejects with reason
  2. [ ] User sees rejected status
  3. [ ] User can re-register
  4. [ ] Rejection reason visible

### Permission Testing
- [ ] Verify Dealer GM can only access API Registration
- [ ] Verify Service Head can only access API Registration
- [ ] Verify Service Manager can access Workshop Survey and Database
- [ ] Verify Master Technician can access all assigned features
- [ ] Verify Warranty Manager can access Workshop Survey, Warranty Survey, Database
- [ ] Verify unauthorized users get 403 responses
- [ ] Verify pending users cannot access dashboard

### Security Testing
- [ ] Test SQL injection protection
- [ ] Test CORS policies
- [ ] Test rate limiting
- [ ] Test token expiration
- [ ] Test refresh token flow
- [ ] Test password hashing
- [ ] Test approval status bypass attempts
- [ ] Test cross-dealer data isolation

## Configuration

### Environment Variables
- [ ] `JWT_SECRET` - JWT signing secret
- [ ] `JWT_EXPIRATION` - Token expiration (e.g., "1h")
- [ ] `BCRYPT_ROUNDS` - Password hashing rounds (10-12)
- [ ] `REDIS_URL` - Redis connection URL
- [ ] `DATABASE_URL` - Database connection string

### Feature Flags (Optional)
- [ ] Feature toggle for RBAC system
- [ ] Toggle for registration approval requirement
- [ ] Toggle for admin interface access

## Deployment

### Pre-Production
- [ ] Run database migrations on staging
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Run integration tests on staging
- [ ] Verify all APIs responding correctly
- [ ] Load testing on approval workflow
- [ ] Security audit

### Production
- [ ] Backup production database
- [ ] Run database migrations
- [ ] Deploy backend with zero-downtime
- [ ] Deploy frontend
- [ ] Monitor error logs
- [ ] Verify all endpoints working
- [ ] Test with production data
- [ ] Monitor performance metrics

## Documentation

- [ ] [ ] RBAC_IMPLEMENTATION_GUIDE.md created
- [ ] API documentation updated
- [ ] Database schema documented
- [ ] Configuration documented
- [ ] Deployment guide updated
- [ ] Troubleshooting guide created
- [ ] Team training completed

## Post-Deployment

### Monitoring
- [ ] Monitor registration submissions
- [ ] Track approval completion times
- [ ] Monitor failed logins
- [ ] Track feature usage
- [ ] Monitor API performance
- [ ] Alert on approval delays

### Maintenance
- [ ] Regular security audits
- [ ] Role review (quarterly)
- [ ] Permission review (quarterly)
- [ ] Audit log review
- [ ] User activity monitoring

## Optional Enhancements

- [ ] [ ] Email notifications for approval/rejection
- [ ] [ ] Approval SLA tracking
- [ ] [ ] Bulk user import
- [ ] [ ] Role-based reporting
- [ ] [ ] Advanced permission matrix UI
- [ ] [ ] Multi-language support
- [ ] [ ] SSO/LDAP integration
- [ ] [ ] Approval workflow customization
- [ ] [ ] User activity dashboard
- [ ] [ ] Performance analytics

---

## Verification Checklist

After completing all above, verify:

- [ ] All files created/modified
- [ ] All APIs responding correctly
- [ ] Frontend pages rendering properly
- [ ] Database tables populated with data
- [ ] Middleware functioning correctly
- [ ] Authentication working
- [ ] Authorization enforced
- [ ] Dashboard showing correct features
- [ ] Approval workflow functional
- [ ] Admin interface operational
- [ ] Error handling proper
- [ ] Security measures in place
- [ ] Documentation complete
- [ ] Team trained

---

## Issues & Resolutions

### Common Issues

#### Backend
1. **Module not found errors**
   - Solution: Ensure imports in index.ts are correct

2. **Database connection errors**
   - Solution: Verify DATABASE_URL and connection string

3. **Middleware not executing**
   - Solution: Check middleware order in routes

4. **Permission denied errors**
   - Solution: Verify role_feature_permissions table has correct data

#### Frontend
1. **Features not loading**
   - Solution: Check browser console, verify API response

2. **Dynamic fields not appearing**
   - Solution: Verify ROLE_SPECIFIC_FIELDS config

3. **Authentication errors**
   - Solution: Check token storage and expiration

4. **Dashboard blank**
   - Solution: Verify user profile API response

### Support
- Check RBAC_IMPLEMENTATION_GUIDE.md for detailed troubleshooting
- Review API response errors in browser DevTools
- Check server logs for detailed error messages
- Verify database state with SQL queries

---

**Status**: Ready for Implementation ✅
**Last Updated**: January 26, 2026
**Version**: 1.0
