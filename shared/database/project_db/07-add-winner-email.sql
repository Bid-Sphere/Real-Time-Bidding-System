-- Add winner_email column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS winner_email VARCHAR(255);
