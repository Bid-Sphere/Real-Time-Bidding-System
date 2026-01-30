package com.bidsphere.auctionservice.service.impl;

import com.bidsphere.auctionservice.dto.response.AuctionStatusChangeDTO;
import com.bidsphere.auctionservice.dto.response.BidDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

@Service
@Slf4j
public class RealtimeNotificationService {

    private final RestTemplate restTemplate;
    private final String realtimeServiceUrl;

    public RealtimeNotificationService(
            RestTemplate restTemplate,
            @Value("${services.realtime-service.url:http://localhost:8084}") String realtimeServiceUrl) {
        this.restTemplate = restTemplate;
        this.realtimeServiceUrl = realtimeServiceUrl;
    }

    /**
     * Notify realtime service about a newly submitted bid
     * @param bid The bid that was submitted
     */
    public void notifyBidSubmitted(BidDTO bid) {
        try {
            String url = realtimeServiceUrl + "/api/notifications/bid-submitted";
            restTemplate.postForEntity(url, bid, Void.class);
            log.info("Successfully notified realtime service about bid submission: bidId={}, auctionId={}", 
                    bid.getId(), bid.getAuctionId());
        } catch (RestClientException e) {
            log.error("Failed to notify realtime service about bid submission: bidId={}, auctionId={}, error={}", 
                    bid.getId(), bid.getAuctionId(), e.getMessage());
            // Don't throw exception - notification failure shouldn't block the main operation
        }
    }

    /**
     * Notify realtime service about a bid being accepted
     * @param bid The bid that was accepted
     */
    public void notifyBidAccepted(BidDTO bid) {
        try {
            String url = realtimeServiceUrl + "/api/notifications/bid-accepted";
            restTemplate.postForEntity(url, bid, Void.class);
            log.info("Successfully notified realtime service about bid acceptance: bidId={}, auctionId={}", 
                    bid.getId(), bid.getAuctionId());
        } catch (RestClientException e) {
            log.error("Failed to notify realtime service about bid acceptance: bidId={}, auctionId={}, error={}", 
                    bid.getId(), bid.getAuctionId(), e.getMessage());
            // Don't throw exception - notification failure shouldn't block the main operation
        }
    }

    /**
     * Notify realtime service about a bid being rejected
     * @param bid The bid that was rejected
     */
    public void notifyBidRejected(BidDTO bid) {
        try {
            String url = realtimeServiceUrl + "/api/notifications/bid-rejected";
            restTemplate.postForEntity(url, bid, Void.class);
            log.info("Successfully notified realtime service about bid rejection: bidId={}, auctionId={}", 
                    bid.getId(), bid.getAuctionId());
        } catch (RestClientException e) {
            log.error("Failed to notify realtime service about bid rejection: bidId={}, auctionId={}, error={}", 
                    bid.getId(), bid.getAuctionId(), e.getMessage());
            // Don't throw exception - notification failure shouldn't block the main operation
        }
    }

    /**
     * Notify realtime service about an auction status change
     * @param statusChange The auction status change details
     */
    public void notifyAuctionStatusChange(AuctionStatusChangeDTO statusChange) {
        try {
            String url = realtimeServiceUrl + "/api/notifications/auction-status-changed";
            restTemplate.postForEntity(url, statusChange, Void.class);
            log.info("Successfully notified realtime service about auction status change: auctionId={}, oldStatus={}, newStatus={}", 
                    statusChange.getAuctionId(), statusChange.getOldStatus(), statusChange.getNewStatus());
        } catch (RestClientException e) {
            log.error("Failed to notify realtime service about auction status change: auctionId={}, error={}", 
                    statusChange.getAuctionId(), e.getMessage());
            // Don't throw exception - notification failure shouldn't block the main operation
        }
    }
}
