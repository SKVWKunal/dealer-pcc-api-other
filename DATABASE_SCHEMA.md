# Database Schema - One Aftersales Platform

## Overview
Complete database structure for the dealer service management platform with role-based access control.

---

## Core Tables

### 1. users
Main user authentication and profile table.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN (
    'super_admin',
    'manufacturer_admin',
    'master_technician',
    'service_manager',
    'service_head',
    'warranty_manager'
  )),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('dealer', 'manufacturer')),
  dealer_id UUID REFERENCES dealers(id),
  designation VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_dealer ON users(dealer_id);
```

### 2. dealers
Dealer information table.

```sql
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_code VARCHAR(50) UNIQUE NOT NULL,
  dealer_name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100) DEFAULT 'India',
  postal_code VARCHAR(20),
  phone VARCHAR(20),
  email VARCHAR(255),
  brand VARCHAR(50) CHECK (brand IN ('Volkswagen', 'Skoda', 'Both')),
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealers_code ON dealers(dealer_code);
CREATE INDEX idx_dealers_status ON dealers(status);
```

### 3. module_access
Track which modules each user can access.

```sql
CREATE TABLE module_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  module VARCHAR(50) NOT NULL CHECK (module IN (
    'dealer_pcc',
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  )),
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  granted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  granted_by UUID REFERENCES users(id),
  UNIQUE(user_id, module)
);

CREATE INDEX idx_module_access_user ON module_access(user_id);
CREATE INDEX idx_module_access_module ON module_access(module);
```

---

## Module-Specific Tables

### 4. dealer_pcc
Dealer PCC (Performance Center Program) applications.

```sql
CREATE TABLE dealer_pcc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  application_date DATE NOT NULL,
  
  -- Criteria fields (to be defined later)
  criteria_data JSONB,
  
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN (
    'draft',
    'pending',
    'under_review',
    'approved',
    'rejected',
    'revision_requested'
  )),
  
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_comments TEXT,
  
  approved_by UUID REFERENCES users(id),
  approved_at TIMESTAMP,
  approval_comments TEXT,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_dealer_pcc_dealer ON dealer_pcc(dealer_id);
CREATE INDEX idx_dealer_pcc_status ON dealer_pcc(status);
CREATE INDEX idx_dealer_pcc_date ON dealer_pcc(application_date);
```

### 5. api_registrations
API event employee registrations.

```sql
CREATE TABLE api_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  registered_by UUID REFERENCES users(id) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  
  employee_name VARCHAR(255) NOT NULL,
  employee_email VARCHAR(255),
  employee_phone VARCHAR(20),
  employee_designation VARCHAR(100),
  
  event_name VARCHAR(255) NOT NULL,
  event_date DATE,
  event_location VARCHAR(255),
  
  -- Criteria fields (to be defined later)
  criteria_data JSONB,
  
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN (
    'registered',
    'confirmed',
    'attended',
    'cancelled',
    'no_show'
  )),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_reg_dealer ON api_registrations(dealer_id);
CREATE INDEX idx_api_reg_status ON api_registrations(status);
CREATE INDEX idx_api_reg_event ON api_registrations(event_date);
```

### 6. mt_meet_registrations
Master Technician Meet registrations.

```sql
CREATE TABLE mt_meet_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  registered_by UUID REFERENCES users(id) NOT NULL,
  registration_number VARCHAR(50) UNIQUE NOT NULL,
  
  technician_name VARCHAR(255) NOT NULL,
  technician_email VARCHAR(255),
  technician_phone VARCHAR(20),
  technician_employee_id VARCHAR(50),
  
  meet_name VARCHAR(255) NOT NULL,
  meet_date DATE,
  meet_location VARCHAR(255),
  
  -- Criteria fields (to be defined later)
  criteria_data JSONB,
  
  status VARCHAR(20) DEFAULT 'registered' CHECK (status IN (
    'registered',
    'confirmed',
    'attended',
    'cancelled',
    'no_show'
  )),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mt_meet_dealer ON mt_meet_registrations(dealer_id);
CREATE INDEX idx_mt_meet_status ON mt_meet_registrations(status);
CREATE INDEX idx_mt_meet_date ON mt_meet_registrations(meet_date);
```

### 7. workshop_surveys
Workshop System Survey responses.

```sql
CREATE TABLE workshop_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  
  survey_period VARCHAR(50), -- e.g., "Q1 2024"
  submission_date DATE NOT NULL,
  
  -- Survey responses (to be defined later)
  responses JSONB NOT NULL,
  
  overall_score DECIMAL(5,2),
  
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN (
    'draft',
    'submitted',
    'reviewed',
    'completed'
  )),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_workshop_survey_dealer ON workshop_surveys(dealer_id);
