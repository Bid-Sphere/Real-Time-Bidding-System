-- ================================
-- MIGRATION: Remove company_size from client table
-- ================================

-- Remove company_size column from client table if it exists
ALTER TABLE client DROP COLUMN IF EXISTS company_size;

-- Add comment to track this migration
COMMENT ON TABLE client IS 'Client profiles table - company_size removed in migration 03';