package com.biddingsystem.bidding.service;

import com.biddingsystem.bidding.dto.request.RejectBidRequest;
import com.biddingsystem.bidding.dto.request.SubmitBidRequest;
import com.biddingsystem.bidding.dto.request.UpdateBidRequest;
import com.biddingsystem.bidding.dto.response.BidActionResponse;
import com.biddingsystem.bidding.dto.response.BidResponse;
import com.biddingsystem.bidding.dto.response.BidStatsResponse;
import com.biddingsystem.bidding.enums.BidStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BidService {
    
    // Submit a new bid
    BidResponse submitBid(SubmitBidRequest request, String bidderId, String bidderName);
    
    // Get bids for a project
    Page<BidResponse> getBidsForProject(String projectId, BidStatus status, String sort, 
                                        Pageable pageable, String userId, String userRole);
    
    // Get my bids (organization)
    Page<BidResponse> getMyBids(String bidderId, BidStatus status, Pageable pageable);
    
    // Get single bid by ID
    BidResponse getBidById(String bidId, String userId, String userRole);
    
    // Update bid
    BidResponse updateBid(String bidId, UpdateBidRequest request, String bidderId);
    
    // Withdraw bid
    void withdrawBid(String bidId, String bidderId);
    
    // Accept bid (client)
    BidActionResponse acceptBid(String bidId, String clientId);
    
    // Reject bid (client)
    void rejectBid(String bidId, RejectBidRequest request, String clientId);
    
    // Get bid statistics for a project
    BidStatsResponse getBidStats(String projectId);
}
