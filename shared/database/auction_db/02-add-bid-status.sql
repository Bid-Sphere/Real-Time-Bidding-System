-- Migration: Add bid_status column and indexes to auction_bids table
-- This migration adds support for tracking bid status (PENDING, ACCEPTED, REJECTED)
-- and improves query performance with targeted indexes

-- Add bid_status column with default value PENDING
ALTER TABLE auction_bids 
ADD COLUMN bid_status VARCHAR(20) NOT NULL DEFAULT 'PENDING';

-- Add constraint to ensure valid status values
ALTER TABLE auction_bids 
ADD CONSTRAINT chk_bid_status 
CHECK (bid_status IN ('PENDING', 'ACCEPTED', 'REJECTED'));

-- Add composite index for filtering bids by auction and status
-- This optimizes queries like "get all PENDING bids for an auction"
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_status 
ON auction_bids(auction_id, bid_status);

-- Add composite index for ordering bids by time within an auction
-- This optimizes queries like "get recent bids for an auction"
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_time 
ON auction_bids(auction_id, bid_time DESC);

-- Add comment to document the purpose of the new column
COMMENT ON COLUMN auction_bids.bid_status IS 'Status of the bid: PENDING (awaiting review), ACCEPTED (current winner), REJECTED (declined by client)';
