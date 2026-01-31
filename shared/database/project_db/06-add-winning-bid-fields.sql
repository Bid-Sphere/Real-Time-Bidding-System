-- Add winning bid fields to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS winning_bid_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS winner_organization_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS winning_amount DECIMAL(12, 2);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_winning_bid_id ON projects(winning_bid_id);
CREATE INDEX IF NOT EXISTS idx_winner_organization_id ON projects(winner_organization_id);
