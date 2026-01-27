-- RBAC Schema Extensions for Dealer Portal
-- This file extends the existing schema with RBAC and dealer registration features

-- 1. Roles Table (Core role definitions)
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  display_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert core roles
INSERT INTO roles (name, display_name, description) VALUES
  ('dealer_gm', 'Dealer GM', 'Dealer General Manager'),
  ('service_head', 'Service Head', 'Service Department Head'),
  ('service_manager', 'Service Manager', 'Service Department Manager'),
  ('master_technician', 'Master Technician', 'Master Level Technician'),
  ('warranty_manager', 'Warranty Manager', 'Warranty Department Manager')
ON CONFLICT (name) DO NOTHING;

-- 2. Features/Modules Table (Single source of truth for features)
CREATE TABLE IF NOT EXISTS features (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  route_path VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert features
INSERT INTO features (slug, name, description, route_path, display_order) VALUES
  ('api_registration', 'API Registration', 'Register for API awareness events', '/modules/api-registration', 1),
  ('mt_meet', 'MT Meet Registration', 'Register for Master Technician meetings', '/modules/mt-meet', 2),
  ('workshop_survey', 'Workshop Survey', 'Submit workshop performance surveys', '/modules/workshop-survey', 3),
  ('warranty_survey', 'Warranty Survey', 'Submit warranty related information', '/modules/warranty-survey', 4),
  ('technical_awareness', 'Technical Awareness', 'Technical awareness and training', '/modules/technical-awareness', 5),
  ('database', 'Database', 'Access to dealer database and records', '/modules/database', 6)
ON CONFLICT (slug) DO NOTHING;

-- 3. Role-Feature Mapping (Permissions: who can access what)
CREATE TABLE IF NOT EXISTS role_feature_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  feature_id UUID REFERENCES features(id) ON DELETE CASCADE,
  can_view BOOLEAN DEFAULT true,
  can_create BOOLEAN DEFAULT false,
  can_edit BOOLEAN DEFAULT false,
  can_delete BOOLEAN DEFAULT false,
  can_approve BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(role_id, feature_id)
);

CREATE INDEX IF NOT EXISTS idx_role_feature_role ON role_feature_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_feature_feature ON role_feature_permissions(feature_id);

-- Insert role-feature permissions based on requirements
-- API Registration → Dealer GM, Service Head
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name IN ('dealer_gm', 'service_head') AND f.slug = 'api_registration'
ON CONFLICT DO NOTHING;

-- MT Meet → Master Technician
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name = 'master_technician' AND f.slug = 'mt_meet'
ON CONFLICT DO NOTHING;

-- Workshop Survey → Master Technician, Warranty Manager, Service Manager
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name IN ('master_technician', 'warranty_manager', 'service_manager') AND f.slug = 'workshop_survey'
ON CONFLICT DO NOTHING;

-- Warranty Survey → Warranty Manager
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name = 'warranty_manager' AND f.slug = 'warranty_survey'
ON CONFLICT DO NOTHING;

-- Technical Awareness → Master Technician
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name = 'master_technician' AND f.slug = 'technical_awareness'
ON CONFLICT DO NOTHING;

-- Database → Master Technician, Warranty Manager, Service Manager
INSERT INTO role_feature_permissions (role_id, feature_id, can_view, can_create, can_edit)
SELECT r.id, f.id, true, true, true
FROM roles r, features f
WHERE r.name IN ('master_technician', 'warranty_manager', 'service_manager') AND f.slug = 'database'
ON CONFLICT DO NOTHING;

-- 4. Dealer Registration Requests Table
CREATE TABLE IF NOT EXISTS dealer_registration_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_code VARCHAR(50) NOT NULL,
  dealer_name VARCHAR(255) NOT NULL,
  brand VARCHAR(50) NOT NULL DEFAULT 'Volkswagen',
  user_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  mobile_number VARCHAR(20) NOT NULL,
  requested_role VARCHAR(50) NOT NULL,
  additional_info JSONB, -- Stores role-specific data like Master Technician ID, etc.
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submission_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_by UUID REFERENCES users(id),
  reviewed_at TIMESTAMP,
  review_comments TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reg_requests_status ON dealer_registration_requests(status);
CREATE INDEX IF NOT EXISTS idx_reg_requests_email ON dealer_registration_requests(email);
CREATE INDEX IF NOT EXISTS idx_reg_requests_dealer ON dealer_registration_requests(dealer_code);

-- 5. User Roles Junction Table (Support multiple roles per user)
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  assigned_by UUID REFERENCES users(id),
  UNIQUE(user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role_id);

-- 6. Approval Status Table (Track user approval status)
CREATE TABLE IF NOT EXISTS user_approval_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  registration_request_id UUID REFERENCES dealer_registration_requests(id),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_date TIMESTAMP,
  approved_by UUID REFERENCES users(id),
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_approval_status_user ON user_approval_status(user_id);
CREATE INDEX IF NOT EXISTS idx_approval_status_status ON user_approval_status(status);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_approval_status ON users(id) 
  WHERE is_active = true;
