package com.bidsphere.auctionservice.repository.interfaces;

import com.bidsphere.auctionservice.constant.BidStatus;
import com.bidsphere.auctionservice.model.AuctionBid;
import java.util.List;
import java.util.Optional;

public interface AuctionBidRepository
{
    AuctionBid save(AuctionBid bid);
    Optional<AuctionBid> findById(String id);
    List<AuctionBid> findByAuctionId(String auctionId, int limit, int offset);
    List<AuctionBid> findByAuctionIdOrderByAmountDesc(String auctionId);
    Optional<AuctionBid> findHighestBidForAuction(String auctionId);
    Optional<AuctionBid> findLowestBidForAuction(String auctionId);
    List<AuctionBid> findByBidderId(String bidderId, int limit, int offset);
    List<AuctionBid> findByOrganizationId(String organizationId, int limit, int offset);
    int countByAuctionId(String auctionId);
    int countUniqueBiddersForAuction(String auctionId);
    Double calculateAverageBidForAuction(String auctionId);
    int updateWinningStatus(String bidId, boolean isWinning);
    Optional<AuctionBid> findAcceptedBidForAuction(String auctionId);
    int updateBidStatus(String bidId, BidStatus status);
    List<AuctionBid> findByAuctionIdAndStatus(String auctionId, BidStatus status);
    List<AuctionBid> findRecentBidsByAuctionId(String auctionId, int limit);
}