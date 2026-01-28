package com.biddingsystem.bidding.repository;

import com.biddingsystem.bidding.entity.Bid;
import com.biddingsystem.bidding.enums.BidStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BidRepository extends JpaRepository<Bid, String> {
    
    // Check if bid already exists for project and bidder
    boolean existsByProjectIdAndBidderId(String projectId, String bidderId);
    
    // Find bids by project
    Page<Bid> findByProjectId(String projectId, Pageable pageable);
    
    // Find bids by project and status
    Page<Bid> findByProjectIdAndStatus(String projectId, BidStatus status, Pageable pageable);
    
    // Find bids by bidder
    Page<Bid> findByBidderId(String bidderId, Pageable pageable);
    
    // Find bids by bidder and status
    Page<Bid> findByBidderIdAndStatus(String bidderId, BidStatus status, Pageable pageable);
    
    // Count bids by project
    long countByProjectId(String projectId);
    
    // Count bids by project and status
    long countByProjectIdAndStatus(String projectId, BidStatus status);
    
    // Get bid statistics for a project
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.projectId = :projectId")
    Long countTotalBidsByProject(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.projectId = :projectId AND b.status = 'PENDING'")
    Long countPendingBidsByProject(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.projectId = :projectId AND b.status = 'ACCEPTED'")
    Long countAcceptedBidsByProject(@Param("projectId") String projectId);
    
    @Query("SELECT COUNT(b) FROM Bid b WHERE b.projectId = :projectId AND b.status = 'REJECTED'")
    Long countRejectedBidsByProject(@Param("projectId") String projectId);
    
    @Query("SELECT AVG(b.proposedPrice) FROM Bid b WHERE b.projectId = :projectId")
    BigDecimal getAverageBidAmount(@Param("projectId") String projectId);
    
    @Query("SELECT MIN(b.proposedPrice) FROM Bid b WHERE b.projectId = :projectId")
    BigDecimal getLowestBid(@Param("projectId") String projectId);
    
    @Query("SELECT MAX(b.proposedPrice) FROM Bid b WHERE b.projectId = :projectId")
    BigDecimal getHighestBid(@Param("projectId") String projectId);
    
    // Get all bids for a project ordered by price (for ranking calculation)
    @Query("SELECT b FROM Bid b WHERE b.projectId = :projectId ORDER BY b.proposedPrice ASC")
    List<Bid> findByProjectIdOrderByProposedPriceAsc(@Param("projectId") String projectId);
}
