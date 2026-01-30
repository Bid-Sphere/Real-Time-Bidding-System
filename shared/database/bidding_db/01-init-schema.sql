-- ==========================================
-- BIDDING SERVICE DATABASE SCHEMA
-- ==========================================

-- Create bids table
CREATE TABLE IF NOT EXISTS bids (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL,
    client_id VARCHAR(255) NOT NULL,
    bidder_id VARCHAR(255) NOT NULL,
    bidder_name VARCHAR(255) NOT NULL,
    bidder_type VARCHAR(50) NOT NULL DEFAULT 'ORGANIZATION',
    proposed_price DECIMAL(12,2) NOT NULL,
    estimated_duration INTEGER NOT NULL,
    proposal TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    accepted_at TIMESTAMP,
    rejected_at TIMESTAMP,
    rejection_reason TEXT,
    is_withdrawn BOOLEAN NOT NULL DEFAULT FALSE,
    withdrawn_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_proposed_price CHECK (proposed_price > 0),
    CONSTRAINT chk_estimated_duration CHECK (estimated_duration > 0),
    CONSTRAINT chk_status CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    CONSTRAINT chk_bidder_type CHECK (bidder_type IN ('ORGANIZATION', 'INDIVIDUAL'))
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bids_project_id ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_client_id ON bids(client_id);
CREATE INDEX IF NOT EXISTS idx_bids_bidder_id ON bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_submitted_at ON bids(submitted_at);
CREATE INDEX IF NOT EXISTS idx_bids_project_bidder ON bids(project_id, bidder_id);

-- Create bid_attachments table (for future use)
CREATE TABLE IF NOT EXISTS bid_attachments (
    id VARCHAR(255) PRIMARY KEY,
    bid_id VARCHAR(255) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    CONSTRAINT fk_bid_attachments_bid FOREIGN KEY (bid_id) 
        REFERENCES bids(id) ON DELETE CASCADE
);

-- Create index for bid_attachments
CREATE INDEX IF NOT EXISTS idx_bid_attachments_bid_id ON bid_attachments(bid_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE bids IS 'Stores all bids submitted by organizations on projects';
COMMENT ON TABLE bid_attachments IS 'Stores file attachments for bids (future feature)';
COMMENT ON COLUMN bids.status IS 'Bid status: PENDING, ACCEPTED, REJECTED, WITHDRAWN';
COMMENT ON COLUMN bids.bidder_type IS 'Type of bidder: ORGANIZATION or INDIVIDUAL';
