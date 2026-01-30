-- ==========================================
-- ADD CLIENT_ID COLUMN TO BIDS TABLE
-- Migration script for existing databases
-- ==========================================

-- Add client_id column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bids' AND column_name = 'client_id'
    ) THEN
        ALTER TABLE bids ADD COLUMN client_id VARCHAR(255);
        
        -- Create index for client_id
        CREATE INDEX IF NOT EXISTS idx_bids_client_id ON bids(client_id);
        
        RAISE NOTICE 'Column client_id added successfully';
    ELSE
        RAISE NOTICE 'Column client_id already exists';
    END IF;
END $$;

-- Note: For existing bids, client_id will be NULL
-- These bids should be handled by the application or manually updated
