-- Trigger to automatically set is_winning flag when auction ends
-- This ensures the winning bid is marked correctly

-- Function to update is_winning flag
CREATE OR REPLACE FUNCTION update_winning_bid_flag()
RETURNS TRIGGER AS $$
BEGIN
    -- If winner_bid_id is set (auction ended with a winner)
    IF NEW.winner_bid_id IS NOT NULL THEN
        -- Set is_winning = false for all bids in this auction
        UPDATE auction_bids 
        SET is_winning = false 
        WHERE auction_id = NEW.id;
        
        -- Set is_winning = true for the winning bid
        UPDATE auction_bids 
        SET is_winning = true 
        WHERE id = NEW.winner_bid_id;
        
        RAISE NOTICE 'Updated winning bid flag for auction % - winner bid: %', NEW.id, NEW.winner_bid_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after auction update
DROP TRIGGER IF EXISTS trigger_update_winning_bid ON auctions;
CREATE TRIGGER trigger_update_winning_bid
    AFTER UPDATE OF winner_bid_id ON auctions
    FOR EACH ROW
    WHEN (NEW.winner_bid_id IS NOT NULL AND (OLD.winner_bid_id IS NULL OR OLD.winner_bid_id != NEW.winner_bid_id))
    EXECUTE FUNCTION update_winning_bid_flag();

-- Update existing ended auctions to set the correct is_winning flag
UPDATE auction_bids ab
SET is_winning = true
FROM auctions a
WHERE ab.auction_id = a.id
  AND ab.id = a.winner_bid_id
  AND a.status = 'ENDED'
  AND a.winner_bid_id IS NOT NULL;

-- Set is_winning = false for all other bids in ended auctions
UPDATE auction_bids ab
SET is_winning = false
FROM auctions a
WHERE ab.auction_id = a.id
  AND ab.id != a.winner_bid_id
  AND a.status = 'ENDED'
  AND a.winner_bid_id IS NOT NULL;

COMMENT ON FUNCTION update_winning_bid_flag() IS 'Automatically updates is_winning flag when auction winner is determined';
COMMENT ON TRIGGER trigger_update_winning_bid ON auctions IS 'Triggers winning bid flag update when winner_bid_id is set';
