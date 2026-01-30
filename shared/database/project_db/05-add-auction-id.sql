-- Add auction_id column to projects table
-- This links a LIVE_AUCTION project to its corresponding auction in the auction-service

-- First drop if exists (in case it was created as BIGINT)
ALTER TABLE projects DROP COLUMN IF EXISTS auction_id;

-- Add as VARCHAR to store UUID
ALTER TABLE projects 
ADD COLUMN auction_id VARCHAR(255);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auction_id ON projects(auction_id);

-- Add comment
COMMENT ON COLUMN projects.auction_id IS 'Foreign key reference to auction in auction-service (for LIVE_AUCTION projects)';
