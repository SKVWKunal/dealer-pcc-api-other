-- Seed Data for One Aftersales Platform

-- Insert Sample Dealers
INSERT INTO dealers (dealer_code, dealer_name, city, state, brand, status) VALUES
('DLR001', 'Premium Motors Mumbai', 'Mumbai', 'Maharashtra', 'Volkswagen', 'active'),
('DLR002', 'Elite Auto Delhi', 'New Delhi', 'Delhi', 'Skoda', 'active'),
('DLR003', 'Signature Motors Bangalore', 'Bangalore', 'Karnataka', 'Both', 'active');

-- Insert Super Admin
-- Password: Admin@123
INSERT INTO users (email, password_hash, name, role, user_type, is_active) VALUES
('superadmin@oneaftersales.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MdFiXN6KXpOu', 'Super Administrator', 'super_admin', 'manufacturer', true);

-- Insert Manufacturer Admin
-- Password: Admin@123
INSERT INTO users (email, password_hash, name, role, user_type, is_active) VALUES
('admin@volkswagen.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MdFiXN6KXpOu', 'VW Admin', 'manufacturer_admin', 'manufacturer', true);

-- Insert Dealer Users
-- Password: Dealer@123
INSERT INTO users (email, password_hash, name, role, user_type, dealer_id, designation, is_active) VALUES
('mt@dealer1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MdFiXN6KXpOu', 'John Master Tech', 'master_technician', 'dealer', 
  (SELECT id FROM dealers WHERE dealer_code = 'DLR001'), 'master_technician', true),
('sm@dealer1.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5MdFiXN6KXpOu', 'Mike Service Manager', 'service_manager', 'dealer',
  (SELECT id FROM dealers WHERE dealer_code = 'DLR001'), 'service_manager', true);

-- Grant Module Access to Super Admin
INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, can_delete, can_approve)
SELECT id, module, true, true, true, true, true
FROM users CROSS JOIN (
  VALUES ('dealer_pcc'), ('api_registration'), ('mt_meet'), 
         ('workshop_survey'), ('warranty_survey'), ('technical_survey')
) AS modules(module)
WHERE role = 'super_admin';

-- Grant Module Access to Manufacturer Admin
INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, can_delete, can_approve)
SELECT id, module, true, true, true, false, true
FROM users CROSS JOIN (
  VALUES ('dealer_pcc'), ('api_registration'), ('mt_meet'),
         ('workshop_survey'), ('warranty_survey'), ('technical_survey')
) AS modules(module)
WHERE role = 'manufacturer_admin';

-- Grant Module Access to Master Technician
INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, can_delete, can_approve)
SELECT id, module, true, true, false, false, false
FROM users CROSS JOIN (
  VALUES ('dealer_pcc'), ('workshop_survey'), ('warranty_survey'), ('technical_survey')
) AS modules(module)
WHERE role = 'master_technician';

-- Grant Module Access to Service Manager
INSERT INTO module_access (user_id, module, can_view, can_create, can_edit, can_delete, can_approve)
SELECT id, module, true, true, false, false, false
FROM users CROSS JOIN (
  VALUES ('api_registration'), ('mt_meet'), ('workshop_survey'), ('warranty_survey'), ('technical_survey')
) AS modules(module)
WHERE role = 'service_manager';

-- Output credentials
SELECT 
  'Login Credentials:' as info
UNION ALL
SELECT '==================='
UNION ALL
SELECT 'Super Admin: superadmin@oneaftersales.com / Admin@123'
UNION ALL
SELECT 'Manufacturer Admin: admin@volkswagen.com / Admin@123'
UNION ALL
SELECT 'Master Technician: mt@dealer1.com / Dealer@123'
UNION ALL
SELECT 'Service Manager: sm@dealer1.com / Dealer@123';
