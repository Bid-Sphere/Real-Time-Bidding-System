-- ==========================================
-- BIDDING SERVICE - SEED DATA (Optional)
-- ==========================================

-- This file contains sample data for development/testing
-- Comment out or remove in production

-- Note: These are sample bids for testing
-- Make sure the project_ids and bidder_ids match your actual data

-- Sample bids (uncomment if needed for testing)
/*
INSERT INTO bids (id, project_id, bidder_id, bidder_name, bidder_type, proposed_price, estimated_duration, proposal, status, submitted_at)
VALUES 
    ('bid-001', 'project-001', 'org-001', 'TechCorp Solutions', 'ORGANIZATION', 5000.00, 30, 
     'We have extensive experience in building e-commerce platforms with React and Node.js. Our team of 5 developers can deliver this project within 30 days with high quality standards.', 
     'PENDING', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    
    ('bid-002', 'project-001', 'org-002', 'Digital Innovators', 'ORGANIZATION', 4500.00, 35, 
     'Our company specializes in full-stack development. We propose using modern technologies and agile methodology to ensure timely delivery and excellent results.', 
     'PENDING', CURRENT_TIMESTAMP - INTERVAL '1 day'),
    
    ('bid-003', 'project-002', 'org-001', 'TechCorp Solutions', 'ORGANIZATION', 8000.00, 45, 
     'We can develop a comprehensive mobile application for both iOS and Android platforms using React Native. Our portfolio includes similar successful projects.', 
     'ACCEPTED', CURRENT_TIMESTAMP - INTERVAL '3 days');

-- Update accepted bid timestamp
UPDATE bids SET accepted_at = CURRENT_TIMESTAMP - INTERVAL '1 day' WHERE id = 'bid-003';
*/

-- Verification query (uncomment to check data)
-- SELECT * FROM bids ORDER BY submitted_at DESC;
