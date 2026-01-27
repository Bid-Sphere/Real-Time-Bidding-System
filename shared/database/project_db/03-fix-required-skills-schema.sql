-- ================================
-- Fix for requiredSkills Schema Mismatch
-- ================================
-- This migration fixes the issue where Hibernate expects a separate project_skills table
-- but finds a bytea column in the projects table instead.
--
-- Problem: The projects table has a 'required_skills' column with bytea type from a previous
-- version or manual creation, causing runtime errors when queries use string functions.
--
-- Solution: Remove the incorrect bytea column and ensure the project_skills table exists
-- with the correct structure to match the JPA @ElementCollection mapping.
-- ================================

-- Step 1: Drop the incorrect bytea column if it exists in projects table
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'required_skills'
    ) THEN
        ALTER TABLE projects DROP COLUMN required_skills;
        RAISE NOTICE 'Dropped required_skills column from projects table';
    ELSE
        RAISE NOTICE 'Column required_skills does not exist in projects table';
    END IF;
END $$;

-- Step 2: Ensure project_skills table exists with correct structure
CREATE TABLE IF NOT EXISTS project_skills (
    project_id VARCHAR(255) NOT NULL,
    skill VARCHAR(50) NOT NULL,
    CONSTRAINT fk_project_skills_project FOREIGN KEY (project_id) 
        REFERENCES projects(id) ON DELETE CASCADE
);

-- Step 3: Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_project_skills_project_id ON project_skills(project_id);
CREATE INDEX IF NOT EXISTS idx_project_skills_skill ON project_skills(skill);

-- Step 4: Verify the schema is correct
DO $$ 
DECLARE
    projects_col_count INTEGER;
    skills_table_exists BOOLEAN;
BEGIN
    -- Check if required_skills column still exists in projects table
    SELECT COUNT(*) INTO projects_col_count
    FROM information_schema.columns 
    WHERE table_name = 'projects' AND column_name = 'required_skills';
    
    -- Check if project_skills table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'project_skills'
    ) INTO skills_table_exists;
    
    IF projects_col_count = 0 AND skills_table_exists THEN
        RAISE NOTICE '✓ Schema fix successful: required_skills column removed, project_skills table exists';
    ELSE
        RAISE WARNING '⚠ Schema verification failed. Please check manually.';
    END IF;
END $$;

-- Optional: Display current schema for verification
SELECT 
    'projects' as table_name,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
ORDER BY ordinal_position;

SELECT 
    'project_skills' as table_name,
    column_name, 
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'project_skills' 
ORDER BY ordinal_position;
