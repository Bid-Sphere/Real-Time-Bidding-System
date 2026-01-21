-- ================================
-- AUTH DATABASE SEED DATA
-- ================================

-- Insert test admin user (password: admin123)
INSERT INTO users (email, password_hash, full_name, role, is_active, registration_status, registration_step, created_at, updated_at)
VALUES (
    'admin@bidsphere.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'admin123'
    'System Administrator',
    'ADMIN',
    true,
    'PROFILE_COMPLETE',
    2,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert test client user (password: client123)
INSERT INTO users (email, password_hash, full_name, role, is_active, registration_status, registration_step, phone, location, created_at, updated_at)
VALUES (
    'client@test.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'client123'
    'Test Client User',
    'CLIENT',
    true,
    'PROFILE_COMPLETE',
    2,
    '+1234567890',
    'New York, NY',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert test organization user (password: org123)
INSERT INTO users (email, password_hash, full_name, role, is_active, registration_status, registration_step, phone, location, created_at, updated_at)
VALUES (
    'org@test.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- bcrypt hash for 'org123'
    'Test Organization User',
    'ORGANISATION',
    true,
    'PROFILE_COMPLETE',
    2,
    '+1234567891',
    'San Francisco, CA',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (email) DO NOTHING;

-- Insert client profile for test client
INSERT INTO client (user_id, company_name, industry, company_size, website, billing_address, tax_id)
SELECT 
    u.id,
    'Test Client Company',
    'Technology',
    '10-50',
    'https://testclient.com',
    '123 Client St, New York, NY 10001',
    'TC123456789'
FROM users u 
WHERE u.email = 'client@test.com'
ON CONFLICT DO NOTHING;

-- Insert organization profile for test organization
INSERT INTO organization (user_id, company_name, industry, company_size, website, tax_id, business_registration_number, contact_person, contact_person_role)
SELECT 
    u.id,
    'Test Organization Inc',
    'Software Development',
    '50-200',
    'https://testorg.com',
    'TO987654321',
    'BRN123456789',
    'John Doe',
    'CEO'
FROM users u 
WHERE u.email = 'org@test.com'
ON CONFLICT DO NOTHING;