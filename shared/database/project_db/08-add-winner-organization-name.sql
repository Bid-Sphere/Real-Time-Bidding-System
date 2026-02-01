-- Add winner_organization_name column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS winner_organization_name VARCHAR(255);
