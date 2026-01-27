-- Fix for requiredSkills bytea column issue
-- This script removes the incorrect bytea column from projects table
-- and ensures the project_skills table exists with correct structure

-- Step 1: Drop the bytea column if it exists in projects table
ALTER TABLE projects DROP COLUMN IF EXISTS required_skills;

-- Step 2: Create project_skills table if it doesn't exist
CREATE TABLE IF NOT EXISTS project_skills (
    project_id VARCHAR(255) NOT NULL,
    skill VARCHAR(50) NOT NULL,
    CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Step 3: Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);

-- Step 4: Optional - Create index for skill searches
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills(skill);

-- Verify the changes
-- Run these queries to confirm:
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'required_skills';
-- SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'project_skills';
