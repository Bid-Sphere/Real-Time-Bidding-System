-- Auction tables
CREATE TABLE IF NOT EXISTS auctions (
    id VARCHAR(255) PRIMARY KEY,
    project_id VARCHAR(255) NOT NULL UNIQUE,
    project_title VARCHAR(200) NOT NULL,
    project_owner_id VARCHAR(100) NOT NULL,
    project_category VARCHAR(20) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'SCHEDULED',
    current_highest_bid DECIMAL(15,2),
    current_highest_bidder_id VARCHAR(100),
    current_highest_bidder_name VARCHAR(200),
    minimum_bid_increment DECIMAL(15,2) NOT NULL DEFAULT 100.00,
    reserve_price DECIMAL(15,2),
    total_bids INTEGER DEFAULT 0,
    winner_bid_id VARCHAR(255),
    winner_bidder_id VARCHAR(100),
    winner_bidder_name VARCHAR(200),
    winning_bid_amount DECIMAL(15,2),
    closed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_auction_status CHECK (status IN ('SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED')),
    CONSTRAINT chk_auction_times CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS auction_bids (
    id VARCHAR(255) PRIMARY KEY,
    auction_id VARCHAR(255) NOT NULL,
    bidder_id VARCHAR(100) NOT NULL,
    bidder_name VARCHAR(200) NOT NULL,
    bid_amount DECIMAL(15,2) NOT NULL,
    proposal TEXT NOT NULL,
    is_winning BOOLEAN DEFAULT FALSE,
    bid_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    organization_id VARCHAR(100) NOT NULL,
    
    CONSTRAINT fk_auction_bid FOREIGN KEY (auction_id) 
        REFERENCES auctions(id) ON DELETE CASCADE,
    CONSTRAINT chk_bid_amount CHECK (bid_amount > 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_auctions_project_id ON auctions(project_id);
CREATE INDEX IF NOT EXISTS idx_auctions_status ON auctions(status);
CREATE INDEX IF NOT EXISTS idx_auctions_end_time ON auctions(end_time);
CREATE INDEX IF NOT EXISTS idx_auction_bids_auction_id ON auction_bids(auction_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_bidder_id ON auction_bids(bidder_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_org_id ON auction_bids(organization_id);
CREATE INDEX IF NOT EXISTS idx_auction_bids_bid_time ON auction_bids(bid_time);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for auctions table
CREATE TRIGGER update_auctions_updated_at 
    BEFORE UPDATE ON auctions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
