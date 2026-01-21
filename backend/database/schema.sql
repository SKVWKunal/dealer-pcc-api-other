-- One Aftersales Database Schema
-- PostgreSQL 14+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Tables

-- 1. Dealers Table
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 2. Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 3. Module Access Table
CREATE TABLE module_access (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Module Tables

-- 4. Dealer PCC
CREATE TABLE dealer_pcc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  application_number VARCHAR(50) UNIQUE NOT NULL,
  application_date DATE NOT NULL,
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

-- 5. API Registrations
CREATE TABLE api_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 6. MT Meet Registrations
CREATE TABLE mt_meet_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 7. Workshop Surveys
CREATE TABLE workshop_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  survey_period VARCHAR(50),
  submission_date DATE NOT NULL,
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

-- 8. Warranty Surveys
CREATE TABLE warranty_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  survey_period VARCHAR(50),
  submission_date DATE NOT NULL,
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

-- 9. Technical Surveys
CREATE TABLE technical_surveys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id) NOT NULL,
  submitted_by UUID REFERENCES users(id) NOT NULL,
  survey_number VARCHAR(50) UNIQUE NOT NULL,
  survey_period VARCHAR(50),
  submission_date DATE NOT NULL,
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

-- Audit and Logging Tables

-- 10. Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- 11. Session Logs
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
CREATE INDEX idx_session_active ON session_logs(is_active);
