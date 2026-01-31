-- Add bidder_email column to auction_bids table
-- This stores the organization's email for contact purposes after auction ends
ALTER TABLE auction_bids ADD COLUMN IF NOT EXISTS bidder_email VARCHAR(255);
