-- Add client contact info columns to bids table
ALTER TABLE bids 
ADD COLUMN IF NOT EXISTS client_email VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_phone VARCHAR(50);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bids_client_email ON bids(client_email);

COMMENT ON COLUMN bids.client_email IS 'Client email for contact (populated when bid is submitted)';
COMMENT ON COLUMN bids.client_phone IS 'Client phone for contact (populated when bid is submitted)';
