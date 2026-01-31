-- Make proposal column nullable in auction_bids table
-- This allows organizations to submit bids without a proposal during live auctions
ALTER TABLE auction_bids ALTER COLUMN proposal DROP NOT NULL;
