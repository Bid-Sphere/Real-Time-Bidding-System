package com.bidsphere.auctionservice.validator;

import com.bidsphere.auctionservice.constant.AuctionStatus;
import com.bidsphere.auctionservice.exception.InvalidBidException;
import com.bidsphere.auctionservice.model.Auction;
import com.bidsphere.auctionservice.model.AuctionBid;
import com.bidsphere.auctionservice.repository.interfaces.AuctionBidRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BidValidatorTest {

    @Mock
    private AuctionBidRepository auctionBidRepository;

    @InjectMocks
    private BidValidator bidValidator;

    private Auction activeAuction;

    @BeforeEach
    void setUp() {
        activeAuction = new Auction();
        activeAuction.setId("auction-1");
        activeAuction.setStatus(AuctionStatus.ACTIVE);
        activeAuction.setStartTime(LocalDateTime.now().minusHours(1));
        activeAuction.setEndTime(LocalDateTime.now().plusHours(1));
    }

    @Test
    void validateAuctionStatus_shouldPassForActiveAuction() {
        assertDoesNotThrow(() -> bidValidator.validateAuctionStatus(activeAuction));
    }

    @Test
    void validateAuctionStatus_shouldThrowForScheduledAuction() {
        activeAuction.setStatus(AuctionStatus.SCHEDULED);
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateAuctionStatus(activeAuction)
        );
        
        assertTrue(exception.getMessage().contains("not live"));
    }

    @Test
    void validateAuctionStatus_shouldThrowForEndedAuction() {
        activeAuction.setStatus(AuctionStatus.ENDED);
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateAuctionStatus(activeAuction)
        );
        
        assertTrue(exception.getMessage().contains("not live"));
    }

    @Test
    void validatePositiveAmount_shouldPassForPositiveAmount() {
        BigDecimal positiveAmount = new BigDecimal("1000.00");
        assertDoesNotThrow(() -> bidValidator.validatePositiveAmount(positiveAmount));
    }

    @Test
    void validatePositiveAmount_shouldThrowForZeroAmount() {
        BigDecimal zeroAmount = BigDecimal.ZERO;
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validatePositiveAmount(zeroAmount)
        );
        
        assertTrue(exception.getMessage().contains("must be positive"));
    }

    @Test
    void validatePositiveAmount_shouldThrowForNegativeAmount() {
        BigDecimal negativeAmount = new BigDecimal("-100.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validatePositiveAmount(negativeAmount)
        );
        
        assertTrue(exception.getMessage().contains("must be positive"));
    }

    @Test
    void validatePositiveAmount_shouldThrowForNullAmount() {
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validatePositiveAmount(null)
        );
        
        assertTrue(exception.getMessage().contains("must be positive"));
    }

    @Test
    void validateAuctionEndTime_shouldPassForFutureEndTime() {
        activeAuction.setEndTime(LocalDateTime.now().plusHours(2));
        assertDoesNotThrow(() -> bidValidator.validateAuctionEndTime(activeAuction));
    }

    @Test
    void validateAuctionEndTime_shouldThrowForPastEndTime() {
        activeAuction.setEndTime(LocalDateTime.now().minusHours(1));
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateAuctionEndTime(activeAuction)
        );
        
        assertTrue(exception.getMessage().contains("ended"));
    }

    @Test
    void validateBidDecrement_shouldPassWhenNoPreviousBids() {
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.empty());
        
        BigDecimal bidAmount = new BigDecimal("5000.00");
        assertDoesNotThrow(() -> bidValidator.validateBidDecrement(activeAuction, bidAmount));
    }

    @Test
    void validateBidDecrement_shouldPassForValidDecrement_AbsoluteMinimum() {
        // Current lowest bid is $1000
        AuctionBid currentBid = new AuctionBid();
        currentBid.setBidAmount(new BigDecimal("1000.00"));
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.of(currentBid));
        
        // New bid is $899 (more than $100 lower)
        BigDecimal newBidAmount = new BigDecimal("899.00");
        assertDoesNotThrow(() -> bidValidator.validateBidDecrement(activeAuction, newBidAmount));
    }

    @Test
    void validateBidDecrement_shouldPassForValidDecrement_PercentageMinimum() {
        // Current lowest bid is $10000
        AuctionBid currentBid = new AuctionBid();
        currentBid.setBidAmount(new BigDecimal("10000.00"));
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.of(currentBid));
        
        // New bid is $9400 (5% lower = $500, which is greater than $100)
        BigDecimal newBidAmount = new BigDecimal("9400.00");
        assertDoesNotThrow(() -> bidValidator.validateBidDecrement(activeAuction, newBidAmount));
    }

    @Test
    void validateBidDecrement_shouldThrowForInsufficientDecrement() {
        // Current lowest bid is $1000
        AuctionBid currentBid = new AuctionBid();
        currentBid.setBidAmount(new BigDecimal("1000.00"));
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.of(currentBid));
        
        // New bid is $950 (only $50 lower, needs to be at least $100 lower)
        BigDecimal newBidAmount = new BigDecimal("950.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateBidDecrement(activeAuction, newBidAmount)
        );
        
        assertTrue(exception.getMessage().contains("at least"));
        assertTrue(exception.getMessage().contains("100"));
    }

    @Test
    void validateBidDecrement_shouldThrowForHigherBid() {
        // Current lowest bid is $1000
        AuctionBid currentBid = new AuctionBid();
        currentBid.setBidAmount(new BigDecimal("1000.00"));
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.of(currentBid));
        
        // New bid is $1100 (higher than current, invalid for reverse auction)
        BigDecimal newBidAmount = new BigDecimal("1100.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateBidDecrement(activeAuction, newBidAmount)
        );
        
        assertTrue(exception.getMessage().contains("at least"));
    }

    @Test
    void validateBid_shouldPassForValidBid() {
        when(auctionBidRepository.findHighestBidForAuction("auction-1"))
            .thenReturn(Optional.empty());
        
        BigDecimal validBidAmount = new BigDecimal("5000.00");
        assertDoesNotThrow(() -> bidValidator.validateBid(activeAuction, validBidAmount));
    }

    @Test
    void validateBid_shouldThrowForInactiveAuction() {
        activeAuction.setStatus(AuctionStatus.SCHEDULED);
        BigDecimal bidAmount = new BigDecimal("5000.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateBid(activeAuction, bidAmount)
        );
        
        assertTrue(exception.getMessage().contains("not live"));
    }

    @Test
    void validateBid_shouldThrowForExpiredAuction() {
        activeAuction.setEndTime(LocalDateTime.now().minusHours(1));
        BigDecimal bidAmount = new BigDecimal("5000.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateBid(activeAuction, bidAmount)
        );
        
        assertTrue(exception.getMessage().contains("ended"));
    }

    @Test
    void validateBid_shouldThrowForNegativeAmount() {
        BigDecimal negativeAmount = new BigDecimal("-100.00");
        
        InvalidBidException exception = assertThrows(
            InvalidBidException.class,
            () -> bidValidator.validateBid(activeAuction, negativeAmount)
        );
        
        assertTrue(exception.getMessage().contains("must be positive"));
    }

    @Test
    void calculateMinimumNextBid_shouldReturnNullForNullInput() {
        assertNull(bidValidator.calculateMinimumNextBid(null));
    }

    @Test
    void calculateMinimumNextBid_shouldCalculateCorrectly_AbsoluteMinimum() {
        // For $1000, 5% = $50, but minimum is $100
        // So minimum next bid should be $1000 - $100 = $900
        BigDecimal currentLowest = new BigDecimal("1000.00");
        BigDecimal expected = new BigDecimal("900.00");
        
        BigDecimal result = bidValidator.calculateMinimumNextBid(currentLowest);
        
        assertEquals(0, expected.compareTo(result));
    }

    @Test
    void calculateMinimumNextBid_shouldCalculateCorrectly_PercentageMinimum() {
        // For $10000, 5% = $500, which is greater than $100
        // So minimum next bid should be $10000 - $500 = $9500
        BigDecimal currentLowest = new BigDecimal("10000.00");
        BigDecimal expected = new BigDecimal("9500.00");
        
        BigDecimal result = bidValidator.calculateMinimumNextBid(currentLowest);
        
        assertEquals(0, expected.compareTo(result));
    }
}