CREATE INDEX idx_workshop_survey_status ON workshop_surveys(status);
CREATE INDEX idx_workshop_survey_date ON workshop_surveys(submission_date);
```

### 8. warranty_surveys
Warranty Survey responses.

```sql
CREATE TABLE warranty_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  
  survey_period VARCHAR(50),
  submission_date DATE NOT NULL,
  
  -- Survey responses (to be defined later)
  responses JSONB NOT NULL,
  
  overall_score DECIMAL(5,2),
  
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN (
    'draft',
    'submitted',
    'reviewed',
    'completed'
  )),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_warranty_survey_dealer ON warranty_surveys(dealer_id);
CREATE INDEX idx_warranty_survey_status ON warranty_surveys(status);
CREATE INDEX idx_warranty_survey_date ON warranty_surveys(submission_date);
```

### 9. technical_surveys
Technical Awareness Survey responses.

```sql
CREATE TABLE technical_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  
  survey_period VARCHAR(50),
  submission_date DATE NOT NULL,
  
  -- Survey responses (to be defined later)
  responses JSONB NOT NULL,
  
  overall_score DECIMAL(5,2),
  
  status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN (
    'draft',
    'submitted',
    'reviewed',
    'completed'
  )),
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_technical_survey_dealer ON technical_surveys(dealer_id);
CREATE INDEX idx_technical_survey_status ON technical_surveys(status);
CREATE INDEX idx_technical_survey_date ON technical_surveys(submission_date);
```

---

## Audit & Logging Tables

### 10. audit_logs
Complete audit trail for all system activities.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_date ON audit_logs(created_at);
```

### 11. session_logs
Track user sessions.

```sql
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(255) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  login_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_session_user ON session_logs(user_id);
CREATE INDEX idx_session_token ON session_logs(token_hash);
CREATE INDEX idx_session_active ON session_logs(is_active);
```

---

## Supporting Tables

### 12. notifications
User notifications system.

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(20) CHECK (type IN ('info', 'success', 'warning', 'error')),
  is_read BOOLEAN DEFAULT false,
  link VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_date ON notifications(created_at);
```

### 13. settings
System and user settings.

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  key VARCHAR(100) NOT NULL,
  value TEXT,
  description TEXT,
  is_system BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(category, key)
);

CREATE INDEX idx_settings_category ON settings(category);
```

---

## Security Features

### Password Reset Tokens
```sql
CREATE TABLE password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reset_token ON password_reset_tokens(token);
CREATE INDEX idx_reset_user ON password_reset_tokens(user_id);
```

---

## Views for Quick Access

### Active Users Summary
```sql
CREATE VIEW v_active_users AS
SELECT 
  u.id,
  u.email,
  u.name,
  u.role,
  u.user_type,
  d.dealer_code,
  d.dealer_name,
  u.last_login,
  COUNT(DISTINCT ma.module) as accessible_modules
FROM users u
LEFT JOIN dealers d ON u.dealer_id = d.id
LEFT JOIN module_access ma ON u.id = ma.user_id
WHERE u.is_active = true
GROUP BY u.id, d.dealer_code, d.dealer_name;
```

### Module Statistics
```sql
CREATE VIEW v_module_statistics AS
SELECT 
  module,
  COUNT(*) as total_users,
  COUNT(CASE WHEN can_create THEN 1 END) as can_create,
  COUNT(CASE WHEN can_edit THEN 1 END) as can_edit,
  COUNT(CASE WHEN can_approve THEN 1 END) as can_approve
FROM module_access
GROUP BY module;
```

---

## Initial Data Seeds

### Create Super Admin
```sql
INSERT INTO users (email, password_hash, name, role, user_type, is_active)
VALUES (
  'superadmin@oneaftersales.com',
  '$2a$10$...', -- bcrypt hash of password
  'Super Administrator',
  'super_admin',
  'manufacturer',
  true
);
```

### Grant All Module Access to Super Admin
```sql
INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, can_delete, can_approve)
SELECT 
  id,
  unnest(ARRAY[
    'dealer_pcc',
    'api_registration',
    'mt_meet',
    'workshop_survey',
    'warranty_survey',
    'technical_survey'
  ]),
  true, true, true, true, true
FROM users
WHERE role = 'super_admin';
```

---

## Database Considerations

### Security
- All passwords stored as bcrypt hashes
- Session tokens hashed
- Audit logs for all sensitive operations
- Row-level security can be implemented for multi-tenancy

### Performance
- Indexes on frequently queried columns
- JSONB for flexible schema-less data
- Partitioning can be added for large tables
- Connection pooling recommended

### Backup Strategy
- Daily automated backups
- Point-in-time recovery enabled
- Separate backup for audit logs
- 30-day retention policy

### Scalability
- UUID for distributed systems
- JSONB for flexible schema evolution
- Can be sharded by dealer_id
- Read replicas for reporting

---

**Note:** The `criteria_data` and `responses` JSONB fields allow flexible data storage. Specific schemas will be defined when you provide detailed requirements for each module.
