-- Add auction_id column to projects table
-- This links a LIVE_AUCTION project to its corresponding auction in the auction-service

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS auction_id BIGINT;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_auction_id ON projects(auction_id);

-- Add comment
COMMENT ON COLUMN projects.auction_id IS 'Foreign key reference to auction in auction-service (for LIVE_AUCTION projects)';
