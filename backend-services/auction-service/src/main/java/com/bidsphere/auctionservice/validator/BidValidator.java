package com.bidsphere.auctionservice.validator;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.bidsphere.auctionservice.exception.InvalidBidException;
import com.bidsphere.auctionservice.model.Auction;
import com.bidsphere.auctionservice.model.AuctionBid;
import com.bidsphere.auctionservice.repository.interfaces.AuctionBidRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Validator component for bid validation logic.
 * Validates bids according to auction rules and requirements.
 */
@Component
public class BidValidator {

    private static final BigDecimal MIN_PERCENTAGE_DECREMENT = new BigDecimal("0.05"); // 5%
    private static final BigDecimal MIN_ABSOLUTE_DECREMENT = new BigDecimal("100.00"); // $100

    @Autowired
    private AuctionBidRepository auctionBidRepository;

    /**
     * Validates a bid for an auction.
     * 
     * @param auction The auction to validate the bid for
     * @param bidAmount The bid amount to validate
     * @throws InvalidBidException if the bid is invalid
     */
    public void validateBid(Auction auction, BigDecimal bidAmount) {
        // Requirement 12.1: Check auction is LIVE
        validateAuctionStatus(auction);
        
        // Requirement 12.5: Check auction hasn't ended
        validateAuctionEndTime(auction);
        
        // Requirement 12.2: Check bid is positive
        validatePositiveAmount(bidAmount);
        
        // Requirement 12.3: Check bid meets minimum decrement requirement
        validateBidDecrement(auction, bidAmount);
    }

    /**
     * Validates that the auction is in LIVE status.
     * 
     * @param auction The auction to validate
     * @throws InvalidBidException if the auction is not LIVE
     */
    public void validateAuctionStatus(Auction auction) {
        // Note: The existing codebase uses ACTIVE instead of LIVE
        // We'll check for ACTIVE status as that's the equivalent in the current system
        if (auction.getStatus() != AuctionStatus.ACTIVE) {
            throw new InvalidBidException("Auction is not live. Current status: " + auction.getStatus());
        }
    }

    /**
     * Validates that the bid amount is positive.
     * 
     * @param bidAmount The bid amount to validate
     * @throws InvalidBidException if the bid amount is not positive
     */
    public void validatePositiveAmount(BigDecimal bidAmount) {
        if (bidAmount == null || bidAmount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidBidException("Bid amount must be positive");
        }
    }

    /**
     * Validates that the auction has not ended.
     * 
     * @param auction The auction to validate
     * @throws InvalidBidException if the auction has ended
     */
    public void validateAuctionEndTime(Auction auction) {
        if (auction.getEndTime() != null && LocalDateTime.now().isAfter(auction.getEndTime())) {
            throw new InvalidBidException("Auction has ended");
        }
    }

    /**
     * Validates that the bid meets the minimum decrement requirement.
     * For reverse auctions, bids must be at least 5% lower OR $100 lower (whichever is greater)
     * than the current lowest bid.
     * 
     * @param auction The auction to validate the bid for
     * @param bidAmount The bid amount to validate
     * @throws InvalidBidException if the bid does not meet the minimum decrement requirement
     */
    public void validateBidDecrement(Auction auction, BigDecimal bidAmount) {
        // Get current lowest bid for this auction
        BigDecimal currentLowest = getCurrentLowestBid(auction.getId());
        
        if (currentLowest != null) {
            // Calculate minimum required decrement
            BigDecimal percentageDecrement = currentLowest.multiply(MIN_PERCENTAGE_DECREMENT);
            BigDecimal requiredDecrement = percentageDecrement.max(MIN_ABSOLUTE_DECREMENT);
            BigDecimal maxAllowedBid = currentLowest.subtract(requiredDecrement);
            
            // Check bid is lower enough (for reverse auction)
            if (bidAmount.compareTo(maxAllowedBid) > 0) {
                throw new InvalidBidException(
                    String.format("Bid must be at least %s lower than current lowest bid of %s. Maximum allowed bid: %s",
                                  requiredDecrement.toPlainString(), 
                                  currentLowest.toPlainString(),
                                  maxAllowedBid.toPlainString())
                );
            }
        }
    }

    /**
     * Gets the current lowest ACCEPTED bid amount for an auction.
     * In a reverse auction, we're looking for the minimum ACCEPTED bid amount.
     * REJECTED bids are not considered.
     * 
     * @param auctionId The auction ID
     * @return The current lowest ACCEPTED bid amount, or null if no ACCEPTED bids exist
     */
    private BigDecimal getCurrentLowestBid(String auctionId) {
        // Find the lowest ACCEPTED bid for the auction
        Optional<AuctionBid> lowestAcceptedBid = auctionBidRepository.findAcceptedBidForAuction(auctionId);
        
        if (lowestAcceptedBid.isPresent()) {
            return lowestAcceptedBid.get().getBidAmount();
        }
        
        return null;
    }

    /**
     * Calculates the minimum next bid amount based on the current lowest bid.
     * 
     * @param currentLowest The current lowest bid amount
     * @return The minimum next bid amount
     */
    public BigDecimal calculateMinimumNextBid(BigDecimal currentLowest) {
        if (currentLowest == null) {
            return null;
        }
        
        BigDecimal percentageDecrement = currentLowest.multiply(MIN_PERCENTAGE_DECREMENT);
        BigDecimal requiredDecrement = percentageDecrement.max(MIN_ABSOLUTE_DECREMENT);
        return currentLowest.subtract(requiredDecrement);
    }
}
